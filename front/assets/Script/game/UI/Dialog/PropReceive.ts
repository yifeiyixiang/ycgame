import { _decorator, Node, Prefab, instantiate, Sprite, Label, UITransform, v3, find, size } from 'cc';
import { Const } from '../../../config/Const';
import { GoodsType, TujianState } from '../../../config/global';
import { AudioPlaybackService } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import TableDataService from '../../../easyFramework/other/tables';
import { playerDataStore } from '../../comm/UserData';
import { GamePlatform } from '../../platform/GamePlatform';
const { ccclass, property } = _decorator;



@ccclass('PropReceive')
export class PropReceive extends BaseView {
    @property({ type: Node }) icon: Node = null!;

    _propdata: any = null
    _propReward: any = null
    start() {
        this.initData()
    }

    initData() {
        if (this._layerData.key == Const.DataKeys.tujianProp) {
            let propdata = TableDataService.ins()._fn_ly(Const.Tables.prop, this._layerData.propId)
            let prop = propdata.reward.split(",")
            this._propdata = propdata
            this._propReward = prop
        } else {
            let skindata = TableDataService.ins()._fn_ly(Const.Tables.scene_skin, this._layerData.propId)
            let prop = skindata.reward.split(",")
            this.node.scale = v3(0.8, 0.8, 1)
            find("root", this.node)!.getComponent(UITransform)!.contentSize = size(200, 200 / 160 * 180)
            this._propdata = skindata
            this._propReward = prop
        }

        if (this._propReward[0] == GoodsType.Coin) {
            this._fn_agk(this.icon.getComponent(Sprite)!, Const.resPath.common + "icon_coin", undefined, 120)
        } else if (this._propReward[0] == GoodsType.Diamonds) {
            this._fn_agk(this.icon.getComponent(Sprite)!, Const.resPath.common + "icon_diamond", undefined, 120)
        } else if (this._propReward[0] == GoodsType.Power) {
            this._fn_agk(this.icon.getComponent(Sprite)!, Const.resPath.common + "icon_power", undefined, 120)
        }
    }

    show(args: any) {
        super.show(args)

    }

    onClickReceive(event: any) {
        AudioPlaybackService.instance._fn_xc(Const.Audio.btn)

        let target = event.target!
        let pos = target.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0))
        playerDataStore._fn_aes(this._layerData.propId, TujianState.received, this._layerData.key);
        playerDataStore._fn_jk(this._propReward, pos, v3(0, 0, 0))
        if (this._propReward[0] == GoodsType.Coin) {
            GamePlatform._fn_aja("图鉴-获得金币")
        } else if (this._propReward[0] == GoodsType.Diamonds) {
            GamePlatform._fn_aja("图鉴-获得钻石")
        } else if (this._propReward[0] == GoodsType.Power) {
            GamePlatform._fn_aja("图鉴-获得体力")
        }

        this.node.removeFromParent()

    }
}

