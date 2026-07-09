import { _decorator, Label, find, Node, System, game, EditBox } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { GameStorage } from '../../../easyFramework/mgr/gameStorage';
import ServerCtrJSF from '../../../easyFramework/network/ServerCtrJSF';
import TableDataService from '../../../easyFramework/other/tables';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
import { UtilScene } from '../../comm/UtilScene';

const { ccclass, property } = _decorator;

@ccclass('DebugDialog')
export class DebugDialog extends BaseView {
    @property({ type: Node }) list: Node = null!


    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.close)
        this.bindButton(find("root/layout/btnClear", this.node)!, this._fn_tw)
        this.bindButton(find("root/layout/btnExportScene", this.node)!, this._fn_tz)
    }

    show(args: any) {
        super.show(args)
        this.initData()

    }

    initData() {
        let setData = TableDataService.ins()._fn_lt(Const.Tables.setting)
        this._fn_adc(this.list, setData, this._fn_oc, this)
    }

    _fn_oc(itemUI: Node, item: any, index: number, self: any) {
        itemUI.getChildByName("name")!.getComponent(Label)!.string = item.ps
        itemUI.getChildByName("curNum")!.getComponent(Label)!.string = GameStorage._fn_hr(item.key, 0) + ""
        itemUI.getChildByName("EditBox")!.getComponent(EditBox)!.placeholder = item.editValue
        itemUI.getChildByName("EditBox")!.getComponent(EditBox)!.string = item.editValue
        if (item.type == 1) {
            self.addButtonHander(itemUI.getChildByName("jianbtn")!, self.node, "DebugDialog", "jianshaoNum", [item, itemUI])
            self.addButtonHander(itemUI.getChildByName("addbtn")!, self.node, "DebugDialog", "addNum", [item, itemUI])
        } else {
            self.addButtonHander(itemUI.getChildByName("addbtn")!, self.node, "DebugDialog", "addProp", [item, itemUI])
        }
    }

    _fn_tw() {
        ServerCtrJSF._fn_hp()._fn_abm()
        this.scheduleOnce(() => {
            game.end()
        }, 1.2)
    }

    _fn_tz() {
        UtilScene._fn_eq()
    }

    jianshaoNum(event: any, data: any) {
        let itemUI = data[1]
        let item = data[0]
        GameStorage._fn_aey(item.key, GameStorage._fn_hr(item.key) - parseInt(itemUI.getChildByName("EditBox")!.getComponent(EditBox)!.string))
        this.emit(GD.event.updateMoney)


        itemUI.getChildByName("curNum")!.getComponent(Label)!.string = GameStorage._fn_hr(item.key, 0) + ""


    }

    addNum(event: any, data: any) {
        let itemUI = data[1]
        let item = data[0]
        GameStorage._fn_aey(item.key, GameStorage._fn_hr(item.key) + parseInt(itemUI.getChildByName("EditBox")!.getComponent(EditBox)!.string))
        this.emit(GD.event.updateMoney)

        itemUI.getChildByName("curNum")!.getComponent(Label)!.string = GameStorage._fn_hr(item.key, 0) + ""

    }

    addProp(event: any, data: any) {
        let itemUI = data[1]
        let item = data[0]

        let propId = parseInt(itemUI.getChildByName("EditBox")!.getComponent(EditBox)!.string)
        let propData = TableDataService.ins()._fn_ly(Const.Tables.prop, propId)
        if (propData) {
            mergeBoardStateStore._fn_m(propId, 1)
        } else {
            this._fn_aiu("道具ID 有误")
        }
    }
}

