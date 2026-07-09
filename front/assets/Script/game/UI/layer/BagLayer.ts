import { Button, find, Node, Sprite, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { localText } from '../../../config/localText';
import BaseView from '../../../easyFramework/mgr/BaseView';
import TableDataService from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { mergeBoardStateStore, propIds } from '../../comm/mergeBoardModel';
const { ccclass, property } = _decorator;

@ccclass('BagLayer')
export class BagLayer extends BaseView {

    @property({ type: Node })
    btnClose: Node = null!;

    @property({ type: Node })
    roomList: Node = null!;

    @property({ type: Node })
    capcityNode: Node = null!;

    row: number = 0;
    col: number = 0;
    getOutArr: any;

    start() {
        this.bindButton(this.btnClose, this._fn_sz);
    }

    show(args: any) {
        super.show(args);
        this.row = args.row;
        this.col = args.col;

        this.getOutArr = [];

        this._fn_ph();

    }

    _fn_ph() {
        let bagRoomData = mergeBoardStateStore.roomArr[this.row][this.col];
        let roomGridList = JSON.parse(JSON.stringify(bagRoomData.roomArr));

        let occupiedCount = 0;
        for (let roomGrid of roomGridList) {
            if (roomGrid.id > 0) {
                occupiedCount++;
            }
        }
        this._fn_ago(this.capcityNode, localText.capcity.format(occupiedCount, roomGridList.length));

        let nextGridConfig = TableDataService.ins()._fn_ly(Const.Tables.bagGrid, roomGridList.length + 1);
        if (nextGridConfig) {
            roomGridList.push(null);
        }
        this._fn_adc(this.roomList, roomGridList, this._fn_zd.bind(this));
    }

    _fn_zd(gridCellNode: Node, gridInfo: any, gridIndex: number) {
        let btnAdd = find("btnAdd", gridCellNode)!;
        let iconNode = find("icon", gridCellNode)!;
        let addNode = find("add", gridCellNode)!;
        let btnInfo = find("btnInfo", gridCellNode)!;
        if (gridInfo) {
            addNode.active = false;
            btnAdd.active = false;
            if (gridInfo.id > 0) {
                iconNode.active = true;
                btnInfo.active = true;
                let propConfig = TableDataService.ins()._fn_ly(Const.Tables.prop, gridInfo.id);
                this._fn_agl(iconNode.getComponent(Sprite)!, Const.resPath.icon + propConfig.icon);
                // @ts-ignore
                btnInfo.propRow = propConfig;
                this.bindButton(btnInfo, this._fn_tf);
            } else {
                iconNode.active = false;
                btnInfo.active = false;
            }
        } else {
            addNode.active = true;
            btnInfo.active = false;
            btnAdd.active = true;
            iconNode.active = false;
            this.bindButton(btnAdd, this._fn_st);
            let bagGridConfig = TableDataService.ins()._fn_ly(Const.Tables.bagGrid, gridIndex + 1);
            this._fn_ago(find("num", btnAdd), bagGridConfig.coin);
        }
        this.bindButton(gridCellNode, this._fn_ub);
    }

    _fn_st(btn: Button) {
        let bagRoomData = mergeBoardStateStore.roomArr[this.row][this.col];
        let bagGridConfig = TableDataService.ins()._fn_ly(Const.Tables.bagGrid, bagRoomData.roomArr.length + 1);
        if (!bagGridConfig) {
            return;
        }

        if (mergeBoardStateStore._fn_jp(propIds.coin) < bagGridConfig.coin) {

            return;
        }


        mergeBoardStateStore._fn_aip(propIds.coin, bagGridConfig.coin);

        mergeBoardStateStore._fn_x(this.row, this.col);

        this._fn_ph();
    }

    _fn_ub(btn: Button) {
        // @ts-ignore
        let roomData = btn.node.item;
        // @ts-ignore
        let gridIndex = btn.node.index;

        UtilPub.log(roomData, gridIndex);
        if (!roomData || !roomData.id) {
            return;
        }

        let withdrawnRoomData: any = mergeBoardStateStore._fn_is(gridIndex, this.row, this.col);
        if (!withdrawnRoomData) {

            UtilPub.log("棋盘上没有空房间了");
            return;
        }


        this.getOutArr.push(withdrawnRoomData);

        this._fn_ph();

    }

    _fn_tf(btn: Button) {
        // @ts-ignore
        let propConfig = btn.node.propRow
        mergeBoardStateStore._fn_wh(propConfig.id);
    }

    _fn_sz() {
        this.close();

        let withdrawPayload: any = {};
        withdrawPayload.row = this.row;
        withdrawPayload.col = this.col;
        withdrawPayload.getOutArr = this.getOutArr;
        this.emit(GD.event.boardBagWithdraw, withdrawPayload);
    }


}

