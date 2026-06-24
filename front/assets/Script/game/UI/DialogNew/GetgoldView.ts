import { find, Label, Node, Sprite, SpriteFrame, tween, v3, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import { RoleSex } from '../../../config/global';
import { AudioPlaybackService } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { ResourceLoaderService } from '../../../easyFramework/mgr/resourceUtil';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { aiRobot } from '../../comm/AIRobot';
import { playerDataStore } from '../../comm/UserData';
import { RewardVideoManager } from '../../../Util/RechargeManager';
import { GameHttpClient } from '../../../../typeScript/net/HttpClient';

const { ccclass, property } = _decorator;

@ccclass('GetgoldView')
export class GetgoldView extends BaseView {
    @property({ type: Label, tooltip: "获得次数" }) numLabe: Label = null!;

    @property({ type: Label, tooltip: "获得次数" }) rewardLab: Label = null!;

    @property({ type: Node, tooltip: "金币背景" }) bgGold: Node = null!;

    @property({ type: Node, tooltip: "体力背景" }) bgPower: Node = null!;

    type: number = 0;

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)

        this.bindButton(find("root/btnGet", this.node)!, ()=>{

            RewardVideoManager.showVideo("广告获取金币", () => {
                GameHttpClient.getInstance().sendADWatch(this.type, ()=>{
                    this.close();
                })
            })
        })
    }

    show(args: any) {
        super.show(args)

        this.type = args;

        this.bgGold.active = this.type == 1

        this.bgPower.active = this.type == 2

        if (this.type == 1){
            this.rewardLab.string = Const.AD_GOLD_REWARD;

            this.numLabe.string = playerDataStore.userInfodata.coin_ad_count + "/" + Const.AD_GOLD_DAILY_LIMIT;
        }else{
            this.rewardLab.string = Const.AD_ENERGY_REWARD;

            this.numLabe.string = playerDataStore.userInfodata.power_ad_count + "/" + Const.AD_ENERGY_DAILY_LIMIT;
        }
    }

    updateInfo() {

    }



}

