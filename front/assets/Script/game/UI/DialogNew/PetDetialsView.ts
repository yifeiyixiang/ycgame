import { Button, find, instantiate, Node, ProgressBar, Sprite, tween, v3, Vec3, _decorator,Label,sp } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
import { BagPropRecord, GameRuntimeData, PetProfileRecord, ShopConfigRecord } from '../../../../typeScript/gameData';
import { playerDataStore } from '../../comm/UserData';
import { GameHttpClient } from '../../../../typeScript/net/HttpClient';
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

    curData:PetProfileRecord = null!;

    curCfg:ShopConfigRecord = null!;

    curItemType:number = 2;

    curContent:Node;

    onLoad() {
        this.bindButton(this.btnClose, this.onClickBtnClose);

        this.bindButton(find("root/nameBg/btnName", this.node)!, () => {
            UiLayerService.instance.showDialog(Const.Dialogs.PetNameView, this.curData)
        })

        this.bindButton(find("root/btnFangsheng", this.node)!, () => {
            UiLayerService.instance.showDialog(Const.Dialogs.PetComonTipView, [1, this.curData])
        })

        this.bindButton(find("root/btnXiuxi", this.node)!, () => {
            UiLayerService.instance.showDialog(Const.Dialogs.PetComonTipView, [3, this.curData])
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
        this.curCfg = TableDataService.ins().getTableValueByID(Const.Tables.new_prop, this.curData.prop_id);



        this.getData();
    }

    getData(){
        GameHttpClient.getInstance().getPetList();
        GameHttpClient.getInstance().sednBagInfo(this.curItemType);
    }

    refresh(){

        if (!this.curData){
            this.close();
            return;
        }

        this.curData = GameRuntimeData.getPetDataById(this.curData.id);

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

            this.noSkinNode.active = playerDataStore.bagProps.length == 0;
        }

        for (let cellIndex = 0; cellIndex < this.curContent.children.length; cellIndex++) {
            const petItemCell = this.curContent.children[cellIndex];
            if (petItemCell){
                petItemCell.active = false;
            }
        }

        for (let bagIndex = 0; bagIndex < playerDataStore.bagProps.length; bagIndex++) {
            const bagRecord:BagPropRecord = playerDataStore.bagProps[bagIndex];
            let itemConfig:ShopConfigRecord = TableDataService.ins().getTableValueByID(Const.Tables.new_prop, bagRecord.prop_id);

            let petItemCell = this.curContent.children[bagIndex];
            if (!petItemCell){
                petItemCell = instantiate(this.curContent.children[0])
                petItemCell.parent = this.curContent;
            }
            petItemCell.active = true;

            petItemCell.getChildByName("desLab").getComponent(Label).string = itemConfig.store_type == 2?itemConfig.mask:("评分 +" + itemConfig.score);
            petItemCell.getChildByName("nameLab").getComponent(Label).string = itemConfig.name
            petItemCell.getChildByName("countLab").getComponent(Label).string = bagRecord.prop_count + ""

            if (itemConfig.icon){
                this.setSpriteFrame(petItemCell.getChildByName("icon").getComponent(Sprite), Const.resPath.icon + itemConfig.icon, () => { }, 60)
                petItemCell.getChildByName("icon").active = true;
            }else{
                petItemCell.getChildByName("icon").active = false;
            }

            petItemCell.getChildByName("btnUse").off("click")
            petItemCell.getChildByName("btnDress").off("click")
            if (itemConfig.type == 3){
                petItemCell.getChildByName("btnUse").active = true;
                petItemCell.getChildByName("btnDress").active = false;
                petItemCell.getChildByName("dressd").active = false;

                petItemCell.getChildByName("btnUse").on("click", ()=>{

                    GameHttpClient.getInstance().sendPetAction(4, this.curData.id, itemConfig.id, 0, "", ()=>{
                        GameHttpClient.getInstance().sednBagInfo(2);
                    })
                }, this);
            }else{
                petItemCell.getChildByName("btnUse").active = false;
                petItemCell.getChildByName("btnDress").active = !bagRecord.is_active;
                petItemCell.getChildByName("dressd").active = bagRecord.is_active;

                petItemCell.getChildByName("btnDress").on("click", ()=>{

                    GameHttpClient.getInstance().sendPetAction(5, this.curData.id, itemConfig.id, bagRecord.id);
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

