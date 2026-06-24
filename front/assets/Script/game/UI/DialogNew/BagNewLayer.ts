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
        this.bindButton(this.btnClose, this.onClickBtnClose);
    }

    onEnable() {
        this.on(GD.event.updateGame, this.refresh)
    }

    onDisable() {
        this.off(GD.event.updateGame, this)
    }

    show(args: any) {
        super.show(args);

        GameHttpClient.getInstance().sednBagInfo(this.selectType);
    }

    refresh(){

        for (let index = 0; index < this.listContent.children.length; index++) {
            const element = this.listContent.children[index];
            if (element){
                element.active = false;
            }
        }

        for (let index = 0; index < playerDataStore.bagProps.length; index++) {
            const bagData:BagPropRecord = playerDataStore.bagProps[index];

            let ele = this.listContent.children[index];
            if (!ele){
                ele = instantiate(this.listContent.children[0])
                ele.parent = this.listContent;
            }
            ele.active = true;
            ele.getComponent(BagItemCellController).refreshData(bagData);
        }
    }

    onClickHandler(eve:Event, str:string){
        AudioPlaybackService.instance.playSound(Const.Audio.btn)
        if (str && str.includes("tog")){
            let type = Number(str.slice(-1)) ;
            if (this.selectType != type){
                this.selectType = type;

                GameHttpClient.getInstance().sednBagInfo(this.selectType);
            }
        }
        else if (str == "click"){

        }
    }

    onClickBtnClose() {
        this.close();
    }

}

