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
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)
    }

    show(args: any) {
        super.show(args)
        if (EmailManager.getInstance().popNewEmails()) {
            this.updateInfo()
        } else {
            this.scheduleOnce(() => {
                this.updateInfo()
            }, 0.2)
        }
    }

    updateInfo() {
        let emailList = EmailManager.getInstance().EmailList
        let compareNewestEmail = (leftEmail: Email, rightEmail: Email) => {
            return rightEmail.time - leftEmail.time
        }
        emailList.sort(compareNewestEmail)
        this.scrollViewSetData(this.emailScroll, emailList, this.initItem, this)
        this.emailIcon.active = emailList.length <= 0
    }

    initItem(emailCellNode: Node, emailRecord: Email, emailIndex: number, self: EmailDialog) {
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
        UiLayerService.instance.pushShowDialog(Const.Dialogs.EmailInfoDialog, { email: emailRecord })
    }

    onClickRemove() {
        EmailManager.getInstance().removeAllEmail()
        this.updateInfo()
    }

    onClickReceive() {
        let receivableRewards = []
        let emailList = EmailManager.getInstance().EmailList
        for (let emailIndex = 0; emailIndex < emailList.length; emailIndex++) {
            let email: Email = emailList[emailIndex];
            if (email.reward.length > 0 && email.receicedState == EmailRewardState.unReceive) {
                receivableRewards.push(...email.reward)
                email.receicedState = EmailRewardState.received
                email.readState = EmailState.readFinish
                EmailManager.getInstance().saveEmail(email)
            }
        }

        if (receivableRewards.length > 0) {
            UiLayerService.instance.pushShowDialog(Const.Dialogs.RewardDialog, { reward: receivableRewards })
        } else {
            this.toast("没有可领取的奖励")
        }
    }

    addEmailTest() {
        EmailManager.getInstance().addEmail()
    }
}

