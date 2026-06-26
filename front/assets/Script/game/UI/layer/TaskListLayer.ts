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
        this.bindButton(this.btnClose, this.onClickBtnClose);
    }

    show(args: any) {
        super.show(args);
        this.initUI();
    }

    initUI() {
        let taskGroupMap = mergeBoardStateStore.createTask2();

        this.listContent.removeAllChildren()
        for (const taskGroupId in taskGroupMap) {
            if (Object.prototype.hasOwnProperty.call(taskGroupMap, taskGroupId)) {
                const taskGroup = taskGroupMap[taskGroupId];
                let taskGroupNode = instantiate(this.tempBg)
                taskGroupNode.position = Vec3.ZERO
                taskGroupNode.parent = this.listContent
                taskGroupNode.active = true
                let taskUnlockConfig = TableDataService.ins().getTableValueByID(Const.Tables.taskUnlock, parseInt(taskGroupId))
                this.setString(find("title", taskGroupNode)!, taskUnlockConfig.name);
                let taskProgress = mergeBoardStateStore.getTaskProgress(parseInt(taskGroupId))
                this.setString(find("ProgressBar/roomBar/Label", taskGroupNode)!, Math.floor(taskProgress * 100) + "%");
                find("ProgressBar/roomBar", taskGroupNode)!.getComponent(ProgressBar)!.progress = taskProgress
                for (let taskIndex = 0; taskIndex < taskGroup.length; taskIndex++) {
                    let taskItemData = taskGroup[taskIndex];
                    let taskItemNode = instantiate(this.tempItem)
                    taskItemNode.position = Vec3.ZERO
                    taskItemNode.parent = find("Layout", taskGroupNode)!
                    this.refreshTaskItem(taskItemNode, taskItemData)
                }
                let giftBtn = find("ProgressBar/gift", taskGroupNode)!
                let btnReceive = find("btnReceive", taskGroupNode)!

                this.bindButton(giftBtn, () => {

                    let giftWorldPos = UtilPub.convertToWorldSpace(giftBtn)
                    UiLayerService.instance.showDialog(Const.Dialogs.RewardPopupItemController, { RewardItemRecord: taskUnlockConfig.taskReward, pos: giftWorldPos })
                })
                if (taskGroup.length > 0) {
                    btnReceive.active = false
                } else {
                    btnReceive.active = true

                    this.bindButton(btnReceive, () => {
                        for (let rewardIndex = 0; rewardIndex < taskUnlockConfig.taskReward.length; rewardIndex++) {
                            const rewardEntry = taskUnlockConfig.taskReward[rewardIndex];
                            mergeBoardStateStore.addPropNum(rewardEntry[0], rewardEntry[1])
                        }
                        mergeBoardStateStore.setTaskGetReward(parseInt(taskGroupId))
                        this.initUI()
                    })
                }
            }
        }


    }

    refreshTaskItem(taskItemNode: Node, taskData: any) {
        let propSlotNodes = find("propLayer", taskItemNode)!.children;
        let isTaskReady = true
        propSlotNodes.forEach((propItem: Node, propIndex: number) => {
            let requiredProp = taskData.propArr[propIndex];
            if (requiredProp) {
                propItem.active = true;
                let propConfig = TableDataService.ins().getTableValueByID(Const.Tables.prop, requiredProp.id);
                if (!propConfig) {
                    propItem.active = false;
                    return;
                }
                this.setSpriteFrame2(find("icon", propItem)!.getComponent(Sprite)!, Const.resPath.icon + propConfig.icon);
                let ownedPropInfo = mergeBoardStateStore.getRoomDataHasInfoById(requiredProp.id);
                let displayCount = ownedPropInfo.num;
                if (displayCount >= requiredProp.num) {
                    displayCount = requiredProp.num;
                }
                this.setString(find("num", propItem), displayCount + "/" + requiredProp.num);
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
                this.bindButton(propItem, this.onClickTaskPropItem);

            } else {
                propItem.active = false;
            }
        });

        this.setString(find("awardLayer/prop/num", taskItemNode)!, taskData.starNum);

        this.setString(find("id", taskItemNode)!, "id" + taskData.id);


        let btnRefresh = find("btnRefresh", taskItemNode)!;
        let btnFinish = find("btnFinish", taskItemNode)!;


        // @ts-ignore
        btnRefresh.task = taskData;
        // @ts-ignore
        btnFinish.task = taskData;

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
        let taskData = btn.node.task;

        this.emit(GD.event.onClickTaskDone, { node: btn.node })

        this.close()
    }


    onClickBtnRefresh(btn: Button) {
        this.close()
        return
        // @ts-ignore
        let taskData = btn.node.task;

        mergeBoardStateStore.openAd("刷新任务", (isAward: boolean) => {
            if (isAward) {
                mergeBoardStateStore.refreshTask(taskData);
                this.initUI();
            }
        });
    }

    onClickBtnClose() {
        this.close();
    }

}

