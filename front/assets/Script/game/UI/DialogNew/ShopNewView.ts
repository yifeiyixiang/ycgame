import { Button, find, instantiate, Node, ProgressBar, Sprite, tween, v3, Vec3, _decorator,Label } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { mergeBoardModel } from '../../comm/mergeBoardModel';
import { audioManager } from '../../../easyFramework/mgr/audioManager';
import { ShopCfg } from '../../../../typeScript/gameData';
import { shopItem } from './item/shopItem';
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
        // this.bindButton(find("root/nameBg/btnName", this.node)!, () => {
        //     uiManager.instance.showDialog(Const.Dialogs.PetNameView)
        // })

        // this.bindButton(find("root/btnFangsheng", this.node)!, () => {
        //     uiManager.instance.showDialog(Const.Dialogs.PetComonTipView, 1)
        // })
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
        let cfgs = tables.ins().getTable(Const.Tables.new_prop);

        for (let index = 0; index < this.listContent.children.length; index++) {
            const element = this.listContent.children[index];
            if (element){
                element.active = false;
            }
        }

        let ind:number = 0;
        for (let index = 0; index < cfgs.length; index++) {
            const cfg:ShopCfg = cfgs[index];
            if (cfg.store_type == this.selectType){
                
                let ele = this.listContent.children[ind];
                if (!ele){
                    ele = instantiate(this.listContent.children[0])
                    ele.parent = this.listContent;
                }
                ele.active = true;
                ele.getComponent(shopItem).refreshData(cfg);

                ind++
            }
        }
    }

    onClickHandler(eve:Event, str:string){
        audioManager.instance.playSound(Const.Audio.btn)
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

