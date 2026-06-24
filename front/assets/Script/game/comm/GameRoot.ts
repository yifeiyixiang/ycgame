import { _decorator, Component, Node,AudioSource,assert,game, director } from 'cc';
import { AudioPlaybackService } from '../../easyFramework/mgr/audioManager';
const { ccclass, property } = _decorator;


@ccclass('GameRoot')
export class GameRoot extends Component {

    @property(AudioSource)
    private _audioSource: AudioSource = null!;

    onLoad () {
        const audioSource = this.getComponent(AudioSource)!;
        assert(audioSource);
        director.addPersistRootNode(this.node);
        this._audioSource = audioSource;
        AudioPlaybackService.instance.init(this._audioSource);
    }

    onEnable () {




    }

}
