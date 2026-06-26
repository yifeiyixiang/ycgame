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
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)

        this.bindButton(find("root/item2", this.node)!, this.selectWomen)
        this.bindButton(find("root/item1", this.node)!, this.selectMen)
    }

    onEnable() {
        this.on(GD.event.updateDressUp, this.updateDressUp)
    }

    onDisable() {
        this.off(GD.event.updateDressUp, this.updateDressUp)
    }

    selectWomen() {
        let dressData = TableDataService.ins().getTableValuesByType(Const.Tables.avatarStyle, "type", RoleSex.women)
        this.scrollViewSetData(this.scrollViewNode, dressData, this.initItem, this)
    }

    selectMen() {
        let dressData = TableDataService.ins().getTableValuesByType(Const.Tables.avatarStyle, "type", RoleSex.men)
        this.scrollViewSetData(this.scrollViewNode, dressData, this.initItem, this)
    }

    initInfo() {
        let currentAvatarConfig = TableDataService.ins().getTableValueByID(Const.Tables.avatarStyle, playerDataStore.avatarLookId)
        ResourceLoaderService.loadResWithBundle(Const.resPath.roleSpine + currentAvatarConfig.spine, sp.SkeletonData, (err, skeletonData) => {
            this.roleSpine.skeletonData = skeletonData;
            this.roleSpine.setSkin(currentAvatarConfig.spineSkin)
            this.roleSpine.setAnimation(0, currentAvatarConfig.spineAni, true);
        })
    }

    show(args: any) {
        super.show(args)
        let currentAvatarConfig = TableDataService.ins().getTableValueByID(Const.Tables.avatarStyle, playerDataStore.avatarLookId)
        if (currentAvatarConfig.type == RoleSex.men) {
            this.selectMen()
        } else {
            this.selectWomen()
        }
        this.initInfo()

        find("root/dressbg1/Label", this.node)!.getComponent(Label)!.string = playerDataStore.dressValue + ""
    }

    openSkinDetail(event: any, avatarConfig: any) {
        UiLayerService.instance.showDialog(Const.Dialogs.SceneSkinDetailController, { dressUpData: avatarConfig })

    }

    initItem(skinCellNode: Node, avatarConfig: any, avatarIndex: number, self: AvatarStyleLayer) {
        self.setSpriteFrame(skinCellNode.getChildByName("icon")!.getComponent(Sprite)!, Const.resPath.roleIcon + avatarConfig.icon, undefined, 200)
        self.addButtonHander(skinCellNode!, self.node, "AvatarStyleLayer", "onChangeWear", avatarConfig)
        self.clearButtonHander(skinCellNode.getChildByName("gantan")!)
        self.addButtonHander(skinCellNode.getChildByName("gantan")!, self.node, "AvatarStyleLayer", "openSkinDetail", avatarConfig)

        if (playerDataStore.isAvatarLookOwned(avatarConfig.id) || avatarConfig.price == 0) {
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
            let costPropConfig = TableDataService.ins().getTableValueByID(Const.Tables.prop, costPropId)
            self.setSpriteFrame(find("btnBuy/Node/icon", skinCellNode)!.getComponent(Sprite)!, Const.resPath.icon + costPropConfig.icon, undefined, 40)
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
        AudioPlaybackService.instance.playSound(Const.Audio.btn)

        ResourceLoaderService.loadResWithBundle(Const.resPath.roleSpine + avatarConfig.spine, sp.SkeletonData, (err, skeletonData) => {
            this.roleSpine.skeletonData = skeletonData;
            this.roleSpine.setSkin(avatarConfig.spineSkin)
            this.roleSpine.setAnimation(0, avatarConfig.spineAni, true);
        })
    }

    onClickWear(event: any, avatarConfig: any) {
        AudioPlaybackService.instance.playSound(Const.Audio.btn)
        playerDataStore.avatarLookId = avatarConfig.id
        this.updateDressUp()

    }

    updateDressUp() {
        find("root/dressbg1/Label", this.node)!.getComponent(Label)!.string = playerDataStore.dressValue + ""
        this.scrollViewNode.getComponent(ScrollViewUtil)?.refreshList()
        this.initInfo()
    }

    onClickBuy(event: any, avatarConfig: any) {
        AudioPlaybackService.instance.playSound(Const.Audio.btn)
        if (avatarConfig.price == 0 || playerDataStore.checkAndUseProp(avatarConfig.price[0])) {
            playerDataStore.unlockAvatarLook(avatarConfig.id)
            GamePlatform.track("buy role skin " + avatarConfig.name)
            playerDataStore.dressValue += avatarConfig.changeZhi
            find("root/dressbg1/Label", this.node)!.getComponent(Label)!.string = playerDataStore.dressValue + ""
            this.scrollViewNode.getComponent(ScrollViewUtil)!.refreshList()
        } else {
            this.emit(GD.event.showTip, { msg: UtilGame.language("lackGold") })
        }
    }
}

