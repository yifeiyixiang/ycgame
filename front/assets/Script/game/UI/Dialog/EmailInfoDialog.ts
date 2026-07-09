import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, Layout, } from 'cc';
import { Const } from '../../../config/Const';
import { Email, EmailRewardState, EmailState } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import { EmailManager } from '../../comm/EmailManager';
import { PropItem, PropItemFlag } from './PropItem';
import { GamePlatform } from '../../platform/GamePlatform';

const { ccclass, property } = _decorator;


@ccclass('EmailInfoDialog')
export class EmailInfoDialog extends BaseView {
    private _email: any;
    @property({ type: Node }) btnReceive: Node = null!;
    @property({ type: Node }) btnRemove: Node = null!;



    start() {
        this.bindButton(find("root/btnClose", this.node)!, this._fn_xe)
    }

    show(args: any) {
        super.show(args)
        this._email = EmailManager._fn_ho()._fn_gy(this._layerData.email.id);
        this._email.readState = EmailState.readFinish
        EmailManager._fn_ho()._fn_acp(this._email)
        this._fn_oc(find("root/Email", this.node)!, this._layerData.email)
        this._fn_nu()

        GamePlatform._fn_aja("查看邮件")

    }

    _fn_oc(itemUI: Node, email: Email) {
        find("title", itemUI)!.getComponent(Label)!.string = "主题：" + email.title
        find("info", itemUI)!.getComponent(Label)!.string = email.content
        let sendDate = new Date(email.time)
        find("time", itemUI)!.getComponent(Label)!.string = sendDate.getFullYear() + "-" + (sendDate.getMonth() + 1) + "-" + sendDate.getDate()
        let rewardLayout = find("Layout", itemUI)!
        rewardLayout.removeAllChildren()
        for (let rewardIndex = 0; rewardIndex < email.reward.length; rewardIndex++) {
            const rewardRecord = email.reward[rewardIndex];
            this.addPrefab(Const.Prefabs.PropItem, rewardLayout, (rewardNode: any) => {
                rewardNode.getComponent(PropItem).setData(rewardRecord.propId, PropItemFlag.TouchInfo, rewardRecord.cnt)
                rewardNode.getComponent(PropItem).setSize(150).setItemBg(1)
            })
        }
    }

    _fn_nu() {
        if (this._email.receicedState == EmailRewardState.unReceive) {
            this.btnReceive.active = true
            this.btnRemove.active = false
        } else {
            this.btnReceive.active = false
            this.btnRemove.active = true
        }
    }

    onClickReceive() {





        UiLayerService.instance._fn_xw(Const.Dialogs.RewardDialog, { reward: this._layerData.email.reward })

        this._email.receicedState = EmailRewardState.received
        this._fn_nu()
        EmailManager._fn_ho()._fn_acp(this._email)

    }


    onClickRemove() {
        EmailManager._fn_ho()._fn_aah(this._email.id)
        this._fn_xe()
    }
}

