import { find, Label, Node, Sprite, SpriteFrame, tween, v3, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import { RoleSex } from '../../../config/global';
import { AudioPlaybackService } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { ResourceLoaderService } from '../../../easyFramework/mgr/resourceUtil';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { aiRobot } from '../../comm/AIRobot';
import { playerDataStore } from '../../comm/UserData';
import GD from '../../../config/GD';
import { GamePlatform } from '../../platform/GamePlatform';

const { ccclass, property } = _decorator;



@ccclass('UserinfoView')
export class UserinfoView extends BaseView {
    @property({ type: Node, tooltip: "名字" }) nameLabel: Node = null!;
    @property({ type: Node, tooltip: "ID" }) IDLabel: Node = null!;

    @property({ type: Node, tooltip: "头像" }) avatarNode: Node = null!;
    @property({ type: Node, tooltip: "头像背景" }) avatarBg: Node = null!;


    @property({ type: SpriteFrame }) avatarBg1: SpriteFrame = null!;
    @property({ type: SpriteFrame }) avatarBg2: SpriteFrame = null!;

    @property({ type: Node, tooltip: "标题" }) titleNode: Node = null!;

    @property({ type: Label }) verLabel: Label = null!;

    clickCount: number = 0;

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)
        this.bindButton(find("root/btnduihuan", this.node)!, this.openDuihuanMa)
        this.bindButton(find("root/privacyLabel", this.node)!, ()=>{
            UiLayerService.instance.showDialog(Const.Dialogs.PrivacyDialog)
        })

        this.bindButton(find("root/itembg/btnBianji", this.node)!, ()=>{
            UiLayerService.instance.showDialog(Const.Dialogs.ModifyDailog)
        })






        this.bindButton(this.titleNode, this.onClickTitle);
    }

    onEnable() {
        this.on(GD.event.updateGame, this.refresh)
    }

    onDisable() {
        this.off(GD.event.updateGame, this)
    }

    show(args: any) {
        super.show(args)
        this.nameLabel.getComponent(Label)!.string = playerDataStore.roleName
        this.IDLabel.getComponent(Label)!.string = "ID:" + playerDataStore.roleID
        GamePlatform.track("查看设置")

        this.verLabel.string = "版本号：" + Const.appBuildVersion + "_" + Const.hotupdateVersion

        if (playerDataStore.roleAvatar != "") {

            ResourceLoaderService.setRemoteImage(playerDataStore.roleAvatar, this.avatarNode.getComponent(Sprite)!, () => { })
        }

        let avatarStyleConfig = TableDataService.ins().getTableValueByID(Const.Tables.avatarStyle, playerDataStore.avatarLookId)
        if (avatarStyleConfig.type == RoleSex.men) {
            this.avatarBg.getComponent(Sprite)!.spriteFrame = this.avatarBg1
        } else {
            this.avatarBg.getComponent(Sprite)!.spriteFrame = this.avatarBg2
        }

        this.clickCount = 0;
        this.unschedule(this.resetClickCount);

        aiRobot.stopUpdate();
    }

    refresh(){
        this.nameLabel.getComponent(Label)!.string = playerDataStore.roleName

        if (playerDataStore.roleAvatar != "") {

            ResourceLoaderService.setRemoteImage(playerDataStore.roleAvatar, this.avatarNode.getComponent(Sprite)!, () => { })
        }
    }

    updateInfo() {
        this.nameLabel.getComponent(Label)!.string = playerDataStore.roleName
        this.IDLabel.getComponent(Label)!.string = "ID:" + playerDataStore.roleID

        let avatarStyleConfig = TableDataService.ins().getTableValueByID(Const.Tables.avatarStyle, playerDataStore.avatarLookId)
        if (avatarStyleConfig.type == RoleSex.men) {
            this.avatarBg.getComponent(Sprite)!.spriteFrame = this.avatarBg1
        } else {
            this.avatarBg.getComponent(Sprite)!.spriteFrame = this.avatarBg2
        }
    }

    openDuihuanMa() {
        AudioPlaybackService.instance.playSound(Const.Audio.btn)

        GamePlatform.track("open settings redeem")
        UiLayerService.instance.pushShowDialog(Const.Dialogs.CodeDialog)
    }

    openRoleInfo() {
        AudioPlaybackService.instance.playSound(Const.Audio.btn)
        UiLayerService.instance.pushShowDialog(Const.Dialogs.RoleInfoDialog)
    }

    onClickTitle() {
        this.clickCount++;
        this.unschedule(this.resetClickCount);
        this.scheduleOnce(this.resetClickCount, 3);
        if (this.clickCount >= 5) {
            this.close();
            UiLayerService.instance.showDialog(Const.Dialogs.GMInputLayer);
            this.clickCount = 0;
            this.unschedule(this.resetClickCount);
        }
    }

    resetClickCount() {
        this.clickCount = 0;
    }

}

