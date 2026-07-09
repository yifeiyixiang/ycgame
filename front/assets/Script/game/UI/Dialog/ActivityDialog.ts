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

        director.off(GNetCmd.GetUserDataByKey.toString(), this._fn_uw, this);
        director.on(GNetCmd.GetUserDataByKey.toString(), this._fn_uw, this);
    }

    onDisable() {

        director.off(GNetCmd.GetUserDataByKey.toString(), this._fn_uw, this);
    }

    _fn_uw(userDataPayload: any) {
        let monthCardRecord = ServerCtrJSF._fn_hp()._fn_mu(userDataPayload, Const.MoneyKeys.MonthCharge)
        if (monthCardRecord) {
            this._monthCardState = {}
            this._monthCardState.have = MonthCard._fn_ca(userDataPayload) ? 1 : 0
            if (this._clickItem) {

            }
        }
    }

    show(args: any) {
        super.show(args)
        let freeGiftList = TableDataService.ins()._fn_mb(Const.Tables.giftFree, "type", "1")
        this._fn_adc(this.giftScroll, freeGiftList, this._fn_oc, this)
        if (!WECHAT) {
            ServerCtrJSF._fn_hp()._fn_aat(GameStorage._fn_rb(Const.MoneyKeys.MonthCharge))
        }
        GamePlatform._fn_aja("查看免费礼物")
    }

    _fn_oc(giftCellNode: Node, giftConfig: any, giftIndex: number, self: BaseUiComponent) {
        giftCellNode.getChildByName("infoLabel")!.getComponent(Label)!.string = giftConfig.info
        let receiveTime = playerDataStore._fn_jz(giftConfig.dataKey, giftConfig.cdTime)
        find("numLabel", giftCellNode)!.getComponent(Label)!.string = "Received: " + receiveTime
        find("titleLabel", giftCellNode)!.getComponent(Label)!.string = giftConfig.typename
        find("titleLabel", giftCellNode)!.getComponent(LabelOutline)!.color = giftConfig.fontColor.parseColor()
        find("infoLabel", giftCellNode)!.getComponent(LabelOutline)!.color = giftConfig.fontColor.parseColor()

        self.addButtonHander(giftCellNode.getChildByName("btnbg")!, self.node, "ActivityDialog", "onClickGet", giftConfig)

        self._fn_agk(find("icon", giftCellNode)!.getComponent(Sprite)!, Const.resPath.freeGiftIcon + giftConfig.icon)

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
        AudioPlaybackService.instance._fn_xc(Const.Audio.btn)
        let receiveTime = playerDataStore._fn_jz(giftConfig.dataKey, giftConfig.cdTime)
        if (receiveTime >= giftConfig.receiveTime) {
            this._fn_aiu("请等待次数恢复哦~")
            return
        }
        if (giftConfig.type == 1) {





            this._clickItem = giftConfig
            let startNode = find("numNode", event.target.parent)!
            let rewardStartPos = startNode ? startNode.getComponent(UITransform)!.convertToWorldSpaceAR(v3(0, 0, 0)) : this.node.getComponent(UITransform)!.convertToWorldSpaceAR(v3(0, 0, 0))
            this._fn_ed(rewardStartPos)
        }
    }

    _fn_ed(rewardStartPos: Vec3) {
        let receiveTime = playerDataStore._fn_jz(this._clickItem.dataKey, this._clickItem.cdTime)
        RewardVideoManager._fn_ahy(this._clickItem!.info + "" + receiveTime + " times", () => {
            this._fn_wc(this._clickItem, rewardStartPos)
        })
        return
        if (this._monthCardState.have == 1 && !NATIVE) {

            this._fn_wc(this._clickItem, rewardStartPos)
        } else {

            let receiveTime = playerDataStore._fn_jz(this._clickItem.dataKey, this._clickItem.cdTime)
            RewardVideoManager._fn_ahy(this._clickItem!.info + "" + receiveTime + " times", () => {
                this._fn_wc(this._clickItem, rewardStartPos)
            })

        }
    }

    _fn_wc(giftConfig: any, rewardStartPos: Vec3) {
        playerDataStore._fn_jk(giftConfig.price3, rewardStartPos, v3(0, 0, 0))
        playerDataStore._fn_afo(giftConfig.dataKey, giftConfig.cdTime)
        let freeGiftList = TableDataService.ins()._fn_mb(Const.Tables.giftFree, "type", "1")
        this._fn_adc(this.giftScroll, freeGiftList, this._fn_oc, this)
        this._clickItem = null
    }


}

