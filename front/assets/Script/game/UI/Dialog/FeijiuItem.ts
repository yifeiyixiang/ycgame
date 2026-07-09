import { _decorator, Node, Label, find, Sprite, SpriteFrame, tween, v3, UITransform, color, UIOpacity, } from 'cc';
import { Const } from '../../../config/Const';
import { GSceneSkinState } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import { SceneData } from '../../comm/SceneData';
const { ccclass, property } = _decorator;

@ccclass('FeijiuItem')
export class FeijiuItem extends BaseView {
    @property({ type: Node }) icon: Node = null!;

    _propdata: any = null

    start() {
        let guestConfig = this._layerData.roleData
        this._fn_agk(this.icon.getComponent(Sprite)!, Const.resPath.roleIcon + guestConfig.icon, undefined, 200)

        if (SceneData.ins._fn_ky(guestConfig.skin) == GSceneSkinState.gotted) {
            this.icon.getComponent(Sprite)!.color = Const.color.white
            this.icon.getComponent(UIOpacity)!.opacity = 255
            find("roleItembg/name", this.node)!.getComponent(Label)!.string = guestConfig.name
        } else {
            this.icon.getComponent(Sprite)!.color = Const.color.black
            this.icon.getComponent(UIOpacity)!.opacity = 80
            find("roleItembg/name", this.node)!.getComponent(Label)!.string = "?????"
        }
        this.bindButton(this.node, () => {
            UiLayerService.instance._fn_ahg(Const.Dialogs.FeijiuInfoDialog, { roleData: guestConfig });
        })
    }

}

