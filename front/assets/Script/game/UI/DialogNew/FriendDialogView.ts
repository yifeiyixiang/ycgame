import { Button, find, instantiate, Node, ProgressBar, Sprite, tween, v3, Vec3, _decorator,Label,EditBox } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
import { AudioPlaybackService } from '../../../easyFramework/mgr/audioManager';
import { GameHttpClient } from '../../../../typeScript/net/HttpClient';
import { FriendProfileRecord } from '../../../../typeScript/gameData';
import { FriendItemCellController } from './item/friendItem';
import { GameEventManager } from '../../../../typeScript/EventManger';
import { playerDataStore } from '../../comm/UserData';
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

    viewType:number = 1;

    friendDataList:FriendProfileRecord[] = [];

    listContent: Node = null!;

    start() {
        this.bindButton(this.btnClose, this.onClickBtnClose);

        GameEventManager.eventTarget.on(GameEventManager.EEventName.REFRESH_FRIEND_DATA, this.refresh, this);

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
            GameHttpClient.getInstance().getFriendRecommend();
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
            GameHttpClient.getInstance().getFriendApply();
        }
    }

    refresh(){
        if (this.viewType == 2){
            return;
        }
        for (let cellIndex = 0; cellIndex < this.listContent.children.length; cellIndex++) {
            const friendCellNode = this.listContent.children[cellIndex];
            if (friendCellNode){
                friendCellNode.active = false;
            }
        }
        this.friendDataList = playerDataStore.curFriendList;
        for (let friendIndex = 0; friendIndex < this.friendDataList.length; friendIndex++) {
            let friendRecord:FriendProfileRecord = this.friendDataList[friendIndex];

            let friendCellNode = this.listContent.children[friendIndex];
            if (!friendCellNode){
                friendCellNode = instantiate(this.listContent.children[0])
                friendCellNode.parent = this.listContent;
            }
            friendCellNode.active = true;
            friendCellNode.getComponent(FriendItemCellController).refreshData(friendRecord);
        }
    }

    onClickHandler(eve:any, str:string){
        AudioPlaybackService.instance.playSound(Const.Audio.btn)
        let actionName = eve.target._name;
        if (actionName == "btnSearch"){

            if (!this.searchEdit.string){
                this.toast("请输入用户ID进行搜索");
                return;
            }
            GameHttpClient.getInstance().getFriendSearch(this.searchEdit.string, (res:any)=>{
                let foundFriend:FriendProfileRecord = res.res.data.user
                if (foundFriend){
                    this.searchItem.active = true;
                    this.searchItem.getComponent(FriendItemCellController).refreshData(foundFriend);
                }else{
                    this.searchItem.active = false;
                }
            })
        }
        else if (actionName == "btnReset"){

            GameHttpClient.getInstance().getFriendRecommend();
        }
    }

    onClickBtnClose() {
        this.close();
    }

}

