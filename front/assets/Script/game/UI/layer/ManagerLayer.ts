import { Button, find, Node, Sprite, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import TableDataService from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { mergeBoardStateStore, managerInfoTypeArr } from '../../comm/mergeBoardModel';
const { ccclass, property } = _decorator;

@ccclass('ManagerLayer')
export class ManagerLayer extends BaseView {

    @property({ type: Node })
    btnClose: Node = null!;

    @property({ type: Node })
    taskList: Node = null!;

    start() {
        this.bindButton(this.btnClose, this.onClickBtnClose);
    }

    show(args: any) {
        super.show(args);

        this.initUI();

        this.on(GD.event.managerCreateTask, this.managerCreateTaskRet, this);

    }

    close() {
        super.close();

        this.off(GD.event.managerCreateTask, this);
    }

    managerCreateTaskRet() {
        this.scrollViewRefreshList(this.taskList);
    }

    initUI() {
        let managerTableRows = TableDataService.ins().getTable(Const.Tables.manager);
        this.scrollViewSetData(this.taskList, managerTableRows, this.refreshTaskItem.bind(this));
        let firstUnclaimedIndex = -1;
        for (let managerIndex = 0; managerIndex < mergeBoardStateStore.managerArr.length; managerIndex++) {
            let managerState = mergeBoardStateStore.managerArr[managerIndex];
            if (!managerState.get) {
                firstUnclaimedIndex = managerIndex;
                break;
            }
        }
        this.scrollViewScrollToIndex(this.taskList, firstUnclaimedIndex + 4, 0.6);
    }

    refreshTaskItem(managerCellNode: Node, managerConfig: any) {
        // @ts-ignore
        managerCellNode.index = managerConfig.id - 1;
        this.bindButton(managerCellNode, this.onClickTaskItem);
        this.setString(find("id", managerCellNode), managerConfig.id);
        this.setString(find("info", managerCellNode), managerInfoTypeArr[managerConfig.taskType - 1].format(managerConfig.p1));
        let costPropId = managerConfig.price[0];
        let costPropCount = managerConfig.price[1];
        let costPropConfig = TableDataService.ins().getTableValueByID(Const.Tables.prop, costPropId);
        this.setSpriteFrame2(find("prop/icon", managerCellNode)?.getComponent(Sprite)!, Const.resPath.icon + costPropConfig.icon);

        this.setString(find("prop/num", managerCellNode), "x" + costPropCount);

        let lockNode = find("lock", managerCellNode)!;
        let doneNode = find("done", managerCellNode)!;
        let getNode = find("get", managerCellNode)!;
        doneNode.active = false;
        getNode.active = false;

        let managerState = mergeBoardStateStore.managerArr[managerConfig.id - 1];

        if (managerState) {
            lockNode.active = false;
            let progressValue = mergeBoardStateStore.getManagerVal(managerState);
            this.setProgressBar(find("progress", managerCellNode)!, progressValue / managerConfig.p1);
            this.setString(find("progress/num", managerCellNode), progressValue + "/" + managerConfig.p1);
            if (progressValue >= managerConfig.p1) {
                if (managerState.get) {
                    doneNode.active = true;
                } else {
                    getNode.active = true;
                }
            }
        } else {

            lockNode.active = true;
        }
    }

    onClickTaskItem(btn: Button) {
        // @ts-ignore
        let managerIndex = btn.node.index;
        let managerState = mergeBoardStateStore.managerArr[managerIndex];
        if (!managerState) {
            return;
        }
        let managerConfig = TableDataService.ins().getTableValueByID(Const.Tables.manager, managerState.id);
        if (mergeBoardStateStore.getManagerVal(managerState) >= managerConfig.p1 && !managerState.get) {
            mergeBoardStateStore.managerGetAward(managerIndex,UtilPub.convertToWorldSpace(find("prop/icon",btn.node!)!));
            this.scrollViewRefreshItemUIByIndex(this.taskList, managerIndex);
        }
    }

    onClickBtnClose() {
        this.close();
    }


}

