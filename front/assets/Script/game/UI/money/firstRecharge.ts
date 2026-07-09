import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, Layout, Prefab, instantiate, director, } from 'cc';
import { Const } from '../../../config/Const';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { GameStorage } from '../../../easyFramework/mgr/gameStorage';
import { GNetCmd } from '../../../easyFramework/network/conf';
import ServerCtrJSF from '../../../easyFramework/network/ServerCtrJSF';
import TableDataService from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { playerDataStore } from '../../comm/UserData';
import { UtilGame } from '../../comm/UtilGame';
import { PropItem, PropItemFlag } from '../Dialog/PropItem';

const { ccclass, property } = _decorator;



@ccclass('firstRecharge')
export class FirstRechargeDialogController extends BaseView {
    @property({ type: Node, tooltip: "奖励列表" }) giftScroll: Node = null!;

    _isFirstRecharge = 0;

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this._fn_xe)
    }

    show(args: any) {
        super.show(args)

        let firstRechargeConfig = TableDataService.ins()._fn_lz(Const.Tables.shopTable, "type", 2)
        this.giftScroll.removeAllChildren()
        firstRechargeConfig.price3.forEach((rewardEntry: any, rewardIndex: number) => {
            this.addPrefab(Const.Prefabs.PropItem, this.giftScroll, (rewardNode: any) => {
                rewardNode.getComponent(PropItem).setData(rewardEntry[0], PropItemFlag.TouchInfo | PropItemFlag.ShowNum, rewardEntry[1])
                rewardNode.getComponent(PropItem).setSize(140)
            })
        });

        ServerCtrJSF._fn_hp()._fn_aat(GameStorage._fn_rb(Const.MoneyKeys.FirstCharge))
    }

    _fn_oq() {
        if (this._isFirstRecharge == 1) {
            find("root/btnReceive/Label", this.node)!.getComponent(Label)!.string = UtilGame.language("receive")
        } else if (this._isFirstRecharge == 0) {
            find("root/btnReceive/Label", this.node)!.getComponent(Label)!.string = "￥6"
        } else if (this._isFirstRecharge == 2) {
            find("root/btnReceive/Label", this.node)!.getComponent(Label)!.string = "已领取"
        }
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
        let firstRechargeRecord = ServerCtrJSF._fn_hp()._fn_mu(userDataPayload, Const.MoneyKeys.FirstCharge)
        if (firstRechargeRecord) {
            if (firstRechargeRecord.val instanceof Number) {
                this._isFirstRecharge = firstRechargeRecord.val
            } else {
                if (firstRechargeRecord.val != "") {
                    this._isFirstRecharge = parseInt(firstRechargeRecord.val + "")
                }
            }

            this._fn_oq()
        }
    }

    onClickGet(event: any, rewardPayload: any) {
        if (this._isFirstRecharge == 1) {
            let firstRechargeConfig = TableDataService.ins()._fn_lz(Const.Tables.shopTable, "type", 2)
            this._fn_wc(firstRechargeConfig.price3)
        } else if (this._isFirstRecharge == 0) {
            GameStorage._fn_aey(Const.MoneyKeys.FirstCharge, 1)
            ServerCtrJSF._fn_hp()._fn_aat(GameStorage._fn_rb(Const.MoneyKeys.FirstCharge))
        }
    }

    _fn_wc(rewardList: any) {
        GameStorage._fn_aey(Const.MoneyKeys.FirstCharge, 2)
        playerDataStore._fn_jk(rewardList,null,null)
        this._isFirstRecharge = 2
        this._fn_oq()

    }

}

