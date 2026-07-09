import { _decorator, Component, Node, find, Sprite, Label, UIOpacity, instantiate, Vec3, SpriteFrame, color } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { GBuildType, GLockState, GResType, GSceneItemType, GSceneSkinState } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { SceneData } from '../../comm/SceneData';
import { playerDataStore } from '../../comm/UserData';
import { UtilGame } from '../../comm/UtilGame';
import { UtilScene } from '../../comm/UtilScene';
import { GamePlatform } from '../../platform/GamePlatform';
const { ccclass, property } = _decorator;

@ccclass('scene_ui_skin_detailList')
export class SceneSkinDetailListController extends BaseView {
    get root() { return find("root", this.node)! }
    get closeBtn() { return find("root/btnClose", this.node)! }
    get icon() { return find("root/obj/detail_icon_bg/icon", this.node)!.getComponent(Sprite)! }
    get desc() { return find("root/obj/desc", this.node)!.getComponent(Label)! }
    get skinName() { return find("root/obj/detail_icon_bg/skinName", this.node)!.getComponent(Label)! }

    get btnInfo() { return find("root/obj/btnInfo", this.node)! }
    get buyBtn() { return find("root/obj/btnbg", this.node)! }
    get skinList() { return find("root/obj/Layout", this.node)! }

    get lockStr() { return find("root/obj/lockStr", this.node)! }

    get resVal() { return find("root/obj/btnbg/res/res_val", this.node)!.getComponent(Label)! }
    get resIcon() { return find("root/obj/btnbg/res/res_icon", this.node)!.getComponent(Sprite)! }
    get title() { return find("root/titleTxt", this.node)!.getComponent(Label)! }
    get dressVal() { return find("root/obj/detail_icon_bg/dress/dress_val", this.node)!.getComponent(Label)! }


    @property({ type: Node }) skinItem: Node = null!;



    skinId: number = 0
    dressData: any = null

    start() {
        this.bindButton(this.buyBtn, () => {
            if (this.skinId > 0) {
                this._fn_vg()
            }
        })
        this.bindButton(this.btnInfo, () => {
            if (this.skinId > 0) {
                this.close()
                UiLayerService.instance._fn_nk(Const.Dialogs.Tujian)
                let skinData = TableDataService.ins()._fn_ly(Const.Tables.scene_skin, this.skinId)
                this.emit(GD.event.goToBuildScene, skinData.scene, GBuildType.item)
                this.emit(GD.event.popOpsWindow, UtilScene._fn_kv(skinData.scene)!.node)
                this.emit(GD.event.clickDressItem, this.skinId)
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

            this.emit(GD.event.showTip, { msg: "购买成功" })

            SceneData.ins._fn_agb(this.skinId, GSceneSkinState.gotted)
            this._fn_pa(this.skinId)


        }
    }

    show(args: any) {
        super.show(args)
        if (args.skinId) {

            this._fn_pa(args.skinId)
        }
    }

    _fn_pa(skinId: number) {
        this.skinId = skinId;
        let skinData = TableDataService.ins()._fn_ly(Const.Tables.scene_skin, skinId)
        UtilScene._fn_agh(this.icon, skinData)
        let itemId = skinData.res.split(",")[0]
        let itemData = TableDataService.ins()._fn_ly(Const.Tables.prop, itemId)
        this._fn_agk(this.resIcon, Const.resPath.icon + itemData.icon, undefined, 50)
        this.resVal.string = "x" + skinData.res.split(",")[1]
        this.dressVal.string = "+" + skinData.zb.split(",")[1]
        this.title.string = skinData.name


        let curScene = skinData.scene


        let sData = SceneData.ins._fn_ku(curScene, GSceneItemType.item)!
        let isUnLock = sData == null || sData.lockState == GLockState.locked
        if (isUnLock) {
            this.buyBtn.active = false
            this.btnInfo.active = false
            this.lockStr.active = true

            this.skinName.string = "???"
            this.desc.string = "???"
            this.icon.getComponent(Sprite)!.color = color(0, 0, 0, 130)
        } else {
            this.skinName.string = skinData.name
            this.desc.string = skinData.desc
            this.icon.getComponent(Sprite)!.color = color(255, 255, 255, 255)

            this.lockStr.active = false

            if (SceneData.ins._fn_ky(skinId) == GSceneSkinState.gotted) {
                this.buyBtn.active = false
                this.btnInfo.active = true
                this.icon.getComponent(UIOpacity)!.opacity = 255
            } else {
                this.buyBtn.active = true
                this.btnInfo.active = false
                this.icon.getComponent(UIOpacity)!.opacity = 125
            }
        }

        let skinList = TableDataService.ins()._fn_mb(Const.Tables.scene_skin, "scene", curScene)
        this.skinList.removeAllChildren()
        for (let i = 0; i < skinList.length; i++) {
            let curskin = skinList[i]
            if (curskin.id % curScene > 0) {
                let skin = instantiate(this.skinItem)
                skin.parent = this.skinList
                skin.position = Vec3.ZERO
                this._fn_pc(skin, curskin, isUnLock)
                if (curskin.id == skinId) {
                    this._fn_agk(skin.getComponent(Sprite)!, Const.resPath.propItembg + "propItembg1")
                } else {
                    this._fn_agk(skin.getComponent(Sprite)!, Const.resPath.propItembg + "propItembg2")
                }
            }
        }
    }

    _fn_pc(item: Node, skinData: any, isUnLock: boolean) {
        let icon = find("icon", item)!.getComponent(Sprite)!
        UtilScene._fn_agh(icon, skinData)

        if (isUnLock) {
            icon!.color = color(0, 0, 0, 130)
        } else {
            icon!.color = color(255, 255, 255, 255)
        }

        this.bindButton(item, () => {
            this._fn_pa(skinData.id)
        })
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


