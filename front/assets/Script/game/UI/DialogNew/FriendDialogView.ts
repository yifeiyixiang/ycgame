import { Button, find, instantiate, Node, ProgressBar, Sprite, tween, v3, Vec3, _decorator,Label,EditBox } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { mergeBoardModel } from '../../comm/mergeBoardModel';
import { audioManager } from '../../../easyFramework/mgr/audioManager';
import { HttpClient } from '../../../../typeScript/net/HttpClient';
import { FriendData } from '../../../../typeScript/gameData';
import { friendItem } from './item/friendItem';
import { EventManger } from '../../../../typeScript/EventManger';
import { userData } from '../../comm/UserData';
const { ccclass, property } = _decorator;

@ccclass('FriendDialogView')
export class FriendDialogView extends BaseView {

    @property({ type: Node })
    btnClose: Node = null!;

    @property({ type: Label })
    titleLab: Label = null!;

    @property({ type: Node })
    tuijianNode: Node = null!;

    @property({ type: Node })
    tujianListCont: Node = null!;


    @property({ type: Node })
    searchNode: Node = null!;

    @property({ type: Node })
    searchItem: Node = null!;

    @property({ type: EditBox })
    searchEdit: EditBox = null!;

    @property({ type: Node })
    applayNode: Node = null!;

    @property({ type: Node })
    applayListCont: Node = null!;

    viewType:number = 1;    //1推荐好友，2搜索好友，3申请列表

    friendDataList:FriendData[] = [];

    listContent: Node = null!;

    start() {
        this.bindButton(this.btnClose, this.onClickBtnClose);

        EventManger.eventTarget.on(EventManger.EEventName.REFRESH_FRIEND_DATA, this.refresh, this);

    }

    show(args: any) {
        super.show(args);

        this.viewType = args;

        this.tuijianNode.active = false;
        this.searchNode.active = false;
        this.applayNode.active = false;

        if (this.viewType == 1){
            this.titleLab.string = "推荐好友"
            this.tuijianNode.active = true;
            this.listContent = this.tujianListCont;
            HttpClient.getInstance().getFriendRecommend();
        }
        else if (this.viewType == 2){
            this.titleLab.string = "搜索好友"
            this.searchNode.active = true;
            this.searchItem.active = false;
        }
        else if (this.viewType == 3){
            this.titleLab.string = "申请列表"
            this.applayNode.active = true;
            this.listContent = this.applayListCont;
            HttpClient.getInstance().getFriendApply();
        }
    }

    refresh(){
        if (this.viewType == 2){
            return;
        }
        for (let index = 0; index < this.listContent.children.length; index++) {
            const element = this.listContent.children[index];
            if (element){
                element.active = false;
            }
        }
        this.friendDataList = userData.curFriendList;
        for (let index = 0; index < this.friendDataList.length; index++) {
            let friend:FriendData = this.friendDataList[index];

            let ele = this.listContent.children[index];
            if (!ele){
                ele = instantiate(this.listContent.children[0])
                ele.parent = this.listContent;
            }
            ele.active = true;
            ele.getComponent(friendItem).refreshData(friend);
        }
    }

    onClickHandler(eve:any, str:string){
        audioManager.instance.playSound(Const.Audio.btn)
        let btnName = eve.target._name;
        if (btnName == "btnSearch"){
            //添加好友
            if (!this.searchEdit.string){
                this.toast("请输入用户ID进行搜索");
                return;
            }
            HttpClient.getInstance().getFriendSearch(this.searchEdit.string, (res:any)=>{
                let friend:FriendData = res.res.data.user
                if (friend){
                    this.searchItem.active = true;
                    this.searchItem.getComponent(friendItem).refreshData(friend);
                }else{
                    this.searchItem.active = false;
                }
            })
        }
        else if (btnName == "btnReset"){
            //推荐好友换一批
            HttpClient.getInstance().getFriendRecommend();
        }
    }
    
    onClickBtnClose() {
        this.close();
    }

}

