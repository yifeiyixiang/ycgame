import { native, _decorator } from "cc";
import { NATIVE } from "cc/env";
import GD from "../config/GD";
import { Const } from "../config/Const";
import { Notifications } from "../easyFramework/mgr/notifications";
import { GamePlatform } from "../game/platform/GamePlatform";

const { ccclass } = _decorator;

@ccclass("RechargeManager")
export class RewardVideoManager {
    private static videoCallBack: Function | null = null;
    private static failCallBack: Function | null = null;

    public static _fn_oh() {
        GamePlatform._fn_ol(() => {
            this.videoCallBack && this.videoCallBack();
            this._fn_db();
        }, () => {
            this.failCallBack && this.failCallBack();
            this._fn_db();
            Notifications.emit(GD.event.showToast, "看完广告才能获得奖励");
        });
    }

    public static _fn_ry() {
        GamePlatform._fn_rx();
    }

    public static _fn_rw() {
        GamePlatform._fn_rv();
    }

    public static _fn_yo() {
        if (NATIVE) {
            native.reflection.callStaticMethod("com/cocos/game/BillingClientClass", "onClickGooglePlay", "(Ljava/lang/String;)V", "---recharge");
        }
    }

    public static _fn_ahy(event: string, callBack: Function, failCb: Function | null = null) {
        this.videoCallBack = callBack;
        this.failCallBack = failCb;

        if (Const.isTest) {
            callBack && callBack();
            this._fn_db();
            return;
        }

        GamePlatform._fn_ahr(event, (st: number) => {
            if (st == 1) {
                callBack && callBack();
                this._fn_db();
                return;
            }

            if (st == 2) {
                Notifications.emit(GD.event.showToast, "看完广告才能获得奖励！");
            } else {
                Notifications.emit(GD.event.showToast, "暂无广告，请稍后再试！");
            }

            failCb && failCb();
            this._fn_db();
        });
    }

    private static _fn_db() {
        this.videoCallBack = null;
        this.failCallBack = null;
    }
}
