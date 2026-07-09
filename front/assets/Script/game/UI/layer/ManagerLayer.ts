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
        this.bindButton(this.btnClose, this._fn_sz);
    }

    show(args: any) {
        super.show(args);

        this._fn_ph();

        this.on(GD.event.managerCreateTask, this._fn_sa, this);

    }

    close() {
        super.close();

        this.off(GD.event.managerCreateTask, this);
    }

    _fn_sa() {
        this._fn_acz(this.taskList);
    }

    _fn_ph() {
        let managerTableRows = TableDataService.ins()._fn_lt(Const.Tables.manager);
        this._fn_adc(this.taskList, managerTableRows, this._fn_zv.bind(this));
        let firstUnclaimedIndex = -1;
        for (let managerIndex = 0; managerIndex < mergeBoardStateStore.managerArr.length; managerIndex++) {
            let managerState = mergeBoardStateStore.managerArr[managerIndex];
            if (!managerState.get) {
                firstUnclaimedIndex = managerIndex;
                break;
            }
        }
        this._fn_ada(this.taskList, firstUnclaimedIndex + 4, 0.6);
    }

    _fn_zv(managerCellNode: Node, managerConfig: any) {
        // @ts-ignore
        managerCellNode.index = managerConfig.id - 1;
        this.bindButton(managerCellNode, this._fn_ui);
        this._fn_ago(find("id", managerCellNode), managerConfig.id);
        this._fn_ago(find("info", managerCellNode), managerInfoTypeArr[managerConfig.taskType - 1].format(managerConfig.p1));
        let costPropId = managerConfig.price[0];
        let costPropCount = managerConfig.price[1];
        let costPropConfig = TableDataService.ins()._fn_ly(Const.Tables.prop, costPropId);
        this._fn_agl(find("prop/icon", managerCellNode)?.getComponent(Sprite)!, Const.resPath.icon + costPropConfig.icon);

        this._fn_ago(find("prop/num", managerCellNode), "x" + costPropCount);

        let lockNode = find("lock", managerCellNode)!;
        let doneNode = find("done", managerCellNode)!;
        let getNode = find("get", managerCellNode)!;
        doneNode.active = false;
        getNode.active = false;

        let managerState = mergeBoardStateStore.managerArr[managerConfig.id - 1];

        if (managerState) {
            lockNode.active = false;
            let progressValue = mergeBoardStateStore._fn_ii(managerState);
            this._fn_afm(find("progress", managerCellNode)!, progressValue / managerConfig.p1);
            this._fn_ago(find("progress/num", managerCellNode), progressValue + "/" + managerConfig.p1);
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

    _fn_ui(btn: Button) {
        // @ts-ignore
        let managerIndex = btn.node.index;
        let managerState = mergeBoardStateStore.managerArr[managerIndex];
        if (!managerState) {
            return;
        }
        let managerConfig = TableDataService.ins()._fn_ly(Const.Tables.manager, managerState.id);
        if (mergeBoardStateStore._fn_ii(managerState) >= managerConfig.p1 && !managerState.get) {
            mergeBoardStateStore._fn_sb(managerIndex,UtilPub._fn_dp(find("prop/icon",btn.node!)!));
            this._fn_acy(this.taskList, managerIndex);
        }
    }

    _fn_sz() {
        this.close();
    }


}

