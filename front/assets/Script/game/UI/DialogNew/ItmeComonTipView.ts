import { find, Label, Node, Sprite, SpriteFrame, tween, v3, _decorator, EditBox } from 'cc';
import { Const } from '../../../config/Const';
import { RoleSex } from '../../../config/global';
import { audioManager } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { resourceUtil } from '../../../easyFramework/mgr/resourceUtil';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { aiRobot } from '../../comm/AIRobot';
import { userData } from '../../comm/UserData';
import { RechargeManager } from '../../../Util/RechargeManager';

const { ccclass, property } = _decorator;

@ccclass('ItmeComonTipView')
export class ItmeComonTipView extends BaseView {

    @property({ type: Label })
    desLab: Label = null!;

    type: number = 0;   //1放生，2体力

    start() {

        this.bindButton(find("root/btnClose", this.node)!, this.close)

        this.bindButton(find("root/btnSave", this.node)!, ()=>{
            //修改昵称
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

