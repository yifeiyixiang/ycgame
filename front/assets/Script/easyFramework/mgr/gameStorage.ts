
import { Component, sys, _decorator, PREVIEW } from 'cc';
import { Const } from '../../config/Const';
import ServerCtrJSF from '../network/ServerCtrJSF';
import GameMemoryStorage from './GameMemoryStorage';
const { ccclass, property } = _decorator;



@ccclass('GameStorageJSF')
export class GameStorageJSF extends Component {

    private static _instance: GameStorageJSF;
    static get ins() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new GameStorageJSF();
        return this._instance;
    }


    public _fn_aft(isRobot:boolean=false){
        let val = isRobot?"1":"0"
        sys.localStorage.setItem("login_isRobot", val);
    }

    public get isRobot(){
        let n =  sys.localStorage.getItem("login_isRobot");
        return n=="1"
    }

    GameKey = Const.SaveHead;

    public  _fn_rb(key: string) {
        return this.GameKey + key;
    }

    public  _fn_jx(key: string) {
        return key.replace(GameStorage.GameKey + "_", "")
    }

     _fn_lo() {
        return GameMemoryStorage

    }

     _fn_hr(key: string, def: number = 0) {
        let n = this._fn_lo().getItem(this._fn_rb(key));













        if(key == Const.DataKeys.handIndex){
            return 100000;
        }
        if (n != null && n != "") {
            return Number(n);
        }
        return def;
    }

     _fn_aey(key: string, num: number) {
        key = this._fn_rb(key);
        this._fn_lo().setItem(key, num + "");
        if(!this.isRobot) ServerCtrJSF._fn_hp()._fn_aay(key, num);
    }

     _fn_afc(dataObj: { [key: string]: number }) {
        for (let key of Object.keys(dataObj)) {
            let val = dataObj[key];
            key = this._fn_rb(key);
            this._fn_lo().setItem(key, val + "");
        }
        if(!this.isRobot)  ServerCtrJSF._fn_hp()._fn_abn(dataObj);
    }

     _fn_afb(key: string, num: number) {
        key = this._fn_rb(key);
        this._fn_lo().setItem(key, num + "");
    }

     _fn_ft(key: string, def: boolean = false) {
        let n = this._fn_lo().getItem(this._fn_rb(key));
        if (n != null && n != "") {
            return Number(n) == 1 ? true : false;
        }
        return def;
    }

     _fn_aej(key: string, is: boolean) {
        key = this._fn_rb(key);
        let v = is ? 1 : 0;
        this._fn_lo().setItem(key, v + "");
        if(!this.isRobot) ServerCtrJSF._fn_hp()._fn_aay(key, v);
    }

     _fn_ael(dataObj: { [key: string]: boolean }) {
        for (let key of Object.keys(dataObj)) {
            let v = dataObj[key] ? 1 : 0;
            key = this._fn_rb(key);
            this._fn_lo().setItem(key, v + "");
        }
        if(!this.isRobot) ServerCtrJSF._fn_hp()._fn_abn(dataObj);
    }

     _fn_aek(key: string, is: boolean) {
        key = this._fn_rb(key);
        let v = is ? 1 : 0;
        this._fn_lo().setItem(key, v + "");
    }

     _fn_lq(key: string, def: string = '') {
        let n = this._fn_lo().getItem(this._fn_rb(key));
        if (n != null && n != "") {
            return n;
        }
        return def;
    }

     _fn_ls(key: string, def: string = '') {
        let n = sys.localStorage.getItem(this._fn_rb(key));
        if (n != null && n != "") {
            return n;
        }
        return def;
    }
     _fn_aez(key: string, num: number) {
        key = this._fn_rb(key);
        this._fn_lo().setItem(key, num + "");
    }
     _fn_hs(key: string, def: number = 0) {
        let n = sys.localStorage.getItem(this._fn_rb(key));
        if (n != null && n != "") {
            return Number(n);
        }
        return def;
    }
     _fn_agp(key: string, val: string) {
        sys.localStorage.setItem(this._fn_rb(key), val);
    }

     _fn_agq(key: string, val: string) {
        key = this._fn_rb(key);
        this._fn_lo().setItem(key, val);
        sys.localStorage.setItem(key, val);
    }

     _fn_ago(key: string, str: string) {
        key = this._fn_rb(key);
        this._fn_lo().setItem(key, str);
        if (key == GameStorage.GameKey + 'login_account') {
            return;
        }
        if(!this.isRobot) ServerCtrJSF._fn_hp()._fn_aay(key, str);
    }

    _fn_agr(dataObj: { [key: string]: string }) {
        for (let key of Object.keys(dataObj)) {
            let val = dataObj[key];
            key = this._fn_rb(key);
            this._fn_lo().setItem(key, val);
            if (key == GameStorage.GameKey + 'login_account') {
                continue;
            }
        }
        if(!this.isRobot) ServerCtrJSF._fn_hp()._fn_abn(dataObj);
    }

    _fn_io(key: string, def: any = null) {
        let n = this._fn_lo().getItem(this._fn_rb(key));
        if (n != null && n != "") {
            try {
                let json = JSON.parse(n);
                return json || def;
            } catch (error) {
                return def;
            }

        }
        return def;
    }

     _fn_afh(key: string, obj: any) {
        key = this._fn_rb(key);
        let v = JSON.stringify(obj);
        this._fn_lo().setItem(key, v);
        if(!this.isRobot)  ServerCtrJSF._fn_hp()._fn_aay(key, v);
    }

     _fn_afj(dataObj: { [key: string]: {} }) {
        let tmpObj:{ [key: string]: {} } = {}
        for (let key of Object.keys(dataObj)) {
            let v = JSON.stringify(dataObj[key]);
            key = this._fn_rb(key);
            this._fn_lo().setItem(key, v);
            tmpObj[key] = v;
        }
        if(!this.isRobot) ServerCtrJSF._fn_hp()._fn_abn(tmpObj);
    }

     _fn_ads(key: string, obj: any) {
        key = this._fn_rb(key);
        let v = JSON.stringify(obj);
        if(!this.isRobot) ServerCtrJSF._fn_hp()._fn_aay(key, v);
    }


     _fn_afi(key: string, obj: any) {
        key = this._fn_rb(key);
        let v = JSON.stringify(obj);
        this._fn_lo().setItem(key, v);
    }

     removeItem(key: string) {
        key = this._fn_rb(key);
        this._fn_lo().removeItem(key);
        if(!this.isRobot) ServerCtrJSF._fn_hp()._fn_aao(key);
    }

     _fn_aai(keyArr: string[]) {
        let tmpObj: any = {};
        keyArr.forEach((key) => {
            key = this._fn_rb(key);
            this._fn_lo().removeItem(key);
            tmpObj[key] = 0;
        });
        if(!this.isRobot) ServerCtrJSF._fn_hp()._fn_aaq(tmpObj);
    }

     clear() {


        let list: string[] = [];

        for (let i = 0; i < sys.localStorage.length; i++) {
            let key: string = sys.localStorage.key(i)!;
            if (key.indexOf(this.GameKey) >= 0 && key.indexOf('login') == -1 && key.indexOf(this.GameKey) >=0) {

                list.push(key);
            }
        }

        let keys = this._fn_lo().keys();
        for (let i = 0; i < keys.length; i++) {
            let key: string = keys[i];
            if (key.indexOf('login') == -1 && key.indexOf(this.GameKey) >=0) {

                list.push(key);
            }
        }

        for (let i = 0; i < list.length; i++) {
            const key = list[i];
            this._fn_lo().removeItem(key);

        }
        this._fn_lo().clear()



    }


     _fn_cu(gameKey: string) {
        let list: string[] = [];
        for (let i = 0; i < sys.localStorage.length; i++) {
            let key: string = sys.localStorage.key(i)!;
            if (key.indexOf(gameKey) != -1) {
                list.push(key);
            }
        }
        for (let i = 0; i < list.length; i++) {
            const key = list[i];
            this._fn_lo().removeItem(key);
            if(!this.isRobot) ServerCtrJSF._fn_hp()._fn_aao(key);
        }
    }

     _fn_lr(str: string) {

        let list: any[] = [];
        let list2: any[] = [];
        let keys = this._fn_lo().keys();
        for (let i = 0; i < keys.length; i++) {
            const key: string = keys[i];

            if (key.indexOf(str) != -1) {
                let n = this._fn_lo().getItem(key);

                list.push(n);
                list2.push(key)
            }
        }
        return { keys: list2, values: list };
    }

     _fn_ip(str: string) {

        let list: any[] = [];
        let list2: any[] = [];
        let keys = this._fn_lo().keys();
        str = this._fn_rb(str);
        for (let i = 0; i < keys.length; i++) {
            const key: string = keys[i];

            if (key.indexOf(str) == 0) {
                let n = this._fn_lo().getItem(key);

                let value = null;
                if (n != null && n != "") {
                    try {
                        let json = JSON.parse(n);
                        value = json || null;
                    } catch (error) {
                        value = null;
                    }
                }
                if (value) {
                    list.push(value);
                    let myKey = key.substring(this.GameKey.length, key.length);
                    list2.push(myKey);
                }
            }

        }
        return { keys: list2, values: list };
    }


     _fn_fi(isFirst: boolean = false) {
        let jsonData: any = {}
        for (let i = 0; i < sys.localStorage.length; i++) {
            const key: string = sys.localStorage.key(i)!;
            if (key.indexOf('login') != -1) {
                continue;
            }
            if (isFirst) {
                let oldKey = key;
                let newKey = key.replace('zzdl', GameStorage.GameKey);
                jsonData[newKey] = sys.localStorage.getItem(oldKey)
            }
            else {
                if (key.indexOf('zzdl') != -1) {
                    continue;
                }
                jsonData[key] = sys.localStorage.getItem(key)
            }




        }

        if (isFirst) {
            let spliceDatas: any = {};
            for (const key in jsonData) {
                if (Object.prototype.hasOwnProperty.call(jsonData, key)) {
                    const value = jsonData[key];




                    switch (key) {
                        case GameStorage.GameKey + '_sect_xtbls':
                            {
                                let datas = JSON.parse(value);

                                for (let i = 0; i < datas.length; i++) {
                                    const xtbl = datas[i];
                                    let data = {
                                        id: xtbl.id,
                                        star: xtbl.star,
                                        debris: xtbl.debris
                                    }

                                    spliceDatas[GameStorage.GameKey + '_SectXtbl_' + xtbl.id] = JSON.stringify(data);
                                }
                            }
                            break;
                        case GameStorage.GameKey + '_pack_equips':
                            {
                                let datas = JSON.parse(value);

                                for (let i = 0; i < datas.length; i++) {
                                    const equip = datas[i];
                                    let data = {
                                        id: equip.id,
                                        index: equip.index,
                                        level: equip.level,
                                        star: equip.star,
                                        partner: equip.partner,
                                        score: equip.score,
                                        skill_skr: equip.skill_skr,
                                        skill_skr_attr: equip.skill_skr_attr,
                                        skill_star: equip.skill_star,
                                        skill_star_attr: equip.skill_star_attr,
                                    };

                                    spliceDatas[GameStorage.GameKey + 'pack_equip_' + equip.index] = JSON.stringify(data);
                                }
                            }
                            break;
                        default:
                            {
                                sys.localStorage.setItem(key, value);
                            }
                            break;
                    }

                }
            }
            delete jsonData['zzdl_sect_xtbls'];
            delete jsonData['zzdl_pack_equips'];



            for (const key in spliceDatas) {
                const data = spliceDatas[key];
                jsonData[key] = data;
            }
        }

        return jsonData
    }

     async _fn_aeg(jsonData: any) {

        await this.clear();


        for (let key in jsonData) {
            await this._fn_lo().setItem(key, jsonData[key])
        }
    }

}

export const GameStorage = GameStorageJSF.ins