import { find, Label, Node, Sprite, SpriteFrame, tween, v3, _decorator, EditBox } from 'cc';
import { Const } from '../../../config/Const';
import { RoleSex } from '../../../config/global';
import { audioManager } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { resourceUtil } from '../../../easyFramework/mgr/resourceUtil';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import ServerCtr from '../../../tyqSDK/SDK/network/ServerCtr';
import { tyqSDK } from '../../../tyqSDK/SDK/tyqSDK';
import { aiRobot } from '../../comm/AIRobot';
import { userData } from '../../comm/UserData';
import { RechargeManager } from '../../../Util/RechargeManager';
import { petItemData } from '../../../../typeScript/gameData';
import { HttpClient } from '../../../../typeScript/net/HttpClient';
import { Notifications } from '../../../easyFramework/mgr/notifications';
import GD from '../../../config/GD';

const { ccclass, property } = _decorator;

@ccclass('PetComonTipView')
export class PetComonTipView extends BaseView {

    @property({ type: Label })
    desLab: Label = null!;

    @property({ type: Label })
    sureLab: Label = null!;

    @property({ type: Label })
    cancleLab: Label = null!;

    type: number = 0;   //1放生，2放置家园, 3休息

    selectData:petItemData = null!;

    start() {

        this.bindButton(find("root/btnClose", this.node)!, this.close)

        this.bindButton(find("root/btnSave", this.node)!, ()=>{
            if (this.type == 1){
                HttpClient.getInstance().sendPetAction(3, this.selectData.id, 0, 0, "", ()=>{
                    HttpClient.getInstance().getPetList(()=>{
                        Notifications.emit(GD.event.updateScenePet);
                    });
                    this.toast("放生成功")
                    this.close();
                })
            }
            else if (this.type == 2){
                HttpClient.getInstance().sendPetAction(1, this.selectData.id, 0, 0, "", ()=>{
                    this.toast("放置成功")
                    Notifications.emit(GD.event.updateScenePet);
                    this.close();
                })
            }
            else if (this.type == 3){
                HttpClient.getInstance().sendPetAction(2, this.selectData.id, 0, 0, "", ()=>{
                    this.toast("宠物已休息")
                    Notifications.emit(GD.event.updateScenePet);
                    this.close();
                })
            }
        })

        this.bindButton(find("root/btnCanl", this.node)!, ()=>{
            this.close();
        })
    }

    show(args: any) {
        super.show(args)

        this.type = args[0];

        if (this.type == 1){
            this.desLab.string = "是否放生次宠物，放生后永久删除， 请谨慎考虑!"
            this.sureLab.string = "放生"
        }
        else if (this.type == 2){
            this.desLab.string = "是否确定放置到家园？"
            this.sureLab.string = "确定"
        }
        else if (this.type == 3){
            this.desLab.string = "是否确定让该宠物休息？"
            this.sureLab.string = "确定"
        }

        this.selectData = args[1];
    }

    updateInfo() {

    }



}

