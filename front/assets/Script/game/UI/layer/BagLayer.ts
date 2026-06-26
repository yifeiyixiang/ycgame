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
        this.bindButton(this.btnClose, this.onClickBtnClose);
    }

    show(args: any) {
        super.show(args);
        this.row = args.row;
        this.col = args.col;

        this.getOutArr = [];

        this.initUI();

    }

    initUI() {
        let bagRoomData = mergeBoardStateStore.roomArr[this.row][this.col];
        let roomGridList = JSON.parse(JSON.stringify(bagRoomData.roomArr));

        let occupiedCount = 0;
        for (let roomGrid of roomGridList) {
            if (roomGrid.id > 0) {
                occupiedCount++;
            }
        }
        this.setString(this.capcityNode, localText.capcity.format(occupiedCount, roomGridList.length));

        let nextGridConfig = TableDataService.ins().getTableValueByID(Const.Tables.bagGrid, roomGridList.length + 1);
        if (nextGridConfig) {
            roomGridList.push(null);
        }
        this.scrollViewSetData(this.roomList, roomGridList, this.refreshGridItem.bind(this));
    }

    refreshGridItem(gridCellNode: Node, gridInfo: any, gridIndex: number) {
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
                let propConfig = TableDataService.ins().getTableValueByID(Const.Tables.prop, gridInfo.id);
                this.setSpriteFrame2(iconNode.getComponent(Sprite)!, Const.resPath.icon + propConfig.icon);
                // @ts-ignore
                btnInfo.propRow = propConfig;
                this.bindButton(btnInfo, this.onClickBtnInfo);
            } else {
                iconNode.active = false;
                btnInfo.active = false;
            }
        } else {
            addNode.active = true;
            btnInfo.active = false;
            btnAdd.active = true;
            iconNode.active = false;
            this.bindButton(btnAdd, this.onClickBtnAdd);
            let bagGridConfig = TableDataService.ins().getTableValueByID(Const.Tables.bagGrid, gridIndex + 1);
            this.setString(find("num", btnAdd), bagGridConfig.coin);
        }
        this.bindButton(gridCellNode, this.onClickGridItem);
    }

    onClickBtnAdd(btn: Button) {
        let bagRoomData = mergeBoardStateStore.roomArr[this.row][this.col];
        let bagGridConfig = TableDataService.ins().getTableValueByID(Const.Tables.bagGrid, bagRoomData.roomArr.length + 1);
        if (!bagGridConfig) {
            return;
        }

        if (mergeBoardStateStore.getPropNumById(propIds.coin) < bagGridConfig.coin) {

            return;
        }


        mergeBoardStateStore.subPropNum(propIds.coin, bagGridConfig.coin);

        mergeBoardStateStore.bagRoomAddGrid(this.row, this.col);

        this.initUI();
    }

    onClickGridItem(btn: Button) {
        // @ts-ignore
        let roomData = btn.node.item;
        // @ts-ignore
        let gridIndex = btn.node.index;

        UtilPub.log(roomData, gridIndex);
        if (!roomData || !roomData.id) {
            return;
        }

        let withdrawnRoomData: any = mergeBoardStateStore.getOutDataFromRoomBag(gridIndex, this.row, this.col);
        if (!withdrawnRoomData) {

            UtilPub.log("棋盘上没有空房间了");
            return;
        }


        this.getOutArr.push(withdrawnRoomData);

        this.initUI();

    }

    onClickBtnInfo(btn: Button) {
        // @ts-ignore
        let propConfig = btn.node.propRow
        mergeBoardStateStore.openPropInfoLayer(propConfig.id);
    }

    onClickBtnClose() {
        this.close();

        let withdrawPayload: any = {};
        withdrawPayload.row = this.row;
        withdrawPayload.col = this.col;
        withdrawPayload.getOutArr = this.getOutArr;
        this.emit(GD.event.boardBagWithdraw, withdrawPayload);
    }


}

