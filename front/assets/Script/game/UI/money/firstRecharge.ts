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
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)
    }

    show(args: any) {
        super.show(args)

        let fisrtData = TableDataService.ins().getTableValueByKey(Const.Tables.shopTable, "type", 2)
        this.giftScroll.removeAllChildren()
        fisrtData.price3.forEach((element: any, index: number) => {
            this.addPrefab(Const.Prefabs.PropItem, this.giftScroll, (item: any) => {
                item.getComponent(PropItem).setData(element[0], PropItemFlag.TouchInfo | PropItemFlag.ShowNum, element[1])
                item.getComponent(PropItem).setSize(140)
            })
        });

        ServerCtrJSF.GetInstance().reqGetUserDataByKey(GameStorage.Key(Const.MoneyKeys.FirstCharge))
    }

    initRechargeState() {
        if (this._isFirstRecharge == 1) {
            find("root/btnReceive/Label", this.node)!.getComponent(Label)!.string = UtilGame.language("receive")
        } else if (this._isFirstRecharge == 0) {
            find("root/btnReceive/Label", this.node)!.getComponent(Label)!.string = "￥6"
        } else if (this._isFirstRecharge == 2) {
            find("root/btnReceive/Label", this.node)!.getComponent(Label)!.string = "已领取"
        }
    }

    onEnable() {

        director.off(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
        director.on(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
    }

    onDisable() {

        director.off(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
    }

    onMessageEvent(value: any) {
        console.log("onMessageEvent:", value);
        let data = ServerCtrJSF.GetInstance().getUserDataByKey(value, Const.MoneyKeys.FirstCharge)
        if (data) {
            if (data.val instanceof Number) {
                this._isFirstRecharge = data.val
            } else {
                if (data.val != "") {
                    this._isFirstRecharge = parseInt(data.val + "")
                }
            }

            this.initRechargeState()
        }
    }

    onClickGet(event: any, item: any) {
        if (this._isFirstRecharge == 1) {
            let fisrtData = TableDataService.ins().getTableValueByKey(Const.Tables.shopTable, "type", 2)
            this.onVideoBack(fisrtData.price3)
        } else if (this._isFirstRecharge == 0) {
            GameStorage.setInt(Const.MoneyKeys.FirstCharge, 1)
            ServerCtrJSF.GetInstance().reqGetUserDataByKey(GameStorage.Key(Const.MoneyKeys.FirstCharge))
        }
    }

    onVideoBack(item: any) {
        GameStorage.setInt(Const.MoneyKeys.FirstCharge, 2)
        playerDataStore.getProp(item,null,null)
        this._isFirstRecharge = 2
        this.initRechargeState()

    }

}

