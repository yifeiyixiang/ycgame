import { _decorator, Component, EventTarget, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EventManger')
export class EventManger {
    public static eventTarget:EventTarget = new EventTarget();

    static EEventName = {

        REFRESH_GAME: "REFRESH_GAME",     

        SHOW_TIP:"SHOW_TIP",    

        /**场景内增加 装饰 */
        ADD_ZHUNASHI:"ADD_ZHUNASHI",   

        /**是否拖动装饰中 */
        ID_Drangging:"isDragging",  

        REFRESH_PET_DATA: "REFRESH_PET_DATA",   //宠物列表数据更新

        REFRESH_GOOD_STATU: "REFRESH_GOOD_STATU",   //装饰品状态 更新

        REFRESH_FRIEND_DATA: "REFRESH_FRIEND_DATA",   //好友数据更新

        ADD_EXP_ANIMATION: "ADD_EXP_ANIMATION",   //经验动画





        SHOW_GOLDOUT_TIP:"SHOW_GOLDOUT_TIP",  

        PET_REWARD_DROP: "PET_REWARD_DROP",   //宠物交互，奖励动画

        PET_AICHAT_REFRESH: "PET_AICHAT_REFRESH",   //AI聊天刷新

        TASK_CLICK_HANDLER: "TASK_CLICK_HANDLER",   //任务点击

        HAPPY_REFRESH_GAME: "HAPPY_REFRESH_GAME",   //快来玩法数据更新

        HAPPY_NOT_CLICK: "HAPPY_NOT_CLICK",   //快来玩法丢失

        HAPPY_GAME_OVER: "HAPPY_REFRESH_GAME",   //快来玩法结束

        PLAY_ANIMATION_TASK:"PLAY_ANIMATION_TASK", 

        OUT_SUCCESS_PANEL:"OUT_SUCCESS_PANEL", 

        PASS_LEVEL_START:"PASS_LEVEL_START",  

        RESET_RESET_GAME:"RESET_RESET_GAME", 

        IS_SHOW_MAINVIEW:"IS_SHOW_MAINVIEW", 

        BLINK_ANIMATION:"BLINK_ANIMATION",

        ADD_COINANDEXP:"ADD_COINANDEXP",

        REFRESH_COIN_NUM:"REFRESH_COIN_NUM",

        MUSIC_CHANGE_STATE:"MUSIC_STOP",

        PLAY_SOUND_INDEX:"PLAY_SOUND_INDEX",

        USE_ITEM_SURE:"USE_ITEM_SURE",

        OPEN_TON_CONNNECT:"OPEN_TON_CONNNECT",

        OPEN_STAR_BUY:"OPEN_STAR_BUY",

        LOADING_IS_SHOW:"LOADING_IS_SHOW",

        INIT_DATA:"INIT_DATA",
    };

    static EventNameNew = {
        
    }
}

