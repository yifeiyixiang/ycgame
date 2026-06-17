import { _decorator, Component, Node, tween, instantiate,Label, Sprite,SpriteFrame } from 'cc';
import BaseView from '../../../easyFramework/mgr/BaseView';
import tables from '../../../easyFramework/other/tables';
import { Const } from '../../../config/Const';
import { ShopCfg } from '../../../../typeScript/gameData';
import { HttpClient } from '../../../../typeScript/net/HttpClient';
import { userData } from '../../comm/UserData';
const { ccclass, property } = _decorator;

@ccclass('ActivityView')
export class ActivityView extends BaseView {

    @property({ type: Sprite })
    bg: Sprite = null;              //背景

    @property({ type: Node })
    rewardNode: Node = null;        //奖励

    @property({ type: Node })
    btnStart: Node = null;          //开始按钮

    @property({ type: Node })
    tipNode: Node = null;           //提示

    @property({ type: Node })
    ad: Node = null;           

    @property({ type: Sprite })
    rewardIcon: Sprite = null;           //奖励图标

    @property({ type: Label })
    rewardNumLab: Label = null;           //奖励数量

    @property({ type: Label })
    rewardTipLab: Label = null;           //奖励进度提示

    @property({ type: Node })
    btnClose: Node = null;

    @property({ type: Node })
    btnReceive: Node = null;

    @property({ type: [SpriteFrame] })
    bgArr: SpriteFrame[] = [];

    @property({ type: [SpriteFrame] })
    btnArr: SpriteFrame[] = [];

    @property({ type: [SpriteFrame] })
    giftArr: SpriteFrame[] = [];


    private type = 0; // 0 1 2 3

    onLoad() {
        this.bindButton(this.btnStart, (this.startTurn));

        this.bindButton(this.btnClose, this.close);

        this.type = userData.activity-1;
    }

    onEnable(){
        this.refresh();
    }

    refresh(){
        //this.setSpriteFrame(this.rewardIcon, Const.resPath.icon + this.shopData.icon, () => { }, 60)
        this.bg.spriteFrame = this.bgArr[this.type];
        this.btnStart.getComponent(Sprite).spriteFrame = this.btnArr[this.type];

        this.ad.active = false;
        if (this.type == 0){
            this.rewardNode.setPosition(0, 16);
            this.btnStart.setPosition(-60, -290);
            this.tipNode.setPosition(-100, -480);
        }
        else if (this.type == 1){
            this.rewardNode.setPosition(0, 50);
            this.btnStart.setPosition(-60, -290);
            this.tipNode.setPosition(-100, -504);
        }
        else if (this.type == 2){
            this.ad.active = true;
            this.rewardNode.setPosition(31, 13);
            this.btnStart.setPosition(-60, -354);
            this.tipNode.setPosition(-67, -516);
        }
        else if (this.type == 3){
            this.rewardNode.setPosition(-10, 13);
            this.btnStart.setPosition(-124, -337);
            this.tipNode.setPosition(-103, -502);
        }
        
        let activityData = tables.ins().getTableValueByID(Const.Tables.new_activityPrpgress, userData.userInfodata.activity_progress);
        if (activityData){
            this.rewardIcon.node.active = true;
            if (activityData.task_gift.length > 0){
                let proid = activityData.task_gift[0][0];
                let countu = activityData.task_gift[0][1];
                let dataNew = tables.ins().getTableValueByID(Const.Tables.new_prop, proid)

                this.setSpriteFrame(this.rewardIcon.getComponent(Sprite)!, Const.resPath.icon + dataNew.icon, () => { }, 60)
                this.rewardNumLab.string = "x" + countu + "";
            }
            
            if (userData.userInfodata.activity_count >= activityData.need_draw){
                this.btnReceive.active = true;
                this.rewardTipLab.string = "";
            }
            else{
                this.btnReceive.active = false;
                this.rewardTipLab.string = "再拆" + (activityData.need_draw - userData.userInfodata.activity_count) + "个可领取";
            }
            
        }else{
            this.rewardIcon.node.active = false;
            this.rewardNumLab.string = "";

            this.btnReceive.active = false;
            this.rewardTipLab.string = "本期活动奖励已经全部领取";
        }
        
    }

    //抽奖
    startTurn() {

        this.btnStart.active = false;
        this.btnClose.active = false;

        let len = 6*5 + Math.ceil(Math.random() * 5);

        for (let i = 0; i < len; i++){
            let ind = i % this.rewardNode.children.length;
            this.scheduleOnce(()=>{
                this.setSelectInde(ind);
            }, i * 0.2);
        }

        this.scheduleOnce(()=>{
            this.btnStart.active = true;
            this.btnClose.active = true;
            HttpClient.getInstance().sendactivity(()=>{
                this.refresh();
            });
        }, len * 0.2);
    }

    receiveClick(){
        HttpClient.getInstance().sendProgressaward(userData.userInfodata.activity_progress, (res:any)=>{
            this.refresh();
        })
    }

    setSelectInde(index:number = -1){
        for (let i = 0; i < this.rewardNode.children.length; i++){
            let ele = this.rewardNode.children[i];
            if(index == i){
                ele.getComponent(Sprite).spriteFrame = this.giftArr[1];
            }
            else{
                ele.getComponent(Sprite).spriteFrame = this.giftArr[0];
            }
        }
    }

    update(deltaTime: number) {
        
    }
}

