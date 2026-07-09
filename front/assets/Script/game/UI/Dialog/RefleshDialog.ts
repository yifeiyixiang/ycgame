import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, Layout, TiledUserNodeData, } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { AudioPlaybackService } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import TableDataService from '../../../easyFramework/other/tables';
import { RewardVideoManager } from '../../../Util/RechargeManager';
import { playerDataStore } from '../../comm/UserData';

const { ccclass, property } = _decorator;



@ccclass('RefleshDialog')
export class RefleshDialog extends BaseView {

    @property({ type: Node }) timeLabel: Node = null!;

    _isCanFlesh = false
    _cdData: any = null

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this._fn_xe)
    }

    show(args: any) {
        super.show(args)
        let itemData = this._layerData.itemData
        let cdData = TableDataService.ins()._fn_lz(Const.Tables.privilege, "key", itemData.cdKey)
        this._cdData = cdData
        let time = playerDataStore._fn_jz(cdData.dataKey + "auto", 1440)
        this.timeLabel.getComponent(Label)!.string = (itemData.autoReflesh - time) + "/" + itemData.autoReflesh
        this._isCanFlesh = time < itemData.autoReflesh
    }


    onClickBtnVideoReflesh() {
        AudioPlaybackService.instance._fn_xc(Const.Audio.btn)
        if (this._isCanFlesh) {
            RewardVideoManager._fn_ahy("刷新商店限时商品", () => {
                playerDataStore._fn_afo(this._cdData.dataKey + "auto", 1440)
                this.emit(GD.event.updateShopItem)
                this.close()
            })
        } else {
            this._fn_aiu("今日刷新次数已用完")
        }
    }

    onClickDiamonsReflesh() {
        AudioPlaybackService.instance._fn_xc(Const.Audio.btn)
        if (playerDataStore._fn_bg(Const.LimitShopRefleshPrice)) {
            this.emit(GD.event.updateShopItem)
            this.emit(GD.event.updateMoney)
            this.close()
        } else {
            this._fn_aiu("钻石不足")
        }
    }

}

