import { Component,Button, find, instantiate, Node, ProgressBar, Sprite, tween, v3, Vec3, _decorator,Label } from 'cc';
import { Const } from '../../../../config/Const';
import GD from '../../../../config/GD';
import BaseView from '../../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../../easyFramework/mgr/uiManager';
import tables from '../../../../easyFramework/other/tables';
import { UtilPub } from '../../../../easyFramework/utils/UtilPub';
import { mergeBoardModel } from '../../../comm/mergeBoardModel';
import { audioManager } from '../../../../easyFramework/mgr/audioManager';
import { FriendData, ShopCfg, TaskCfg, TaskStateData } from '../../../../../typeScript/gameData';
import { userData } from '../../../comm/UserData';
import { HttpClient } from '../../../../../typeScript/net/HttpClient';
const { ccclass, property } = _decorator;

@ccclass('friendItem')
export class friendItem extends BaseView {

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


    friendData!:FriendData;

    onLoad() {

    }

    refreshData(data:any){
        this.friendData = data
        if (!this.friendData){
            // this.node.active = false;
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
            userData.replaceHead(this.avatar, this.friendData.avatar);
        }

    }


    onClickHandler(eve:any, str:string){
        audioManager.instance.playSound(Const.Audio.btn)
        let btnName = eve.target._name;
        if (btnName == "btnAdd"){
            //添加好友
            HttpClient.getInstance().getFriendAdd(this.friendData.userid);
        }
        else if (btnName == "btnReset"){
            //推荐好友换一批
            HttpClient.getInstance().getFriendRecommend();
        }
        else if (btnName == "btnAgree"){
            //同意好友申请
            HttpClient.getInstance().getFriendApplyaction(this.friendData.id, 1);
        }
        else if (btnName == "btnRefuse"){
            //拒绝好友申请
            HttpClient.getInstance().getFriendApplyaction(this.friendData.id, 2);
        }

    }

}

