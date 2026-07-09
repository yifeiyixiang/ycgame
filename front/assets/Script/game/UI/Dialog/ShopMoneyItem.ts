import { _decorator, Node, Prefab, instantiate, Sprite, Label, UITransform, v3, find } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { PriceType, GoodsType } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import TableDataService from '../../../easyFramework/other/tables';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
import { playerDataStore } from '../../comm/UserData';
const { ccclass, property } = _decorator;



@ccclass('ShopMoneyItem')
export class ShopMoneyItem extends BaseView {
    @property({ type: Node, tooltip: "背景" }) bg: Node = null!;
    @property({ type: Node, tooltip: "icon" }) icon: Node = null!;
    @property({ type: Label, tooltip: "数量" }) numLab: Label = null!;
    @property({ type: Label, tooltip: "价格" }) priceLab: Label = null!;

    _priceType = 0
    _priceNum = 0


    start() {
        this.setData(this._layerData.data)
    }

    show(args: any) {
        super.show(args)
    }

    setData(data: any) {
        let price3 = data.price3[0]
        if (data.first && data.first != "") {
            let first = data.first[0]
            find("sc", this.node)!.active = true
            find("sc/moreNum", this.node)!.getComponent(Label)!.string = "首充得 " + first[1]
        } else {
            find("sc", this.node)!.active = false
            find("sc/moreNum", this.node)!.getComponent(Label)!.string = ""
        }

        this.numLab.string = price3[1]
        let _fn_fa = (node: any) => {
            this._fn_aex(node, 120)
        }
        this._fn_agk(this.icon.getComponent(Sprite)!, Const.resPath.icon + data.icon, _fn_fa)

        if (data.recharge && data.recharge > 0) {
            let rechargeData = TableDataService.ins()._fn_ly(Const.Tables.recharge, data.recharge)
            this.priceLab.string = "￥" + rechargeData.cash
            find("btnbg/Layout/prop_diamond1", this.node)!.active = false
        } else {
            let priceData = data.price2[0]
            if (priceData.length >= 2) {
                this._priceType = parseInt(priceData[0])
                this._priceNum = parseInt(priceData[1]) * playerDataStore.buyPowerTime
            }
            if (this._priceType == PriceType.RMB) {
                this.priceLab.string = "￥" + priceData[1]
                find("btnbg/Layout/prop_diamond1", this.node)!.active = false
            } else if (this._priceType == PriceType.Diamonds) {
                find("btnbg/Layout/prop_diamond1", this.node)!.active = true
                this.priceLab.string = "X" + this._priceNum
            }
        }
    }

    onClickBuy() {
        let shopData = this._layerData.data

        if (this._priceType == PriceType.Diamonds) {
            if (playerDataStore._fn_bg(TableDataService.ins().config[Const.config.diamonsPower][1] * playerDataStore.buyPowerTime)) {

                playerDataStore._fn_jk(GoodsType.Power + "," + TableDataService.ins().config[Const.config.diamonsPower][0], v3(0, 0, 0), v3(0, 0, 0))
                playerDataStore._fn_b()
                this.emit(GD.event.updateMoney)
                this.setData(this._layerData.data)
                mergeBoardStateStore._fn_h(Const.ManagerTypes.diamondBuyPower);
            }
            return
        }
        console.log("----等待支付接入")
        this._fn_sq()
    }


    _fn_sq() {
        playerDataStore._fn_jk(this._layerData.data.price3, null, null)
        if (this._layerData.data.first && this._layerData.data.first != "") {
            playerDataStore._fn_jk(this._layerData.data.first, null, null)
            this.emit(GD.event.updateMoney)
        }
    }
}

