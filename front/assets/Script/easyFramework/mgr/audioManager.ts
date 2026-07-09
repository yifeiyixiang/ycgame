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
        this.soundVolume = this._fn_gk(false) ? 1 : 0;

        AudioPlaybackService._audioSource = audioSource;













    }

    _fn_oj() {
        let stat = GameStorage._fn_lq('music', 'true');

        if (stat == 'true') {
            AudioPlaybackService.instance._fn_wg()
        } else {
            AudioPlaybackService.instance._fn_dg()
        }

        let stat2 = GameStorage._fn_lq('sound', 'true');
        if (stat2 == 'true') {
            AudioPlaybackService.instance._fn_wi()
        } else {
            AudioPlaybackService.instance._fn_dh()
        }
    }

    _fn_bc() {
        let now = new Date().getTime()
        let newArr = []
        for (let i = 0; i < this.effectConcurrency.length; i++) {

            if (this.effectConcurrency[i] - now > 0) {

                newArr.push(this.effectConcurrency[i])
            }
        }




        this.effectConcurrency = newArr

    }


    _fn_gk(isMusic: boolean) {
        let state;
        if (isMusic) {
            state = GameStorage._fn_lq(Const.CacheDataKey.music);
        } else {
            state = GameStorage._fn_lq(Const.CacheDataKey.sound);
        }



        return state === undefined || state === 'true';
    }

    _fn_xa(loop: boolean) {
        const audioSource = AudioPlaybackService._audioSource!;
        assert(audioSource, 'AudioManager not inited!');
        audioSource.loop = loop;


        UtilPub.log("---AudioSource.maxAudioChannel----", AudioSource.maxAudioChannel)
        if (!audioSource.playing) {
            audioSource.play();
        }
    }






    _fn_wz(loop: boolean, audioName: string = "bgm") {

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

        let _fn_wy = (clip: AudioClip) => {
            this.clips[name] = clip
            audioSource.stop()
            audioSource.clip = clip
            audioSource.loop = loop;
            audioSource.volume = 0.3;
            if (!audioSource.playing) {
                audioSource.play();
                if (this._fn_qf() == false) {
                    audioSource.stop()
                }
                audioSource.volume = 0.6
            }
        }


        if (this.clips[name]) {
            _fn_wy(this.clips[name])
        } else {

            ResourceLoaderService._fn_rq(audioName, AudioClip, (err, clip) => {


                if (err) {

                    return;
                }
                if (clip) {
                    _fn_wy(clip)
                }
            })
        }

    }





    _fn_xc(audioName: string) {
        if (director.getScene()!.name == "hotupdate") {
            return;
        }
        if (this._fn_qg() == false) return



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
            this._fn_xd(name, this.clips[name])
        } else {

            ResourceLoaderService._fn_rq(audioName, AudioClip, (err, clip) => {


                if (err) {

                    return;
                }
                if (clip) {
                    this.clips[name] = clip
                    this._fn_xd(name, this.clips[name])
                }
            })

        }

    }

    _fn_xb(clip: AudioClip) {
        if (this._fn_qg()) {
            if (Const.AudioTime[clip.name] != null) {
                this._fn_bc()
                if (this.effectConcurrency.length > Const.AudioCnt) { return }
                let num = new Date().getTime() + Const.AudioTime[clip.name]

                this.effectConcurrency.push(num)
                AudioPlaybackService._audioSourceOne!.playOneShot(clip, 1);
            } else {
                AudioPlaybackService._audioSourceOne!.playOneShot(clip, 1);
            }
        }











    }

    _fn_xd(name: string, clip: AudioClip) {

        if (this.effectCache[name] == undefined) {
            this.effectCache[name] = new Date().getTime()
            this._fn_xb(clip)
        } else {
            let diff = new Date().getTime() - this.effectCache[name]
            if (diff > 88) {
                this.effectCache[name] = new Date().getTime()
                this._fn_xb(clip)
            }
        }
    }

    _fn_aff(flag: number) {
        const audioSource = AudioPlaybackService._audioSource!;
        assert(audioSource, 'AudioManager not inited!');

        flag = clamp01(flag);
        audioSource.volume = flag;
    }

    _fn_agi(flag: number) {
        this.soundVolume = flag;
    }

    _fn_wg() {
        const audioSource = AudioPlaybackService._audioSource!;
        audioSource.play()
        GameStorage._fn_ago(Const.CacheDataKey.music, 'true');
    }

    _fn_dg() {
        const audioSource = AudioPlaybackService._audioSource!;
        audioSource.stop()
        GameStorage._fn_ago(Const.CacheDataKey.music, 'false');
    }

    _fn_dd() {
        if (this._fn_qf()) {
            this._fn_dg()
        } else {
            this._fn_wg()
        }
    }

    _fn_qf() {
        return GameStorage._fn_lq(Const.CacheDataKey.music, 'true') == "true";
    }

    _fn_wi() {
        GameStorage._fn_ago(Const.CacheDataKey.sound, 'true');
    }

    _fn_qg() {
        return GameStorage._fn_lq(Const.CacheDataKey.sound, 'true') == "true";
    }

    _fn_dh() {
        GameStorage._fn_ago(Const.CacheDataKey.sound, 'false');
    }


    _fn_de() {
        if (this._fn_qg()) {
            this._fn_dh()
        } else {
            this._fn_wi()
        }
    }
    _fn_wt() {
        const audioSource = AudioPlaybackService._audioSource!;
        audioSource.stop()

    }

    _fn_aca() {
        const audioSource = AudioPlaybackService._audioSource!;
        audioSource.play()


    }

}
