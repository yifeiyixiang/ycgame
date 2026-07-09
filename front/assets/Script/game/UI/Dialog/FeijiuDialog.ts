import { _decorator, Node, Label, find, Sprite, SpriteFrame, tween, v3, UITransform, } from 'cc';
import { Const } from '../../../config/Const';
import { GSceneSkinState } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { BaseUiComponent } from '../../../easyFramework/mgr/comm';
import TableDataService from '../../../easyFramework/other/tables';
import { SceneData } from '../../comm/SceneData';
import { GamePlatform } from '../../platform/GamePlatform';
const { ccclass, property } = _decorator;



@ccclass('FeijiuDialog')
export class FeijiuDialog extends BaseView {
    @property({ type: Node, tooltip: "角色列表详情" }) roleInfoScroll: Node = null!;

    _propdata: any = null

    _totalNum = 0
    _unlockNum = 0
    start() {
    }

    show(args: any) {
        super.show(args)
        this.bindButton(find("root/btnClose", this.node)!, this._fn_xe)
        this.openTujianArr()
        GamePlatform._fn_aja("查看肥啾图鉴")
    }

    openTujianArr() {

        let guestTable = TableDataService.ins()._fn_lt(Const.Tables.scene_guest)
        let groupedGuestList: any = []

        guestTable.forEach((guestConfig: any) => {
            if(guestConfig.type >0){
                if (!groupedGuestList[guestConfig.type - 1]) {
                    groupedGuestList[guestConfig.type - 1] = []
                }
                groupedGuestList[guestConfig.type - 1].push(guestConfig)
            }
        });
        let content = find("view/content", this.roleInfoScroll)
        content!.removeAllChildren()
        this._fn_agd(content!, groupedGuestList, find("root/Layout", this.node)!, this._fn_od, this)

        find("root/xk/totalLabel", this.node)!.getComponent(Label)!.string = "肥啾(" + this._unlockNum + "/" + this._totalNum + ")"
    }

    _fn_od(groupCellNode: Node, guestGroup: any, groupIndex: number, self: FeijiuDialog) {
        if (guestGroup.length > 0) {
            groupCellNode.getChildByName("titl2")!.getChildByName("title")!.getComponent(Label)!.string = guestGroup[0].typename + ""
            let guestLayout = groupCellNode.getChildByName("Layout")
            guestLayout!.removeAllChildren()
            guestLayout!.getComponent(UITransform)!.height = 120 * Math.ceil(guestGroup.length / 4)
            for (let guestIndex = 0; guestIndex < guestGroup.length; guestIndex++) {
                const guestConfig = guestGroup[guestIndex];
                if (SceneData.ins._fn_ky(guestConfig.skin) == GSceneSkinState.gotted) {
                    self._unlockNum++
                }
                self._totalNum++
                self.addPrefab(Const.Prefabs.FeijiuItem, guestLayout!, () => { }, { roleData: guestConfig })
            }
        }
    }


}

