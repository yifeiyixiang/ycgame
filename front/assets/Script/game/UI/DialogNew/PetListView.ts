import { Button, find, instantiate, Node, ProgressBar, Sprite, tween, v3, Vec3, _decorator,Label,sp } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
import { playerDataStore } from '../../comm/UserData';
import { PetProfileRecord, ShopConfigRecord } from '../../../../typeScript/gameData';
import { PetConfigRecord } from '../../../../typeScript/LanauageManager';
import { ResourceLoaderService } from '../../../easyFramework/mgr/resourceUtil';
import { GameHttpClient } from '../../../../typeScript/net/HttpClient';
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

    selectData:PetProfileRecord = null!;

    selectCfg:ShopConfigRecord = null!;

    onLoad() {
        this.bindButton(this.btnClose, this.onClickBtnClose);

        this.bindButton(find("root/nameBg/btnName", this.node)!, () => {
            if (!this.selectData){
                return
            }
            UiLayerService.instance.showDialog(Const.Dialogs.PetNameView, this.selectData)
        })

        this.bindButton(find("root/btnFangsheng", this.node)!, () => {
            UiLayerService.instance.showDialog(Const.Dialogs.PetComonTipView, [1,this.selectData])
        })

        this.bindButton(find("root/btnDitials", this.node)!, () => {
            UiLayerService.instance.showDialog(Const.Dialogs.PetDetialsView, this.selectData);
        })

        this.bindButton(find("root/btnHome", this.node)!, () => {
            UiLayerService.instance.showDialog(Const.Dialogs.PetComonTipView, [2,this.selectData])
        })
    }

    onEnable() {
        this.on(GD.event.updateGame, this.refresh)

        GameHttpClient.getInstance().getPetList();
    }

    onDisable() {
        this.off(GD.event.updateGame, this)
    }

    show(args: any) {
        super.show(args);

        this.refresh();
    }

     refresh(){
        for (let cellIndex = 0; cellIndex < this.listContent.children.length; cellIndex++) {
            const petCellNode = this.listContent.children[cellIndex];
            if (petCellNode){
                petCellNode.active = false;
            }
        }

        for (let petIndex = 0; petIndex < playerDataStore.pets.length; petIndex++) {
            const petRecord:PetProfileRecord = playerDataStore.pets[petIndex];
            let petShopConfig:ShopConfigRecord = TableDataService.ins().getTableValueByID(Const.Tables.new_prop, petRecord.prop_id);

            let petCellNode = this.listContent.children[petIndex];
            if (!petCellNode){
                petCellNode = instantiate(this.listContent.children[0])
                petCellNode.parent = this.listContent;
            }
            petCellNode.active = true;

            if (petShopConfig.icon){
            this.setSpriteFrame(petCellNode.getChildByName("icon").getComponent(Sprite), Const.resPath.icon + petShopConfig.icon, () => { }, 60)
                petCellNode.getChildByName("icon").active = true;
            }else{
                petCellNode.getChildByName("icon").active = false;
            }

            if (this.selectInd == petIndex){
                this.selectCfg = petShopConfig;
                this.selectData = petRecord;
            }

            petCellNode.getChildByName("select").active = this.selectInd == petIndex;

            petCellNode.off("click");
            petCellNode.on("click", ()=>{
                this.selectInd = petIndex;
                this.refresh();
            }, this);
        }

        if(this.selectData){
            this.nameLab.string = this.selectData.name;

            this.scoreLab.string = this.selectData.score;

            this.btnHome.active = !this.selectData.is_active;

            this.showSke.getComponent("pet").init(this.selectData);
        }






    }

    onClickBtnClose() {
        this.close();
    }

}

