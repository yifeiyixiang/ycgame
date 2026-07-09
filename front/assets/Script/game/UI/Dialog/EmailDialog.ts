import { _decorator, Node, Label, find, Sprite, SpriteFrame, UITransform, math, Layout, } from 'cc';
import { Const } from '../../../config/Const';
import { Email, EmailRewardState, EmailState } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import { EmailManager } from '../../comm/EmailManager';
import { PropItem, PropItemFlag } from './PropItem';

const { ccclass, property } = _decorator;


@ccclass('EmailDialog')
export class EmailDialog extends BaseView {
    @property({ type: Node, tooltip: "邮件列表" }) emailScroll: Node = null!;
    @property({ type: Node, tooltip: "邮件" }) emailIcon: Node = null!;

    @property({ type: SpriteFrame }) iconOpen: SpriteFrame = null!;
    @property({ type: SpriteFrame }) iconClose: SpriteFrame = null!;

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this._fn_xe)
    }

    show(args: any) {
        super.show(args)
        if (EmailManager._fn_ho()._fn_xg()) {
            this.updateInfo()
        } else {
            this.scheduleOnce(() => {
                this.updateInfo()
            }, 0.2)
        }
    }

    updateInfo() {
        let emailList = EmailManager._fn_ho().EmailList
        let _fn_dl = (leftEmail: Email, rightEmail: Email) => {
            return rightEmail.time - leftEmail.time
        }
        emailList.sort(_fn_dl)
        this._fn_adc(this.emailScroll, emailList, this._fn_oc, this)
        this.emailIcon.active = emailList.length <= 0
    }

    _fn_oc(emailCellNode: Node, emailRecord: Email, emailIndex: number, self: EmailDialog) {
        find("title", emailCellNode)!.getComponent(Label)!.string = emailRecord.title
        find("info", emailCellNode)!.getComponent(Label)!.string = emailRecord.content
        let sendDate = new Date(emailRecord.time)
        find("time", emailCellNode)!.getComponent(Label)!.string = sendDate.getFullYear() + "-" + (sendDate.getMonth() + 1) + "-" + sendDate.getDate()
        self.addButtonHander(emailCellNode, self.node, "EmailDialog", "onTouchEmail", emailRecord)
        find("redpoint", emailCellNode)!.active = (emailRecord.reward && emailRecord.reward.length > 0 && emailRecord.receicedState == EmailRewardState.unReceive)
        find("icon", emailCellNode)!.getComponent(Sprite)!.spriteFrame = emailRecord.readState == EmailState.unRead ? self.iconClose : self.iconOpen

        if (emailRecord.reward.length > 0) {
            find("info", emailCellNode)!.active = false
            find("Layout", emailCellNode)!.active = true
            let rewardLayout = find("Layout", emailCellNode)!
            rewardLayout.removeAllChildren()
            for (let rewardIndex = 0; rewardIndex < emailRecord.reward.length; rewardIndex++) {
                self.addPrefab(Const.Prefabs.PropItem, rewardLayout, (rewardNode: Node) => {
                    rewardNode.getComponent(PropItem)!.setData(emailRecord.reward[rewardIndex].propId, PropItemFlag.ShowMinInfo, emailRecord.reward[rewardIndex].cnt)!.setSize(80).setItemBg(1)
                })
            }
        } else {
            find("info", emailCellNode)!.active = true
            find("Layout", emailCellNode)!.active = false
        }
    }

    onTouchEmail(event: any, emailRecord: Email) {
        UiLayerService.instance._fn_xw(Const.Dialogs.EmailInfoDialog, { email: emailRecord })
    }

    onClickRemove() {
        EmailManager._fn_ho()._fn_aae()
        this.updateInfo()
    }

    onClickReceive() {
        let receivableRewards = []
        let emailList = EmailManager._fn_ho().EmailList
        for (let emailIndex = 0; emailIndex < emailList.length; emailIndex++) {
            let email: Email = emailList[emailIndex];
            if (email.reward.length > 0 && email.receicedState == EmailRewardState.unReceive) {
                receivableRewards.push(...email.reward)
                email.receicedState = EmailRewardState.received
                email.readState = EmailState.readFinish
                EmailManager._fn_ho()._fn_acp(email)
            }
        }

        if (receivableRewards.length > 0) {
            UiLayerService.instance._fn_xw(Const.Dialogs.RewardDialog, { reward: receivableRewards })
        } else {
            this._fn_aiu("没有可领取的奖励")
        }
    }

    addEmailTest() {
        EmailManager._fn_ho()._fn_c()
    }
}

