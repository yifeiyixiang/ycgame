import { _decorator, Component, Node, tween, instantiate,Label, Sprite,SpriteFrame } from 'cc';
import BaseView from '../../../easyFramework/mgr/BaseView';
import TableDataService from '../../../easyFramework/other/tables';
import { Const } from '../../../config/Const';
import { ShopConfigRecord } from '../../../../typeScript/gameData';
import { GameHttpClient } from '../../../../typeScript/net/HttpClient';
import { playerDataStore } from '../../comm/UserData';
const { ccclass, property } = _decorator;

@ccclass('ActivityView')
export class ActivityView extends BaseView {

    @property({ type: Sprite })
    bg: Sprite = null;

    @property({ type: Node })
    rewardNode: Node = null;

    @property({ type: Node })
    btnStart: Node = null;

    @property({ type: Node })
    tipNode: Node = null;

    @property({ type: Node })
    ad: Node = null;

    @property({ type: Sprite })
    rewardIcon: Sprite = null;

    @property({ type: Label })
    rewardNumLab: Label = null;

    @property({ type: Label })
    rewardTipLab: Label = null;

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


    private type = 0;

    onLoad() {
        this.bindButton(this.btnStart, (this.startTurn));

        this.bindButton(this.btnClose, this.close);

        this.type = playerDataStore.activity-1;
    }

    onEnable(){
        this.refresh();
    }

    refresh(){

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

        let activityProgressConfig = TableDataService.ins().getTableValueByID(Const.Tables.new_activityPrpgress, playerDataStore.userInfodata.activity_progress);
        if (activityProgressConfig){
            this.rewardIcon.node.active = true;
            if (activityProgressConfig.task_gift.length > 0){
                let rewardPropId = activityProgressConfig.task_gift[0][0];
                let rewardCount = activityProgressConfig.task_gift[0][1];
                let rewardPropConfig = TableDataService.ins().getTableValueByID(Const.Tables.new_prop, rewardPropId)

                this.setSpriteFrame(this.rewardIcon.getComponent(Sprite)!, Const.resPath.icon + rewardPropConfig.icon, () => { }, 60)
                this.rewardNumLab.string = "x" + rewardCount + "";
            }

            if (playerDataStore.userInfodata.activity_count >= activityProgressConfig.need_draw){
                this.btnReceive.active = true;
                this.rewardTipLab.string = "";
            }
            else{
                this.btnReceive.active = false;
                this.rewardTipLab.string = "再拆" + (activityProgressConfig.need_draw - playerDataStore.userInfodata.activity_count) + "个可领取";
            }

        }else{
            this.rewardIcon.node.active = false;
            this.rewardNumLab.string = "";

            this.btnReceive.active = false;
            this.rewardTipLab.string = "本期活动奖励已经全部领取";
        }

    }


    startTurn() {

        this.btnStart.active = false;
        this.btnClose.active = false;

        let highlightSteps = 6*5 + Math.ceil(Math.random() * 5);

        for (let stepIndex = 0; stepIndex < highlightSteps; stepIndex++){
            let selectedRewardIndex = stepIndex % this.rewardNode.children.length;
            this.scheduleOnce(()=>{
                this.setSelectInde(selectedRewardIndex);
            }, stepIndex * 0.2);
        }

        this.scheduleOnce(()=>{
            this.btnStart.active = true;
            this.btnClose.active = true;
            GameHttpClient.getInstance().sendactivity(()=>{
                this.refresh();
            });
        }, highlightSteps * 0.2);
    }

    receiveClick(){
        GameHttpClient.getInstance().sendProgressaward(playerDataStore.userInfodata.activity_progress, (res:any)=>{
            this.refresh();
        })
    }

    setSelectInde(index:number = -1){
        for (let rewardIndex = 0; rewardIndex < this.rewardNode.children.length; rewardIndex++){
            let rewardCell = this.rewardNode.children[rewardIndex];
            if(index == rewardIndex){
                rewardCell.getComponent(Sprite).spriteFrame = this.giftArr[1];
            }
            else{
                rewardCell.getComponent(Sprite).spriteFrame = this.giftArr[0];
            }
        }
    }

    update(deltaTime: number) {

    }
}

