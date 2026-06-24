import { _decorator } from "cc";
import { Const } from "../../config/Const";
import TableDataService from "../../easyFramework/other/tables";

const { ccclass, property } = _decorator;

@ccclass('UtilRecharge')
export class UtilRecharge {

    public static doShopPay(shopid: number) {
        let curRecharge = TableDataService.ins().getTableValueByID(Const.Tables.recharge, shopid)

    }
}