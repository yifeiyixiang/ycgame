import { Component,Button, find, instantiate, Node, ProgressBar, Sprite, tween, v3, Vec3, _decorator,Label } from 'cc';
import { Const } from '../../../../config/Const';
import GD from '../../../../config/GD';
import BaseView from '../../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../../easyFramework/other/tables';
import { UtilPub } from '../../../../easyFramework/utils/UtilPub';
import { mergeBoardStateStore } from '../../../comm/mergeBoardModel';
import { AudioPlaybackService } from '../../../../easyFramework/mgr/audioManager';
import { BagPropRecord, ShopConfigRecord } from '../../../../../typeScript/gameData';
import { playerDataStore } from '../../../comm/UserData';
import { GameHttpClient } from '../../../../../typeScript/net/HttpClient';
import { LanguageContentManager } from '../../../../../typeScript/LanauageManager';
import { GameEventManager } from '../../../../../typeScript/EventManger';
const { ccclass, property } = _decorator;

@ccclass('bagItem')
export class BagItemCellController extends BaseView {

    @property({ type: Sprite })
    icon: Sprite = null!;

    @property({ type: Label })
    nameLab: Label = null!;

    @property({ type: Label })
    desLab: Label = null!;

    @property({ type: Label })
    statuLab: Label = null!;

    @property({ type: Label })
    countLab: Label = null!;

    @property({ type: Node })
    btnSell: Node = null!;

    @property({ type: Node })
    btnDress: Node = null!;

    @property({ type: Node })
    btnUndress: Node = null!;

    @property({ type: Node })
    btnUse: Node = null!;

    bagData!:BagPropRecord;

    shopCfg!:ShopConfigRecord;

    onLoad() {
        this.bindButton(this.btnSell, this.onBtnSell);

        this.bindButton(this.btnDress, this.onbtnDress);

        this.bindButton(this.btnUndress, this.onbtnUndress);

        this.bindButton(this.btnUse, this.onbtnUse);
    }

    refreshData(data:any){
        this.bagData = data
        if (!this.bagData){

            return;
        }

        this.shopCfg = TableDataService.ins().getTableValueByID(Const.Tables.new_prop, this.bagData.prop_id);
        if (!this.shopCfg){
            this.node.active = false;
            return;
        }
        this.nameLab.string = this.shopCfg.name;

        if (this.shopCfg.icon){
            this.setSpriteFrame(this.icon, Const.resPath.icon + this.shopCfg.icon, () => { }, 60)
            this.icon.node.active = true;
        }else{
            this.icon.node.active = false;
        }

        this.btnSell.active = false;
        this.btnDress.active = false;
        this.btnUndress.active = false;
        this.btnUse.active = false;
        this.statuLab.string = "";

        this.countLab.string = this.bagData.prop_count + ""

        if (this.shopCfg.store_type == 2){
            this.btnSell.active = true;



            this.desLab.string = this.shopCfg.mask;
        }
        else if (this.shopCfg.store_type == 3){

            if (this.bagData.is_active){
                this.statuLab.string = "已穿戴";
                this.btnUndress.active = true;
            }else{
                this.btnSell.active = true;


            }
            this.desLab.string = "评分：" +  this.shopCfg.score;
        }
        else if (this.shopCfg.store_type == 4){
             if (this.bagData.is_active){
                this.statuLab.string = "已装饰";
                this.btnUndress.active = true;
            }else{
                this.btnSell.active = true;

            }
            this.desLab.string = this.shopCfg.sonname;
        }

    }


    onClickHandler(eve:Event, str:string){
        AudioPlaybackService.instance.playSound(Const.Audio.btn)

    }

    onBtnSell(){
        if (this.shopCfg.store_type == 2){
            GameHttpClient.getInstance().sendSellBagItem(this.shopCfg.store_type, this.bagData.prop_id)
        }else{
            GameHttpClient.getInstance().sendSellBagItem(this.shopCfg.store_type, this.bagData.id)
        }

    }
    onbtnDress(){

    }
    onbtnUndress(){
        if (this.shopCfg.store_type == 3){
            GameHttpClient.getInstance().sendPetAction(6, 0, this.bagData.id, this.bagData.prop_id,"",()=>{
                GameEventManager.eventTarget.emit(GameEventManager.EEventName.SHOW_TIP, "卸下成功");
            });
        }
    }
    onbtnUse(){

    }

}

