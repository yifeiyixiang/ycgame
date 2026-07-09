import { _decorator, Component, game, sys, } from 'cc';
const { ccclass, property } = _decorator;
import { WECHAT } from 'cc/env';

@ccclass
export default class GameMemoryStorage {



    static memory: any = {};
    static publicKey = "JmksO12Ldl60Lsk"
    static isEncrypt = false;

    public static clear() {
        this.memory = {}
    }

    public static getItem(key: string) {
        if (!this.memory.hasOwnProperty(key)) {

        }
        let res = "";






        res = sys.localStorage.getItem(key)!
        return res
    }

    public static setItem(key: string, value: string) {
        this.memory[key] = value + "";
        sys.localStorage.setItem(key, this._fn_em(value));
    }

    public static removeItem(key: string) {
        delete this.memory[key];
        sys.localStorage.removeItem(key);
    }

    public static len() {
        return Object.keys(this.memory).length;
    }

    public static keys() {
        let keys: string[] = [];

        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i)!;
            keys.push(key);
        }


        return keys;
    }

    public static _fn_em(content: string) {
        return content











    }

    public static _fn_ef(content: string) {
        return content


    }

}
