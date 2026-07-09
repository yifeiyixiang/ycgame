import { _decorator } from "cc";
import { Const } from "../../config/Const";
import { GameStorage } from "../../easyFramework/mgr/gameStorage";
import TimeCtrJSF from "../../easyFramework/network/TimeCtrJSF";

const { ccclass } = _decorator;
export enum SignState {
    canReceive = 0,
    paseReceive = 1,
    receiced = 2,
    unArrTime = 3,

}

export enum SignAction {
    unReceive = 0,
    receiced = 1,
}
export class SignUtil {
    private static _instance: SignUtil = null!

    public static _fn_ho() {
        if (this._instance == null) {
            this._instance = new SignUtil()
        }
        return this._instance;
    }


    public _fn_li(day: number) {
        let receive = GameStorage._fn_hr(Const.DataKeys.signdayReceive + day, SignAction.unReceive)
        if (day > 1) {
            if (receive == SignAction.receiced) {
                return SignState.receiced
            } else {
                let signFistTime = GameStorage._fn_hr(Const.DataKeys.signdaytime + "1", 0)
                if (signFistTime <= 0) {
                    return SignState.unArrTime
                } else {
                    let curTime = Math.floor(TimeCtrJSF._fn_hp().ServerTime)
                    let curDayTime = signFistTime + 24 * 60 * 60 * 1000 * (day - 1)
                    if (TimeCtrJSF._fn_qp(curDayTime, curTime)) {
                        return SignState.canReceive
                    } else {
                        if (curDayTime < curTime) {
                            return SignState.paseReceive
                        } else {
                            return SignState.unArrTime
                        }
                    }
                }
            }
        } else {
            if (receive == SignAction.unReceive) {
                return SignState.canReceive
            } else {
                return SignState.receiced
            }
        }
    }

    public _fn_gn() {
        let signFistTime = GameStorage._fn_hr(Const.DataKeys.signdaytime + "1", 0)
        if (signFistTime <= 0) {
            return 1
        } else {
            let curTime = Math.floor(TimeCtrJSF._fn_hp().ServerTime)
            for (let index = 1; index <= 7; index++) {
                let curDayTime = signFistTime + 24 * 60 * 60 * 1000 * (index - 1)
                if (TimeCtrJSF._fn_qp(curDayTime, curTime)) {
                    return index
                }
            }
        }
        return 0
    }

    public _fn_aib(day: number) {
        GameStorage._fn_aey(Const.DataKeys.signdayReceive + day, SignAction.receiced)
        let curTime = Math.floor(TimeCtrJSF._fn_hp().ServerTime)
        GameStorage._fn_aey(Const.DataKeys.signdaytime + day, curTime)
    }


}