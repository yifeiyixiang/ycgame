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
    public static getInstane(): MergeBoardStateStore {
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
        let ret = GameStorage.getObject(Const.DataKeys.boardCardArr);
        if (ret) {

            this.cardArr = ret;
            UtilPub.log("从服务端加载卡片列表", this.cardArr);
        }

        this.roomArr = [];
        this.roomDataKey = Const.DataKeys.boardRoomData;

        ret = GameStorage.getObjectArrayByKey(this.roomDataKey);
        UtilPub.log("读取服务端棋盘数据：", ret);
        if (!ret.values || ret.values.length <= 0) {

            let tmpObj: any = {};

























            let tb = TableDataService.ins().getTable(Const.Tables.boardSeed);
            if (aiRobot.isRobot()) {
                tb = TableDataService.ins().getTable(Const.Tables.botBoardSeed);
            }
            for (let i = 0; i < tb.length; i++) {
                let roomRow = tb[i];
                let row = roomRow.row - 1;
                let col = roomRow.col - 1;
                let roomData = this.initRoomData(roomRow.propId, undefined, roomRow.status, roomRow.clickPropId);
                if (!this.roomArr[row]) {
                    this.roomArr[row] = [];
                }
                this.roomArr[row][col] = roomData;
                let key = this.getRoomDataKey(row, col);
                tmpObj[key] = roomData;
            }


            GameStorage.setObjectMulti(tmpObj);
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

    loadData() {
        console.log("loadData 1")
        this.taskArr = [];
        this.roomDataKey = Const.DataKeys.boardRoomData;
        console.log("loadData 2")


        if (this.roomDataKey == Const.DataKeys.boardRoomData) {
            this.taskDataKey = Const.DataKeys.boardOrderQueue;
            console.log("loadData 3")

            let ret = GameStorage.getObject(this.taskDataKey);
            console.log("loadData 4")

            if (!ret) {

                if (aiRobot.isRobot()) {
                    let retTask = aiRobot.createTask();
                    this.taskArr = [retTask];
                } else {
                    let retTask = this.createHandTask(1);
                    this.taskArr = [retTask];
                }

                this.sendTaskArrToServer();
                UtilPub.log("本地初始化任务列表：", this.taskArr);

            } else {


                console.log("loadData 5 a")

                this.taskArr = this.createTask()
                UtilPub.log("从服务端加载任务列表", this.taskArr);
                console.log("loadData 5")

            }
        }
        console.log("loadData 6")


        this.managerArr = [];
        let ret = GameStorage.getObjectArrayByKey(this.roomDataKey);
        ret = GameStorage.getObjectArrayByKey(Const.DataKeys.boardMilestoneArr);
        if (!ret.values || ret.values.length <= 0) {

            this.createNextManager();
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


    markMergeBoardReady() {
        UtilPub.for2Arr(this.roomArr, (roomData: any, row: number, col: number) => {
            if (!roomData.id) {
                return;
            }
            this.refreshRoomAutoNew(row, col);
        });
    }

    close() {

        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    update() {
        let timestamp = this.getCurrentTimestamp();
        let tempArr: any = [];
        UtilPub.for2Arr(this.roomArr, (roomData: any, row: number, col: number) => {
            if (!roomData.id) {
                return;
            }
            let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, roomData.id);


            if (roomData.cd && timestamp >= roomData.cd) {
                if (propRow.mdt == 11) {

                    this.setRoomData(row, col, {});
                    let info = {
                        row: row,
                        col: col
                    };
                    Notifications.emit(GD.event.boardSpeedupEnded, info);
                } else {
                    delete roomData.cd;
                    delete roomData.cdSum;

                    roomData.times = propRow.times;
                    this.sendRoomDataToServer(row, col);
                }
            }


            if (propRow.fair && roomData.timesAuto > 0) {
                this.refreshRoomAutoNew(row, col);
            }

            if (roomData.cdAuto && timestamp >= roomData.cdAuto && !this.isRoomBubble(row, col)) {

                delete roomData.cdAuto;
                roomData.timesAuto = propRow.kishu;
                this.sendRoomDataToServer(row, col);
                this.refreshRoomAutoNew(row, col);
            }


            if (roomData.cdBubble > 0 && timestamp >= roomData.cdBubble) {
                roomData = this.initRoomData(designConfig.bubbleBombPropId);
                this.setRoomData(row, col, roomData);
                this.sendToUIRoomBubbleBurst(row, col);
            }

            if (propRow.mdt == 11 && roomData.startTime) {

                let speedTime = timestamp - roomData.startTime;
                roomData.startTime = timestamp;

                for (let i = 0, len = nineAroundArr.length; i < len; i++) {
                    let posArr = nineAroundArr[i];
                    let r = row + posArr[0];
                    let c = col + posArr[1];
                    if (!this.isRoomNormal(r, c)) {
                        continue;
                    }
                    let pData = this.roomArr[r][c];
                    if (this.propCanSpeedUp(pData.id)) {
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
            this.setRoomData(row, col);
        });
    }

    getRoomDataKey(row: number, col: number) {
        return this.roomDataKey + "_" + row + "_" + col;
    }
    getManagerDataKey(index: number) {
        return Const.DataKeys.boardMilestoneArr + "_" + index;
    }

    initRoomData(id: number, data: any = {}, st?: number, clickPropId?: any) {
        data.id = id;
        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, id);
        if (!propRow) {
            UtilPub.error("道具数据找不到，id:" + id);
        }

        if (clickPropId) {

            data.clickPropId = clickPropId;
        }


        if (propRow.clickPropId) {
            let propCount = this.getComposePropCount(id);
            if (propCount == 0) {
                if (!clickPropId) {
                    clickPropId = [];
                }
                clickPropId = clickPropId.concat(propRow.clickPropId);
                data.clickPropId = clickPropId;
                this.setComposePropCount(id, propCount + 1);

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
                    let bagRow = TableDataService.ins().getTableValueByID(Const.Tables.bagGrid, id);
                    if (bagRow.coin != 0) {
                        break;
                    }
                    roomArr.push({});
                }
                data.roomArr = roomArr;
                UtilPub.log("bag init done", data);
            }

            if (propRow.lock) {

                data.cd = this.getCurrentTimestamp() + propRow.milo * 1000;
                data.cdSum = propRow.milo * 1000;
                UtilPub.log("init cd state", data);
            }
        }

        if (!st) {

            playerDataStore.setGetPropTujian(id, TujianState.geted);
        }

        return data;
    }







    getRoomPropIdByIdLvUp(id: number, lvAdd: number) {
        if (!lvAdd) {
            return id;
        }
        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, id);
        UtilPub.for2Arr(this.roomArr, (roomData: any, row: number, col: number) => {
            if (!roomData.id || this.isRoomBubble(row, col)) {
                return;
            }
            let tmpRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, roomData.id);
            if (propRow.type != tmpRow.type || propRow.typeson != tmpRow.typeson) {

                return;
            }
            if (propRow.luna > tmpRow.luna) {
                return;
            }
            propRow = tmpRow;
        });

        id = propRow.id;

        id = this.getPropIdByIdLvUp(id, lvAdd);

        return id;
    }





    getPropMaxLvId(id: number) {
        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, id);
        while (true) {
            id++;
            let nextRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, id);
            if (!nextRow || propRow.type != nextRow.type || propRow.typeson != nextRow.typeson) {
                id--;
                break;
            }
        }
        return id;
    }






    getPropIdByIdLvUp(id: number, lvAdd: number) {
        if (!lvAdd) {
            return id;
        }

        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, id);
        for (let i = 0; i < lvAdd; i++) {
            id++;
            let nextRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, id);
            if (!nextRow || propRow.type != nextRow.type || propRow.typeson != nextRow.typeson) {
                id--;
                break;
            }
            propRow = nextRow;
        }

        return id;
    }





    hasUnlockPropType(id: number) {
        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, id);
        let tb = TableDataService.ins().getTable(Const.Tables.prop);
        for (let i = 0; i < tb.length; i++) {
            let tmpRow = tb[i];
            if (propRow.type == tmpRow.type && propRow.typeson == tmpRow.typeson) {
                if (playerDataStore.isGetPropTujian(tmpRow.id) != TujianState.unGet) {
                    return true;
                }
            }
        }
        return false;
    }


    createNextManager() {
        let tmpObj: any = {};
        let id = this.managerArr.length;
        if (id >= TableDataService.ins().getTableLastOne(Const.Tables.manager).id) {

            return;
        }
        let row = null;
        while (true) {
            row = TableDataService.ins().getTableValueByID(Const.Tables.manager, id + 1);
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
            let key = this.getManagerDataKey(index);
            tmpObj[key] = manager;
            if (row.kadian) {
                break;
            }
            id++;
        }
        GameStorage.setObjectMulti(tmpObj);
        UtilPub.log("unlock new task", tmpObj);
        Notifications.emit(GD.event.managerCreateTask);
    }

    createHandTask(id: number) {
        let row = TableDataService.ins().getTableValueByID(Const.Tables.handTask, id);
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

    getCurTaskLineStep(taskId: number = 1, line: number, ischeck: boolean = false) {
        let lineTaskData = TableDataService.ins().getTableValuesByType2(Const.Tables.taskMainType, "taskId", taskId + "", "firstLine", line + "")
        if (lineTaskData.length <= 0) {
            return [0, 0]
        }



        if (ischeck && this.curTaskLineState[taskId * 1000 + line]) {
            return this.curTaskLineState[taskId * 1000 + line]
        }
        let start = lineTaskData[0].secondLine
        let endIndex = start + lineTaskData.length - 1
        let curStep = GameStorage.getInt(Const.DataKeys.TaskLineStep + taskId + "_" + line, start)
        if (line == 1) {
            this.curTaskLineState[taskId * 1000 + line] = [curStep, endIndex]
            return [curStep, endIndex]
        }

        let isPass = true
        for (let stepLine = 1; stepLine <= line - 1; stepLine++) {
            let step = this.getCurTaskLineStep(taskId, stepLine, true)!
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

    submitLineTask(taskId: number, line: number) {
        let curStep = this.getCurTaskLineStep(taskId, line)[0]
        curStep++
        GameStorage.setInt(Const.DataKeys.TaskLineStep + taskId + "_" + line, curStep)
        let arr = this.createTaskLine(taskId)
        if (this.curTaskLineState[taskId * 1000 + line]) {
            this.curTaskLineState[taskId * 1000 + line][0] = curStep
        }

        if (arr.length <= 0) {
            GameStorage.setInt(Const.DataKeys.TaskLineFinsh + taskId, 1)
        }
    }

    isTaskFish(taskId: number) {
        let isstate = GameStorage.getInt(Const.DataKeys.TaskLineFinsh + taskId, 0)
        return isstate == 1
    }

    isTaskGetReward(taskId: number) {




        let isstate = GameStorage.getInt(Const.DataKeys.TaskLineFinshReward + taskId, 0)
        return isstate == 1
    }

    setTaskGetReward(taskId: number) {
        GameStorage.setInt(Const.DataKeys.TaskLineFinshReward + taskId, 1)
    }

    createTask2() {
        let taskArr: any = {};

        let taskUnLockData = TableDataService.ins().getTable(Const.Tables.taskUnlock)
        this.curTaskLineState = {}
        for (let index = 0; index < taskUnLockData.length; index++) {
            const element = taskUnLockData[index];
            if (playerDataStore.roleLv >= element.level) {
                if (element.tid == 0 || this.isTaskFish(element.tid)) {
                    let arr = this.createTaskLine(element.taskId)
                    if (arr.length > 0 || !this.isTaskGetReward(element.taskId))
                        taskArr[element.taskId] = arr
                }
            }
        }
        return taskArr
    }


    getTaskProgress(taskId: number) {
        let firstLinenum = TableDataService.ins().getTableValuesNumberByType(Const.Tables.taskMainType, "taskId", taskId + "", "firstLine")
        let taskData = TableDataService.ins().getTableValuesByType(Const.Tables.taskMainType, "taskId", taskId + "")
        let finishNum = 0
        for (let index = 1; index <= firstLinenum; index++) {
            let lineTaskData = TableDataService.ins().getTableValuesByType2(Const.Tables.taskMainType, "taskId", taskId + "", "firstLine", index + "")
            if (lineTaskData.length > 0) {
                let start = lineTaskData[0].secondLine
                let taskMain1 = this.getCurTaskLineStep(taskId, index)[0]
                if (taskMain1 > 0) {
                    finishNum += taskMain1 - start
                }
            }
        }
        return finishNum / taskData.length
    }

    createTask() {
        let taskArr: any = [];

        let taskUnLockData = TableDataService.ins().getTable(Const.Tables.taskUnlock)
        this.curTaskLineState = {}

        for (let index = 0; index < taskUnLockData.length; index++) {
            const element = taskUnLockData[index];

            if (playerDataStore.roleLv >= element.level) {

                if (element.tid == 0 || this.isTaskFish(element.tid)) {
                    let arr = this.createTaskLine(element.taskId)

                    Array.prototype.push.apply(taskArr, arr);

                }
            }
        }

        mergeBoardStateStore.taskArr = taskArr
        return taskArr
    }

    createTaskLine(taskId: number = 1, num: number = 1) {
        let taskArr: any = [];
        let firstLinenum = TableDataService.ins().getTableValuesNumberByType(Const.Tables.taskMainType, "taskId", taskId + "", "firstLine")
        for (let index = 1; index <= firstLinenum; index++) {

            let taskMain1 = this.getCurTaskLineStep(taskId, index)[0]

            if (taskMain1 > 0) {
                let taskData = TableDataService.ins().getTableValuesByType3(Const.Tables.taskMainType, "taskId", taskId + "", "firstLine", index + "", "secondLine", taskMain1 + "")[0]
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






    createTaskMain(num: number = 1, funcType: number = 0) {
        let taskArr: any = [];

        for (let i = 0; i < num; i++) {
            let task: any = {};

            let arr = [];
            let tb = TableDataService.ins().getTable(Const.Tables.taskType);
            for (let row of tb) {
                if (funcType > 0 && row.res1 != funcType) {

                    continue;
                }
                let lv = playerDataStore.roleLv;
                if (lv >= row.levelMin && lv <= row.levelMax) {

                    arr.push(row);
                }
            }
            let retRow = UtilPub.getRowByWeight(arr);




            let idArr: any = [];
            let propTb = TableDataService.ins().getTable(Const.Tables.prop);
            let unlockInfo: any = {};

            switch (retRow.res1) {
                case 2:

                    UtilPub.for2Arr(this.roomArr, (roomData: any, pRow: number, pCol: number) => {
                        let id = roomData.id;
                        if (!id || id == propIds.bag) {
                            return;
                        }
                        if (idArr.indexOf(id) != -1) {
                            return;
                        }
                        if (this.isRoomCarton(pRow, pCol) || this.isRoomSpider(pRow, pCol) || this.isRoomBubble(pRow, pCol)) {
                            return;
                        }

                        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, id);
                        if (propRow.lunc > retRow.quality) {

                            return;
                        }
                        idArr.push(id);
                    });
                    break;
                case 3:

                    let tmpInfo: any = {};
                    UtilPub.forArr(propTb, (propRow: any) => {
                        if (propRow.lunc > retRow.quality) {

                            return;
                        }

                        if (playerDataStore.isGetPropTujian(propRow.id) == TujianState.unGet) {
                            return;
                        }

                        let hasInfo = this.getRoomDataHasInfoById(propRow.id);
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

                    UtilPub.forArr(propTb, (propRow: any) => {
                        if (propRow.lunc > retRow.quality) {

                            return;
                        }

                        if (playerDataStore.isGetPropTujian(propRow.id) != TujianState.unGet) {
                            return;
                        }

                        let unlockKey = propRow.type * 1000 + propRow.typeson;
                        let hasUnlock = unlockInfo[unlockKey];
                        if (hasUnlock == undefined) {
                            hasUnlock = this.hasUnlockPropType(propRow.id);
                        }
                        unlockInfo[unlockKey] = hasUnlock;
                        if (!hasUnlock) {
                            return;
                        }
                        idArr.push(propRow.id);
                    });
                    break;
                case 5:

                    UtilPub.forArr(propTb, (propRow: any) => {
                        if (propRow.lunc > retRow.quality) {

                            return;
                        }

                        if (playerDataStore.isGetPropTujian(propRow.id) != TujianState.unGet) {
                            return;
                        }

                        let unlockKey = propRow.type * 1000 + propRow.typeson;
                        let hasUnlock = unlockInfo[unlockKey];
                        if (hasUnlock == undefined) {
                            hasUnlock = this.hasUnlockPropType(propRow.id);
                        }
                        unlockInfo[unlockKey] = hasUnlock;
                        if (hasUnlock) {
                            return;
                        }
                        idArr.push(propRow.id);
                    });
                    break;
                case 6:

                    UtilPub.forArr(propTb, (propRow: any) => {
                        if (propRow.lunc > retRow.quality) {

                            return;
                        }

                        if (playerDataStore.isGetPropTujian(propRow.id) != TujianState.unGet) {
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
                    let retId = UtilPub.getRandomItemByArr(idArr, true);
                    if (retId > 0) {

                        switch (res1) {
                            case 2:
                                retId = this.getRoomPropIdByIdLvUp(retId, lvUp);
                                break;
                            case 3:
                            case 6:
                                retId = this.getPropIdByIdLvUp(retId, lvUp);
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
                        let num = this.getValByDesignWeight("1,2,3", retRow.num);
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

                task.starNum = UtilPub.getRandomItemByArr(retRow.taskReward);
                taskArr.push(task);
            }


        }

        if (taskArr.length <= 0) {

            let leastTaskArr = TableDataService.ins().getTable(Const.Tables.leastTask);
            let leastTaskRow = UtilPub.getRandomItemByArr(leastTaskArr);
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


    refreshRoomAutoNew(row: number, col: number) {
        let roomData = this.roomArr[row][col];
        if (!roomData.id || !roomData.timesAuto || roomData.timesAuto <= 0) {
            return;
        }
        if (this.isRoomBubble(row, col)) {
            return;
        }


        let emptyArr: any = [];
        nineAroundArr.forEach((posArr: any) => {
            let r = row + posArr[0];
            let c = col + posArr[1];
            if (this.isCellInsideMergeBoard(r, c)) {
                let rData = this.roomArr[r][c];
                if (!rData.id) {
                    emptyArr.push([r, c]);
                }
            }
        });


        if (emptyArr.length > 0) {
            let tmpObj: any = {};
            let newPosArr: any = [];
            let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, roomData.id);
            while (roomData.timesAuto > 0 && emptyArr.length > 0 && propRow.fair > 0) {
                let roomDataNew = this.initRoomData(propRow.fair);
                let posArr = emptyArr.shift();
                let r = posArr[0];
                let c = posArr[1];
                this.roomArr[r][c] = roomDataNew;
                tmpObj[this.getRoomDataKey(r, c)] = roomDataNew;
                newPosArr.push(posArr);
                roomData.timesAuto--;
                if (roomData.timesAuto <= 0) {
                    roomData.cdAuto = this.getCurrentTimestamp() + propRow.faircd * 1000;
                }
            }


            GameStorage.setObjectMulti(tmpObj);


            this.sendToUIComposeRoomNew(row, col, newPosArr, true);

        }
    }







    sendToUIComposeRoomNew(row: number, col: number, newPosArr: any, isAuto: boolean = false) {
        let data: any = {};
        data.row = row;
        data.col = col;
        data.newPosArr = newPosArr;
        data.isAuto = isAuto;
        Notifications.emit(GD.event.boardSlotSpawn, data);
    }

    sendToUIRoomBubbleBurst(row: number, col: number) {
        let data: any = {};
        data.row = row;
        data.col = col;
        Notifications.emit(GD.event.roomBubbleBurst, data);
    }


    roomDataExchange(srcRow: number, srcCol: number, targetRow: number, targetCol: number) {
        let srcData = this.roomArr[srcRow][srcCol];
        let targetData = this.roomArr[targetRow][targetCol];
        this.setRoomData(srcRow, srcCol, targetData);
        this.setRoomData(targetRow, targetCol, srcData);
    }


    mergeRoomData(srcRow: number, srcCol: number, targetRow: number, targetCol: number) {
        let srcData = this.roomArr[srcRow][srcCol];
        let targetData = this.roomArr[targetRow][targetCol];
        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, srcData.id);

        this.setRoomData(srcRow, srcCol, {});

        if (playerDataStore.isGetPropTujian(propRow.blessId) == TujianState.unGet) {

            let blessRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, propRow.blessId);
            if (blessRow.anc) {
                Notifications.emit(GD.event.boardDiscovery, propRow.blessId);
            }
        }
        let roomData = this.initRoomData(propRow.blessId);
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
        this.setRoomData(targetRow, targetCol, roomData);


        let retObj: any = {};
        retObj.cartonArr = [];
        for (let i in tenAroundArr) {
            let posArr = tenAroundArr[i];
            let r = targetRow + posArr[0];
            let c = targetCol + posArr[1];
            if (this.isCellInsideMergeBoard(r, c)) {
                let rData = this.roomArr[r][c];
                if (rData.st == roomStatus.carton) {
                    rData = this.initRoomData(rData.id, rData, roomStatus.spider);
                    this.setRoomData(r, c, rData);
                    retObj.cartonArr.push({ row: r, col: c });
                }
            }
        }

        this.addManagerVal(Const.ManagerTypes.mergeActionCount);
        if (roomData.id == propIds.coinMaxLv) {
            this.addManagerVal(Const.ManagerTypes.coinPeakMergeCount);
        }
        if (roomData.id == propIds.powerMaxLv) {
            this.addManagerVal(Const.ManagerTypes.energyPeakMergeCount);
        }

        return retObj;
    }

    afterRoomMerge(targetRow: number, targetCol: number) {

        if (!this.isHandDone() || aiRobot.isRobot()) {
            return;
        }

        let roomData = this.roomArr[targetRow][targetCol];
        let arr = TableDataService.ins().getTable(Const.Tables.mergeReward);


        let retRow = TableDataService.ins().getTableValueByID(Const.Tables.mergeReward, 1)

















        if (retRow.propId != 0) {
            let emptyPos = this.getEmptyRoomPos();
            if (emptyPos) {
                let newRoom = null;
                if (retRow.propId == -1) {

                    newRoom = this.initRoomData(roomData.id);
                    newRoom.cdBubble = this.getCurrentTimestamp() + designConfig.bubbleTime;
                } else if (retRow.propId > 0) {

                    newRoom = this.initRoomData(retRow.propId);
                }
                if (newRoom) {
                    this.setRoomData(emptyPos.row, emptyPos.col, newRoom);
                    this.sendToUIComposeRoomNew(targetRow, targetCol, [[emptyPos.row, emptyPos.col]]);
                }
            }
        }
    }









    putDataInRoomBag(row: number, col: number, bagRow: number, bagCol: number) {
        if (this.isRoomBubble(row, col)) {

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
        this.setRoomData(row, col, {});

        roomData.putTime = this.getCurrentTimestamp();
        bagRoomData.roomArr[index] = roomData;

        UtilPub.sortArr(bagRoomData.roomArr, (r1: any, r2: any) => {
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

        this.sendRoomDataToServer(bagRow, bagCol);
        return true;
    }







    getOutDataFromRoomBag(index: number, bagRow: number, bagCol: number) {
        let emptyPos = mergeBoardStateStore.getEmptyRoomPos();
        if (!emptyPos) {

            return;
        }
        let bagRoomData = this.roomArr[bagRow][bagCol];
        let roomData = bagRoomData.roomArr[index];


        let dt = this.getCurrentTimestamp() - roomData.putTime;
        if (roomData.cd > 0) {
            roomData.cd += dt;
        }
        if (roomData.cdAuto > 0) {
            roomData.cdAuto += dt;
        }
        delete roomData.putTime;

        this.setRoomData(emptyPos.row, emptyPos.col, roomData);

        bagRoomData.roomArr[index] = {};
        this.sortBagRoomArr(bagRow, bagCol);

        return emptyPos;
    }

    sortBagRoomArr(row: number, col: number) {
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
        UtilPub.sortArr(arr, (r1: any, r2: any) => {
            if (r1.id > r2.id) {
                return true;
            }
            return false;
        });
        bagRoomData.roomArr = arr.concat(emptyArr);
        this.sendRoomDataToServer(row, col);
    }

    bagRoomAddGrid(row: number, col: number) {
        let bagRoomData = this.roomArr[row][col];
        bagRoomData.roomArr.push({});
        this.sendRoomDataToServer(row, col);
    }


    onClickRoomNew(row: number, col: number, emptyRow: number, emptyCol: number) {

        let roomData = this.roomArr[row][col];
        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, roomData.id);
        roomData.times--;

        if (!propRow.noPower && mergeBoardStateStore.getBoardEnergyCooldown() <= 0) {

            this.subPropNum(propIds.power);
            if (aiRobot.isRobot() && this.getPropNumById(propIds.power) <= 1) {
                this.addPropNum(propIds.power, 100);
            }
        }

        if (propRow.milo > 0) {
            if (!roomData.cd) {
                roomData.cd = this.getCurrentTimestamp();
            }
            roomData.cd += (propRow.milo * 1000);
        }
        if (roomData.times <= 0) {

            if (propRow.wsb) {

                this.roomArr[row][col] = {};
            } else if (propRow.doge > 0) {

                let roomData2 = this.initRoomData(propRow.doge);
                this.roomArr[row][col] = roomData2;
            } else {

                roomData.cdSum = roomData.cd - this.getCurrentTimestamp();
            }
        }
        this.sendRoomDataToServer(row, col);
        UtilPub.log("remaining times " + roomData.times);

        let propId = 0;
        if (roomData.clickPropId && roomData.clickPropId.length > 0) {

            propId = roomData.clickPropId.shift();
            if (roomData.clickPropId.length <= 0) {
                delete roomData.clickPropId;
            }
        } else {

            propId = this.getValByDesignWeight(propRow.atom, propRow.matic);
        }

        let newRoomData = this.initRoomData(propId);
        this.setRoomData(emptyRow, emptyCol, newRoomData);


        this.addManagerVal(Const.ManagerTypes.roomClickAdd);
        let newPropRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, propId);
        UtilPub.log("生成新物�?id:%d,name:%s".format(propId, newPropRow.name));

    }


    onClickRoomAward(row: number, col: number, roomPos: Vec3) {
        let roomData = this.roomArr[row][col];
        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, roomData.id);

        this.addPropNum(propRow.clickAwardId, propRow.clickAwardNum, roomPos);

        this.setRoomData(row, col, {});
    }


    onClickUnlockRoom(row: number, col: number) {
        let unlocking = false;
        UtilPub.for2Arr(mergeBoardStateStore.roomArr, (pData: any, pRow: number, pCol: number) => {
            if (!pData || !pData.id || mergeBoardStateStore.isRoomBubble(pRow, pCol)) {
                return;
            }
            let propRow2 = TableDataService.ins().getTableValueByID(Const.Tables.prop, pData.id);
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
        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, roomData.id);
        roomData.unlock = 1;
        roomData.cd = this.getCurrentTimestamp() + propRow.p1 * 1000;
        roomData.cdSum = propRow.p1 * 1000;
        this.sendRoomDataToServer(row, col);

        if (roomData.id == propIds.pinkBag || roomData.id == propIds.pinkBag2) {
            this.addManagerVal(Const.ManagerTypes.unlockPinkBag);
        }
    }

    onClickEspRoom(row: number, col: number) {
        let ret: any = {};
        let roomData = this.roomArr[row][col];
        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, roomData.id);
        switch (propRow.mdt) {
            case 2:

                GameStorage.setInt(Const.DataKeys.boardEnergyReadyAt, this.getCurrentTimestamp() + propRow.p1 * 1000);
                this.setRoomData(row, col, {});
                break;
            case 5:

                let timestamp = this.getCurrentTimestamp();
                ret.arr = [];
                UtilPub.for2Arr(this.roomArr, (rData: any, r: number, c: number) => {
                    if (this.isRoomBubble(r, c)) {
                        return;
                    }
                    if (!this.isRoomNormal(r, c)) {
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
                        this.setRoomData(r, c);
                    }

                    if (rData.cdAuto) {

                        rData.cdAuto -= subCd;

                        this.update();
                    }

                    if (rData.cd || rData.cdAuto) {
                        ret.arr.push({ row: r, col: c });
                    }

                });
                this.setRoomData(row, col, {});
                return ret;
                break;
            case 11:

                if (!roomData.cd) {
                    let duration = propRow.p1 * 60 * 60 * 1000;


                    let timestamp = this.getCurrentTimestamp();
                    roomData.startTime = timestamp;
                    roomData.cd = timestamp + duration;
                    roomData.cdSum = duration;
                    roomData.notSubCd = true;
                    this.setRoomData(row, col);
                }
                break;
            default:
                break;
        }
    }


    getBoardEnergyCooldown() {
        let time = GameStorage.getInt(Const.DataKeys.boardEnergyReadyAt, 0);
        let dt = time - this.getCurrentTimestamp();
        if (dt < 0) {
            dt = 0;
        }
        return dt;
    }


    sellRoomData(row: number, col: number, startPos: Vec3) {
        let roomData = this.roomArr[row][col];
        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, roomData.id);
        let coin = propRow.levelGold;
        if (!coin) {
            return;
        }
        mergeBoardStateStore.addPropNum(propIds.coin, coin, startPos);

        this.setRoomData(row, col, {});

        this.addManagerVal(Const.ManagerTypes.roomSell);

        return { roomData: roomData, coin: coin, row: row, col: col };
    }

    sellBack(sellData: any) {
        let roomData = this.roomArr[sellData.row][sellData.col];

        this.subPropNum(propIds.coin, sellData.coin);
        if (roomData.id) {

            let emptyPos = this.getEmptyRoomPos();
            if (emptyPos) {
                this.setRoomData(emptyPos.row, emptyPos.col, sellData.roomData);
            } else {

                this.addPropNum(sellData.id);
            }
            return emptyPos;
        }


        this.setRoomData(sellData.row, sellData.col, sellData.roomData);

        return { row: sellData.row, col: sellData.col };

    }








    roomDataCdOver(row: number, col: number, dt: number, cdType: number) {
        let roomData = this.roomArr[row][col];
        let num = this.getOverCdCostDiamond(dt);
        if (this.getPropNumById(propIds.diamond) < num) {

            this.showToast(localText.lackDiamond);
            return;
        }
        this.subPropNum(propIds.diamond, num);
        if (cdType == 1) {
            roomData.cd = this.getCurrentTimestamp();
        } else if (cdType == 2) {
            roomData.cdAuto = this.getCurrentTimestamp();
        }
        this.update();

        return true;
    }


    roomDataBubbleGet(row: number, col: number) {
        let roomData = this.roomArr[row][col];
        if (!roomData.cdBubble) {
            return;
        }
        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, roomData.id);
        if (this.getPropNumById(propIds.diamond) < propRow.bubble) {

            return;
        }
        this.subPropNum(propIds.diamond, propRow.bubble);
        delete roomData.cdBubble;
        this.sendRoomDataToServer(row, col);

        return true;
    }

    rommDataCdBubbleOver(row: number, col: number) {
        let roomData = this.roomArr[row][col];
        roomData.cdBubble = this.getCurrentTimestamp();
        this.update();
    }

    setRoomData(row: number, col: number, roomData?: any) {
        if (roomData) {
            this.roomArr[row][col] = roomData;
        }
        this.sendRoomDataToServer(row, col);
    }

    getRoomDataBagInfo() {
        let ret: any = null;
        UtilPub.for2Arr(this.roomArr, (roomData: any, row: number, col: number) => {
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

    consumeProp(propId: number, num: number) {
        let bagInfo = this.getRoomDataBagInfo();
        let hasBagProp = false;

        let hasInfo = this.getRoomDataHasInfoById(propId);
        let info = hasInfo.arr[0];
        if (info.isBag) {

            bagInfo.roomData.roomArr[info.index] = {};
            hasBagProp = true;
        } else {

            this.setRoomData(info.row, info.col, {});
        }
        if (hasBagProp) {
            this.sortBagRoomArr(bagInfo.row, bagInfo.col);
        }

    }

    onClickTaskDone(task: any, startPos?: Vec3) {
        let index = mergeBoardStateStore.taskArr.indexOf(task);
        let bagInfo = this.getRoomDataBagInfo();
        let hasBagProp = false;
        let subPropArr: any = [];

        for (let i in task.propArr) {
            let prop = task.propArr[i];
            let hasInfo = this.getRoomDataHasInfoById(prop.id);
            for (let j = 0; j < prop.num; j++) {
                let info = hasInfo.arr[j];
                if (info.isBag) {

                    bagInfo.roomData.roomArr[info.index] = {};
                    hasBagProp = true;
                } else {

                    this.setRoomData(info.row, info.col, {});
                }
                info.id = prop.id;
                subPropArr.push(info);
            }
        }
        if (hasBagProp) {
            this.sortBagRoomArr(bagInfo.row, bagInfo.col);
        }


        this.addPropNum(propIds.star, task.starNum, startPos);

        let line = task.line
        if (line > 0)
            this.submitLineTask(task.taskId, line)

        mergeBoardStateStore.taskArr.splice(index, 1);


        if (aiRobot.isRobot()) {
            mergeBoardStateStore.taskArr.push(aiRobot.createTask());
        } else {
            let nextHandTask = null;
            if (task.hand) {
                nextHandTask = this.createHandTask(task.id + 1);
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
                    let retArr = this.createTask();
                    mergeBoardStateStore.taskArr = retArr
                }
            }
            GamePlatform.track("玩家完成任务");
        }

        this.sendTaskArrToServer();
        this.addManagerVal(Const.ManagerTypes.taskDone);

        return subPropArr;
    }


    refreshTask(task: any) {
        let index = mergeBoardStateStore.taskArr.indexOf(task);
        let newTask = this.createTask()[0];
        if (newTask) {
            newTask.id = task.id;
            newTask.hand = task.hand;
            mergeBoardStateStore.taskArr[index] = newTask;
            Notifications.emit(GD.event.refreshTask);
        }

    }







    getValByDesignWeight(valStr: string, weightStr: string) {
        let valArr = ("" + valStr).split(",");
        let weightArr = ("" + weightStr).split(",");
        let arr: any = [];
        UtilPub.forArr(valArr, (val: any, index: number) => {
            let info: any = {};
            info.val = parseInt(val);
            info.weight = parseInt(weightArr[index]);
            arr.push(info);
        });
        let ret = UtilPub.getRowByWeight(arr);

        return ret.val;
    }


    getEmptyRoomPos() {
        let emptyPos: any = null;
        UtilPub.for2Arr(this.roomArr, (data: any, r: number, c: number) => {
            if (!data.id) {
                emptyPos = {};
                emptyPos.row = r;
                emptyPos.col = c;
                return true;
            }
        }, true);

        return emptyPos;
    }


    isRoomCarton(row: number, col: number) {
        let roomData = this.roomArr[row][col];
        if (roomData.st == roomStatus.carton) {
            return true;
        }
        return false;
    }

    isRoomSpider(row: number, col: number) {
        let roomData = this.roomArr[row][col];
        if (roomData.st == roomStatus.spider) {
            return true;
        }
        return false;
    }

    isRoomBubble(row: number, col: number) {
        let roomData = this.roomArr[row][col];
        if (!roomData.cdBubble) {
            return false;
        }
        if (this.getCurrentTimestamp() <= roomData.cdBubble) {
            return true;
        }
        return false;
    }

    isRoomCd(row: number, col: number) {
        let roomData = this.roomArr[row][col];
        if (roomData.cdSum > 0) {
            return true;
        }
        return false;
    }


    getOverCdCostDiamond(dt: number) {
        let num = Math.ceil(dt / 1000 / 60 / TableDataService.ins().config.minuteCost);

        return num;
    }






    getRoomDataHasInfoById(id: number) {
        let num = 0;
        let arr: any = [];
        let roomDataBag: any = null;
        UtilPub.for2Arr(this.roomArr, (roomData: any, row: number, col: number) => {
            if (!roomData.id || this.isRoomBubble(row, col) || this.isRoomCarton(row, col) || this.isRoomSpider(row, col)) {
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







    addManagerVal(type: number, val: number = 1) {
        if (this.isManagerAllGet() || !this.managerArr) {
            return;
        }

        UtilPub.forArr(this.managerArr, (manager: any, index: number) => {
            let row = TableDataService.ins().getTableValueByID(Const.Tables.manager, manager.id);
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
            this.sendManagerToServer(index);
            Notifications.emit(GD.event.boardMilestoneRefresh);
        });
    }
    getManagerVal(manager: any) {
        let row = TableDataService.ins().getTableValueByID(Const.Tables.manager, manager.id);
        let val = manager.val;
        if (row.taskType == Const.ManagerTypes.roleLv) {
            val = playerDataStore.roleLv;
        }
        if (val > row.p1) {
            val = row.p1;
        }

        return val;
    }




    managerGetAward(index: number, startPos: Vec3) {
        let manager = this.managerArr[index];
        if (manager.get) {
            return;
        }
        manager.get = true;
        this.sendManagerToServer(index);
        let row = TableDataService.ins().getTableValueByID(Const.Tables.manager, manager.id);
        this.addPropNum(row.price[0], row.price[1], startPos);

        GamePlatform.track("finish manager daily task " + manager.id);

        let allGet = true;
        for (let i = 0; i < this.managerArr.length; i++) {
            let man = this.managerArr[i];
            if (!man.get) {

                allGet = false;
                break;
            }
        }
        if (allGet) {

            this.createNextManager();
        }


        allGet = true;
        let tb = TableDataService.ins().getTable(Const.Tables.manager);
        for (let i = 0; i < tb.length; i++) {
            let pManager = this.managerArr[i];
            if (!pManager || !pManager.get) {
                allGet = false;
                break;
            }
        }
        if (allGet) {
            GameStorage.setInt(Const.DataKeys.boardMilestoneAllClaimed, 1);
        }

        Notifications.emit(GD.event.boardMilestoneRefresh);
    }
    isManagerAllGet() {
        return GameStorage.getInt(Const.DataKeys.boardMilestoneAllClaimed);
    }






    isCellInsideMergeBoard(row: number, col: number) {
        if (row >= 0 && row <= this.rowNum - 1 && col >= 0 && col <= this.colNum - 1) {
            return true;
        }
        return false;
    }


    onClickCardLayer() {
        if (this.cardArr.length <= 0) {
            return;
        }
        let emptyPos = this.getEmptyRoomPos();
        if (!emptyPos) {
            return;
        }
        let id = this.cardArr.shift();
        let roomData = this.initRoomData(id);
        this.setRoomData(emptyPos.row, emptyPos.col, roomData);

        this.sendCardArrToServer();

        return emptyPos;
    }







    propCanCreateNewProp(id: number) {
        if (this.propIsPutInCardList(id)) {
            let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, id);
            if (propRow.anc || propRow.fair) {
                return true;
            }
        }
        return false;
    }





    propIsPutInCardList(id: number) {
        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, id);
        if ((propRow.type >= 100 && propRow.type < 200) || propRow.type == 27) {

            return false;
        }
        return true;
    }





    addPropNum(propId: number, propNum: number = 1, startPos?: Vec3, endPos?: Vec3, notFlay = false) {
        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, propId);
        UtilPub.log("获得道具 %s id:%d,num:%d".format(propRow.name, propId, propNum));
        if (this.propIsPutInCardList(propId)) {

            for (let i = 0; i < propNum; i++) {
                this.cardArr.push(propId);
            }
            this.sendCardArrToServer();
            Notifications.emit(GD.event.boardCardRefresh);
            if (notFlay) {
                return;
            }
            let mergeBoardLayer = this.findMergeBoardLayer();
            if (!startPos) {
                startPos = this.getScreenMidPos();
            }
            if (mergeBoardLayer) {
                playerDataStore.showResFly(propId, propNum, startPos, mergeBoardLayer.getCardLayerPos());
            } else {
                playerDataStore.showResFly(propId, propNum, startPos, this.btnMergeBoardPos);
            }
        } else {
            if (propId == propIds.star) {
                if (!startPos) {
                    startPos = this.getScreenMidPos();
                }
                let mergeBoardLayer = this.findMergeBoardLayer();
                if (mergeBoardLayer) {
                    endPos = mergeBoardLayer.getBtnBuildStarPos();
                } else {
                    endPos = this.btnMergeBoardPos;
                }
            }
            if (startPos) {
                if (!endPos) {
                    endPos = Vec3.ZERO;
                }
                playerDataStore.getProp([propId, propNum], startPos, endPos);
            } else if (endPos) {
                if (!startPos) {
                    startPos = this.getScreenMidPos();
                }
                playerDataStore.getProp([propId, propNum], startPos, endPos);
            } else {
                playerDataStore.getProp([propId, propNum], null, null);
            }
        }
    }





    subPropNum(propId: number, propNum: number = 1) {
        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, propId);
        UtilPub.log("扣减道具 %s id:%d,num:%d".format(propRow.name, propId, propNum));

        if (propId == propIds.coin) {
            this.addManagerVal(Const.ManagerTypes.coinCost, propNum);
        } else if (propId == propIds.power) {
            this.addManagerVal(Const.ManagerTypes.powerCost, propNum);
            seasonProgressStore.addSeasonScore(propNum);
        }
        playerDataStore.checkAndUseProp([propId, propNum]);
        Notifications.emit(GD.event.updateMoney);
    }

    getPropNumById(propId: number) {
        return playerDataStore.curPropNum(propId);
    }




    deleteAllRoomData() {

        let keyArr: string[] = [];
        UtilPub.for2Arr(this.roomArr, (roomData: any, row: number, col: number) => {
            keyArr.push(this.getRoomDataKey(row, col));
        });
        GameStorage.removeMulti(keyArr);


        GameStorage.removeItem(this.taskDataKey);


        keyArr = [];
        UtilPub.forArr(this.managerArr, (manager: any, index: number) => {
            keyArr.push(this.getManagerDataKey(index));
        });
        GameStorage.removeMulti(keyArr);
        GameStorage.removeItem(Const.DataKeys.boardMilestoneAllClaimed);


        GameStorage.removeItem(Const.DataKeys.boardCardArr);


        GameStorage.removeItem(Const.DataKeys.handIndex);
    }


    sendTaskArrToServer() {
        GameStorage.setObject(this.taskDataKey, this.taskArr);
    }


    sendManagerToServer(index: number) {
        let manager = this.managerArr[index];
        let key = this.getManagerDataKey(index);
        GameStorage.setObject(key, manager);
    }


    sendCardArrToServer() {
        GameStorage.setObject(Const.DataKeys.boardCardArr, this.cardArr);
    }







    sendRoomDataToServer(row: number, col: number, roomData?: any) {
        if (!roomData) {
            roomData = this.roomArr[row][col];
        }
        GameStorage.setObject(this.getRoomDataKey(row, col), roomData);
    }


    getCurrentTimestamp() {

        let timestamp = TimeCtrJSF.GetInstance().ServerTime;

        return timestamp;
    }

    getTaskArrSort() {


        let arr = [];

        for (let i = 0; i < mergeBoardStateStore.taskArr.length; i++) {
            arr.push(mergeBoardStateStore.taskArr[i]);
        }



        UtilPub.sortArr(arr, (t1: any, t2: any) => {
            let t1Percent = 0;
            let onePercent = 1 / t1.propArr.length;
            for (let i in t1.propArr) {
                let prop = t1.propArr[i];
                let hasInfo = mergeBoardStateStore.getRoomDataHasInfoById(prop.id);
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
                let hasInfo = mergeBoardStateStore.getRoomDataHasInfoById(prop.id);
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

    getComposePropCount(propId: number) {
        return GameStorage.getInt(Const.DataKeys.boardItemCount + propId, 0);
    }
    setComposePropCount(propId: number, val: number) {
        return GameStorage.setInt(Const.DataKeys.boardItemCount + propId, val);
    }

    getHandIndex() {
        let handIndex = GameStorage.getInt(Const.DataKeys.handIndex, 1);
        if (aiRobot.isRobot()) {
            handIndex = handData.length;
            mergeBoardStateStore.setHandIndex(handIndex);
        }
        return handIndex;
    }
    addHandIndex() {
        let index = this.getHandIndex();
        GamePlatform.track("完成新手教程" + index);
        index++;
        this.setHandIndex(index);
    }
    setHandIndex(handIndex: number) {
        GameStorage.setInt(Const.DataKeys.handIndex, handIndex);
    }
    closeHandLayer() {
        let handLayer = find("Canvas/HandLayer");
        if (handLayer) {
            handLayer.getComponent(HandLayer)!.close();
        }
    }
    handLayerHideHand() {
        let handLayer = find("Canvas/HandLayer");
        if (handLayer) {
            handLayer.getComponent(HandLayer)!.hideHand();
        }
    }
    isHandDone() {
        let handIndex = this.getHandIndex();
        if (handData[handIndex]) {
            return false;
        }
        return true;
    }
    getHandLayer(): any {
        let handLayer = find("Canvas/HandLayer");
        if (handLayer) {
            return handLayer.getComponent(HandLayer);
        }
        return {};
    }
    findMergeBoardLayer(): MergeBoardLayer | null {
        let mergeBoardLayer = find("Canvas/MergeBoardLayer");
        if (mergeBoardLayer) {
            return mergeBoardLayer.getComponent(MergeBoardLayer);
        }
        return null;
    }

    isTaskNeedWithId(id: number) {
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


    openAd(info: string, cb?: Function) {
        if (Const.isDebug) {
            if (cb) {
                cb(true);
            }
            return;
        }
        GamePlatform.showRewardVideo(info, (st) => {
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

    openPropInfoLayer(propId: number) {
        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, propId);
        if (propRow.tan) {
            UiLayerService.instance.showDialog(Const.Dialogs.PropItemInfo, { propdata: propRow });
        } else {
            UiLayerService.instance.showDialog(Const.Dialogs.ItemCodexLayer, propId);
        }
    }

    getScreenMidPos() {
        let width = view.getVisibleSize().width;
        let height = view.getVisibleSize().height;

        return v3(width * 0.5, height * 0.5, 0);
    }

    isRoomNormal(row: number, col: number) {
        let roomData = this.roomArr[row][col];
        if (!roomData.id || roomData.st == roomStatus.spider || roomData.st == roomStatus.carton || this.isRoomBubble(row, col)) {
            return false;
        }
        return true;
    }

    canAddTimes(id: number) {
        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, id);
        if (propRow && propRow.chongneng && propRow.anc) {
            return true;
        }
        return false;
    }


    roomAddTimes(row: number, col: number, targetRow: number, targetCol: number, val: number) {
        this.setRoomData(row, col, {});
        let roomData = this.roomArr[targetRow][targetCol];
        delete roomData.cdSum;
        roomData.times += val;
        UtilPub.log("add times " + val, roomData.times);
        this.setRoomData(targetRow, targetRow);
    }

    canSplitProp(id: number, targetId: number) {
        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, id);
        let targetPropRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, targetId);
        if (targetPropRow && targetPropRow.jiandao && targetPropRow.luna > 1 && targetPropRow.luna <= propRow.p1) {
            return true;
        }

        return false;
    }


    roomPropSplit(row: number, col: number, targetRow: number, targetCol: number) {
        this.setRoomData(row, col, {});
        let roomData = this.roomArr[targetRow][targetCol];
        let splitRoomData = this.initRoomData(roomData.id - 1);
        this.setRoomData(targetRow, targetCol, splitRoomData);
        let emptyPos = this.getEmptyRoomPos();
        if (emptyPos) {
            this.setRoomData(emptyPos.row, emptyPos.col, JSON.parse(JSON.stringify(splitRoomData)));
        }

        return { emptyPos: emptyPos };
    }

    canLvUpProp(id: number, targetId: number) {
        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, id);
        let targetPropRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, targetId);
        if (!targetPropRow || this.propIsMaxLv(targetId)) {
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

    propIsMaxLv(id: number) {
        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, id);
        let nextPropRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, id + 1);
        let isMaxLv = false;
        if (!nextPropRow || nextPropRow.type != propRow.type || nextPropRow.typeson != propRow.typeson) {
            isMaxLv = true;
        }
        return isMaxLv;
    }

    roomPropLvUp(row: number, col: number, targetRow: number, targetCol: number) {
        this.setRoomData(row, col, {});
        let targetRoomData = this.roomArr[targetRow][targetCol];
        let roomData = this.initRoomData(targetRoomData.id + 1);
        this.setRoomData(targetRow, targetCol, roomData);
    }

    propCanSpeedUp(id: number) {
        let row = TableDataService.ins().getTableValueByID(Const.Tables.prop, id);
        if ((row.anc && row.milo) || row.faircd) {
            return true;
        }
        return false;
    }


    getRoomDataByItemUI(itemUI: Node) {
        // @ts-ignore
        return this.roomArr[itemUI.row][itemUI.col];
    }

}

const mergeBoardStateStore = MergeBoardStateStore.getInstane();

export { mergeBoardStateStore };

