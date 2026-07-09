import { _decorator, Node, Prefab, instantiate, Sprite, Label, UITransform, v3, find } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { BaseUiComponent } from '../../../easyFramework/mgr/comm';
import TimeCtrJSF from '../../../easyFramework/network/TimeCtrJSF';
import TableDataService from '../../../easyFramework/other/tables';
import { CdComponent, CDType } from '../../../easyFramework/utils/CdComponent';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
import { playerDataStore } from '../../comm/UserData';
import { PropItem, PropItemFlag } from './PropItem';
const { ccclass, property } = _decorator;



@ccclass('SaleDailyDialog')
export class SaleDailyDialog extends BaseView {
    @property({ type: Node }) dataContent: Node = null!;
    @property({ type: Node }) item: Node = null!;

    @property({ type: Node }) timelabel: Node = null!;
    @property({ type: Label }) titlelabel: Label = null!;


    _priceType = 0
    _priceNum = 0

    _isCanBuyAll = true

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this._fn_xe)

        this.addButtonHander(find("root/btnday", this.node)!, this.node, "SaleDailyDialog", "initData", 1)
        this.addButtonHander(find("root/btnWeek", this.node)!, this.node, "SaleDailyDialog", "initData", 2)
        this.addButtonHander(find("root/btnMonth", this.node)!, this.node, "SaleDailyDialog", "initData", 3)
    }

    show(args: any) {
        super.show(args)
        this._fn_oz(1)

    }

    initData(event: any, data: number) {
        this._fn_oz(data)
    }

    _fn_oz(type: number) {
        let shopdata = TableDataService.ins()._fn_ly(Const.Tables.saleShop, type)
        this.titlelabel.string = shopdata.typename

        this.timelabel.getComponent(CdComponent)!.setCD(CDType.CDIneterVal, shopdata.dataKey, shopdata.cdTime)

        let data = TableDataService.ins()._fn_mb(Const.Tables.saleShopItem, "type", shopdata.typeson)
        if (data.length > 0) {
            this._isCanBuyAll = true
            this._fn_agd(this.dataContent, data, this.item, this._fn_oc, this)
        }

        if (shopdata.recharge > 0) {
            let rechargeData = TableDataService.ins()._fn_ly(Const.Tables.recharge, shopdata.recharge)
            let btnBuyAll = find("root/btnBuyAll", this.node)!
            find("Label", btnBuyAll)!.getComponent(Label)!.string = "￥" + rechargeData.cash
            if (this._isCanBuyAll) {
                this.addButtonHander(btnBuyAll, this.node, "SaleDailyDialog", "onClickBtnBuyAll", shopdata)
                btnBuyAll.getComponent(Sprite)!.grayscale = false
            } else {
                this._fn_ct(btnBuyAll)
                btnBuyAll.getComponent(Sprite)!.grayscale = true
            }
        }
    }

    onClickBtnBuyAll(event: any, shopdata: any) {
        let data = TableDataService.ins()._fn_mb(Const.Tables.saleShopItem, "type", shopdata.typeson)
        if (data.length > 0) {
            for (let index = 0; index < data.length; index++) {
                this.onClickFreeSaleShop(null, data[index])
            }
        }
        this._fn_oz(shopdata.id)
    }

    _fn_oc(itemUi: Node, data: any, index: number, self: SaleDailyDialog) {
        find("Layout", itemUi)!.removeAllChildren()
        let reward = data.reward
        reward.forEach((element: any) => {
            self.addPrefab(Const.Prefabs.PropItem, find("Layout", itemUi)!, (propItem: Node) => {
                propItem.getComponent(PropItem)!.setData(element[0], PropItemFlag.ShowNum, element[0])!.setSize(80)
            })
        });
        let btnFree = find("btnyellow", itemUi)!
        let btnBuy = find("btnGreenbg", itemUi)!
        let time = playerDataStore._fn_jz(data.dataKey, data.cdTime)
        if (data.recharge > 0) {
            btnFree.active = false
            btnBuy.active = true
            let btnLabel = btnBuy.getChildByName("Label")!.getComponent(Label)!
            if (time < data.buyUpLimit) {
                self.addButtonHander(btnBuy, self.node, "SaleDailyDialog", "onClickBuySaleShop", data)
                let rechargeData = TableDataService.ins()._fn_ly(Const.Tables.recharge, data.recharge)
                btnLabel.string = "￥" + rechargeData.cash
            } else {
                btnLabel.string = "已领取"
                self._fn_ct(btnBuy)
                self._isCanBuyAll = false
            }
        } else {
            btnFree.active = true
            btnBuy.active = false
            if (time < data.buyUpLimit) {
                self.addButtonHander(btnFree, self.node, "SaleDailyDialog", "onClickFreeSaleShop", data)
            } else {
                btnFree.getChildByName("Label")!.getComponent(Label)!.string = "已领取"
                self._fn_ct(btnFree)
            }
        }
    }

    onClickBuySaleShop(event: any, data: any) {
        this.onClickFreeSaleShop(event, data)
    }

    onClickFreeSaleShop(event: any, data: any) {
        data.reward.forEach((element: any) => {
            mergeBoardStateStore._fn_m(element[0], element[1])
        });
        playerDataStore._fn_afo(data.dataKey, data.cdTime)
        this._fn_oz(data.type)

    }
}

