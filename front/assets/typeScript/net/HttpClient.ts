import { director, error, log, sys } from "cc";
import { zc } from "./ZC";
import { HttpReturn } from "./ZCHttpRequest";
import { BagPropData, chatItemData, gameData, petItemData, rewardData } from "../gameData";
import { EventManger } from "../EventManger";
import { AndroidSdk } from "../AndroidSdk";
import { userData } from "../../Script/game/comm/UserData";
import { Notifications } from "../../Script/easyFramework/mgr/notifications";
import GD from "../../Script/config/GD";
import { uiManager } from "../../Script/easyFramework/mgr/uiManager";
import { Const } from "../../Script/config/Const";
import { GoodsType } from "../../Script/config/global";

import { PREVIEW } from 'cc/env';
import { mergeBoardModel } from "../../Script/game/comm/mergeBoardModel";

export class HttpClient {
    private httpTryCount = 10;  
    private httpTryNum = 0;     
    private static instance:HttpClient = null!;
    private isInit:boolean = true;

    private isShowTip:boolean = true;

    private rankTime:number[] = [0,0,0,0];

    private argc:{ [key:string]:any } = {};

    private tiems:number;

    public static getInstance():HttpClient {
        if(this.instance == null) {
            this.instance = new HttpClient();
        }

        return this.instance;
    }

    private constructor() {
        if ((window as any).user_token) {
            //zc.http.addHeader("token",(window as any).user_token);

        }
        zc.http.addHeader("Content-Type", "application/json; charset=utf-8");

        //zc.http.addHeader("Authorization","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxIiwiaWF0IjoiMTcyMDUwNjc1MyIsIm5iZiI6IjE3MjA1MDY3NTMiLCJleHAiOiIxNzIwNTEzOTUzIiwiaXNzIjoidm9sLmNvcmUub3duZXIiLCJhdWQiOiJ2b2wuY29yZSIsIm9wZW5JZCI6IjU1NSIsInd4TmlrZU5hbWUiOiLmnb7mnb4xIn0.UdRs6PekPYMMkgXnTz8K1dAQtRkZQ6bDaNGW3-VJTrI");
    }

    /** 登录 */
    sendLogin(code:string = "1115", nickname:string = "测试", avatar:string = "", successFun:Function = ()=>{}, failFun:Function = ()=>{}){
        if(PREVIEW){
            code = "1113"//"1112"
        }
        let params = {
            "code":code,
            "nickname":userData.roleName,
            "avatar":avatar,
        }

        this.isInit = true;
        this.argc.loginCallBack = successFun;
        this.argc.loginCallBack2 = failFun;
        zc.http.post("/api/login", this.onLogin.bind(this), params);
    }

    onLogin(res:HttpReturn){
        if (res.res && res.res.code == 200){
            if (res.res.data){

                zc.http.addHeader("Authorization", res.res.data.token);

                if (this.isInit){
                    this.getPetList();
                    this.sendAdpropcount();
                    // this.getHallConfigs();
                    this.sednGetUserInfo();
                    // this.getUserTaskInfo("main");
                    // this.sendGetRankData();
                    // this.dailyCheckIn();
                }

                this.isInit = false;
            
                 if (this.argc.loginCallBack){
                    this.argc.loginCallBack(res)
                    this.argc.loginCallBack = null;
                }
            }
        }else{
            this.showFail("登录失败: " , res.res? res.res.msg: res.err)

            if (this.argc.loginCallBack2){
                this.argc.loginCallBack2(res.res? res.res.msg: res.err)
                this.argc.loginCallBack2 = null;
            }
        }
    }

    /**获取用户基本信息 */
    sednGetUserInfo(){
        let params = {
        }
        zc.http.post("/api/userinfo", this.onsednGetUserInfo.bind(this), params);
    }

    onsednGetUserInfo(res:HttpReturn){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data
                userData.userInfodata = resData.userdata;
                userData.coinprop = resData.coinprop;

                userData.activity = resData.activity;

                userData.roleName = userData.userInfodata.nickname;

                userData.roleID = userData.userInfodata.userid;

                if (resData.status == 0){
                    console.log("重置数据");
                    sys.localStorage.clear();
                }

                this.refreshView();
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }

    /**获取背包信息 2-宠物道具 3-宠物服饰 4-家园装饰*/
    sednBagInfo(store_type:number = 2, successFun:Function = ()=>{}){
        let params = {
            store_type:store_type
        }
        this.argc.sednBagInfo = successFun;
        zc.http.post("/api/bag", this.onsednBagInfo.bind(this), params);
    }

    onsednBagInfo(res:HttpReturn){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data
                userData.bagProps = resData.userprop;

                this.refreshView();
                if (this.argc.sednBagInfo){
                    this.argc.sednBagInfo(res)
                    this.argc.sednBagInfo = null;
                }
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }

    /**出售物品 1-宠物  3-宠物服饰 4-家园装饰*/
    sendSellBagItem(store_type:number = 2, id:number){
        let params = {
            store_type:store_type,
            sole_id:id,
        }
        zc.http.post("/api/sellprop", this.onsednSellBagItem.bind(this), params);
    }

    onsednSellBagItem(res:HttpReturn){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data
                userData.bagProps = resData.userprop;

                this.refreshView();
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }

    /**获取宠物列表 */
    getPetList(successFun:Function = ()=>{}){
        let params = {
        }
        this.argc.getPetListCallBack = successFun;
        zc.http.post("/api/pet", this.ongetPetList.bind(this), params);
    }

    ongetPetList(res:HttpReturn){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data.userpet

                userData.pet_count = resData.pet_count;
                userData.pet_score = resData.pet_score;
                userData.pets = resData.pets;

                this.refreshView();

                EventManger.eventTarget.emit(EventManger.EEventName.REFRESH_PET_DATA);

                if (this.argc.getPetListCallBack){
                    this.argc.getPetListCallBack(res)
                    this.argc.getPetListCallBack = null;
                }
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }
    
    /**宠物操作  type 1-放置家园 2-休息 3-放生 4-喂食洗澡 5-穿戴服饰 6-取消穿戴 7-互动 8-改名*/
    sendPetAction(types:number, petId:number = 0, propId:number = 0, clothing_id:number = 0, name:string = "", successFun:Function = ()=>{}){
        let params = {
            "types":types,
            "sole_id":petId,
            "prop_id":propId,
            "clothing_id":clothing_id,
            "name":name
        }

        this.argc.sendPetActionCallBack = successFun;
        zc.http.post("/api/petaction", this.onsendPetAction.bind(this), params);
    }

    onsendPetAction(res:HttpReturn){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data.userpet

                for (let index = 0; index < userData.pets.length; index++) {
                    const element:petItemData = userData.pets[index];
                    if (element.id == resData.id){
                        userData.pets[index] = resData;
                        break;
                    }
                }

                if (this.argc.sendPetActionCallBack){
                    this.argc.sendPetActionCallBack(res)
                    this.argc.sendPetActionCallBack = null;
                }

                this.refreshView();

                EventManger.eventTarget.emit(EventManger.EEventName.REFRESH_PET_DATA);

            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }


    /**购买道具 */
    sendBuyProp(propId:number, type:number, successFun:Function = ()=>{}){
        let params = {
            prop_id:propId,
            types:type,
        }

        this.argc.sendBuyPropCallBack = successFun;
        zc.http.post("/api/buyprop", this.onsendBuyProp.bind(this), params);
    }

    onsendBuyProp(res:HttpReturn){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data

                userData.userInfodata = resData.userdata;
                userData.coinprop = resData.coinprop;
                userData.adProps = resData.ad_prop;
                this.refreshView();

                // this.showFail("","购买成功");
                this.showReward(resData)

                if (this.argc.sendBuyPropCallBack){
                    this.argc.sendBuyPropCallBack(res)
                    this.argc.sendBuyPropCallBack = null;
                }
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }

    /**观看广告，增加金币，体力 1金币，2体力 */
    sendADWatch(type:number, successFun:Function = ()=>{}){
        let params = {
            types:type,
        }

        this.argc.sendADWatchCallBack = successFun;
        zc.http.post("/api/adwatch", this.onsendADWatch.bind(this), params);
    }

    onsendADWatch(res:HttpReturn){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data

                userData.userInfodata = resData.userdata;
                userData.coinprop = resData.coinprop;
                this.refreshView();

                this.showReward(resData)

                if (this.argc.sendADWatchCallBack){
                    this.argc.sendADWatchCallBack(res)
                    this.argc.sendADWatchCallBack = null;
                }
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }

     /**签到 */
    sendSign(){
        let params = {
        }
        zc.http.post("/api/sign", this.onsendSign.bind(this), params);
    }

    onsendSign(res:HttpReturn){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data

                userData.coinprop = resData.coinprop;
                userData.userInfodata.user_sign.sign_in_days = resData.sign_in_days;
                userData.userInfodata.user_sign.sign_status = resData.sign_status;

                this.showReward(resData)

                this.refreshView();
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }

     /**转盘结果 */
    sendWheel(successFun:Function = ()=>{}){
        let params = {

        }

        this.argc.sendWheelCallBack = successFun;
        zc.http.post("/api/wheel", this.onsendWheel.bind(this), params);
    }

    onsendWheel(res:HttpReturn){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data

                userData.coinprop = resData.coinprop;
                this.refreshView();
                if (this.argc.sendWheelCallBack){
                    this.argc.sendWheelCallBack(res)
                    this.argc.sendWheelCallBack = null;
                }
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }

    /**修改信息  1-昵称 2-音乐音量 3-音效音量*/
    sendChangeInfo(type:number, value:string, successFun:Function = ()=>{}){
        let params = {
            types:type,
            value:value,
        }

        this.argc.sendChangeInfoCallBack = successFun;
        zc.http.post("/api/changeu", this.onsendChangeInfoCallBack.bind(this), params);
    }

    onsendChangeInfoCallBack(res:HttpReturn){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data

                userData.userInfodata = resData.userdata;
                
                if (this.argc.sendChangeInfoCallBack){
                    this.argc.sendChangeInfoCallBack(res)
                    this.argc.sendChangeInfoCallBack = null;
                }
                this.refreshView()
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }

    /**获取任务列表 */
    sendGetTaskList(successFun:Function = ()=>{}){
        let params = {
        }
        this.argc.sendGetTaskList = successFun;
        zc.http.post("/api/task", this.onsendGetTaskList.bind(this), params);
    }

    onsendGetTaskList(res:HttpReturn){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data

                userData.taskDataList = resData.usertask;

                this.refreshView();

                if (this.argc.sendGetTaskList){
                    this.argc.sendGetTaskList(res)
                    this.argc.sendGetTaskList = null;
                }
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }

    /**获取任务列表 */
    sendRecivieTaskReward(type:number, successFun:Function = ()=>{}){
        let params = {
            task_type:type
        }
        this.argc.sendRecivieTaskReward = successFun;
        zc.http.post("/api/taskdone", this.onsendRecivieTaskReward.bind(this), params);
    }

    onsendRecivieTaskReward(res:HttpReturn){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data

                //userData.taskDataList = resData.usertask;
                userData.coinprop = resData.coinprop;
                this.showReward(resData)

                // this.refreshView();
                HttpClient.getInstance().sendGetTaskList();

                if (this.argc.sendRecivieTaskReward){
                    this.argc.sendRecivieTaskReward(res)
                    this.argc.sendRecivieTaskReward = null;
                }
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }

    /**放置装饰物品  types 1-放置 2-回收,*/
    sendGoodPos(types:number,id:number, position_x:number = 0, position_y:number = 0, successFun:Function = ()=>{}){
        let params = {
            types:types,
            sole_id:id,
            position_x:position_x,
            position_y:position_y,
        }
        this.argc.sendGoodPos = successFun;
        zc.http.post("/api/decorationplace", this.onsendGoodPos.bind(this), params);
    }

    onsendGoodPos(res:HttpReturn){
        if (res.res && res.res.code == 200){
            if (res.res.data){

                let resData = res.res.data.userprop_one

                for (let index = 0; index < userData.bagProps.length; index++) {
                    const element:BagPropData = userData.bagProps[index];
                    if (element.id == resData.id){
                        userData.bagProps[index] = resData;
                        break;
                    }
                }

                this.refreshView();

                EventManger.eventTarget.emit(EventManger.EEventName.ADD_ZHUNASHI)

                if (this.argc.sendGoodPos){
                    this.argc.sendGoodPos(res)
                    this.argc.sendGoodPos = null;
                }
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }

     /**同步相关数据 金币，砖石，体力，家园等级 */
    updateGold(coin:number = -1, diamond:number = -1, power:number = -1, home_level:number = -1, successFun:Function = ()=>{}){
        let params = {
            "coin":userData.coin,
            "diamond":userData.diamonds,
            "power":userData.power,
            "home_level":userData.roleLv,
        }
        this.argc.updateGold = successFun;
        zc.http.post("/api/update", this.onupdateGold.bind(this), params);
    }

    onupdateGold(res:HttpReturn){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                console.log("同步数据成功");
                if (this.argc.updateGold){
                    this.argc.updateGold(res)
                    this.argc.updateGold = null;
                }
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }










    /**获取道具广告计数*/
    sendAdpropcount(){
        let params = {
        }

        zc.http.post("/api/adpropcount", this.onsendAdpropcount.bind(this), params);
    }

    onsendAdpropcount(res:HttpReturn){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data

                userData.adProps = resData.ad_prop;
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }

    /**获取好友列表 */
    getFriendList(successFun:Function = ()=>{}){
        let params = {
        }
        this.argc.getFriendList = successFun;
        zc.http.post("/api/friend", this.ongetFriendList.bind(this), params);
    }

    ongetFriendList(res:HttpReturn){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data.friend;

                userData.friendList = [];
                for (let index = 0; index < resData.length; index++) {
                    const element = resData[index];
                    if (element && element.friend_info){
                        userData.friendList.push(element.friend_info);
                    }
                }

                EventManger.eventTarget.emit(EventManger.EEventName.REFRESH_FRIEND_DATA);

                if (this.argc.getFriendList){
                    this.argc.getFriendList(res)
                    this.argc.getFriendList = null;
                }
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }

     /**搜索对应好友 */
    getFriendSearch(userid:string,successFun:Function = ()=>{}){
        let params = {
            "userid":userid,
        }
        this.argc.getFriendSearch = successFun;
        zc.http.post("/api/friendsearch", this.ongetFriendSearch.bind(this), params);
    }

    ongetFriendSearch(res:HttpReturn){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data.user;

                if (!resData){
                    this.showFail("未找到该用户")
                }

                if (this.argc.getFriendSearch){
                    this.argc.getFriendSearch(res)
                    this.argc.getFriendSearch = null;
                }
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }

    /**好友推荐 */
    getFriendRecommend(successFun:Function = ()=>{}){
        let params = {

        }
        this.argc.getFriendRecommend = successFun;
        zc.http.post("/api/friendrecommend", this.ongetFriendRecommend.bind(this), params);
    }

    ongetFriendRecommend(res:HttpReturn){
        if (res.res && res.res.code == 200){
            if (res.res.data){

                userData.curFriendList = res.res.data.friend_recommend;
                EventManger.eventTarget.emit(EventManger.EEventName.REFRESH_FRIEND_DATA);
                if (this.argc.ongetFriendRecommend){
                    this.argc.ongetFriendRecommend(res)
                    this.argc.ongetFriendRecommend = null;
                }
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }

    /**好友申请列表 */
    getFriendApply(successFun:Function = ()=>{}){
        let params = {
        }
        this.argc.getFriendApply = successFun;
        zc.http.post("/api/friendapply", this.ongetFriendApply.bind(this), params);
    }

    ongetFriendApply(res:HttpReturn){
        if (res.res && res.res.code == 200){
            if (res.res.data){

                let resData = res.res.data.friend_apply;
                userData.curFriendList = [];
                for (let index = 0; index < resData.length; index++) {
                    const element = resData[index];
                    if (element && element.friend_info){
                        userData.curFriendList.push(element.friend_info);
                    }
                }
                EventManger.eventTarget.emit(EventManger.EEventName.REFRESH_FRIEND_DATA);
                if (this.argc.getFriendApply){
                    this.argc.getFriendApply(res)
                    this.argc.getFriendApply = null;
                }
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }

     /**添加好友 */
    getFriendAdd(userid:string,successFun:Function = ()=>{}){
        let params = {
            "userid":userid,
        }
        this.argc.getFriendAdd = successFun;
        zc.http.post("/api/friendadd", this.ongetFriendAdd.bind(this), params);
    }

    ongetFriendAdd(res:HttpReturn){
        if (res.res && res.res.code == 200){
            if (res.res){

                this.showFail("添加好友，申请发送成功")
                // this.getFriendList();

                if (this.argc.getFriendAdd){
                    this.argc.getFriendAdd(res)
                    this.argc.getFriendAdd = null;
                }
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }

    /**操作 1 同意 2 拒绝*/
    getFriendApplyaction(userid:string,type:number,successFun:Function = ()=>{}){
        let params = {
            "apply_id":userid,
            "type":type,
        }
        this.argc.getFriendApplyaction = successFun;
        zc.http.post("/api/friendapplyaction", this.ongetFriendApplyaction.bind(this), params);
    }

    ongetFriendApplyaction(res:HttpReturn){
        if (res.res && res.res.code == 200){
            if (res.res.data){

                this.showFail("操作成功")
                this.getFriendList();
                if (this.argc.getFriendApplyaction){
                    this.argc.getFriendApplyaction(res)
                    this.argc.getFriendApplyaction = null;
                }
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }

    /**盲盒结果 */
    sendactivity(successFun:Function = ()=>{}){
        let params = {
        }
        this.argc.sendWheelCallBack = successFun;
        zc.http.post("/api/activity", this.onsendactivity.bind(this), params);
    }

    onsendactivity(res:HttpReturn){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data

                userData.userInfodata.activity_count = resData.activity_count;
                userData.userInfodata.activity_progress = resData.activity_progress;

                this.showRewardProp(resData.draw_gift);

                if (this.argc.sendWheelCallBack){
                    this.argc.sendWheelCallBack(res)
                    this.argc.sendWheelCallBack = null;
                }
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }

    /**盲盒进度领取 */
    sendProgressaward(prossId:number, successFun:Function = ()=>{}){
        let params = {
            activity_progress_id: prossId,
        }
        this.argc.sendWheelCallBack = successFun;
        zc.http.post("/api/activityprogressaward", this.onsendProgressaward.bind(this), params);
    }

    onsendProgressaward(res:HttpReturn){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data

                userData.userInfodata.activity_progress = resData.activity_progress;

                this.showRewardProp(resData.activity_progress_award);

                userData.coinprop = resData.userprop;

                this.refreshView();
                if (this.argc.sendWheelCallBack){
                    this.argc.sendWheelCallBack(res)
                    this.argc.sendWheelCallBack = null;
                }
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }





    refreshView(isGetTask:boolean = true){
        EventManger.eventTarget.emit(EventManger.EEventName.REFRESH_GAME);
        // if (isGetTask){
        //     this.getUserTaskInfo("main");
        // }

        Notifications.emit(GD.event.updateMoney);
        Notifications.emit(GD.event.updateGame);
    }

    showReward(res:any){
        if (res && res.rewards){
            let rewards = res.rewards;
            this.showRewardProp(rewards);
        }
    }

    showRewardProp(rewards:any[]){
        let rewardData = [];
            for (let index = 0; index < rewards.length; index++) {
                const element = rewards[index];
                if (element && element.length >= 2){
                    rewardData.push([element[0], element[1], GoodsType.propNew])
                }
            }
            if (rewardData.length > 0){
                uiManager.instance.pushShowDialog(Const.Dialogs.RewardDialog, { reward: rewardData })
            }
    }

    showFail(str:string,  msg:string = "") {
        // if (str == "111"){
            EventManger.eventTarget.emit(EventManger.EEventName.SHOW_TIP, (str + msg))

            // this.emit(GD.event.showTip, { msg: str })
            
        // }
    }

}

