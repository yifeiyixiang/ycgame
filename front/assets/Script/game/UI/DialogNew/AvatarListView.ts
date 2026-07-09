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
import { GamePlatform } from '../../platform/GamePlatform';

const { ccclass, property } = _decorator;



@ccclass('AvatarListView')
export class AvatarListView extends BaseView {


    @property({ type: Node, tooltip: "头像" }) avatarList: Node = null!;


    start() {
        this.bindButton(find("root/btnClose", this.node)!, this._fn_xe)
    }

    show(args: any) {
        super.show(args)




        aiRobot._fn_ain();
    }

    updateInfo() {

    }

    openDuihuanMa() {
        AudioPlaybackService.instance._fn_xc(Const.Audio.btn)

        GamePlatform._fn_aja("查看设置-兑换码")
        UiLayerService.instance._fn_xw(Const.Dialogs.CodeDialog)
    }

    openRoleInfo() {
        AudioPlaybackService.instance._fn_xc(Const.Audio.btn)
        UiLayerService.instance._fn_xw(Const.Dialogs.RoleInfoDialog)
    }
}

