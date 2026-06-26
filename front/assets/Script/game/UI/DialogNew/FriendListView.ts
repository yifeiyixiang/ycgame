import { Button, find, instantiate, Node, ProgressBar, Sprite, tween, v3, Vec3, _decorator,Label } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
import { AudioPlaybackService } from '../../../easyFramework/mgr/audioManager';
import { GameHttpClient } from '../../../../typeScript/net/HttpClient';
import { GameEventManager } from '../../../../typeScript/EventManger';
import { playerDataStore } from '../../comm/UserData';
import { FriendProfileRecord } from '../../../../typeScript/gameData';
import { FriendItemCellController } from './item/friendItem';
const { ccclass, property } = _decorator;

@ccclass('FriendListView')
export class FriendListView extends BaseView {

    @property({ type: Node })
    btnClose: Node = null!;

    @property({ type: Label })
    numLab: Label = null!;

    @property({ type: Node })
    listContent: Node = null!;

    onLoad() {
        this.bindButton(this.btnClose, this.onClickBtnClose);









        GameEventManager.eventTarget.on(GameEventManager.EEventName.REFRESH_FRIEND_DATA, this.refresh, this);

    }

    show(args: any) {
        super.show(args);

        GameHttpClient.getInstance().getFriendList();
    }

    refresh(){
         for (let cellIndex = 0; cellIndex < this.listContent.children.length; cellIndex++) {
            const friendCellNode = this.listContent.children[cellIndex];
            if (friendCellNode){
                friendCellNode.active = false;
            }
        }

        this.numLab.string = "好友数量：" + playerDataStore.friendList.length + "/"+50;

        for (let friendIndex = 0; friendIndex < playerDataStore.friendList.length; friendIndex++) {
            let friendRecord:FriendProfileRecord = playerDataStore.friendList[friendIndex];

            let friendCellNode = this.listContent.children[friendIndex];
            if (!friendCellNode){
                friendCellNode = instantiate(this.listContent.children[0])
                friendCellNode.parent = this.listContent;
            }
            friendCellNode.active = true;
            friendCellNode.getComponent(FriendItemCellController).refreshData(friendRecord);
        }
    }

    onClickHandler(eve:Event, str:string){
        AudioPlaybackService.instance.playSound(Const.Audio.btn)
        if (str == "tuijian"){
            UiLayerService.instance.showDialog(Const.Dialogs.FriendDialogView, 1)
        }
        else if (str == "search"){
            UiLayerService.instance.showDialog(Const.Dialogs.FriendDialogView, 2)
        }
        else if (str == "apply"){
            UiLayerService.instance.showDialog(Const.Dialogs.FriendDialogView, 3)
        }
    }

    onClickBtnClose() {
        this.close();
    }

}

