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
    public static _fn_ho(): SeasonProgressStore {
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
        this.seasonScore = GameStorage._fn_hr(Const.DataKeys.seasonScore, 0);
        this.seasonId = GameStorage._fn_hr(Const.DataKeys.seasonId, 1);
        this.seasonOpen = GameStorage._fn_hr(Const.DataKeys.seasonOpen, 0);

        let saveDayTime = GameStorage._fn_hr(Const.DataKeys.saveDayTime, 0);
        if (saveDayTime) {
            this.saveDayTime = new Date(saveDayTime);
        } else {
            this.saveDayTime = new Date(mergeBoardStateStore._fn_gm());
        }

        mergeBoardStateStore.initData();

        this._fn_wj();



        // @ts-ignore
        window.mergeBoardStateStore = mergeBoardStateStore;
        // @ts-ignore
        window.seasonProgressStore = this;
    }

    _fn_wj() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        this.updateInterval = setInterval(this.update.bind(this), 1000);
        this.update();
    }

    public _fn_acc() {
        if (playerDataStore.roleLv >= TableDataService.ins().config.seasonPassUnlock) {

            if (!this.seasonOpen) {
                this.seasonOpen = 1;
                GameStorage._fn_aey(Const.DataKeys.seasonOpen, this.seasonOpen);
                UtilPub.log("战令解锁了");
                Notifications.emit(GD.event.unlockSystem);
            }
        }

    }

    public _fn_lc() {
        return false;
    }
    public _fn_p(score: number = 1) {
        if (!this.seasonOpen) {
            return;
        }
        this.seasonScore += score;
        let nextRow = TableDataService.ins()._fn_ly(Const.Tables.seasonPass, this.seasonId + 1);
        if (nextRow && this.seasonScore >= nextRow.num) {

            this.seasonId++;
            GameStorage._fn_aey(Const.DataKeys.seasonId, this.seasonId);
            this.seasonScore -= nextRow.num;
            UtilPub.log("升级了");
        }
        GameStorage._fn_aey(Const.DataKeys.seasonScore, this.seasonScore);
        UtilPub.log("id:" + this.seasonId, "lv:" + (this.seasonId - 1), "score:" + this.seasonScore);
    }





    public _fn_lb(id: number) {
        let info = GameStorage._fn_io(Const.DataKeys.seasonPassInfo + id);
        if (!info && id <= this.seasonId) {
            info = {
                a1: 0,
                a2: 0
            };
        }
        return info;
    }





    public _fn_ade(id: number,startPos:Vec3) {
        let info = this._fn_lb(id);
        if (!info || info.a1) {
            return;
        }
        let row = TableDataService.ins()._fn_ly(Const.Tables.seasonPass, id);
        mergeBoardStateStore._fn_m(row.award1[0], row.award1[1],startPos);
        info.a1 = 1;
        GameStorage._fn_afh(Const.DataKeys.seasonPassInfo + id, info);
    }





    public _fn_adf(id: number,startPos:Vec3) {
        let info = this._fn_lb(id);
        if (!info || info.a2) {
            return;
        }
        let row = TableDataService.ins()._fn_ly(Const.Tables.seasonPass, id);
        mergeBoardStateStore._fn_m(row.award2[0], row.award2[1],startPos);
        info.a2 = 1;
        GameStorage._fn_afh(Const.DataKeys.seasonPassInfo + id, info);
    }

    public _fn_abr() {
        this.seasonId = 1;
        this.seasonScore = 0;
        GameStorage._fn_aey(Const.DataKeys.seasonScore, this.seasonScore);
        GameStorage._fn_aey(Const.DataKeys.seasonId, this.seasonId);

        let keyArr: any = [];
        let tb = TableDataService.ins()._fn_lt(Const.Tables.seasonPass);
        for (let i in tb) {
            let key = Const.DataKeys.seasonPassInfo + tb[i].id;
            keyArr.push(key);
        }
        GameStorage._fn_aai(keyArr);
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


        let now = new Date(mergeBoardStateStore._fn_gm());
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

const seasonProgressStore = SeasonProgressStore._fn_ho();

export { seasonProgressStore };

