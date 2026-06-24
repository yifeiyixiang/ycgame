import { Component,Button, find, instantiate, Node, ProgressBar, Sprite, tween, v3, Vec3, _decorator,Label } from 'cc';
import { Const } from '../../../../config/Const';
import GD from '../../../../config/GD';
import BaseView from '../../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../../easyFramework/other/tables';
import { UtilPub } from '../../../../easyFramework/utils/UtilPub';
import { mergeBoardStateStore } from '../../../comm/mergeBoardModel';
import { AudioPlaybackService } from '../../../../easyFramework/mgr/audioManager';
import { FriendProfileRecord, ShopConfigRecord, TaskConfigRecord, TaskProgressRecord } from '../../../../../typeScript/gameData';
import { playerDataStore } from '../../../comm/UserData';
import { GameHttpClient } from '../../../../../typeScript/net/HttpClient';
const { ccclass, property } = _decorator;

@ccclass('friendItem')
export class FriendItemCellController extends BaseView {

    @property({ type: Sprite })
    avatar: Sprite = null!;

    @property({ type: Label })
    nameLab: Label = null!;

    @property({ type: Label })
    IDLab: Label = null!;

    @property({ type: Label })
    countLab: Label = null!;

    @property({ type: Label })
    scoreLab: Label = null!;


    friendData!:FriendProfileRecord;

    onLoad() {

    }

    refreshData(data:any){
        this.friendData = data
        if (!this.friendData){

            return;
        }

        if (this.nameLab){
            this.nameLab.string = this.friendData.nickname;
        }
        if (this.IDLab){
            this.IDLab.string = this.friendData.userid + "";
        }
        if (this.countLab){
            this.countLab.string = "宠物数量：" + this.friendData.pet_count;
        }
        if (this.scoreLab){
            this.scoreLab.string = "宠物评分：" + this.friendData.pet_score;
        }

        if (this.avatar){
            playerDataStore.replaceHead(this.avatar, this.friendData.avatar);
        }

    }


    onClickHandler(eve:any, str:string){
        AudioPlaybackService.instance.playSound(Const.Audio.btn)
        let btnName = eve.target._name;
        if (btnName == "btnAdd"){

            GameHttpClient.getInstance().getFriendAdd(this.friendData.userid);
        }
        else if (btnName == "btnReset"){

            GameHttpClient.getInstance().getFriendRecommend();
        }
        else if (btnName == "btnAgree"){

            GameHttpClient.getInstance().getFriendApplyaction(this.friendData.id, 1);
        }
        else if (btnName == "btnRefuse"){

            GameHttpClient.getInstance().getFriendApplyaction(this.friendData.id, 2);
        }

    }

}

