import { find, Label, Node, Sprite, SpriteFrame, tween, v3, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import { RoleSex } from '../../../config/global';
import { audioManager } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { resourceUtil } from '../../../easyFramework/mgr/resourceUtil';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import ServerCtr from '../../../tyqSDK/SDK/network/ServerCtr';
import { tyqSDK } from '../../../tyqSDK/SDK/tyqSDK';
import { aiRobot } from '../../comm/AIRobot';
import { userData } from '../../comm/UserData';
import GD from '../../../config/GD';

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
            uiManager.instance.showDialog(Const.Dialogs.PrivacyDialog)
        })

        this.bindButton(find("root/itembg/btnBianji", this.node)!, ()=>{
            uiManager.instance.showDialog(Const.Dialogs.ModifyDailog)
        })

        // this.bindButton(this.avatarBg, ()=>{
        //     uiManager.instance.showDialog(Const.Dialogs.AvatarListView)
        // })


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
        this.nameLabel.getComponent(Label)!.string = userData.roleName
        this.IDLabel.getComponent(Label)!.string = "ID:" + userData.roleID
        tyqSDK.eventSendCustomEvent("查看设置")

        this.verLabel.string = "版本号：" + Const.appBuildVersion + "_" + Const.hotupdateVersion

        if (userData.roleAvatar != "") {
            //动态加载图片的方法
            resourceUtil.setRemoteImage(userData.roleAvatar, this.avatarNode.getComponent(Sprite)!, () => { })
        }

        let item = tables.ins().getTableValueByID(Const.Tables.roleDressUp, userData.roleDressUpId)
        if (item.type == RoleSex.men) {
            this.avatarBg.getComponent(Sprite)!.spriteFrame = this.avatarBg1
        } else {
            this.avatarBg.getComponent(Sprite)!.spriteFrame = this.avatarBg2
        }

        this.clickCount = 0;
        this.unschedule(this.resetClickCount);

        aiRobot.stopUpdate();
    }

    refresh(){
        this.nameLabel.getComponent(Label)!.string = userData.roleName

        if (userData.roleAvatar != "") {
            //动态加载图片的方法
            resourceUtil.setRemoteImage(userData.roleAvatar, this.avatarNode.getComponent(Sprite)!, () => { })
        }
    }

    updateInfo() {
        this.nameLabel.getComponent(Label)!.string = userData.roleName
        this.IDLabel.getComponent(Label)!.string = "ID:" + userData.roleID

        let item = tables.ins().getTableValueByID(Const.Tables.roleDressUp, userData.roleDressUpId)
        if (item.type == RoleSex.men) {
            this.avatarBg.getComponent(Sprite)!.spriteFrame = this.avatarBg1
        } else {
            this.avatarBg.getComponent(Sprite)!.spriteFrame = this.avatarBg2
        }
    }

    openDuihuanMa() {
        audioManager.instance.playSound(Const.Audio.btn)

        tyqSDK.eventSendCustomEvent("查看设置-兑换码")
        uiManager.instance.pushShowDialog(Const.Dialogs.CodeDialog)
    }

    openRoleInfo() {
        audioManager.instance.playSound(Const.Audio.btn)
        uiManager.instance.pushShowDialog(Const.Dialogs.RoleInfoDialog)
    }

    onClickTitle() {
        this.clickCount++;
        this.unschedule(this.resetClickCount);
        this.scheduleOnce(this.resetClickCount, 3);
        if (this.clickCount >= 5) {
            this.close();
            uiManager.instance.showDialog(Const.Dialogs.GMInputLayer);
            this.clickCount = 0;
            this.unschedule(this.resetClickCount);
        }
    }

    resetClickCount() {
        this.clickCount = 0;
    }

}

