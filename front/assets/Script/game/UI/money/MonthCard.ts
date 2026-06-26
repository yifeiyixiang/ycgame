import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, Layout, Prefab, instantiate, director, Button, } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { shopType } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { GameStorage } from '../../../easyFramework/mgr/gameStorage';
import { GNetCmd } from '../../../easyFramework/network/conf';
import ServerCtrJSF from '../../../easyFramework/network/ServerCtrJSF';
import TimeCtrJSF from '../../../easyFramework/network/TimeCtrJSF';
import TableDataService from '../../../easyFramework/other/tables';
import { CdComponent, CDType } from '../../../easyFramework/utils/CdComponent';
import { playerDataStore } from '../../comm/UserData';

const { ccclass, property } = _decorator;



@ccclass('MonthCard')
export class MonthCard extends BaseView {

    @property({ type: Node, tooltip: "月卡奖励列表" }) monthNode: Node = null!;
    @property({ type: Node, tooltip: "周卡奖励列表" }) weeksNode: Node = null!;
    @property({ type: Node, tooltip: "月卡奖励列表" }) rewardItem: Node = null!;

    _hasMonthCard = false
    _hasWeekCard = false


    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)
    }

    public static get MonthCardData() {
        return TableDataService.ins().getTableValuesByType2ByOne(Const.Tables.shopTable, "type", shopType.MonthCard + "", "dc", "2")
    }

    public static get WeekCardData() {
        return TableDataService.ins().getTableValuesByType2ByOne(Const.Tables.shopTable, "type", shopType.MonthCard + "", "dc", "1")
    }

    public static checkMonthCard(userDataPayload: any) {
        let monthCardRecord = ServerCtrJSF.GetInstance().getUserDataByKey(userDataPayload, Const.MoneyKeys.MonthCharge)
        if (monthCardRecord && monthCardRecord.val["buyTime"]) {
            let purchasedAt = parseInt(monthCardRecord.val["buyTime"] + "")
            let serverNow = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
            if (serverNow - purchasedAt < MonthCard.MonthCardData.totalLimit * 24 * 60 * 60 * 1000) {
                return true
            }
        }
        return false
    }

    public static checkWeekCard(userDataPayload: any) {
        let weekCardRecord = ServerCtrJSF.GetInstance().getUserDataByKey(userDataPayload, Const.MoneyKeys.WeekCharge)
        if (weekCardRecord && weekCardRecord.val["buyTime"]) {
            let purchasedAt = parseInt(weekCardRecord.val["buyTime"] + "")
            let serverNow = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
            if (serverNow - purchasedAt < MonthCard.WeekCardData.totalLimit * 24 * 60 * 60 * 1000) {
                return true
            }
        }
        return false
    }

    show(args: any) {
        super.show(args)

        this.initDialog(this.monthNode, MonthCard.MonthCardData)
        this.initDialog(this.weeksNode, MonthCard.WeekCardData)

        ServerCtrJSF.GetInstance().reqGetUserDataObjByKey(GameStorage.Key(Const.MoneyKeys.MonthCharge))
        ServerCtrJSF.GetInstance().reqGetUserDataObjByKey(GameStorage.Key(Const.MoneyKeys.WeekCharge))
    }

    onEnable() {
        console.log("onMessageEvent --- 开始监听")
        director.off(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
        director.on(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
    }

    onDisable() {
        console.log("onMessageEvent --- 取消监听")
        director.off(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
    }

    onMessageEvent(userDataPayload: any) {
        console.log("onMessageEvent:", userDataPayload);
        let monthCardRecord = ServerCtrJSF.GetInstance().getUserDataByKey(userDataPayload, Const.MoneyKeys.MonthCharge)
        if (monthCardRecord) {
            this._hasMonthCard = MonthCard.checkMonthCard(userDataPayload)
            this.initMonthCardBtn()
        }
        let weekCardRecord = ServerCtrJSF.GetInstance().getUserDataByKey(userDataPayload, Const.MoneyKeys.WeekCharge)
        if (weekCardRecord) {
            this._hasWeekCard = MonthCard.checkWeekCard(userDataPayload)
            this.initWeekCardBtn()
        }

    }

    initMonthCardBtn() {
        if (this._hasMonthCard) {
            find("btnBuy", this.monthNode)!.active = false
            find("btnReceive", this.monthNode)!.active = true
        } else {
            find("btnBuy", this.monthNode)!.active = true
            find("btnReceive", this.monthNode)!.active = false
        }
    }

    initWeekCardBtn() {
        if (this._hasWeekCard) {
            find("btnBuy", this.weeksNode)!.active = false
            find("btnReceive", this.weeksNode)!.active = true
        } else {
            find("btnBuy", this.weeksNode)!.active = true
            find("btnReceive", this.weeksNode)!.active = false
        }
    }

    initDialog(dialog: Node, cardShopConfig: any) {
        let monthRewardList = dialog.getChildByName("rewardList")!
        let nowRewardList = dialog.getChildByName("Layout")!
        let totalList = dialog.getChildByName("totalList")!

        monthRewardList.removeAllChildren()
        nowRewardList.removeAllChildren()
        totalList.removeAllChildren()

        if (cardShopConfig) {
            let rechargeConfig = TableDataService.ins().getTableValueByID(Const.Tables.recharge, cardShopConfig.recharge)
            find("btnBuy/Label", dialog)!.getComponent(Label)!.string = "$" + rechargeConfig.cash
            let privilegeList = cardShopConfig.price3
            for (let privilegeIndex = 0; privilegeIndex < privilegeList.length; privilegeIndex++) {
                let privilegeEntry = privilegeList[privilegeIndex];
                let privilegeData = TableDataService.ins().getTableValueByKey(Const.Tables.privilege, "key", privilegeEntry[0])
                if (privilegeData.type == 1) {
                    let privilegeNode = instantiate(this.rewardItem)
                    privilegeNode.position = v3(0, 0, 0)
                    monthRewardList.addChild(privilegeNode)
                    this.setSpriteFrame(find("icon", privilegeNode)!.getComponent(Sprite)!, Const.resPath.icon + privilegeData.icon, () => { }, 80)
                    find("Label", privilegeNode)!.getComponent(Label)!.string = privilegeData.ps
                } else if (privilegeData.type == 2) {
                    let rewardItemList = privilegeData.value
                    rewardItemList.forEach((rewardEntry: any) => {
                        let dailyRewardNode = instantiate(this.rewardItem)
                        dailyRewardNode.position = v3(0, 0, 0)
                        nowRewardList.addChild(dailyRewardNode)
                        let rewardPropConfig = TableDataService.ins().getTableValueByID(Const.Tables.prop, rewardEntry[0])
                        this.setSpriteFrame(find("icon", dailyRewardNode)!.getComponent(Sprite)!, Const.resPath.icon + rewardPropConfig.icon, () => { }, 80)
                        find("Label", dailyRewardNode)!.getComponent(Label)!.string = "" + rewardEntry[1]

                        let totalRewardNode = instantiate(this.rewardItem)
                        totalRewardNode.position = v3(0, 0, 0)
                        totalList.addChild(totalRewardNode)
                        this.setSpriteFrame(find("icon", totalRewardNode)!.getComponent(Sprite)!, Const.resPath.icon + privilegeData.icon, () => { }, 80)
                        find("Label", totalRewardNode)!.getComponent(Label)!.string = "" + rewardEntry[1] * cardShopConfig.totalLimit
                    });
                    this.initReceiveBtn(dialog, privilegeData)
                }
            }
        }
    }


    initReceiveBtn(cardPanel: Node, privilegeConfig: any) {

        let receiveTime = playerDataStore.getReceiveTime(privilegeConfig.dataKey, privilegeConfig.cdTime)

        if (receiveTime < privilegeConfig.receiveTime) {
            this.addButtonHander(cardPanel.getChildByName("btnReceive")!, this.node, "MonthCard", "onClickGet", privilegeConfig)
            find("timelabel", cardPanel)!.getComponent(Label)!.string = ""
        } else {
            find("timelabel", cardPanel)!.getComponent(CdComponent)!.setCD(CDType.CDIneterVal, privilegeConfig.dataKey, privilegeConfig.cdTime)
            cardPanel.getChildByName("btnReceive")!.getComponent(Button)?.destroy()
        }
    }

    onClickGet(event: any, privilegeConfig: any) {
        console.log("event = ", event)

        this.onVideoBack(privilegeConfig.value)
        this.emit(GD.event.updateMoney)
        playerDataStore.setReceiveTime(privilegeConfig.dataKey, privilegeConfig.cdTime)
        this.initReceiveBtn(event.target.parent, privilegeConfig)
    }

    onVideoBack(rewardPayload: any) {
        playerDataStore.getProp(rewardPayload,null,null)
    }

    onClickBuyMonth() {
        if (this._hasMonthCard) {

















        } else {
            let firstShopConfig = TableDataService.ins().getTableValueByKey(Const.Tables.shopTable, "type", 2)
            playerDataStore.getProp(firstShopConfig.first,null,null)
            this.emit(GD.event.updateMoney)
            GameStorage.setObject(Const.MoneyKeys.MonthCharge, { month: 1, dayReceive: 0, buyTime: Math.floor(TimeCtrJSF.GetInstance().ServerTime) })
            ServerCtrJSF.GetInstance().reqGetUserDataObjByKey(GameStorage.Key(Const.MoneyKeys.MonthCharge))
        }
    }

    onClickBuyWeeks() {
        if (this._hasWeekCard) {

        } else {
            GameStorage.setObject(Const.MoneyKeys.WeekCharge, { week: 1, weekdayReceive: 0, buyTime: Math.floor(TimeCtrJSF.GetInstance().ServerTime) })
            ServerCtrJSF.GetInstance().reqGetUserDataObjByKey(GameStorage.Key(Const.MoneyKeys.WeekCharge))
        }
    }
}

