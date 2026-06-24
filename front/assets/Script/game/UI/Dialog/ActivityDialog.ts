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
    _MonthCardVal: any = null
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

    onMessageEvent(value: any) {
        let data = ServerCtrJSF.GetInstance().getUserDataByKey(value, Const.MoneyKeys.MonthCharge)
        if (data) {
            this._MonthCardVal = {}
            this._MonthCardVal.have = MonthCard.checkMonthCard(value) ? 1 : 0
            if (this._clickItem) {

            }
        }
    }

    show(args: any) {
        super.show(args)
        let giftData = TableDataService.ins().getTableValuesByType(Const.Tables.giftFree, "type", "1")
        this.scrollViewSetData(this.giftScroll, giftData, this.initItem, this)
        if (!WECHAT) {
            ServerCtrJSF.GetInstance().reqGetUserDataByKey(GameStorage.Key(Const.MoneyKeys.MonthCharge))
        }
        GamePlatform.track("查看免费礼物")
    }

    initItem(itemUI: Node, item: any, index: number, self: BaseUiComponent) {
        itemUI.getChildByName("infoLabel")!.getComponent(Label)!.string = item.info
        let receiveTime = playerDataStore.getReceiveTime(item.dataKey, item.cdTime)
        find("numLabel", itemUI)!.getComponent(Label)!.string = "Received: " + receiveTime
        find("titleLabel", itemUI)!.getComponent(Label)!.string = item.typename
        find("titleLabel", itemUI)!.getComponent(LabelOutline)!.color = item.fontColor.parseColor()
        find("infoLabel", itemUI)!.getComponent(LabelOutline)!.color = item.fontColor.parseColor()

        self.addButtonHander(itemUI.getChildByName("btnbg")!, self.node, "ActivityDialog", "onClickGet", item)

        self.setSpriteFrame(find("icon", itemUI)!.getComponent(Sprite)!, Const.resPath.freeGiftIcon + item.icon)

        if (item.typeson == 3) {
            find("numNode", itemUI)!.active = true
            find("numNode/numLabel", itemUI)!.getComponent(Label)!.string = "x" + playerDataStore.styleVoucher
        } else {
            find("numNode", itemUI)!.active = false
        }
        if (item.price3 == "") {
            itemUI.getChildByName("btnbg")!.active = false
            find("titleLabel", itemUI)!.position = v3(0, 0, 0)
        }








    }

    onClickGet(event: any, item: any) {
        AudioPlaybackService.instance.playSound(Const.Audio.btn)
        let receiveTime = playerDataStore.getReceiveTime(item.dataKey, item.cdTime)
        if (receiveTime >= item.receiveTime) {
            this.toast("请等待次数恢复哦~")
            return
        }
        if (item.type == 1) {





            this._clickItem = item
            let startNode = find("numNode", event.target.parent)!
            let pos = startNode ? startNode.getComponent(UITransform)!.convertToWorldSpaceAR(v3(0, 0, 0)) : this.node.getComponent(UITransform)!.convertToWorldSpaceAR(v3(0, 0, 0))
            this.dealClickItem(pos)
        }
    }

    dealClickItem(startpos: Vec3) {
        let receiveTime = playerDataStore.getReceiveTime(this._clickItem.dataKey, this._clickItem.cdTime)
        RewardVideoManager.showVideo(this._clickItem!.info + "" + receiveTime + " times", () => {
            this.onVideoBack(this._clickItem, startpos)
        })
        return
        if (this._MonthCardVal.have == 1 && !NATIVE) {

            this.onVideoBack(this._clickItem, startpos)
        } else {

            let receiveTime = playerDataStore.getReceiveTime(this._clickItem.dataKey, this._clickItem.cdTime)
            RewardVideoManager.showVideo(this._clickItem!.info + "" + receiveTime + " times", () => {
                this.onVideoBack(this._clickItem, startpos)
            })

        }
    }

    onVideoBack(item: any, startpos: Vec3) {
        playerDataStore.getProp(item.price3, startpos, v3(0, 0, 0))
        playerDataStore.setReceiveTime(item.dataKey, item.cdTime)
        let giftData = TableDataService.ins().getTableValuesByType(Const.Tables.giftFree, "type", "1")
        this.scrollViewSetData(this.giftScroll, giftData, this.initItem, this)
        this._clickItem = null
    }


}

