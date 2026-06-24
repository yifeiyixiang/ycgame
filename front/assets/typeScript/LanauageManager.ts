import { _decorator, Component, EventTarget, Node, resources, Sprite, SpriteFrame } from 'cc';
import { AdRewardCounterRecord, WalletCoinType, GameRuntimeData, PetProfileRecord, TaskProgressRecord } from './gameData';
import { GameEventManager } from './EventManger';
import { playerDataStore } from '../Script/game/comm/UserData';
const { ccclass, property } = _decorator;

@ccclass('LanauageManager')
export class LanguageContentManager {

    public static languageType:number = 1;

    public static popupLabelType:number = 1;

    public static popupCommonlType:number = 1;

    public static isInitData:boolean = false;

    public static isLoad:boolean = false;


    public static taskConfig = []
    public static languageConfig = []

    public static petConfigs = []

    public static petCatConfig = []

    public static petDogConfig = []


    public static itemConfigs = []

    public static taskConfigs = []

    public static taskLineConfigs = []
    public static jiabnConfig = []


    public static checkConfigs = []

    public static giftConfigs = []

    public static shopTileNames = []
    public static shopCateNames = []

    public static itemBaseUrl = "image/itemImg/"

    public static giftBaseUrl = "image/gift/"

    public static petBaseUrl = "image/pet/"



    public static getConfigDataById(id:number, config:any[]){
        if (!config){
            return null;
        }
        for (let index = 0; index < config.length; index++) {
            let element = config[index];
            if (element && element.id == id){
                if (element.reward && typeof element.reward === "string"){
                    element.reward = JSON.parse(element.reward);
                }
                if (element.reward_num && typeof element.reward_num === "string"){
                    element.reward_num = JSON.parse(element.reward_num);
                }
                if (element.val_type && typeof element.val_type === "string"){
                    element.val_type = JSON.parse(element.val_type);
                }
                if (element.val_num && typeof element.val_num === "string"){
                    element.val_num = JSON.parse(element.val_num);
                }
                return element;
            }
        }
        return null
    }


        public static setRewardConfig(element:any){
            if (!element){
                return null;
            }
            if (element.reward && typeof element.reward === "string"){
                element.reward = JSON.parse(element.reward);
            }
            if (element.reward_num && typeof element.reward_num === "string"){
                element.reward_num = JSON.parse(element.reward_num);
            }
            return element;
        }

    public static getPetConfigsByType(petType:PetSpeciesType){
        if (LanguageContentManager.petCatConfig.length == 0){
            for (let index = 0; index < this.petConfigs.length; index++) {
                const element:PetConfigRecord = this.petConfigs[index];
                if (element.types == PetSpeciesType.cat){
                    LanguageContentManager.petCatConfig.push(element);
                }else{
                    LanguageContentManager.petDogConfig.push(element);
                }
            }
        }

        if (petType == PetSpeciesType.cat){
            return LanguageContentManager.petCatConfig;
        }else{
            return LanguageContentManager.petDogConfig;
        }
    }


    public static getDesStrById(id:number){
        if (id == 0){
            return "";
        }
        let lang = LanguageContentManager.languageConfig[id-1];
        let str:string = "";
        if (lang){
            if (LanguageContentManager.languageType == 1){
                str = lang.english;
            }
            else if (LanguageContentManager.languageType == 2){
                str = lang.chinese;
            }
        }
        return str.replace(/\\n/g, "\n");
    }

    public static getShopItemData(id:number){
        return LanguageContentManager.getConfigDataById(id, this.itemConfigs);
    }

    public static getItemNumById(id:number):number{
        for (let index = 0; index < GameRuntimeData.saveData.backList.length; index++) {
            let element = GameRuntimeData.saveData.backList[index];
            if (element.id == id){
                return element.num;
            }
        }
        return 0;
    }

    public static getTaskDataById(id:number):any{
        for (let index = 0; index < LanguageContentManager.taskConfig.length; index++) {
            let element = LanguageContentManager.taskConfig[index];
            if (element.id == id){
                return element;
            }
        }
        return null;
    }


    public static loadImage(url: string, spr:Sprite) {
        if (url == "" || url == undefined || url == LanguageContentManager.itemBaseUrl){
            return;
        }
        resources.load(url + "/spriteFrame", SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.error(err);
                return;
            }
            spr.spriteFrame = spriteFrame;
        });
    }


    public static loadImageById(id:number, spr:Sprite) {
        let itemCfg:ItemConfigRecord = LanguageContentManager.getConfigDataById(id, this.itemConfigs);
        if (!itemCfg){
            console.log("dont have:  " + id);
        }
        let url = LanguageContentManager.itemBaseUrl + itemCfg.iconUrl;
        LanguageContentManager.loadImage(url, spr);
    }

    public static roundToTwoDecimals(num: number, num2:number = 100): number {
        return Math.floor(num * num2) / num2;
    }

    public static getCoinNumString(coinNum:number = 0, type:number = 1){
        let num = coinNum;
        if (num == 0){
            num = GameRuntimeData.saveData.coin;
        }
        let unitIndex = 0;

        const units = ['', 'w', 'm', 'b', 't', 'q'];
        let num1 = 1000;
        if (num > 9999.99){
            unitIndex = 1
            num1 = 10000;
        }else{
            return LanguageContentManager.roundToTwoDecimals(num, type == 2?1000:100).toString()
        }
        num = Number(LanguageContentManager.roundToTwoDecimals(num/num1).toString());
        let  goldNum = num.toFixed(2)
        return goldNum + units[unitIndex];
    }

    public static getCoinNumByType(type:number){
        let num:number = 0
        if (type == WalletCoinType.coin1){
            num = GameRuntimeData.saveData.coin2;
        }
        else if (type == WalletCoinType.coin2){
            num = GameRuntimeData.saveData.coin;
        }
        else if (type == WalletCoinType.coin3){
            num = GameRuntimeData.saveData.coin3;
        }
        return num;
    }


    private static getTaskInfoState(id:number, isLine:boolean =false):TaskProgressRecord{
        if (isLine){
            for (let index = 0; index < GameRuntimeData.severData.taskMainStatetList.length; index++) {
                const element = GameRuntimeData.severData.taskMainStatetList[index];
                if (element.id == id){
                    return element;
                }
            }

        }else{
            for (let index = 0; index < GameRuntimeData.severData.taskStatetList.length; index++) {
                const element = GameRuntimeData.severData.taskStatetList[index];
                if (element.id == id){
                    return element;
                }
            }
        }

        return null;
    }


    public static getTaskState(id:number, isLine:boolean =false):number{
        let data:TaskProgressRecord = LanguageContentManager.getTaskInfoState(id, isLine);
        if (!data){
            return 1;
        }
        if (data.reward){
            return 3;
        }
        if (data.done_num >= data.task_num){
            return 2;
        }
        return 1;
    }

    public static playSound(index:number = 0){
        GameEventManager.eventTarget.emit(GameEventManager.EEventName.PLAY_SOUND_INDEX, index)
    }

    public static truncateString(str: string, maxLength: number = 15, type:number = 1): string {
        let showStr:string = "";
        if (!str){
            return "";
        }
        if (str.length <= maxLength) {
            return str;
        }
        if (type == 1){
            showStr = str.substring(0, maxLength - 3) + '...';
        }else if (type == 2){
            showStr = str.substring(0, 4) + '...' + str.slice(-4);
        }
        return showStr
    }

    public static copyText(str:string){
        LanguageContentManager.playSound();
        if (navigator.clipboard) {
            navigator.clipboard.writeText(str)
                .then(() => {
                })
                .catch(err => {
                });
        }
        try {
            var successful = document.execCommand(str);
            var msg = successful ? 'successful' : 'unsuccessful';
            GameEventManager.eventTarget.emit(GameEventManager.EEventName.SHOW_TIP, ("copy success"))
        } catch (err) {
            GameEventManager.eventTarget.emit(GameEventManager.EEventName.SHOW_TIP, ("copy fail"))
        }
    }


    public static getShowCharacterCon(petData:PetProfileRecord):string{
        let str:string = ""
        for (let index = 0; index < petData.characteristics.length; index++) {
            const element = petData.characteristics[index];
            if (element){
                if (str == ""){
                    str = element.context;
                }else{
                    str = str + "," + element.context;
                }
            }
        }
        if (str == ""){
            str = "Not have"
        }
        return str;
    }


    public static getPetValueSumCon(valType:ItemValType):[number, number]{
        let curNum:number = 0;
        let curSum:number = 0;
        for (let index = 0; index < GameRuntimeData.severData.petList.length; index++) {
            const element:PetProfileRecord = GameRuntimeData.severData.petList[index];
            if (element){
               if (valType == ItemValType.FoodBowl){
                    curNum += element.satiety;
                    curSum += element.satietyFull;
               }
               else if (valType == ItemValType.WaterBowl){
                    curNum += element.thirsty;
                    curSum += element.thirstyFull;
               }
            }
        }

        return [curNum, curSum];
    }


    public static getItemValByType(item:ItemConfigRecord, valType:number){

        let array = JSON.parse(item.val_type.toString());
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if (element == valType){
                let numArr = JSON.parse(item.val_num.toString());
                return numArr[index];
            }

        }
        return 0;
    }


    public static getItemCfgsByType(types:number){
        let cfgs:ItemConfigRecord[] = [];
        for (let index = 0; index < this.itemConfigs.length; index++) {
            const element:ItemConfigRecord = LanguageContentManager.setRewardConfig(this.itemConfigs[index]);
            if (element.types == types){
                cfgs.push(element);
            }
        }
        return cfgs;
    }




    public static getAdCountById(propId:number):number{
        for (let index = 0; index < playerDataStore.adProps.length; index++) {
            let element = playerDataStore.adProps[index];
            if (element && element.prop_id == propId){
                return element.ad_count;
            }
        }
        return 0
    }
}

export enum PetSpeciesType{
    cat = 0,
    dog = 1,
}


export class PetConfigRecord{

    id:number = 0;

    types:number = 0;

    species:string = "Cat";

    name:string = "";

    variety:string = "";

    stage:string;

    iconUrl:string;






}


export class ItemConfigRecord{

    id:number;

    types:number;

    categories:number;

    name:string;

    nameEn:string;

    des:string;

    iconUrl:string;

    val_type:number[];

    val_num:number[];

    isShop:boolean;

    currency:number;

    fee:number;
}


export class GiftConfigRecord{

    id:number;

    types:number;

    view:number;

    name:string;

    nameEn:string;



    iconUrl:string;

    reward:number[];

    reward_num:number[];

    currency:number;

    fee:number;


    levelUsage:number
}


export class CheckInConfigRecord{

    id:number;

    types:number;

    des:string;

    reward:number[];

    reward_num:number[];
}


export class RankRewardRecord{

    userId:number;

    username:string;

    userAvater:string;

    gt:string;

    num:number = 0;

    rank:number = 0;
}


export enum ItemEnumId{
    petCoin = 1,
    biscuit,
    HPC,
    AICoin,
    water,
    food,
    exp = 9,
    aiCount = 10,
    petCount = 11,
}


export enum ItemEnumType{
    petCoin = 1,
    biscuit,
    HPC,
    AICoin,
    WaterBowl = 7,
    FoodBowl = 8,
}


export enum ItemValType{
    WaterBowl = 5,
    FoodBowl = 6,
}


export enum TaskConfigType{

    taskType1 = 1,

    taskType2 = 2,

    taskType3 = 3,

    taskType4 = 4,

    taskType5 = 5,

    taskType6 = 6,

    taskType7 = 7,

    taskType8 = 8,

    taskType9 = 9,

    taskType10 = 10,

    taskType11 = 11,

    taskType12 = 12,

    taskType14 = 14,

    taskType15 = 15,

    taskType16 = 16,

    taskType17 = 17,

    taskType18 = 18,

    taskType19 = 19,

    taskType20 = 20,

    taskType21 = 21,

    taskType22 = 22,

    taskType23 = 23,

    taskType24 = 24,

    taskType25 = 25,

    taskType26 = 26,

    taskType27 = 27,

    taskType28 = 28,

    taskType29 = 29,

    taskType30 = 30,
}

