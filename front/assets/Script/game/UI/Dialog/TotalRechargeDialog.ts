import { _decorator, Node, Sprite, Label, find } from 'cc';
import { Const } from '../../../config/Const';
import BaseView from '../../../easyFramework/mgr/BaseView';
import TableDataService from '../../../easyFramework/other/tables';
import { CdComponent, CDType } from '../../../easyFramework/utils/CdComponent';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
import { playerDataStore } from '../../comm/UserData';
import { PropItem, PropItemFlag } from './PropItem';
const { ccclass, property } = _decorator;


@ccclass('TotalRechargeDialog')
export class TotalRechargeDialog extends BaseView {
    @property({ type: Node }) dataContent: Node = null!;
    @property({ type: Node }) item: Node = null!;

    @property({ type: Node }) timelabel: Node = null!;
    @property({ type: Label }) titlelabel: Label = null!;


    _priceType = 0
    _priceNum = 0

    _isCanBuyAll = true
    _activityData: any = null!
    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)
    }

    show(args: any) {
        super.show(args)
        this._activityData = this._layerData.activityData
        this.initShop(this._activityData.typeson)

    }

    initShop(type: number) {

        let lockData = TableDataService.ins().getTableValueByID(Const.Tables.lockActivity_item, this._activityData.lockType)
        find("root/timelabel", this.node)!.getComponent(CdComponent)!.setCD(CDType.CDCondition, lockData.dataKey, lockData.activityTime)
        let shopdata = TableDataService.ins().getTableValuesByType(Const.Tables.saleshop_RechargeReward, "type", this._activityData.typeson)
        this.titlelabel.string = this._activityData.typename
        this.setScrollViewData(this.dataContent, shopdata, this.item, this.initItem, this)
    }

    initItem(itemUi: Node, data: any, index: number, self: TotalRechargeDialog) {
        find("Layout", itemUi)!.removeAllChildren()
        let reward = data.reward
        reward.forEach((element: any) => {
            self.addPrefab(Const.Prefabs.PropItem, find("Layout", itemUi)!, (propItem: Node) => {
                propItem.getComponent(PropItem)!.setData(element[0], PropItemFlag.ShowNum, element[0])!.setSize(80)
            })
        });
        find("infoLabel", itemUi)!.getComponent(Label)!.string = data.typename
        let btnFree = find("btnFree", itemUi)!
        let receivelabel = find("receivelabel", itemUi)!
        let receiveNum = playerDataStore.getActivityReceiveTime(data.dataKey)
        if (receiveNum < data.LimitTime) {
            btnFree.active = true
            receivelabel.active = false
            self.addButtonHander(btnFree, self.node, "TotalRechargeDialog", "onClickFreeSaleShop", data)
        } else {
            btnFree.active = false
            receivelabel.active = true
        }
    }

    onClickFreeSaleShop(event: any, data: any) {
        data.reward.forEach((element: any) => {
            mergeBoardStateStore.addPropNum(element[0], element[1])
        });
        playerDataStore.setActivityReceiveTime(data.dataKey)

        this.initItem(event.target.parent, data, 0, this)
    }
}

