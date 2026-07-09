import { Button, color, director, find, instantiate, Label, LabelOutline, Node, Sprite, UITransform, v3, Vec3, _decorator } from 'cc';
import { WECHAT } from 'cc/env';
import { Const } from '../../../config/Const';
import { GodWealthData } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { GameStorage } from '../../../easyFramework/mgr/gameStorage';
import { ResourceLoaderService } from '../../../easyFramework/mgr/resourceUtil';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import { GNetCmd } from '../../../easyFramework/network/conf';
import ServerCtrJSF from '../../../easyFramework/network/ServerCtrJSF';
import TimeCtrJSF from '../../../easyFramework/network/TimeCtrJSF';
import TableDataService from '../../../easyFramework/other/tables';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
import { playerDataStore } from '../../comm/UserData';
import { GamePlatform } from '../../platform/GamePlatform';
const { ccclass, property } = _decorator;

@ccclass('GodWealthOther')
export class GodWealthOther extends BaseView {

    @property({ type: Node })
    btnClose: Node = null!;

    @property({ type: Node })
    btnReceive: Node = null!;

    @property({ type: Label })
    receiveTimeLabel: Label = null!;

    @property({ type: Node })
    selectLayer: Node = null!;

    @property({ type: Node })
    selectItem: Node = null!;

    @property({ type: Label })
    shareLabel: Label = null!;

    @property({ type: Node })
    receivedLabel: Node = null!;

    _curRewardData: any = []
    _curSelectIndex = -1
    _timeData: any = null
    _curShareUserID: string = ""

    _godWealthData: any = null;

    _isReceived = false


    private static key_receiveOther = "receiveOther"
    private static key_shareUserID = "shareUserID"
    private static Key_fubag = "fubagreceive"
    private static Key_shareReceiveTime = "shareReceiveTime"


    get timeData() {
        if (this._timeData == null) {
            this._timeData = TableDataService.ins()._fn_lz(Const.Tables.privilege, "key", "10011")
        }
        return this._timeData!
    }

    onLoad() {

        this.selectItem.parent = this.node;
        this.selectItem.active = false;

        this.bindButton(this.btnClose, this._fn_sz);
        this.bindButton(this.btnReceive, this.onClickBtnReceive);


    }

    onEnable() {
        director.off(GNetCmd.ReceiveGodWealth.toString(), this._fn_ux, this);
        director.on(GNetCmd.ReceiveGodWealth.toString(), this._fn_ux, this);
    }

    onDisable() {
        director.off(GNetCmd.ReceiveGodWealth.toString(), this._fn_ux, this);
    }

    show(args: any) {
        super.show(args);

        let params = this._layerData.params
        this._curShareUserID = params.shareUserId
        this._curRewardData = params.propList

        ServerCtrJSF._fn_hp()._fn_aaz(this._curShareUserID + "", -1)

        this._fn_zs();
        this._fn_nu()
        if (GameStorage._fn_hr(Const.DataKeys.authSetting, 0) == 0) {
            if (WECHAT) {
                GamePlatform._fn_abj().then((res: any) => {
                    console.error("res = ", res)
                    let avatarUrl = res && (res.avatarUrl || (res.userInfo && res.userInfo.avatarUrl))
                    if (avatarUrl) {
                        playerDataStore.roleAvatar = avatarUrl
                    }
                    console.error("userData.roleAvatar = ", playerDataStore.roleAvatar)
                }).catch(() => { })
                GameStorage._fn_aey(Const.DataKeys.authSetting, 1)
            }
        } else {
            this._fn_ake()
        }
    }


    _fn_ux(value: any) {
        if (value == null) {
            return
        }
        if (value.status != 'success') {
            console.log("请求失败~!")
            return null;
        }
        let godWealthData: GodWealthData = { shareUserId: playerDataStore.roleID, shareName: this._layerData.params.shareName, propList: this._curRewardData, receiveUser: [], shareTime: Math.floor(TimeCtrJSF._fn_hp().ServerTime) }
        if (value.shareData) {
            godWealthData = value.shareData
            console.error("godWealthData = ", value.shareData)

            if (!TimeCtrJSF._fn_qr(Math.floor(TimeCtrJSF._fn_hp().ServerTime), godWealthData.shareTime, this.timeData.cdTime)) {
                this._fn_aiu("领取超时")
                this.close()
                return
            }
            if (godWealthData.shareUserId == this._curShareUserID) {
                this._godWealthData = godWealthData
                this._fn_ajp(godWealthData)
            }
        }
    }


    _fn_uw(value: any) {
        if (value == null) {
            return
        }
        if (value.status != 'success') {
            console.log("请求失败~!")
            return null;
        }
        let godWealthData: GodWealthData = { shareUserId: playerDataStore.roleID, shareName: this._layerData.params.shareName, propList: this._curRewardData, receiveUser: [], shareTime: Math.floor(TimeCtrJSF._fn_hp().ServerTime) }
        if (value.key.indexOf(GameStorage._fn_rb(Const.DataKeys.GodWealthData)) >= 0) {
            if (value.val != "") {
                godWealthData = JSON.parse(value.val)
                this._godWealthData = godWealthData
                this._fn_ajp(godWealthData)
            }
        }
    }

    _fn_ajp(godWealthData: GodWealthData) {
        if (godWealthData.shareUserId != this._curShareUserID + "") {
            return
        }
        find("root/shareLabel", this.node)!.getComponent(Label)!.string = "财神" + godWealthData.shareName + "送了你一个礼包，选择一个你想要的拿走吧"
        let receiveData = godWealthData.receiveUser
        let receiveTime = 0
        this._isReceived = false
        for (let i = 0; i < 6; i++) {
            let item = this.selectLayer.getChildByName("selectItem" + i)
            if (item) {
                let myChose = item.getChildByName("myChose")!
                myChose.active = false
                let otherChose = item.getChildByName("otherChose")!
                otherChose.active = false
                let receiveUser = receiveData[i]
                console.error("receiveData" + i, receiveData[i])

                if (receiveUser) {
                    if (receiveUser.userID == playerDataStore.roleID + "") {
                        myChose.active = true
                        receiveTime++

                        this._isReceived = true
                        let curTime = playerDataStore._fn_jz(this.timeData.dataKey + GodWealthOther.key_receiveOther, this.timeData.cdTime)
                        if (curTime < 1 || playerDataStore._fn_hu(this.timeData.dataKey + GodWealthOther.key_shareUserID + (curTime - 1), this.timeData.cdTime, this._curShareUserID + "") != this._curShareUserID + "") {
                            mergeBoardStateStore._fn_m(this._curRewardData[i], 1)
                            playerDataStore._fn_afa(this.timeData.dataKey + GodWealthOther.key_shareUserID + curTime, this.timeData.cdTime, this._curShareUserID + "")
                            playerDataStore._fn_afo(this.timeData.dataKey + GodWealthOther.key_receiveOther, this.timeData.cdTime)
                        }

                    } else if (receiveUser.userID != "") {
                        otherChose.active = true
                        receiveTime++
                        if (receiveUser.avatar != "") {

                            ResourceLoaderService._fn_afr(receiveUser.avatar, find("head/icon", otherChose)!.getComponent(Sprite)!, () => { })
                        }

                        if (receiveUser.userID == this._curShareUserID) {
                            if (receiveUser.avatar != "") {

                                ResourceLoaderService._fn_afr(receiveUser.avatar, find("root/shareicon", this.node)!.getComponent(Sprite)!, () => { })
                            }
                        }
                    }
                }
            }
        }

        let btnReceive = find("root/btnReceive", this.node)!
        if (this._isReceived) {
            btnReceive.getComponent(Button)!.interactable = false
            btnReceive.getChildByName("bg")!.getComponent(Sprite)!.grayscale = true
            btnReceive.getChildByName("text")!.getComponent(Label)!.string = "Received"
            btnReceive.getChildByName("text")!.getComponent(LabelOutline)!.color = color(30, 30, 30, 255)
        } else {
            btnReceive.getComponent(Button)!.interactable = true
            btnReceive.getChildByName("bg")!.getComponent(Sprite)!.grayscale = false
            btnReceive.getChildByName("text")!.getComponent(Label)!.string = "领取"
            btnReceive.getChildByName("text")!.getComponent(LabelOutline)!.color = color(68, 86, 9, 255)
        }

        this._fn_nu()
    }

    _fn_nu() {
        let curTime = playerDataStore._fn_jz(this.timeData.dataKey + GodWealthOther.key_receiveOther, this.timeData.cdTime)

        if (curTime >= Const.GodWealthReceiveOtherTime) {
            this.btnReceive.active = false
            this.receivedLabel.active = true
            if(playerDataStore._fn_hu(this.timeData.dataKey + GodWealthOther.key_shareUserID + (0), this.timeData.cdTime, this._curShareUserID + "") == this._curShareUserID + "" ||playerDataStore._fn_hu(this.timeData.dataKey + GodWealthOther.key_shareUserID + (1), this.timeData.cdTime, this._curShareUserID + "") == this._curShareUserID + ""){
                this.receivedLabel.getComponent(Label)!.string = "Received"
            }else{
                this.receivedLabel.getComponent(Label)!.string = "Receive limit used"
            }
        } else {
            if (curTime == 1 && playerDataStore._fn_hu(this.timeData.dataKey + GodWealthOther.key_shareUserID + (curTime - 1), this.timeData.cdTime, this._curShareUserID + "") == this._curShareUserID + "") {
                this.btnReceive.active = false
                this.receivedLabel.active = true
                this.receivedLabel.getComponent(Label)!.string = "Received"
            } else {
                this.btnReceive.active = true
                this.receivedLabel.active = false
            }
        }
        this.receiveTimeLabel.string = "Receive count " + curTime + "/" + Const.GodWealthReceiveOtherTime
    }

    _fn_zs(force = false) {
        this.selectLayer.removeAllChildren();
        for (let i = 0; i < this._curRewardData.length; i++) {
            let item = instantiate(this.selectItem)
            item.position = v3(0, 0, 0)
            item.active = true
            item.name = "selectItem" + i
            this.selectLayer.addChild(item)
            this._fn_on(this._curRewardData[i], item, i)
        }
    }

    _fn_on(id: number, item: Node, index: number) {
        let data = TableDataService.ins()._fn_ly(Const.Tables.prop, id)
        this.bindButton(find("btnPropInfo", item)!, () => {
            UiLayerService.instance._fn_ahg(Const.Dialogs.ItemCodexLayer, id);
        })
        this._fn_agk(find("icon", item)!.getComponent(Sprite)!, Const.resPath.icon + data.icon, () => { }, 120)
        find("val", item)!.getComponent(Label)!.string = data.name
        this.addButtonHander(item, this.node, "GodWealthOther", "onClickSelectItem", index)
    }

    onClickSelectItem(event: any, data: number) {
        if (this._isReceived) {
            return
        }

        this._curSelectIndex = data
        for (let i = 0; i < 6; i++) {
            let item = this.selectLayer.getChildByName("selectItem" + i)
            if (item) {
                find("chose", item)!.active = i == data
            }
        }
    }

    _fn_sz() {
        this.close();
    }

    _fn_ud(btn: Button) {
        // @ts-ignore
        let bagId = btn.node.bagId;
        UiLayerService.instance._fn_ahg(Const.Dialogs.FuBagLayer, bagId);
    }

    onClickBtnReceive() {
        if (this._curSelectIndex < 0) {
            this._fn_aiu("Please choose a gift first")
            return
        }
        ServerCtrJSF._fn_hp()._fn_aaz(this._curShareUserID + "", this._curSelectIndex)
















    }

    _fn_ake() {
        if (WECHAT) {
            GamePlatform._fn_abj().then((res: any) => {

                let avatarUrl = res && (res.avatarUrl || (res.userInfo && res.userInfo.avatarUrl))
                if (avatarUrl) {
                    playerDataStore.roleAvatar = avatarUrl
                }

            }).catch(() => { })
        }
    }


}

