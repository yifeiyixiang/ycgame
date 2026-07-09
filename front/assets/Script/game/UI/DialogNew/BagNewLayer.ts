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
import { BagPropRecord } from '../../../../typeScript/gameData';
import { playerDataStore } from '../../comm/UserData';
import { GameHttpClient } from '../../../../typeScript/net/HttpClient';
const { ccclass, property } = _decorator;

@ccclass('BagNewLayer')
export class BagNewLayer extends BaseView {

    @property({ type: Node })
    btnClose: Node = null!;

    @property({ type: Node })
    listContent: Node = null!;

    selectType:number = 2

    onLoad() {
        this.bindButton(this.btnClose, this._fn_sz);
    }

    onEnable() {
        this.on(GD.event.updateGame, this._fn_ys)
    }

    onDisable() {
        this.off(GD.event.updateGame, this)
    }

    show(args: any) {
        super.show(args);

        GameHttpClient._fn_ho().sednBagInfo(this.selectType);
    }

    _fn_ys(){

        for (let cellIndex = 0; cellIndex < this.listContent.children.length; cellIndex++) {
            const bagCellNode = this.listContent.children[cellIndex];
            if (bagCellNode){
                bagCellNode.active = false;
            }
        }

        for (let bagIndex = 0; bagIndex < playerDataStore.bagProps.length; bagIndex++) {
            const bagRecord:BagPropRecord = playerDataStore.bagProps[bagIndex];

            let bagCellNode = this.listContent.children[bagIndex];
            if (!bagCellNode){
                bagCellNode = instantiate(this.listContent.children[0])
                bagCellNode.parent = this.listContent;
            }
            bagCellNode.active = true;
            bagCellNode.getComponent(BagItemCellController).refreshData(bagRecord);
        }
    }

    onClickHandler(eve:Event, str:string){
        AudioPlaybackService.instance._fn_xc(Const.Audio.btn)
        if (str && str.includes("tog")){
            let selectedStoreType = Number(str.slice(-1)) ;
            if (this.selectType != selectedStoreType){
                this.selectType = selectedStoreType;

                GameHttpClient._fn_ho().sednBagInfo(this.selectType);
            }
        }
        else if (str == "click"){

        }
    }

    _fn_sz() {
        this.close();
    }

}

