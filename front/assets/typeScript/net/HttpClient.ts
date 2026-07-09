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

    public static _fn_ho():GameHttpClient {
        if(this.instance == null) {
            this.instance = new GameHttpClient();
        }

        return this.instance;
    }

    private constructor() {
        if ((window as any).user_token) {


        }
        ZcApiGateway.http._fn_f("Content-Type", "application/json; charset=utf-8");


    }


    _fn_adq(code:string = "", nickname:string = "", avatar:string = "", successFun:Function = ()=>{}, failFun:Function = ()=>{}, clientAppId:string = "", clientEnv:string = ""){
        let loginPayload = {
            "code":code,
            "nickname":nickname || "",
            "avatar":avatar || "",
            "client_appid":clientAppId,
            "client_env":clientEnv,
        }

        this.isInit = true;
        this.argc.loginCallBack = successFun;
        this.argc.loginCallBack2 = failFun;
        ZcApiGateway.http._fn_xi("/api/login", this._fn_uu.bind(this), loginPayload);
    }

    _fn_uu(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){

                ZcApiGateway.http._fn_f("Authorization", res.res.data.token);

                if (this.isInit){
                    this._fn_jc();
                    this._fn_adl();

                    this._fn_adg();



                }

                this.isInit = false;

                 if (this.argc.loginCallBack){
                    this.argc.loginCallBack(res)
                    this.argc.loginCallBack = null;
                }
            }
        }else{
            this._fn_ahh("登录失败: " , res.res? res.res.msg: res.err)

            if (this.argc.loginCallBack2){
                this.argc.loginCallBack2(res.res? res.res.msg: res.err)
                this.argc.loginCallBack2 = null;
            }
        }
    }


    _fn_adg(){
        let userInfoPayload = {
        }
        ZcApiGateway.http._fn_xi("/api/userinfo", this._fn_vj.bind(this), userInfoPayload);
    }

    _fn_vj(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let userInfoResponse = res.res.data
                playerDataStore.userInfodata = userInfoResponse.userdata;
                playerDataStore.coinprop = userInfoResponse.coinprop;

                playerDataStore.activity = userInfoResponse.activity;

                playerDataStore.roleName = playerDataStore.userInfodata.nickname || "";
                playerDataStore.roleAvatar = playerDataStore.userInfodata.avatar || "";

                playerDataStore.roleID = playerDataStore.userInfodata.userid;

                if (userInfoResponse.status == 0){
                    console.log("重置数据");
                    sys.localStorage.clear();
                }

                this._fn_aaa();
            }
        }else{
            this._fn_ahh("" , res.res? res.res.msg: res.err)
        }
    }


    sednBagInfo(store_type:number = 2, successFun:Function = ()=>{}){
        let bagRequestPayload = {
            store_type:store_type
        }
        this.argc.sednBagInfo = successFun;
        ZcApiGateway.http._fn_xi("/api/bag", this._fn_vi.bind(this), bagRequestPayload);
    }

    _fn_vi(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let bagResponse = res.res.data
                playerDataStore.bagProps = bagResponse.userprop;

                this._fn_aaa();
                if (this.argc.sednBagInfo){
                    this.argc.sednBagInfo(res)
                    this.argc.sednBagInfo = null;
                }
            }
        }else{
            this._fn_ahh("" , res.res? res.res.msg: res.err)
        }
    }


    _fn_adx(store_type:number = 2, id:number){
        let sellPropPayload = {
            store_type:store_type,
            sole_id:id,
        }
        ZcApiGateway.http._fn_xi("/api/sellprop", this._fn_vk.bind(this), sellPropPayload);
    }

    _fn_vk(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let sellPropResponse = res.res.data
                playerDataStore.bagProps = sellPropResponse.userprop;

                this._fn_aaa();
            }
        }else{
            this._fn_ahh("" , res.res? res.res.msg: res.err)
        }
    }


    _fn_jc(successFun:Function = ()=>{}){
        let petListPayload = {
        }
        this.argc.getPetListCallBack = successFun;
        ZcApiGateway.http._fn_xi("/api/pet", this._fn_us.bind(this), petListPayload);
    }

    _fn_us(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let petListResponse = res.res.data.userpet

                playerDataStore.pet_count = petListResponse.pet_count;
                playerDataStore.pet_score = petListResponse.pet_score;
                playerDataStore.pets = petListResponse.pets;

                this._fn_aaa();

                GameEventManager.eventTarget.emit(GameEventManager.EEventName.REFRESH_PET_DATA);

                if (this.argc.getPetListCallBack){
                    this.argc.getPetListCallBack(res)
                    this.argc.getPetListCallBack = null;
                }
            }
        }else{
            this._fn_ahh("" , res.res? res.res.msg: res.err)
        }
    }


    _fn_adt(types:number, petId:number = 0, propId:number = 0, clothing_id:number = 0, name:string = "", successFun:Function = ()=>{}){
        let petActionPayload = {
            "types":types,
            "sole_id":petId,
            "prop_id":propId,
            "clothing_id":clothing_id,
            "name":name
        }

        this.argc.sendPetActionCallBack = successFun;
        ZcApiGateway.http._fn_xi("/api/petaction", this._fn_vs.bind(this), petActionPayload);
    }

    _fn_vs(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let updatedPetRecord = res.res.data.userpet

                for (let petIndex = 0; petIndex < playerDataStore.pets.length; petIndex++) {
                    const petRecord:PetProfileRecord = playerDataStore.pets[petIndex];
                    if (petRecord.id == updatedPetRecord.id){
                        playerDataStore.pets[petIndex] = updatedPetRecord;
                        break;
                    }
                }

                if (this.argc.sendPetActionCallBack){
                    this.argc.sendPetActionCallBack(res)
                    this.argc.sendPetActionCallBack = null;
                }

                this._fn_aaa();

                GameEventManager.eventTarget.emit(GameEventManager.EEventName.REFRESH_PET_DATA);

            }
        }else{
            this._fn_ahh("" , res.res? res.res.msg: res.err)
        }
    }



    _fn_adn(propId:number, type:number, successFun:Function = ()=>{}){
        let buyPropPayload = {
            prop_id:propId,
            types:type,
        }

        this.argc.sendBuyPropCallBack = successFun;
        ZcApiGateway.http._fn_xi("/api/buyprop", this._fn_vo.bind(this), buyPropPayload);
    }

    _fn_vo(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let buyPropResponse = res.res.data

                playerDataStore.userInfodata = buyPropResponse.userdata;
                playerDataStore.coinprop = buyPropResponse.coinprop;
                playerDataStore.adProps = buyPropResponse.ad_prop;
                this._fn_aaa();


                this._fn_ahp(buyPropResponse)

                if (this.argc.sendBuyPropCallBack){
                    this.argc.sendBuyPropCallBack(res)
                    this.argc.sendBuyPropCallBack = null;
                }
            }
        }else{
            this._fn_ahh("" , res.res? res.res.msg: res.err)
        }
    }


    _fn_adm(type:number, successFun:Function = ()=>{}){
        let adWatchPayload = {
            types:type,
        }

        this.argc.sendADWatchCallBack = successFun;
        ZcApiGateway.http._fn_xi("/api/adwatch", this._fn_vn.bind(this), adWatchPayload);
    }

    _fn_vn(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let adWatchResponse = res.res.data

                playerDataStore.userInfodata = adWatchResponse.userdata;
                playerDataStore.coinprop = adWatchResponse.coinprop;
                this._fn_aaa();

                this._fn_ahp(adWatchResponse)

                if (this.argc.sendADWatchCallBack){
                    this.argc.sendADWatchCallBack(res)
                    this.argc.sendADWatchCallBack = null;
                }
            }
        }else{
            this._fn_ahh("" , res.res? res.res.msg: res.err)
        }
    }


    _fn_ady(){
        let signPayload = {
        }
        ZcApiGateway.http._fn_xi("/api/sign", this._fn_vv.bind(this), signPayload);
    }

    _fn_vv(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let signResponse = res.res.data

                playerDataStore.coinprop = signResponse.coinprop;
                playerDataStore.userInfodata.user_sign.sign_in_days = signResponse.sign_in_days;
                playerDataStore.userInfodata.user_sign.sign_status = signResponse.sign_status;

                this._fn_ahp(signResponse)

                this._fn_aaa();
            }
        }else{
            this._fn_ahh("" , res.res? res.res.msg: res.err)
        }
    }


    _fn_aee(successFun:Function = ()=>{}){
        let wheelPayload = {

        }

        this.argc.sendWheelCallBack = successFun;
        ZcApiGateway.http._fn_xi("/api/wheel", this._fn_vw.bind(this), wheelPayload);
    }

    _fn_vw(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let wheelResponse = res.res.data

                playerDataStore.coinprop = wheelResponse.coinprop;
                this._fn_aaa();
                if (this.argc.sendWheelCallBack){
                    this.argc.sendWheelCallBack(res)
                    this.argc.sendWheelCallBack = null;
                }
            }
        }else{
            this._fn_ahh("" , res.res? res.res.msg: res.err)
        }
    }


    _fn_adp(type:number, value:string, successFun:Function = ()=>{}){
        let profileChangePayload = {
            types:type,
            value:value,
        }

        this.argc.sendChangeInfoCallBack = successFun;
        ZcApiGateway.http._fn_xi("/api/changeu", this._fn_vp.bind(this), profileChangePayload);
    }

    _fn_vp(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let profileChangeResponse = res.res.data

                playerDataStore.userInfodata = profileChangeResponse.userdata;

                if (this.argc.sendChangeInfoCallBack){
                    this.argc.sendChangeInfoCallBack(res)
                    this.argc.sendChangeInfoCallBack = null;
                }
                this._fn_aaa()
            }
        }else{
            this._fn_ahh("" , res.res? res.res.msg: res.err)
        }
    }


    sendGetTaskList(successFun:Function = ()=>{}){
        let taskListPayload = {
        }
        this.argc.sendGetTaskList = successFun;
        ZcApiGateway.http._fn_xi("/api/task", this._fn_vq.bind(this), taskListPayload);
    }

    _fn_vq(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let taskListResponse = res.res.data

                playerDataStore.taskDataList = taskListResponse.usertask;

                this._fn_aaa();

                if (this.argc.sendGetTaskList){
                    this.argc.sendGetTaskList(res)
                    this.argc.sendGetTaskList = null;
                }
            }
        }else{
            this._fn_ahh("" , res.res? res.res.msg: res.err)
        }
    }


    sendRecivieTaskReward(type:number, successFun:Function = ()=>{}){
        let taskRewardPayload = {
            task_type:type
        }
        this.argc.sendRecivieTaskReward = successFun;
        ZcApiGateway.http._fn_xi("/api/taskdone", this._fn_vu.bind(this), taskRewardPayload);
    }

    _fn_vu(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let taskRewardResponse = res.res.data


                playerDataStore.coinprop = taskRewardResponse.coinprop;
                this._fn_ahp(taskRewardResponse)


                GameHttpClient._fn_ho().sendGetTaskList();

                if (this.argc.sendRecivieTaskReward){
                    this.argc.sendRecivieTaskReward(res)
                    this.argc.sendRecivieTaskReward = null;
                }
            }
        }else{
            this._fn_ahh("" , res.res? res.res.msg: res.err)
        }
    }


    sendGoodPos(types:number,id:number, position_x:number = 0, position_y:number = 0, successFun:Function = ()=>{}){
        let decorationPlacePayload = {
            types:types,
            sole_id:id,
            position_x:position_x,
            position_y:position_y,
        }
        this.argc.sendGoodPos = successFun;
        ZcApiGateway.http._fn_xi("/api/decorationplace", this._fn_vr.bind(this), decorationPlacePayload);
    }

    _fn_vr(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){

                let updatedDecorationRecord = res.res.data.userprop_one

                for (let bagIndex = 0; bagIndex < playerDataStore.bagProps.length; bagIndex++) {
                    const bagRecord:BagPropRecord = playerDataStore.bagProps[bagIndex];
                    if (bagRecord.id == updatedDecorationRecord.id){
                        playerDataStore.bagProps[bagIndex] = updatedDecorationRecord;
                        break;
                    }
                }

                this._fn_aaa();

                GameEventManager.eventTarget.emit(GameEventManager.EEventName.ADD_ZHUNASHI)

                if (this.argc.sendGoodPos){
                    this.argc.sendGoodPos(res)
                    this.argc.sendGoodPos = null;
                }
            }
        }else{
            this._fn_ahh("" , res.res? res.res.msg: res.err)
        }
    }


    updateGold(coin:number = -1, diamond:number = -1, power:number = -1, home_level:number = -1, successFun:Function = ()=>{}){
        let syncCurrencyPayload = {
            "coin":playerDataStore.coin,
            "diamond":playerDataStore.diamonds,
            "power":playerDataStore.power,
            "home_level":playerDataStore.roleLv,
        }
        this.argc.updateGold = successFun;
        ZcApiGateway.http._fn_xi("/api/update", this._fn_wb.bind(this), syncCurrencyPayload);
    }

    _fn_wb(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                console.log("同步数据成功");
                if (this.argc.updateGold){
                    this.argc.updateGold(res)
                    this.argc.updateGold = null;
                }
            }
        }else{
            this._fn_ahh("" , res.res? res.res.msg: res.err)
        }
    }











    _fn_adl(){
        let adCounterPayload = {
        }

        ZcApiGateway.http._fn_xi("/api/adpropcount", this._fn_vm.bind(this), adCounterPayload);
    }

    _fn_vm(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let adCounterResponse = res.res.data

                playerDataStore.adProps = adCounterResponse.ad_prop;
            }
        }else{
            this._fn_ahh("" , res.res? res.res.msg: res.err)
        }
    }


    getFriendList(successFun:Function = ()=>{}){
        let friendListPayload = {
        }
        this.argc.getFriendList = successFun;
        ZcApiGateway.http._fn_xi("/api/friend", this._fn_uq.bind(this), friendListPayload);
    }

    _fn_uq(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let friendRows = res.res.data.friend;

                playerDataStore.friendList = [];
                for (let friendIndex = 0; friendIndex < friendRows.length; friendIndex++) {
                    const friendRow = friendRows[friendIndex];
                    if (friendRow && friendRow.friend_info){
                        playerDataStore.friendList.push(friendRow.friend_info);
                    }
                }

                GameEventManager.eventTarget.emit(GameEventManager.EEventName.REFRESH_FRIEND_DATA);

                if (this.argc.getFriendList){
                    this.argc.getFriendList(res)
                    this.argc.getFriendList = null;
                }
            }
        }else{
            this._fn_ahh("" , res.res? res.res.msg: res.err)
        }
    }


    getFriendSearch(userid:string,successFun:Function = ()=>{}){
        let friendSearchPayload = {
            "userid":userid,
        }
        this.argc.getFriendSearch = successFun;
        ZcApiGateway.http._fn_xi("/api/friendsearch", this._fn_ur.bind(this), friendSearchPayload);
    }

    _fn_ur(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let searchedFriend = res.res.data.user;

                if (!searchedFriend){
                    this._fn_ahh("未找到该用户")
                }

                if (this.argc.getFriendSearch){
                    this.argc.getFriendSearch(res)
                    this.argc.getFriendSearch = null;
                }
            }
        }else{
            this._fn_ahh("" , res.res? res.res.msg: res.err)
        }
    }


    getFriendRecommend(successFun:Function = ()=>{}){
        let friendRecommendPayload = {

        }
        this.argc.getFriendRecommend = successFun;
        ZcApiGateway.http._fn_xi("/api/friendrecommend", this.ongetFriendRecommend.bind(this), friendRecommendPayload);
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
            this._fn_ahh("" , res.res? res.res.msg: res.err)
        }
    }


    getFriendApply(successFun:Function = ()=>{}){
        let friendApplyPayload = {
        }
        this.argc.getFriendApply = successFun;
        ZcApiGateway.http._fn_xi("/api/friendapply", this._fn_uo.bind(this), friendApplyPayload);
    }

    _fn_uo(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){

                let friendApplyRows = res.res.data.friend_apply;
                playerDataStore.curFriendList = [];
                for (let applyIndex = 0; applyIndex < friendApplyRows.length; applyIndex++) {
                    const applyRow = friendApplyRows[applyIndex];
                    if (applyRow && applyRow.friend_info){
                        playerDataStore.curFriendList.push(applyRow.friend_info);
                    }
                }
                GameEventManager.eventTarget.emit(GameEventManager.EEventName.REFRESH_FRIEND_DATA);
                if (this.argc.getFriendApply){
                    this.argc.getFriendApply(res)
                    this.argc.getFriendApply = null;
                }
            }
        }else{
            this._fn_ahh("" , res.res? res.res.msg: res.err)
        }
    }


    getFriendAdd(userid:string,successFun:Function = ()=>{}){
        let friendAddPayload = {
            "userid":userid,
        }
        this.argc.getFriendAdd = successFun;
        ZcApiGateway.http._fn_xi("/api/friendadd", this._fn_un.bind(this), friendAddPayload);
    }

    _fn_un(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res){

                this._fn_ahh("添加好友，申请发送成功")


                if (this.argc.getFriendAdd){
                    this.argc.getFriendAdd(res)
                    this.argc.getFriendAdd = null;
                }
            }
        }else{
            this._fn_ahh("" , res.res? res.res.msg: res.err)
        }
    }


    getFriendApplyaction(userid:string,type:number,successFun:Function = ()=>{}){
        let friendApplyActionPayload = {
            "apply_id":userid,
            "type":type,
        }
        this.argc.getFriendApplyaction = successFun;
        ZcApiGateway.http._fn_xi("/api/friendapplyaction", this._fn_up.bind(this), friendApplyActionPayload);
    }

    _fn_up(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){

                this._fn_ahh("操作成功")
                this.getFriendList();
                if (this.argc.getFriendApplyaction){
                    this.argc.getFriendApplyaction(res)
                    this.argc.getFriendApplyaction = null;
                }
            }
        }else{
            this._fn_ahh("" , res.res? res.res.msg: res.err)
        }
    }


    _fn_adk(successFun:Function = ()=>{}){
        let activityDrawPayload = {
        }
        this.argc.sendWheelCallBack = successFun;
        ZcApiGateway.http._fn_xi("/api/activity", this._fn_vl.bind(this), activityDrawPayload);
    }

    _fn_vl(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let activityDrawResponse = res.res.data

                playerDataStore.userInfodata.activity_count = activityDrawResponse.activity_count;
                playerDataStore.userInfodata.activity_progress = activityDrawResponse.activity_progress;

                this._fn_ahq(activityDrawResponse.draw_gift);

                if (this.argc.sendWheelCallBack){
                    this.argc.sendWheelCallBack(res)
                    this.argc.sendWheelCallBack = null;
                }
            }
        }else{
            this._fn_ahh("" , res.res? res.res.msg: res.err)
        }
    }


    _fn_adu(prossId:number, successFun:Function = ()=>{}){
        let activityProgressPayload = {
            activity_progress_id: prossId,
        }
        this.argc.sendWheelCallBack = successFun;
        ZcApiGateway.http._fn_xi("/api/activityprogressaward", this._fn_vt.bind(this), activityProgressPayload);
    }

    _fn_vt(res:HttpResponsePacket){
        if (res.res && res.res.code == 200){
            if (res.res.data){
                let activityProgressResponse = res.res.data

                playerDataStore.userInfodata.activity_progress = activityProgressResponse.activity_progress;

                this._fn_ahq(activityProgressResponse.activity_progress_award);

                playerDataStore.coinprop = activityProgressResponse.userprop;

                this._fn_aaa();
                if (this.argc.sendWheelCallBack){
                    this.argc.sendWheelCallBack(res)
                    this.argc.sendWheelCallBack = null;
                }
            }
        }else{
            this._fn_ahh("" , res.res? res.res.msg: res.err)
        }
    }





    _fn_aaa(isGetTask:boolean = true){
        GameEventManager.eventTarget.emit(GameEventManager.EEventName.REFRESH_GAME);




        Notifications.emit(GD.event.updateMoney);
        Notifications.emit(GD.event.updateGame);
    }

    _fn_ahp(res:any){
        if (res && res.rewards){
            let rewardRows = res.rewards;
            this._fn_ahq(rewardRows);
        }
    }

    _fn_ahq(rewards:any[]){
        let rewardItemRecords = [];
            for (let rewardIndex = 0; rewardIndex < rewards.length; rewardIndex++) {
                const rewardRow = rewards[rewardIndex];
                if (rewardRow && rewardRow.length >= 2){
                    rewardItemRecords.push([rewardRow[0], rewardRow[1], GoodsType.propNew])
                }
            }
            if (rewardItemRecords.length > 0){
                UiLayerService.instance._fn_xw(Const.Dialogs.RewardDialog, { reward: rewardItemRecords })
            }
    }

    _fn_ahh(str:string,  msg:string = "") {

            GameEventManager.eventTarget.emit(GameEventManager.EEventName.SHOW_TIP, (str + msg))



    }

}

