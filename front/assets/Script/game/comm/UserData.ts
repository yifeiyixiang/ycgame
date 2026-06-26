import { find, js, v3, Vec3,Sprite,assetManager,SpriteFrame,ImageAsset,Texture2D } from "cc";
import { Const } from "../../config/Const";
import { ActivityLockType, GoodsType, TujianState } from "../../config/global";
import { GameStorage } from "../../easyFramework/mgr/gameStorage";
import { UiLayerService } from "../../easyFramework/mgr/uiManager";
import { default as ServerCtr, default as ServerCtrJSF } from "../../easyFramework/network/ServerCtrJSF";
import TimeCtrJSF from "../../easyFramework/network/TimeCtrJSF";
import TableDataService from "../../easyFramework/other/tables";
import { aiRobot } from "./AIRobot";
import { mergeBoardStateStore } from "./mergeBoardModel";
import { GetAnimalLayer } from "./GetAnimalLayer";
import { seasonProgressStore } from "./playerModel";
import { AdRewardCounterRecord, BagPropRecord, FriendProfileRecord, PetProfileRecord, WalletPropCountRecord, TaskProgressRecord, UserProfileRecord } from "../../../typeScript/gameData";
import { GameHttpClient } from "../../../typeScript/net/HttpClient";
import { GamePlatform } from '../platform/GamePlatform';


class PlayerDataStore {
    private static _instance: PlayerDataStore = null!
    private static _isMergeSave = false;


    public sceneStau:number = 1;


    public userInfodata!: UserProfileRecord;


    public activity: number = 1;


    public bagProps:BagPropRecord[] = [];


    public pet_count:number = 0;


    public pet_score:number = 0;


    public pets:PetProfileRecord[] = [];


    public friendList:FriendProfileRecord[] = [];


    public curFriendList:FriendProfileRecord[] = [];


    public taskDataList:TaskProgressRecord[] = [];


    public adProps:AdRewardCounterRecord[] = [];


    public goodIsCanOperate: boolean = false;

    public static getInstance() {
        if (this._instance == null) {
            this._instance = new PlayerDataStore()
        }
        return this._instance
    }

    public set coinprop(coinprop:WalletPropCountRecord[]) {
        for (let coinPropIndex = 0; coinPropIndex < coinprop.length; coinPropIndex++) {
            const coinPropRecord = coinprop[coinPropIndex];
            if (coinPropRecord.prop_id == 101){
                this.coin = coinPropRecord.prop_count;
            }
            else if (coinPropRecord.prop_id == 103){
                this.power = coinPropRecord.prop_count;
            }
            else if (coinPropRecord.prop_id == 102){
                this.diamonds = coinPropRecord.prop_count;
            }
        }
    }




    public get roleAvatar() {
        return GameStorage.getString(Const.DataKeys.roleAvatar, ServerCtr.GetInstance().avatar)
    }

    public set roleAvatar(roleAvatar) {
        GameStorage.setString(Const.DataKeys.roleAvatar, roleAvatar)
    }



    public get roleName() {
        return GameStorage.getString(Const.DataKeys.roleName, ServerCtrJSF.GetInstance().nickName)
    }

    public set roleName(name) {
        GameStorage.setString(Const.DataKeys.roleName, name)
    }




    public get roleID() {
        return ServerCtr.GetInstance().uid
    }

    public set roleID(id) {
        ServerCtr.GetInstance().uid = id
        GameStorage.setString(Const.DataKeys.roleID, id)
    }



    public get roleLv() {
        return GameStorage.getInt(Const.DataKeys.roleLv, 1)
    }

    public set roleLv(lv) {
        GameStorage.setInt(Const.DataKeys.roleLv, lv)
        mergeBoardStateStore.addManagerVal(Const.ManagerTypes.roleLv);


        seasonProgressStore.roleLvUp();

        this.checkActivityOpen()
        GameHttpClient.getInstance().updateGold()
    }




    public get roleExp() {
        return GameStorage.getInt(Const.DataKeys.roleExp, 0)
    }

    public set roleExp(lv) {
        GameStorage.setInt(Const.DataKeys.roleExp, lv)
    }

    public checkAndUseExp(num: any) {
        if (this.roleExp >= num) {
            this.roleExp -= num
            return true
        }
        return false
    }





    public propWarehouse(id: number) {
        return GameStorage.getObject(Const.DataKeys.warehouseProp, [])
    }

    public pushPropWarehouse(id: number) {
        let list = GameStorage.getObject(Const.DataKeys.warehouseProp, [])
        list.push(id)
        GameStorage.setObject(Const.DataKeys.warehouseProp, list)
    }

    public shiftPropWarehouse(id: number) {
        let list = GameStorage.getObject(Const.DataKeys.warehouseProp, [])
        if (list.length > 0) {
            return list.shift()
        } else {
            return null
        }
    }




    public get avatarLookId() {
        let lookId = GameStorage.getInt(Const.DataKeys.avatarLookId, 0)
        if (lookId == 0) {
            lookId = GameStorage.getInt(Const.DataKeys.legacyAvatarLookId, 0)
            if (lookId > 0) {
                this.avatarLookId = lookId
                return lookId
            }
        }
        if (lookId == 0) {
            let avatarStyleRows = TableDataService.ins().getTableValuesByType(Const.Tables.avatarStyle, "type", "2")
            for (let styleIndex = 0; styleIndex < avatarStyleRows.length; styleIndex++) {
                const avatarStyleRow = avatarStyleRows[styleIndex];
                if (avatarStyleRow.price == 0) {
                    lookId = avatarStyleRow.id
                    this.avatarLookId = lookId
                    this.unlockAvatarLook(lookId)
                    return lookId
                }
            }
        }
        return lookId
    }

    public set avatarLookId(id: number) {
        GameStorage.setInt(Const.DataKeys.avatarLookId, id)
    }

    public isAvatarLookOwned(id: number) {
        let owned = GameStorage.getInt(Const.DataKeys.avatarLookOwned + id, 0)
        if (owned == 1) {
            return true
        }
        return GameStorage.getInt(Const.DataKeys.legacyAvatarLookId + id, 0) == 1
    }

    public unlockAvatarLook(id: number) {
        return GameStorage.setInt(Const.DataKeys.avatarLookOwned + id, 1)
    }



    public get diamonds() {
        return GameStorage.getInt(Const.DataKeys.diamonds, TableDataService.ins().config[Const.config.basicDiamons])
    }

    public set diamonds(num) {
        GameStorage.setInt(Const.DataKeys.diamonds, num)
        GameHttpClient.getInstance().updateGold()
    }

    public checkAndUseDiamonds(num: number) {
        if (this.diamonds >= num) {
            this.diamonds -= num
            return true
        }

        UiLayerService.instance.showDialog(Const.Dialogs.FreeGiftDialog, { type: "1" })

        return false
    }


    public get power() {
        return GameStorage.getInt(Const.DataKeys.power, TableDataService.ins().config[Const.config.energyMax])
    }

    public set power(num) {
        GameStorage.setInt(Const.DataKeys.power, num)
        GameHttpClient.getInstance().updateGold()
    }

    public checkAndUsePower(num: number) {
        if (this.power >= num) {
            this.power -= num
            return true
        }
        UiLayerService.instance.showDialog(Const.Dialogs.FreeGiftDialog, { type: "2" })
        return false
    }


    public get coin() {
        return GameStorage.getInt(Const.DataKeys.coin, TableDataService.ins().config[Const.config.basicGold])
    }

    public set coin(num) {
        GameStorage.setInt(Const.DataKeys.coin, num)
        GameHttpClient.getInstance().updateGold()
    }

    public checkAndUseCoin(num: number) {
        if (this.coin >= num) {
            this.coin -= num
            return true
        }
        UiLayerService.instance.showDialog(Const.Dialogs.FreeGiftDialog, { type: "4" })
        return false
    }


    public get dressValue() {
        return GameStorage.getInt(Const.DataKeys.dressValue, TableDataService.ins().config[Const.config.basicDress])
    }

    public set dressValue(num) {
        GameStorage.setInt(Const.DataKeys.dressValue, num)
    }


    public get styleVoucher() {
        let voucher = GameStorage.getInt(Const.DataKeys.styleVoucher, -1)
        if (voucher >= 0) {
            return voucher
        }
        return GameStorage.getInt(Const.DataKeys.legacyStyleVoucher, TableDataService.ins().config[Const.config.basicStyleVoucher])
    }

    public set styleVoucher(num) {
        GameStorage.setInt(Const.DataKeys.styleVoucher, num)
    }

    public checkAndUseStyleVoucher(num: number) {
        if (this.styleVoucher >= num) {
            this.styleVoucher -= num
            return true
        }
        UiLayerService.instance.showDialog(Const.Dialogs.FreeGiftDialog, { type: "3" })
        return false
    }

    public get greenStar() {
        return GameStorage.getInt(Const.DataKeys.greenStar, TableDataService.ins().config[Const.config.basicGreenStar])
    }


    public set greenStar(num) {
        GameStorage.setInt(Const.DataKeys.greenStar, num)
    }

    public checkAndUseGreenStar(num: number) {
        if (this.greenStar >= num) {
            this.greenStar -= num
            aiRobot.addStarCost(num);
            return true
        }
        return false
    }





    public getProp(args: any, starPos: Vec3 | null, endPos: Vec3 | null) {
        let applyRewardProp = (rewardProp: any, rewardAmount: number) => {
            switch (rewardProp.type) {
                case GoodsType.Coin:
                    this.coin += rewardAmount
                    break;
                case GoodsType.Diamonds:
                    this.diamonds += rewardAmount
                    break;
                case GoodsType.Exp:
                    this.roleExp += rewardAmount
                    break;
                case GoodsType.Power:
                    this.power += rewardAmount
                    break;
                case GoodsType.GreenStar:
                    this.greenStar += rewardAmount
                    break;
                case GoodsType.StyleVoucher:
                    this.styleVoucher += rewardAmount
                    break;
                default:
                    break;
            }
            if (starPos && endPos) {
                this.showResFly(rewardProp.id, rewardAmount, starPos, endPos)
            }
        }

        let rewardProp = null
        let rewardAmount = 0
        if (typeof (args) == "string") {
            let reward = args.split(",")
            rewardProp = TableDataService.ins().getTableValueByID(Const.Tables.prop, parseInt(reward[0]))
            rewardAmount = parseInt(reward[1])
            applyRewardProp(rewardProp, rewardAmount)
        } else if (args instanceof Array && args.length > 0) {
            if (args[0] instanceof Array) {
                for (let rewardIndex = 0; rewardIndex < args.length; rewardIndex++) {
                    const rewardEntry = args[rewardIndex];
                    rewardProp = TableDataService.ins().getTableValueByID(Const.Tables.prop, rewardEntry[0])
                    rewardAmount = parseInt(rewardEntry[1])
                    applyRewardProp(rewardProp, rewardAmount)
                }
            } else if (args instanceof Array) {
                rewardProp = TableDataService.ins().getTableValueByID(Const.Tables.prop, args[0])
                rewardAmount = parseInt(args[1])
                applyRewardProp(rewardProp, rewardAmount)
            }
        }
    }

    public showResFly(propId: number, num = 1, startPos: Vec3 = v3(0, 0, 0), endPos: Vec3 = v3(0, 0, 0)) {
        let showNum = Math.min(num, 10)
        let getAnimalLayer = find("Canvas")!.getChildByName("GetAnimalLayer")
        if (getAnimalLayer) {
            let script = getAnimalLayer.getComponent(GetAnimalLayer) as GetAnimalLayer
            if (script) {
                script!._layerData = { propId: propId, startPos: startPos, endPos: endPos, num: showNum }
                script!.showAni()
            }
            return
        }
        UiLayerService.instance.showDialog(Const.Prefabs.GetAnimalLayer, { propId: propId, startPos: startPos, endPos: endPos, num: showNum })








    }

    public checkAndUseProp(args: any) {
        if (args instanceof Array) {
            let propdata = TableDataService.ins().getTableValueByID(Const.Tables.prop, parseInt(args[0]))
            if (propdata.type == GoodsType.Coin) {
                return this.checkAndUseCoin(args[1])
            } else if (propdata.type == GoodsType.Diamonds) {
                return this.checkAndUseDiamonds(args[1])
            } else if (propdata.type == GoodsType.StyleVoucher) {
                return this.checkAndUseStyleVoucher(args[1])
            } else if (propdata.type == GoodsType.GreenStar) {
                return this.checkAndUseGreenStar(args[1])
            } else if (propdata.type == GoodsType.Power) {
                return this.checkAndUsePower(args[1])
            }
        }
        return false
    }

    public curPropNum(id: number) {
        let propdata = TableDataService.ins().getTableValueByID(Const.Tables.prop, id)
        if (propdata.type == GoodsType.Coin) {
            return this.coin
        } else if (propdata.type == GoodsType.Diamonds) {
            return this.diamonds
        } else if (propdata.type == GoodsType.StyleVoucher) {
            return this.styleVoucher
        } else if (propdata.type == GoodsType.GreenStar) {
            return this.greenStar
        } else if (propdata.type == GoodsType.Power) {
            return this.power
        } else if (propdata.type == GoodsType.Exp) {
            return this.roleExp
        }
        return 0
    }


    public propBuyTime(id: number) {
        return GameStorage.getInt(Const.DataKeys.propBuyTime + id, 0)
    }

    public addPropBuyTime(id: number) {
        return GameStorage.setInt(Const.DataKeys.propBuyTime + id, this.propBuyTime(id) + 1)
    }


    private _tujianArr: any = []
    public get TujianArr() {
        if (this._tujianArr.length < 6) {
            let propData = TableDataService.ins().getTable(Const.Tables.prop)
            propData.forEach((element: any, index: number) => {
                if (!this._tujianArr[element.type - 1] && element.type >= 1 && element.type <= 6) {
                    this._tujianArr[element.type - 1] = element
                }
            });
        }
        return this._tujianArr
    }


    private _tujianSceneArr: any = []
    public get TujianSceneArr() {
        if (this._tujianSceneArr.length < 4) {
            let propData = TableDataService.ins().getTable(Const.Tables.scene_room)
            propData.forEach((element: any, index: number) => {
                if (!this._tujianSceneArr[element.complete] && element.complete > 0) {
                    this._tujianSceneArr[element.complete - 1] = element
                }
            });
        }
        return this._tujianSceneArr
    }

    public isGetPropTujian(propId: number, key = Const.DataKeys.tujianProp) {
        return GameStorage.getInt(key + propId, 0)
    }

    public setGetPropTujian(propId: number, state: TujianState, key = Const.DataKeys.tujianProp) {
        if (state == TujianState.geted && GameStorage.getInt(key + propId, 0) == TujianState.unGet) {
            GameStorage.setInt(key + propId, TujianState.geted)
            if (key == Const.DataKeys.tujianProp) {
                this._showPropTujianRed = true
            } else {
                this._showSceneTujianRed = true
            }
        } else if (state == TujianState.received && GameStorage.getInt(key + propId, 0) == TujianState.geted) {
            GameStorage.setInt(key + propId, TujianState.received)
            if (key == Const.DataKeys.tujianProp) {
                this._showPropTujianRed = this.checkTujianRedPoint()
            } else {
                this._showSceneTujianRed = this.checkTujianSceneRedPoint()
            }
        }
    }

    public _showPropTujianRed = false
    public _showSceneTujianRed = false


    public checkTujianRedPoint(type = 0) {
        if (type > 0) {
            let propRows = TableDataService.ins().getTableValuesByType(Const.Tables.prop, "type", type)
            if (!propRows) {
                return false
            }
            for (let propIndex = 0; propIndex < propRows.length; propIndex++) {
                const propRow = propRows[propIndex];
                if (this.isGetPropTujian(propRow.id) == TujianState.geted) {
                    return true
                }
            }
        } else {
            let propRows = TableDataService.ins().getTable(Const.Tables.prop)
            if (!propRows) {
                return false
            }
            for (let propIndex = 0; propIndex < propRows.length; propIndex++) {
                const propRow = propRows[propIndex];

                if (propRow.type >= 1 && propRow.type <= 6 && this.isGetPropTujian(propRow.id) == TujianState.geted) {
                    return true
                }
            }
        }

        return false
    }

    public checkTujianSceneRedPoint(id = 0) {
        if (id > 0) {
            let sceneItemRows = TableDataService.ins().getTableValuesByType(Const.Tables.scene_item, "room", id)
            for (let sceneItemIndex = 0; sceneItemIndex < sceneItemRows.length; sceneItemIndex++) {
                const sceneItemRow = sceneItemRows[sceneItemIndex];
                let sceneSkinRows = TableDataService.ins().getTableValuesByType(Const.Tables.scene_skin, "scene", sceneItemRow.id)
                sceneSkinRows.forEach(skin => {
                    let skinOffset = skin.id % sceneItemRow.id
                    if (skinOffset > 0) {
                        if (playerDataStore.isGetPropTujian(skin.id, Const.DataKeys.tujianScene) == TujianState.geted) {
                            return true
                        }
                    }
                })
            }
            return false
        } else {
            let roomRows = TableDataService.ins().getTable(Const.Tables.scene_room)
            for (let roomIndex = 0; roomIndex < roomRows.length; roomIndex++) {
                if (roomRows[roomIndex].complete > 0) {
                    let sceneItemRows = TableDataService.ins().getTableValuesByType(Const.Tables.scene_item, "room", roomRows[roomIndex].id)
                    for (let sceneItemIndex = 0; sceneItemIndex < sceneItemRows.length; sceneItemIndex++) {
                        const sceneItemRow = sceneItemRows[sceneItemIndex];
                        let sceneSkinRows = TableDataService.ins().getTableValuesByType(Const.Tables.scene_skin, "scene", sceneItemRow.id)
                        for (let skinIndex = 0; skinIndex < sceneSkinRows.length; skinIndex++) {
                            const skin = sceneSkinRows[skinIndex];
                            let skinOffset = skin.id % sceneItemRow.id
                            if (skinOffset > 0) {
                                if (playerDataStore.isGetPropTujian(skin.id, Const.DataKeys.tujianScene) == TujianState.geted) {
                                    return true
                                }
                            }
                        }
                    }
                }
            }
            return false
        }

    }

    public isGrowUpunLock(lv: number) {
        if (this.roleLv >= lv) {
            return GameStorage.getInt(Const.DataKeys.growUp + lv, TujianState.geted)
        }
        return TujianState.unGet
    }

    public setGrowUpState(lv: number, state: number) {
        GameStorage.setInt(Const.DataKeys.growUp + lv, state)
    }

    public savePropData() {





    }

    public get buyPowerTime() {
        let curTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)

        let lastTime = GameStorage.getInt(Const.DataKeys.buyPowerTime + "time", 0)
        if (lastTime > 0 && TimeCtrJSF.isSameDay(curTime, lastTime)) {
            GameStorage.setInt(Const.DataKeys.buyPowerTime + "time", curTime)
            let buyTime = GameStorage.getInt(Const.DataKeys.buyPowerTime, 1)
            return buyTime
        } else {
            GameStorage.setInt(Const.DataKeys.buyPowerTime, 1)
            GameStorage.setInt(Const.DataKeys.buyPowerTime + "time", curTime)
            return 1
        }
    }

    public addBuyPowerTime() {
        let buyTime = GameStorage.getInt(Const.DataKeys.buyPowerTime, 1)
        GameStorage.setInt(Const.DataKeys.buyPowerTime, buyTime * TableDataService.ins().config[Const.config.diamonsPower][2])
    }

    public saveItem(key: string, value: any) {
        if (PlayerDataStore._isMergeSave) {
            return
        }
        GameStorage.setObject(key, value)
    }

    public saveData() {
        let obj = js.createMap(true);
        for (let key in this) {
            if (key.indexOf('$') != -1) {
                obj[key] = this[key];
            }
        }
    }

    public checkActivityOpen() {
        let activityRows = TableDataService.ins().getTable(Const.Tables.lockActivity_item)
        activityRows.forEach((activity: any) => {
            if (activity.cdType == ActivityLockType.type_Level) {
                if (this.roleLv >= activity.openLevel) {
                    let lastTime = GameStorage.getInt(activity.dataKey + "_time", 0)
                    if (lastTime <= 0) {
                        let curTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
                        GameStorage.setInt(activity.dataKey + "_time", curTime)
                    }
                }
            }
        });
    }







    public checkCDTime(key: string, time: number, startTime: number = 0) {
        let lastTime = GameStorage.getInt(key + "_time", 0) || startTime
        let currentTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
        if (lastTime <= 0) {
            GameStorage.setInt(key + "_time", currentTime)
            lastTime = currentTime
        }
        let elapsedSeconds = Math.floor((currentTime - lastTime) / 1000)
        let gainedCount = 0
        if (elapsedSeconds > time) {
            gainedCount = Math.floor(elapsedSeconds / time)
            lastTime += time * 1000
            GameStorage.setInt(key + "_time", currentTime)
            elapsedSeconds = elapsedSeconds % time
        }

        let remainingSeconds = time - elapsedSeconds
        if (remainingSeconds <= 0) {
            remainingSeconds = 0
            GameStorage.setInt(key + "_time", 0)
        }
        return [gainedCount, remainingSeconds]
    }

    public clearCDTime(key: string) {
        GameStorage.setInt(key + "_time", 0)
    }

    public checkEndTime(key: string, endTime: number) {
        let currentTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
        let remainingSeconds = endTime - currentTime
        return remainingSeconds / 1000
    }

    public checkLimitTime(key: string, limitTime: number) {
        let startTime = GameStorage.getInt(key + "_time", 0)
        if (startTime <= 0) {
            return 0
        }
        let endTime = startTime + limitTime
        let currentTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
        return endTime - currentTime
    }







    public getReceiveTime(key: string, interval: number) {
        let lastTime = GameStorage.getInt(key + "_time", 0)
        let currentTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
        if (lastTime <= 0) {
            GameStorage.setInt(key + "_time", currentTime)
            return GameStorage.getInt(key, 0)
        }
        if (TimeCtrJSF.isSameInterval(currentTime, lastTime, interval)) {
            return GameStorage.getInt(key, 0)
        } else {
            GameStorage.setInt(key + "_time", currentTime)
            GameStorage.setInt(key, 0)
            return 0
        }
    }








    public getActivityReceiveTime(key: string) {
        return GameStorage.getInt(key, 0)
    }
    public setActivityReceiveTime(key: string) {
        return GameStorage.setInt(key, this.getActivityReceiveTime(key) + 1)
    }

    public setReceiveTime(key: string, interval: number) {
        GameStorage.setInt(key, this.getReceiveTime(key, interval) + 1)
    }

    public getIntervalCD(key: string, interval: number): number {

        if (interval <= 24 * 60) {
            let currentTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
            let currentDate = new Date(currentTime)
            let currentMinuteOfDay = currentDate.getHours() * 60 + currentDate.getMinutes()
            let elapsedIntervalMinutes = currentMinuteOfDay % interval
            return (interval - elapsedIntervalMinutes) * 60 - currentDate.getSeconds()
        } else if (interval <= 24 * 60 * 7) {
            let currentTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
            let currentDate = new Date(currentTime)
            return (7 - currentDate.getDay()) * 24 * 60 * 60 + this.getIntervalCD(key, 24 * 60);
        } else {
            let currentTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
            let year = new Date(currentTime).getFullYear()
            let month = new Date(currentTime).getMonth()
            let monthEndTime = new Date(year, month + 1, 0).getTime()
            return (monthEndTime - currentTime) / 1000
        }
    }

    public getLimitTimeData(key: string, interval: number, fallbackData: any, force: boolean = false, refreshCallback: Function | undefined = undefined) {
        let lastTime = GameStorage.getInt(key + "_time", 0)
        let currentTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
        if (lastTime <= 0 || force) {
            GameStorage.setInt(key + "_time", currentTime)
            GameStorage.setObject(key + "object", fallbackData)
            refreshCallback && refreshCallback(true)
            return fallbackData
        }
        if (TimeCtrJSF.isSameInterval(currentTime, lastTime, interval)) {
            refreshCallback && refreshCallback(false)
            return GameStorage.getObject(key + "object", fallbackData)
        } else {
            GameStorage.setInt(key + "_time", currentTime)
            GameStorage.setObject(key + "object", fallbackData)
            refreshCallback && refreshCallback(true)
            return fallbackData
        }
    }







    public getIntervalData(key: string, interval: number, fallbackText: string) {
        let lastTime = GameStorage.getInt(key + "_time", 0)
        let currentTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
        if (lastTime <= 0) {
            GameStorage.setInt(key + "_time", currentTime)
            return GameStorage.getString(key, "")
        }
        if (TimeCtrJSF.isSameInterval(currentTime, lastTime, interval)) {
            return GameStorage.getString(key, "")
        } else {
            GameStorage.setInt(key + "_time", currentTime)
            GameStorage.setString(key, "")
            return ""
        }
    }

    public setIntervarData(key: string, interval: number, storedText: string) {
        let currentTime = Math.floor(TimeCtrJSF.GetInstance().ServerTime)
        GameStorage.setInt(key + "_time", currentTime)
        GameStorage.setString(key, storedText)
    }

    public showGodWealthOther() {
        if (mergeBoardStateStore.isHandDone()) {
            let launchQuery = GamePlatform.getLaunchQuery()
            console.error("params = ", launchQuery)

            if (launchQuery && launchQuery.shareUserId) {
                let sharedPropList = launchQuery.propList
                launchQuery.propList = sharedPropList.split(",")
                console.error("params2 = ", launchQuery)

                if (launchQuery.shareUserId == playerDataStore.roleID + "") {
                    UiLayerService.instance.showDialog(Const.Dialogs.GodWealthLayer);
                } else {
                    UiLayerService.instance.showDialog(Const.Dialogs.GodWealthOther, { params: launchQuery });
                }
                launchQuery = null
            }
        }
    }


    public replaceHead(sp:Sprite, remoteUrl:string){
        if (remoteUrl == undefined || remoteUrl == null){
            return;
        }














        assetManager.loadRemote<ImageAsset>(remoteUrl, {ext: '.png'}, function (err, imageAsset) {
            const spriteFrame = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = imageAsset;
            spriteFrame.texture = texture;
            sp.spriteFrame = spriteFrame;
        });

    }


}


export const playerDataStore = PlayerDataStore.getInstance();
