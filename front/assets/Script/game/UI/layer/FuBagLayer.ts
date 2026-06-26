import { Button, find, Node, Sprite, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import BaseView from '../../../easyFramework/mgr/BaseView';
import TableDataService from '../../../easyFramework/other/tables';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
const { ccclass, property } = _decorator;

@ccclass('FuBagLayer')
export class FuBagLayer extends BaseView {

    @property({ type: Node })
    btnClose: Node = null!;

    @property({ type: Node })
    propList: Node = null!;
    @property({ type: Node })
    btnSure: Node = null!;

    bagId: number = 0;

    start() {

        this.bindButton(this.btnSure, this.onClickBtnSure);
        this.bindButton(this.btnClose, this.onClickBtnClose);

    }

    show(args: any) {
        super.show(args);

        this.bagId = args;

        this.initUI();

    }

    initUI() {
        let bagConfig = TableDataService.ins().getTableValueByID(Const.Tables.fuBag, this.bagId);
        this.scrollViewSetData(this.propList, bagConfig.price, this.refreshPropItem.bind(this));
    }

    refreshPropItem(itemUI: Node, prop: any) {
        let propId = prop[0];
        let propCount = prop[1];
        let propConfig = TableDataService.ins().getTableValueByID(Const.Tables.prop, propId);

        this.setSpriteFrame2(find("icon", itemUI)!.getComponent(Sprite)!, Const.resPath.icon + propConfig.icon);
        this.setString(find("num", itemUI), propCount);

        let infoNode = find("info", itemUI)!;
        if (mergeBoardStateStore.propCanCreateNewProp(propId)) {
            infoNode.active = true;
            this.bindButton(itemUI, this.onClickPropItem);
        } else {
            infoNode.active = false;
        }

    }

    onClickPropItem(btn: Button) {
        // @ts-ignore
        let propRow = btn.node.propRow;
        mergeBoardStateStore.openPropInfoLayer(propRow.id);
    }

    onClickBtnSure() {
        this.close();
    }

    onClickBtnClose() {
        this.close();
    }


}

