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
        for (let configIndex = 0; configIndex < config.length; configIndex++) {
            let configRecord = config[configIndex];
            if (configRecord && configRecord.id == id){
                if (configRecord.reward && typeof configRecord.reward === "string"){
                    configRecord.reward = JSON.parse(configRecord.reward);
                }
                if (configRecord.reward_num && typeof configRecord.reward_num === "string"){
                    configRecord.reward_num = JSON.parse(configRecord.reward_num);
                }
                if (configRecord.val_type && typeof configRecord.val_type === "string"){
                    configRecord.val_type = JSON.parse(configRecord.val_type);
                }
                if (configRecord.val_num && typeof configRecord.val_num === "string"){
                    configRecord.val_num = JSON.parse(configRecord.val_num);
                }
                return configRecord;
            }
        }
        return null
    }


        public static setRewardConfig(configRecord:any){
            if (!configRecord){
                return null;
            }
            if (configRecord.reward && typeof configRecord.reward === "string"){
                configRecord.reward = JSON.parse(configRecord.reward);
            }
            if (configRecord.reward_num && typeof configRecord.reward_num === "string"){
                configRecord.reward_num = JSON.parse(configRecord.reward_num);
            }
            return configRecord;
        }

    public static getPetConfigsByType(petType:PetSpeciesType){
        if (LanguageContentManager.petCatConfig.length == 0){
            for (let petConfigIndex = 0; petConfigIndex < this.petConfigs.length; petConfigIndex++) {
                const petConfig:PetConfigRecord = this.petConfigs[petConfigIndex];
                if (petConfig.types == PetSpeciesType.cat){
                    LanguageContentManager.petCatConfig.push(petConfig);
                }else{
                    LanguageContentManager.petDogConfig.push(petConfig);
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
        for (let bagIndex = 0; bagIndex < GameRuntimeData.saveData.backList.length; bagIndex++) {
            let backpackRecord = GameRuntimeData.saveData.backList[bagIndex];
            if (backpackRecord.id == id){
                return backpackRecord.num;
            }
        }
        return 0;
    }

    public static getTaskDataById(id:number):any{
        for (let taskConfigIndex = 0; taskConfigIndex < LanguageContentManager.taskConfig.length; taskConfigIndex++) {
            let taskConfigRecord = LanguageContentManager.taskConfig[taskConfigIndex];
            if (taskConfigRecord.id == id){
                return taskConfigRecord;
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
        let displayCoinAmount = coinNum;
        if (displayCoinAmount == 0){
            displayCoinAmount = GameRuntimeData.saveData.coin;
        }
        let unitIndex = 0;

        const units = ['', 'w', 'm', 'b', 't', 'q'];
        let num1 = 1000;
        if (displayCoinAmount > 9999.99){
            unitIndex = 1
            num1 = 10000;
        }else{
            return LanguageContentManager.roundToTwoDecimals(displayCoinAmount, type == 2?1000:100).toString()
        }
        displayCoinAmount = Number(LanguageContentManager.roundToTwoDecimals(displayCoinAmount/num1).toString());
        let  formattedCoinAmount = displayCoinAmount.toFixed(2)
        return formattedCoinAmount + units[unitIndex];
    }

    public static getCoinNumByType(type:number){
        let coinAmount:number = 0
        if (type == WalletCoinType.coin1){
            coinAmount = GameRuntimeData.saveData.coin2;
        }
        else if (type == WalletCoinType.coin2){
            coinAmount = GameRuntimeData.saveData.coin;
        }
        else if (type == WalletCoinType.coin3){
            coinAmount = GameRuntimeData.saveData.coin3;
        }
        return coinAmount;
    }


    private static getTaskInfoState(id:number, isLine:boolean =false):TaskProgressRecord{
        if (isLine){
            for (let taskStateIndex = 0; taskStateIndex < GameRuntimeData.severData.taskMainStatetList.length; taskStateIndex++) {
                const mainTaskState = GameRuntimeData.severData.taskMainStatetList[taskStateIndex];
                if (mainTaskState.id == id){
                    return mainTaskState;
                }
            }

        }else{
            for (let taskStateIndex = 0; taskStateIndex < GameRuntimeData.severData.taskStatetList.length; taskStateIndex++) {
                const branchTaskState = GameRuntimeData.severData.taskStatetList[taskStateIndex];
                if (branchTaskState.id == id){
                    return branchTaskState;
                }
            }
        }

        return null;
    }


    public static getTaskState(id:number, isLine:boolean =false):number{
        let taskState:TaskProgressRecord = LanguageContentManager.getTaskInfoState(id, isLine);
        if (!taskState){
            return 1;
        }
        if (taskState.reward){
            return 3;
        }
        if (taskState.done_num >= taskState.task_num){
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
        for (let traitIndex = 0; traitIndex < petData.characteristics.length; traitIndex++) {
            const petTrait = petData.characteristics[traitIndex];
            if (petTrait){
                if (str == ""){
                    str = petTrait.context;
                }else{
                    str = str + "," + petTrait.context;
                }
            }
        }
        if (str == ""){
            str = "Not have"
        }
        return str;
    }


    public static getPetValueSumCon(valType:ItemValType):[number, number]{
        let currentValue:number = 0;
        let totalValue:number = 0;
        for (let petIndex = 0; petIndex < GameRuntimeData.severData.petList.length; petIndex++) {
            const petRecord:PetProfileRecord = GameRuntimeData.severData.petList[petIndex];
            if (petRecord){
               if (valType == ItemValType.FoodBowl){
                    currentValue += petRecord.satiety;
                    totalValue += petRecord.satietyFull;
               }
               else if (valType == ItemValType.WaterBowl){
                    currentValue += petRecord.thirsty;
                    totalValue += petRecord.thirstyFull;
               }
            }
        }

        return [currentValue, totalValue];
    }


    public static getItemValByType(item:ItemConfigRecord, valType:number){

        let valueTypes = JSON.parse(item.val_type.toString());
        for (let valueIndex = 0; valueIndex < valueTypes.length; valueIndex++) {
            const itemValueType = valueTypes[valueIndex];
            if (itemValueType == valType){
                let valueAmounts = JSON.parse(item.val_num.toString());
                return valueAmounts[valueIndex];
            }

        }
        return 0;
    }


    public static getItemCfgsByType(types:number){
        let itemConfigs:ItemConfigRecord[] = [];
        for (let itemConfigIndex = 0; itemConfigIndex < this.itemConfigs.length; itemConfigIndex++) {
            const itemConfig:ItemConfigRecord = LanguageContentManager.setRewardConfig(this.itemConfigs[itemConfigIndex]);
            if (itemConfig.types == types){
                itemConfigs.push(itemConfig);
            }
        }
        return itemConfigs;
    }




    public static getAdCountById(propId:number):number{
        for (let adPropIndex = 0; adPropIndex < playerDataStore.adProps.length; adPropIndex++) {
            let adPropRecord = playerDataStore.adProps[adPropIndex];
            if (adPropRecord && adPropRecord.prop_id == propId){
                return adPropRecord.ad_count;
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

