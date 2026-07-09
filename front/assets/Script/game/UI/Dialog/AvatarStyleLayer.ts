import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, Layout, utils, sp, } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { RoleSex } from '../../../config/global';
import { AudioPlaybackService } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { BaseUiComponent } from '../../../easyFramework/mgr/comm';
import { ResourceLoaderService } from '../../../easyFramework/mgr/resourceUtil';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { ScrollViewUtil } from '../../comm/ScrollViewUtil';
import { playerDataStore } from '../../comm/UserData';
import { UtilGame } from '../../comm/UtilGame';
import { GamePlatform } from '../../platform/GamePlatform';

const { ccclass, property } = _decorator;



@ccclass('AvatarStyleLayer')
export class AvatarStyleLayer extends BaseView {
    @property({ type: Node, tooltip: "列表" }) scrollViewNode: Node = null!;
    @property({ type: sp.Skeleton }) roleSpine: sp.Skeleton = null!;

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this._fn_xe)

        this.bindButton(find("root/item2", this.node)!, this._fn_adi)
        this.bindButton(find("root/item1", this.node)!, this._fn_adh)
    }

    onEnable() {
        this.on(GD.event.updateDressUp, this.updateDressUp)
    }

    onDisable() {
        this.off(GD.event.updateDressUp, this.updateDressUp)
    }

    _fn_adi() {
        let dressData = TableDataService.ins()._fn_mb(Const.Tables.avatarStyle, "type", RoleSex.women)
        this._fn_adc(this.scrollViewNode, dressData, this._fn_oc, this)
    }

    _fn_adh() {
        let dressData = TableDataService.ins()._fn_mb(Const.Tables.avatarStyle, "type", RoleSex.men)
        this._fn_adc(this.scrollViewNode, dressData, this._fn_oc, this)
    }

    _fn_ob() {
        let currentAvatarConfig = TableDataService.ins()._fn_ly(Const.Tables.avatarStyle, playerDataStore.avatarLookId)
        ResourceLoaderService._fn_rq(Const.resPath.roleSpine + currentAvatarConfig.spine, sp.SkeletonData, (err, skeletonData) => {
            this.roleSpine.skeletonData = skeletonData;
            this.roleSpine.setSkin(currentAvatarConfig.spineSkin)
            this.roleSpine.setAnimation(0, currentAvatarConfig.spineAni, true);
        })
    }

    show(args: any) {
        super.show(args)
        let currentAvatarConfig = TableDataService.ins()._fn_ly(Const.Tables.avatarStyle, playerDataStore.avatarLookId)
        if (currentAvatarConfig.type == RoleSex.men) {
            this._fn_adh()
        } else {
            this._fn_adi()
        }
        this._fn_ob()

        find("root/dressbg1/Label", this.node)!.getComponent(Label)!.string = playerDataStore.dressValue + ""
    }

    openSkinDetail(event: any, avatarConfig: any) {
        UiLayerService.instance._fn_ahg(Const.Dialogs.SceneSkinDetailController, { dressUpData: avatarConfig })

    }

    _fn_oc(skinCellNode: Node, avatarConfig: any, avatarIndex: number, self: AvatarStyleLayer) {
        self._fn_agk(skinCellNode.getChildByName("icon")!.getComponent(Sprite)!, Const.resPath.roleIcon + avatarConfig.icon, undefined, 200)
        self.addButtonHander(skinCellNode!, self.node, "AvatarStyleLayer", "onChangeWear", avatarConfig)
        self._fn_ct(skinCellNode.getChildByName("gantan")!)
        self.addButtonHander(skinCellNode.getChildByName("gantan")!, self.node, "AvatarStyleLayer", "openSkinDetail", avatarConfig)

        if (playerDataStore._fn_pq(avatarConfig.id) || avatarConfig.price == 0) {
            skinCellNode.getChildByName("btnBuy")!.active = false
            skinCellNode.getChildByName("hua1")!.active = false
            if (playerDataStore.avatarLookId == avatarConfig.id) {
                skinCellNode.getChildByName("btnWear")!.active = false
                skinCellNode.getChildByName("wearlab")!.active = true
            } else {
                skinCellNode.getChildByName("btnWear")!.active = true
                skinCellNode.getChildByName("wearlab")!.active = false
                self.addButtonHander(skinCellNode.getChildByName("btnWear")!, self.node, "AvatarStyleLayer", "onClickWear", avatarConfig)
            }
        } else {
            skinCellNode.getChildByName("btnWear")!.active = false
            skinCellNode.getChildByName("wearlab")!.active = false
            skinCellNode.getChildByName("btnBuy")!.active = true

            let costPropId = avatarConfig.price[0][0]
            let costPropConfig = TableDataService.ins()._fn_ly(Const.Tables.prop, costPropId)
            self._fn_agk(find("btnBuy/Node/icon", skinCellNode)!.getComponent(Sprite)!, Const.resPath.icon + costPropConfig.icon, undefined, 40)
            find("btnBuy/Node/Label", skinCellNode)!.getComponent(Label)!.string = "x" + avatarConfig.price[0][1]

            if (avatarConfig.changeZhi > 0) {
                skinCellNode.getChildByName("hua1")!.active = true
                find("hua1/Label", skinCellNode)!.getComponent(Label)!.string = "+" + avatarConfig.changeZhi
            } else {
                skinCellNode.getChildByName("hua1")!.active = false
            }
            self.addButtonHander(skinCellNode.getChildByName("btnBuy")!, self.node, "AvatarStyleLayer", "onClickBuy", avatarConfig)
        }
    }

    onChangeWear(event: any, avatarConfig: any) {
        AudioPlaybackService.instance._fn_xc(Const.Audio.btn)

        ResourceLoaderService._fn_rq(Const.resPath.roleSpine + avatarConfig.spine, sp.SkeletonData, (err, skeletonData) => {
            this.roleSpine.skeletonData = skeletonData;
            this.roleSpine.setSkin(avatarConfig.spineSkin)
            this.roleSpine.setAnimation(0, avatarConfig.spineAni, true);
        })
    }

    onClickWear(event: any, avatarConfig: any) {
        AudioPlaybackService.instance._fn_xc(Const.Audio.btn)
        playerDataStore.avatarLookId = avatarConfig.id
        this.updateDressUp()

    }

    updateDressUp() {
        find("root/dressbg1/Label", this.node)!.getComponent(Label)!.string = playerDataStore.dressValue + ""
        this.scrollViewNode.getComponent(ScrollViewUtil)?.refreshList()
        this._fn_ob()
    }

    onClickBuy(event: any, avatarConfig: any) {
        AudioPlaybackService.instance._fn_xc(Const.Audio.btn)
        if (avatarConfig.price == 0 || playerDataStore._fn_bk(avatarConfig.price[0])) {
            playerDataStore._fn_aji(avatarConfig.id)
            GamePlatform._fn_aja("buy role skin " + avatarConfig.name)
            playerDataStore.dressValue += avatarConfig.changeZhi
            find("root/dressbg1/Label", this.node)!.getComponent(Label)!.string = playerDataStore.dressValue + ""
            this.scrollViewNode.getComponent(ScrollViewUtil)!.refreshList()
        } else {
            this.emit(GD.event.showTip, { msg: UtilGame.language("lackGold") })
        }
    }
}

