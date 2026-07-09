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
        this.bindButton(find("root/btnClose", this.node)!, this._fn_xe)
        this.bindButton(find("root/btnduihuan", this.node)!, this.openDuihuanMa)
        this.bindButton(find("root/privacyLabel", this.node)!, ()=>{
            UiLayerService.instance._fn_ahg(Const.Dialogs.PrivacyDialog)
        })

        this.bindButton(find("root/btnChange", this.node)!, this._fn_tv)


        this.bindButton(this.titleNode, this._fn_ul);
    }

    show(args: any) {
        super.show(args)
        this._fn_ok()
        this._fn_pd()
        this.nameLabel.getComponent(Label)!.string = playerDataStore.roleName
        this.IDLabel.getComponent(Label)!.string = "ID:" + playerDataStore.roleID
        GamePlatform._fn_aja("查看设置")

        this.verLabel.string = "版本号：" + Const.appBuildVersion + "_" + Const.hotupdateVersion

        if (playerDataStore.roleAvatar != "") {

            ResourceLoaderService._fn_afr(playerDataStore.roleAvatar, this.avatarNode.getComponent(Sprite)!, () => { })
        }

        let item = TableDataService.ins()._fn_ly(Const.Tables.avatarStyle, playerDataStore.avatarLookId)
        if (item.type == RoleSex.men) {
            this.avatarBg.getComponent(Sprite)!.spriteFrame = this.avatarBg1
        } else {
            this.avatarBg.getComponent(Sprite)!.spriteFrame = this.avatarBg2
        }

        this.clickCount = 0;
        this.unschedule(this._fn_abp);

        aiRobot._fn_ain();
    }

    updateInfo() {
        this.nameLabel.getComponent(Label)!.string = playerDataStore.roleName
        this.IDLabel.getComponent(Label)!.string = "ID:" + playerDataStore.roleID

        let item = TableDataService.ins()._fn_ly(Const.Tables.avatarStyle, playerDataStore.avatarLookId)
        if (item.type == RoleSex.men) {
            this.avatarBg.getComponent(Sprite)!.spriteFrame = this.avatarBg1
        } else {
            this.avatarBg.getComponent(Sprite)!.spriteFrame = this.avatarBg2
        }
    }

    onClickMusic() {
        AudioPlaybackService.instance._fn_dd()
        this._fn_ok()
        AudioPlaybackService.instance._fn_xc(Const.Audio.btn)

    }

    onClickSound() {
        AudioPlaybackService.instance._fn_de()
        this._fn_pd()
        AudioPlaybackService.instance._fn_xc(Const.Audio.btn)

    }

    _fn_ok() {
        if (!AudioPlaybackService.instance._fn_qf()) {
            tween(this.musicBtn.getChildByName("seticon")).to(0.2, { position: v3(40, 0, 0) }).to(0.1, { position: v3(36, 0, 0) }).start()

        } else {
            tween(this.musicBtn.getChildByName("seticon")).to(0.2, { position: v3(-40, 0, 0) }).to(0.1, { position: v3(-36, 0, 0) }).start()

        }
    }

    _fn_pd() {
        if (!AudioPlaybackService.instance._fn_qg()) {
            tween(this.soundBtn.getChildByName("seticon")).to(0.2, { position: v3(40, 0, 0) }).to(0.1, { position: v3(36, 0, 0) }).start()

        } else {
            tween(this.soundBtn.getChildByName("seticon")).to(0.2, { position: v3(-40, 0, 0) }).to(0.1, { position: v3(-36, 0, 0) }).start()

        }
    }

    openDuihuanMa() {
        AudioPlaybackService.instance._fn_xc(Const.Audio.btn)

        GamePlatform._fn_aja("open settings redeem")
        UiLayerService.instance._fn_xw(Const.Dialogs.CodeDialog)
    }

    openRoleInfo() {
        AudioPlaybackService.instance._fn_xc(Const.Audio.btn)
        UiLayerService.instance._fn_xw(Const.Dialogs.RoleInfoDialog)
    }

    _fn_ul() {
        this.clickCount++;
        this.unschedule(this._fn_abp);
        this.scheduleOnce(this._fn_abp, 3);
        if (this.clickCount >= 5) {
            this.close();
            UiLayerService.instance._fn_ahg(Const.Dialogs.GMInputLayer);
            this.clickCount = 0;
            this.unschedule(this._fn_abp);
        }
    }

    _fn_tv() {
        director.loadScene("loading");
    }

    _fn_abp() {
        this.clickCount = 0;
    }

}

