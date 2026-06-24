import { director, Vec3 } from "cc";
import { Const } from "../../config/Const";
import GD from "../../config/GD";
import { GameStorage } from "../../easyFramework/mgr/gameStorage";
import { Notifications } from "../../easyFramework/mgr/notifications";
import TableDataService from "../../easyFramework/other/tables";
import { UtilPub } from "../../easyFramework/utils/UtilPub";
import { mergeBoardStateStore } from "./mergeBoardModel";
import { playerDataStore } from "./UserData";

class SeasonProgressStore {
    private static instance: SeasonProgressStore = null!;
    public static getInstance(): SeasonProgressStore {
        if (this.instance == null) {
            this.instance = new SeasonProgressStore();
        }
        return this.instance;
    }

    saveDayTime: Date = null!;
    updateInterval: any = null;

    seasonScore = 0;
    seasonId = 1;
    seasonOpen = 0;

    public initData() {
        this.seasonScore = GameStorage.getInt(Const.DataKeys.seasonScore, 0);
        this.seasonId = GameStorage.getInt(Const.DataKeys.seasonId, 1);
        this.seasonOpen = GameStorage.getInt(Const.DataKeys.seasonOpen, 0);

        let saveDayTime = GameStorage.getInt(Const.DataKeys.saveDayTime, 0);
        if (saveDayTime) {
            this.saveDayTime = new Date(saveDayTime);
        } else {
            this.saveDayTime = new Date(mergeBoardStateStore.getCurrentTimestamp());
        }

        mergeBoardStateStore.initData();

        this.openUpdateSecond();



        // @ts-ignore
        window.mergeBoardStateStore = mergeBoardStateStore;
        // @ts-ignore
        window.seasonProgressStore = this;
    }

    openUpdateSecond() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        this.updateInterval = setInterval(this.update.bind(this), 1000);
        this.update();
    }

    public roleLvUp() {
        if (playerDataStore.roleLv >= TableDataService.ins().config.seasonPassUnlock) {

            if (!this.seasonOpen) {
                this.seasonOpen = 1;
                GameStorage.setInt(Const.DataKeys.seasonOpen, this.seasonOpen);
                UtilPub.log("战令解锁了");
                Notifications.emit(GD.event.unlockSystem);
            }
        }

    }

    public getSeasonPassOpen() {
        return false;
    }
    public addSeasonScore(score: number = 1) {
        if (!this.seasonOpen) {
            return;
        }
        this.seasonScore += score;
        let nextRow = TableDataService.ins().getTableValueByID(Const.Tables.seasonPass, this.seasonId + 1);
        if (nextRow && this.seasonScore >= nextRow.num) {

            this.seasonId++;
            GameStorage.setInt(Const.DataKeys.seasonId, this.seasonId);
            this.seasonScore -= nextRow.num;
            UtilPub.log("升级了");
        }
        GameStorage.setInt(Const.DataKeys.seasonScore, this.seasonScore);
        UtilPub.log("id:" + this.seasonId, "lv:" + (this.seasonId - 1), "score:" + this.seasonScore);
    }





    public getSeasonPassInfoById(id: number) {
        let info = GameStorage.getObject(Const.DataKeys.seasonPassInfo + id);
        if (!info && id <= this.seasonId) {
            info = {
                a1: 0,
                a2: 0
            };
        }
        return info;
    }





    public seasonGetAward1(id: number,startPos:Vec3) {
        let info = this.getSeasonPassInfoById(id);
        if (!info || info.a1) {
            return;
        }
        let row = TableDataService.ins().getTableValueByID(Const.Tables.seasonPass, id);
        mergeBoardStateStore.addPropNum(row.award1[0], row.award1[1],startPos);
        info.a1 = 1;
        GameStorage.setObject(Const.DataKeys.seasonPassInfo + id, info);
    }





    public seasonGetAward2(id: number,startPos:Vec3) {
        let info = this.getSeasonPassInfoById(id);
        if (!info || info.a2) {
            return;
        }
        let row = TableDataService.ins().getTableValueByID(Const.Tables.seasonPass, id);
        mergeBoardStateStore.addPropNum(row.award2[0], row.award2[1],startPos);
        info.a2 = 1;
        GameStorage.setObject(Const.DataKeys.seasonPassInfo + id, info);
    }

    public resetSeasonPass() {
        this.seasonId = 1;
        this.seasonScore = 0;
        GameStorage.setInt(Const.DataKeys.seasonScore, this.seasonScore);
        GameStorage.setInt(Const.DataKeys.seasonId, this.seasonId);

        let keyArr: any = [];
        let tb = TableDataService.ins().getTable(Const.Tables.seasonPass);
        for (let i in tb) {
            let key = Const.DataKeys.seasonPassInfo + tb[i].id;
            keyArr.push(key);
        }
        GameStorage.removeMulti(keyArr);
    }

    public overDay() {
        UtilPub.log("跨天了");
    }

    public overMonth() {
        UtilPub.log("跨月了");

    }

    public update() {
        if (director.getScene()!.name != "game") {
            return;
        }


        let now = new Date(mergeBoardStateStore.getCurrentTimestamp());
        let overDay = false;
        if (this.saveDayTime.getDate() == now.getDate()) {
            if (now.getTime() - this.saveDayTime.getTime() >= 24 * 60 * 60 * 1000) {
                overDay = true;
            }
        } else {
            overDay = true;
        }

        if (overDay) {
            this.overDay();
            Notifications.emit(GD.event.overDay);
            let overMonth = false;
            if (this.saveDayTime.getMonth() == now.getMonth()) {
                if (now.getTime() - this.saveDayTime.getTime() >= 31 * 24 * 60 * 60 * 1000) {
                    overMonth = true;
                }
            } else {
                overMonth = true;
            }
            if (overMonth) {
                this.overMonth();
                Notifications.emit(GD.event.overMonth);
            }
            this.saveDayTime = now;
        }
    }

}

const seasonProgressStore = SeasonProgressStore.getInstance();

export { seasonProgressStore };

