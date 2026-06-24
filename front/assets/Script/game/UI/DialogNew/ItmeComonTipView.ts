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

const { ccclass, property } = _decorator;

@ccclass('ItmeComonTipView')
export class ItmeComonTipView extends BaseView {

    @property({ type: Label })
    desLab: Label = null!;

    type: number = 0;

    start() {

        this.bindButton(find("root/btnClose", this.node)!, this.close)

        this.bindButton(find("root/btnSave", this.node)!, ()=>{

        })

        this.bindButton(find("root/btnCanl", this.node)!, ()=>{
            this.close();
        })
    }

    show(args: any) {
        super.show(args)

        this.type = args;
    }

    updateInfo() {

    }



}

