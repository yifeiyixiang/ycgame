import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, Layout, Button, director, } from 'cc';
import { Const } from '../../../config/Const';
import { ActivityLockType } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { BaseUiComponent } from '../../../easyFramework/mgr/comm';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { CdComponent, CDType } from '../../../easyFramework/utils/CdComponent';
import { playerDataStore } from '../../comm/UserData';

const { ccclass, property } = _decorator;



@ccclass('RewardActivityDialog')
export class RewardActivityDialog extends BaseView {
    @property({ type: Node, tooltip: "滚动列表" }) giftScroll: Node = null!;
    @property({ type: Node }) item: Node = null!;

    _MonthCardVal: any = null
    _clickItem = null

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)
    }

    show(args: any) {
        super.show(args)
        let activityArr = TableDataService.ins().getTable(Const.Tables.saleshop_totalRecharge)
        for (let i = 0; i < activityArr.length; i++) {
            let activity = activityArr[i]
            let lockData = TableDataService.ins().getTableValueByID(Const.Tables.lockActivity_item, activity.lockType)

        }

        this.scrollViewSetData(this.giftScroll, activityArr, this.initItem, this)

    }

    initItem(itemUI: Node, item: any, index: number, self: BaseUiComponent) {
        itemUI.getChildByName("infoLabel")!.getComponent(Label)!.string = item.typename
        if (RewardActivityDialog.checkActivityLock(item)) {
            self.addButtonHander(itemUI, self.node, "RewardActivityDialog", "openActivity", item)
            itemUI.getChildByName("lockLabel")!.getComponent(Label)!.string = ""
            let lockData = TableDataService.ins().getTableValueByID(Const.Tables.lockActivity_item, item.lockType)
            itemUI.getChildByName("timeLabel")!.getComponent(CdComponent)!.setCD(CDType.CDCondition, lockData.dataKey, lockData.activityTime)
        } else {
            let lockData = TableDataService.ins().getTableValueByID(Const.Tables.lockActivity_item, item.lockType)
            itemUI.getChildByName("lockLabel")!.getComponent(Label)!.string = "达到等级" + lockData.openLevel + "解锁"
            itemUI.getChildByName("timeLabel")!.getComponent(Label)!.string = ""
            self.clearButtonHander(itemUI)
        }
    }

    openActivity(event: any, data: any) {
        UiLayerService.instance.showDialog(data.openDialog, { activityData: data })
    }

    public static checkActivityLock(activity: any) {
        let lockData = TableDataService.ins().getTableValueByID(Const.Tables.lockActivity_item, activity.lockType)
        if (lockData.cdType == ActivityLockType.type_Level) {
            if (playerDataStore.roleLv >= lockData.openLevel) {
                if (playerDataStore.checkLimitTime(lockData.dataKey, lockData.activityTime * 60 * 1000) > 0) {
                    return true
                }
            }
        }
        return false
    }


}

