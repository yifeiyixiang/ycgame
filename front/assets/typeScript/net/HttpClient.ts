import { director, error, log, sys } from "cc";
import { ZcApiGateway } from "./ZC";
import { HttpResponsePacket } from "./ZCHttpRequest";
import { BagPropRecord, ChatMessageRecord, GameRuntimeData, PetProfileRecord, RewardItemRecord } from "../gameData";
import { GameEventManager } from "../EventManger";
import { NativeSdkBridge } from "../AndroidSdk";
import { playerDataStore } from "../../Script/game/comm/UserData";
import { Notifications } from "../../Script/easyFramework/mgr/notifications";
import GD from "../../Script/config/GD";
import { UiLayerService } from "../../Script/easyFramework/mgr/uiManager";
import { Const } from "../../Script/config/Const";
import { GoodsType } from "../../Script/config/global";

import { PREVIEW } from 'cc/env';
import { mergeBoardStateStore } from "../../Script/game/comm/mergeBoardModel";

export class GameHttpClient {
    private httpTryCount = 10;
    private httpTryNum = 0;
    private static instance:GameHttpClient = null!;
    private isInit:boolean = true;

    private isShowTip:boolean = true;

    private rankTime:number[] = [0,0,0,0];

    private argc:{ [key:string]:any } = {};

    private tiems:number;

    public static getInstance():GameHttpClient {
        if(this.instance == null) {
            this.instance = new GameHttpClient();
        }

        return this.instance;
    }

    private constructor() {
        if ((window as any).user_token) {


        }
        ZcApiGateway.http.addHeader("Content-Type", "application/json; charset=utf-8");


    }


    sendLogin(code:string = "1115", nickname:string = "测试", avatar:string = "", successFun:Function = ()=>{}, failFun:Function = ()=>{}){
        if(PREVIEW){
            code = "1113"
        }
        let params = {
            "code":code,
            "nickname":playerDataStore.roleName,
            "avatar":avatar,
        }

        this.isInit = true;
        this.argc.loginCallBack = successFun;
        this.argc.loginCallBack2 = failFun;
        ZcApiGateway.http.post("/api/login", this.onLogin.bind(this), params);
    }

    onLogin(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){

                ZcApiGateway.http.addHeader("Authorization", res.res.data.token);

                if (this.isInit){
                    this.getPetList();
                    this.sendAdpropcount();

                    this.sednGetUserInfo();



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


    sednGetUserInfo(){
        let params = {
        }
        ZcApiGateway.http.post("/api/userinfo", this.onsednGetUserInfo.bind(this), params);
    }

    onsednGetUserInfo(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data
                playerDataStore.userInfodata = resData.userdata;
                playerDataStore.coinprop = resData.coinprop;

                playerDataStore.activity = resData.activity;

                playerDataStore.roleName = playerDataStore.userInfodata.nickname;

                playerDataStore.roleID = playerDataStore.userInfodata.userid;

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


    sednBagInfo(store_type:number = 2, successFun:Function = ()=>{}){
        let params = {
            store_type:store_type
        }
        this.argc.sednBagInfo = successFun;
        ZcApiGateway.http.post("/api/bag", this.onsednBagInfo.bind(this), params);
    }

    onsednBagInfo(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data
                playerDataStore.bagProps = resData.userprop;

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


    sendSellBagItem(store_type:number = 2, id:number){
        let params = {
            store_type:store_type,
            sole_id:id,
        }
        ZcApiGateway.http.post("/api/sellprop", this.onsednSellBagItem.bind(this), params);
    }

    onsednSellBagItem(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data
                playerDataStore.bagProps = resData.userprop;

                this.refreshView();
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }


    getPetList(successFun:Function = ()=>{}){
        let params = {
        }
        this.argc.getPetListCallBack = successFun;
        ZcApiGateway.http.post("/api/pet", this.ongetPetList.bind(this), params);
    }

    ongetPetList(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data.userpet

                playerDataStore.pet_count = resData.pet_count;
                playerDataStore.pet_score = resData.pet_score;
                playerDataStore.pets = resData.pets;

                this.refreshView();

                GameEventManager.eventTarget.emit(GameEventManager.EEventName.REFRESH_PET_DATA);

                if (this.argc.getPetListCallBack){
                    this.argc.getPetListCallBack(res)
                    this.argc.getPetListCallBack = null;
                }
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }


    sendPetAction(types:number, petId:number = 0, propId:number = 0, clothing_id:number = 0, name:string = "", successFun:Function = ()=>{}){
        let params = {
            "types":types,
            "sole_id":petId,
            "prop_id":propId,
            "clothing_id":clothing_id,
            "name":name
        }

        this.argc.sendPetActionCallBack = successFun;
        ZcApiGateway.http.post("/api/petaction", this.onsendPetAction.bind(this), params);
    }

    onsendPetAction(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data.userpet

                for (let index = 0; index < playerDataStore.pets.length; index++) {
                    const element:PetProfileRecord = playerDataStore.pets[index];
                    if (element.id == resData.id){
                        playerDataStore.pets[index] = resData;
                        break;
                    }
                }

                if (this.argc.sendPetActionCallBack){
                    this.argc.sendPetActionCallBack(res)
                    this.argc.sendPetActionCallBack = null;
                }

                this.refreshView();

                GameEventManager.eventTarget.emit(GameEventManager.EEventName.REFRESH_PET_DATA);

            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }



    sendBuyProp(propId:number, type:number, successFun:Function = ()=>{}){
        let params = {
            prop_id:propId,
            types:type,
        }

        this.argc.sendBuyPropCallBack = successFun;
        ZcApiGateway.http.post("/api/buyprop", this.onsendBuyProp.bind(this), params);
    }

    onsendBuyProp(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data

                playerDataStore.userInfodata = resData.userdata;
                playerDataStore.coinprop = resData.coinprop;
                playerDataStore.adProps = resData.ad_prop;
                this.refreshView();


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


    sendADWatch(type:number, successFun:Function = ()=>{}){
        let params = {
            types:type,
        }

        this.argc.sendADWatchCallBack = successFun;
        ZcApiGateway.http.post("/api/adwatch", this.onsendADWatch.bind(this), params);
    }

    onsendADWatch(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data

                playerDataStore.userInfodata = resData.userdata;
                playerDataStore.coinprop = resData.coinprop;
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


    sendSign(){
        let params = {
        }
        ZcApiGateway.http.post("/api/sign", this.onsendSign.bind(this), params);
    }

    onsendSign(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data

                playerDataStore.coinprop = resData.coinprop;
                playerDataStore.userInfodata.user_sign.sign_in_days = resData.sign_in_days;
                playerDataStore.userInfodata.user_sign.sign_status = resData.sign_status;

                this.showReward(resData)

                this.refreshView();
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }


    sendWheel(successFun:Function = ()=>{}){
        let params = {

        }

        this.argc.sendWheelCallBack = successFun;
        ZcApiGateway.http.post("/api/wheel", this.onsendWheel.bind(this), params);
    }

    onsendWheel(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data

                playerDataStore.coinprop = resData.coinprop;
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


    sendChangeInfo(type:number, value:string, successFun:Function = ()=>{}){
        let params = {
            types:type,
            value:value,
        }

        this.argc.sendChangeInfoCallBack = successFun;
        ZcApiGateway.http.post("/api/changeu", this.onsendChangeInfoCallBack.bind(this), params);
    }

    onsendChangeInfoCallBack(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data

                playerDataStore.userInfodata = resData.userdata;

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


    sendGetTaskList(successFun:Function = ()=>{}){
        let params = {
        }
        this.argc.sendGetTaskList = successFun;
        ZcApiGateway.http.post("/api/task", this.onsendGetTaskList.bind(this), params);
    }

    onsendGetTaskList(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data

                playerDataStore.taskDataList = resData.usertask;

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


    sendRecivieTaskReward(type:number, successFun:Function = ()=>{}){
        let params = {
            task_type:type
        }
        this.argc.sendRecivieTaskReward = successFun;
        ZcApiGateway.http.post("/api/taskdone", this.onsendRecivieTaskReward.bind(this), params);
    }

    onsendRecivieTaskReward(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data


                playerDataStore.coinprop = resData.coinprop;
                this.showReward(resData)


                GameHttpClient.getInstance().sendGetTaskList();

                if (this.argc.sendRecivieTaskReward){
                    this.argc.sendRecivieTaskReward(res)
                    this.argc.sendRecivieTaskReward = null;
                }
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }


    sendGoodPos(types:number,id:number, position_x:number = 0, position_y:number = 0, successFun:Function = ()=>{}){
        let params = {
            types:types,
            sole_id:id,
            position_x:position_x,
            position_y:position_y,
        }
        this.argc.sendGoodPos = successFun;
        ZcApiGateway.http.post("/api/decorationplace", this.onsendGoodPos.bind(this), params);
    }

    onsendGoodPos(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){

                let resData = res.res.data.userprop_one

                for (let index = 0; index < playerDataStore.bagProps.length; index++) {
                    const element:BagPropRecord = playerDataStore.bagProps[index];
                    if (element.id == resData.id){
                        playerDataStore.bagProps[index] = resData;
                        break;
                    }
                }

                this.refreshView();

                GameEventManager.eventTarget.emit(GameEventManager.EEventName.ADD_ZHUNASHI)

                if (this.argc.sendGoodPos){
                    this.argc.sendGoodPos(res)
                    this.argc.sendGoodPos = null;
                }
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }


    updateGold(coin:number = -1, diamond:number = -1, power:number = -1, home_level:number = -1, successFun:Function = ()=>{}){
        let params = {
            "coin":playerDataStore.coin,
            "diamond":playerDataStore.diamonds,
            "power":playerDataStore.power,
            "home_level":playerDataStore.roleLv,
        }
        this.argc.updateGold = successFun;
        ZcApiGateway.http.post("/api/update", this.onupdateGold.bind(this), params);
    }

    onupdateGold(res:HttpResponsePacket){
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











    sendAdpropcount(){
        let params = {
        }

        ZcApiGateway.http.post("/api/adpropcount", this.onsendAdpropcount.bind(this), params);
    }

    onsendAdpropcount(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data

                playerDataStore.adProps = resData.ad_prop;
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }


    getFriendList(successFun:Function = ()=>{}){
        let params = {
        }
        this.argc.getFriendList = successFun;
        ZcApiGateway.http.post("/api/friend", this.ongetFriendList.bind(this), params);
    }

    ongetFriendList(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data.friend;

                playerDataStore.friendList = [];
                for (let index = 0; index < resData.length; index++) {
                    const element = resData[index];
                    if (element && element.friend_info){
                        playerDataStore.friendList.push(element.friend_info);
                    }
                }

                GameEventManager.eventTarget.emit(GameEventManager.EEventName.REFRESH_FRIEND_DATA);

                if (this.argc.getFriendList){
                    this.argc.getFriendList(res)
                    this.argc.getFriendList = null;
                }
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }


    getFriendSearch(userid:string,successFun:Function = ()=>{}){
        let params = {
            "userid":userid,
        }
        this.argc.getFriendSearch = successFun;
        ZcApiGateway.http.post("/api/friendsearch", this.ongetFriendSearch.bind(this), params);
    }

    ongetFriendSearch(res:HttpResponsePacket){
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


    getFriendRecommend(successFun:Function = ()=>{}){
        let params = {

        }
        this.argc.getFriendRecommend = successFun;
        ZcApiGateway.http.post("/api/friendrecommend", this.ongetFriendRecommend.bind(this), params);
    }

    ongetFriendRecommend(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){

                playerDataStore.curFriendList = res.res.data.friend_recommend;
                GameEventManager.eventTarget.emit(GameEventManager.EEventName.REFRESH_FRIEND_DATA);
                if (this.argc.ongetFriendRecommend){
                    this.argc.ongetFriendRecommend(res)
                    this.argc.ongetFriendRecommend = null;
                }
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }


    getFriendApply(successFun:Function = ()=>{}){
        let params = {
        }
        this.argc.getFriendApply = successFun;
        ZcApiGateway.http.post("/api/friendapply", this.ongetFriendApply.bind(this), params);
    }

    ongetFriendApply(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){

                let resData = res.res.data.friend_apply;
                playerDataStore.curFriendList = [];
                for (let index = 0; index < resData.length; index++) {
                    const element = resData[index];
                    if (element && element.friend_info){
                        playerDataStore.curFriendList.push(element.friend_info);
                    }
                }
                GameEventManager.eventTarget.emit(GameEventManager.EEventName.REFRESH_FRIEND_DATA);
                if (this.argc.getFriendApply){
                    this.argc.getFriendApply(res)
                    this.argc.getFriendApply = null;
                }
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }


    getFriendAdd(userid:string,successFun:Function = ()=>{}){
        let params = {
            "userid":userid,
        }
        this.argc.getFriendAdd = successFun;
        ZcApiGateway.http.post("/api/friendadd", this.ongetFriendAdd.bind(this), params);
    }

    ongetFriendAdd(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res){

                this.showFail("添加好友，申请发送成功")


                if (this.argc.getFriendAdd){
                    this.argc.getFriendAdd(res)
                    this.argc.getFriendAdd = null;
                }
            }
        }else{
            this.showFail("" , res.res? res.res.msg: res.err)
        }
    }


    getFriendApplyaction(userid:string,type:number,successFun:Function = ()=>{}){
        let params = {
            "apply_id":userid,
            "type":type,
        }
        this.argc.getFriendApplyaction = successFun;
        ZcApiGateway.http.post("/api/friendapplyaction", this.ongetFriendApplyaction.bind(this), params);
    }

    ongetFriendApplyaction(res:HttpResponsePacket){
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


    sendactivity(successFun:Function = ()=>{}){
        let params = {
        }
        this.argc.sendWheelCallBack = successFun;
        ZcApiGateway.http.post("/api/activity", this.onsendactivity.bind(this), params);
    }

    onsendactivity(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data

                playerDataStore.userInfodata.activity_count = resData.activity_count;
                playerDataStore.userInfodata.activity_progress = resData.activity_progress;

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


    sendProgressaward(prossId:number, successFun:Function = ()=>{}){
        let params = {
            activity_progress_id: prossId,
        }
        this.argc.sendWheelCallBack = successFun;
        ZcApiGateway.http.post("/api/activityprogressaward", this.onsendProgressaward.bind(this), params);
    }

    onsendProgressaward(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let resData = res.res.data

                playerDataStore.userInfodata.activity_progress = resData.activity_progress;

                this.showRewardProp(resData.activity_progress_award);

                playerDataStore.coinprop = resData.userprop;

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
        GameEventManager.eventTarget.emit(GameEventManager.EEventName.REFRESH_GAME);




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
        let RewardItemRecord = [];
            for (let index = 0; index < rewards.length; index++) {
                const element = rewards[index];
                if (element && element.length >= 2){
                    RewardItemRecord.push([element[0], element[1], GoodsType.propNew])
                }
            }
            if (RewardItemRecord.length > 0){
                UiLayerService.instance.pushShowDialog(Const.Dialogs.RewardDialog, { reward: RewardItemRecord })
            }
    }

    showFail(str:string,  msg:string = "") {

            GameEventManager.eventTarget.emit(GameEventManager.EEventName.SHOW_TIP, (str + msg))



    }

}

