import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, Layout, Button, director, LabelOutline, } from 'cc';
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



@ccclass('FreeGiftDialog')
export class FreeGiftDialog extends BaseView {

    _clickItem: any = null

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.close)
    }

    show(args: any) {
        super.show(args)
        let giftData = TableDataService.ins()._fn_md(Const.Tables.giftFree, "type", "1", "typeson", this._layerData.type)
        this._fn_oc(find("root/Node", this.node)!, giftData)

        GamePlatform._fn_aja("主页资源获得免费礼物")
    }

    _fn_oc(itemUI: Node, item: any) {
        itemUI.getChildByName("infoLabel")!.getComponent(Label)!.string = item.info
        let receiveTime = playerDataStore._fn_jz(item.dataKey, item.cdTime)
        find("numLabel", itemUI)!.getComponent(Label)!.string = "Received: " + receiveTime
        find("titleLabel", itemUI)!.getComponent(Label)!.string = item.typename
        find("titleLabel", itemUI)!.getComponent(LabelOutline)!.color = item.fontColor.parseColor()


        this.addButtonHander(itemUI.getChildByName("btnbg")!, this.node, "FreeGiftDialog", "onClickGet", item)


        if (item.typeson == 3) {
            find("numNode", itemUI)!.active = true
            find("numNode/numLabel", itemUI)!.getComponent(Label)!.string = "x" + playerDataStore.styleVoucher
        } else {
            find("numNode", itemUI)!.active = false
        }
        find("numNode", itemUI)!.active = false
        if (item.price3 == "") {
            itemUI.getChildByName("btnbg")!.active = false
            find("titleLabel", itemUI)!.position = v3(0, 0, 0)
        } else {
            let porpID = item.price3.split(",")[0]
            let itemData = TableDataService.ins()._fn_ly(Const.Tables.prop, porpID)
            this._fn_agk(find("propIcon", itemUI)!.getComponent(Sprite)!, Const.resPath.icon + itemData.icon, undefined, 100)
        }








    }

    onClickGet(event: any, item: any) {
        AudioPlaybackService.instance._fn_xc(Const.Audio.btn)
        let receiveTime = playerDataStore._fn_jz(item.dataKey, item.cdTime)
        if (receiveTime >= item.receiveTime) {
            this._fn_aiu("领取次数已用完！")
            return
        }
        if (item.type == 1) {
            this._clickItem = item
            this._fn_ed()
        }
    }

    _fn_ed() {

        let receiveTime = playerDataStore._fn_jz(this._clickItem.dataKey, this._clickItem.cdTime)
        RewardVideoManager._fn_ahy(this._clickItem!.info + "" + receiveTime + " times", () => {
            this._fn_wc(this._clickItem)
        })
    }

    _fn_wc(item: any) {
        playerDataStore._fn_jk(item.price3,  this.node.getComponent(UITransform)!.convertToWorldSpaceAR(v3(0, 0, 0)), v3(0, 0, 0))
        this.emit(GD.event.updateMoney)
        playerDataStore._fn_afo(item.dataKey, item.cdTime)
        let giftData = TableDataService.ins()._fn_md(Const.Tables.giftFree, "type", "1", "typeson", this._layerData.type)
        this._fn_oc(find("root/Node", this.node)!, giftData)
        this._clickItem = null
    }

}

