import { Button, find, instantiate, Node, ProgressBar, Sprite, tween, v3, Vec3, _decorator,Label,sp } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { composeModel } from '../../comm/composeModel';
import { userData } from '../../comm/UserData';
import { petItemData, ShopCfg } from '../../../../typeScript/gameData';
import { petConfig } from '../../../../typeScript/LanauageManager';
import { resourceUtil } from '../../../easyFramework/mgr/resourceUtil';
import { HttpClient } from '../../../../typeScript/net/HttpClient';
const { ccclass, property } = _decorator;

@ccclass('PetListView')
export class PetListView extends BaseView {

    @property({ type: Node })
    btnClose: Node = null!;

    @property({ type: Label })
    nameLab: Label = null!;

    @property({ type: Label })
    scoreLab: Label = null!;

    @property({ type: Node })
    listContent: Node = null!;

    @property({ type: Node })
    btnHome: Node = null!;

    @property({ type: Node })
    showSke: Node = null!;

    selectInd:number = 0;

    selectData:petItemData = null!;

    selectCfg:ShopCfg = null!;

    onLoad() {
        this.bindButton(this.btnClose, this.onClickBtnClose);

        this.bindButton(find("root/nameBg/btnName", this.node)!, () => {
            if (!this.selectData){
                return
            }
            uiManager.instance.showDialog(Const.Dialogs.PetNameView, this.selectData)
        })

        this.bindButton(find("root/btnFangsheng", this.node)!, () => {
            uiManager.instance.showDialog(Const.Dialogs.PetComonTipView, [1,this.selectData])
        })

        this.bindButton(find("root/btnDitials", this.node)!, () => {
            uiManager.instance.showDialog(Const.Dialogs.PetDetialsView, this.selectData);
        })

        this.bindButton(find("root/btnHome", this.node)!, () => {
            uiManager.instance.showDialog(Const.Dialogs.PetComonTipView, [2,this.selectData])
        })
    }

    onEnable() {
        this.on(GD.event.updateGame, this.refresh)

        HttpClient.getInstance().getPetList();
    }

    onDisable() {
        this.off(GD.event.updateGame, this)
    }

    show(args: any) {
        super.show(args);

        this.refresh();
    }

     refresh(){
        for (let index = 0; index < this.listContent.children.length; index++) {
            const element = this.listContent.children[index];
            if (element){
                element.active = false;
            }
        }

        for (let index = 0; index < userData.pets.length; index++) {
            const petData:petItemData = userData.pets[index];
            let shopCfg:ShopCfg = tables.ins().getTableValueByID(Const.Tables.new_prop, petData.prop_id);

            let ele = this.listContent.children[index];
            if (!ele){
                ele = instantiate(this.listContent.children[0])
                ele.parent = this.listContent;
            }
            ele.active = true;

            if (shopCfg.icon){
            this.setSpriteFrame(ele.getChildByName("icon").getComponent(Sprite), Const.resPath.icon + shopCfg.icon, () => { }, 60)
                ele.getChildByName("icon").active = true;
            }else{
                ele.getChildByName("icon").active = false;
            }

            if (this.selectInd == index){
                this.selectCfg = shopCfg;
                this.selectData = petData;
            }

            ele.getChildByName("select").active = this.selectInd == index;

            ele.off("click");
            ele.on("click", ()=>{
                this.selectInd = index;
                this.refresh();
            }, this);
        }

        if(this.selectData){
            this.nameLab.string = this.selectData.name;

            this.scoreLab.string = this.selectData.score;

            this.btnHome.active = !this.selectData.is_active;

            this.showSke.getComponent("pet").init(this.selectData);
        }

        // resourceUtil.loadResWithBundle( guestData.sp, sp.SkeletonData, (err, skedata) => {
        //     this.guestSpine.skeletonData = skedata;
        //     this.guestSpine.setSkin("skin1")
        //     this.guestSpine.setAnimation(0, "idle1", true);
        // })
    }

    onClickBtnClose() {
        this.close();
    }

}

