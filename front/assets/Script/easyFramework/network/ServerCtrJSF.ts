import { WmSocketJSF } from "./WmSocketJSF";


export const ServerState = {
    Normal: 'normal',
    New: 'new',
    Hot: 'hot',
    Maintain: 'maintain'
}

import { game, _decorator } from 'cc';
import { HTML5 } from "cc/env";
import { Const } from "../../config/Const";
import GD from "../../config/GD";
import { GAccountWay, GOrderStatus, GPlatform, GPromptType } from "../../config/global";
import { mergeBoardStateStore } from "../../game/comm/mergeBoardModel";
import { GameStorage } from "../mgr/gameStorage";
import { Notifications } from "../mgr/notifications";
import { UiLayerService } from "../mgr/uiManager";
import { UtilPub } from "../utils/UtilPub";
import { GNetCmd } from "./conf";
import CronCtrJSF from "./CronCtrJSF";
const { ccclass, property } = _decorator;

@ccclass('ServerCtrJSF')
export default class ServerCtrJSF {

    private static instance: ServerCtrJSF = null!;

    public static _fn_hp() {
        if (!this.instance) {
            this.instance = new ServerCtrJSF();
            this.instance._fn_oy();
        }
        return this.instance;
    }

    serverId: number = 1;
    account: string = '';
    accountWay: number = GAccountWay.guest;
    password: string = 'autoLogin123';
    authCode: string = "";
    token: string = '';
    regionDataList: any[] = [];
    uid: string = '';
    regionId: string = '';
    nickName: string = '胖啾啾啊';
    isLogin: boolean = true;
    isLoadAll: boolean = false;


    avatar: string = '';

    regionList: any = {};
    serverList: any = {};

    _fn_oy() {
        this.account = GameStorage._fn_ls('login_account', '');
        this.password = GameStorage._fn_ls('login_password', this.password);
        this.authCode = GameStorage._fn_ls('login_authCode', this.authCode);
        this.serverId = GameStorage._fn_hs('login_serverId', 1);
    }

    _fn_bv() {
        if (!this.account || this.account == '') {

            return false;
        }
        return true;
    }

    _fn_bu(regionId: number) {
        for (let i = 0; i < this.regionDataList.length; i++) {
            const data = this.regionDataList[i];
            if (data.regionId == regionId) {
                return true;
            }
        }
        return false;
    }
    _fn_fb() {
        return GameStorage._fn_hr('login_gameTime', 0);
    }

    _fn_d(num: number) {
        num += this._fn_fb()
        GameStorage._fn_aey('login_gameTime', num);
    }


    get prodUrlVersion() {
        return GameStorage._fn_ls('prod_url_version', "");
    }

    set prodUrlVersion(str: string) {
        console.log("-@@@@@@@@@@@--------设置生产环境的url版本--", str)
        GameStorage._fn_agp('prod_url_version', str);
    }


    get version() {
        return GameStorage._fn_ls('login_version', "");
    }

    set version(str: string) {
        console.log("-@@@@@@@@@@@--------设置服务端版本号--", str)
        GameStorage._fn_agp('login_version', str);
    }

    get Account() {
        if (this.account == "") {
            this.account = UtilPub._fn_yh(8)
        }
        return this.account;
    }

    set Account(str: string) {
        this.account = str;
        console.log("-@@@@@@@@@@@--------账号被修改--", str)
        GameStorage._fn_agp('login_account', this.account);
    }

    get PassWord() {
        return this.password;
    }

    set PassWord(str: string) {
        this.password = str;
        GameStorage._fn_agp('login_password', this.password);
    }
    get AuthCode() {
        return this.authCode;
    }

    set AuthCode(str: string) {
        this.authCode = str;
        GameStorage._fn_agp('login_authCode', this.authCode);
    }

    get ServerId() {
        return this.serverId;
    }
    set ServerId(id: number) {
        this.serverId = id;
        GameStorage._fn_agp('login_serverId', this.serverId + "");
    }

    _fn_qe() {
        return mergeBoardStateStore._fn_px() == true && ServerCtrJSF._fn_hp()._fn_fb() > 3 * 60
    }

    _fn_ajn(regions: any) {
        for (const key in regions) {
            const data = regions[key];
            this.regionList[key] = JSON.parse(data);
        }
    }

    _fn_ajq(servers: any) {
        for (const key in servers) {
            const data = servers[key];
            this.serverList[key] = JSON.parse(data);
        }
    }

    public _fn_ld(serverId: number) {
        for (const key in this.serverList) {
            const data = this.serverList[key];
            if (data.id == serverId) {
                return data;
            }
        }
        return null;
    }
    public _fn_ln(status: string) {
        switch (status) {
            case ServerState.Normal:
                return;
            case ServerState.New:
                return 'fm_tb_xin';
            case ServerState.Hot:
                return 'fm_tb_bao';
            case ServerState.Maintain:
                return 'fm_tb_wei';
            default:
                break;
        }
    }


    public _fn_id() {
        let id = 1;
        for (const key in this.serverList) {
            const data = this.serverList[key];
            let did = Number(data.id)
            if (did > id && data.status != ServerState.Maintain) {
                id = did;
            }
        }
        return id;
    }





    public _fn_abc(account: any, password: any) {
        if (!WmSocketJSF._fn_ho()._fn_pt()) return
        let data = {
            "cmd": GNetCmd.UserRegister,
            "lang": "zh",
            "account": account,
            "password": password,
        }
        WmSocketJSF._fn_ho().send({ "data": data });
    }

    public _fn_aaw() {
        if (!WmSocketJSF._fn_ho()._fn_pt()) return
        let data = {
            "cmd": GNetCmd.UserLogin,
            "lang": "zh",
            "account": this.account,
            "password": this.password,
            'nickName': this.nickName + this.account
        }
        WmSocketJSF._fn_ho().send({ "data": data });
    }


    public _fn_akc(failCb?: Function) {
        wx.login({
            success(loginResult) {
                console.warn("-----微信登录--", loginResult);
                let data = {
                    "cmd": GNetCmd.ReqWxSession,
                    "lang": "zh",
                    "channel": "wx",
                    "nickName": "",
                    jscode: loginResult.code,
                };
                console.warn('发送登录数据：', data);
                WmSocketJSF._fn_ho().send({ "data": data });
            },
            fail(res) {
                let msg = "登录失败：" + res.errMsg;
                if (failCb) failCb(msg);
            }
        });
    }

    public _fn_aax(account: string, password: string, authCode: string) {
        if (!WmSocketJSF._fn_ho()._fn_pt()) return
        let data = {
            "cmd": GNetCmd.UserLogin,
            "lang": "zh",
            "account": account,
            "password": password,
            "authCode": authCode,
            'nickName': this.nickName + this.account
        }
        WmSocketJSF._fn_ho().send({ "data": data });
    }


    public _fn_aaz(shareUserID: string, receicveIndex: number) {
        if (!WmSocketJSF._fn_ho()._fn_pt()) return
        let data = {
            "cmd": GNetCmd.ReceiveGodWealth,
            "lang": "zh",
            "token": this.token,
            "shareUserID": shareUserID,
            "receicveIndex": receicveIndex,
        }
        WmSocketJSF._fn_ho().send({ "data": data });
    }


    public _fn_abe(propId: string, propName: string, num: number, coming: string) {
        if (!WmSocketJSF._fn_ho()._fn_pt()) return
        let data = {
            "cmd": GNetCmd.SetPlayerPkgLog,
            "lang": "zh",
            "token": this.token,
            "propId": propId,
            "propName": propName,
            'num': num,
            'coming': coming,
        }
        WmSocketJSF._fn_ho().send({ "data": data });
    }

    public _fn_abk(account: string, accountWay: GAccountWay = GAccountWay.guest) {
        if (!WmSocketJSF._fn_ho()._fn_pt()) return
        let platform = GPlatform.Google
        if (HTML5) {
            platform = GPlatform.H5
        }
        let data = {
            "cmd": GNetCmd.UniqueLogin,
            "lang": "zh",
            "account": account,
            "accountWay": accountWay,
            "platform": platform,
            "nickName": "测试账号",
        }
        console.log("--请求测试账号---", data)
        WmSocketJSF._fn_ho().send({ "data": data });
    }


    public _fn_aar(code: string) {
        if (!WmSocketJSF._fn_ho()._fn_pt()) return
        let data = {
            "cmd": GNetCmd.GetActiveCode,
            "lang": "zh",
            "token": this.token,
            "code": code,
        }
        console.log("--请求激活码---", data)
        WmSocketJSF._fn_ho().send({ "data": data });








    }











    public _fn_aap(orderNo: string, chargeVal: number, chargeItemId: number, chargeItemCnt: string, orderStatus: GOrderStatus) {
        if (!WmSocketJSF._fn_ho()._fn_pt()) return
        let data = {
            "cmd": GNetCmd.CreateChargeOrder,
            "lang": "zh",
            "token": this.token,
            "orderNo": orderNo,
            "chargeVal": chargeVal,
            "chargeItemId": chargeItemId,
            "chargeItemCnt": chargeItemCnt,
            "orderStatus": orderStatus,
        }
        console.log("--创建充值订单---", data)
        WmSocketJSF._fn_ho().send({ "data": data });
    }







    public _fn_abl(orderNo: string, orderStatus: GOrderStatus) {
        if (!WmSocketJSF._fn_ho()._fn_pt()) return
        let data = {
            "cmd": GNetCmd.UpdChargeOrderStatus,
            "lang": "zh",
            "token": this.token,
            "orderNo": orderNo,
            "orderStatus": orderStatus,
        }
        console.log("--修改充值订单---", data)
        WmSocketJSF._fn_ho().send({ "data": data });
    }

    public _fn_abb() {
        if (!WmSocketJSF._fn_ho()._fn_pt()) return
        let data = {
            "cmd": GNetCmd.GetRegionList,
            "lang": "zh",
            "token": this.token,
        }
        WmSocketJSF._fn_ho().send({ "data": data });
    }

    public _fn_aba() {
        if (!WmSocketJSF._fn_ho()._fn_pt()) return
        let data = {
            "cmd": GNetCmd.GetRegionData,
            "lang": "zh",
            "token": this.token,
            "regionId": this.ServerId.toString()
        }
        console.log("--请求服务器数据---", data)
        WmSocketJSF._fn_ho().send({ "data": data });
    }

    public _fn_aat(key: string) {
        if (!WmSocketJSF._fn_ho()._fn_pt()) return
        let data = {
            "cmd": GNetCmd.GetUserDataByKey,
            "lang": "zh",
            "key": key,
            "token": this.token,
            "type": "normal",
            'model': "normal",
        }
        WmSocketJSF._fn_ho().send({ "data": data });
    }

    public _fn_aau(key: string) {
        if (!WmSocketJSF._fn_ho()._fn_pt()) return
        let data = {
            "cmd": GNetCmd.GetUserDataByKey,
            "lang": "zh",
            "key": key,
            "token": this.token,
            "type": "object",
            'model': "normal",
        }
        WmSocketJSF._fn_ho().send({ "data": data });
    }

    public _fn_mu(value: any, key: string) {
        if (value.status != 'success') {
            console.log("请求失败~!")
            return null;
        }
        switch (value.cmd) {
            case GNetCmd.GetUserDataByKey:
                if (value.key == GameStorage._fn_rb(key)) {
                    return value
                }
                break;
        }
        return null;
    }

    public _fn_aas(code: string) {
        if (!WmSocketJSF._fn_ho()._fn_pt()) return
        let data = {
            "cmd": GNetCmd.GetCodeDataByKey,
            "lang": "zh",
            "token": this.token,
            "code": code,
        }
        WmSocketJSF._fn_ho().send({ "data": data });
    }

    public _fn_gf(value: any, key: string) {
        if (value.status != 'success') {
            console.log("请求失败~!")
            return null;
        }
        switch (value.cmd) {
            case GNetCmd.GetUserDataByKey:
                if (value.key == GameStorage._fn_rb(key)) {
                    return value
                }
                break;
        }
        return null;
    }


    public _fn_aaq(jsonData: {}) {
        if (!WmSocketJSF._fn_ho()._fn_pt()) return
        CronCtrJSF._fn_hp()._fn_ei(jsonData);
    }

    public _fn_abn(jsonData: {}) {
        if (!WmSocketJSF._fn_ho()._fn_pt()) return
        CronCtrJSF._fn_hp()._fn_ajz(jsonData);
    }

    public _fn_abm() {
        if (!WmSocketJSF._fn_ho()._fn_pt()) return
        CronCtrJSF._fn_hp()._fn_ajy();
    }

    public _fn_aay(key: string, val: any, isFirst: boolean = false) {
        if (!WmSocketJSF._fn_ho()._fn_pt()) return
        CronCtrJSF._fn_hp()._fn_dj(key, val, isFirst);
    }

    public _fn_aao(key: string) {
        if (!WmSocketJSF._fn_ho()._fn_pt()) return
        CronCtrJSF._fn_hp()._fn_di(key);
    }

    public _fn_ajh() {
        if (!WmSocketJSF._fn_ho()._fn_pt()) return
        let data = {
            "cmd": GNetCmd.UploadAvatar,
            "lang": "zh",
            "token": this.token,
            "avatar": this.avatar,
        }
        WmSocketJSF._fn_ho().send({ "data": data });
    }

    public _fn_rz(value: any) {
        return
        console.log("onMessageEvent:", value);
        if (value.status != 'success') {
            console.log("请求失败~!")
            ServerCtrJSF._fn_hp().isLogin = false;

            if (value.cmd == GNetCmd.GetRegionData) {
                if (value.isBlock) {
                    UiLayerService.instance._fn_ahg(Const.Dialogs.ConfirmPromptDialogController, {
                        content: "您的账号已经被封，禁止登录，请联系社群。",
                        type: GPromptType.blockAccount,
                        cb: () => {

                        }
                    })
                }
            }
            return;
        }
        let ctr = ServerCtrJSF._fn_hp();
        switch (value.cmd) {
            case GNetCmd.ReqWxSession:
            case GNetCmd.UniqueLogin:
                ctr.accountWay = value.accountWay
                ctr.account = value.account;
                ctr.Account = value.account;
                ctr.token = value.token;
                ctr.regionDataList = value.regionDataList;
                ctr.uid = value.uid
                if (value.nickName && value.nickName != '') {
                    ctr.nickName = value.nickName;
                }
                ServerCtrJSF._fn_hp()._fn_aba()
                break;
            case GNetCmd.GetRegionData:
                ctr.token = value.token;

                ctr.prodUrlVersion = value.prodUrlVersion
                if (ctr.version == "" || ctr.version == value.version) {
                    console.log("----版本资源匹配--通过")
                } else {
                    UiLayerService.instance._fn_ahg(Const.Dialogs.ConfirmPromptDialogController, {
                        content: "您当前游戏版本不是最新的，请重新进入游戏！",
                        type: GPromptType.resNotNewest,
                        cb: () => {
                        }
                    })
                    ctr.version = value.version
                    return
                }



                GameStorage.clear()
                let isRobot = GameStorage.isRobot
                if(isRobot==true){

                    Notifications.emit(GD.event.loadAll, () => {
                        this.isLoadAll = true
                    })
                }else{
                    if (value.jsonData != "") {
                        GameStorage._fn_aeg(JSON.parse(value.jsonData))
                    }
                    GameStorage._fn_agp('login_account', ctr.Account);
                }



                if (ServerCtrJSF._fn_hp()._fn_qe() == true) {
                    Notifications.emit(GD.event.loadAll, () => {
                        this.isLoadAll = true
                    })
                } else {
                    this.isLoadAll = true
                }

                ctr.isLogin = true;

                break;
            default:
                break;
        }
    }
}
