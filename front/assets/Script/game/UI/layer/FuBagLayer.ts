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

        this.bindButton(this.btnSure, this._fn_to);
        this.bindButton(this.btnClose, this._fn_sz);

    }

    show(args: any) {
        super.show(args);

        this.bagId = args;

        this._fn_ph();

    }

    _fn_ph() {
        let bagConfig = TableDataService.ins()._fn_ly(Const.Tables.fuBag, this.bagId);
        this._fn_adc(this.propList, bagConfig.price, this._fn_zk.bind(this));
    }

    _fn_zk(itemUI: Node, prop: any) {
        let propId = prop[0];
        let propCount = prop[1];
        let propConfig = TableDataService.ins()._fn_ly(Const.Tables.prop, propId);

        this._fn_agl(find("icon", itemUI)!.getComponent(Sprite)!, Const.resPath.icon + propConfig.icon);
        this._fn_ago(find("num", itemUI), propCount);

        let infoNode = find("info", itemUI)!;
        if (mergeBoardStateStore._fn_xo(propId)) {
            infoNode.active = true;
            this.bindButton(itemUI, this._fn_ue);
        } else {
            infoNode.active = false;
        }

    }

    _fn_ue(btn: Button) {
        // @ts-ignore
        let propRow = btn.node.propRow;
        mergeBoardStateStore._fn_wh(propRow.id);
    }

    _fn_to() {
        this.close();
    }

    _fn_sz() {
        this.close();
    }


}

