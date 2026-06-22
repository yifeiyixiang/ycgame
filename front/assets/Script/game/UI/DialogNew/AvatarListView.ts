import { find, Label, Node, Sprite, SpriteFrame, tween, v3, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import { RoleSex } from '../../../config/global';
import { audioManager } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { resourceUtil } from '../../../easyFramework/mgr/resourceUtil';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { aiRobot } from '../../comm/AIRobot';
import { userData } from '../../comm/UserData';
import { GamePlatform } from '../../platform/GamePlatform';

const { ccclass, property } = _decorator;



@ccclass('AvatarListView')
export class AvatarListView extends BaseView {


    @property({ type: Node, tooltip: "头像" }) avatarList: Node = null!;


    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)
    }

    show(args: any) {
        super.show(args)
        // if (userData.roleAvatar != "") {
        //     //动态加载图片的方法
        //     resourceUtil.setRemoteImage(userData.roleAvatar, this.avatarNode.getComponent(Sprite)!, () => { })
        // }
        aiRobot.stopUpdate();
    }

    updateInfo() {

    }

    openDuihuanMa() {
        audioManager.instance.playSound(Const.Audio.btn)

        GamePlatform.track("查看设置-兑换码")
        uiManager.instance.pushShowDialog(Const.Dialogs.CodeDialog)
    }

    openRoleInfo() {
        audioManager.instance.playSound(Const.Audio.btn)
        uiManager.instance.pushShowDialog(Const.Dialogs.RoleInfoDialog)
    }
}

