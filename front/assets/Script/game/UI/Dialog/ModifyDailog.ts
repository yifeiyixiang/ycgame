import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, Layout, utils, EditBox, sp, } from 'cc';
import { Const } from '../../../config/Const';
import { AudioPlaybackService } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { ResourceLoaderService } from '../../../easyFramework/mgr/resourceUtil';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { playerDataStore } from '../../comm/UserData';
import { GameHttpClient } from '../../../../typeScript/net/HttpClient';

const { ccclass, property } = _decorator;

@ccclass('ModifyDailog')
export class ModifyDailog extends BaseView {

    @property({ type: Node, tooltip: "name input" }) nameEditBox: Node = null!;



    _isEditState = false

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this._fn_xe)
    }

    show(args: any) {
        super.show(args)

    }

    onClickModifyBtn() {
        AudioPlaybackService.instance._fn_xc(Const.Audio.btn)

        let str = this.nameEditBox.getComponent(EditBox)!.string
        if (str == "") {
            this._fn_aiu("名字不能为空")
            return
        }
        if(str.length > 7){
            this._fn_aiu("名字不能超过7个字")
            return
        }

        GameHttpClient._fn_ho()._fn_adp(1, str, (res: any)=>{
            playerDataStore.roleName = (res && res.res && res.res.data && res.res.data.userdata && res.res.data.userdata.nickname) || str
            this._fn_xe()
        })

    }

}

