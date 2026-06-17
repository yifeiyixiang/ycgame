import { find, Label, Node, Sprite, SpriteFrame, tween, v3, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import { RoleSex } from '../../../config/global';
import { audioManager } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { resourceUtil } from '../../../easyFramework/mgr/resourceUtil';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import ServerCtr from '../../../tyqSDK/SDK/network/ServerCtr';
import { tyqSDK } from '../../../tyqSDK/SDK/tyqSDK';
import { aiRobot } from '../../comm/AIRobot';
import { userData } from '../../comm/UserData';
import { RechargeManager } from '../../../Util/RechargeManager';
import { HttpClient } from '../../../../typeScript/net/HttpClient';

const { ccclass, property } = _decorator;

@ccclass('GetgoldView')
export class GetgoldView extends BaseView {
    @property({ type: Label, tooltip: "获得次数" }) numLabe: Label = null!;

    @property({ type: Label, tooltip: "获得次数" }) rewardLab: Label = null!;

    @property({ type: Node, tooltip: "金币背景" }) bgGold: Node = null!;

    @property({ type: Node, tooltip: "体力背景" }) bgPower: Node = null!;

    type: number = 0;   //1金币，2体力

    start() {
        this.bindButton(find("root/btnClose", this.node)!, this.popClose)

        this.bindButton(find("root/btnGet", this.node)!, ()=>{
            //增加金币
            RechargeManager.showVideo("广告获取金币", () => {
                HttpClient.getInstance().sendADWatch(this.type, ()=>{
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

            this.numLabe.string = userData.userInfodata.coin_ad_count + "/" + Const.AD_GOLD_DAILY_LIMIT;
        }else{
            this.rewardLab.string = Const.AD_ENERGY_REWARD;

            this.numLabe.string = userData.userInfodata.power_ad_count + "/" + Const.AD_ENERGY_DAILY_LIMIT;
        }
    }

    updateInfo() {

    }



}

