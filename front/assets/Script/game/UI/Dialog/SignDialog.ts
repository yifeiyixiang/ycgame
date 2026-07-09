import { _decorator, Node, Label, find, Sprite, instantiate, v3, SpriteFrame, LabelOutline, color, Button, } from 'cc';
import { Const } from '../../../config/Const';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { RewardVideoManager } from '../../../Util/RechargeManager';
import { SignState, SignUtil } from '../../comm/SignUtil';
import { GameHttpClient } from '../../../../typeScript/net/HttpClient';
import { playerDataStore } from '../../comm/UserData';
import GD from '../../../config/GD';

const { ccclass, property } = _decorator;


@ccclass('SignDialog')
export class SignDialog extends BaseView {
    @property({ type: Node }) dayRoot: Node = null!;
    @property({ type: Node }) dayItem: Node = null!;

    @property({ type: SpriteFrame }) bqFrame: SpriteFrame = null!;
    @property({ type: SpriteFrame }) yqdFrame: SpriteFrame = null!;

    @property({ type: Node }) btnReceive: Node = null!;


    _curSignDay = 0
    start() {
        this.bindButton(find("root/btnClose", this.node)!, this._fn_xe)

        this.bindButton(this.btnReceive!, this.onClickResign)
    }

    show(args: any) {
        super.show(args)

       this._fn_ys();

    }

    onEnable() {
        this.on(GD.event.updateGame, this._fn_ys)
    }

    onDisable() {
        this.off(GD.event.updateGame, this)
    }

    _fn_ys(){
        this._curSignDay = SignUtil._fn_ho()._fn_gn()
        for (let i = 1; i <= 7; i++) {
            this._fn_nv(find("day" + i, this.dayRoot)!, i)
        }

        find("Layout/Label", this.btnReceive)!.getComponent(Label).string = playerDataStore.userInfodata.user_sign.sign_status==1?"已签到":"签到";

        this.btnReceive.getComponent(Button)!.interactable = playerDataStore.userInfodata.user_sign.sign_status==0
    }

    _fn_nv(dayParent: Node, day: number) {
        let data = TableDataService.ins()._fn_ly(Const.Tables.new_sign, day)
        let dayNode = dayParent.getChildByName("dayItem")
        if (dayNode == null) {
            dayNode = instantiate(this.dayItem)
            dayNode.position = v3(0, 0, 0)
            dayParent.addChild(dayNode)
        }

        let daytitle = dayNode.getChildByName("dayLabel")!.getComponent(Label)
        let numLabel = dayNode.getChildByName("numLabel")!.getComponent(Label)

        daytitle!.string = "第" + data.sign_in_days + "天";


        let icon = dayNode.getChildByName("icon")!
        let propId = data.sign_in_rewards[0][0]
        let num = data.sign_in_rewards[0][1]

        let propData = TableDataService.ins()._fn_ly(Const.Tables.new_prop, propId)

        numLabel!.string = "x" + num
        this._fn_agk(icon.getComponent(Sprite)!, Const.resPath.icon + propData.icon, () => { }, 100)












        find("qdbk", dayNode)!.active = false
        let signState = SignUtil._fn_ho()._fn_li(day)

        if (playerDataStore.userInfodata.user_sign.sign_in_days >= day){
            signState =  SignState.receiced
        }else{
            signState =  SignState.canReceive
        }

        if (signState == SignState.receiced) {
            find("signed", dayNode)!.active = true
            find("signed/yqd", dayNode)!.getComponent(Sprite)!.spriteFrame = this.yqdFrame
        } else if (signState == SignState.paseReceive) {
            find("signed", dayNode)!.active = true
            find("signed/yqd", dayNode)!.getComponent(Sprite)!.spriteFrame = this.bqFrame
        } else {
            if (signState == SignState.canReceive) {
                find("qdbk", dayNode)!.active = true
            }
            find("signed", dayNode)!.active = false
        }

        find("qdbk", dayNode)!.active = false;





    }

    _fn_nt(event: any, data: any) {
        let iconVideo = find("Layout/icon_video", this.btnReceive)!
        let btnLabel = find("Layout/Label", this.btnReceive)!.getComponent(Label)!

        if (data.signState == SignState.canReceive) {
            this.btnReceive.active = true
            this.btnReceive.getComponent(Sprite)!.grayscale = false
            iconVideo.active = false
            btnLabel.string = "领取"
            this.btnReceive.getComponent(Button)!.interactable = true
            this.addButtonHander(this.btnReceive, this.node, "SignDialog", "onClickReceive", data)
            btnLabel.node.getComponent(LabelOutline)!.color = color(68, 86, 9);
        } else if (data.signState == SignState.paseReceive) {
        this.btnReceive.active = true
            this.btnReceive.getComponent(Sprite)!.grayscale = false
            iconVideo.active = true
            btnLabel.string = "补签"
            this.btnReceive.getComponent(Button)!.interactable = true
            this.addButtonHander(this.btnReceive, this.node, "SignDialog", "onClickResign", data)
            btnLabel.node.getComponent(LabelOutline)!.color = color(68, 86, 9);
        } else if (data.signState == SignState.receiced) {
            this.btnReceive.getComponent(Sprite)!.grayscale = true
            iconVideo.active = false
            btnLabel.string = "已领取"
            btnLabel.node.getComponent(LabelOutline)!.color = color(86, 90, 74);
            this.btnReceive.getComponent(Button)!.interactable = false
            this._fn_ct(this.btnReceive)
        } else {
            this.btnReceive.getComponent(Sprite)!.grayscale = true
            iconVideo.active = false
            btnLabel.string = "明日可领取"
            btnLabel.node.getComponent(LabelOutline)!.color = color(86, 90, 74);
            this.btnReceive.getComponent(Button)!.interactable = false
            this._fn_ct(this.btnReceive)
        }
    }


    onClickReceive(event: any, data: any) {









        GameHttpClient._fn_ho()._fn_ady();

    }

    onClickResign() {




        GameHttpClient._fn_ho()._fn_ady();
    }
}

