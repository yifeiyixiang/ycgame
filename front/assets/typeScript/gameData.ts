import { _decorator, assetManager, Component, game, ImageAsset, Node, Sprite, SpriteFrame, Texture2D, Toggle } from 'cc';
import { HttpClient } from './net/HttpClient';
import { EventManger } from './EventManger';
import { userData } from '../Script/game/comm/UserData';
import { ItemEnumType } from './LanauageManager';
const { ccclass, property } = _decorator;

@ccclass('gameData')
export class gameData extends Component {

    public static chatList:chatItemData[] = [];         //宠物ai聊天记录

    /**选中签到天数 */
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

    /**购买道具*/
    public static curItemCfg:itemConfig;

    /**购买礼包 */
    public static curGifConf:giftConfig;

    /**购买数量 */
    public static curBuyCount:number = 1;

    public static levelSeconds:number = 0;

    public static refreshCoinTime:number = 0;

    public static isChanllengeShare = false;

    public static popupTipItemId:number = 0;
  

    //--------------------task--------------------

    public static isBindTwitter = false;

    public static isBindWallet = false;

    public static bindWalletName:string = "";

    public static bindWalletNameShow:string = null;

    public static bindTwitterName:string = "";

    public static isShowTip = true;

    public static happyHeartNum:number = 0;      //快乐玩法填充值

    public static happyHpNum:number = 0;      //快乐玩法货币

    public static saveDataClick(type:number = 2){
        //HttpClient.getInstance().sendPasLevel(gameData.saveData.addMoney, gameData.saveData.addGold, type);
        gameData.saveData.addGold = 0;
        gameData.saveData.addMoney = 0;
    }

    public static resetLevelData(){
        gameData.saveData.isOpen100Panel = [];
    }

    public static getShowLevel(level:number = -1):string{
        if (level == -1){
            level = gameData.saveData.curLevel;
        }
        var showLevel:string = (level).toString();
        return showLevel;
    }

//------------------------------------------------------------------------------------------------
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
        
        // let noonToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 24, 0, 0);  
   
        // if (now > noonToday) {  
        //     noonToday.setDate(noonToday.getDate() + 1);  
        // }  
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
        let level = gameData.saveData.userLevel;
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
//--------------------------------------------------------------------------------------------------
    start() {

    }


    getItemType(level:number){
        var typeNum = 2;
        var stageNum = this.getStageNum(level);

        typeNum = typeNum + stageNum * 3;
        
        var isBoss = this.getIsBoss(level);
        
        if (gameData.isChanllenge){
            typeNum = gameData.numBlockSum;
        }
        else if (isBoss){
            typeNum += 5;
        }

        return Math.min(typeNum, gameData.numBlockSum);
    }


    getStageNum(level:number){
        var stageNum = Math.floor((level-1)/5);
        return stageNum;
    }

    getIsBoss(level:number){
        var isBoss = (level)%5 == 0;
        return isBoss;
    }

    // public static setValue(key:any, value:any){
    //     var val = JSON.stringify(value);

    //     localStorage.setItem(key, val);
    // }

    // public static getValue(key):any{
    //     var data = localStorage.getItem(key);
    //     var val = null;
    //     if(data){
    //         val = JSON.parse(data);
    //     }
    //     return val;
    // }

    /**获取单选当前选中下标 */
    public static getToggleCheckIndex(togNode:Node){
        for (let index = 0; index < togNode.children.length; index++) {
            const element = togNode.children[index].getComponent(Toggle);
            if (element && element.isChecked){
                return index;
            }
        }
    }


    /**类型 获取当前货币数量  */
    public static getCoinNumByType(type:ItemEnumType){
        let num:number = 0
        if (type == ItemEnumType.petCoin){
            num = gameData.severData.userInfo.petCoin;
        }
        else if (type == ItemEnumType.biscuit){
            num = gameData.severData.userInfo.biscuit;
        }
        else if (type == ItemEnumType.HPC){
            num = gameData.severData.userInfo.hpc;
        }
        else if (type == ItemEnumType.AICoin){
            num = gameData.severData.userInfo.aiCoin;
        }
        return num;
    }

    /**类型 获取当前货币数量  */
    public static getIsEnoughCoinByType(type:ItemEnumType, cost:number, isShopTip:boolean = true){
        let num:number = gameData.getCoinNumByType(type);
        if (num >= cost){
            return true;
        }
        if (isShopTip){
            EventManger.eventTarget.emit(EventManger.EEventName.SHOW_TIP, "Balance Is Low");
        }
        return false;
    }


    /**唯一ID 获取宠物数据  */
    public static getPetDataById(_id:number):petItemData{
        for (let index = 0; index < userData.pets.length; index++) {
            const element:petItemData = userData.pets[index];
            if (element && element.id == _id){
                return element;
            }
        }
        return null!;
    }

    /**唯一ID 获取道具数据  */
    public static getBagDataById(_id:number):BagPropData{
        for (let index = 0; index < userData.bagProps.length; index++) {
            const element:BagPropData = userData.bagProps[index];
            if (element && element.id == _id){
                return element;
            }
        }
        return null!;
    }
}

export enum moneyType{
    money = 1,     
    gold = 2       
}

export enum getPanelType{
    pass = 1,      
    get = 2       
}

export enum popupLabType{
    challPopup = 1,      
    hpPopup = 2,
    hookPopup = 3,        
    offlineCardPopup = 4, 
    boostCardPopup = 5,  
    itemPopup = 6, 
    exp = 7, 
}

export enum popupCommonType{
    exit = 1,      
    disConnectTwitter = 2,   
    disConnectWalletr = 3,  
    offLineCoin = 4, 
    buy = 5,   
    connectTwitter = 6,
}

export enum coinType{
    coin1 = 1,      
    coin2 = 2,
    coin3 = 3,        
}


export class chatItemData{
    message:string = "";

    reward:{"rewardCount":0, "rewardType":0}[] = [];

    isSelf:boolean = false;
}


export class rewardData{
    rewardCount:number = 0;

    rewardType:number = 0;
}


//----------------------------------------------------------------------




/**用户信息 */
export class UserInfoData{
    userid: string = "";
    nickname: string = "";
    avatar: string = "";
    home_level: number = 1;
    music: number = 0;
    sound: number = 0;
    /**看广告得金币次数 */
    coin_ad_count: number = 0;
    /**看广告得体力次数 */
    power_ad_count: number = 0;

    user_sign:UserSign = null!;

    activity_count: number = 0;   //已参与次数
    activity_progress: number = 1;   //待领取的进度奖励
}

class UserSign {
    sign_in_days: number;
    sign_status: number;
    sign_time: string;

    constructor(sign_in_days: number, sign_status: number, sign_time: string) {
        this.sign_in_days = sign_in_days;
        this.sign_status = sign_status;
        this.sign_time = sign_time;
    }
}

export class PropCountData{
    prop_id: number = 101;
    prop_count:number = 11620;
}

export class AdPropCount{
    prop_id: number = 101;
    /**已观看广告次数 */
    ad_count:number = 1;
}

/**背包数据 */
export class BagPropData{

    id: number = 101;
    prop_id:number = 11620;
    prop_count:number = 1;
    is_active:boolean = false;
    position_x:number = 0
    position_y:number = 0
    score:number = 0;
}

/**宠物数据 */
export class petItemData{

    /**唯一ID */
    id:number = 1;    
    
    name:string = "";

    prop_id:number = 1;   //表id

    /**表情值 */
    mood_value:number = 100;

    /**饥饿 */
    hunger_value:number = 100;

    /**清洁 */
    clean_value:number = 100

    score:number = 100;

    is_active:boolean = true;

    fs_prop_id:number[] = [];   //已装备的道具ID
}

/**任务状态 */
export class TaskStateData{
    task_id:number =0     //任务 ID

    task_type:number = 1;   //任务类型

    done_count:number = 0;   //已完成数量

    task_count:number = 0;   //总数量

    /**是否已领取 */
    is_done:boolean = false;

    /**是否已完成 */
    status:boolean = false;
}

/**任务状态 */
export class TaskCfg{

    id:number = 1      //任务 ID

    /** 任务类型 1当日签到，2观看广告次数，3宠物互动次数 */
    task_type:number = 1;

    task_factor:number = 0;   //总数量

    task_gift:any
}


/**道具商品表配置 */
export class ShopCfg{
    id: number = 0;  
    name: string = ""; 
    /** 道具类型 1货币，2宠物，3消耗品，4宠物服饰 5家园装饰 */ 
    type: number = 0;  
    typename: string = "";  
     /** 道具子类型 1狗，2猫，  1饥饿，2清洁   1室外装饰，2室内装饰*/ 
    typeson: number = 0;  
    /** 子类型分支   服饰 1.领带，2.帽子，3.外秀，4衣服 */
    sonname: number = 0;  
    /**品质 */
    lunc: number = 0;  
    /**评分 */
    score: number = 0;  
    /**使用效果 */ 
    use_item_effect: number = 0;   
    /**出售金币 */
    levelGold: number = 0;    
    icon: string= "";  
    /**描述 */
    mask: string= "";  
     /**装饰图片 */
    decoration_res: string= "";  
    /**宠物特效 */
    pet_effect: string= "";  
     /**商店类型 1.宠物，2宠物道具，3宠物服饰，4家园装饰 */
    store_type: number = 0;    
    store_type_name: string= "";  
    /**购买方式 1.金币，2广告 */
    sell_type: number = 0;    
    sell_type_name: string= "";  
    /**购买数量*/
    sell_type_value: number = 0;  
    /**购买等级要求*/
    sell_need_level:number = 0;
}

/**好友信息 */
export class FriendData{
    userid: string = "";  
    nickname: string = "";  
    avatar: string = "";  
    pet_count: number = 0;  
    pet_score: number = 0;  

    id:string = "";
}





