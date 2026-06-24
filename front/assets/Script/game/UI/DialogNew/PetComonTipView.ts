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
import { PetProfileRecord } from '../../../../typeScript/gameData';
import { GameHttpClient } from '../../../../typeScript/net/HttpClient';
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

    type: number = 0;

    selectData:PetProfileRecord = null!;

    start() {

        this.bindButton(find("root/btnClose", this.node)!, this.close)

        this.bindButton(find("root/btnSave", this.node)!, ()=>{
            if (this.type == 1){
                GameHttpClient.getInstance().sendPetAction(3, this.selectData.id, 0, 0, "", ()=>{
                    GameHttpClient.getInstance().getPetList(()=>{
                        Notifications.emit(GD.event.updateScenePet);
                    });
                    this.toast("放生成功")
                    this.close();
                })
            }
            else if (this.type == 2){
                GameHttpClient.getInstance().sendPetAction(1, this.selectData.id, 0, 0, "", ()=>{
                    this.toast("放置成功")
                    Notifications.emit(GD.event.updateScenePet);
                    this.close();
                })
            }
            else if (this.type == 3){
                GameHttpClient.getInstance().sendPetAction(2, this.selectData.id, 0, 0, "", ()=>{
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

