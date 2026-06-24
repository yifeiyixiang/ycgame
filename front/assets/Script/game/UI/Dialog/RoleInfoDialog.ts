import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, Layout, utils, EditBox, sp, } from 'cc';
import { Const } from '../../../config/Const';
import { RoleSex } from '../../../config/global';
import { AudioPlaybackService } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { ResourceLoaderService } from '../../../easyFramework/mgr/resourceUtil';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { playerDataStore } from '../../comm/UserData';

const { ccclass, property } = _decorator;

@ccclass('RoleInfoDialog')
export class RoleInfoDialog extends BaseView {

    @property({ type: Node, tooltip: "name input" }) nameEditBox: Node = null!;
    @property({ type: Node, tooltip: "名字Label" }) nameLabel: Node = null!;
    @property({ type: Node, tooltip: "名字Label" }) modifybtnLabel: Node = null!;

    @property({ type: sp.Skeleton }) roleSpine: sp.Skeleton = null!;

    @property({ type: Node, tooltip: "头像" }) avatarNode: Node = null!;
    @property({ type: Node, tooltip: "头像背景" }) avatarBg: Node = null!;


    @property({ type: SpriteFrame }) avatarBg1: SpriteFrame = null!;
    @property({ type: SpriteFrame }) avatarBg2: SpriteFrame = null!;


    _isEditState = false

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)
        this.bindButton(find("root/btnDress", this.node)!, () => {
            UiLayerService.instance.pushShowDialog(Const.Dialogs.AvatarStyleLayer)
        })
    }

    updateInfo() {
        let item = TableDataService.ins().getTableValueByID(Const.Tables.avatarStyle, playerDataStore.avatarLookId)

        ResourceLoaderService.loadResWithBundle(Const.resPath.roleSpine + item.spine, sp.SkeletonData, (err, skedata) => {
            this.roleSpine.skeletonData = skedata;
            this.roleSpine.setSkin(item.spineSkin)
            this.roleSpine.setAnimation(0, item.spineAni, true);
        })

        find("root/Layout/nameLabel", this.node)!.getComponent(Label)!.string = playerDataStore.roleName + ""

        if (item.type == RoleSex.men) {
            this.avatarBg.getComponent(Sprite)!.spriteFrame = this.avatarBg1
        }else{
            this.avatarBg.getComponent(Sprite)!.spriteFrame = this.avatarBg2
        }

    }

    show(args: any) {
        super.show(args)



        let infoNode = find("root/Layout", this.node)!
        find("dressNode/Label", infoNode)!.getComponent(Label)!.string = "装扮值：" + playerDataStore.dressValue + ""
        find("levelNode/Label", infoNode)!.getComponent(Label)!.string = "Level: " + playerDataStore.roleLv + ""
        find("idbg/IDLabel", infoNode)!.getComponent(Label)!.string = "ID:" + playerDataStore.roleID
        find("root/Layout/nameLabel", this.node)!.getComponent(Label)!.string = playerDataStore.roleName + ""

        this.nameEditBox.active = false
        this.nameLabel.active = true
        this._isEditState = false

        this.updateInfo()
    }

    onClickModifyBtn() {
        AudioPlaybackService.instance.playSound(Const.Audio.btn)
        UiLayerService.instance.pushShowDialog(Const.Dialogs.ModifyDailog)
        return

        if (this._isEditState) {
            let str = this.nameEditBox.getComponent(EditBox)!.string
            if (str == "") {
                this.toast("名字不能为空")
                return
            }
            playerDataStore.roleName = str
            find("root/nameLabel", this.node)!.getComponent(Label)!.string = playerDataStore.roleName + ""
            this.nameEditBox.active = false
            this.nameLabel.active = true
            this._isEditState = false
        } else {
            this._isEditState = true
            this.nameEditBox.active = true
            this.nameLabel.active = false
            this.modifybtnLabel.getComponent(Label)!.string + "保存"
            this.nameEditBox.getComponent(EditBox)!.string = playerDataStore.roleName
        }
    }

}

