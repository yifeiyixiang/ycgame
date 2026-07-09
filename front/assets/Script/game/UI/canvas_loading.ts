import { assetManager, director, EditBox, find, game, Game, Label, ProgressBar, tween, Tween, _decorator,PREVIEW } from 'cc';
import { HTML5, NATIVE, WECHAT } from 'cc/env';
import { Const } from "../../config/Const";
import { AudioPlaybackService } from "../../easyFramework/mgr/audioManager";
import BaseView from "../../easyFramework/mgr/BaseView";
import { UiLayerService } from '../../easyFramework/mgr/uiManager';
import { GNetCmd } from '../../easyFramework/network/conf';
import CronCtrJSF from '../../easyFramework/network/CronCtrJSF';
import ServerCtrJSF from '../../easyFramework/network/ServerCtrJSF';
import TableDataService from '../../easyFramework/other/tables';
import { UtilPub } from '../../easyFramework/utils/UtilPub';
import { RewardVideoManager } from '../../Util/RechargeManager';
import { mergeBoardStateStore } from '../comm/mergeBoardModel';
import { playerDataStore } from '../comm/UserData';
import GD from '../../config/GD';
import { WmSocketJSF } from '../../easyFramework/network/WmSocketJSF';
import { Notifications } from '../../easyFramework/mgr/notifications';
import { GameHttpClient } from '../../../typeScript/net/HttpClient';
import { GamePlatform } from '../platform/GamePlatform';
const { ccclass, property } = _decorator;

@ccclass('canvas_loading')
export class LoadingCanvasController extends BaseView {
    get versionTxt() { return find("loading/page/version", this.node)!.getComponent(Label)! }
    get title() { return find("loading/page/title", this.node)! }

    get bar() { return find("loading/page/Body/progress", this.node)!.getComponent(ProgressBar)! }
    get txt() { return find("loading/page/Body/loadingTxt", this.node)!.getComponent(Label)! }

    get login() { return find("loading/page/login", this.node)! }
    get account() { return find("loading/page/login/account", this.node)!.getComponent(EditBox)! }
    get loginBtn() { return find("loading/page/login/loginBtn", this.node)! }

    get shiling() { return find("shiling", this.node) }
    get levebg() { return find("levebg", this.node) }


    curIdx: number = 0

    private isLoaded: boolean = false;
    aniTween: Tween<any> = new Tween()
    aniCartoon: Tween<any> = new Tween()
    private arr: string[] = []
    isShowLoginWin: boolean = false
    isEnterGame: boolean = false
    isStartLogin: boolean = false
    cnt: number = 0
    curProgress: number = 0
    lastProgress: number = 0
    timeProgress: number = 0

    isCanEnter:boolean = false;
    wxUid:string = "";

    onLoad() {
        console.log("-----------loading 场景--加载游戏--onLoad---------")
        this.on(GD.event.loadAll, this.loadAll, this)
        director.off(GNetCmd.GetRegionData.toString(), this._fn_uw);
        director.off(GNetCmd.UniqueLogin.toString(), this._fn_uw);
        director.off(GNetCmd.ReqWxSession.toString(), this._fn_uw);

        director.on(GNetCmd.GetRegionData.toString(), this._fn_uw);
        director.on(GNetCmd.UniqueLogin.toString(), this._fn_uw);
        director.on(GNetCmd.ReqWxSession.toString(), this._fn_uw);
        this.bindButton(this.loginBtn, this._fn_ru)

        this.levebg!.active = false

        this.bindButton(this.shiling!, () => {
            this.levebg!.active = true
        })
        this.bindButton(find("btnClose", this.levebg!)!, () => {
            this.levebg!.active = false
        })

        this.bindButton(find("loading/page/login/loginGoogle", this.node)!, this._fn_rt)
        this.bindButton(find("loading/page/login/loginFaceBook", this.node)!, () => {
            RewardVideoManager._fn_rw()
        })

        this.bindButton(find("loading/privacyLabel", this.node)!, () => {
            UiLayerService.instance._fn_ahg(Const.Dialogs.PrivacyDialog)
        })

        game.on(Game.EVENT_HIDE, () => {
            console.log("-------------暂停游戏")
            game.pause();
        });
        game.on(Game.EVENT_SHOW, () => {
            console.log("-------------恢复游戏")
            game.resume();
        });


        assetManager.downloader.maxConcurrency = 20


        this.versionTxt.string = "版本号：" + Const.version


        AudioPlaybackService.instance._fn_oj()
        CronCtrJSF._fn_hp().init()


        if (HTML5) {
            this.account.string = ServerCtrJSF._fn_hp().Account
        }
        this.account.string = ServerCtrJSF._fn_hp().Account



        this.isLoaded = false
        this.isEnterGame = false
        this.cnt = 0
        this.bar.progress = 0
        this._fn_rn();
        RewardVideoManager._fn_oh()
        GamePlatform._fn_co()
        if (NATIVE) {
            console.log(" Window.toastInfo")

            //@ts-ignore
            window.toastInfo = (str: string) => {
                console.log("AppActivity toastInfo= ", str)
                this._fn_aiu(str)
            }

            //@ts-ignore
            window.Login = (str: string) => {

                console.log("AppActivity = ", str)
                ServerCtrJSF._fn_hp()._fn_abk(this.account.string.trim())
            }

        }

        GamePlatform._fn_bt()
    }

    start() {

        let url = window.location.href;






        let queryString = url.split('?')[1];


        let params:any = {};
        if (queryString){
            queryString.split('&').forEach(function(pair) {
                let keyValue = pair.split('=');
                let key = decodeURIComponent(keyValue[0]);
                let value = decodeURIComponent(keyValue[1] || '');
                params[key] = value;
            });
        }

        this.wxUid = params["uid"];



        console.log("-----------loading 场景--加载游戏--start---------")

        GamePlatform.init()
        GamePlatform._fn_aja("进入登录")
    }

    onEnable() {
        console.log("-----------loading 场景--加载游戏--onEnable---------")
    }


    _fn_rt() {
        console.log(" Window.loginBtnGoogle")
        RewardVideoManager._fn_ry()
    }


    _fn_ru() {







        if (ServerCtrJSF._fn_hp()._fn_qe() == true) {
            Notifications.emit(GD.event.loadAll, () => {
                ServerCtrJSF._fn_hp().isLoadAll = true
            })
        } else {
            ServerCtrJSF._fn_hp().isLoadAll = true
        }
        ServerCtrJSF._fn_hp().isLoadAll = true
        ServerCtrJSF._fn_hp().isLogin = true;

    }

    _fn_uw(value: any) {
        ServerCtrJSF._fn_hp()._fn_rz(value)
    }

    _fn_rf() {

        this.bar.progress = 0
        this.timeProgress = 1
        let per = 0.7 / this.arr.length
        for (let i = 0; i < this.arr.length; i++) {
            console.log("!!!!!!!!!!!!----loadPkg--", this.arr[i])
            this.txt.string = `加载资源包${i}...`
            UtilPub.loadBundle(this.arr[i]).then(() => {
                this.bar.progress += per
                this.curProgress = this.bar.progress + per
                this.cnt += 1
                if (this.arr[i] == "d1audio") {
                    UtilPub._fn_re("d1audio").then(() => { this.cnt += 1 })
                } else if (this.arr[i] == "json") {
                    TableDataService.ins()._fn_rs().then(() => { this.cnt += 1 })
                }
            })
        }
    }

    async _fn_rn() {
        this.arr = [...Const.bundlesAhead1]



        this.cnt = 0
        this._fn_rf()
    }

    loadAll(cb: Function) {
        this.arr = [...Const.bundlesAhead2, ...Const.bundlesGame]
        this._fn_rf()
        cb && cb()
    }


    _fn_xn() {
        return new Promise<void>((resolve, reject) => {
            director.preloadScene('game', (err) => {
                if (!err) {
                    resolve()
                } else {
                    reject()
                }
            });
        })
    }

    private _fn_en() {

        director.off(GNetCmd.GetRegionData.toString());
        director.off(GNetCmd.UniqueLogin.toString());
        director.off(GNetCmd.ReqWxSession.toString());
        this.bar.progress = 0.8
        this.curProgress = 1
        this.timeProgress = 5
        this.txt.string = `正在为您设置场景...`


        let self = this
        assetManager.loadBundle("scene", (err, bundle) => {
            if (err) return;

                self._fn_xn().then(() => {
                self.bar.progress = 1
                self.scheduleOnce(() => {
                    director.loadScene("game");
                }, 0.1)
            })
        });



    }

    async loginClick(){
        if (this.isStartLogin) {
            return;
        }

        this.isStartLogin = true;
        let loginCode = this.wxUid || "";
        let clientAppId = "";
        let clientEnv = WECHAT ? "wechat" : (NATIVE ? "native" : "other");
        let loginNickname = "";
        let loginAvatar = "";

        try {
            if (WECHAT) {
                clientAppId = GamePlatform._fn_mz();
                const userInfo = await GamePlatform._fn_abj();
                loginNickname = ((userInfo && (userInfo.nickName || userInfo.nickname)) || "").trim();
                loginAvatar = ((userInfo && (userInfo.avatarUrl || userInfo.avatar)) || "").trim();
                loginCode = await GamePlatform._fn_abi();
            } else if (!loginCode) {
                loginCode = "dev:" + (this.account.string.trim() || "preview");
                loginNickname = (playerDataStore.roleName || "").trim();
                loginAvatar = (playerDataStore.roleAvatar || "").trim();
            }
        } catch (err) {
            console.warn("wechat auth/login failed:", err);
            this.isStartLogin = false;
            this._fn_aiu(WECHAT ? "wechat auth/login failed" : "login failed");
            return;
        }

        GameHttpClient._fn_ho()._fn_adq(loginCode, loginNickname, loginAvatar, ()=>{
            this.isCanEnter = true;

            find("loading/page/loginBtn2", this.node).active = false;
            this.bar.node.active = true;
            this.txt.node.active = true;
        }, (des:string)=>{
            this.isStartLogin = false;
            this._fn_aiu(des)
        }, clientAppId, clientEnv);
    }

    update(deltaTime: number) {
        this.login.active = false
        if (this.cnt >= this.arr.length + 2) {
            this.cnt = -99999
            console.log("------全部资源加载完成------")
            this.isLoaded = false

            UiLayerService.instance._fn_ahg(Const.Dialogs.FloatingTipPanelController)





        }

        if (this.isCanEnter && ServerCtrJSF._fn_hp().isLogin && ServerCtrJSF._fn_hp().isLoadAll && this.isEnterGame == false) {
            console.log("------进入游戏------")
            this.isEnterGame = true
            this._fn_en()
        } else {

            this.calTime += deltaTime
            if (this.calTime > 2) {
                this.calTime = 0


                    if (true|| WECHAT) {
                        this._fn_ru();
                    }

            }
        }

        if (this.curProgress != this.lastProgress) {
            this.lastProgress = this.curProgress
            this.aniTween.stop()
            this.aniTween = tween(this.bar).to(2, { progress: this.curProgress }).start()
        }
    }
}
