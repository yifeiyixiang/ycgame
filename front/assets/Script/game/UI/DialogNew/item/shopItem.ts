import { Component,Button, find, instantiate, Node, ProgressBar, Sprite, tween, v3, Vec3, _decorator,Label } from 'cc';
import { Const } from '../../../../config/Const';
import GD from '../../../../config/GD';
import BaseView from '../../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../../easyFramework/other/tables';
import { UtilPub } from '../../../../easyFramework/utils/UtilPub';
import { mergeBoardStateStore } from '../../../comm/mergeBoardModel';
import { AudioPlaybackService } from '../../../../easyFramework/mgr/audioManager';
import { ShopConfigRecord } from '../../../../../typeScript/gameData';
import { playerDataStore } from '../../../comm/UserData';
import { GameHttpClient } from '../../../../../typeScript/net/HttpClient';
import { LanguageContentManager } from '../../../../../typeScript/LanauageManager';
const { ccclass, property } = _decorator;

@ccclass('shopItem')
export class ShopItemCellController extends BaseView {

    @property({ type: Sprite })
    icon: Sprite = null!;

    @property({ type: Label })
    nameLab: Label = null!;

    @property({ type: Label })
    levLab: Label = null!;

    @property({ type: Node })
    coin: Node = null!;

    @property({ type: Label })
    coinLab: Label = null!;

    @property({ type: Node })
    ad: Node = null!;

    @property({ type: Label })
    adCountLab: Label = null!;

    shopData!:ShopConfigRecord;

    onLoad() {

    }

    refreshData(shopConfig:any){
        this.shopData = shopConfig
        if (!this.shopData){

            return;
        }

        this.nameLab.string = this.shopData.name;


        if (this.shopData.icon){
            this.setSpriteFrame(this.icon, Const.resPath.icon + this.shopData.icon, () => { }, 60)
            this.icon.node.active = true;
        }else{
            this.icon.node.active = false;
        }


        this.levLab.string = "";
        this.coin.active = false;
        this.ad.active = false;

        if (playerDataStore.roleLv >= this.shopData.sell_need_level){
            if (this.shopData.sell_type == 1){
                this.coin.active = true;
                this.coinLab.string = this.shopData.sell_type_value + "";
            }
            else if (this.shopData.sell_type == 2){
                this.ad.active = true;

                this.adCountLab.string = LanguageContentManager.getAdCountById(this.shopData.id) + "/" + this.shopData.sell_type_value;
            }
        }
        else{

            this.levLab.string = this.shopData.sell_need_level + "级可购买";
        }

    }


    onClickHandler(eve:Event, str:string){
        AudioPlaybackService.instance.playSound(Const.Audio.btn)
        if (str == "buy"){
            GameHttpClient.getInstance().sendBuyProp(this.shopData?.id, this.shopData?.sell_type, ()=>{
                this.toast("购买成功");
            })
        }
        else if (str == "ad"){
            GameHttpClient.getInstance().sendBuyProp(this.shopData?.id, this.shopData?.sell_type, ()=>{
                this.toast("广告观看成功");
            })
        }

    }

}

