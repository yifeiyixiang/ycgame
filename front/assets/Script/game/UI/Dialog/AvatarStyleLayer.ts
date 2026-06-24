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
        let item = TableDataService.ins().getTableValueByID(Const.Tables.avatarStyle, playerDataStore.avatarLookId)
        ResourceLoaderService.loadResWithBundle(Const.resPath.roleSpine + item.spine, sp.SkeletonData, (err, skedata) => {
            this.roleSpine.skeletonData = skedata;
            this.roleSpine.setSkin(item.spineSkin)
            this.roleSpine.setAnimation(0, item.spineAni, true);
        })
    }

    show(args: any) {
        super.show(args)
        let item = TableDataService.ins().getTableValueByID(Const.Tables.avatarStyle, playerDataStore.avatarLookId)
        if (item.type == RoleSex.men) {
            this.selectMen()
        } else {
            this.selectWomen()
        }
        this.initInfo()

        find("root/dressbg1/Label", this.node)!.getComponent(Label)!.string = playerDataStore.dressValue + ""
    }

    openSkinDetail(event: any, data: any) {
        UiLayerService.instance.showDialog(Const.Dialogs.SceneSkinDetailController, { dressUpData: data })

    }

    initItem(itemUI: Node, item: any, index: number, self: AvatarStyleLayer) {
        self.setSpriteFrame(itemUI.getChildByName("icon")!.getComponent(Sprite)!, Const.resPath.roleIcon + item.icon, undefined, 200)
        self.addButtonHander(itemUI!, self.node, "AvatarStyleLayer", "onChangeWear", item)
        self.clearButtonHander(itemUI.getChildByName("gantan")!)
        self.addButtonHander(itemUI.getChildByName("gantan")!, self.node, "AvatarStyleLayer", "openSkinDetail", item)

        if (playerDataStore.isAvatarLookOwned(item.id) || item.price == 0) {
            itemUI.getChildByName("btnBuy")!.active = false
            itemUI.getChildByName("hua1")!.active = false
            if (playerDataStore.avatarLookId == item.id) {
                itemUI.getChildByName("btnWear")!.active = false
                itemUI.getChildByName("wearlab")!.active = true
            } else {
                itemUI.getChildByName("btnWear")!.active = true
                itemUI.getChildByName("wearlab")!.active = false
                self.addButtonHander(itemUI.getChildByName("btnWear")!, self.node, "AvatarStyleLayer", "onClickWear", item)
            }
        } else {
            itemUI.getChildByName("btnWear")!.active = false
            itemUI.getChildByName("wearlab")!.active = false
            itemUI.getChildByName("btnBuy")!.active = true

            let itemId = item.price[0][0]
            let itemData = TableDataService.ins().getTableValueByID(Const.Tables.prop, itemId)
            self.setSpriteFrame(find("btnBuy/Node/icon", itemUI)!.getComponent(Sprite)!, Const.resPath.icon + itemData.icon, undefined, 40)
            find("btnBuy/Node/Label", itemUI)!.getComponent(Label)!.string = "x" + item.price[0][1]

            if (item.changeZhi > 0) {
                itemUI.getChildByName("hua1")!.active = true
                find("hua1/Label", itemUI)!.getComponent(Label)!.string = "+" + item.changeZhi
            } else {
                itemUI.getChildByName("hua1")!.active = false
            }
            self.addButtonHander(itemUI.getChildByName("btnBuy")!, self.node, "AvatarStyleLayer", "onClickBuy", item)
        }
    }

    onChangeWear(event: any, item: any) {
        AudioPlaybackService.instance.playSound(Const.Audio.btn)

        ResourceLoaderService.loadResWithBundle(Const.resPath.roleSpine + item.spine, sp.SkeletonData, (err, skedata) => {
            this.roleSpine.skeletonData = skedata;
            this.roleSpine.setSkin(item.spineSkin)
            this.roleSpine.setAnimation(0, item.spineAni, true);
        })
    }

    onClickWear(event: any, data: any) {
        AudioPlaybackService.instance.playSound(Const.Audio.btn)
        playerDataStore.avatarLookId = data.id
        this.updateDressUp()

    }

    updateDressUp() {
        find("root/dressbg1/Label", this.node)!.getComponent(Label)!.string = playerDataStore.dressValue + ""
        this.scrollViewNode.getComponent(ScrollViewUtil)?.refreshList()
        this.initInfo()
    }

    onClickBuy(event: any, data: any) {
        AudioPlaybackService.instance.playSound(Const.Audio.btn)
        if (data.price == 0 || playerDataStore.checkAndUseProp(data.price[0])) {
            playerDataStore.unlockAvatarLook(data.id)
            GamePlatform.track("buy role skin " + data.name)
            playerDataStore.dressValue += data.changeZhi
            find("root/dressbg1/Label", this.node)!.getComponent(Label)!.string = playerDataStore.dressValue + ""
            this.scrollViewNode.getComponent(ScrollViewUtil)!.refreshList()
        } else {
            this.emit(GD.event.showTip, { msg: UtilGame.language("lackGold") })
        }
    }
}

