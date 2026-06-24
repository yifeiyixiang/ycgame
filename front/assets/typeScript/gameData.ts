import { _decorator, assetManager, Component, game, ImageAsset, Node, Sprite, SpriteFrame, Texture2D, Toggle } from 'cc';
import { GameHttpClient } from './net/HttpClient';
import { GameEventManager } from './EventManger';
import { playerDataStore } from '../Script/game/comm/UserData';
import { ItemEnumType } from './LanauageManager';
const { ccclass, property } = _decorator;

@ccclass('gameData')
export class GameRuntimeData extends Component {

    public static chatList:ChatMessageRecord[] = [];


    public static checkSelectDay:number;

    static wxProArr:number[] = [0.01, 0.1 , 1, 2];

    static wxLevelArr:number[] = [1,2,30,35];

    static isGuide:boolean = false;

    static date:Date = new Date();

    public static numBlockSum = 30;

    public static isChanllenge= false;

    public static isPlayMusic = true;

    public static isPlaySound = true;

    public static isBackNotShop = false;

    public static isCommonNoChallenge = false;


    public static curItemCfg:ItemConfigRecord;


    public static curGifConf:GiftConfigRecord;


    public static curBuyCount:number = 1;

    public static levelSeconds:number = 0;

    public static refreshCoinTime:number = 0;

    public static isChanllengeShare = false;

    public static popupTipItemId:number = 0;




    public static isBindTwitter = false;

    public static isBindWallet = false;

    public static bindWalletName:string = "";

    public static bindWalletNameShow:string = null;

    public static bindTwitterName:string = "";

    public static isShowTip = true;

    public static happyHeartNum:number = 0;

    public static happyHpNum:number = 0;

    public static saveDataClick(type:number = 2){

        GameRuntimeData.saveData.addGold = 0;
        GameRuntimeData.saveData.addMoney = 0;
    }

    public static resetLevelData(){
        GameRuntimeData.saveData.isOpen100Panel = [];
    }

    public static getShowLevel(level:number = -1):string{
        if (level == -1){
            level = GameRuntimeData.saveData.curLevel;
        }
        var showLevel:string = (level).toString();
        return showLevel;
    }


    public static getInitNum(num:number, num2:number = 100):number{
        return Math.round(num*num2)/num2;
    }

    public static getCurTime(){
        return this.date.getTime()/1000;
    }

    public static getArrivalTime(time:number){
        let arrival = time - Math.floor(Date.now()/1000);
        if (arrival < 0){
            arrival = 0;
        }
        return arrival;
    }

    public static getZeroTime():number{
        let now = new Date();

        let utcNow = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
        let utcEndOfDay = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 24, 0, 0, 0);






        let hour = utcEndOfDay.getTime()
        let hour2 = utcNow.getTime()
        let diff = utcEndOfDay.getTime() - utcNow.getTime();

        let seconds = Math.ceil(diff / 1000);

        return seconds;
    }

    public static getLeftTime(diffSeconds:number, type:number = 1): string{
        let hours = Math.floor( diffSeconds / 3600);
        let minutes = Math.floor(( diffSeconds % 3600) / 60);
        let secs =  diffSeconds % 60;

        let h1 = (hours < 10) ? '0' + hours.toString() : hours.toString();
        let m1 = (minutes < 10) ? '0' + minutes.toString() : minutes.toString();
        let s1 = (secs < 10) ? '0' + secs.toFixed(0) : secs.toFixed(0);

        if (hours == 0){
            return  `${m1}:${s1}`;
        }
        if (hours == 0 && minutes == 0){
            return  `${s1}`;
        }
        if (type == 2){
            return  `${h1}/${m1}/${s1}`;
        }
        return  `${h1}:${m1}:${s1}`;
    }

    public static getShowTime(type:number = 1):string{
        let date = new Date();

        let month = (date.getMonth() + 1)
        let day = date.getDate()
        let year = date.getFullYear()

        let h1 = (month < 10) ? '0' + month.toString() : month.toString();
        let m1 = (day < 10) ? '0' + day.toString() : day.toString();
        let s1 = (year < 10) ? '0' + year.toString() : year.toString();
        if (type == 2){
            return  `${h1}/${m1}/${s1}`;
        }
        return `${h1}:${m1}:${s1}`;
    }

    private static headList:{} = {};
    private static headLoadList:{} = {};


    public static getExpSum(): number{
        let level = GameRuntimeData.saveData.userLevel;
        let num = ((level+1)**1.2)*100
        let num2 = Math.pow((level+1), 1.2)*100
        return num;
    }

    public static isNull(str:string):boolean{
        if (str == "" || str == null || str == undefined){
            return true;
        }
        return false;
    }

    start() {

    }


    getItemType(level:number){
        var typeNum = 2;
        var stageNum = this.getStageNum(level);

        typeNum = typeNum + stageNum * 3;

        var isBoss = this.getIsBoss(level);

        if (GameRuntimeData.isChanllenge){
            typeNum = GameRuntimeData.numBlockSum;
        }
        else if (isBoss){
            typeNum += 5;
        }

        return Math.min(typeNum, GameRuntimeData.numBlockSum);
    }


    getStageNum(level:number){
        var stageNum = Math.floor((level-1)/5);
        return stageNum;
    }

    getIsBoss(level:number){
        var isBoss = (level)%5 == 0;
        return isBoss;
    }

















    public static getToggleCheckIndex(togNode:Node){
        for (let index = 0; index < togNode.children.length; index++) {
            const element = togNode.children[index].getComponent(Toggle);
            if (element && element.isChecked){
                return index;
            }
        }
    }



    public static getCoinNumByType(type:ItemEnumType){
        let num:number = 0
        if (type == ItemEnumType.petCoin){
            num = GameRuntimeData.severData.userInfo.petCoin;
        }
        else if (type == ItemEnumType.biscuit){
            num = GameRuntimeData.severData.userInfo.biscuit;
        }
        else if (type == ItemEnumType.HPC){
            num = GameRuntimeData.severData.userInfo.hpc;
        }
        else if (type == ItemEnumType.AICoin){
            num = GameRuntimeData.severData.userInfo.aiCoin;
        }
        return num;
    }


    public static getIsEnoughCoinByType(type:ItemEnumType, cost:number, isShopTip:boolean = true){
        let num:number = GameRuntimeData.getCoinNumByType(type);
        if (num >= cost){
            return true;
        }
        if (isShopTip){
            GameEventManager.eventTarget.emit(GameEventManager.EEventName.SHOW_TIP, "Balance Is Low");
        }
        return false;
    }



    public static getPetDataById(_id:number):PetProfileRecord{
        for (let index = 0; index < playerDataStore.pets.length; index++) {
            const element:PetProfileRecord = playerDataStore.pets[index];
            if (element && element.id == _id){
                return element;
            }
        }
        return null!;
    }


    public static getBagDataById(_id:number):BagPropRecord{
        for (let index = 0; index < playerDataStore.bagProps.length; index++) {
            const element:BagPropRecord = playerDataStore.bagProps[index];
            if (element && element.id == _id){
                return element;
            }
        }
        return null!;
    }
}

export enum RewardCurrencyType{
    money = 1,
    gold = 2
}

export enum RewardPanelMode{
    pass = 1,
    get = 2
}

export enum PopupLabelMode{
    challPopup = 1,
    hpPopup = 2,
    hookPopup = 3,
    offlineCardPopup = 4,
    boostCardPopup = 5,
    itemPopup = 6,
    exp = 7,
}

export enum PopupDialogMode{
    exit = 1,
    disConnectTwitter = 2,
    disConnectWalletr = 3,
    offLineCoin = 4,
    buy = 5,
    connectTwitter = 6,
}

export enum WalletCoinType{
    coin1 = 1,
    coin2 = 2,
    coin3 = 3,
}


export class ChatMessageRecord{
    message:string = "";

    reward:{"rewardCount":0, "rewardType":0}[] = [];

    isSelf:boolean = false;
}


export class RewardItemRecord{
    rewardCount:number = 0;

    rewardType:number = 0;
}








export class UserProfileRecord{
    userid: string = "";
    nickname: string = "";
    avatar: string = "";
    home_level: number = 1;
    music: number = 0;
    sound: number = 0;

    coin_ad_count: number = 0;

    power_ad_count: number = 0;

    user_sign:UserCheckInRecord = null!;

    activity_count: number = 0;
    activity_progress: number = 1;
}

class UserCheckInRecord {
    sign_in_days: number;
    sign_status: number;
    sign_time: string;

    constructor(sign_in_days: number, sign_status: number, sign_time: string) {
        this.sign_in_days = sign_in_days;
        this.sign_status = sign_status;
        this.sign_time = sign_time;
    }
}

export class WalletPropCountRecord{
    prop_id: number = 101;
    prop_count:number = 11620;
}

export class AdRewardCounterRecord{
    prop_id: number = 101;

    ad_count:number = 1;
}


export class BagPropRecord{

    id: number = 101;
    prop_id:number = 11620;
    prop_count:number = 1;
    is_active:boolean = false;
    position_x:number = 0
    position_y:number = 0
    score:number = 0;
}


export class PetProfileRecord{


    id:number = 1;

    name:string = "";

    prop_id:number = 1;


    mood_value:number = 100;


    hunger_value:number = 100;


    clean_value:number = 100

    score:number = 100;

    is_active:boolean = true;

    fs_prop_id:number[] = [];
}


export class TaskProgressRecord{
    task_id:number =0

    task_type:number = 1;

    done_count:number = 0;

    task_count:number = 0;


    is_done:boolean = false;


    status:boolean = false;
}


export class TaskConfigRecord{

    id:number = 1


    task_type:number = 1;

    task_factor:number = 0;

    task_gift:any
}



export class ShopConfigRecord{
    id: number = 0;
    name: string = "";

    type: number = 0;
    typename: string = "";

    typeson: number = 0;

    sonname: number = 0;

    lunc: number = 0;

    score: number = 0;

    use_item_effect: number = 0;

    levelGold: number = 0;
    icon: string= "";

    mask: string= "";

    decoration_res: string= "";

    pet_effect: string= "";

    store_type: number = 0;
    store_type_name: string= "";

    sell_type: number = 0;
    sell_type_name: string= "";

    sell_type_value: number = 0;

    sell_need_level:number = 0;
}


export class FriendProfileRecord{
    userid: string = "";
    nickname: string = "";
    avatar: string = "";
    pet_count: number = 0;
    pet_score: number = 0;

    id:string = "";
}





