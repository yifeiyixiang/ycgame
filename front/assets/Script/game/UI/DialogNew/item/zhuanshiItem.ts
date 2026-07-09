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

@ccclass('zhuanshiItem')
export class DiamondItemCellController extends BaseView {

    @property({ type: Sprite })
    icon: Sprite = null!;

    @property({ type: Label })
    nameLab: Label = null!;

    @property({ type: Label })
    desLab: Label = null!;

    @property({ type: Label })
    statuLab: Label = null!;

    @property({ type: Node })
    btnSell: Node = null!;

    @property({ type: Node })
    btnDress: Node = null!;

    @property({ type: Node })
    btnUndress: Node = null!;

    @property({ type: Node })
    btnUse: Node = null!;

    decorationRecord!:BagPropRecord;

    decorationConfig!:ShopConfigRecord;

    onLoad() {







    }

    refreshData(decorationRecord:any){
        this.decorationRecord = decorationRecord
        if (!this.decorationRecord){

            return;
        }

        this.decorationConfig = TableDataService.ins()._fn_ly(Const.Tables.new_prop, this.decorationRecord.prop_id);
        this.nameLab.string = this.decorationConfig.name;

        if (this.decorationConfig.icon){
            this._fn_agk(this.icon, Const.resPath.icon + this.decorationConfig.icon, () => { }, 60)
            this.icon.node.active = true;
        }else{
            this.icon.node.active = false;
        }

        this.btnSell.active = false;
        this.btnDress.active = false;
        this.btnUndress.active = false;
        this.btnUse.active = false;
        this.statuLab.string = "";
        if (this.decorationConfig.store_type == 2){
            this.btnSell.active = true;
            this.btnUse.active = true;

            this.desLab.string = this.decorationConfig.mask;
        }
        else if (this.decorationConfig.store_type == 3){

            if (this.decorationRecord.is_active){
                this.statuLab.string = "已穿戴";
                this.btnUndress.active = true;
            }else{
                this.btnSell.active = true;
                this.btnDress.active = true;
            }
            this.desLab.string = "评分：" +  this.decorationConfig.score;
        }
        else if (this.decorationConfig.store_type == 4){
             if (this.decorationRecord.is_active){
                this.statuLab.string = "已装饰";
                this.btnUndress.active = true;
            }else{


            }
            this.desLab.string =  ""
        }

    }


    onClickHandler(eve:Event, str:string){
        AudioPlaybackService.instance._fn_xc(Const.Audio.btn)


        let canOperateDecoration:boolean = false;
        if (playerDataStore.sceneStau == 1 && this.decorationConfig.typeson == 1){
            canOperateDecoration = true;
        }else if (playerDataStore.sceneStau == 2 && this.decorationConfig.typeson == 2){
            canOperateDecoration = true;
        }else{
            canOperateDecoration = false;
            this._fn_aiu("当前场景不可操作该装饰品");
        }
        if (canOperateDecoration){
            GameHttpClient._fn_ho().sendGoodPos(1, this.decorationRecord.id, 0, 0);
        }
    }

    _fn_sn(){

    }
    _fn_sm(){

    }
    _fn_so(){

    }
    _fn_sp(){

    }

}

