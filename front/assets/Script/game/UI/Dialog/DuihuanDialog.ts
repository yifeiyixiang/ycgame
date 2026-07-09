import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, Layout, director, EditBox, } from 'cc';
import { Const } from '../../../config/Const';
import { CodeState } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import { GNetCmd } from '../../../easyFramework/network/conf';
import ServerCtrJSF from '../../../easyFramework/network/ServerCtrJSF';
import GD from '../../../config/GD';
import { AudioPlaybackService } from '../../../easyFramework/mgr/audioManager';
import { GamePlatform } from '../../platform/GamePlatform';

const { ccclass, property } = _decorator;


@ccclass('DuihuanDialog')
export class DuihuanDialog extends BaseView {

    @property({ type: EditBox }) codeEditBox: EditBox = null!


    start() {
        this.bindButton(find("root/btnClose", this.node)!, this._fn_xe)
    }

    show(args: any) {
        super.show(args)


    }
    onEnable() {

        director.off(GNetCmd.GetActiveCode.toString(), this._fn_uw, this);
        director.on(GNetCmd.GetActiveCode.toString(), this._fn_uw, this);
    }

    onDisable() {

        director.off(GNetCmd.GetActiveCode.toString(), this._fn_uw, this);
    }

    _fn_uw(value: any) {
        console.log("onMessageEvent:", value);
        if (value.status != 'success') {

            console.log("请求失败~!", value.msg)
            let msg = ""
            if (value.msg == "CodeIsNotExist") {
                msg = "激活码不存在"
            } else if (value.msg == "RewardsAlreadyGotted") {
                msg = "无效的激活码"
            } else if (value.msg == "ActiveCodeExpired") {
                msg = "激活码已过期"
            }
            this.emit(GD.event.showTip, { msg: msg })
            return null;
        }
        UiLayerService.instance._fn_xw(Const.Dialogs.RewardDialog, { reward: value.rewards })
    }

    openDuihuanMa() {
        AudioPlaybackService.instance._fn_xc(Const.Audio.btn)
        let code = this.codeEditBox.string
        GamePlatform._fn_aja("查看设置-兑换码兑换")
        ServerCtrJSF._fn_hp()._fn_aar(code)

    }
}

