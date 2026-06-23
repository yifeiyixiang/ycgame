import { Button, find, instantiate, Node, ProgressBar, Sprite, tween, v3, Vec3, _decorator,Label,sp } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { mergeBoardModel } from '../../comm/mergeBoardModel';
import { BagPropData, gameData, petItemData, ShopCfg } from '../../../../typeScript/gameData';
import { userData } from '../../comm/UserData';
import { HttpClient } from '../../../../typeScript/net/HttpClient';
const { ccclass, property } = _decorator;

@ccclass('PetDetialsView')
export class PetDetialsView extends BaseView {

    @property({ type: Node })
    btnClose: Node = null!;

    @property({ type: Label })
    scoreLab: Label = null!;

    @property({ type: Label })
    nameLab: Label = null!;

    @property({ type: Node })
    shuxingNode: Node = null!;

    @property({ type: Node })
    shuxingContent: Node = null!;

    @property({ type: ProgressBar })
    shuxingPro: ProgressBar = null!;

    @property({ type: ProgressBar })
    shuxingPro2: ProgressBar = null!;

    @property({ type: ProgressBar })
    shuxingPro3: ProgressBar = null!;

    @property({ type: Node })
    skinNode: Node = null!;

    @property({ type: Node })
    noSkinNode: Node = null!;

    @property({ type: Node })
    skinContent: Node = null!;

    @property({ type: Node })
    petShowPfb: Node = null!;

    curData:petItemData = null!;

    curCfg:ShopCfg = null!;

    curItemType:number = 2;     //当前道具类型 2宠物食物，3 宠物服饰

    curContent:Node;

    onLoad() {
        this.bindButton(this.btnClose, this.onClickBtnClose);

        this.bindButton(find("root/nameBg/btnName", this.node)!, () => {
            uiManager.instance.showDialog(Const.Dialogs.PetNameView, this.curData)
        })

        this.bindButton(find("root/btnFangsheng", this.node)!, () => {
            uiManager.instance.showDialog(Const.Dialogs.PetComonTipView, [1, this.curData])
        })

        this.bindButton(find("root/btnXiuxi", this.node)!, () => {
            uiManager.instance.showDialog(Const.Dialogs.PetComonTipView, [3, this.curData])
        })

        this.shuxingNode.active = true
        this.skinNode.active = false
    }

    onEnable() {
        this.on(GD.event.updateGame, this.refresh)
    }

    onDisable() {
        this.off(GD.event.updateGame, this)
    }

    show(args: any) {
        super.show(args);

        this.curData = args;
        this.curCfg = tables.ins().getTableValueByID(Const.Tables.new_prop, this.curData.prop_id);

        //this.refresh();

        this.getData();
    }

    getData(){
        HttpClient.getInstance().getPetList();
        HttpClient.getInstance().sednBagInfo(this.curItemType);
    }

    refresh(){

        if (!this.curData){
            this.close();
            return;
        }

        this.curData = gameData.getPetDataById(this.curData.id);

        if (!this.curData){
            this.close();
            return;
        }

        this.nameLab.string = this.curData.name;

        this.scoreLab.string = this.curData.score;

        find("root/btnXiuxi", this.node).active = this.curData.is_active;

        if (this.shuxingNode.active){
            this.shuxingPro.progress = this.curData.mood_value/Const.CLEAN_FULL;
            this.shuxingPro2.progress = this.curData.hunger_value/Const.CLEAN_FULL;
            this.shuxingPro3.progress = this.curData.clean_value/Const.CLEAN_FULL;

            this.shuxingPro.node.getChildByName("proLab").getComponent(Label).string = this.curData.mood_value + "/" + Const.CLEAN_FULL;
            this.shuxingPro2.node.getChildByName("proLab").getComponent(Label).string = this.curData.hunger_value + "/" + Const.CLEAN_FULL;
            this.shuxingPro3.node.getChildByName("proLab").getComponent(Label).string = this.curData.clean_value + "/" + Const.CLEAN_FULL;

            this.curItemType = 2;

            this.curContent = this.shuxingContent;
        }

        if(this.skinNode.active){
            this.curItemType = 3;
            this.curContent = this.skinContent;

            this.noSkinNode.active = userData.bagProps.length == 0;
        }

        for (let index = 0; index < this.curContent.children.length; index++) {
            const element = this.curContent.children[index];
            if (element){
                element.active = false;
            }
        }

        for (let index = 0; index < userData.bagProps.length; index++) {
            const bagData:BagPropData = userData.bagProps[index];
            let shopCfg:ShopCfg = tables.ins().getTableValueByID(Const.Tables.new_prop, bagData.prop_id);

            let ele = this.curContent.children[index];
            if (!ele){
                ele = instantiate(this.curContent.children[0])
                ele.parent = this.curContent;
            }
            ele.active = true;

            ele.getChildByName("desLab").getComponent(Label).string = shopCfg.store_type == 2?shopCfg.mask:("评分 +" + shopCfg.score);
            ele.getChildByName("nameLab").getComponent(Label).string = shopCfg.name
            ele.getChildByName("countLab").getComponent(Label).string = bagData.prop_count + ""

            if (shopCfg.icon){
                this.setSpriteFrame(ele.getChildByName("icon").getComponent(Sprite), Const.resPath.icon + shopCfg.icon, () => { }, 60)
                ele.getChildByName("icon").active = true;
            }else{
                ele.getChildByName("icon").active = false;
            }

            ele.getChildByName("btnUse").off("click")
            ele.getChildByName("btnDress").off("click")
            if (shopCfg.type == 3){
                ele.getChildByName("btnUse").active = true;
                ele.getChildByName("btnDress").active = false;
                ele.getChildByName("dressd").active = false;

                ele.getChildByName("btnUse").on("click", ()=>{
                    //使用道具
                    HttpClient.getInstance().sendPetAction(4, this.curData.id, shopCfg.id, 0, "", ()=>{
                        HttpClient.getInstance().sednBagInfo(2);
                    })
                }, this);
            }else{
                ele.getChildByName("btnUse").active = false;
                ele.getChildByName("btnDress").active = !bagData.is_active;
                ele.getChildByName("dressd").active = bagData.is_active;

                ele.getChildByName("btnDress").on("click", ()=>{
                    //穿戴
                    HttpClient.getInstance().sendPetAction(5, this.curData.id, shopCfg.id, bagData.id);
                }, this);
            }
        }

        this.petShowPfb.getComponent("pet").init(this.curData);
      
    }

    onClickHandler(eve:Event, str:string){
        if (str == "togShuxing"){
            this.shuxingNode.active = true
            this.skinNode.active = false
            this.curItemType = 2
            this.getData();
            
        }else if (str == "togSkin"){
            this.shuxingNode.active = false
            this.skinNode.active = true
            this.curItemType = 3
            this.getData();
        }
    }
    
    onClickBtnClose() {
        this.close();
    }

}

