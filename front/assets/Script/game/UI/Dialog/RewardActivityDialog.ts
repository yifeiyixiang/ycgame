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
        this.bindButton(find("root/btnClose", this.node)!, this._fn_xe)
    }

    show(args: any) {
        super.show(args)
        let activityList = TableDataService.ins()._fn_lt(Const.Tables.saleshop_totalRecharge)
        for (let activityIndex = 0; activityIndex < activityList.length; activityIndex++) {
            let activityConfig = activityList[activityIndex]
            let lockConfig = TableDataService.ins()._fn_ly(Const.Tables.lockActivity_item, activityConfig.lockType)

        }

        this._fn_adc(this.giftScroll, activityList, this._fn_oc, this)

    }

    _fn_oc(activityCellNode: Node, activityConfig: any, activityIndex: number, self: BaseUiComponent) {
        activityCellNode.getChildByName("infoLabel")!.getComponent(Label)!.string = activityConfig.typename
        if (RewardActivityDialog._fn_bd(activityConfig)) {
            self.addButtonHander(activityCellNode, self.node, "RewardActivityDialog", "openActivity", activityConfig)
            activityCellNode.getChildByName("lockLabel")!.getComponent(Label)!.string = ""
            let lockConfig = TableDataService.ins()._fn_ly(Const.Tables.lockActivity_item, activityConfig.lockType)
            activityCellNode.getChildByName("timeLabel")!.getComponent(CdComponent)!.setCD(CDType.CDCondition, lockConfig.dataKey, lockConfig.activityTime)
        } else {
            let lockConfig = TableDataService.ins()._fn_ly(Const.Tables.lockActivity_item, activityConfig.lockType)
            activityCellNode.getChildByName("lockLabel")!.getComponent(Label)!.string = "达到等级" + lockConfig.openLevel + "解锁"
            activityCellNode.getChildByName("timeLabel")!.getComponent(Label)!.string = ""
            self._fn_ct(activityCellNode)
        }
    }

    openActivity(event: any, activityConfig: any) {
        UiLayerService.instance._fn_ahg(activityConfig.openDialog, { activityData: activityConfig })
    }

    public static _fn_bd(activity: any) {
        let lockConfig = TableDataService.ins()._fn_ly(Const.Tables.lockActivity_item, activity.lockType)
        if (lockConfig.cdType == ActivityLockType.type_Level) {
            if (playerDataStore.roleLv >= lockConfig.openLevel) {
                if (playerDataStore._fn_bz(lockConfig.dataKey, lockConfig.activityTime * 60 * 1000) > 0) {
                    return true
                }
            }
        }
        return false
    }


}

