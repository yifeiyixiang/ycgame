import { _decorator, Label, find, Node, director, Button, UITransform, v3 } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { GoodsType } from '../../../config/global';
import { AudioPlaybackService } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { GameStorage } from '../../../easyFramework/mgr/gameStorage';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import { GNetCmd } from '../../../easyFramework/network/conf';
import ServerCtrJSF from '../../../easyFramework/network/ServerCtrJSF';
import TableDataService from '../../../easyFramework/other/tables';
import { CdComponent, CDType } from '../../../easyFramework/utils/CdComponent';
import { RewardVideoManager } from '../../../Util/RechargeManager';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
import { playerDataStore } from '../../comm/UserData';
import { MonthCard } from '../money/MonthCard';
import { GamePlatform } from '../../platform/GamePlatform';

const { ccclass, property } = _decorator;

@ccclass('ShopPowerDialog')
export class ShopPowerDialog extends BaseView {
    @property({ type: Label }) freeLabel: Label = null!
    @property({ type: Label }) diamonsLabel: Label = null!
    @property({ type: Label }) needDiamLabel: Label = null!

    @property({ type: Label }) cardAddPower: Label = null!

    @property({ type: Node }) videoPower: Node = null!
    @property({ type: Node }) cardPower: Node = null!

    _monthCardState: any = null

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this._fn_xe)
    }

    show(args: any) {
        super.show(args)
        this.initData()

        ServerCtrJSF._fn_hp()._fn_aau(GameStorage._fn_rb(Const.MoneyKeys.MonthCharge))
        this._monthCardState = {}
        this._monthCardState.have = false
        this.videoPower.active = true
        this.cardPower.active = false
    }

    onEnable() {

        director.off(GNetCmd.GetUserDataByKey.toString(), this._fn_uw, this);
        director.on(GNetCmd.GetUserDataByKey.toString(), this._fn_uw, this);
    }

    onDisable() {

        director.off(GNetCmd.GetUserDataByKey.toString(), this._fn_uw, this);
    }

    _fn_uw(userDataPayload: any) {
        console.log("onMessageEvent:", userDataPayload);
        let monthCardRecord = ServerCtrJSF._fn_hp()._fn_mu(userDataPayload, Const.MoneyKeys.MonthCharge)
        if (monthCardRecord) {
            this._monthCardState = {}
            this._monthCardState.have = MonthCard._fn_ca(userDataPayload) ? 1 : 0

        }
    }

    initData() {
        this.freeLabel.string = "+" + TableDataService.ins().config[Const.config.freePower]
        this.diamonsLabel.string = "+" + TableDataService.ins().config[Const.config.diamonsPower][0]
        this.needDiamLabel.string = "X" + TableDataService.ins().config[Const.config.diamonsPower][1] * playerDataStore.buyPowerTime
        this.cardAddPower.string = "+" + TableDataService.ins().config[Const.config.CardAddPower]

        let videoPowerGift = TableDataService.ins()._fn_md(Const.Tables.giftFree, "type", "1", "typeson", "2")
        if (videoPowerGift) {
            this._fn_oc(this.videoPower, videoPowerGift)
        } else {
            this.videoPower.active = false
            this.cardPower.active = true
        }
    }

    _fn_oc(powerGiftNode: Node, giftConfig: any) {

        let receiveTime = playerDataStore._fn_jz(giftConfig.dataKey, giftConfig.cdTime)


        if (receiveTime < giftConfig.receiveTime) {
            find("numLabel", powerGiftNode)!.getComponent(Label)!.string = "已领取次数" + receiveTime
            this.addButtonHander(powerGiftNode.getChildByName("btnbg")!, this.node, "ShopPowerDialog", "onClickGet", giftConfig)
            find("timelabel", powerGiftNode)!.getComponent(Label)!.string = ""
        } else {
            find("numLabel", powerGiftNode)!.getComponent(Label)!.string = ""
            let timeLabel = find("timelabel", powerGiftNode)!.getComponent(Label)!
            find("timelabel", powerGiftNode)!.getComponent(CdComponent)!.setCD(CDType.CDIneterVal, giftConfig.dataKey, giftConfig.cdTime, () => {
                timeLabel.string = ""
            })
            powerGiftNode.getChildByName("btnbg")!.getComponent(Button)?.destroy()


        }
    }

    onClickGet(event: any, giftConfig: any) {
        AudioPlaybackService.instance._fn_xc(Const.Audio.btn)

        if (giftConfig.type == 1) {
            let receiveTime = playerDataStore._fn_jz(giftConfig.dataKey, giftConfig.cdTime)
            RewardVideoManager._fn_ahy("免费体力" + receiveTime + "次", () => {
                this._fn_wc(giftConfig)
            })
            return
            if (this._monthCardState.have) {

                this._fn_wc(giftConfig)
            } else {

                let receiveTime = playerDataStore._fn_jz(giftConfig.dataKey, giftConfig.cdTime)
                RewardVideoManager._fn_ahy("免费体力" + receiveTime + "次", () => {
                    this._fn_wc(giftConfig)
                })
            }
        }
    }

    _fn_wc(giftConfig: any) {
        playerDataStore._fn_jk(giftConfig.price3, this.node.getComponent(UITransform)!.convertToWorldSpaceAR(v3(0, 0, 0)), v3(0, 0, 0))
        this.emit(GD.event.updateMoney)
        playerDataStore._fn_afo(giftConfig.dataKey, giftConfig.cdTime)
        let videoPowerGift = TableDataService.ins()._fn_md(Const.Tables.giftFree, "type", "1", "typeson", "2")
        if (videoPowerGift) {
            this._fn_oc(this.videoPower, videoPowerGift)
        } else {
            this.videoPower.active = false
            this.cardPower.active = true
        }
    }

    onClickFreePower() {

    }

    onClickDiamonsPower() {






        AudioPlaybackService.instance._fn_xc(Const.Audio.btn)

        if (playerDataStore._fn_bg(TableDataService.ins().config[Const.config.diamonsPower][1] * playerDataStore.buyPowerTime)) {
            GamePlatform._fn_aja("钻石购买体力 " + (TableDataService.ins().config[Const.config.diamonsPower][1] * playerDataStore.buyPowerTime) + "钻石")
            playerDataStore._fn_jk([GoodsType.Power, TableDataService.ins().config[Const.config.diamonsPower][0] + (this._monthCardState.have == 1 ? TableDataService.ins().config[Const.config.CardAddPower] : 0)], this.node.getComponent(UITransform)!.convertToWorldSpaceAR(v3(0, 0, 0)), v3(0, 0, 0))
            playerDataStore._fn_b()
            this.emit(GD.event.updateMoney)
            this.initData()
            mergeBoardStateStore._fn_h(Const.ManagerTypes.diamondBuyPower);
        } else {
            this._fn_aiu("钻石不足")
        }
    }

    onOpenCard() {
        UiLayerService.instance._fn_ahg(Const.Dialogs.MonthCard)
    }
}

