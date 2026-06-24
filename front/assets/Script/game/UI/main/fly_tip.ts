import { _decorator, Component, Node, Prefab, color, tween } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { NodePoolService } from '../../../easyFramework/mgr/poolManager';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { FloatingTipItemController } from './fly_tip_item';
const { ccclass, property } = _decorator;

@ccclass('fly_tip')
export class FloatingTipPanelController extends BaseView {

    @property({ type: Node, displayName: "节点" })
    layout: Node = null!;

    msgQueue:string[]=[]


    onLoad() {
        this.on(GD.event.showTip, this.showTip)
    }

    showTip(msg:string){

        this.msgQueue.push(msg)
        UiLayerService.instance.showDialog(Const.Dialogs.FloatingTipPanelController)
    }

    update(deltaTime: number) {
        if(this.msgQueue.length>0){
            this.calTime+=deltaTime
            if(this.calTime>0.2){
                this.calTime=0
                let m = this.msgQueue.shift()!


                UtilPub.getPrefab(Const.Prefabs.FloatingTipItemController, (p:Prefab)=>{
                    let item = NodePoolService.instance.getNode(p, this.layout)
                    item.getComponent(FloatingTipItemController)!.init(m)
                })

            }
        }
    }
}
