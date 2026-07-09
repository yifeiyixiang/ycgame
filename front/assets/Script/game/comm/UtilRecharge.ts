import { _decorator } from "cc";
import { Const } from "../../config/Const";
import TableDataService from "../../easyFramework/other/tables";

const { ccclass, property } = _decorator;

@ccclass('UtilRecharge')
export class UtilRecharge {

    public static _fn_ek(shopid: number) {
        let curRecharge = TableDataService.ins()._fn_ly(Const.Tables.recharge, shopid)

    }
}