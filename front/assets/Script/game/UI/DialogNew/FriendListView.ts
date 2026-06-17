import { Button, find, instantiate, Node, ProgressBar, Sprite, tween, v3, Vec3, _decorator,Label } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { composeModel } from '../../comm/composeModel';
import { audioManager } from '../../../easyFramework/mgr/audioManager';
import { HttpClient } from '../../../../typeScript/net/HttpClient';
import { EventManger } from '../../../../typeScript/EventManger';
import { userData } from '../../comm/UserData';
import { FriendData } from '../../../../typeScript/gameData';
import { friendItem } from './item/friendItem';
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

        // this.bindButton(find("root/nameBg/btnName", this.node)!, () => {
        //     uiManager.instance.showDialog(Const.Dialogs.PetNameView)
        // })

        // this.bindButton(find("root/btnFangsheng", this.node)!, () => {
        //     uiManager.instance.showDialog(Const.Dialogs.PetComonTipView, 1)
        // })

        EventManger.eventTarget.on(EventManger.EEventName.REFRESH_FRIEND_DATA, this.refresh, this);

    }

    show(args: any) {
        super.show(args);

        HttpClient.getInstance().getFriendList();
    }

    refresh(){
         for (let index = 0; index < this.listContent.children.length; index++) {
            const element = this.listContent.children[index];
            if (element){
                element.active = false;
            }
        }

        this.numLab.string = "好友数量：" + userData.friendList.length + "/"+50;
                
        for (let index = 0; index < userData.friendList.length; index++) {
            let friend:FriendData = userData.friendList[index];

            let ele = this.listContent.children[index];
            if (!ele){
                ele = instantiate(this.listContent.children[0])
                ele.parent = this.listContent;
            }
            ele.active = true;
            ele.getComponent(friendItem).refreshData(friend);
        }
    }

    onClickHandler(eve:Event, str:string){
        audioManager.instance.playSound(Const.Audio.btn)
        if (str == "tuijian"){
            uiManager.instance.showDialog(Const.Dialogs.FriendDialogView, 1)
        }
        else if (str == "search"){
            uiManager.instance.showDialog(Const.Dialogs.FriendDialogView, 2)
        }
        else if (str == "apply"){
            uiManager.instance.showDialog(Const.Dialogs.FriendDialogView, 3)
        }
    }
    
    onClickBtnClose() {
        this.close();
    }

}

