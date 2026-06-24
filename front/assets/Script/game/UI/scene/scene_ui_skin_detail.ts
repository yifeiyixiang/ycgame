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
                this.onSceneIDBuy()
            } else if (this.dressData) {
                this.onClickDress()
            }
        })

        this.bindButton(this.closeBtn, () => {
            this.close()
        })
    }

    onSceneIDBuy() {

        let skinData = TableDataService.ins().getTableValueByID(Const.Tables.scene_skin, this.skinId)
        let type = skinData.res.split(",")[0]
        let val = skinData.res.split(",")[1]
        let isBuySuccess: boolean = false
        if (type == GResType.gold) {
            if (playerDataStore.checkAndUseCoin(val) == false) {
                this.close()

            } else {
                isBuySuccess = true
                GamePlatform.track("金币购买装扮: " + skinData.name)
            }
        } else if (type == GResType.diamond) {
            if (playerDataStore.checkAndUseDiamonds(val) == false) {
                this.close()

            } else {
                isBuySuccess = true
                GamePlatform.track("钻石购买装扮: " + skinData.name)
            }
        } else if (type == GResType.tick) {
            if (playerDataStore.checkAndUseStyleVoucher(val) == false) {
                this.close()

            } else {
                isBuySuccess = true
                GamePlatform.track("装扮券购买装�? " + skinData.name)
            }
        }

        if (isBuySuccess) {
            this.close()
            this.emit(GD.event.showTip, { msg: "购买成功" })

            SceneData.ins.setSceneSkinById(this.skinId, GSceneSkinState.gotted)
            this.emit(GD.event.clickDressItem, this.skinId)
            UtilScene.setSceneItemAni(Const.SelSceneNode)

        }
    }

    show(args: any) {
        super.show(args)
        if (args.skinId) {
            this.skinId = args.skinId
            let skinData = TableDataService.ins().getTableValueByID(Const.Tables.scene_skin, this.skinId)
            UtilScene.setSkinIcon(this.icon, skinData)
            let itemId = skinData.res.split(",")[0]
            let itemData = TableDataService.ins().getTableValueByID(Const.Tables.prop, itemId)
            this.setSpriteFrame(this.resIcon, Const.resPath.icon + itemData.icon, undefined, 50)
            this.resVal.string = "x" + skinData.res.split(",")[1]
            this.dressVal.string = "+" + skinData.zb.split(",")[1]
            this.title.string = skinData.name
            this.desc.string = skinData.desc

            this.buyBtn.active = true
            if (SceneData.ins.getSceneSkinById(this.skinId) == GSceneSkinState.gotted) {
                this.buyBtn.active = false
            }
        } else {
            this.dressData = args.dressUpData
            this.setSpriteFrame(this.icon, Const.resPath.roleIcon + this.dressData.icon, undefined, 200)

            this.title.string = this.dressData.name
            this.desc.string = this.dressData.desc
            this.dressVal.string = "+" + this.dressData.changeZhi
            if (this.dressData.price != 0) {
                let itemId = this.dressData.price[0][0]
                let itemData = TableDataService.ins().getTableValueByID(Const.Tables.prop, itemId)
                this.setSpriteFrame(this.resIcon, Const.resPath.icon + itemData.icon, undefined, 40)
                this.resVal.string = "x" + this.dressData.price[0][1]
            }
            if (this.dressData.price == 0 || playerDataStore.isAvatarLookOwned(this.dressData.id)) {
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

    onClickDress() {
        if (this.dressData == null) {
            return
        }
        if (playerDataStore.isAvatarLookOwned(this.dressData.id) || this.dressData.price == 0) {
            playerDataStore.avatarLookId = this.dressData.id
            this.emit(GD.event.updateDressUp)
            this.popClose()
        } else {
            if (playerDataStore.checkAndUseProp(this.dressData.price[0])) {
                playerDataStore.unlockAvatarLook(this.dressData.id)
                GamePlatform.track("buy manager outfit id " + this.dressData.id)
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


