import { _decorator, Component, Node, find, Sprite, Label } from 'cc';
import BaseView from '../../../easyFramework/mgr/BaseView';
const { ccclass, property } = _decorator;

@ccclass('tick_no_enough')
export class TicketNotEnoughDialogController extends BaseView {
    get root(){return find("root", this.node)!}
    get closeBtn(){return find("root/btnClose", this.node)!}
    cb:Function=null!

    start() {

        this.bindButton(this.closeBtn, ()=>{
            this.close()
            this.cb && this.cb()
        })
    }

    show(args:any){
        this.cb = args.cb
    }

    onEnable(){

    }

}


