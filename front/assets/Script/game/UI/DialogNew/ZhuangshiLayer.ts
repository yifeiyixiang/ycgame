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
import { BagPropData, ShopCfg } from '../../../../typeScript/gameData';
import { userData } from '../../comm/UserData';
import { HttpClient } from '../../../../typeScript/net/HttpClient';
import { zhuanshiItem } from './item/zhuanshiItem';
import { EventManger } from '../../../../typeScript/EventManger';
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
        userData.goodIsCanOperate = false;
        EventManger.eventTarget.emit(EventManger.EEventName.REFRESH_GOOD_STATU);
        this.off(GD.event.updateGame, this)
    }

    show(args: any) {
        super.show(args);

        HttpClient.getInstance().sednBagInfo(this.itemType, ()=>{
            userData.goodIsCanOperate = true;
            EventManger.eventTarget.emit(EventManger.EEventName.REFRESH_GOOD_STATU);
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
        for (let index = 0; index < userData.bagProps.length; index++) {
            const bagData:BagPropData = userData.bagProps[index];
            let shopCfg:ShopCfg = tables.ins().getTableValueByID(Const.Tables.new_prop, bagData.prop_id);
            if (shopCfg.typeson == this.selectType && !bagData.is_active){
                let ele = this.listContent.children[ind];
                if (!ele){
                    ele = instantiate(this.listContent.children[0])
                    ele.parent = this.listContent;
                }
                ele.active = true;
                ele.getComponent(zhuanshiItem).refreshData(bagData);

                ind++;
            }
        }
    }

    onClickHandler(eve:Event, str:string){
        audioManager.instance.playSound(Const.Audio.btn)
        if (str && str.includes("tog")){
            let type = Number(str.slice(-1)) ;
            if (this.selectType != type){
                this.selectType = type;

                //HttpClient.getInstance().sednBagInfo(this.selectType);

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

