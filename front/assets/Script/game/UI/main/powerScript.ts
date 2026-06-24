import { animation, Node, find, _decorator, ProgressBar, Label, Sprite } from 'cc';
import { CdComponent } from '../../../easyFramework/utils/CdComponent';
const { ccclass, property } = _decorator;

@ccclass('powerScript')
export class EnergyCountdownController extends CdComponent {
    @property({ type: Label, displayName: "体力Label" }) powerLabel: Label = null!


    onLoad() {


    }

    start() {


    }


}

