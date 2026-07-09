import { native } from "cc";
import { NATIVE, WECHAT } from "cc/env";

declare const wx: any;

export type RewardResult = 1 | 2 | 0;

export class GamePlatform {

    public static wechatRewardedVideoAdUnitId: string = "";

    private static rewardedVideoAd: any = null;
    private static currentRewardedVideoAdUnitId: string = "";

    private static _fn_na() {
        if (!WECHAT || typeof wx === "undefined") {
            return null;
        }

        return wx;
    }

    public static init() {
    }

    public static _fn_aja(eventName: string) {
        void eventName;
    }

    public static _fn_ahr(eventName: string, cb: (state: RewardResult) => void) {
        void eventName;

        const wxApi = this._fn_na();
        if (!wxApi) {
            cb(1);
            return;
        }

        const ad = this._fn_kd(wxApi);
        if (!ad) {
            cb(0);
            return;
        }

        let finished = false;
        let onClose: (res: any) => void = null!;
        let onError: (err: any) => void = null!;
        const _fn_et = (state: RewardResult) => {
            if (finished) {
                return;
            }

            finished = true;
            if (ad.offClose) {
                ad.offClose(onClose);
            }
            if (ad.offError) {
                ad.offError(onError);
            }
            cb(state);
        };

        onClose = (res: any) => {
            _fn_et(!res || res.isEnded ? 1 : 2);
        };
        onError = (err: any) => {
            console.warn("rewarded video error:", err);
            _fn_et(0);
        };

        if (ad.onClose) {
            ad.onClose(onClose);
        }
        if (ad.onError) {
            ad.onError(onError);
        }

        const _fn_agz = () => {
            try {
                const showTask = ad.show();
                if (showTask && showTask.catch) {
                    showTask.catch(() => {
                        const reloadTask = ad.load ? ad.load() : null;
                        if (reloadTask && reloadTask.then) {
                            reloadTask.then(() => ad.show()).catch(onError);
                        } else {
                            onError(null);
                        }
                    });
                }
            } catch (err) {
                onError(err);
            }
        };

        const loadTask = ad.load ? ad.load() : null;
        if (loadTask && loadTask.then) {
            loadTask.then(_fn_agz).catch(onError);
        } else {
            _fn_agz();
        }
    }

    private static _fn_kd(wxApi: any) {
        if (!wxApi.createRewardedVideoAd) {
            return null;
        }

        const adUnitId = (this.wechatRewardedVideoAdUnitId || "").trim();
        if (!adUnitId) {
            console.warn("wechatRewardedVideoAdUnitId is empty");
            return null;
        }

        if (this.rewardedVideoAd && this.currentRewardedVideoAdUnitId === adUnitId) {
            return this.rewardedVideoAd;
        }

        this.currentRewardedVideoAdUnitId = adUnitId;
        try {
            this.rewardedVideoAd = wxApi.createRewardedVideoAd({ adUnitId });
        } catch (err) {
            console.warn("create rewarded video failed:", err);
            this.rewardedVideoAd = null;
        }
        return this.rewardedVideoAd;
    }

    public static _fn_agw(params: any) {
        const wxApi = this._fn_na();
        if (!wxApi || !wxApi.shareAppMessage) {
            return;
        }

        if (typeof params === "string") {
            wxApi.shareAppMessage({ query: params });
            return;
        }

        wxApi.shareAppMessage(params || {});
    }

    public static _fn_ie() {
        const wxApi = this._fn_na();
        if (!wxApi) {
            return null;
        }

        const options = wxApi.getEnterOptionsSync ? wxApi.getEnterOptionsSync() : wxApi.getLaunchOptionsSync && wxApi.getLaunchOptionsSync();
        return options && options.query ? options.query : null;
    }

    public static _fn_mz(): string {
        const wxApi = this._fn_na();
        if (!wxApi || !wxApi.getAccountInfoSync) {
            return "";
        }

        try {
            const accountInfo = wxApi.getAccountInfoSync();
            return (accountInfo && accountInfo.miniProgram && accountInfo.miniProgram.appId) || "";
        } catch (err) {
            console.warn("get wechat appid failed:", err);
            return "";
        }
    }

    public static _fn_abi(): Promise<string> {
        const wxApi = this._fn_na();
        if (!wxApi || !wxApi.login) {
            return Promise.reject(new Error("WeChat login unavailable"));
        }

        return new Promise((resolve, reject) => {
            wxApi.login({
                success: (res: any) => {
                    if (res && res.code) {
                        resolve(res.code);
                    } else {
                        reject(new Error((res && res.errMsg) || "WeChat login response missing code"));
                    }
                },
                fail: reject,
            });
        });
    }

    public static _fn_abj(): Promise<any> {
        const wxApi = this._fn_na();
        if (!wxApi) {
            return Promise.reject(new Error("WeChat API unavailable"));
        }

        return new Promise((resolve, reject) => {
            const _fn_sg = (res: any) => {
                const info = res && res.userInfo ? res.userInfo : res;
                if (info && res && res.userInfo) {
                    const normalized: any = {};
                    for (const key in info) {
                        normalized[key] = info[key];
                    }
                    normalized.userInfo = res.userInfo;
                    resolve(normalized);
                    return;
                }

                resolve(info);
            };

            const _fn_abh = () => {
                const _fn_abf = () => {
                    if (!wxApi.createUserInfoButton || !wxApi.getSystemInfoSync) {
                        reject(new Error("WeChat user info button unavailable"));
                        return;
                    }

                    const sysInfo = wxApi.getSystemInfoSync();
                    const button = wxApi.createUserInfoButton({
                        type: "text",
                        text: "",
                        style: {
                            left: 0,
                            top: 0,
                            width: sysInfo.screenWidth,
                            height: sysInfo.screenHeight,
                            lineHeight: 60,
                            backgroundColor: "#00000000",
                            color: "#ffffff00",
                            textAlign: "center",
                            fontSize: 24,
                            borderRadius: 4,
                        },
                    });

                    button.onTap((res: any) => {
                        if (button.hide) {
                            button.hide();
                        }
                        if (button.destroy) {
                            button.destroy();
                        }

                        if (res && res.errMsg === "getUserInfo:ok") {
                            _fn_sg(res);
                        } else {
                            reject(res);
                        }
                    });
                    button.show();
                };

                const _fn_abg = () => {
                    if (wxApi.getUserInfo) {
                        wxApi.getUserInfo({
                            success: _fn_sg,
                            fail: _fn_abf,
                        });
                        return;
                    }

                    _fn_abf();
                };

                wxApi.getSetting({
                    success: (res: any) => {
                        if (res && res.authSetting && res.authSetting["scope.userInfo"]) {
                            _fn_abg();
                        } else {
                            _fn_abf();
                        }
                    },
                    fail: reject,
                });
            };

            if (wxApi.getUserProfile) {
                wxApi.getUserProfile({
                    desc: "Complete your game profile",
                    lang: "zh_CN",
                    success: _fn_sg,
                    fail: (err: any) => {
                        const errMsg = err && err.errMsg ? String(err.errMsg).toLowerCase() : "";
                        if (errMsg.indexOf("not supported") >= 0 || errMsg.indexOf("unsupported") >= 0) {
                            _fn_abh();
                            return;
                        }
                        reject(err);
                    },
                });
                return;
            }

            _fn_abh();
        });
    }

    public static _fn_ol(success: Function, fail: Function) {
        if (!NATIVE) {
            return;
        }


        // @ts-ignore
        window.videoRewardCallBack = () => success();
        // @ts-ignore
        window.videoFailCallBack = () => fail();
    }

    public static _fn_rx() {
        if (NATIVE) {
            native.reflection.callStaticMethod("com/cocos/game/AppActivity", "onClickGoogleSignIn", "(Ljava/lang/String;)V", "---google");
        }
    }

    public static _fn_rv() {
        if (NATIVE) {
            native.reflection.callStaticMethod("com/cocos/game/AppActivity", "onClickFacebookSignIn", "(Ljava/lang/String;)V", "---facebook");
        }
    }

    public static _fn_bt() {
    }

    public static _fn_co() {
        const wxApi = this._fn_na();
        if (!wxApi || !wxApi.getUpdateManager) {
            return;
        }

        const updateManager = wxApi.getUpdateManager();
        updateManager.onCheckForUpdate((res: any) => {
            console.log("wechat update check:", res && res.hasUpdate);
        });
        updateManager.onUpdateReady(() => {
            wxApi.showModal({
                title: "Update available",
                content: "Restart to apply the latest version?",
                success: (res: any) => {
                    if (res.confirm) {
                        updateManager.applyUpdate();
                    }
                },
            });
        });
        updateManager.onUpdateFailed(() => {
            console.warn("wechat update download failed");
        });
    }
}
