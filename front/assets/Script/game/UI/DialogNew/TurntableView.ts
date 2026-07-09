import { _decorator, Component, Node, tween, instantiate,Label, Sprite } from 'cc';
import BaseView from '../../../easyFramework/mgr/BaseView';
import TableDataService from '../../../easyFramework/other/tables';
import { Const } from '../../../config/Const';
import { ShopConfigRecord } from '../../../../typeScript/gameData';
import { GameHttpClient } from '../../../../typeScript/net/HttpClient';
const { ccclass, property } = _decorator;

@ccclass('TurntableView')
export class TurntableView extends BaseView {

    @property({ type: Node })
    turnBg: Node = null;

    @property({ type: Node })
    btnStart: Node = null;

    @property({ type: Node })
    btnClose: Node = null;

    onLoad() {
        this.bindButton(this.btnStart, (this._fn_aik));

        this.bindButton(this.btnClose, this.close);

        let turntableConfigs = TableDataService.ins()._fn_lt(Const.Tables.new_turn);

        for (let rewardIndex = 0; rewardIndex < turntableConfigs.length; rewardIndex++) {
            const rewardConfig = turntableConfigs[rewardIndex];
            let rewardCell = this.turnBg.children[rewardIndex];
            if (!rewardCell){
                rewardCell = instantiate(this.turnBg.children[0])
                rewardCell.parent = this.turnBg;
            }
            let rewardPropConfig:ShopConfigRecord = TableDataService.ins()._fn_ly(Const.Tables.new_prop, rewardConfig.circle_reward_id);
            if (rewardConfig.circle_rewards_num > 1){
                rewardCell.getChildByName("nameLab").getComponent(Label).string = rewardConfig.circle_rewards_num + "";
            }else{
                rewardCell.getChildByName("nameLab").getComponent(Label).string = rewardPropConfig.name;
            }

            this._fn_agk(rewardCell.getChildByName("icon").getComponent(Sprite), Const.resPath.icon + rewardPropConfig.icon, () => { }, 40)

            rewardCell.angle = -rewardIndex * 45;
        }
    }

    onEnable(){
        this.turnBg.angle = 0;
    }


    _fn_aik() {
        GameHttpClient._fn_ho()._fn_aee((res:any)=>{

            let wheelResponse = res.res.data

            let resultIndex = wheelResponse.wheelid;

            this.btnStart.active = false;
            this.btnClose.active = false;
            this.turnBg.angle = 0;

            let targetAngle = (360/8 * (resultIndex-1))


            tween(this.turnBg)
                .to(5, { angle: (360*5 + targetAngle )}, { easing: 'sineInOut' })
                .delay(0.5)
                .call(() => {
                    this.btnStart.active = true;
                    this.btnClose.active = true;

                    GameHttpClient._fn_ho()._fn_ahp(wheelResponse);
                })
                .start();
        })
    }

    update(deltaTime: number) {

    }
}

