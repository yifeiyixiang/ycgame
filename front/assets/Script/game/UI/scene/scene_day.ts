import { _decorator } from 'cc';
import { BaseUiComponent } from '../../../easyFramework/mgr/comm';
const { ccclass, property } = _decorator;

@ccclass('scene_day')
export class scene_day extends BaseUiComponent {
    start() {

    }

    update(deltaTime: number) {
        this.calTime+=deltaTime
        if(this.calTime>1){
            this.calTime=0

        }
    }
}


