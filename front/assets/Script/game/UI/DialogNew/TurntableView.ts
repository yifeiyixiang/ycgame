import { _decorator, Component, Node, tween, instantiate,Label, Sprite } from 'cc';
import BaseView from '../../../easyFramework/mgr/BaseView';
import tables from '../../../easyFramework/other/tables';
import { Const } from '../../../config/Const';
import { ShopCfg } from '../../../../typeScript/gameData';
import { HttpClient } from '../../../../typeScript/net/HttpClient';
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
        this.bindButton(this.btnStart, (this.startTurn));

        this.bindButton(this.btnClose, this.close);

        let cfgs = tables.ins().getTable(Const.Tables.new_turn);

        for (let index = 0; index < cfgs.length; index++) {
            const cfg = cfgs[index];
            let ele = this.turnBg.children[index];
            if (!ele){
                ele = instantiate(this.turnBg.children[0])
                ele.parent = this.turnBg;
            }
            let propData:ShopCfg = tables.ins().getTableValueByID(Const.Tables.new_prop, cfg.circle_reward_id);
            if (cfg.circle_rewards_num > 1){
                ele.getChildByName("nameLab").getComponent(Label).string = cfg.circle_rewards_num + "";
            }else{
                ele.getChildByName("nameLab").getComponent(Label).string = propData.name;
            }

            this.setSpriteFrame(ele.getChildByName("icon").getComponent(Sprite), Const.resPath.icon + propData.icon, () => { }, 40)

            ele.angle = -index * 45;
        }
    }

    onEnable(){
        this.turnBg.angle = 0;
    }

    //开始转盘
    startTurn() {
        HttpClient.getInstance().sendWheel((res:any)=>{

            let resData = res.res.data

            let resultInd = resData.wheelid;

            this.btnStart.active = false;
            this.btnClose.active = false;
            this.turnBg.angle = 0;

            let ang = (360/8 * (resultInd-1))
            // ang = ang + Math.random() * 45

            tween(this.turnBg)
                .to(5, { angle: (360*5 + ang )}, { easing: 'sineInOut' }) // 将两个动作合并为一个，使用 sineInOut
                .delay(0.5)
                .call(() => {
                    this.btnStart.active = true;
                    this.btnClose.active = true;

                    HttpClient.getInstance().showReward(resData);
                })
                .start();
        })
    }

    update(deltaTime: number) {
        
    }
}

