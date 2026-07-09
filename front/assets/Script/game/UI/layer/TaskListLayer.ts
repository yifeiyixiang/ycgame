import { Button, find, instantiate, Node, ProgressBar, Sprite, tween, v3, Vec3, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
const { ccclass, property } = _decorator;

@ccclass('TaskListLayer')
export class TaskListLayer extends BaseView {

    @property({ type: Node })
    btnClose: Node = null!;
    @property({ type: Node })
    listNode: Node = null!;

    @property({ type: Node })
    listContent: Node = null!;

    @property({ type: Node })
    tempBg: Node = null!;


    @property({ type: Node })
    tempItem: Node = null!;


    onLoad() {
        this.bindButton(this.btnClose, this._fn_sz);
    }

    show(args: any) {
        super.show(args);
        this._fn_ph();
    }

    _fn_ph() {
        let taskGroupMap = mergeBoardStateStore._fn_dx();

        this.listContent.removeAllChildren()
        for (const taskGroupId in taskGroupMap) {
            if (Object.prototype.hasOwnProperty.call(taskGroupMap, taskGroupId)) {
                const taskGroup = taskGroupMap[taskGroupId];
                let taskGroupNode = instantiate(this.tempBg)
                taskGroupNode.position = Vec3.ZERO
                taskGroupNode.parent = this.listContent
                taskGroupNode.active = true
                let taskUnlockConfig = TableDataService.ins()._fn_ly(Const.Tables.taskUnlock, parseInt(taskGroupId))
                this._fn_ago(find("title", taskGroupNode)!, taskUnlockConfig.name);
                let taskProgress = mergeBoardStateStore._fn_mk(parseInt(taskGroupId))
                this._fn_ago(find("ProgressBar/roomBar/Label", taskGroupNode)!, Math.floor(taskProgress * 100) + "%");
                find("ProgressBar/roomBar", taskGroupNode)!.getComponent(ProgressBar)!.progress = taskProgress
                for (let taskIndex = 0; taskIndex < taskGroup.length; taskIndex++) {
                    let taskItemData = taskGroup[taskIndex];
                    let taskItemNode = instantiate(this.tempItem)
                    taskItemNode.position = Vec3.ZERO
                    taskItemNode.parent = find("Layout", taskGroupNode)!
                    this._fn_zv(taskItemNode, taskItemData)
                }
                let giftBtn = find("ProgressBar/gift", taskGroupNode)!
                let btnReceive = find("btnReceive", taskGroupNode)!

                this.bindButton(giftBtn, () => {

                    let giftWorldPos = UtilPub._fn_dp(giftBtn)
                    UiLayerService.instance._fn_ahg(Const.Dialogs.RewardPopupItemController, { RewardItemRecord: taskUnlockConfig.taskReward, pos: giftWorldPos })
                })
                if (taskGroup.length > 0) {
                    btnReceive.active = false
                } else {
                    btnReceive.active = true

                    this.bindButton(btnReceive, () => {
                        for (let rewardIndex = 0; rewardIndex < taskUnlockConfig.taskReward.length; rewardIndex++) {
                            const rewardEntry = taskUnlockConfig.taskReward[rewardIndex];
                            mergeBoardStateStore._fn_m(rewardEntry[0], rewardEntry[1])
                        }
                        mergeBoardStateStore._fn_ags(parseInt(taskGroupId))
                        this._fn_ph()
                    })
                }
            }
        }


    }

    _fn_zv(taskItemNode: Node, taskData: any) {
        let propSlotNodes = find("propLayer", taskItemNode)!.children;
        let isTaskReady = true
        propSlotNodes.forEach((propItem: Node, propIndex: number) => {
            let requiredProp = taskData.propArr[propIndex];
            if (requiredProp) {
                propItem.active = true;
                let propConfig = TableDataService.ins()._fn_ly(Const.Tables.prop, requiredProp.id);
                if (!propConfig) {
                    propItem.active = false;
                    return;
                }
                this._fn_agl(find("icon", propItem)!.getComponent(Sprite)!, Const.resPath.icon + propConfig.icon);
                let ownedPropInfo = mergeBoardStateStore._fn_kg(requiredProp.id);
                let displayCount = ownedPropInfo.num;
                if (displayCount >= requiredProp.num) {
                    displayCount = requiredProp.num;
                }
                this._fn_ago(find("num", propItem), displayCount + "/" + requiredProp.num);
                let bgNode = find("bg", propItem)!;
                let gouNode = find("gou", propItem)!;
                if (ownedPropInfo.num >= requiredProp.num) {
                    gouNode.active = true;
                    bgNode.active = true;
                } else {
                    gouNode.active = false;
                    bgNode.active = false;
                    isTaskReady = false
                }
                // @ts-ignore
                propItem.propRow = propConfig;
                this.bindButton(propItem, this._fn_uk);

            } else {
                propItem.active = false;
            }
        });

        this._fn_ago(find("awardLayer/prop/num", taskItemNode)!, taskData.starNum);

        this._fn_ago(find("id", taskItemNode)!, "id" + taskData.id);


        let btnRefresh = find("btnRefresh", taskItemNode)!;
        let btnFinish = find("btnFinish", taskItemNode)!;


        // @ts-ignore
        btnRefresh.task = taskData;
        // @ts-ignore
        btnFinish.task = taskData;

        this.bindButton(btnRefresh, this._fn_tj);
        this.bindButton(btnFinish, this._fn_tc);




        if (isTaskReady) {
            btnFinish.active = true
            btnRefresh.active = false
        } else {
            btnFinish.active = false
            btnRefresh.active = true
        }

        if (mergeBoardStateStore._fn_hj() >= 8) {

        } else {
            btnRefresh.active = false;
            btnFinish.active = false

        }
    }


    _fn_uk(btn: Button) {
        // @ts-ignore
        let propRow = btn.node.propRow;
        mergeBoardStateStore._fn_wh(propRow.id);
    }


    _fn_tc(btn: Button) {

        // @ts-ignore
        let taskData = btn.node.task;

        this.emit(GD.event.onClickTaskDone, { node: btn.node })

        this.close()
    }


    _fn_tj(btn: Button) {
        this.close()
        return
        // @ts-ignore
        let taskData = btn.node.task;

        mergeBoardStateStore._fn_we("刷新任务", (isAward: boolean) => {
            if (isAward) {
                mergeBoardStateStore.refreshTask(taskData);
                this._fn_ph();
            }
        });
    }

    _fn_sz() {
        this.close();
    }

}

