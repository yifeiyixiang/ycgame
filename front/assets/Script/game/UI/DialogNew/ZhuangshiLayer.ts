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
        this.bindButton(this.btnClose, this._fn_sz);
    }

    onEnable() {
        this.on(GD.event.updateGame, this._fn_ys)
    }

    onDisable() {
        playerDataStore.goodIsCanOperate = false;
        GameEventManager.eventTarget.emit(GameEventManager.EEventName.REFRESH_GOOD_STATU);
        this.off(GD.event.updateGame, this)
    }

    show(args: any) {
        super.show(args);

        GameHttpClient._fn_ho().sednBagInfo(this.itemType, ()=>{
            playerDataStore.goodIsCanOperate = true;
            GameEventManager.eventTarget.emit(GameEventManager.EEventName.REFRESH_GOOD_STATU);
        });
    }

    _fn_ys(){

        for (let cellIndex = 0; cellIndex < this.listContent.children.length; cellIndex++) {
            const decorationCellNode = this.listContent.children[cellIndex];
            if (decorationCellNode){
                decorationCellNode.active = false;
            }
        }

        let visibleCellIndex:number = 0;
        for (let bagIndex = 0; bagIndex < playerDataStore.bagProps.length; bagIndex++) {
            const decorationRecord:BagPropRecord = playerDataStore.bagProps[bagIndex];
            let decorationConfig:ShopConfigRecord = TableDataService.ins()._fn_ly(Const.Tables.new_prop, decorationRecord.prop_id);
            if (decorationConfig.typeson == this.selectType && !decorationRecord.is_active){
                let decorationCellNode = this.listContent.children[visibleCellIndex];
                if (!decorationCellNode){
                    decorationCellNode = instantiate(this.listContent.children[0])
                    decorationCellNode.parent = this.listContent;
                }
                decorationCellNode.active = true;
                decorationCellNode.getComponent(DiamondItemCellController).refreshData(decorationRecord);

                visibleCellIndex++;
            }
        }
    }

    onClickHandler(eve:Event, str:string){
        AudioPlaybackService.instance._fn_xc(Const.Audio.btn)
        if (str && str.includes("tog")){
            let selectedDecorationType = Number(str.slice(-1)) ;
            if (this.selectType != selectedDecorationType){
                this.selectType = selectedDecorationType;



                this._fn_ys();
            }
        }
        else if (str == "click"){

        }
    }

    _fn_sz() {
        this.close();
    }

}

