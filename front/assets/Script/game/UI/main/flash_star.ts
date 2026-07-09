import { _decorator, Component, Node } from 'cc';
import { BaseUiComponent } from '../../../easyFramework/mgr/comm';
import { NodePoolService } from '../../../easyFramework/mgr/poolManager';
const { ccclass, property } = _decorator;

@ccclass('flash_star')
export class FlashStarController extends BaseUiComponent {
    init(): void {
        this.calTime=0
    }
    update(deltaTime: number) {
        this.calTime+=deltaTime
        if(this.calTime>3){
            this.calTime = 0
            console.log("------------caltime---", this.calTime)
            NodePoolService.instance._fn_xz(this.node)
        }
    }
}


