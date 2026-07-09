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

    public static _fn_ho() {
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
        return GameStorage._fn_lq(Const.DataKeys.roleAvatar, ServerCtr._fn_hp().avatar)
    }

    public set roleAvatar(roleAvatar) {
        GameStorage._fn_ago(Const.DataKeys.roleAvatar, roleAvatar)
    }



    public get roleName() {
        return GameStorage._fn_lq(Const.DataKeys.roleName, ServerCtrJSF._fn_hp().nickName)
    }

    public set roleName(name) {
        GameStorage._fn_ago(Const.DataKeys.roleName, name)
    }




    public get roleID() {
        return ServerCtr._fn_hp().uid
    }

    public set roleID(id) {
        ServerCtr._fn_hp().uid = id
        GameStorage._fn_ago(Const.DataKeys.roleID, id)
    }



    public get roleLv() {
        return GameStorage._fn_hr(Const.DataKeys.roleLv, 1)
    }

    public set roleLv(lv) {
        GameStorage._fn_aey(Const.DataKeys.roleLv, lv)
        mergeBoardStateStore._fn_h(Const.ManagerTypes.roleLv);


        seasonProgressStore._fn_acc();

        this._fn_be()
        GameHttpClient._fn_ho().updateGold()
    }




    public get roleExp() {
        return GameStorage._fn_hr(Const.DataKeys.roleExp, 0)
    }

    public set roleExp(lv) {
        GameStorage._fn_aey(Const.DataKeys.roleExp, lv)
    }

    public _fn_bh(num: any) {
        if (this.roleExp >= num) {
            this.roleExp -= num
            return true
        }
        return false
    }





    public _fn_xs(id: number) {
        return GameStorage._fn_io(Const.DataKeys.warehouseProp, [])
    }

    public _fn_xv(id: number) {
        let list = GameStorage._fn_io(Const.DataKeys.warehouseProp, [])
        list.push(id)
        GameStorage._fn_afh(Const.DataKeys.warehouseProp, list)
    }

    public _fn_agy(id: number) {
        let list = GameStorage._fn_io(Const.DataKeys.warehouseProp, [])
        if (list.length > 0) {
            return list.shift()
        } else {
            return null
        }
    }




    public get avatarLookId() {
        let lookId = GameStorage._fn_hr(Const.DataKeys.avatarLookId, 0)
        if (lookId == 0) {
            lookId = GameStorage._fn_hr(Const.DataKeys.legacyAvatarLookId, 0)
            if (lookId > 0) {
                this.avatarLookId = lookId
                return lookId
            }
        }
        if (lookId == 0) {
            let avatarStyleRows = TableDataService.ins()._fn_mb(Const.Tables.avatarStyle, "type", "2")
            for (let styleIndex = 0; styleIndex < avatarStyleRows.length; styleIndex++) {
                const avatarStyleRow = avatarStyleRows[styleIndex];
                if (avatarStyleRow.price == 0) {
                    lookId = avatarStyleRow.id
                    this.avatarLookId = lookId
                    this._fn_aji(lookId)
                    return lookId
                }
            }
        }
        return lookId
    }

    public set avatarLookId(id: number) {
        GameStorage._fn_aey(Const.DataKeys.avatarLookId, id)
    }

    public _fn_pq(id: number) {
        let owned = GameStorage._fn_hr(Const.DataKeys.avatarLookOwned + id, 0)
        if (owned == 1) {
            return true
        }
        return GameStorage._fn_hr(Const.DataKeys.legacyAvatarLookId + id, 0) == 1
    }

    public _fn_aji(id: number) {
        return GameStorage._fn_aey(Const.DataKeys.avatarLookOwned + id, 1)
    }



    public get diamonds() {
        return GameStorage._fn_hr(Const.DataKeys.diamonds, TableDataService.ins().config[Const.config.basicDiamons])
    }

    public set diamonds(num) {
        GameStorage._fn_aey(Const.DataKeys.diamonds, num)
        GameHttpClient._fn_ho().updateGold()
    }

    public _fn_bg(num: number) {
        if (this.diamonds >= num) {
            this.diamonds -= num
            return true
        }

        UiLayerService.instance._fn_ahg(Const.Dialogs.FreeGiftDialog, { type: "1" })

        return false
    }


    public get power() {
        return GameStorage._fn_hr(Const.DataKeys.power, TableDataService.ins().config[Const.config.energyMax])
    }

    public set power(num) {
        GameStorage._fn_aey(Const.DataKeys.power, num)
        GameHttpClient._fn_ho().updateGold()
    }

    public _fn_bj(num: number) {
        if (this.power >= num) {
            this.power -= num
            return true
        }
        UiLayerService.instance._fn_ahg(Const.Dialogs.FreeGiftDialog, { type: "2" })
        return false
    }


    public get coin() {
        return GameStorage._fn_hr(Const.DataKeys.coin, TableDataService.ins().config[Const.config.basicGold])
    }

    public set coin(num) {
        GameStorage._fn_aey(Const.DataKeys.coin, num)
        GameHttpClient._fn_ho().updateGold()
    }

    public _fn_bf(num: number) {
        if (this.coin >= num) {
            this.coin -= num
            return true
        }
        UiLayerService.instance._fn_ahg(Const.Dialogs.FreeGiftDialog, { type: "4" })
        return false
    }


    public get dressValue() {
        return GameStorage._fn_hr(Const.DataKeys.dressValue, TableDataService.ins().config[Const.config.basicDress])
    }

    public set dressValue(num) {
        GameStorage._fn_aey(Const.DataKeys.dressValue, num)
    }


    public get styleVoucher() {
        let voucher = GameStorage._fn_hr(Const.DataKeys.styleVoucher, -1)
        if (voucher >= 0) {
            return voucher
        }
        return GameStorage._fn_hr(Const.DataKeys.legacyStyleVoucher, TableDataService.ins().config[Const.config.basicStyleVoucher])
    }

    public set styleVoucher(num) {
        GameStorage._fn_aey(Const.DataKeys.styleVoucher, num)
    }

    public _fn_bl(num: number) {
        if (this.styleVoucher >= num) {
            this.styleVoucher -= num
            return true
        }
        UiLayerService.instance._fn_ahg(Const.Dialogs.FreeGiftDialog, { type: "3" })
        return false
    }

    public get greenStar() {
        return GameStorage._fn_hr(Const.DataKeys.greenStar, TableDataService.ins().config[Const.config.basicGreenStar])
    }


    public set greenStar(num) {
        GameStorage._fn_aey(Const.DataKeys.greenStar, num)
    }

    public _fn_bi(num: number) {
        if (this.greenStar >= num) {
            this.greenStar -= num
            aiRobot._fn_r(num);
            return true
        }
        return false
    }





    public _fn_jk(args: any, starPos: Vec3 | null, endPos: Vec3 | null) {
        let _fn_w = (rewardProp: any, rewardAmount: number) => {
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
                this._fn_aho(rewardProp.id, rewardAmount, starPos, endPos)
            }
        }

        let rewardProp = null
        let rewardAmount = 0
        if (typeof (args) == "string") {
            let reward = args.split(",")
            rewardProp = TableDataService.ins()._fn_ly(Const.Tables.prop, parseInt(reward[0]))
            rewardAmount = parseInt(reward[1])
            _fn_w(rewardProp, rewardAmount)
        } else if (args instanceof Array && args.length > 0) {
            if (args[0] instanceof Array) {
                for (let rewardIndex = 0; rewardIndex < args.length; rewardIndex++) {
                    const rewardEntry = args[rewardIndex];
                    rewardProp = TableDataService.ins()._fn_ly(Const.Tables.prop, rewardEntry[0])
                    rewardAmount = parseInt(rewardEntry[1])
                    _fn_w(rewardProp, rewardAmount)
                }
            } else if (args instanceof Array) {
                rewardProp = TableDataService.ins()._fn_ly(Const.Tables.prop, args[0])
                rewardAmount = parseInt(args[1])
                _fn_w(rewardProp, rewardAmount)
            }
        }
    }

    public _fn_aho(propId: number, num = 1, startPos: Vec3 = v3(0, 0, 0), endPos: Vec3 = v3(0, 0, 0)) {
        let showNum = Math.min(num, 10)
        let getAnimalLayer = find("Canvas")!.getChildByName("GetAnimalLayer")
        if (getAnimalLayer) {
            let script = getAnimalLayer.getComponent(GetAnimalLayer) as GetAnimalLayer
            if (script) {
                script!._layerData = { propId: propId, startPos: startPos, endPos: endPos, num: showNum }
                script!._fn_aha()
            }
            return
        }
        UiLayerService.instance._fn_ahg(Const.Prefabs.GetAnimalLayer, { propId: propId, startPos: startPos, endPos: endPos, num: showNum })








    }

    public _fn_bk(args: any) {
        if (args instanceof Array) {
            let propdata = TableDataService.ins()._fn_ly(Const.Tables.prop, parseInt(args[0]))
            if (propdata.type == GoodsType.Coin) {
                return this._fn_bf(args[1])
            } else if (propdata.type == GoodsType.Diamonds) {
                return this._fn_bg(args[1])
            } else if (propdata.type == GoodsType.StyleVoucher) {
                return this._fn_bl(args[1])
            } else if (propdata.type == GoodsType.GreenStar) {
                return this._fn_bi(args[1])
            } else if (propdata.type == GoodsType.Power) {
                return this._fn_bj(args[1])
            }
        }
        return false
    }

    public _fn_ec(id: number) {
        let propdata = TableDataService.ins()._fn_ly(Const.Tables.prop, id)
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
        return GameStorage._fn_hr(Const.DataKeys.propBuyTime + id, 0)
    }

    public _fn_l(id: number) {
        return GameStorage._fn_aey(Const.DataKeys.propBuyTime + id, this.propBuyTime(id) + 1)
    }


    private _tujianArr: any = []
    public get TujianArr() {
        if (this._tujianArr.length < 6) {
            let propData = TableDataService.ins()._fn_lt(Const.Tables.prop)
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
            let propData = TableDataService.ins()._fn_lt(Const.Tables.scene_room)
            propData.forEach((element: any, index: number) => {
                if (!this._tujianSceneArr[element.complete] && element.complete > 0) {
                    this._tujianSceneArr[element.complete - 1] = element
                }
            });
        }
        return this._tujianSceneArr
    }

    public _fn_pv(propId: number, key = Const.DataKeys.tujianProp) {
        return GameStorage._fn_hr(key + propId, 0)
    }

    public _fn_aes(propId: number, state: TujianState, key = Const.DataKeys.tujianProp) {
        if (state == TujianState.geted && GameStorage._fn_hr(key + propId, 0) == TujianState.unGet) {
            GameStorage._fn_aey(key + propId, TujianState.geted)
            if (key == Const.DataKeys.tujianProp) {
                this._showPropTujianRed = true
            } else {
                this._showSceneTujianRed = true
            }
        } else if (state == TujianState.received && GameStorage._fn_hr(key + propId, 0) == TujianState.geted) {
            GameStorage._fn_aey(key + propId, TujianState.received)
            if (key == Const.DataKeys.tujianProp) {
                this._showPropTujianRed = this._fn_cm()
            } else {
                this._showSceneTujianRed = this._fn_cn()
            }
        }
    }

    public _showPropTujianRed = false
    public _showSceneTujianRed = false


    public _fn_cm(type = 0) {
        if (type > 0) {
            let propRows = TableDataService.ins()._fn_mb(Const.Tables.prop, "type", type)
            if (!propRows) {
                return false
            }
            for (let propIndex = 0; propIndex < propRows.length; propIndex++) {
                const propRow = propRows[propIndex];
                if (this._fn_pv(propRow.id) == TujianState.geted) {
                    return true
                }
            }
        } else {
            let propRows = TableDataService.ins()._fn_lt(Const.Tables.prop)
            if (!propRows) {
                return false
            }
            for (let propIndex = 0; propIndex < propRows.length; propIndex++) {
                const propRow = propRows[propIndex];

                if (propRow.type >= 1 && propRow.type <= 6 && this._fn_pv(propRow.id) == TujianState.geted) {
                    return true
                }
            }
        }

        return false
    }

    public _fn_cn(id = 0) {
        if (id > 0) {
            let sceneItemRows = TableDataService.ins()._fn_mb(Const.Tables.scene_item, "room", id)
            for (let sceneItemIndex = 0; sceneItemIndex < sceneItemRows.length; sceneItemIndex++) {
                const sceneItemRow = sceneItemRows[sceneItemIndex];
                let sceneSkinRows = TableDataService.ins()._fn_mb(Const.Tables.scene_skin, "scene", sceneItemRow.id)
                sceneSkinRows.forEach(skin => {
                    let skinOffset = skin.id % sceneItemRow.id
                    if (skinOffset > 0) {
                        if (playerDataStore._fn_pv(skin.id, Const.DataKeys.tujianScene) == TujianState.geted) {
                            return true
                        }
                    }
                })
            }
            return false
        } else {
            let roomRows = TableDataService.ins()._fn_lt(Const.Tables.scene_room)
            for (let roomIndex = 0; roomIndex < roomRows.length; roomIndex++) {
                if (roomRows[roomIndex].complete > 0) {
                    let sceneItemRows = TableDataService.ins()._fn_mb(Const.Tables.scene_item, "room", roomRows[roomIndex].id)
                    for (let sceneItemIndex = 0; sceneItemIndex < sceneItemRows.length; sceneItemIndex++) {
                        const sceneItemRow = sceneItemRows[sceneItemIndex];
                        let sceneSkinRows = TableDataService.ins()._fn_mb(Const.Tables.scene_skin, "scene", sceneItemRow.id)
                        for (let skinIndex = 0; skinIndex < sceneSkinRows.length; skinIndex++) {
                            const skin = sceneSkinRows[skinIndex];
                            let skinOffset = skin.id % sceneItemRow.id
                            if (skinOffset > 0) {
                                if (playerDataStore._fn_pv(skin.id, Const.DataKeys.tujianScene) == TujianState.geted) {
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

    public _fn_pw(lv: number) {
        if (this.roleLv >= lv) {
            return GameStorage._fn_hr(Const.DataKeys.growUp + lv, TujianState.geted)
        }
        return TujianState.unGet
    }

    public _fn_aet(lv: number, state: number) {
        GameStorage._fn_aey(Const.DataKeys.growUp + lv, state)
    }

    public _fn_acs() {





    }

    public get buyPowerTime() {
        let curTime = Math.floor(TimeCtrJSF._fn_hp().ServerTime)

        let lastTime = GameStorage._fn_hr(Const.DataKeys.buyPowerTime + "time", 0)
        if (lastTime > 0 && TimeCtrJSF._fn_qp(curTime, lastTime)) {
            GameStorage._fn_aey(Const.DataKeys.buyPowerTime + "time", curTime)
            let buyTime = GameStorage._fn_hr(Const.DataKeys.buyPowerTime, 1)
            return buyTime
        } else {
            GameStorage._fn_aey(Const.DataKeys.buyPowerTime, 1)
            GameStorage._fn_aey(Const.DataKeys.buyPowerTime + "time", curTime)
            return 1
        }
    }

    public _fn_b() {
        let buyTime = GameStorage._fn_hr(Const.DataKeys.buyPowerTime, 1)
        GameStorage._fn_aey(Const.DataKeys.buyPowerTime, buyTime * TableDataService.ins().config[Const.config.diamonsPower][2])
    }

    public _fn_acr(key: string, value: any) {
        if (PlayerDataStore._isMergeSave) {
            return
        }
        GameStorage._fn_afh(key, value)
    }

    public saveData() {
        let obj = js.createMap(true);
        for (let key in this) {
            if (key.indexOf('$') != -1) {
                obj[key] = this[key];
            }
        }
    }

    public _fn_be() {
        let activityRows = TableDataService.ins()._fn_lt(Const.Tables.lockActivity_item)
        activityRows.forEach((activity: any) => {
            if (activity.cdType == ActivityLockType.type_Level) {
                if (this.roleLv >= activity.openLevel) {
                    let lastTime = GameStorage._fn_hr(activity.dataKey + "_time", 0)
                    if (lastTime <= 0) {
                        let curTime = Math.floor(TimeCtrJSF._fn_hp().ServerTime)
                        GameStorage._fn_aey(activity.dataKey + "_time", curTime)
                    }
                }
            }
        });
    }







    public _fn_bo(key: string, time: number, startTime: number = 0) {
        let lastTime = GameStorage._fn_hr(key + "_time", 0) || startTime
        let currentTime = Math.floor(TimeCtrJSF._fn_hp().ServerTime)
        if (lastTime <= 0) {
            GameStorage._fn_aey(key + "_time", currentTime)
            lastTime = currentTime
        }
        let elapsedSeconds = Math.floor((currentTime - lastTime) / 1000)
        let gainedCount = 0
        if (elapsedSeconds > time) {
            gainedCount = Math.floor(elapsedSeconds / time)
            lastTime += time * 1000
            GameStorage._fn_aey(key + "_time", currentTime)
            elapsedSeconds = elapsedSeconds % time
        }

        let remainingSeconds = time - elapsedSeconds
        if (remainingSeconds <= 0) {
            remainingSeconds = 0
            GameStorage._fn_aey(key + "_time", 0)
        }
        return [gainedCount, remainingSeconds]
    }

    public _fn_cv(key: string) {
        GameStorage._fn_aey(key + "_time", 0)
    }

    public _fn_br(key: string, endTime: number) {
        let currentTime = Math.floor(TimeCtrJSF._fn_hp().ServerTime)
        let remainingSeconds = endTime - currentTime
        return remainingSeconds / 1000
    }

    public _fn_bz(key: string, limitTime: number) {
        let startTime = GameStorage._fn_hr(key + "_time", 0)
        if (startTime <= 0) {
            return 0
        }
        let endTime = startTime + limitTime
        let currentTime = Math.floor(TimeCtrJSF._fn_hp().ServerTime)
        return endTime - currentTime
    }







    public _fn_jz(key: string, interval: number) {
        let lastTime = GameStorage._fn_hr(key + "_time", 0)
        let currentTime = Math.floor(TimeCtrJSF._fn_hp().ServerTime)
        if (lastTime <= 0) {
            GameStorage._fn_aey(key + "_time", currentTime)
            return GameStorage._fn_hr(key, 0)
        }
        if (TimeCtrJSF._fn_qr(currentTime, lastTime, interval)) {
            return GameStorage._fn_hr(key, 0)
        } else {
            GameStorage._fn_aey(key + "_time", currentTime)
            GameStorage._fn_aey(key, 0)
            return 0
        }
    }








    public _fn_fg(key: string) {
        return GameStorage._fn_hr(key, 0)
    }
    public _fn_aef(key: string) {
        return GameStorage._fn_aey(key, this._fn_fg(key) + 1)
    }

    public _fn_afo(key: string, interval: number) {
        GameStorage._fn_aey(key, this._fn_jz(key, interval) + 1)
    }

    public _fn_ht(key: string, interval: number): number {

        if (interval <= 24 * 60) {
            let currentTime = Math.floor(TimeCtrJSF._fn_hp().ServerTime)
            let currentDate = new Date(currentTime)
            let currentMinuteOfDay = currentDate.getHours() * 60 + currentDate.getMinutes()
            let elapsedIntervalMinutes = currentMinuteOfDay % interval
            return (interval - elapsedIntervalMinutes) * 60 - currentDate.getSeconds()
        } else if (interval <= 24 * 60 * 7) {
            let currentTime = Math.floor(TimeCtrJSF._fn_hp().ServerTime)
            let currentDate = new Date(currentTime)
            return (7 - currentDate.getDay()) * 24 * 60 * 60 + this._fn_ht(key, 24 * 60);
        } else {
            let currentTime = Math.floor(TimeCtrJSF._fn_hp().ServerTime)
            let year = new Date(currentTime).getFullYear()
            let month = new Date(currentTime).getMonth()
            let monthEndTime = new Date(year, month + 1, 0).getTime()
            return (monthEndTime - currentTime) / 1000
        }
    }

    public _fn_ig(key: string, interval: number, fallbackData: any, force: boolean = false, refreshCallback: Function | undefined = undefined) {
        let lastTime = GameStorage._fn_hr(key + "_time", 0)
        let currentTime = Math.floor(TimeCtrJSF._fn_hp().ServerTime)
        if (lastTime <= 0 || force) {
            GameStorage._fn_aey(key + "_time", currentTime)
            GameStorage._fn_afh(key + "object", fallbackData)
            refreshCallback && refreshCallback(true)
            return fallbackData
        }
        if (TimeCtrJSF._fn_qr(currentTime, lastTime, interval)) {
            refreshCallback && refreshCallback(false)
            return GameStorage._fn_io(key + "object", fallbackData)
        } else {
            GameStorage._fn_aey(key + "_time", currentTime)
            GameStorage._fn_afh(key + "object", fallbackData)
            refreshCallback && refreshCallback(true)
            return fallbackData
        }
    }







    public _fn_hu(key: string, interval: number, fallbackText: string) {
        let lastTime = GameStorage._fn_hr(key + "_time", 0)
        let currentTime = Math.floor(TimeCtrJSF._fn_hp().ServerTime)
        if (lastTime <= 0) {
            GameStorage._fn_aey(key + "_time", currentTime)
            return GameStorage._fn_lq(key, "")
        }
        if (TimeCtrJSF._fn_qr(currentTime, lastTime, interval)) {
            return GameStorage._fn_lq(key, "")
        } else {
            GameStorage._fn_aey(key + "_time", currentTime)
            GameStorage._fn_ago(key, "")
            return ""
        }
    }

    public _fn_afa(key: string, interval: number, storedText: string) {
        let currentTime = Math.floor(TimeCtrJSF._fn_hp().ServerTime)
        GameStorage._fn_aey(key + "_time", currentTime)
        GameStorage._fn_ago(key, storedText)
    }

    public _fn_ahi() {
        if (mergeBoardStateStore._fn_px()) {
            let launchQuery = GamePlatform._fn_ie()
            console.error("params = ", launchQuery)

            if (launchQuery && launchQuery.shareUserId) {
                let sharedPropList = launchQuery.propList
                launchQuery.propList = sharedPropList.split(",")
                console.error("params2 = ", launchQuery)

                if (launchQuery.shareUserId == playerDataStore.roleID + "") {
                    UiLayerService.instance._fn_ahg(Const.Dialogs.GodWealthLayer);
                } else {
                    UiLayerService.instance._fn_ahg(Const.Dialogs.GodWealthOther, { params: launchQuery });
                }
                launchQuery = null
            }
        }
    }


    public _fn_aan(sp:Sprite, remoteUrl:string){
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


export const playerDataStore = PlayerDataStore._fn_ho();
