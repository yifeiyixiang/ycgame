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
        let shopPropConfigs = TableDataService.ins().getTable(Const.Tables.new_prop);

        for (let cellIndex = 0; cellIndex < this.listContent.children.length; cellIndex++) {
            const shopCellNode = this.listContent.children[cellIndex];
            if (shopCellNode){
                shopCellNode.active = false;
            }
        }

        let visibleCellIndex:number = 0;
        for (let configIndex = 0; configIndex < shopPropConfigs.length; configIndex++) {
            const shopConfig:ShopConfigRecord = shopPropConfigs[configIndex];
            if (shopConfig.store_type == this.selectType){

                let shopCellNode = this.listContent.children[visibleCellIndex];
                if (!shopCellNode){
                    shopCellNode = instantiate(this.listContent.children[0])
                    shopCellNode.parent = this.listContent;
                }
                shopCellNode.active = true;
                shopCellNode.getComponent(ShopItemCellController).refreshData(shopConfig);

                visibleCellIndex++
            }
        }
    }

    onClickHandler(eve:Event, str:string){
        AudioPlaybackService.instance.playSound(Const.Audio.btn)
        if (str && str.includes("tog")){
            let selectedStoreType = Number(str.slice(-1)) ;
            if (this.selectType != selectedStoreType){
                this.selectType = selectedStoreType;
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

