import { find, Label, Node, Sprite, SpriteFrame, tween, v3, _decorator, EditBox } from 'cc';
import { Const } from '../../../config/Const';
import { RoleSex } from '../../../config/global';
import { AudioPlaybackService } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { ResourceLoaderService } from '../../../easyFramework/mgr/resourceUtil';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { aiRobot } from '../../comm/AIRobot';
import { playerDataStore } from '../../comm/UserData';
import { RewardVideoManager } from '../../../Util/RechargeManager';
import { GameHttpClient } from '../../../../typeScript/net/HttpClient';
import { PetProfileRecord } from '../../../../typeScript/gameData';

const { ccclass, property } = _decorator;

@ccclass('PetNameView')
export class PetNameView extends BaseView {

    @property({ type: EditBox, tooltip: "输入框" }) nameEdit: EditBox = null!;

    @property({ type: Label, tooltip: "改名费用" }) coinLab: Label = null!;

    curPetData:PetProfileRecord = null!;

    start() {

        this.coinLab.string = "" + Const.PET_NAME_CHANGE_GOLD_COST;
        this.nameEdit.string = "";

        this.bindButton(find("root/btnClose", this.node)!, this.close)

        this.bindButton(find("root/btnSave", this.node)!, ()=>{

             AudioPlaybackService.instance.playSound(Const.Audio.btn)

            let str = this.nameEdit.getComponent(EditBox)!.string
            if (str == "") {
                this.toast("名字不能为空")
                return
            }
            if(str.length > 7){
                this.toast("名字不能超过7个字")
                return
            }

            if (playerDataStore.coin < Const.PET_NAME_CHANGE_GOLD_COST){
                this.toast("金币不足")
                return
            }

            GameHttpClient.getInstance().sendPetAction(8, this.curPetData.id, 0, 0, str, ()=>{
                this.toast("修改成功")
                this.close();
            })
        })

        this.bindButton(find("root/btnCanl", this.node)!, ()=>{
            this.close();
        })
    }

    show(args: any) {
        super.show(args)

        this.curPetData = args;
    }

    updateInfo() {

    }



}

