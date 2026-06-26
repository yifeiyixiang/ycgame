import { Button, find, instantiate, Node, ProgressBar, Sprite, tween, v3, Vec3, _decorator,Label } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
import { GameHttpClient } from '../../../../typeScript/net/HttpClient';
import { playerDataStore } from '../../comm/UserData';
import { TaskProgressRecord } from '../../../../typeScript/gameData';
import { TaskItemCellController } from './item/taskItem';
const { ccclass, property } = _decorator;

@ccclass('TaskView')
export class TaskView extends BaseView {

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
        this.bindButton(this.btnClose, this.onClickBtnClose);
    }

    onEnable() {
        this.on(GD.event.updateGame, this.refresh)
    }

    onDisable() {
        this.off(GD.event.updateGame, this)
    }

    show(args: any) {
        super.show(args);


        GameHttpClient.getInstance().sendGetTaskList();
    }

    refresh(){
         for (let cellIndex = 0; cellIndex < this.listContent.children.length; cellIndex++) {
            const taskCellNode = this.listContent.children[cellIndex];
            if (taskCellNode){
                taskCellNode.active = false;
            }
        }

        for (let taskIndex = 0; taskIndex < playerDataStore.taskDataList.length; taskIndex++) {
            let taskRecord:TaskProgressRecord = playerDataStore.taskDataList[taskIndex];

            let taskCellNode = this.listContent.children[taskIndex];
            if (!taskCellNode){
                taskCellNode = instantiate(this.listContent.children[0])
                taskCellNode.parent = this.listContent;
            }
            taskCellNode.active = true;
            taskCellNode.getComponent(TaskItemCellController).refreshData(taskRecord);
        }
    }

    initUI() {
        let groupedTasksByUnlockId = mergeBoardStateStore.createTask2();

        this.listContent.removeAllChildren()
        for (const unlockId in groupedTasksByUnlockId) {
            if (Object.prototype.hasOwnProperty.call(groupedTasksByUnlockId, unlockId)) {
                const taskGroup = groupedTasksByUnlockId[unlockId];
                let taskGroupNode = instantiate(this.tempBg)
                taskGroupNode.position = Vec3.ZERO
                taskGroupNode.parent = this.listContent
                taskGroupNode.active = true
                let taskUnlockConfig = TableDataService.ins().getTableValueByID(Const.Tables.taskUnlock, parseInt(unlockId))
                this.setString(find("title", taskGroupNode)!, taskUnlockConfig.name);
                let taskProgress = mergeBoardStateStore.getTaskProgress(parseInt(unlockId))
                this.setString(find("ProgressBar/roomBar/Label", taskGroupNode)!, Math.floor(taskProgress * 100) + "%");
                find("ProgressBar/roomBar", taskGroupNode)!.getComponent(ProgressBar)!.progress = taskProgress
                for (let taskItemIndex = 0; taskItemIndex < taskGroup.length; taskItemIndex++) {
                    let taskEntry = taskGroup[taskItemIndex];
                    let taskItemNode = instantiate(this.tempItem)
                    taskItemNode.position = Vec3.ZERO
                    taskItemNode.parent = find("Layout", taskGroupNode)!
                    this.refreshTaskItem(taskItemNode, taskEntry)
                }
                let giftPreviewButton = find("ProgressBar/gift", taskGroupNode)!
                let receiveButton = find("btnReceive", taskGroupNode)!

                this.bindButton(giftPreviewButton, () => {

                    let previewWorldPos = UtilPub.convertToWorldSpace(giftPreviewButton)
                    UiLayerService.instance.showDialog(Const.Dialogs.RewardPopupItemController, { RewardItemRecord: taskUnlockConfig.taskReward, pos: previewWorldPos })
                })
                if (taskGroup.length > 0) {
                    receiveButton.active = false
                } else {
                    receiveButton.active = true

                    this.bindButton(receiveButton, () => {
                        for (let rewardIndex = 0; rewardIndex < taskUnlockConfig.taskReward.length; rewardIndex++) {
                            const rewardEntry = taskUnlockConfig.taskReward[rewardIndex];
                            mergeBoardStateStore.addPropNum(rewardEntry[0], rewardEntry[1])
                        }
                        mergeBoardStateStore.setTaskGetReward(parseInt(unlockId))
                        this.initUI()
                    })
                }
            }
        }


    }

    refreshTaskItem(itemUI: Node, task: any) {
        let propSlots = find("propLayer", itemUI)!.children;
        let isTaskReady = true
        propSlots.forEach((propSlot: Node, slotIndex: number) => {
            let neededProp = task.propArr[slotIndex];
            if (neededProp) {
                propSlot.active = true;
                let propConfig = TableDataService.ins().getTableValueByID(Const.Tables.prop, neededProp.id);
                if (!propConfig) {
                    propSlot.active = false;
                    return;
                }
                this.setSpriteFrame2(find("icon", propSlot)!.getComponent(Sprite)!, Const.resPath.icon + propConfig.icon);
                let ownedPropInfo = mergeBoardStateStore.getRoomDataHasInfoById(neededProp.id);
                let ownedPropCount = ownedPropInfo.num;
                if (ownedPropCount >= neededProp.num) {
                    ownedPropCount = neededProp.num;
                }
                this.setString(find("num", propSlot), ownedPropCount + "/" + neededProp.num);
                let completionBgNode = find("bg", propSlot)!;
                let completedMarkNode = find("gou", propSlot)!;
                if (ownedPropInfo.num >= neededProp.num) {
                    completedMarkNode.active = true;
                    completionBgNode.active = true;
                } else {
                    completedMarkNode.active = false;
                    completionBgNode.active = false;
                    isTaskReady = false
                }
                // @ts-ignore
                propSlot.propRow = propConfig;
                this.bindButton(propSlot, this.onClickTaskPropItem);

            } else {
                propSlot.active = false;
            }
        });

        this.setString(find("awardLayer/prop/num", itemUI)!, task.starNum);

        this.setString(find("id", itemUI)!, "id" + task.id);


        let btnRefresh = find("btnRefresh", itemUI)!;
        let btnFinish = find("btnFinish", itemUI)!;


        // @ts-ignore
        btnRefresh.task = task;
        // @ts-ignore
        btnFinish.task = task;

        this.bindButton(btnRefresh, this.onClickBtnRefresh);
        this.bindButton(btnFinish, this.onClickBtnFinish);




        if (isTaskReady) {
            btnFinish.active = true
            btnRefresh.active = false
        } else {
            btnFinish.active = false
            btnRefresh.active = true
        }

        if (mergeBoardStateStore.getHandIndex() >= 8) {

        } else {
            btnRefresh.active = false;
            btnFinish.active = false

        }
    }


    onClickTaskPropItem(btn: Button) {
        // @ts-ignore
        let propRow = btn.node.propRow;
        mergeBoardStateStore.openPropInfoLayer(propRow.id);
    }


    onClickBtnFinish(btn: Button) {

        // @ts-ignore
        let task = btn.node.task;

        this.emit(GD.event.onClickTaskDone, { node: btn.node })

        this.close()
    }


    onClickBtnRefresh(btn: Button) {
        this.close()
        return
        // @ts-ignore
        let task = btn.node.task;

        mergeBoardStateStore.openAd("刷新任务", (isAward: boolean) => {
            if (isAward) {
                mergeBoardStateStore.refreshTask(task);
                this.initUI();
            }
        });
    }

    onClickBtnClose() {
        this.close();
    }

}

