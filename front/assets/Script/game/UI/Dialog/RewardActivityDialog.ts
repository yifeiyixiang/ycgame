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

    _monthCardState: any = null
    _clickItem = null

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)
    }

    show(args: any) {
        super.show(args)
        let activityList = TableDataService.ins().getTable(Const.Tables.saleshop_totalRecharge)
        for (let activityIndex = 0; activityIndex < activityList.length; activityIndex++) {
            let activityConfig = activityList[activityIndex]
            let lockConfig = TableDataService.ins().getTableValueByID(Const.Tables.lockActivity_item, activityConfig.lockType)

        }

        this.scrollViewSetData(this.giftScroll, activityList, this.initItem, this)

    }

    initItem(activityCellNode: Node, activityConfig: any, activityIndex: number, self: BaseUiComponent) {
        activityCellNode.getChildByName("infoLabel")!.getComponent(Label)!.string = activityConfig.typename
        if (RewardActivityDialog.checkActivityLock(activityConfig)) {
            self.addButtonHander(activityCellNode, self.node, "RewardActivityDialog", "openActivity", activityConfig)
            activityCellNode.getChildByName("lockLabel")!.getComponent(Label)!.string = ""
            let lockConfig = TableDataService.ins().getTableValueByID(Const.Tables.lockActivity_item, activityConfig.lockType)
            activityCellNode.getChildByName("timeLabel")!.getComponent(CdComponent)!.setCD(CDType.CDCondition, lockConfig.dataKey, lockConfig.activityTime)
        } else {
            let lockConfig = TableDataService.ins().getTableValueByID(Const.Tables.lockActivity_item, activityConfig.lockType)
            activityCellNode.getChildByName("lockLabel")!.getComponent(Label)!.string = "达到等级" + lockConfig.openLevel + "解锁"
            activityCellNode.getChildByName("timeLabel")!.getComponent(Label)!.string = ""
            self.clearButtonHander(activityCellNode)
        }
    }

    openActivity(event: any, activityConfig: any) {
        UiLayerService.instance.showDialog(activityConfig.openDialog, { activityData: activityConfig })
    }

    public static checkActivityLock(activity: any) {
        let lockConfig = TableDataService.ins().getTableValueByID(Const.Tables.lockActivity_item, activity.lockType)
        if (lockConfig.cdType == ActivityLockType.type_Level) {
            if (playerDataStore.roleLv >= lockConfig.openLevel) {
                if (playerDataStore.checkLimitTime(lockConfig.dataKey, lockConfig.activityTime * 60 * 1000) > 0) {
                    return true
                }
            }
        }
        return false
    }


}

