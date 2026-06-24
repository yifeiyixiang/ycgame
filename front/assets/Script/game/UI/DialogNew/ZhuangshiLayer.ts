import { Button, find, instantiate, Node, ProgressBar, Sprite, tween, v3, Vec3, _decorator,Label } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
import { AudioPlaybackService } from '../../../easyFramework/mgr/audioManager';
import { BagItemCellController } from './item/bagItem';
import { BagPropRecord, ShopConfigRecord } from '../../../../typeScript/gameData';
import { playerDataStore } from '../../comm/UserData';
import { GameHttpClient } from '../../../../typeScript/net/HttpClient';
import { DiamondItemCellController } from './item/zhuanshiItem';
import { GameEventManager } from '../../../../typeScript/EventManger';
const { ccclass, property } = _decorator;

@ccclass('ZhuangshiLayer')
export class ZhuangshiLayer extends BaseView {

    @property({ type: Node })
    btnClose: Node = null!;

    @property({ type: Node })
    listContent: Node = null!;

    itemType:number = 4

    selectType:number = 1

    onLoad() {
        this.bindButton(this.btnClose, this.onClickBtnClose);
    }

    onEnable() {
        this.on(GD.event.updateGame, this.refresh)
    }

    onDisable() {
        playerDataStore.goodIsCanOperate = false;
        GameEventManager.eventTarget.emit(GameEventManager.EEventName.REFRESH_GOOD_STATU);
        this.off(GD.event.updateGame, this)
    }

    show(args: any) {
        super.show(args);

        GameHttpClient.getInstance().sednBagInfo(this.itemType, ()=>{
            playerDataStore.goodIsCanOperate = true;
            GameEventManager.eventTarget.emit(GameEventManager.EEventName.REFRESH_GOOD_STATU);
        });
    }

    refresh(){

        for (let index = 0; index < this.listContent.children.length; index++) {
            const element = this.listContent.children[index];
            if (element){
                element.active = false;
            }
        }

        let ind:number = 0;
        for (let index = 0; index < playerDataStore.bagProps.length; index++) {
            const bagData:BagPropRecord = playerDataStore.bagProps[index];
            let shopCfg:ShopConfigRecord = TableDataService.ins().getTableValueByID(Const.Tables.new_prop, bagData.prop_id);
            if (shopCfg.typeson == this.selectType && !bagData.is_active){
                let ele = this.listContent.children[ind];
                if (!ele){
                    ele = instantiate(this.listContent.children[0])
                    ele.parent = this.listContent;
                }
                ele.active = true;
                ele.getComponent(DiamondItemCellController).refreshData(bagData);

                ind++;
            }
        }
    }

    onClickHandler(eve:Event, str:string){
        AudioPlaybackService.instance.playSound(Const.Audio.btn)
        if (str && str.includes("tog")){
            let type = Number(str.slice(-1)) ;
            if (this.selectType != type){
                this.selectType = type;



                this.refresh();
            }
        }
        else if (str == "click"){

        }
    }

    onClickBtnClose() {
        this.close();
    }

}

