import { animation, Node, find, _decorator, ProgressBar, Label, Sprite, director, game } from 'cc';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { GPromptType } from '../../../config/global';
import { WmSocketJSF } from '../../../easyFramework/network/WmSocketJSF';
import GD from '../../../config/GD';
import { GEvent, GNetConst, GNetUrl } from '../../../easyFramework/network/conf';
import TimeCtrJSF from '../../../easyFramework/network/TimeCtrJSF';
import ServerCtrJSF from '../../../easyFramework/network/ServerCtrJSF';
import { WECHAT } from 'cc/env';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { Notifications } from '../../../easyFramework/mgr/notifications';
import { Const } from '../../../config/Const';
import { UtilScene } from '../../comm/UtilScene';
const { ccclass, property } = _decorator;

@ccclass('prompt_sure')
export class ConfirmPromptDialogController extends BaseView {

    get titleLabel() { return find("root/titleLabel", this.node)!.getComponent(Label)! }
    get contentLabel() { return find("root/contentLabel", this.node)!.getComponent(Label)! }
    get btnLabel() { return find("root/btnGreenbg/btnLabel", this.node)!.getComponent(Label)! }
    get btnGreenBg() { return find("root/btnGreenbg", this.node)! }

    cb:Function = null!
    type:GPromptType =GPromptType.blockAccount
    isStartReconnect:boolean = false

    start() {
        director.off(GEvent.ws_open, this._fn_wd, this);
        director.on(GEvent.ws_open, this._fn_wd, this);
        this.bindButton(this.btnGreenBg, () => {
            if(this.type==GPromptType.reconnect){
                this.isStartReconnect = true
                this.emit(GD.event.showTip, {msg: "尝试连接服务器！"})
                this._fn_aje()

            }else if(this.type==GPromptType.blockAccount ||
                this.type==GPromptType.loginOccupy ||
                this.type==GPromptType.loginExpired ||
                this.type==GPromptType.unkown){

                this.cb && this.cb()
                game.end()

            }

        })
    }

    _fn_abw(){
       UtilScene._fn_abw()
    }

    show(args: any) {
        this.isStartReconnect = false

        this.type = args.type
        this.cb = args.cb
        this.contentLabel.string = args.content




    }

    close(){

    }


    _fn_wd(){
        console.warn("socket成功后----------自动重新登录")
        this._fn_abw()





    }

    _fn_aje(){







    }

    update(dt:number){

        if(this.isStartReconnect==true){
            this.calTime += dt
            if(this.calTime>2){
                UtilPub.log("开始尝试重新链接")
                this.calTime=0
                this._fn_aje()
            }
        }
    }

}


