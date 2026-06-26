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

    bagRecord!:BagPropRecord;

    itemConfig!:ShopConfigRecord;

    onLoad() {
        this.bindButton(this.btnSell, this.onBtnSell);

        this.bindButton(this.btnDress, this.onbtnDress);

        this.bindButton(this.btnUndress, this.onbtnUndress);

        this.bindButton(this.btnUse, this.onbtnUse);
    }

    refreshData(bagRecord:any){
        this.bagRecord = bagRecord
        if (!this.bagRecord){

            return;
        }

        this.itemConfig = TableDataService.ins().getTableValueByID(Const.Tables.new_prop, this.bagRecord.prop_id);
        if (!this.itemConfig){
            this.node.active = false;
            return;
        }
        this.nameLab.string = this.itemConfig.name;

        if (this.itemConfig.icon){
            this.setSpriteFrame(this.icon, Const.resPath.icon + this.itemConfig.icon, () => { }, 60)
            this.icon.node.active = true;
        }else{
            this.icon.node.active = false;
        }

        this.btnSell.active = false;
        this.btnDress.active = false;
        this.btnUndress.active = false;
        this.btnUse.active = false;
        this.statuLab.string = "";

        this.countLab.string = this.bagRecord.prop_count + ""

        if (this.itemConfig.store_type == 2){
            this.btnSell.active = true;



            this.desLab.string = this.itemConfig.mask;
        }
        else if (this.itemConfig.store_type == 3){

            if (this.bagRecord.is_active){
                this.statuLab.string = "已穿戴";
                this.btnUndress.active = true;
            }else{
                this.btnSell.active = true;


            }
            this.desLab.string = "评分：" +  this.itemConfig.score;
        }
        else if (this.itemConfig.store_type == 4){
             if (this.bagRecord.is_active){
                this.statuLab.string = "已装饰";
                this.btnUndress.active = true;
            }else{
                this.btnSell.active = true;

            }
            this.desLab.string = this.itemConfig.sonname;
        }

    }


    onClickHandler(eve:Event, str:string){
        AudioPlaybackService.instance.playSound(Const.Audio.btn)

    }

    onBtnSell(){
        if (this.itemConfig.store_type == 2){
            GameHttpClient.getInstance().sendSellBagItem(this.itemConfig.store_type, this.bagRecord.prop_id)
        }else{
            GameHttpClient.getInstance().sendSellBagItem(this.itemConfig.store_type, this.bagRecord.id)
        }

    }
    onbtnDress(){

    }
    onbtnUndress(){
        if (this.itemConfig.store_type == 3){
            GameHttpClient.getInstance().sendPetAction(6, 0, this.bagRecord.id, this.bagRecord.prop_id,"",()=>{
                GameEventManager.eventTarget.emit(GameEventManager.EEventName.SHOW_TIP, "卸下成功");
            });
        }
    }
    onbtnUse(){

    }

}

