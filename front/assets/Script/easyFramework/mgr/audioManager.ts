import { assert, AudioClip, AudioSource, clamp01, Component, director } from "cc";
import { Const } from "../../config/Const";
import { GTypeStrNum } from "../../config/global";
import { UtilPub } from "../utils/UtilPub";
import { GameStorage } from "./gameStorage";
import { ResourceLoaderService } from "./resourceUtil";

export class AudioPlaybackService extends Component {
    private static _instance: AudioPlaybackService;
    private static _audioSource?: AudioSource;
    private static _audioSourceOne?: AudioSource = new AudioSource();


    effectCache: GTypeStrNum = {}
    effectConcurrency: number[] = []

    static get instance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new AudioPlaybackService();
        return this._instance;
    }
    curMusic: string = ""
    soundVolume: number = 1;
    clips: { [key: string]: AudioClip } = {}


    init(audioSource: AudioSource) {
        this.soundVolume = this.getConfiguration(false) ? 1 : 0;

        AudioPlaybackService._audioSource = audioSource;













    }

    initMusic() {
        let stat = GameStorage.getString('music', 'true');

        if (stat == 'true') {
            AudioPlaybackService.instance.openMusic()
        } else {
            AudioPlaybackService.instance.closeMusic()
        }

        let stat2 = GameStorage.getString('sound', 'true');
        if (stat2 == 'true') {
            AudioPlaybackService.instance.openSound()
        } else {
            AudioPlaybackService.instance.closeSound()
        }
    }

    check() {
        let now = new Date().getTime()
        let newArr = []
        for (let i = 0; i < this.effectConcurrency.length; i++) {

            if (this.effectConcurrency[i] - now > 0) {

                newArr.push(this.effectConcurrency[i])
            }
        }




        this.effectConcurrency = newArr

    }


    getConfiguration(isMusic: boolean) {
        let state;
        if (isMusic) {
            state = GameStorage.getString(Const.CacheDataKey.music);
        } else {
            state = GameStorage.getString(Const.CacheDataKey.sound);
        }



        return state === undefined || state === 'true';
    }

    playMusicInit(loop: boolean) {
        const audioSource = AudioPlaybackService._audioSource!;
        assert(audioSource, 'AudioManager not inited!');
        audioSource.loop = loop;


        UtilPub.log("---AudioSource.maxAudioChannel----", AudioSource.maxAudioChannel)
        if (!audioSource.playing) {
            audioSource.play();
        }
    }






    playMusic(loop: boolean, audioName: string = "bgm") {

        const audioSource = AudioPlaybackService._audioSource!;
        assert(audioSource, 'AudioManager not inited!');
        let name = audioName.split("|")[1]

        if (this.curMusic != name) {
            this.curMusic = name
        } else {
            if (audioSource.state == 1) {
                UtilPub.warn("--------跳过重复播放---", this.curMusic, name)
                return
            }
        }

        let playFn = (clip: AudioClip) => {
            this.clips[name] = clip
            audioSource.stop()
            audioSource.clip = clip
            audioSource.loop = loop;
            audioSource.volume = 0.3;
            if (!audioSource.playing) {
                audioSource.play();
                if (this.isOpenMusic() == false) {
                    audioSource.stop()
                }
                audioSource.volume = 0.6
            }
        }


        if (this.clips[name]) {
            playFn(this.clips[name])
        } else {

            ResourceLoaderService.loadResWithBundle(audioName, AudioClip, (err, clip) => {


                if (err) {

                    return;
                }
                if (clip) {
                    playFn(clip)
                }
            })
        }

    }





    playSound(audioName: string) {
        if (director.getScene()!.name == "hotupdate") {
            return;
        }
        if (this.isOpenSound() == false) return



        // @ts-ignore
        if (window.wx) {
            //@ts-ignore
            const sys = window.wx.getSystemInfoSync();
            const isIOS = sys.system.indexOf('iOS') >= 0;
            if (isIOS) {

            } else {
                UtilPub.warn("------安卓用户-声音特殊处理")
                AudioPlaybackService._audioSourceOne!.stop()
                AudioPlaybackService._audioSourceOne = new AudioSource()
            }
        } else {

        }


        let name = audioName.split("|")[1]
        if (this.clips[name]) {
            this.playSoundCtl(name, this.clips[name])
        } else {

            ResourceLoaderService.loadResWithBundle(audioName, AudioClip, (err, clip) => {


                if (err) {

                    return;
                }
                if (clip) {
                    this.clips[name] = clip
                    this.playSoundCtl(name, this.clips[name])
                }
            })

        }

    }

    playOneShotFake(clip: AudioClip) {
        if (this.isOpenSound()) {
            if (Const.AudioTime[clip.name] != null) {
                this.check()
                if (this.effectConcurrency.length > Const.AudioCnt) { return }
                let num = new Date().getTime() + Const.AudioTime[clip.name]

                this.effectConcurrency.push(num)
                AudioPlaybackService._audioSourceOne!.playOneShot(clip, 1);
            } else {
                AudioPlaybackService._audioSourceOne!.playOneShot(clip, 1);
            }
        }











    }

    playSoundCtl(name: string, clip: AudioClip) {

        if (this.effectCache[name] == undefined) {
            this.effectCache[name] = new Date().getTime()
            this.playOneShotFake(clip)
        } else {
            let diff = new Date().getTime() - this.effectCache[name]
            if (diff > 88) {
                this.effectCache[name] = new Date().getTime()
                this.playOneShotFake(clip)
            }
        }
    }

    setMusicVolume(flag: number) {
        const audioSource = AudioPlaybackService._audioSource!;
        assert(audioSource, 'AudioManager not inited!');

        flag = clamp01(flag);
        audioSource.volume = flag;
    }

    setSoundVolume(flag: number) {
        this.soundVolume = flag;
    }

    openMusic() {
        const audioSource = AudioPlaybackService._audioSource!;
        audioSource.play()
        GameStorage.setString(Const.CacheDataKey.music, 'true');
    }

    closeMusic() {
        const audioSource = AudioPlaybackService._audioSource!;
        audioSource.stop()
        GameStorage.setString(Const.CacheDataKey.music, 'false');
    }

    clickMusic() {
        if (this.isOpenMusic()) {
            this.closeMusic()
        } else {
            this.openMusic()
        }
    }

    isOpenMusic() {
        return GameStorage.getString(Const.CacheDataKey.music, 'true') == "true";
    }

    openSound() {
        GameStorage.setString(Const.CacheDataKey.sound, 'true');
    }

    isOpenSound() {
        return GameStorage.getString(Const.CacheDataKey.sound, 'true') == "true";
    }

    closeSound() {
        GameStorage.setString(Const.CacheDataKey.sound, 'false');
    }


    clickSound() {
        if (this.isOpenSound()) {
            this.closeSound()
        } else {
            this.openSound()
        }
    }
    pauseMusic() {
        const audioSource = AudioPlaybackService._audioSource!;
        audioSource.stop()

    }

    resumeMusic() {
        const audioSource = AudioPlaybackService._audioSource!;
        audioSource.play()


    }

}
