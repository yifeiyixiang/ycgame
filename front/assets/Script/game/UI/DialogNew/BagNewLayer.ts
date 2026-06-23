import { Button, find, instantiate, Node, ProgressBar, Sprite, tween, v3, Vec3, _decorator,Label } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { mergeBoardModel } from '../../comm/mergeBoardModel';
import { audioManager } from '../../../easyFramework/mgr/audioManager';
import { bagItem } from './item/bagItem';
import { BagPropData } from '../../../../typeScript/gameData';
import { userData } from '../../comm/UserData';
import { HttpClient } from '../../../../typeScript/net/HttpClient';
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

        HttpClient.getInstance().sednBagInfo(this.selectType);
    }

    refresh(){

        for (let index = 0; index < this.listContent.children.length; index++) {
            const element = this.listContent.children[index];
            if (element){
                element.active = false;
            }
        }

        for (let index = 0; index < userData.bagProps.length; index++) {
            const bagData:BagPropData = userData.bagProps[index];

            let ele = this.listContent.children[index];
            if (!ele){
                ele = instantiate(this.listContent.children[0])
                ele.parent = this.listContent;
            }
            ele.active = true;
            ele.getComponent(bagItem).refreshData(bagData);
        }
    }

    onClickHandler(eve:Event, str:string){
        audioManager.instance.playSound(Const.Audio.btn)
        if (str && str.includes("tog")){
            let type = Number(str.slice(-1)) ;
            if (this.selectType != type){
                this.selectType = type;

                HttpClient.getInstance().sednBagInfo(this.selectType);
            }
        }
        else if (str == "click"){

        }
    }
    
    onClickBtnClose() {
        this.close();
    }

}

