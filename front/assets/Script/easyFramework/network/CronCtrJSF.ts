
import { Component, director, _decorator, game } from 'cc';
import { WmSocketJSF } from './WmSocketJSF';
import { GEvent, GNetCmd, GNetConst, GNetUrl } from './conf';
import ServerCtrJSF from './ServerCtrJSF';
import TimeCtrJSF from './TimeCtrJSF';
import { UiLayerService } from '../mgr/uiManager';
import { Const } from '../../config/Const';
import { GPromptType } from '../../config/global';
import { WECHAT } from 'cc/env';
import { BaseUiComponent } from '../mgr/comm';
const { ccclass, property } = _decorator;

@ccclass('CronCtrJSF')
export default class CronCtrJSF extends BaseUiComponent {

    private static _instance: CronCtrJSF;

    public static _fn_hp(): CronCtrJSF {
        if (!this._instance) {
            this._instance = new CronCtrJSF();
            this._instance.init();

        }
        return this._instance;
    }

    msgArr = [];
    msgArrIdx = 0;



    init() {
        director.off(GNetCmd.Heartbeat.toString(), this._fn_ut, this)
        director.off(GNetCmd.SaveUserRecord.toString(), this._fn_abu, this)
        director.on(GNetCmd.Heartbeat.toString(), this._fn_ut, this)
        director.on(GNetCmd.SaveUserRecord.toString(), this._fn_abu, this)
        this.unschedule(this._fn_aav)
        this.schedule(this._fn_aav, 3);



        this._fn_aii()
    }

    _fn_aii() {

        WmSocketJSF._fn_ho();

    }

    _fn_ut(data: any) {
        return
        if (data.status != GNetConst.ResSuccess) {
            console.error("heartbeat ", data)
            this.unschedule(this._fn_aav)
            ServerCtrJSF._fn_hp().isLogin = false;

            if (data.isOccupied) {
                UiLayerService.instance._fn_ahg(Const.Dialogs.ConfirmPromptDialogController, {
                    content: "您的账号已经在其他设备登录，请重新进入游戏！",
                    type: GPromptType.loginOccupy,
                    cb: () => {
                    }
                })
            } else if (data.isExpired) {
                UiLayerService.instance._fn_ahg(Const.Dialogs.ConfirmPromptDialogController, {
                    content: "您账号的登录信息已过期，请重新进入游戏！",
                    type: GPromptType.loginExpired,
                    cb: () => {
                    }
                })
            } else {
                UiLayerService.instance._fn_ahg(Const.Dialogs.ConfirmPromptDialogController, {
                    content: "您账号的登录信息已过期，请重新登录！",
                    type: GPromptType.unkown,
                    cb: () => {
                    }
                })
            }

            TimeCtrJSF._fn_hp()._fn_aab();


        } else {
            TimeCtrJSF._fn_hp()._fn_ajs(data.time * 1000);
            WmSocketJSF._fn_ho().lastHeartbeatTime = TimeCtrJSF._fn_hp().ServerTime
        }
    }

    _fn_aav() {

        return
        if (WmSocketJSF._fn_ho()._fn_pt() == false) {
            if (ServerCtrJSF._fn_hp().isLogin == true) {
                director.emit(GEvent.connect_fail)
                UiLayerService.instance._fn_ahg(Const.Dialogs.ConfirmPromptDialogController, {
                    content: "服务器连接已经断开，请确认重新登录！",
                    type: GPromptType.reconnect,
                    cb: () => {

                    }
                })
            }
        } else {
            if (ServerCtrJSF._fn_hp().isLogin == true) {
                this._fn_ni()
            }
        }
    }

    _fn_abu(data: any) {
        if (data.status == GNetConst.ResFail) {
            console.error("接受ws消息，保存失败--------", data)
        }
    }

    _fn_dj(key: string, val: any, isFirst: boolean = false) {
        if (!ServerCtrJSF._fn_hp().isLogin) {
            return;
        }
        if (!WmSocketJSF._fn_ho()._fn_pt()) {
            director.emit(GEvent.connect_fail)
            return
        }

        let data = {

            "cmd": GNetCmd.SaveUserRecord,
            "lang": "zh",
            "type": "single",
            "token": ServerCtrJSF._fn_hp().token,
            "key": key,
            "val": String(val),
            "dml": "add upd"
        }
        WmSocketJSF._fn_ho().send({ "data": data });
    }

    _fn_ajy() {
        if (!ServerCtrJSF._fn_hp().isLogin) {
            return;
        }
        if (!WmSocketJSF._fn_ho()._fn_pt()) {
            director.emit(GEvent.connect_fail)
            return
        }
        let data = {

            "cmd": GNetCmd.SaveUserRecordAll,
            "lang": "zh",
            "type": "single",
            "token": ServerCtrJSF._fn_hp().token,
            "allData": JSON.stringify({}),
        }
        WmSocketJSF._fn_ho().send({ "data": data });
    }

    _fn_ajz(jsonData: {}) {
        if (!ServerCtrJSF._fn_hp().isLogin) {
            return;
        }
        if (!WmSocketJSF._fn_ho()._fn_pt()) {
            director.emit(GEvent.connect_fail)
            return
        }
        let data = {
            "cmd": GNetCmd.SaveUserRecordMulti,
            "lang": "zh",
            "type": "single",
            "token": ServerCtrJSF._fn_hp().token,
            "multiData": JSON.stringify(jsonData),
            "ops": "upd"
        }
        WmSocketJSF._fn_ho().send({ "data": data });
    }

    _fn_ei(jsonData: {}) {
        if (!ServerCtrJSF._fn_hp().isLogin) {
            return;
        }
        if (!WmSocketJSF._fn_ho()._fn_pt()) {
            director.emit(GEvent.connect_fail)
            return
        }
        let data = {
            "cmd": GNetCmd.SaveUserRecordMulti,
            "lang": "zh",
            "type": "single",
            "token": ServerCtrJSF._fn_hp().token,
            "multiData": JSON.stringify(jsonData),
            "ops": "del"
        }
        WmSocketJSF._fn_ho().send({ "data": data });
    }


    _fn_di(key: string) {
        if (!ServerCtrJSF._fn_hp().isLogin) {
            return;
        }
        if (!WmSocketJSF._fn_ho()._fn_pt()) {
            director.emit(GEvent.connect_fail)
            return
        }
        let data = {

            "cmd": GNetCmd.SaveUserRecord,
            "lang": "zh",
            "type": "single",
            "token": ServerCtrJSF._fn_hp().token,
            "key": key,
            "val": "",
            "dml": "del"
        }

        WmSocketJSF._fn_ho().send({ "data": data });
    }

    _fn_ni() {
        let data = {
            "cmd": GNetCmd.Heartbeat,
            "lang": "zh",
            "token": ServerCtrJSF._fn_hp().token,
        }
        WmSocketJSF._fn_ho().send({ "data": data });
    }

}
