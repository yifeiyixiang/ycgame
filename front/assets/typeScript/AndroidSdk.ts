import { _decorator, Component, native, Node, System } from 'cc';
import { GameRuntimeData, PopupDialogMode } from './gameData';
import { HTML5, JSB, NATIVE } from 'cc/env';
import { GameHttpClient } from './net/HttpClient';
import { GameEventManager } from './EventManger';
const { ccclass, property } = _decorator;

@ccclass('AndroidSdk')
export class NativeSdkBridge  {
    public static isLocal = false;

    public static isAndroid =  NATIVE

    public static  callBack:Function= null;

    public static index:number = -1;

    public static gear:number = -1;

    public static isTempTest:boolean = false;

    public static isPingbi:boolean = false;

    public static isAd:boolean = true;

    public static isPlaying:boolean = false;
    public static playAd(call:Function = null, gear:number = -1, index:number = -1){

        if (this.isPlaying){
            return;
        }
        this.index = index;
        this.gear = gear;
        setTimeout(() =>{
            this.isPlaying = false;
        }, 2000);
        this.isPlaying = true;
        this.callBack = call;
        if (NativeSdkBridge.isAndroid && NativeSdkBridge.isAd){
            native.bridge.sendToNative("playAd", "defaultAdUrl");
        }else{
            this._fn_akd("playAd", null);
        }
    }

    public static _fn_ww(index:number){



    }

    public static _fn_wo(type:number){

    }


     public static wxLogin() {
        console.log("wxLogin");
        if (NativeSdkBridge.isAndroid){
            native.bridge.onNative = (animationName: string, code: string | null):void=>{
                this._fn_akd(animationName, code);
                return;
            }
            native.bridge.sendToNative("login", "defaultAdUrl");
        }else{
            GameHttpClient._fn_ho()._fn_adq();
        }
    }

    public static _fn_akd(usrName:string, errCode:string) {
        return;
        if (usrName == "login"){
            console.log("wxLoginResultcode=" + errCode)
            GameHttpClient._fn_ho()._fn_adq()
        }

        else if (usrName == "playAd"){

            console.log("usrName  =" + usrName)
            GameRuntimeData.saveData.playAdNum++;
            if (this.index >= 0 && this.index <= 2){
                GameRuntimeData.saveData.arrNumDJ[this.index]++;
            }
            if(this.gear >= 1 && this.gear <= 3){
                GameRuntimeData.saveData.taskAdArr[this.gear - 1]++;
            }
            GameEventManager.eventTarget.emit(GameEventManager.EEventName.REFRESH_GAME);

            if(this.callBack){
                this.callBack();
            }

            this.callBack = null;
            this.index = -1;
            this.gear = -1;
        }

        else if (usrName == "showTip"){
            GameEventManager.eventTarget.emit(GameEventManager.EEventName.SHOW_TIP, "广告错误" + errCode);
        }
    }
}

