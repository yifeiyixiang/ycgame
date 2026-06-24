import { native } from "cc";
import { NATIVE, WECHAT } from "cc/env";

declare const wx: any;

export type RewardResult = 1 | 2 | 0;

export class GamePlatform {

    public static wechatRewardedVideoAdUnitId: string = "";

    private static rewardedVideoAd: any = null;
    private static currentRewardedVideoAdUnitId: string = "";

    private static getWxApi() {
        if (!WECHAT || typeof wx === "undefined") {
            return null;
        }

        return wx;
    }

    public static init() {
    }

    public static track(eventName: string) {
        void eventName;
    }

    public static showRewardVideo(eventName: string, cb: (state: RewardResult) => void) {
        void eventName;

        const wxApi = this.getWxApi();
        if (!wxApi) {
            cb(1);
            return;
        }

        const ad = this.getRewardedVideoAd(wxApi);
        if (!ad) {
            cb(0);
            return;
        }

        let finished = false;
        let onClose: (res: any) => void = null!;
        let onError: (err: any) => void = null!;
        const finish = (state: RewardResult) => {
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
            finish(!res || res.isEnded ? 1 : 2);
        };
        onError = (err: any) => {
            console.warn("rewarded video error:", err);
            finish(0);
        };

        if (ad.onClose) {
            ad.onClose(onClose);
        }
        if (ad.onError) {
            ad.onError(onError);
        }

        const showAd = () => {
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
            loadTask.then(showAd).catch(onError);
        } else {
            showAd();
        }
    }

    private static getRewardedVideoAd(wxApi: any) {
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

    public static share(params: any) {
        const wxApi = this.getWxApi();
        if (!wxApi || !wxApi.shareAppMessage) {
            return;
        }

        if (typeof params === "string") {
            wxApi.shareAppMessage({ query: params });
            return;
        }

        wxApi.shareAppMessage(params || {});
    }

    public static getLaunchQuery() {
        const wxApi = this.getWxApi();
        if (!wxApi) {
            return null;
        }

        const options = wxApi.getEnterOptionsSync ? wxApi.getEnterOptionsSync() : wxApi.getLaunchOptionsSync && wxApi.getLaunchOptionsSync();
        return options && options.query ? options.query : null;
    }

    public static requestWechatUserInfo(): Promise<any> {
        const wxApi = this.getWxApi();
        if (!wxApi) {
            return Promise.reject(new Error("WeChat API unavailable"));
        }

        return new Promise((resolve, reject) => {
            const normalize = (res: any) => {
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

            const requestByButton = () => {
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
                        normalize(res);
                    } else {
                        reject(res);
                    }
                });
                button.show();
            };

            const requestDirectly = () => {
                if (wxApi.getUserInfo) {
                    wxApi.getUserInfo({
                        success: normalize,
                        fail: requestByButton,
                    });
                    return;
                }

                requestByButton();
            };

            wxApi.getSetting({
                success: (res: any) => {
                    if (res && res.authSetting && res.authSetting["scope.userInfo"]) {
                        requestDirectly();
                    } else {
                        requestByButton();
                    }
                },
                fail: reject,
            });
        });
    }

    public static initNativeRewardCallbacks(success: Function, fail: Function) {
        if (!NATIVE) {
            return;
        }


        // @ts-ignore
        window.videoRewardCallBack = () => success();
        // @ts-ignore
        window.videoFailCallBack = () => fail();
    }

    public static loginGoogle() {
        if (NATIVE) {
            native.reflection.callStaticMethod("com/cocos/game/AppActivity", "onClickGoogleSignIn", "(Ljava/lang/String;)V", "---google");
        }
    }

    public static loginFacebook() {
        if (NATIVE) {
            native.reflection.callStaticMethod("com/cocos/game/AppActivity", "onClickFacebookSignIn", "(Ljava/lang/String;)V", "---facebook");
        }
    }

    public static checkH5DownUrl() {
    }

    public static checkWechatUpdate() {
        const wxApi = this.getWxApi();
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
