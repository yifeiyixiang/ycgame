import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, Layout, Button, director, LabelOutline, Vec3, } from 'cc';
import { NATIVE, WECHAT } from 'cc/env';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { AudioPlaybackService } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { BaseUiComponent } from '../../../easyFramework/mgr/comm';
import { GameStorage } from '../../../easyFramework/mgr/gameStorage';
import { GNetCmd } from '../../../easyFramework/network/conf';
import ServerCtrJSF from '../../../easyFramework/network/ServerCtrJSF';
import TableDataService from '../../../easyFramework/other/tables';
import { RewardVideoManager } from '../../../Util/RechargeManager';
import { playerDataStore } from '../../comm/UserData';
import { MonthCard } from '../money/MonthCard';
import { GamePlatform } from '../../platform/GamePlatform';

const { ccclass, property } = _decorator;



@ccclass('ActivityDialog')
export class ActivityDialog extends BaseView {
    @property({ type: Node, tooltip: "滚动列表" }) giftScroll: Node = null!;
    _monthCardState: any = null
    _clickItem: any = null

    start() {
        this.bindButton(find("root/node/btnClose", this.node)!, this.close)
    }

    onEnable() {

        director.off(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
        director.on(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
    }

    onDisable() {

        director.off(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
    }

    onMessageEvent(userDataPayload: any) {
        let monthCardRecord = ServerCtrJSF.GetInstance().getUserDataByKey(userDataPayload, Const.MoneyKeys.MonthCharge)
        if (monthCardRecord) {
            this._monthCardState = {}
            this._monthCardState.have = MonthCard.checkMonthCard(userDataPayload) ? 1 : 0
            if (this._clickItem) {

            }
        }
    }

    show(args: any) {
        super.show(args)
        let freeGiftList = TableDataService.ins().getTableValuesByType(Const.Tables.giftFree, "type", "1")
        this.scrollViewSetData(this.giftScroll, freeGiftList, this.initItem, this)
        if (!WECHAT) {
            ServerCtrJSF.GetInstance().reqGetUserDataByKey(GameStorage.Key(Const.MoneyKeys.MonthCharge))
        }
        GamePlatform.track("查看免费礼物")
    }

    initItem(giftCellNode: Node, giftConfig: any, giftIndex: number, self: BaseUiComponent) {
        giftCellNode.getChildByName("infoLabel")!.getComponent(Label)!.string = giftConfig.info
        let receiveTime = playerDataStore.getReceiveTime(giftConfig.dataKey, giftConfig.cdTime)
        find("numLabel", giftCellNode)!.getComponent(Label)!.string = "Received: " + receiveTime
        find("titleLabel", giftCellNode)!.getComponent(Label)!.string = giftConfig.typename
        find("titleLabel", giftCellNode)!.getComponent(LabelOutline)!.color = giftConfig.fontColor.parseColor()
        find("infoLabel", giftCellNode)!.getComponent(LabelOutline)!.color = giftConfig.fontColor.parseColor()

        self.addButtonHander(giftCellNode.getChildByName("btnbg")!, self.node, "ActivityDialog", "onClickGet", giftConfig)

        self.setSpriteFrame(find("icon", giftCellNode)!.getComponent(Sprite)!, Const.resPath.freeGiftIcon + giftConfig.icon)

        if (giftConfig.typeson == 3) {
            find("numNode", giftCellNode)!.active = true
            find("numNode/numLabel", giftCellNode)!.getComponent(Label)!.string = "x" + playerDataStore.styleVoucher
        } else {
            find("numNode", giftCellNode)!.active = false
        }
        if (giftConfig.price3 == "") {
            giftCellNode.getChildByName("btnbg")!.active = false
            find("titleLabel", giftCellNode)!.position = v3(0, 0, 0)
        }








    }

    onClickGet(event: any, giftConfig: any) {
        AudioPlaybackService.instance.playSound(Const.Audio.btn)
        let receiveTime = playerDataStore.getReceiveTime(giftConfig.dataKey, giftConfig.cdTime)
        if (receiveTime >= giftConfig.receiveTime) {
            this.toast("请等待次数恢复哦~")
            return
        }
        if (giftConfig.type == 1) {





            this._clickItem = giftConfig
            let startNode = find("numNode", event.target.parent)!
            let rewardStartPos = startNode ? startNode.getComponent(UITransform)!.convertToWorldSpaceAR(v3(0, 0, 0)) : this.node.getComponent(UITransform)!.convertToWorldSpaceAR(v3(0, 0, 0))
            this.dealClickItem(rewardStartPos)
        }
    }

    dealClickItem(rewardStartPos: Vec3) {
        let receiveTime = playerDataStore.getReceiveTime(this._clickItem.dataKey, this._clickItem.cdTime)
        RewardVideoManager.showVideo(this._clickItem!.info + "" + receiveTime + " times", () => {
            this.onVideoBack(this._clickItem, rewardStartPos)
        })
        return
        if (this._monthCardState.have == 1 && !NATIVE) {

            this.onVideoBack(this._clickItem, rewardStartPos)
        } else {

            let receiveTime = playerDataStore.getReceiveTime(this._clickItem.dataKey, this._clickItem.cdTime)
            RewardVideoManager.showVideo(this._clickItem!.info + "" + receiveTime + " times", () => {
                this.onVideoBack(this._clickItem, rewardStartPos)
            })

        }
    }

    onVideoBack(giftConfig: any, rewardStartPos: Vec3) {
        playerDataStore.getProp(giftConfig.price3, rewardStartPos, v3(0, 0, 0))
        playerDataStore.setReceiveTime(giftConfig.dataKey, giftConfig.cdTime)
        let freeGiftList = TableDataService.ins().getTableValuesByType(Const.Tables.giftFree, "type", "1")
        this.scrollViewSetData(this.giftScroll, freeGiftList, this.initItem, this)
        this._clickItem = null
    }


}

