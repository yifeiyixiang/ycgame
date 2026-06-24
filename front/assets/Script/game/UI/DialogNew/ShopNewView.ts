import { Button, find, instantiate, Node, ProgressBar, Sprite, tween, v3, Vec3, _decorator,Label } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
import { AudioPlaybackService } from '../../../easyFramework/mgr/audioManager';
import { ShopConfigRecord } from '../../../../typeScript/gameData';
import { ShopItemCellController } from './item/shopItem';
const { ccclass, property } = _decorator;

@ccclass('ShopNewView')
export class ShopNewView extends BaseView {

    @property({ type: Node })
    btnClose: Node = null!;

    @property({ type: Node })
    listContent: Node = null!;

    selectType:number = 1

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

        this.refresh();
    }

    refresh(){
        let cfgs = TableDataService.ins().getTable(Const.Tables.new_prop);

        for (let index = 0; index < this.listContent.children.length; index++) {
            const element = this.listContent.children[index];
            if (element){
                element.active = false;
            }
        }

        let ind:number = 0;
        for (let index = 0; index < cfgs.length; index++) {
            const cfg:ShopConfigRecord = cfgs[index];
            if (cfg.store_type == this.selectType){

                let ele = this.listContent.children[ind];
                if (!ele){
                    ele = instantiate(this.listContent.children[0])
                    ele.parent = this.listContent;
                }
                ele.active = true;
                ele.getComponent(ShopItemCellController).refreshData(cfg);

                ind++
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

