import { find, Label, Node, Sprite, SpriteFrame, tween, v3, _decorator, director } from 'cc';
import { Const } from '../../../config/Const';
import { RoleSex } from '../../../config/global';
import { AudioPlaybackService } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { ResourceLoaderService } from '../../../easyFramework/mgr/resourceUtil';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { aiRobot } from '../../comm/AIRobot';
import { playerDataStore } from '../../comm/UserData';
import { GameStorage } from '../../../easyFramework/mgr/gameStorage';
import { GamePlatform } from '../../platform/GamePlatform';

const { ccclass, property } = _decorator;



@ccclass('SetDialog')
export class SetDialog extends BaseView {
    @property({ type: Node, tooltip: "音乐按钮" }) musicBtn: Node = null!;
    @property({ type: Node, tooltip: "音效按钮" }) soundBtn: Node = null!;

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

        this.bindButton(find("root/btnChange", this.node)!, this.onClickChange)


        this.bindButton(this.titleNode, this.onClickTitle);
    }

    show(args: any) {
        super.show(args)
        this.initMusicBtn()
        this.initSoundBtn()
        this.nameLabel.getComponent(Label)!.string = playerDataStore.roleName
        this.IDLabel.getComponent(Label)!.string = "ID:" + playerDataStore.roleID
        GamePlatform.track("查看设置")

        this.verLabel.string = "版本号：" + Const.appBuildVersion + "_" + Const.hotupdateVersion

        if (playerDataStore.roleAvatar != "") {

            ResourceLoaderService.setRemoteImage(playerDataStore.roleAvatar, this.avatarNode.getComponent(Sprite)!, () => { })
        }

        let item = TableDataService.ins().getTableValueByID(Const.Tables.avatarStyle, playerDataStore.avatarLookId)
        if (item.type == RoleSex.men) {
            this.avatarBg.getComponent(Sprite)!.spriteFrame = this.avatarBg1
        } else {
            this.avatarBg.getComponent(Sprite)!.spriteFrame = this.avatarBg2
        }

        this.clickCount = 0;
        this.unschedule(this.resetClickCount);

        aiRobot.stopUpdate();
    }

    updateInfo() {
        this.nameLabel.getComponent(Label)!.string = playerDataStore.roleName
        this.IDLabel.getComponent(Label)!.string = "ID:" + playerDataStore.roleID

        let item = TableDataService.ins().getTableValueByID(Const.Tables.avatarStyle, playerDataStore.avatarLookId)
        if (item.type == RoleSex.men) {
            this.avatarBg.getComponent(Sprite)!.spriteFrame = this.avatarBg1
        } else {
            this.avatarBg.getComponent(Sprite)!.spriteFrame = this.avatarBg2
        }
    }

    onClickMusic() {
        AudioPlaybackService.instance.clickMusic()
        this.initMusicBtn()
        AudioPlaybackService.instance.playSound(Const.Audio.btn)

    }

    onClickSound() {
        AudioPlaybackService.instance.clickSound()
        this.initSoundBtn()
        AudioPlaybackService.instance.playSound(Const.Audio.btn)

    }

    initMusicBtn() {
        if (!AudioPlaybackService.instance.isOpenMusic()) {
            tween(this.musicBtn.getChildByName("seticon")).to(0.2, { position: v3(40, 0, 0) }).to(0.1, { position: v3(36, 0, 0) }).start()

        } else {
            tween(this.musicBtn.getChildByName("seticon")).to(0.2, { position: v3(-40, 0, 0) }).to(0.1, { position: v3(-36, 0, 0) }).start()

        }
    }

    initSoundBtn() {
        if (!AudioPlaybackService.instance.isOpenSound()) {
            tween(this.soundBtn.getChildByName("seticon")).to(0.2, { position: v3(40, 0, 0) }).to(0.1, { position: v3(36, 0, 0) }).start()

        } else {
            tween(this.soundBtn.getChildByName("seticon")).to(0.2, { position: v3(-40, 0, 0) }).to(0.1, { position: v3(-36, 0, 0) }).start()

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

    onClickChange() {
        director.loadScene("loading");
    }

    resetClickCount() {
        this.clickCount = 0;
    }

}

