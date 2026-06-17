import { _decorator, Component, EventTarget, Node, resources, Sprite, SpriteFrame } from 'cc';
import { AdPropCount, coinType, gameData, petItemData, taskStateData } from './gameData';
import { EventManger } from './EventManger';
import { userData } from '../Script/game/comm/UserData';
const { ccclass, property } = _decorator;

@ccclass('LanauageManager')
export class LanauageManager {

    public static languageType:number = 1;

    public static popupLabelType:number = 1;

    public static popupCommonlType:number = 1;

    public static isInitData:boolean = false;

    public static isLoad:boolean = false;

    /**任务配表 */
    public static taskConfig = []
    public static languageConfig = []
    /**宠物配表*/
    public static petConfigs = []

    public static petCatConfig = []     //宠物猫配表

    public static petDogConfig = []        //宠物狗配表

    /**道具表*/
    public static itemConfigs = []
    /**任务配表*/
    public static taskConfigs = []
    /**主线任务 */
    public static taskLineConfigs = []
    public static jiabnConfig = []      //羁绊配表

    /**签到配表 */
    public static checkConfigs = []
    /**支付相关，礼包配表 */
    public static giftConfigs = []
    /**商品类型名称 */
    public static shopTileNames = []
    public static shopCateNames = []
    
    public static itemBaseUrl = "image/itemImg/"

    public static giftBaseUrl = "image/gift/"

    public static petBaseUrl = "image/pet/"


    /**通用的获取表数据 */
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

        /**将reward 转换为数组返回 */
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

    public static getPetConfigsByType(petType:enumPetType){
        if (LanauageManager.petCatConfig.length == 0){
            for (let index = 0; index < this.petConfigs.length; index++) {
                const element:petConfig = this.petConfigs[index];
                if (element.types == enumPetType.cat){
                    LanauageManager.petCatConfig.push(element);
                }else{
                    LanauageManager.petDogConfig.push(element);
                }
            }
        }

        if (petType == enumPetType.cat){
            return LanauageManager.petCatConfig;
        }else{
            return LanauageManager.petDogConfig;
        }
    }

   
    public static getDesStrById(id:number){
        if (id == 0){
            return "";
        }
        let lang = LanauageManager.languageConfig[id-1];
        let str:string = "";
        if (lang){
            if (LanauageManager.languageType == 1){
                str = lang.english;
            }
            else if (LanauageManager.languageType == 2){
                str = lang.chinese;
            }
        }
        return str.replace(/\\n/g, "\n");
    }

    public static getShopItemData(id:number){
        return LanauageManager.getConfigDataById(id, this.itemConfigs);
    }

    public static getItemNumById(id:number):number{
        for (let index = 0; index < gameData.saveData.backList.length; index++) {
            let element = gameData.saveData.backList[index];
            if (element.id == id){
                return element.num;
            }
        }
        return 0;
    }

    public static getTaskDataById(id:number):any{
        for (let index = 0; index < LanauageManager.taskConfig.length; index++) {
            let element = LanauageManager.taskConfig[index];
            if (element.id == id){
                return element;
            }
        }
        return null;
    }

    /**resources 动态 加载图片 */
    public static loadImage(url: string, spr:Sprite) {   
        if (url == "" || url == undefined || url == LanauageManager.itemBaseUrl){
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

    /**resources 动态 加载道具图片 */
    public static loadImageById(id:number, spr:Sprite) {
        let itemCfg:itemConfig = LanauageManager.getConfigDataById(id, this.itemConfigs);
        if (!itemCfg){
            console.log("dont have:  " + id);
        }
        let url = LanauageManager.itemBaseUrl + itemCfg.iconUrl;
        LanauageManager.loadImage(url, spr); 
    } 

    public static roundToTwoDecimals(num: number, num2:number = 100): number {  
        return Math.floor(num * num2) / num2;  
    } 

    public static getCoinNumString(coinNum:number = 0, type:number = 1){
        let num = coinNum;
        if (num == 0){
            num = gameData.saveData.coin;
        } 
        let unitIndex = 0;   

        const units = ['', 'w', 'm', 'b', 't', 'q'];  
        let num1 = 1000;
        if (num > 9999.99){
            unitIndex = 1
            num1 = 10000;
        }else{
            return LanauageManager.roundToTwoDecimals(num, type == 2?1000:100).toString()   //.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        num = Number(LanauageManager.roundToTwoDecimals(num/num1).toString());  
        let  goldNum = num.toFixed(2) //.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return goldNum + units[unitIndex]; 
    }

    public static getCoinNumByType(type:number){
        let num:number = 0
        if (type == coinType.coin1){
            num = gameData.saveData.coin2;
        }
        else if (type == coinType.coin2){
            num = gameData.saveData.coin;
        }
        else if (type == coinType.coin3){
            num = gameData.saveData.coin3;
        }
        return num;
    }

    /**获取任务状态信息 */
    private static getTaskInfoState(id:number, isLine:boolean =false):taskStateData{
        if (isLine){
            for (let index = 0; index < gameData.severData.taskMainStatetList.length; index++) {
                const element = gameData.severData.taskMainStatetList[index];
                if (element.id == id){
                    return element;
                }
            }

        }else{
            for (let index = 0; index < gameData.severData.taskStatetList.length; index++) {
                const element = gameData.severData.taskStatetList[index];
                if (element.id == id){
                    return element;
                }
            }
        }
        
        return null;
    }

    //任务状态 1 not, 2 complete ,3 received
    public static getTaskState(id:number, isLine:boolean =false):number{
        let data:taskStateData = LanauageManager.getTaskInfoState(id, isLine);
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
        EventManger.eventTarget.emit(EventManger.EEventName.PLAY_SOUND_INDEX, index)
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
        LanauageManager.playSound();
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
            EventManger.eventTarget.emit(EventManger.EEventName.SHOW_TIP, ("copy success")) 
        } catch (err) {  
            EventManger.eventTarget.emit(EventManger.EEventName.SHOW_TIP, ("copy fail"))   
        } 
    }

    /**获取宠物特性 */
    public static getShowCharacterCon(petData:petItemData):string{
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

    /**获取宠物 当前水量，总水量 */
    public static getPetValueSumCon(valType:ItemValType):[number, number]{
        let curNum:number = 0;
        let curSum:number = 0;
        for (let index = 0; index < gameData.severData.petList.length; index++) {
            const element:petItemData = gameData.severData.petList[index];
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

    /**获取道具 具体属性 */
    public static getItemValByType(item:itemConfig, valType:number){

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

    /**获取道具组 根据类型 */
    public static getItemCfgsByType(types:number){
        let cfgs:itemConfig[] = [];
        for (let index = 0; index < this.itemConfigs.length; index++) {
            const element:itemConfig = LanauageManager.setRewardConfig(this.itemConfigs[index]);
            if (element.types == types){
                cfgs.push(element);
            }
        }
        return cfgs;
    }

    //-----------------------------------------------------------------------------

    /**获取广告次数 */
    public static getAdCountById(propId:number):number{
        for (let index = 0; index < userData.adProps.length; index++) {
            let element = userData.adProps[index];
            if (element && element.prop_id == propId){
                return element.ad_count;
            }
        }
        return 0
    }
}

export enum enumPetType{
    cat = 0,
    dog = 1,
}

/**宠物表数据 */
export class petConfig{

    id:number = 0;

    types:number = 0;

    species:string = "Cat";    //猫 Cat， 狗 Dog

    name:string = "";  

    variety:string = "";        //英文名字

    stage:string;

    iconUrl:string;     //图片

    // foodLimitNum:number = 100;

    // waiterLimitNum:number = 100;

    // cleanLimitNum:number = 100;
}

/**道具信息 */
export class itemConfig{

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

/**礼包配置信息 */
export class giftConfig{

    id:number;

    types:number;

    view:number;

    name:string;

    nameEn:string;

    // des:string;

    iconUrl:string;

    reward:number[];

    reward_num:number[];

    currency:number;

    fee:number;

    /**等级限制 */
    levelUsage:number
}

/**签到信息 */
export class checkConfig{

    id:number;

    types:number;

    des:string;

    reward:number[];

    reward_num:number[];
}


export class randItemData{

    userId:number;

    username:string;

    userAvater:string;

    gt:string;

    num:number = 0;

    rank:number = 0;
}

/**道具奖励类型 */
export enum ItemEnumId{
    petCoin = 1,        //宠物币
    biscuit,            //小饼干
    HPC,                //快乐币
    AICoin,             //AI币
    water,              //水
    food,               //粮食
    exp = 9,            //经验
    aiCount = 10,        //ai冒险次数
    petCount = 11,       //宠物栏位
}

/**道具类型 */
export enum ItemEnumType{
    petCoin = 1,        //宠物币
    biscuit,            //小饼干
    HPC,                //快乐币
    AICoin,             //AI币
    WaterBowl = 7,          //水盆
    FoodBowl = 8,           //饭盆
}

/**数值类型 */
export enum ItemValType{
    WaterBowl = 5,          //水盆水量
    FoodBowl = 6,           //饭盆饭量
}

/**任务配置类型 */
export enum TaskConifgType{
    /** 收养一只萌宠*/
    taskType1 = 1,	
    /** 置办水盆*/
    taskType2 = 2,
    /** 置办饭盆*/
    taskType3 = 3,	
    /**水盆补充一次水 */
    taskType4 = 4,	
    /**饭盆补充一次粮 */
    taskType5 = 5,	
    /** 拾取宠物币*/
    taskType6 = 6,	
    /**完成3个每日任务 */
    taskType7 = 7,	
    /** 和宠物互动X次*/
    taskType8 = 8,	
    /** 添置新的装扮*/
    taskType9 = 9,	
    /** 给任意一只宠物洗澡*/
    taskType10 = 10,	
    /** 大厅等级达到{p0}*/
    taskType11 = 11,	
    /** 每日签到*/
    taskType12 = 12,	
    /**完成一次冒险 */
    taskType14 = 14,	
    /** 和宠物进行一次聊天*/
    taskType15 = 15,	
    /**关注我们的频道 */
    taskType16 = 16,	
    /**加入我们的TG */
    taskType17 = 17,	
    /**关注我们的推特 */
    taskType18 = 18,	
    /**加入我们的DC */
    taskType19 = 19,	
    /** RT 我们的推文*/
    taskType20 = 20,	
    /**喜欢我们的推文 */
    taskType21 = 21,	
    /** 评论我们的推文*/
    taskType22 = 22,	
    /**关注合作方的频道 */
    taskType23 = 23,	
    /** 加入合作方的TG*/
    taskType24 = 24,	
    /**关注合作方的推特 */
    taskType25 = 25,	
    /**加入合作方的DC */
    taskType26 = 26,	
    /** RT 合作方的推文*/
    taskType27 = 27,	
    /**喜欢合作方的推文 */
    taskType28 = 28,	
    /**评论合作方的推文 */
    taskType29 = 29,	
    /**访问合作方的网站 */
    taskType30 = 30,	
}

