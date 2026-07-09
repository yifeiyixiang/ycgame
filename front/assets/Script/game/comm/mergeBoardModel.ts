import { find, math, v3, Vec3, view, Node } from "cc";
import { Const } from "../../config/Const";
import GD from "../../config/GD";
import { TujianState } from "../../config/global";
import { localText } from "../../config/localText";
import { GameStorage } from "../../easyFramework/mgr/gameStorage";
import { Notifications } from "../../easyFramework/mgr/notifications";
import { UiLayerService } from "../../easyFramework/mgr/uiManager";
import TimeCtrJSF from "../../easyFramework/network/TimeCtrJSF";
import TableDataService from "../../easyFramework/other/tables";
import { UtilPub } from "../../easyFramework/utils/UtilPub";
import { handData } from "../data/handData";
import { MergeBoardLayer } from "../UI/layer/MergeBoardLayer";
import { HandLayer } from "../UI/layer/HandLayer";
import { aiRobot } from "./AIRobot";
import { seasonProgressStore } from "./playerModel";
import { playerDataStore } from "./UserData";
import { GamePlatform } from '../platform/GamePlatform';


export const nineAroundArr = [
    [1, -1, 135], [1, 0, 90], [1, 1, 45],
    [0, -1, 180], [0, 1, 0],
    [-1, -1, 225], [-1, 0, 270], [-1, 1, 315]
];
export const tenAroundArr = [
    [1, 0],
    [0, -1], [0, 1],
    [-1, 0]
];

export const designConfig = {

    bubbleTime: 60 * 1000,

    bubbleBombPropId: 203,
};
export const propIds = {
    coin: 101,
    diamond: 102,
    power: 103,
    exp: 104,
    star: 105,

    coinMaxLv: 205,
    bag: 401,
    powerMaxLv: 805,

    pinkBag: 1003,
    pinkBag2: 1004,

    superCard: 60020,
};
export const roomStatus = {
    normal: 0,

    spider: 1,

    carton: 2,
}

export const managerInfoTypeArr = [
    "Reach level %d",
    "Trigger any generator %d times",
    "Complete %d orders",
    "Unlock blue handbag %d times",
    "Merge on board %d times",
    "Build fitness room %d times",
    "Spend gems to buy energy %d times",
    "Sell any board item %d times",
    "Speed up generator %d times",
    "Use %d energy",
    "Merge %d max-level coin items",
    "Merge %d max-level energy balls",
    "Spend %d coins",
];

class MergeBoardStateStore {

    private static instance: MergeBoardStateStore;
    private constructor() { }
    public static _fn_hq(): MergeBoardStateStore {
        if (this.instance == null) {
            this.instance = new MergeBoardStateStore();
        }
        return this.instance;
    }


    btnMergeBoardPos: Vec3 = v3(0, 0, 0);


    colNum = 7;
    rowNum = 9;


    roomArr: any;
    roomDataKey: string = "";


    taskArr: any;
    taskDataKey: string = "";


    managerArr: any;

    cardArr: any;

    updateInterval: any;

    curTaskLineState: any = {}









    initData() {

        this.cardArr = [];
        let ret = GameStorage._fn_io(Const.DataKeys.boardCardArr);
        if (ret) {

            this.cardArr = ret;
            UtilPub.log("从服务端加载卡片列表", this.cardArr);
        }

        this.roomArr = [];
        this.roomDataKey = Const.DataKeys.boardRoomData;

        ret = GameStorage._fn_ip(this.roomDataKey);
        UtilPub.log("读取服务端棋盘数据：", ret);
        if (!ret.values || ret.values.length <= 0) {

            let tmpObj: any = {};

























            let tb = TableDataService.ins()._fn_lt(Const.Tables.boardSeed);
            if (aiRobot.isRobot()) {
                tb = TableDataService.ins()._fn_lt(Const.Tables.botBoardSeed);
            }
            for (let i = 0; i < tb.length; i++) {
                let roomRow = tb[i];
                let row = roomRow.row - 1;
                let col = roomRow.col - 1;
                let roomData = this._fn_ou(roomRow.propId, undefined, roomRow.status, roomRow.clickPropId);
                if (!this.roomArr[row]) {
                    this.roomArr[row] = [];
                }
                this.roomArr[row][col] = roomData;
                let key = this._fn_kh(row, col);
                tmpObj[key] = roomData;
            }


            GameStorage._fn_afj(tmpObj);
            UtilPub.log("本地初始化棋盘数据：", this.roomArr);
        } else {

            for (let i = 0; i < ret.values.length; i++) {
                let val = ret.values[i];
                let key = ret.keys[i];
                let arr = key.split("_");
                let row = parseInt(arr[1]);
                let col = parseInt(arr[2]);
                if (!this.roomArr[row]) {
                    this.roomArr[row] = [];
                }
                this.roomArr[row][col] = val;
            }
            UtilPub.log("从服务端加载棋盘数据", this.roomArr);
        }

    }

    _fn_rh() {
        console.log("loadData 1")
        this.taskArr = [];
        this.roomDataKey = Const.DataKeys.boardRoomData;
        console.log("loadData 2")


        if (this.roomDataKey == Const.DataKeys.boardRoomData) {
            this.taskDataKey = Const.DataKeys.boardOrderQueue;
            console.log("loadData 3")

            let ret = GameStorage._fn_io(this.taskDataKey);
            console.log("loadData 4")

            if (!ret) {

                if (aiRobot.isRobot()) {
                    let retTask = aiRobot._fn_dw();
                    this.taskArr = [retTask];
                } else {
                    let retTask = this._fn_ds(1);
                    this.taskArr = [retTask];
                }

                this._fn_aeb();
                UtilPub.log("本地初始化任务列表：", this.taskArr);

            } else {


                console.log("loadData 5 a")

                this.taskArr = this._fn_dw()
                UtilPub.log("从服务端加载任务列表", this.taskArr);
                console.log("loadData 5")

            }
        }
        console.log("loadData 6")


        this.managerArr = [];
        let ret = GameStorage._fn_ip(this.roomDataKey);
        ret = GameStorage._fn_ip(Const.DataKeys.boardMilestoneArr);
        if (!ret.values || ret.values.length <= 0) {

            this._fn_du();
            UtilPub.log("本地初始化店长值班日：", this.managerArr);
        } else {

            for (let i = 0; i < ret.values.length; i++) {
                let val = ret.values[i];
                let key = ret.keys[i];
                let arr = key.split("_");
                this.managerArr[arr[1]] = val;
            }
            UtilPub.log("load manager duty data", this.managerArr);
        }
        console.log("loadData 7")

        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        this.updateInterval = setInterval(this.update.bind(this), 500);
        this.update();
        console.log("loadData 8")


    }


    _fn_sc() {
        UtilPub._fn_ex(this.roomArr, (roomData: any, row: number, col: number) => {
            if (!roomData.id) {
                return;
            }
            this._fn_zl(row, col);
        });
    }

    close() {

        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    update() {
        let timestamp = this._fn_gm();
        let tempArr: any = [];
        UtilPub._fn_ex(this.roomArr, (roomData: any, row: number, col: number) => {
            if (!roomData.id) {
                return;
            }
            let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, roomData.id);


            if (roomData.cd && timestamp >= roomData.cd) {
                if (propRow.mdt == 11) {

                    this._fn_afu(row, col, {});
                    let info = {
                        row: row,
                        col: col
                    };
                    Notifications.emit(GD.event.boardSpeedupEnded, info);
                } else {
                    delete roomData.cd;
                    delete roomData.cdSum;

                    roomData.times = propRow.times;
                    this._fn_adw(row, col);
                }
            }


            if (propRow.fair && roomData.timesAuto > 0) {
                this._fn_zl(row, col);
            }

            if (roomData.cdAuto && timestamp >= roomData.cdAuto && !this._fn_qk(row, col)) {

                delete roomData.cdAuto;
                roomData.timesAuto = propRow.kishu;
                this._fn_adw(row, col);
                this._fn_zl(row, col);
            }


            if (roomData.cdBubble > 0 && timestamp >= roomData.cdBubble) {
                roomData = this._fn_ou(designConfig.bubbleBombPropId);
                this._fn_afu(row, col, roomData);
                this._fn_aed(row, col);
            }

            if (propRow.mdt == 11 && roomData.startTime) {

                let speedTime = timestamp - roomData.startTime;
                roomData.startTime = timestamp;

                for (let i = 0, len = nineAroundArr.length; i < len; i++) {
                    let posArr = nineAroundArr[i];
                    let r = row + posArr[0];
                    let c = col + posArr[1];
                    if (!this._fn_qn(r, c)) {
                        continue;
                    }
                    let pData = this.roomArr[r][c];
                    if (this._fn_xp(pData.id)) {
                        if (!pData.speedTime || pData.speedTime < speedTime) {
                            pData.speedTime = speedTime;
                        }
                        pData.row = r;
                        pData.col = c;
                        tempArr.push(pData);
                    }
                }
            }

        });

        tempArr.forEach((roomData: any) => {
            if (roomData.cd || roomData.cdAuto) {
                roomData.cd -= roomData.speedTime;
                roomData.cdAuto -= roomData.speedTime;
            }
            delete roomData.speedTime;
            let row = roomData.row;
            let col = roomData.col;
            delete roomData.row;
            delete roomData.col;
            this._fn_afu(row, col);
        });
    }

    _fn_kh(row: number, col: number) {
        return this.roomDataKey + "_" + row + "_" + col;
    }
    _fn_ih(index: number) {
        return Const.DataKeys.boardMilestoneArr + "_" + index;
    }

    _fn_ou(id: number, data: any = {}, st?: number, clickPropId?: any) {
        data.id = id;
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, id);
        if (!propRow) {
            UtilPub.error("道具数据找不到，id:" + id);
        }

        if (clickPropId) {

            data.clickPropId = clickPropId;
        }


        if (propRow.clickPropId) {
            let propCount = this._fn_gi(id);
            if (propCount == 0) {
                if (!clickPropId) {
                    clickPropId = [];
                }
                clickPropId = clickPropId.concat(propRow.clickPropId);
                data.clickPropId = clickPropId;
                this._fn_aeq(id, propCount + 1);

            }
        }

        if (id == propIds.bag && st == roomStatus.spider) {
            st = undefined;
        }

        if (st && st > 0) {
            data.st = st;
        } else {
            delete data.st;
            if (propRow.anc && propRow.times > 0) {

                data.times = propRow.times;
            }

            if (propRow.kishu > 0) {


                data.timesAuto = 1;
            }

            if (id == propIds.bag) {

                let roomArr = [];
                while (true) {
                    let id = roomArr.length + 1;
                    let bagRow = TableDataService.ins()._fn_ly(Const.Tables.bagGrid, id);
                    if (bagRow.coin != 0) {
                        break;
                    }
                    roomArr.push({});
                }
                data.roomArr = roomArr;
                UtilPub.log("bag init done", data);
            }

            if (propRow.lock) {

                data.cd = this._fn_gm() + propRow.milo * 1000;
                data.cdSum = propRow.milo * 1000;
                UtilPub.log("init cd state", data);
            }
        }

        if (!st) {

            playerDataStore._fn_aes(id, TujianState.geted);
        }

        return data;
    }







    _fn_km(id: number, lvAdd: number) {
        if (!lvAdd) {
            return id;
        }
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, id);
        UtilPub._fn_ex(this.roomArr, (roomData: any, row: number, col: number) => {
            if (!roomData.id || this._fn_qk(row, col)) {
                return;
            }
            let tmpRow = TableDataService.ins()._fn_ly(Const.Tables.prop, roomData.id);
            if (propRow.type != tmpRow.type || propRow.typeson != tmpRow.typeson) {

                return;
            }
            if (propRow.luna > tmpRow.luna) {
                return;
            }
            propRow = tmpRow;
        });

        id = propRow.id;

        id = this._fn_jm(id, lvAdd);

        return id;
    }





    _fn_jn(id: number) {
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, id);
        while (true) {
            id++;
            let nextRow = TableDataService.ins()._fn_ly(Const.Tables.prop, id);
            if (!nextRow || propRow.type != nextRow.type || propRow.typeson != nextRow.typeson) {
                id--;
                break;
            }
        }
        return id;
    }






    _fn_jm(id: number, lvAdd: number) {
        if (!lvAdd) {
            return id;
        }

        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, id);
        for (let i = 0; i < lvAdd; i++) {
            id++;
            let nextRow = TableDataService.ins()._fn_ly(Const.Tables.prop, id);
            if (!nextRow || propRow.type != nextRow.type || propRow.typeson != nextRow.typeson) {
                id--;
                break;
            }
            propRow = nextRow;
        }

        return id;
    }





    _fn_nh(id: number) {
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, id);
        let tb = TableDataService.ins()._fn_lt(Const.Tables.prop);
        for (let i = 0; i < tb.length; i++) {
            let tmpRow = tb[i];
            if (propRow.type == tmpRow.type && propRow.typeson == tmpRow.typeson) {
                if (playerDataStore._fn_pv(tmpRow.id) != TujianState.unGet) {
                    return true;
                }
            }
        }
        return false;
    }


    _fn_du() {
        let tmpObj: any = {};
        let id = this.managerArr.length;
        if (id >= TableDataService.ins()._fn_lw(Const.Tables.manager).id) {

            return;
        }
        let row = null;
        while (true) {
            row = TableDataService.ins()._fn_ly(Const.Tables.manager, id + 1);
            if (!row) {
                break;
            }
            let manager = {
                id: row.id,
                val: 0,
                get: 0
            };
            let index = row.id - 1;
            this.managerArr[index] = manager;
            let key = this._fn_ih(index);
            tmpObj[key] = manager;
            if (row.kadian) {
                break;
            }
            id++;
        }
        GameStorage._fn_afj(tmpObj);
        UtilPub.log("unlock new task", tmpObj);
        Notifications.emit(GD.event.managerCreateTask);
    }

    _fn_ds(id: number) {
        let row = TableDataService.ins()._fn_ly(Const.Tables.handTask, id);
        if (!row) {
            return;
        }

        let propArr = [{
            id: row.prop,
            num: row.num
        }];

        return {
            id: id,
            propArr: propArr,
            starNum: row.taskReward,
            hand: 1
        };
    }

    _fn_go(taskId: number = 1, line: number, ischeck: boolean = false) {
        let lineTaskData = TableDataService.ins()._fn_mc(Const.Tables.taskMainType, "taskId", taskId + "", "firstLine", line + "")
        if (lineTaskData.length <= 0) {
            return [0, 0]
        }



        if (ischeck && this.curTaskLineState[taskId * 1000 + line]) {
            return this.curTaskLineState[taskId * 1000 + line]
        }
        let start = lineTaskData[0].secondLine
        let endIndex = start + lineTaskData.length - 1
        let curStep = GameStorage._fn_hr(Const.DataKeys.TaskLineStep + taskId + "_" + line, start)
        if (line == 1) {
            this.curTaskLineState[taskId * 1000 + line] = [curStep, endIndex]
            return [curStep, endIndex]
        }

        let isPass = true
        for (let stepLine = 1; stepLine <= line - 1; stepLine++) {
            let step = this._fn_go(taskId, stepLine, true)!
            if (step[0] < start && step[1] >= start) {


                isPass = false
                break;

            }
        }

        if (isPass) {
            if (ischeck)
                this.curTaskLineState[taskId * 1000 + line] = [curStep, endIndex]
            return [curStep, endIndex]
        } else {
            if (ischeck)
                this.curTaskLineState[taskId * 1000 + line] = ischeck ? [start, endIndex] : [0, endIndex]
            return ischeck ? [start, endIndex] : [0, endIndex]
        }

    }

    _fn_aio(taskId: number, line: number) {
        let curStep = this._fn_go(taskId, line)[0]
        curStep++
        GameStorage._fn_aey(Const.DataKeys.TaskLineStep + taskId + "_" + line, curStep)
        let arr = this._fn_dy(taskId)
        if (this.curTaskLineState[taskId * 1000 + line]) {
            this.curTaskLineState[taskId * 1000 + line][0] = curStep
        }

        if (arr.length <= 0) {
            GameStorage._fn_aey(Const.DataKeys.TaskLineFinsh + taskId, 1)
        }
    }

    _fn_qx(taskId: number) {
        let isstate = GameStorage._fn_hr(Const.DataKeys.TaskLineFinsh + taskId, 0)
        return isstate == 1
    }

    _fn_qy(taskId: number) {




        let isstate = GameStorage._fn_hr(Const.DataKeys.TaskLineFinshReward + taskId, 0)
        return isstate == 1
    }

    _fn_ags(taskId: number) {
        GameStorage._fn_aey(Const.DataKeys.TaskLineFinshReward + taskId, 1)
    }

    _fn_dx() {
        let taskArr: any = {};

        let taskUnLockData = TableDataService.ins()._fn_lt(Const.Tables.taskUnlock)
        this.curTaskLineState = {}
        for (let index = 0; index < taskUnLockData.length; index++) {
            const element = taskUnLockData[index];
            if (playerDataStore.roleLv >= element.level) {
                if (element.tid == 0 || this._fn_qx(element.tid)) {
                    let arr = this._fn_dy(element.taskId)
                    if (arr.length > 0 || !this._fn_qy(element.taskId))
                        taskArr[element.taskId] = arr
                }
            }
        }
        return taskArr
    }


    _fn_mk(taskId: number) {
        let firstLinenum = TableDataService.ins()._fn_mf(Const.Tables.taskMainType, "taskId", taskId + "", "firstLine")
        let taskData = TableDataService.ins()._fn_mb(Const.Tables.taskMainType, "taskId", taskId + "")
        let finishNum = 0
        for (let index = 1; index <= firstLinenum; index++) {
            let lineTaskData = TableDataService.ins()._fn_mc(Const.Tables.taskMainType, "taskId", taskId + "", "firstLine", index + "")
            if (lineTaskData.length > 0) {
                let start = lineTaskData[0].secondLine
                let taskMain1 = this._fn_go(taskId, index)[0]
                if (taskMain1 > 0) {
                    finishNum += taskMain1 - start
                }
            }
        }
        return finishNum / taskData.length
    }

    _fn_dw() {
        let taskArr: any = [];

        let taskUnLockData = TableDataService.ins()._fn_lt(Const.Tables.taskUnlock)
        this.curTaskLineState = {}

        for (let index = 0; index < taskUnLockData.length; index++) {
            const element = taskUnLockData[index];

            if (playerDataStore.roleLv >= element.level) {

                if (element.tid == 0 || this._fn_qx(element.tid)) {
                    let arr = this._fn_dy(element.taskId)

                    Array.prototype.push.apply(taskArr, arr);

                }
            }
        }

        mergeBoardStateStore.taskArr = taskArr
        return taskArr
    }

    _fn_dy(taskId: number = 1, num: number = 1) {
        let taskArr: any = [];
        let firstLinenum = TableDataService.ins()._fn_mf(Const.Tables.taskMainType, "taskId", taskId + "", "firstLine")
        for (let index = 1; index <= firstLinenum; index++) {

            let taskMain1 = this._fn_go(taskId, index)[0]

            if (taskMain1 > 0) {
                let taskData = TableDataService.ins()._fn_me(Const.Tables.taskMainType, "taskId", taskId + "", "firstLine", index + "", "secondLine", taskMain1 + "")[0]
                if (taskData) {

                    let task: any = {};
                    task.starNum = taskData.taskReward
                    let propArr = [];
                    for (let i = 0; i < taskData.res1.length; i++) {
                        propArr.push({
                            id: taskData.res1[i][0],
                            num: taskData.res1[i][1],
                        })
                    }

                    task.propArr = propArr
                    task.line = index
                    task.taskId = taskId
                    task.id = taskData.id
                    taskArr.push(task);
                }
            }
        }

        return taskArr
    }






    _fn_dz(num: number = 1, funcType: number = 0) {
        let taskArr: any = [];

        for (let i = 0; i < num; i++) {
            let task: any = {};

            let arr = [];
            let tb = TableDataService.ins()._fn_lt(Const.Tables.taskType);
            for (let row of tb) {
                if (funcType > 0 && row.res1 != funcType) {

                    continue;
                }
                let lv = playerDataStore.roleLv;
                if (lv >= row.levelMin && lv <= row.levelMax) {

                    arr.push(row);
                }
            }
            let retRow = UtilPub._fn_ko(arr);




            let idArr: any = [];
            let propTb = TableDataService.ins()._fn_lt(Const.Tables.prop);
            let unlockInfo: any = {};

            switch (retRow.res1) {
                case 2:

                    UtilPub._fn_ex(this.roomArr, (roomData: any, pRow: number, pCol: number) => {
                        let id = roomData.id;
                        if (!id || id == propIds.bag) {
                            return;
                        }
                        if (idArr.indexOf(id) != -1) {
                            return;
                        }
                        if (this._fn_ql(pRow, pCol) || this._fn_qo(pRow, pCol) || this._fn_qk(pRow, pCol)) {
                            return;
                        }

                        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, id);
                        if (propRow.lunc > retRow.quality) {

                            return;
                        }
                        idArr.push(id);
                    });
                    break;
                case 3:

                    let tmpInfo: any = {};
                    UtilPub._fn_ey(propTb, (propRow: any) => {
                        if (propRow.lunc > retRow.quality) {

                            return;
                        }

                        if (playerDataStore._fn_pv(propRow.id) == TujianState.unGet) {
                            return;
                        }

                        let hasInfo = this._fn_kg(propRow.id);
                        if (hasInfo.num > 0) {
                            return;
                        }

                        let key = propRow.type * 1000 + propRow.typeson;
                        let info = tmpInfo[key];
                        if (info) {
                            if (info.lv > propRow.luna) {
                                info.id = propRow.id;
                                info.lv = propRow.luna;
                            }
                        } else {
                            info = {};
                            info.id = propRow.id;
                            info.lv = propRow.luna;
                            tmpInfo[key] = info;
                        }
                    });
                    for (let tmp in tmpInfo) {
                        idArr.push(tmpInfo[tmp].id);
                    }
                    break;
                case 4:

                    UtilPub._fn_ey(propTb, (propRow: any) => {
                        if (propRow.lunc > retRow.quality) {

                            return;
                        }

                        if (playerDataStore._fn_pv(propRow.id) != TujianState.unGet) {
                            return;
                        }

                        let unlockKey = propRow.type * 1000 + propRow.typeson;
                        let hasUnlock = unlockInfo[unlockKey];
                        if (hasUnlock == undefined) {
                            hasUnlock = this._fn_nh(propRow.id);
                        }
                        unlockInfo[unlockKey] = hasUnlock;
                        if (!hasUnlock) {
                            return;
                        }
                        idArr.push(propRow.id);
                    });
                    break;
                case 5:

                    UtilPub._fn_ey(propTb, (propRow: any) => {
                        if (propRow.lunc > retRow.quality) {

                            return;
                        }

                        if (playerDataStore._fn_pv(propRow.id) != TujianState.unGet) {
                            return;
                        }

                        let unlockKey = propRow.type * 1000 + propRow.typeson;
                        let hasUnlock = unlockInfo[unlockKey];
                        if (hasUnlock == undefined) {
                            hasUnlock = this._fn_nh(propRow.id);
                        }
                        unlockInfo[unlockKey] = hasUnlock;
                        if (hasUnlock) {
                            return;
                        }
                        idArr.push(propRow.id);
                    });
                    break;
                case 6:

                    UtilPub._fn_ey(propTb, (propRow: any) => {
                        if (propRow.lunc > retRow.quality) {

                            return;
                        }

                        if (playerDataStore._fn_pv(propRow.id) != TujianState.unGet) {
                            idArr.push(propRow.id);
                        }
                    });
                    break;
                default:
                    break;
            }


            let needTypeNum = retRow.djzl;
            if (idArr.length <= 1) {
                needTypeNum = 1;
            }

            let propArr = [];
            let lvUp = retRow.djsj;
            let res1 = retRow.res1;
            for (let tmp = 0; tmp < needTypeNum; tmp++) {
                while (true) {
                    let retId = UtilPub._fn_jv(idArr, true);
                    if (retId > 0) {

                        switch (res1) {
                            case 2:
                                retId = this._fn_km(retId, lvUp);
                                break;
                            case 3:
                            case 6:
                                retId = this._fn_jm(retId, lvUp);
                                break;
                            default:
                                break;
                        }
                        if (propArr.length > 0 && retId == propArr[0].id) {
                            res1 = 2;
                            lvUp = 0;
                            UtilPub.log("任务道具重复�?" + retId);
                            continue;
                        }
                        let num = this._fn_mv("1,2,3", retRow.num);
                        propArr.push({
                            id: retId,
                            num: num
                        });
                    }
                    break;
                }
            }
            if (propArr.length > 0) {

                task.propArr = propArr;

                task.starNum = UtilPub._fn_jv(retRow.taskReward);
                taskArr.push(task);
            }


        }

        if (taskArr.length <= 0) {

            let leastTaskArr = TableDataService.ins()._fn_lt(Const.Tables.leastTask);
            let leastTaskRow = UtilPub._fn_jv(leastTaskArr);
            let propArr = [{
                id: leastTaskRow.prop,
                num: leastTaskRow.num
            }];
            let leastTask = {
                propArr: propArr,
                starNum: leastTaskRow.taskReward,
            };
            taskArr.push(leastTask);
            UtilPub.log("生成保底任务", leastTask);
        }

        UtilPub.log("create tasks", taskArr);

        return taskArr;
    }


    _fn_zl(row: number, col: number) {
        let roomData = this.roomArr[row][col];
        if (!roomData.id || !roomData.timesAuto || roomData.timesAuto <= 0) {
            return;
        }
        if (this._fn_qk(row, col)) {
            return;
        }


        let emptyArr: any = [];
        nineAroundArr.forEach((posArr: any) => {
            let r = row + posArr[0];
            let c = col + posArr[1];
            if (this._fn_ps(r, c)) {
                let rData = this.roomArr[r][c];
                if (!rData.id) {
                    emptyArr.push([r, c]);
                }
            }
        });


        if (emptyArr.length > 0) {
            let tmpObj: any = {};
            let newPosArr: any = [];
            let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, roomData.id);
            while (roomData.timesAuto > 0 && emptyArr.length > 0 && propRow.fair > 0) {
                let roomDataNew = this._fn_ou(propRow.fair);
                let posArr = emptyArr.shift();
                let r = posArr[0];
                let c = posArr[1];
                this.roomArr[r][c] = roomDataNew;
                tmpObj[this._fn_kh(r, c)] = roomDataNew;
                newPosArr.push(posArr);
                roomData.timesAuto--;
                if (roomData.timesAuto <= 0) {
                    roomData.cdAuto = this._fn_gm() + propRow.faircd * 1000;
                }
            }


            GameStorage._fn_afj(tmpObj);


            this._fn_aec(row, col, newPosArr, true);

        }
    }







    _fn_aec(row: number, col: number, newPosArr: any, isAuto: boolean = false) {
        let data: any = {};
        data.row = row;
        data.col = col;
        data.newPosArr = newPosArr;
        data.isAuto = isAuto;
        Notifications.emit(GD.event.boardSlotSpawn, data);
    }

    _fn_aed(row: number, col: number) {
        let data: any = {};
        data.row = row;
        data.col = col;
        Notifications.emit(GD.event.roomBubbleBurst, data);
    }


    _fn_ach(srcRow: number, srcCol: number, targetRow: number, targetCol: number) {
        let srcData = this.roomArr[srcRow][srcCol];
        let targetData = this.roomArr[targetRow][targetCol];
        this._fn_afu(srcRow, srcCol, targetData);
        this._fn_afu(targetRow, targetCol, srcData);
    }


    _fn_sd(srcRow: number, srcCol: number, targetRow: number, targetCol: number) {
        let srcData = this.roomArr[srcRow][srcCol];
        let targetData = this.roomArr[targetRow][targetCol];
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, srcData.id);

        this._fn_afu(srcRow, srcCol, {});

        if (playerDataStore._fn_pv(propRow.blessId) == TujianState.unGet) {

            let blessRow = TableDataService.ins()._fn_ly(Const.Tables.prop, propRow.blessId);
            if (blessRow.anc) {
                Notifications.emit(GD.event.boardDiscovery, propRow.blessId);
            }
        }
        let roomData = this._fn_ou(propRow.blessId);
        let clickPropId: any = [];
        if (srcData.clickPropId) {
            clickPropId = clickPropId.concat(srcData.clickPropId);
        }
        if (targetData.clickPropId) {
            clickPropId = clickPropId.concat(targetData.clickPropId);
        }
        if (clickPropId.length > 0) {
            roomData.clickPropId = clickPropId;
        }
        this._fn_afu(targetRow, targetCol, roomData);


        let retObj: any = {};
        retObj.cartonArr = [];
        for (let i in tenAroundArr) {
            let posArr = tenAroundArr[i];
            let r = targetRow + posArr[0];
            let c = targetCol + posArr[1];
            if (this._fn_ps(r, c)) {
                let rData = this.roomArr[r][c];
                if (rData.st == roomStatus.carton) {
                    rData = this._fn_ou(rData.id, rData, roomStatus.spider);
                    this._fn_afu(r, c, rData);
                    retObj.cartonArr.push({ row: r, col: c });
                }
            }
        }

        this._fn_h(Const.ManagerTypes.mergeActionCount);
        if (roomData.id == propIds.coinMaxLv) {
            this._fn_h(Const.ManagerTypes.coinPeakMergeCount);
        }
        if (roomData.id == propIds.powerMaxLv) {
            this._fn_h(Const.ManagerTypes.energyPeakMergeCount);
        }

        return retObj;
    }

    _fn_u(targetRow: number, targetCol: number) {

        if (!this._fn_px() || aiRobot.isRobot()) {
            return;
        }

        let roomData = this.roomArr[targetRow][targetCol];
        let arr = TableDataService.ins()._fn_lt(Const.Tables.mergeReward);


        let retRow = TableDataService.ins()._fn_ly(Const.Tables.mergeReward, 1)

















        if (retRow.propId != 0) {
            let emptyPos = this._fn_gz();
            if (emptyPos) {
                let newRoom = null;
                if (retRow.propId == -1) {

                    newRoom = this._fn_ou(roomData.id);
                    newRoom.cdBubble = this._fn_gm() + designConfig.bubbleTime;
                } else if (retRow.propId > 0) {

                    newRoom = this._fn_ou(retRow.propId);
                }
                if (newRoom) {
                    this._fn_afu(emptyPos.row, emptyPos.col, newRoom);
                    this._fn_aec(targetRow, targetCol, [[emptyPos.row, emptyPos.col]]);
                }
            }
        }
    }









    _fn_xy(row: number, col: number, bagRow: number, bagCol: number) {
        if (this._fn_qk(row, col)) {

            this.showToast(localText.notInBag);
            return;
        }
        let bagRoomData = this.roomArr[bagRow][bagCol];
        if (bagRoomData.st == roomStatus.carton) {
            UtilPub.log("还未解锁背包");
            return;
        }

        let index = -1;
        for (let i = bagRoomData.roomArr.length - 1; i >= 0; i--) {
            let room = bagRoomData.roomArr[i];
            if (!room.id) {
                index = i;
                break;
            }
        }
        if (index == -1) {

            UtilPub.log("背包已满");
            return false;
        }
        let roomData = this.roomArr[row][col];
        this._fn_afu(row, col, {});

        roomData.putTime = this._fn_gm();
        bagRoomData.roomArr[index] = roomData;

        UtilPub._fn_aid(bagRoomData.roomArr, (r1: any, r2: any) => {
            let id1 = r1.id;
            let id2 = r2.id;
            if (!id1) {
                id1 = 9999999999;
            }
            if (!id2) {
                id2 = 9999999999;
            }
            if (id1 > id2) {
                return true;
            }
            return false;
        });

        this._fn_adw(bagRow, bagCol);
        return true;
    }







    _fn_is(index: number, bagRow: number, bagCol: number) {
        let emptyPos = mergeBoardStateStore._fn_gz();
        if (!emptyPos) {

            return;
        }
        let bagRoomData = this.roomArr[bagRow][bagCol];
        let roomData = bagRoomData.roomArr[index];


        let dt = this._fn_gm() - roomData.putTime;
        if (roomData.cd > 0) {
            roomData.cd += dt;
        }
        if (roomData.cdAuto > 0) {
            roomData.cdAuto += dt;
        }
        delete roomData.putTime;

        this._fn_afu(emptyPos.row, emptyPos.col, roomData);

        bagRoomData.roomArr[index] = {};
        this._fn_aie(bagRow, bagCol);

        return emptyPos;
    }

    _fn_aie(row: number, col: number) {
        let bagRoomData = this.roomArr[row][col];
        let arr = [];
        let emptyArr = [];
        for (let roomData of bagRoomData.roomArr) {
            if (roomData.id > 0) {
                arr.push(roomData);
            } else {
                emptyArr.push(roomData);
            }
        }
        UtilPub._fn_aid(arr, (r1: any, r2: any) => {
            if (r1.id > r2.id) {
                return true;
            }
            return false;
        });
        bagRoomData.roomArr = arr.concat(emptyArr);
        this._fn_adw(row, col);
    }

    _fn_x(row: number, col: number) {
        let bagRoomData = this.roomArr[row][col];
        bagRoomData.roomArr.push({});
        this._fn_adw(row, col);
    }


    _fn_uh(row: number, col: number, emptyRow: number, emptyCol: number) {

        let roomData = this.roomArr[row][col];
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, roomData.id);
        roomData.times--;

        if (!propRow.noPower && mergeBoardStateStore._fn_fs() <= 0) {

            this._fn_aip(propIds.power);
            if (aiRobot.isRobot() && this._fn_jp(propIds.power) <= 1) {
                this._fn_m(propIds.power, 100);
            }
        }

        if (propRow.milo > 0) {
            if (!roomData.cd) {
                roomData.cd = this._fn_gm();
            }
            roomData.cd += (propRow.milo * 1000);
        }
        if (roomData.times <= 0) {

            if (propRow.wsb) {

                this.roomArr[row][col] = {};
            } else if (propRow.doge > 0) {

                let roomData2 = this._fn_ou(propRow.doge);
                this.roomArr[row][col] = roomData2;
            } else {

                roomData.cdSum = roomData.cd - this._fn_gm();
            }
        }
        this._fn_adw(row, col);
        UtilPub.log("remaining times " + roomData.times);

        let propId = 0;
        if (roomData.clickPropId && roomData.clickPropId.length > 0) {

            propId = roomData.clickPropId.shift();
            if (roomData.clickPropId.length <= 0) {
                delete roomData.clickPropId;
            }
        } else {

            propId = this._fn_mv(propRow.atom, propRow.matic);
        }

        let newRoomData = this._fn_ou(propId);
        this._fn_afu(emptyRow, emptyCol, newRoomData);


        this._fn_h(Const.ManagerTypes.roomClickAdd);
        let newPropRow = TableDataService.ins()._fn_ly(Const.Tables.prop, propId);
        UtilPub.log("生成新物�?id:%d,name:%s".format(propId, newPropRow.name));

    }


    _fn_uf(row: number, col: number, roomPos: Vec3) {
        let roomData = this.roomArr[row][col];
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, roomData.id);

        this._fn_m(propRow.clickAwardId, propRow.clickAwardNum, roomPos);

        this._fn_afu(row, col, {});
    }


    _fn_um(row: number, col: number) {
        let unlocking = false;
        UtilPub._fn_ex(mergeBoardStateStore.roomArr, (pData: any, pRow: number, pCol: number) => {
            if (!pData || !pData.id || mergeBoardStateStore._fn_qk(pRow, pCol)) {
                return;
            }
            let propRow2 = TableDataService.ins()._fn_ly(Const.Tables.prop, pData.id);
            if (propRow2.mdt == 1 && pData.unlock && pData.cdSum > 0) {
                unlocking = true;
                return true;
            }
        });
        if (unlocking) {

            mergeBoardStateStore.showToast(localText.unlocking);
            return;
        }

        let roomData = this.roomArr[row][col];
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, roomData.id);
        roomData.unlock = 1;
        roomData.cd = this._fn_gm() + propRow.p1 * 1000;
        roomData.cdSum = propRow.p1 * 1000;
        this._fn_adw(row, col);

        if (roomData.id == propIds.pinkBag || roomData.id == propIds.pinkBag2) {
            this._fn_h(Const.ManagerTypes.unlockPinkBag);
        }
    }

    _fn_ty(row: number, col: number) {
        let ret: any = {};
        let roomData = this.roomArr[row][col];
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, roomData.id);
        switch (propRow.mdt) {
            case 2:

                GameStorage._fn_aey(Const.DataKeys.boardEnergyReadyAt, this._fn_gm() + propRow.p1 * 1000);
                this._fn_afu(row, col, {});
                break;
            case 5:

                let timestamp = this._fn_gm();
                ret.arr = [];
                UtilPub._fn_ex(this.roomArr, (rData: any, r: number, c: number) => {
                    if (this._fn_qk(r, c)) {
                        return;
                    }
                    if (!this._fn_qn(r, c)) {
                        return;
                    }
                    if (rData.notSubCd) {
                        return;
                    }
                    let subCd = propRow.p1 * 60 * 60 * 1000;
                    if (rData.cd) {

                        rData.cd -= subCd;
                        if (rData.cd <= timestamp) {
                            rData.cd = timestamp;
                            delete rData.cdSum;
                            delete rData.cd;
                        }
                        if (!rData.cdSum) {

                            let num = subCd / (propRow.milo * 1000);
                            num = Math.floor(num);
                            if (num > 0) {
                                rData.times += num;
                            }
                            if (rData.times > propRow.times) {
                                rData.times = propRow.times;
                            }
                        }
                        this._fn_afu(r, c);
                    }

                    if (rData.cdAuto) {

                        rData.cdAuto -= subCd;

                        this.update();
                    }

                    if (rData.cd || rData.cdAuto) {
                        ret.arr.push({ row: r, col: c });
                    }

                });
                this._fn_afu(row, col, {});
                return ret;
                break;
            case 11:

                if (!roomData.cd) {
                    let duration = propRow.p1 * 60 * 60 * 1000;


                    let timestamp = this._fn_gm();
                    roomData.startTime = timestamp;
                    roomData.cd = timestamp + duration;
                    roomData.cdSum = duration;
                    roomData.notSubCd = true;
                    this._fn_afu(row, col);
                }
                break;
            default:
                break;
        }
    }


    _fn_fs() {
        let time = GameStorage._fn_hr(Const.DataKeys.boardEnergyReadyAt, 0);
        let dt = time - this._fn_gm();
        if (dt < 0) {
            dt = 0;
        }
        return dt;
    }


    _fn_adj(row: number, col: number, startPos: Vec3) {
        let roomData = this.roomArr[row][col];
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, roomData.id);
        let coin = propRow.levelGold;
        if (!coin) {
            return;
        }
        mergeBoardStateStore._fn_m(propIds.coin, coin, startPos);

        this._fn_afu(row, col, {});

        this._fn_h(Const.ManagerTypes.roomSell);

        return { roomData: roomData, coin: coin, row: row, col: col };
    }

    sellBack(sellData: any) {
        let roomData = this.roomArr[sellData.row][sellData.col];

        this._fn_aip(propIds.coin, sellData.coin);
        if (roomData.id) {

            let emptyPos = this._fn_gz();
            if (emptyPos) {
                this._fn_afu(emptyPos.row, emptyPos.col, sellData.roomData);
            } else {

                this._fn_m(sellData.id);
            }
            return emptyPos;
        }


        this._fn_afu(sellData.row, sellData.col, sellData.roomData);

        return { row: sellData.row, col: sellData.col };

    }








    _fn_acg(row: number, col: number, dt: number, cdType: number) {
        let roomData = this.roomArr[row][col];
        let num = this._fn_it(dt);
        if (this._fn_jp(propIds.diamond) < num) {

            this.showToast(localText.lackDiamond);
            return;
        }
        this._fn_aip(propIds.diamond, num);
        if (cdType == 1) {
            roomData.cd = this._fn_gm();
        } else if (cdType == 2) {
            roomData.cdAuto = this._fn_gm();
        }
        this.update();

        return true;
    }


    _fn_acf(row: number, col: number) {
        let roomData = this.roomArr[row][col];
        if (!roomData.cdBubble) {
            return;
        }
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, roomData.id);
        if (this._fn_jp(propIds.diamond) < propRow.bubble) {

            return;
        }
        this._fn_aip(propIds.diamond, propRow.bubble);
        delete roomData.cdBubble;
        this._fn_adw(row, col);

        return true;
    }

    _fn_acd(row: number, col: number) {
        let roomData = this.roomArr[row][col];
        roomData.cdBubble = this._fn_gm();
        this.update();
    }

    _fn_afu(row: number, col: number, roomData?: any) {
        if (roomData) {
            this.roomArr[row][col] = roomData;
        }
        this._fn_adw(row, col);
    }

    _fn_ke() {
        let ret: any = null;
        UtilPub._fn_ex(this.roomArr, (roomData: any, row: number, col: number) => {
            if (roomData.id == propIds.bag) {
                ret = {};
                ret.roomData = roomData;
                ret.row = row;
                ret.col = col;
                return true;
            }
        });

        return ret;
    }

    _fn_dn(propId: number, num: number) {
        let bagInfo = this._fn_ke();
        let hasBagProp = false;

        let hasInfo = this._fn_kg(propId);
        let info = hasInfo.arr[0];
        if (info.isBag) {

            bagInfo.roomData.roomArr[info.index] = {};
            hasBagProp = true;
        } else {

            this._fn_afu(info.row, info.col, {});
        }
        if (hasBagProp) {
            this._fn_aie(bagInfo.row, bagInfo.col);
        }

    }

    onClickTaskDone(task: any, startPos?: Vec3) {
        let index = mergeBoardStateStore.taskArr.indexOf(task);
        let bagInfo = this._fn_ke();
        let hasBagProp = false;
        let subPropArr: any = [];

        for (let i in task.propArr) {
            let prop = task.propArr[i];
            let hasInfo = this._fn_kg(prop.id);
            for (let j = 0; j < prop.num; j++) {
                let info = hasInfo.arr[j];
                if (info.isBag) {

                    bagInfo.roomData.roomArr[info.index] = {};
                    hasBagProp = true;
                } else {

                    this._fn_afu(info.row, info.col, {});
                }
                info.id = prop.id;
                subPropArr.push(info);
            }
        }
        if (hasBagProp) {
            this._fn_aie(bagInfo.row, bagInfo.col);
        }


        this._fn_m(propIds.star, task.starNum, startPos);

        let line = task.line
        if (line > 0)
            this._fn_aio(task.taskId, line)

        mergeBoardStateStore.taskArr.splice(index, 1);


        if (aiRobot.isRobot()) {
            mergeBoardStateStore.taskArr.push(aiRobot._fn_dw());
        } else {
            let nextHandTask = null;
            if (task.hand) {
                nextHandTask = this._fn_ds(task.id + 1);
            }
            if (nextHandTask) {

                mergeBoardStateStore.taskArr.push(nextHandTask);
            } else {
                let num = 0;
                for (let i = 0; i < TableDataService.ins().config.taskProb.length; i++) {
                    let prob = TableDataService.ins().config.taskProb[i];
                    if (Math.random() < prob) {
                        num++;
                    }
                }

                let maxNum = TableDataService.ins().config.taskMax - mergeBoardStateStore.taskArr.length;
                if (num > maxNum) {

                    num = maxNum;
                }
                if (mergeBoardStateStore.taskArr.length == 0 && num <= 0) {

                    num = 1;
                }
                if (num > 0) {
                    let retArr = this._fn_dw();
                    mergeBoardStateStore.taskArr = retArr
                }
            }
            GamePlatform._fn_aja("玩家完成任务");
        }

        this._fn_aeb();
        this._fn_h(Const.ManagerTypes.taskDone);

        return subPropArr;
    }


    refreshTask(task: any) {
        let index = mergeBoardStateStore.taskArr.indexOf(task);
        let newTask = this._fn_dw()[0];
        if (newTask) {
            newTask.id = task.id;
            newTask.hand = task.hand;
            mergeBoardStateStore.taskArr[index] = newTask;
            Notifications.emit(GD.event.refreshTask);
        }

    }







    _fn_mv(valStr: string, weightStr: string) {
        let valArr = ("" + valStr).split(",");
        let weightArr = ("" + weightStr).split(",");
        let arr: any = [];
        UtilPub._fn_ey(valArr, (val: any, index: number) => {
            let info: any = {};
            info.val = parseInt(val);
            info.weight = parseInt(weightArr[index]);
            arr.push(info);
        });
        let ret = UtilPub._fn_ko(arr);

        return ret.val;
    }


    _fn_gz() {
        let emptyPos: any = null;
        UtilPub._fn_ex(this.roomArr, (data: any, r: number, c: number) => {
            if (!data.id) {
                emptyPos = {};
                emptyPos.row = r;
                emptyPos.col = c;
                return true;
            }
        }, true);

        return emptyPos;
    }


    _fn_ql(row: number, col: number) {
        let roomData = this.roomArr[row][col];
        if (roomData.st == roomStatus.carton) {
            return true;
        }
        return false;
    }

    _fn_qo(row: number, col: number) {
        let roomData = this.roomArr[row][col];
        if (roomData.st == roomStatus.spider) {
            return true;
        }
        return false;
    }

    _fn_qk(row: number, col: number) {
        let roomData = this.roomArr[row][col];
        if (!roomData.cdBubble) {
            return false;
        }
        if (this._fn_gm() <= roomData.cdBubble) {
            return true;
        }
        return false;
    }

    _fn_qm(row: number, col: number) {
        let roomData = this.roomArr[row][col];
        if (roomData.cdSum > 0) {
            return true;
        }
        return false;
    }


    _fn_it(dt: number) {
        let num = Math.ceil(dt / 1000 / 60 / TableDataService.ins().config.minuteCost);

        return num;
    }






    _fn_kg(id: number) {
        let num = 0;
        let arr: any = [];
        let roomDataBag: any = null;
        UtilPub._fn_ex(this.roomArr, (roomData: any, row: number, col: number) => {
            if (!roomData.id || this._fn_qk(row, col) || this._fn_ql(row, col) || this._fn_qo(row, col)) {
                return;
            }
            if (roomData.id == id) {
                num++;
                arr.push({ row: row, col: col });
            }
            if (roomData.id == propIds.bag) {
                roomDataBag = roomData;
            }
        });
        if (roomDataBag) {

            for (let i = 0; i < roomDataBag.roomArr.length; i++) {
                let bagRoom = roomDataBag.roomArr[i];
                if (!bagRoom || !bagRoom.id) {
                    continue;
                }
                if (bagRoom.id == id) {
                    num++;
                    arr.push({ index: i, isBag: 1 });
                }
            }
        }
        return { num: num, arr: arr };
    }







    _fn_h(type: number, val: number = 1) {
        if (this._fn_qa() || !this.managerArr) {
            return;
        }

        UtilPub._fn_ey(this.managerArr, (manager: any, index: number) => {
            let row = TableDataService.ins()._fn_ly(Const.Tables.manager, manager.id);
            if (row.taskType != type) {
                return;
            }
            if (manager.val >= row.p1 || manager.get) {
                return;
            }
            if (type == Const.ManagerTypes.roleLv) {
                manager.val = playerDataStore.roleLv;
            } else {
                manager.val += val;
            }
            this._fn_adr(index);
            Notifications.emit(GD.event.boardMilestoneRefresh);
        });
    }
    _fn_ii(manager: any) {
        let row = TableDataService.ins()._fn_ly(Const.Tables.manager, manager.id);
        let val = manager.val;
        if (row.taskType == Const.ManagerTypes.roleLv) {
            val = playerDataStore.roleLv;
        }
        if (val > row.p1) {
            val = row.p1;
        }

        return val;
    }




    _fn_sb(index: number, startPos: Vec3) {
        let manager = this.managerArr[index];
        if (manager.get) {
            return;
        }
        manager.get = true;
        this._fn_adr(index);
        let row = TableDataService.ins()._fn_ly(Const.Tables.manager, manager.id);
        this._fn_m(row.price[0], row.price[1], startPos);

        GamePlatform._fn_aja("finish manager daily task " + manager.id);

        let allGet = true;
        for (let i = 0; i < this.managerArr.length; i++) {
            let man = this.managerArr[i];
            if (!man.get) {

                allGet = false;
                break;
            }
        }
        if (allGet) {

            this._fn_du();
        }


        allGet = true;
        let tb = TableDataService.ins()._fn_lt(Const.Tables.manager);
        for (let i = 0; i < tb.length; i++) {
            let pManager = this.managerArr[i];
            if (!pManager || !pManager.get) {
                allGet = false;
                break;
            }
        }
        if (allGet) {
            GameStorage._fn_aey(Const.DataKeys.boardMilestoneAllClaimed, 1);
        }

        Notifications.emit(GD.event.boardMilestoneRefresh);
    }
    _fn_qa() {
        return GameStorage._fn_hr(Const.DataKeys.boardMilestoneAllClaimed);
    }






    _fn_ps(row: number, col: number) {
        if (row >= 0 && row <= this.rowNum - 1 && col >= 0 && col <= this.colNum - 1) {
            return true;
        }
        return false;
    }


    _fn_tu() {
        if (this.cardArr.length <= 0) {
            return;
        }
        let emptyPos = this._fn_gz();
        if (!emptyPos) {
            return;
        }
        let id = this.cardArr.shift();
        let roomData = this._fn_ou(id);
        this._fn_afu(emptyPos.row, emptyPos.col, roomData);

        this._fn_ado();

        return emptyPos;
    }







    _fn_xo(id: number) {
        if (this._fn_xr(id)) {
            let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, id);
            if (propRow.anc || propRow.fair) {
                return true;
            }
        }
        return false;
    }





    _fn_xr(id: number) {
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, id);
        if ((propRow.type >= 100 && propRow.type < 200) || propRow.type == 27) {

            return false;
        }
        return true;
    }





    _fn_m(propId: number, propNum: number = 1, startPos?: Vec3, endPos?: Vec3, notFlay = false) {
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, propId);
        UtilPub.log("获得道具 %s id:%d,num:%d".format(propRow.name, propId, propNum));
        if (this._fn_xr(propId)) {

            for (let i = 0; i < propNum; i++) {
                this.cardArr.push(propId);
            }
            this._fn_ado();
            Notifications.emit(GD.event.boardCardRefresh);
            if (notFlay) {
                return;
            }
            let mergeBoardLayer = this._fn_es();
            if (!startPos) {
                startPos = this._fn_kz();
            }
            if (mergeBoardLayer) {
                playerDataStore._fn_aho(propId, propNum, startPos, mergeBoardLayer._fn_gc());
            } else {
                playerDataStore._fn_aho(propId, propNum, startPos, this.btnMergeBoardPos);
            }
        } else {
            if (propId == propIds.star) {
                if (!startPos) {
                    startPos = this._fn_kz();
                }
                let mergeBoardLayer = this._fn_es();
                if (mergeBoardLayer) {
                    endPos = mergeBoardLayer._fn_fy();
                } else {
                    endPos = this.btnMergeBoardPos;
                }
            }
            if (startPos) {
                if (!endPos) {
                    endPos = Vec3.ZERO;
                }
                playerDataStore._fn_jk([propId, propNum], startPos, endPos);
            } else if (endPos) {
                if (!startPos) {
                    startPos = this._fn_kz();
                }
                playerDataStore._fn_jk([propId, propNum], startPos, endPos);
            } else {
                playerDataStore._fn_jk([propId, propNum], null, null);
            }
        }
    }





    _fn_aip(propId: number, propNum: number = 1) {
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, propId);
        UtilPub.log("扣减道具 %s id:%d,num:%d".format(propRow.name, propId, propNum));

        if (propId == propIds.coin) {
            this._fn_h(Const.ManagerTypes.coinCost, propNum);
        } else if (propId == propIds.power) {
            this._fn_h(Const.ManagerTypes.powerCost, propNum);
            seasonProgressStore._fn_p(propNum);
        }
        playerDataStore._fn_bk([propId, propNum]);
        Notifications.emit(GD.event.updateMoney);
    }

    _fn_jp(propId: number) {
        return playerDataStore._fn_ec(propId);
    }




    _fn_eg() {

        let keyArr: string[] = [];
        UtilPub._fn_ex(this.roomArr, (roomData: any, row: number, col: number) => {
            keyArr.push(this._fn_kh(row, col));
        });
        GameStorage._fn_aai(keyArr);


        GameStorage.removeItem(this.taskDataKey);


        keyArr = [];
        UtilPub._fn_ey(this.managerArr, (manager: any, index: number) => {
            keyArr.push(this._fn_ih(index));
        });
        GameStorage._fn_aai(keyArr);
        GameStorage.removeItem(Const.DataKeys.boardMilestoneAllClaimed);


        GameStorage.removeItem(Const.DataKeys.boardCardArr);


        GameStorage.removeItem(Const.DataKeys.handIndex);
    }


    _fn_aeb() {
        GameStorage._fn_afh(this.taskDataKey, this.taskArr);
    }


    _fn_adr(index: number) {
        let manager = this.managerArr[index];
        let key = this._fn_ih(index);
        GameStorage._fn_afh(key, manager);
    }


    _fn_ado() {
        GameStorage._fn_afh(Const.DataKeys.boardCardArr, this.cardArr);
    }







    _fn_adw(row: number, col: number, roomData?: any) {
        if (!roomData) {
            roomData = this.roomArr[row][col];
        }
        GameStorage._fn_afh(this._fn_kh(row, col), roomData);
    }


    _fn_gm() {

        let timestamp = TimeCtrJSF._fn_hp().ServerTime;

        return timestamp;
    }

    _fn_mh() {


        let arr = [];

        for (let i = 0; i < mergeBoardStateStore.taskArr.length; i++) {
            arr.push(mergeBoardStateStore.taskArr[i]);
        }



        UtilPub._fn_aid(arr, (t1: any, t2: any) => {
            let t1Percent = 0;
            let onePercent = 1 / t1.propArr.length;
            for (let i in t1.propArr) {
                let prop = t1.propArr[i];
                let hasInfo = mergeBoardStateStore._fn_kg(prop.id);
                let hasPercent = hasInfo.num / prop.num;
                if (hasPercent > 1) {
                    hasPercent = 1;
                }
                t1Percent += (hasPercent * onePercent);
            }
            let t2Percent = 0;
            onePercent = 1 / t2.propArr.length;
            for (let i in t2.propArr) {
                let prop = t2.propArr[i];
                let hasInfo = mergeBoardStateStore._fn_kg(prop.id);
                let hasPercent = hasInfo.num / prop.num;
                if (hasPercent > 1) {
                    hasPercent = 1;
                }
                t2Percent += (hasPercent * onePercent);
            }

            if (t1Percent < 1 && t2Percent >= 1) {
                return true;
            }
            return false;
        });

        return arr;
    }

    _fn_gi(propId: number) {
        return GameStorage._fn_hr(Const.DataKeys.boardItemCount + propId, 0);
    }
    _fn_aeq(propId: number, val: number) {
        return GameStorage._fn_aey(Const.DataKeys.boardItemCount + propId, val);
    }

    _fn_hj() {
        let handIndex = GameStorage._fn_hr(Const.DataKeys.handIndex, 1);
        if (aiRobot.isRobot()) {
            handIndex = handData.length;
            mergeBoardStateStore._fn_aev(handIndex);
        }
        return handIndex;
    }
    _fn_e() {
        let index = this._fn_hj();
        GamePlatform._fn_aja("完成新手教程" + index);
        index++;
        this._fn_aev(index);
    }
    _fn_aev(handIndex: number) {
        GameStorage._fn_aey(Const.DataKeys.handIndex, handIndex);
    }
    _fn_df() {
        let handLayer = find("Canvas/HandLayer");
        if (handLayer) {
            handLayer.getComponent(HandLayer)!.close();
        }
    }
    _fn_ne() {
        let handLayer = find("Canvas/HandLayer");
        if (handLayer) {
            handLayer.getComponent(HandLayer)!.hideHand();
        }
    }
    _fn_px() {
        let handIndex = this._fn_hj();
        if (handData[handIndex]) {
            return false;
        }
        return true;
    }
    _fn_hk(): any {
        let handLayer = find("Canvas/HandLayer");
        if (handLayer) {
            return handLayer.getComponent(HandLayer);
        }
        return {};
    }
    _fn_es(): MergeBoardLayer | null {
        let mergeBoardLayer = find("Canvas/MergeBoardLayer");
        if (mergeBoardLayer) {
            return mergeBoardLayer.getComponent(MergeBoardLayer);
        }
        return null;
    }

    _fn_qz(id: number) {
        for (let i in this.taskArr) {
            let task = this.taskArr[i];
            for (let j in task.propArr) {
                if (task.propArr[j].id == id) {
                    return true;
                }
            }
        }
        return false;
    }


    _fn_we(info: string, cb?: Function) {
        if (Const.isDebug) {
            if (cb) {
                cb(true);
            }
            return;
        }
        GamePlatform._fn_ahr(info, (st) => {
            if (st == 1) {
                if (cb) {
                    cb(true);
                }
                return;
            }
            this.showToast(localText.adAwardHint);
            if (cb) {
                cb(false);
            }
        });

    }

    showToast(info: string) {
        Notifications.emit(GD.event.showToast, info);
    }

    _fn_wh(propId: number) {
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, propId);
        if (propRow.tan) {
            UiLayerService.instance._fn_ahg(Const.Dialogs.PropItemInfo, { propdata: propRow });
        } else {
            UiLayerService.instance._fn_ahg(Const.Dialogs.ItemCodexLayer, propId);
        }
    }

    _fn_kz() {
        let width = view.getVisibleSize().width;
        let height = view.getVisibleSize().height;

        return v3(width * 0.5, height * 0.5, 0);
    }

    _fn_qn(row: number, col: number) {
        let roomData = this.roomArr[row][col];
        if (!roomData.id || roomData.st == roomStatus.spider || roomData.st == roomStatus.carton || this._fn_qk(row, col)) {
            return false;
        }
        return true;
    }

    _fn_ax(id: number) {
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, id);
        if (propRow && propRow.chongneng && propRow.anc) {
            return true;
        }
        return false;
    }


    _fn_ace(row: number, col: number, targetRow: number, targetCol: number, val: number) {
        this._fn_afu(row, col, {});
        let roomData = this.roomArr[targetRow][targetCol];
        delete roomData.cdSum;
        roomData.times += val;
        UtilPub.log("add times " + val, roomData.times);
        this._fn_afu(targetRow, targetRow);
    }

    _fn_ba(id: number, targetId: number) {
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, id);
        let targetPropRow = TableDataService.ins()._fn_ly(Const.Tables.prop, targetId);
        if (targetPropRow && targetPropRow.jiandao && targetPropRow.luna > 1 && targetPropRow.luna <= propRow.p1) {
            return true;
        }

        return false;
    }


    _fn_acj(row: number, col: number, targetRow: number, targetCol: number) {
        this._fn_afu(row, col, {});
        let roomData = this.roomArr[targetRow][targetCol];
        let splitRoomData = this._fn_ou(roomData.id - 1);
        this._fn_afu(targetRow, targetCol, splitRoomData);
        let emptyPos = this._fn_gz();
        if (emptyPos) {
            this._fn_afu(emptyPos.row, emptyPos.col, JSON.parse(JSON.stringify(splitRoomData)));
        }

        return { emptyPos: emptyPos };
    }

    _fn_az(id: number, targetId: number) {
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, id);
        let targetPropRow = TableDataService.ins()._fn_ly(Const.Tables.prop, targetId);
        if (!targetPropRow || this._fn_xq(targetId)) {
            return false;
        }
        switch (propRow.mdt) {
            case 6:
                if (targetPropRow.putong1) {
                    return true;
                }
                break;
            case 7:
                if (targetPropRow.putong2) {
                    return true;
                }
                break;
            case 8:
                if (targetPropRow.putong3) {
                    return true;
                }
                break;
            case 9:
                if (!targetPropRow.nochaoji) {
                    return true;
                }
                break;
            case 10:
                if (targetPropRow.quanneng) {
                    return true;
                }
                break;
            default:
                break;
        }

        return false;
    }

    _fn_xq(id: number) {
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, id);
        let nextPropRow = TableDataService.ins()._fn_ly(Const.Tables.prop, id + 1);
        let isMaxLv = false;
        if (!nextPropRow || nextPropRow.type != propRow.type || nextPropRow.typeson != propRow.typeson) {
            isMaxLv = true;
        }
        return isMaxLv;
    }

    _fn_aci(row: number, col: number, targetRow: number, targetCol: number) {
        this._fn_afu(row, col, {});
        let targetRoomData = this.roomArr[targetRow][targetCol];
        let roomData = this._fn_ou(targetRoomData.id + 1);
        this._fn_afu(targetRow, targetCol, roomData);
    }

    _fn_xp(id: number) {
        let row = TableDataService.ins()._fn_ly(Const.Tables.prop, id);
        if ((row.anc && row.milo) || row.faircd) {
            return true;
        }
        return false;
    }


    _fn_kf(itemUI: Node) {
        // @ts-ignore
        return this.roomArr[itemUI.row][itemUI.col];
    }

}

const mergeBoardStateStore = MergeBoardStateStore._fn_hq();

export { mergeBoardStateStore };

