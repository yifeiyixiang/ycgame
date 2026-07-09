import { _decorator, Component, Node, find, Label, Sprite, Scene, SpriteFrame } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { GSceneSkinState } from '../../../config/global';
import { BaseUiComponent } from '../../../easyFramework/mgr/comm';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { SceneData } from '../../comm/SceneData';
import { playerDataStore } from '../../comm/UserData';
import { UtilScene } from '../../comm/UtilScene';
const { ccclass, property } = _decorator;

@ccclass('store_skin_item')
export class StoreSkinItemController extends BaseUiComponent {
    get root(){return find("root", this.node)!}
    get selBgNode(){return find("root/selBg", this.node)!}
    get selBg(){return find("root/selBg/sel", this.node)!}
    get unselBg(){return find("root/selBg/unsel", this.node)!}
    get newBirdIcon(){return find("root/selBg/new_bird_icon", this.node)!}
    get dressNode(){return find("root/selBg/dress", this.node)!}
    get dressIcon(){return find("root/selBg/dress/icon_dress", this.node)!.getComponent(Sprite)!}
    get dressVal(){return find("root/selBg/dress/dress_val", this.node)!.getComponent(Label)!}
    get icon(){return find("root/selBg/icon", this.node)!.getComponent(Sprite)!}
    get infoBtn(){return find("root/selBg/info", this.node)!}
    get buyBtn(){return find("root/bottom/buyBtn", this.node)!}
    get resIcon(){return find("root/bottom/buyBtn/res_icon", this.node)!.getComponent(Sprite)!}
    get resVal(){return find("root/bottom/buyBtn/res_val", this.node)!.getComponent(Label)!}
    get val(){return find("root/bottom/val", this.node)!.getComponent(Label)!}
    get using(){return find("root/bottom/using", this.node)!}
    get gotted(){return find("root/bottom/gotted", this.node)!}

    skinId:number=0

    start() {

        this.bindButton(this.infoBtn, ()=>{
            UiLayerService.instance._fn_ahg(Const.Dialogs.SceneSkinDetailController, { skinId: this.skinId })
        })


        this.bindButton(this.buyBtn, ()=>{
            UiLayerService.instance._fn_ahg(Const.Dialogs.SceneSkinDetailController, {skinId:this.skinId})
        })


        this.bindButton(this.selBgNode, ()=>{
            this.emit(GD.event.clickDressItem, this.skinId)
        })
    }

    init(skinId:number, selId:number){

        this.skinId = skinId
        this._fn_ajx(selId)

        let skinData = TableDataService.ins()._fn_ly(Const.Tables.scene_skin, skinId)
        this.buyBtn.active = false
        this.gotted.active = false
        this.using.active = false
        this.dressNode.active = false
        if(SceneData.ins._fn_ky(this.skinId) == GSceneSkinState.noGotted){

            this.buyBtn.active = true
            let itemId = skinData.res.split(",")[0]
            let itemData = TableDataService.ins()._fn_ly(Const.Tables.prop, itemId)
            this._fn_agk(this.resIcon, Const.resPath.icon + itemData.icon)
            this.resVal.string = "x"+skinData.res.split(",")[1]

            this.dressNode.active = true
            this.dressVal.string =  "+"+skinData.zb.split(",")[1]

        }else{

            let script = UtilScene._fn_kw(Const.SelSceneNode)
            UtilPub.log("------皮肤ID---", script.id)
            let data = SceneData.ins._fn_ku(script.id, script.type)!
            if(this.skinId==data.skin){
                this.using.active = true
            }else{
                this.gotted.active = true
            }
        }
        UtilScene._fn_agh(this.icon, skinData)


        this.newBirdIcon.active = false
        let arr = TableDataService.ins()._fn_lt(Const.Tables.scene_guest)
        for(let i=0;i<arr.length; i++){
            let row = arr[i]
            if (this.skinId == row.skin ){
                this.newBirdIcon.active = true
                break;
            }
        }

    }

    _fn_ajx(selSkinId:number){
        UtilPub.log("------显示选中---", selSkinId, this.skinId)
        this.selBg.active = selSkinId==this.skinId
        this.unselBg.active = !this.selBg.active
    }


}


