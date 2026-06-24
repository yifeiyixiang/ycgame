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

    public static initManager() {
        GamePlatform.initNativeRewardCallbacks(() => {
            this.videoCallBack && this.videoCallBack();
            this.clearVideoCallbacks();
        }, () => {
            this.failCallBack && this.failCallBack();
            this.clearVideoCallbacks();
            Notifications.emit(GD.event.showToast, "看完广告才能获得奖励");
        });
    }

    public static LoginGoole() {
        GamePlatform.loginGoogle();
    }

    public static LoginFacebook() {
        GamePlatform.loginFacebook();
    }

    public static RechargeTest() {
        if (NATIVE) {
            native.reflection.callStaticMethod("com/cocos/game/BillingClientClass", "onClickGooglePlay", "(Ljava/lang/String;)V", "---recharge");
        }
    }

    public static showVideo(event: string, callBack: Function, failCb: Function | null = null) {
        this.videoCallBack = callBack;
        this.failCallBack = failCb;

        if (Const.isTest) {
            callBack && callBack();
            this.clearVideoCallbacks();
            return;
        }

        GamePlatform.showRewardVideo(event, (st: number) => {
            if (st == 1) {
                callBack && callBack();
                this.clearVideoCallbacks();
                return;
            }

            if (st == 2) {
                Notifications.emit(GD.event.showToast, "看完广告才能获得奖励！");
            } else {
                Notifications.emit(GD.event.showToast, "暂无广告，请稍后再试！");
            }

            failCb && failCb();
            this.clearVideoCallbacks();
        });
    }

    private static clearVideoCallbacks() {
        this.videoCallBack = null;
        this.failCallBack = null;
    }
}
