import { _decorator, Component, Node, find, Sprite, Label } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { GResType, GSceneSkinState } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import TableDataService from '../../../easyFramework/other/tables';
import { SceneData } from '../../comm/SceneData';
import { playerDataStore } from '../../comm/UserData';
import { UtilGame } from '../../comm/UtilGame';
import { UtilScene } from '../../comm/UtilScene';
import { GamePlatform } from '../../platform/GamePlatform';
const { ccclass, property } = _decorator;

@ccclass('scene_ui_skin_detail')
export class SceneSkinDetailController extends BaseView {
    get root() { return find("root", this.node)! }
    get closeBtn() { return find("root/btnClose", this.node)! }
    get icon() { return find("root/obj/icon", this.node)!.getComponent(Sprite)! }
    get desc() { return find("root/obj/desc", this.node)!.getComponent(Label)! }

    get buyBtn() { return find("root/obj/btnbg", this.node)! }

    get resVal() { return find("root/obj/btnbg/res/res_val", this.node)!.getComponent(Label)! }
    get resIcon() { return find("root/obj/btnbg/res/res_icon", this.node)!.getComponent(Sprite)! }
    get title() { return find("root/titleTxt", this.node)!.getComponent(Label)! }
    get dressVal() { return find("root/obj/dress/dress_val", this.node)!.getComponent(Label)! }

    skinId: number = 0
    dressData: any = null

    start() {
        this.bindButton(this.buyBtn, () => {
            if (this.skinId > 0) {
                this._fn_vg()
            } else if (this.dressData) {
                this._fn_tx()
            }
        })

        this.bindButton(this.closeBtn, () => {
            this.close()
        })
    }

    _fn_vg() {

        let skinData = TableDataService.ins()._fn_ly(Const.Tables.scene_skin, this.skinId)
        let type = skinData.res.split(",")[0]
        let val = skinData.res.split(",")[1]
        let isBuySuccess: boolean = false
        if (type == GResType.gold) {
            if (playerDataStore._fn_bf(val) == false) {
                this.close()

            } else {
                isBuySuccess = true
                GamePlatform._fn_aja("金币购买装扮: " + skinData.name)
            }
        } else if (type == GResType.diamond) {
            if (playerDataStore._fn_bg(val) == false) {
                this.close()

            } else {
                isBuySuccess = true
                GamePlatform._fn_aja("钻石购买装扮: " + skinData.name)
            }
        } else if (type == GResType.tick) {
            if (playerDataStore._fn_bl(val) == false) {
                this.close()

            } else {
                isBuySuccess = true
                GamePlatform._fn_aja("装扮券购买装�? " + skinData.name)
            }
        }

        if (isBuySuccess) {
            this.close()
            this.emit(GD.event.showTip, { msg: "购买成功" })

            SceneData.ins._fn_agb(this.skinId, GSceneSkinState.gotted)
            this.emit(GD.event.clickDressItem, this.skinId)
            UtilScene._fn_afy(Const.SelSceneNode)

        }
    }

    show(args: any) {
        super.show(args)
        if (args.skinId) {
            this.skinId = args.skinId
            let skinData = TableDataService.ins()._fn_ly(Const.Tables.scene_skin, this.skinId)
            UtilScene._fn_agh(this.icon, skinData)
            let itemId = skinData.res.split(",")[0]
            let itemData = TableDataService.ins()._fn_ly(Const.Tables.prop, itemId)
            this._fn_agk(this.resIcon, Const.resPath.icon + itemData.icon, undefined, 50)
            this.resVal.string = "x" + skinData.res.split(",")[1]
            this.dressVal.string = "+" + skinData.zb.split(",")[1]
            this.title.string = skinData.name
            this.desc.string = skinData.desc

            this.buyBtn.active = true
            if (SceneData.ins._fn_ky(this.skinId) == GSceneSkinState.gotted) {
                this.buyBtn.active = false
            }
        } else {
            this.dressData = args.dressUpData
            this._fn_agk(this.icon, Const.resPath.roleIcon + this.dressData.icon, undefined, 200)

            this.title.string = this.dressData.name
            this.desc.string = this.dressData.desc
            this.dressVal.string = "+" + this.dressData.changeZhi
            if (this.dressData.price != 0) {
                let itemId = this.dressData.price[0][0]
                let itemData = TableDataService.ins()._fn_ly(Const.Tables.prop, itemId)
                this._fn_agk(this.resIcon, Const.resPath.icon + itemData.icon, undefined, 40)
                this.resVal.string = "x" + this.dressData.price[0][1]
            }
            if (this.dressData.price == 0 || playerDataStore._fn_pq(this.dressData.id)) {
                this.resIcon.node.active = false
                this.resVal.string = "穿戴"
                if (playerDataStore.avatarLookId == this.dressData.id) {
                    this.buyBtn.active = false
                } else {
                    this.buyBtn.active = true
                }
            }
        }
    }

    _fn_tx() {
        if (this.dressData == null) {
            return
        }
        if (playerDataStore._fn_pq(this.dressData.id) || this.dressData.price == 0) {
            playerDataStore.avatarLookId = this.dressData.id
            this.emit(GD.event.updateDressUp)
            this._fn_xe()
        } else {
            if (playerDataStore._fn_bk(this.dressData.price[0])) {
                playerDataStore._fn_aji(this.dressData.id)
                GamePlatform._fn_aja("buy manager outfit id " + this.dressData.id)
                playerDataStore.dressValue += this.dressData.changeZhi
                this.emit(GD.event.updateDressUp)
                this.buyBtn.active = true
                this.resIcon.node.active = false
                this.resVal.string = "穿戴"
            } else {
                this.emit(GD.event.showTip, { msg: UtilGame.language("lackGold") })
            }
        }

    }

    onEnable() {






    }

}


