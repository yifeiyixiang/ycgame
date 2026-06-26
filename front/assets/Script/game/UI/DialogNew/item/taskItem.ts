import { Component,Button, find, instantiate, Node, ProgressBar, Sprite, tween, v3, Vec3, _decorator,Label } from 'cc';
import { Const } from '../../../../config/Const';
import GD from '../../../../config/GD';
import BaseView from '../../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../../easyFramework/other/tables';
import { UtilPub } from '../../../../easyFramework/utils/UtilPub';
import { mergeBoardStateStore } from '../../../comm/mergeBoardModel';
import { AudioPlaybackService } from '../../../../easyFramework/mgr/audioManager';
import { ShopConfigRecord, TaskConfigRecord, TaskProgressRecord } from '../../../../../typeScript/gameData';
import { playerDataStore } from '../../../comm/UserData';
import { GameHttpClient } from '../../../../../typeScript/net/HttpClient';
const { ccclass, property } = _decorator;

@ccclass('taskItem')
export class TaskItemCellController extends BaseView {




    @property({ type: Label })
    desLab: Label = null!;

    @property({ type: Label })
    proLab: Label = null!;

    @property({ type: ProgressBar })
    progressBar: ProgressBar = null!;

    @property({ type: Label })
    rewardLab: Label = null!;

    @property({ type: Node })
    btn: Node = null!;

    @property({ type: Label })
    btnLab: Label = null!;

    taskData!:TaskProgressRecord;

    onLoad() {

    }

    refreshData(taskRecord:any){
        this.taskData = taskRecord
        if (!this.taskData){

            return;
        }

        this.proLab.string = this.taskData.done_count + "/" + this.taskData.task_count;
        this.progressBar.progress = this.taskData.done_count/this.taskData.task_count;

        let taskConfig:TaskConfigRecord = TableDataService.ins().getTableValueByID(Const.Tables.new_task, this.taskData.task_id);
        if(this.taskData.task_type == 1){
            this.desLab.string = "当日签到";
        }
        else if (this.taskData.task_type == 2){
            this.desLab.string = "观看广告&1次".replace("&1", this.taskData.task_count.toString());
        }
        else if (this.taskData.task_type == 3){
            this.desLab.string = "宠物互动&1次".replace("&1", this.taskData.task_count.toString());
        }

        this.rewardLab.string = "奖励" + taskConfig.task_gift[0][1];

        if (this.taskData.is_done){
            this.btnLab.string = "已领取"
             this.btn.getComponent(Button).interactable = false;
        }
        else if (this.taskData.status){
            this.btnLab.string = "领取"
             this.btn.getComponent(Button).interactable = true;
        }
        else{
            this.btnLab.string = "未完成"
            this.btn.getComponent(Button).interactable = false;
        }
    }


    onClickHandler(eve:Event, str:string){
        AudioPlaybackService.instance.playSound(Const.Audio.btn)
        if (str == "receive"){
            GameHttpClient.getInstance().sendRecivieTaskReward(this.taskData?.task_type);
        }
        else if (str == "ad"){

        }

    }

}

