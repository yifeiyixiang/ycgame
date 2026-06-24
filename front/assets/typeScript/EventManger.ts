import { _decorator, Component, EventTarget, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EventManger')
export class GameEventManager {
    public static eventTarget:EventTarget = new EventTarget();

    static EEventName = {

        REFRESH_GAME: "REFRESH_GAME",

        SHOW_TIP:"SHOW_TIP",


        ADD_ZHUNASHI:"ADD_ZHUNASHI",


        ID_Drangging:"isDragging",

        REFRESH_PET_DATA: "REFRESH_PET_DATA",

        REFRESH_GOOD_STATU: "REFRESH_GOOD_STATU",

        REFRESH_FRIEND_DATA: "REFRESH_FRIEND_DATA",

        ADD_EXP_ANIMATION: "ADD_EXP_ANIMATION",





        SHOW_GOLDOUT_TIP:"SHOW_GOLDOUT_TIP",

        PET_REWARD_DROP: "PET_REWARD_DROP",

        PET_AICHAT_REFRESH: "PET_AICHAT_REFRESH",

        TASK_CLICK_HANDLER: "TASK_CLICK_HANDLER",

        HAPPY_REFRESH_GAME: "HAPPY_REFRESH_GAME",

        HAPPY_NOT_CLICK: "HAPPY_NOT_CLICK",

        HAPPY_GAME_OVER: "HAPPY_REFRESH_GAME",

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

