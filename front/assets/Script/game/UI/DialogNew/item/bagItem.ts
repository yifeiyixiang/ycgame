import { Component,Button, find, instantiate, Node, ProgressBar, Sprite, tween, v3, Vec3, _decorator,Label } from 'cc';
import { Const } from '../../../../config/Const';
import GD from '../../../../config/GD';
import BaseView from '../../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../../easyFramework/mgr/uiManager';
import tables from '../../../../easyFramework/other/tables';
import { UtilPub } from '../../../../easyFramework/utils/UtilPub';
import { mergeBoardModel } from '../../../comm/mergeBoardModel';
import { audioManager } from '../../../../easyFramework/mgr/audioManager';
import { BagPropData, ShopCfg } from '../../../../../typeScript/gameData';
import { userData } from '../../../comm/UserData';
import { HttpClient } from '../../../../../typeScript/net/HttpClient';
import { LanauageManager } from '../../../../../typeScript/LanauageManager';
import { EventManger } from '../../../../../typeScript/EventManger';
const { ccclass, property } = _decorator;

@ccclass('bagItem')
export class bagItem extends BaseView {

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

    bagData!:BagPropData;

    shopCfg!:ShopCfg;

    onLoad() {
        this.bindButton(this.btnSell, this.onBtnSell);

        this.bindButton(this.btnDress, this.onbtnDress);

        this.bindButton(this.btnUndress, this.onbtnUndress);

        this.bindButton(this.btnUse, this.onbtnUse);
    }

    refreshData(data:any){
        this.bagData = data
        if (!this.bagData){
            // this.node.active = false;
            return;
        }

        this.shopCfg = tables.ins().getTableValueByID(Const.Tables.new_prop, this.bagData.prop_id);
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
            //todo 背包无法使用
            // this.btnUse.active = true;

            this.desLab.string = this.shopCfg.mask;
        }
        else if (this.shopCfg.store_type == 3){

            if (this.bagData.is_active){
                this.statuLab.string = "已穿戴";
                this.btnUndress.active = true;
            }else{
                this.btnSell.active = true;
                //todo 背包无法穿戴
                //this.btnDress.active = true;
            }
            this.desLab.string = "评分：" +  this.shopCfg.score;
        }
        else if (this.shopCfg.store_type == 4){
             if (this.bagData.is_active){
                this.statuLab.string = "已装饰";
                this.btnUndress.active = true;
            }else{
                this.btnSell.active = true;
                //this.btnUse.active = true;
            }
            this.desLab.string = this.shopCfg.sonname;
        }
        
    }


    onClickHandler(eve:Event, str:string){
        audioManager.instance.playSound(Const.Audio.btn)

    }

    onBtnSell(){
        if (this.shopCfg.store_type == 2){
            HttpClient.getInstance().sendSellBagItem(this.shopCfg.store_type, this.bagData.prop_id)
        }else{
            HttpClient.getInstance().sendSellBagItem(this.shopCfg.store_type, this.bagData.id)
        }
        
    }
    onbtnDress(){

    }
    onbtnUndress(){
        if (this.shopCfg.store_type == 3){
            HttpClient.getInstance().sendPetAction(6, 0, this.bagData.id, this.bagData.prop_id,"",()=>{
                EventManger.eventTarget.emit(EventManger.EEventName.SHOW_TIP, "卸下成功");
            });
        }
    }
    onbtnUse(){

    }

}

