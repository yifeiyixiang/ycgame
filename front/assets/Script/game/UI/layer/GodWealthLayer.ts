import { Button, director, find, instantiate, Label, Node, ProgressBar, Sprite, UITransform, v3, Vec3, _decorator } from 'cc';
import { WECHAT } from 'cc/env';
import { Const } from '../../../config/Const';
import { GodWealthData, GodWealthReceiveUser } from '../../../config/global';
import { localText } from '../../../config/localText';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { GameStorage } from '../../../easyFramework/mgr/gameStorage';
import { ResourceLoaderService } from '../../../easyFramework/mgr/resourceUtil';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import { GNetCmd } from '../../../easyFramework/network/conf';
import ServerCtrJSF from '../../../easyFramework/network/ServerCtrJSF';
import TimeCtrJSF from '../../../easyFramework/network/TimeCtrJSF';
import TableDataService from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { RewardVideoManager } from '../../../Util/RechargeManager';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
import { playerDataStore } from '../../comm/UserData';
import { GamePlatform } from '../../platform/GamePlatform';
const { ccclass, property } = _decorator;

@ccclass('GodWealthLayer')
export class GodWealthLayer extends BaseView {

    @property({ type: Node })
    btnClose: Node = null!;

    @property({ type: Node })
    btnChange: Node = null!;

    @property({ type: Node })
    btnShare: Node = null!;


    @property({ type: Node })
    btnReceive: Node = null!;

    @property({ type: Node })
    hintNode: Node = null!;

    @property({ type: Node })
    selectLayer: Node = null!;
    @property({ type: Node })
    selectItem: Node = null!;

    _curRewardData: any = null
    _curSelectIndex = -1
    _isReceived = false

    _godWealthData: any = null;

    private static key_receive = "receive"
    private static key_reflesh = "reflesh"
    private static Key_fubag = "fubagreceive"
    private static Key_shareReceiveTime = "shareReceiveTime"

    _timeData: any = null
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
        this.bindButton(this.btnChange, () => {
            this._fn_aka()
        });

        this.bindButton(this.btnShare, this._fn_tm)


    }

    onEnable() {
        director.off(GNetCmd.GetUserDataByKey.toString(), this._fn_uw, this);
        director.on(GNetCmd.GetUserDataByKey.toString(), this._fn_uw, this);
    }

    onDisable() {
        director.off(GNetCmd.GetUserDataByKey.toString(), this._fn_uw, this);
    }

    show(args: any) {
        super.show(args);
        this._fn_yu();
        this._fn_zs();

        this.schedule(this._fn_ajo, 1);
        this._fn_ajo();

        this._fn_nu()
        ServerCtrJSF._fn_hp()._fn_aat(GameStorage._fn_rb(Const.DataKeys.GodWealthData + "_" + playerDataStore.roleID))

    }

    _fn_uw(value: any) {
        if (value == null) {
            return
        }
        if (value.status != 'success') {
            console.log("请求失败~!")
            return null;
        }
        let godWealthData: GodWealthData = { shareUserId: playerDataStore.roleID, shareName: playerDataStore.roleName, propList: this._curRewardData, receiveUser: [], shareTime: Math.floor(TimeCtrJSF._fn_hp().ServerTime) }
        if (value.key.indexOf(GameStorage._fn_rb(Const.DataKeys.GodWealthData)) >= 0) {
            if (value.val != "") {
                godWealthData = JSON.parse(value.val)
                this._godWealthData = godWealthData
                this._fn_ajp(godWealthData)
                console.log("this._godWealthData = ", this._godWealthData)
            }
        }
    }

    _fn_ajp(godWealthData: GodWealthData) {
        if (godWealthData.shareUserId != playerDataStore.roleID) {
            return
        }
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
                if (receiveUser) {
                    if (receiveUser.userID == playerDataStore.roleID + "") {
                        myChose.active = true
                        receiveTime++
                        this._isReceived = true
                    } else if (receiveUser.userID != "") {
                        otherChose.active = true
                        receiveTime++
                        if (receiveUser.avatar != "") {

                            ResourceLoaderService._fn_afr(receiveUser.avatar, find("head/icon", otherChose)!.getComponent(Sprite)!, () => { })
                        }
                    }
                }
            }
        }

        let chs = find("root/top/progress/awardLayer", this.node)!.children;
        for (let i = 0; i < chs.length; i++) {
            let awardItem = chs[i];
            let getNode = find("get", awardItem)!;
            getNode.active = receiveTime >= (i + 1) * 2 && playerDataStore._fn_jz(this.timeData.dataKey + GodWealthLayer.Key_fubag + (i + 1), this.timeData.cdTime) <= 0;
        }

        let progress = find("root/top/progress", this.node)!.getComponent(ProgressBar)!
        progress.progress = receiveTime / 6
        find("root/top/progress/val", this.node)!.getComponent(Label)!.string = receiveTime + "/6"
    }

    _fn_nu() {
        if (playerDataStore._fn_jz(this.timeData.dataKey + "receive", this.timeData.cdTime) >= this.timeData.receiveTime) {
            this.btnReceive.active = false
            this.btnShare.active = true
            this.btnChange.active = false
        } else {
            this.btnReceive.active = true
            this.btnShare.active = false
            this.btnChange.active = true
        }
    }

    _fn_zs(force = false) {
        this.selectLayer.removeAllChildren();
        let curRewardData = this._fn_of(force)
        this._curRewardData = curRewardData
        for (let i = 0; i < curRewardData.length; i++) {
            let item = instantiate(this.selectItem)
            item.position = v3(0, 0, 0)
            item.active = true
            item.name = "selectItem" + i
            this.selectLayer.addChild(item)
            this._fn_on(curRewardData[i], item, i)
        }
    }

    _fn_of(force: boolean = false) {
        let propArr = TableDataService.ins()._fn_mb(Const.Tables.prop, "fudai", "1")
        let godProp = []
        for (let index = 0; index < 6; index++) {
            let propItem = propArr[Math.floor(propArr.length * Math.random())]
            godProp.push(propItem.id)
        }
        let _fn_fa = (isUpdate: boolean) => {
            if (isUpdate) {
                GameStorage._fn_afh(Const.DataKeys.GodWealthData + "_" + playerDataStore.roleID, "")
            }
        }
        return playerDataStore._fn_ig(this.timeData.dataKey, this.timeData.cdTime, godProp, force, _fn_fa)
    }

    _fn_on(id: number, item: Node, index: number) {
        let data = TableDataService.ins()._fn_ly(Const.Tables.prop, id)
        this.bindButton(find("btnPropInfo", item)!, () => {
            UiLayerService.instance._fn_ahg(Const.Dialogs.ItemCodexLayer, id);
        })
        this._fn_agk(find("icon", item)!.getComponent(Sprite)!, Const.resPath.icon + data.icon, () => { }, 120)
        find("val", item)!.getComponent(Label)!.string = data.name

        this.addButtonHander(item, this.node, "GodWealthLayer", "onClickSelectItem", index)
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

    _fn_yu() {
        let chs = find("root/top/progress/awardLayer", this.node)!.children;

        for (let i = 0; i < chs.length; i++) {
            let awardItem = chs[i];
            let btnPropInfo = find("btnPropInfo", awardItem)!;
            // @ts-ignore
            btnPropInfo.bagId = i + 1;
            this.bindButton(btnPropInfo, this._fn_ud);

            let getNode = find("get", awardItem)!;
            getNode.active = false;
            this.addButtonHander(getNode, this.node, "GodWealthLayer", "receiveFuBag", i + 1)
        }

        let progress = find("root/top/progress", this.node)!.getComponent(ProgressBar)!
        progress.progress = 0
    }

    _fn_ajo() {
        let dayTime = 24 * 60 * 60 * 1000;
        let nowTime = mergeBoardStateStore._fn_gm();
        let dayTimeStart = new Date(nowTime);
        dayTimeStart.setHours(0);
        dayTimeStart.setMinutes(0);
        dayTimeStart.setSeconds(0);
        dayTimeStart.setMilliseconds(0);

        let remain = dayTimeStart.getTime() + dayTime - nowTime;
        if (remain <= 0) {
            remain = 0;
        }
        let str = localText.godWealthHint.format(UtilPub._fn_mm(remain));
        this._fn_ago(this.hintNode, str);
    }

    close() {
        super.close();
        this.unschedule(this._fn_ajo);
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
            this._fn_aiu("请先选择一个礼物！")
            return
        }
        if (playerDataStore._fn_jz(this.timeData.dataKey + GodWealthLayer.key_receive, this.timeData.cdTime) >= this.timeData.receiveTime) {
            return
        }

        let propID = this._curRewardData[this._curSelectIndex]
        mergeBoardStateStore._fn_m(propID, 1, this.node.getComponent(UITransform)!.convertToWorldSpaceAR(Vec3.ZERO))
        playerDataStore._fn_afo(this.timeData.dataKey + GodWealthLayer.key_receive, this.timeData.cdTime)

        let receiveUsers = []
        for (let index = 0; index < 6; index++) {
            let use: GodWealthReceiveUser = index == this._curSelectIndex ? {
                userID: playerDataStore.roleID,
                avatar: playerDataStore.roleAvatar,
            } : {
                userID: "",
                avatar: "",
            }
            receiveUsers.push(use)
        }
        let godWealthData: GodWealthData = { shareUserId: playerDataStore.roleID, shareName: playerDataStore.roleName, propList: this._curRewardData, receiveUser: receiveUsers, shareTime: Math.floor(TimeCtrJSF._fn_hp().ServerTime) }
        this._godWealthData = godWealthData
        GameStorage._fn_afh(Const.DataKeys.GodWealthData + "_" + playerDataStore.roleID, godWealthData)
        this._fn_ajp(this._godWealthData)
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

    _fn_aka() {

        if (playerDataStore._fn_jz(this.timeData.dataKey + GodWealthLayer.key_reflesh, this.timeData.cdTime) >= Const.GodWealthRefleshTime) {
            this._fn_aiu("Refresh limit used")
            return
        }
        RewardVideoManager._fn_ahy("财神礼包刷新", () => {
            this._fn_zs(true)
            playerDataStore._fn_afo(this.timeData.dataKey + GodWealthLayer.key_reflesh, this.timeData.cdTime)
        })
    }

    _fn_tm() {

        this._fn_ake()

        let str = ""
        for (let index = 0; index < this._curRewardData.length; index++) {
            str += this._curRewardData[index]
            if (index < this._curRewardData.length - 1) {
                str += ","
            }
        }
        let args = "shareUserId=" + playerDataStore.roleID + "&shareName=" + playerDataStore.roleName + "&propList=" + str
        GamePlatform._fn_agw(args)
    }

    receiveFuBag(event: any, data: any) {
        UiLayerService.instance._fn_ahg(Const.Dialogs.FuBagReceiveLayer, { id: data });
        playerDataStore._fn_afo(this.timeData.dataKey + GodWealthLayer.Key_fubag + data, this.timeData.cdTime)
        if (this._godWealthData) {
            this._fn_ajp(this._godWealthData)
        }
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

