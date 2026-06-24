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
         for (let index = 0; index < this.listContent.children.length; index++) {
            const element = this.listContent.children[index];
            if (element){
                element.active = false;
            }
        }

        this.numLab.string = "好友数量：" + playerDataStore.friendList.length + "/"+50;

        for (let index = 0; index < playerDataStore.friendList.length; index++) {
            let friend:FriendProfileRecord = playerDataStore.friendList[index];

            let ele = this.listContent.children[index];
            if (!ele){
                ele = instantiate(this.listContent.children[0])
                ele.parent = this.listContent;
            }
            ele.active = true;
            ele.getComponent(FriendItemCellController).refreshData(friend);
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

