import { Label, _decorator } from "cc";
import { playerDataStore } from "../../game/comm/UserData";
import BaseView from "../mgr/BaseView";
import { BaseUiComponent } from "../mgr/comm";
import { UtilPub } from "./UtilPub";

const { ccclass, property } = _decorator;

export enum CDType {
    CDIneterVal = 0,
    CDCountdown = 1,
    CDFixTime = 2,
    CDCondition = 3,
}
@ccclass('CdComponent')
export class CdComponent extends BaseUiComponent {


    _cdTime = 0

    _key: string = ""
    _interval: number = 0

    _cb: Function = null!
    _cdType = 0;

    _step = 13;
    _startTime = 0
    _endTime = 0

    _format = 0

    _ignoreSec = false;

    start() {

    }

    setCD(type: CDType, key: string, interval: number, cb: Function = null!) {
        this._cdType = type
        this._key = key
        this._interval = interval
        this._cb = cb
        this._startTime = 0
        this._fn_cj()
    }

    _fn_aen(key: string, startTime: number, endTime: number, cb: Function = null!) {
        this._cdType = CDType.CDFixTime
        this._key = key
        this._endTime = endTime
        this._cb = cb
        this._startTime = startTime
        this._fn_cj()
    }

    setIgnoreSec(isIgnore: boolean) {
        this._ignoreSec = isIgnore
        return this
    }

    _fn_cj() {
        if (this._cdType == CDType.CDIneterVal) {
            this._cdTime = playerDataStore._fn_ht(this._key, this._interval)
            if (this._ignoreSec) {
                this.node.getComponent(Label)!.string = UtilPub._fn_gx(this._cdTime * 1000) + ""
            } else {
                this.node.getComponent(Label)!.string = UtilPub._fn_gw(this._cdTime * 1000) + ""
            }
        } else if (this._cdType == CDType.CDCountdown) {
            let num = playerDataStore._fn_bo(this._key, this._interval, this._startTime)
            if (num[0] > 0) {
                if (this._cb) {
                    this._cb(num[0])
                }
            }
            this._cdTime = num[1]
            this.node.getComponent(Label)!.string = UtilPub._fn_air(this._cdTime)
        } else if (this._cdType == CDType.CDCondition) {
            let num = playerDataStore._fn_bz(this._key, this._interval * 60 * 1000)
            this._cdTime = num
            if (this._ignoreSec) {
                this.node.getComponent(Label)!.string = UtilPub._fn_gx(this._cdTime)
            } else {
                this.node.getComponent(Label)!.string = UtilPub._fn_gw(this._cdTime)
            }
        } else {
            let num = playerDataStore._fn_br(this._key, this._endTime)
            if (num <= 0) {
                if (this._cb) {
                    this._cb()
                }
                num = 0
            }
            this._cdTime = num
            if (this._ignoreSec) {
                this.node.getComponent(Label)!.string = UtilPub._fn_gx(this._cdTime * 1000)
            } else {
                this.node.getComponent(Label)!.string = UtilPub._fn_gw(this._cdTime * 1000)
            }
        }
    }

    clearCD() {
        this._cdTime = 0
        this.node.getComponent(Label)!.string = ""
        playerDataStore._fn_cv(this._key)
        this._cb = null!
    }

    update() {

        if (this._cdTime > 0) {
            if (this._step > 0) {
                this._step--
                return
            }
            this._step = 13
            this._fn_cj()
        } else {
            if (this._cb) {
                this._cb(1)
                this._cb = null!
            }
        }
    }

}