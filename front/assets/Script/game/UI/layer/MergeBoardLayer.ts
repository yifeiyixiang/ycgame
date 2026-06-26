

import { Button, director, EditBox, EventTouch, find, instantiate, isValid, Layout, Node, NodeEventType, sp, Sprite, Tween, tween, UIOpacity, UITransform, v2, v3, Vec2, Vec3, view, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { localText } from '../../../config/localText';
import { AudioPlaybackService } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { GameStorage } from '../../../easyFramework/mgr/gameStorage';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import { GNetCmd } from '../../../easyFramework/network/conf';
import ServerCtrJSF from '../../../easyFramework/network/ServerCtrJSF';
import TableDataService from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { AnimationCtrl } from '../../comm/AnimationCtrl';
import { mergeBoardStateStore, nineAroundArr, propIds, roomStatus } from '../../comm/mergeBoardModel';
import { MovePath } from '../../comm/MovePath';
import { seasonProgressStore } from '../../comm/playerModel';
import { redPointManager, RPointEvent } from '../../comm/RedPointManager';
import { playerDataStore } from '../../comm/UserData';
import { UtilGame } from '../../comm/UtilGame';
import { UtilScene } from '../../comm/UtilScene';
import { handIndexs } from '../../data/handData';
import { TreasureModel } from '../Dialog/TreasureModel';
import { main_top } from '../main/main_top';
import { MonthCard } from '../money/MonthCard';
import { GameEventManager } from '../../../../typeScript/EventManger';
import { GamePlatform } from '../../platform/GamePlatform';
const { ccclass, property } = _decorator;

@ccclass('MergeBoardLayer')
export class MergeBoardLayer extends BaseView {

    @property(Node)
    bgNode: Node = null!;
    @property(Node)
    uiNode: Node = null!;

    @property({ type: Node })
    btnClose: Node = null!;
    @property({ type: Node })
    btnShop: Node = null!;
    @property({ type: Node })
    btnDeleteData: Node = null!;

    @property(Node)
    roomBgMaskNode: Node = null!;
    @property({ type: Node })
    roomListLayer: Node = null!;
    @property({ type: Node })
    roomItem: Node = null!;
    @property({ type: Node })
    roomStatus: Node = null!;

    @property({ type: Node })
    moveItemLayer: Node = null!;
    @property({ type: Node })
    moveItem: Node = null!;

    roomItemUIArr: any = [];


    roomWidth: number = 0;

    dPos: Vec2 = v2(0, 0);

    choseRoomItem: any;
    startRoomItem: any;
    moveRoomItem: any;
    touchMoveCount: number = 0;


    roomItemMergeHintArr: any = [];

    @property({ type: Node })
    btnBuild: Node = null!;
    @property({ type: Node })
    buildBody: Node = null!;

    @property({ type: Node })
    infoUILayer: Node = null!;
    @property({ type: Node })
    btnPropDetail: Node = null!;
    @property({ type: Node })
    sellBackLayer: Node = null!;
    @property({ type: Node })
    infoHintNode: Node = null!;
    @property({ type: Node })
    btnSell: Node = null!;
    @property({ type: Node })
    btnCdOver: Node = null!;
    @property({ type: Node })
    btnUnlock: Node = null!;
    @property({ type: Node })
    btnBubbleGet: Node = null!;
    @property({ type: Node })
    btnBubbleOver: Node = null!;
    @property({ type: Node })
    btnSellBack: Node = null!;

    sellData: any;

    @property({ type: Node })
    taskLayer: Node = null!;
    @property({ type: Node })
    taskItem: Node = null!;
    @property({ type: Node })
    btnTaskList: Node = null!;


    lastTaskArr: any;

    @property({ type: Node })
    btnManager: Node = null!;
    @property({ type: Node })
    cardLayer: Node = null!;
    @property({ type: Node })
    cardItem: Node = null!;

    @property({ type: Node })
    bubbleLayer: Node = null!;


    @property({ type: Node })
    mergeFxLayer: Node = null!;
    @property({ type: Node })
    mergeFxItem: Node = null!;
    currentMergeFx: any;

    cartonSpinePath = Const.resPath.mergeSpine + "xzsl/xzsl";
    tbgxSpinePath = Const.resPath.mergeSpine + "tbgx/tbgx";
    jsqSpinePath = Const.resPath.mergeSpine + "jsq/jsq";

    mergeAudioCount: number = 0;
    touching: boolean = false;

    @property({ type: Node })
    propid: Node = null!;

    @property({ type: Node })
    propnum: Node = null!;

    addPropID() {
        let id = this.propid.getComponent(EditBox)!.string
        let propnum = this.propnum.getComponent(EditBox)!.string
        mergeBoardStateStore.addPropNum(parseInt(id), parseInt(propnum))

    }

    onLoad() {
        UtilPub.loadSpineSkeletonData(this.tbgxSpinePath);
        UtilPub.loadSpineSkeletonData(this.jsqSpinePath);

        this.roomListLayer.on(NodeEventType.TOUCH_START, this.roomListTouchStart, this);
        this.roomListLayer.on(NodeEventType.TOUCH_MOVE, this.roomListTouchMove, this);
        this.roomListLayer.on(NodeEventType.TOUCH_END, this.roomListTouchEnd, this);
        this.roomListLayer.on(NodeEventType.TOUCH_CANCEL, this.roomListTouchCancel, this);

        this.roomItem.active = false;
        this.roomItem.parent = this.node;
        this.roomWidth = this.roomItem.getComponent(UITransform)!.width;
        this.roomStatus.active = false;

        this.taskItem.active = false;
        this.taskItem.parent = this.node;

        this.moveItem.active = false;
        this.moveItem.parent = this.node;

        this.cardItem.active = false;
        this.cardItem.parent = this.node;

        this.mergeFxItem.active = false;
        this.mergeFxItem.parent = this.node;

        this.initRoomLayer();
        this.bindButtonNoAudio(this.btnClose, this.onClickBtnClose);
        this.bindButton(this.btnShop, this.onClickBtnShop);
        this.bindButton(this.btnDeleteData, this.onClickBtnDeleteData);

        this.bindButton(this.infoUILayer, this.onClickInfoUI);
        this.bindButton(this.btnUnlock, this.onClickBtnUnlock);
        this.bindButton(this.btnCdOver, this.onClickBtnCdOver);
        this.bindButton(this.btnBubbleGet, this.onClickBtnBubbleGet);
        this.bindButton(this.btnBubbleOver, this.onClickBtnBubbleOver);

        this.bindButtonNoAudio(this.btnSellBack, this.onClickBtnSellBack);
        this.bindButtonNoAudio(this.btnSell, this.onClickBtnSell);

        this.bindButton(this.btnBuild, this.onClickBtnBuild);
        this.bindButton(this.btnManager, this.onClickBtnManager);
        this.bindButton(this.cardLayer, this.onClickCardLayer);
        this.bindButton(this.btnTaskList, this.onClickBtnTaskList);

        this.addPrefab(Const.Prefabs.Main_top, this.node, null!, { parentNode: this.node, flag: main_top.ShowLevel | main_top.ShowCoin | main_top.ShowPower | main_top.ShowDiamond });

        redPointManager.setRedpoint(this.btnBuild, RPointEvent.boardBuildHint, false, 1.5, 35, 22);

        let uiHeight = this.uiNode.getComponent(UITransform)!.height;
        let topHeight = 110;
        let visibleHeight = view.getVisibleSize().height;
        this.uiNode.position = v3(0, -topHeight * 0.5);
        let dh = visibleHeight - uiHeight - topHeight;
        if (dh < 0) {
            let s = 1 + dh / uiHeight;
            this.uiNode.scale = v3(s, s, 1);
        }
        if (visibleHeight > view.getDesignResolutionSize().height) {
            let s = visibleHeight / view.getDesignResolutionSize().height;
            this.bgNode.scale = v3(s, s, 1);
        }

    }

    onEnable() {
    }

    start() {

    }

    show(args: any) {
        console.log(" show 0")

        super.show(args);
        console.log(" show 1")

        UtilGame.sceneClose();
        console.log(" show 2")


        mergeBoardStateStore.loadData();
        this.moveItemLayer.destroyAllChildren();
        this.mergeFxLayer.destroyAllChildren();
        this.bubbleLayer.destroyAllChildren();
        this.moveRoomItem = null;
        this.choseRoomItem = null;
        this.sellData = null;
        this.lastTaskArr = null;
        this.mergeAudioCount = 0;
        this.roomBgMaskNode.active = false;
        this.touching = false;
        console.log(" show 3")

        this.initTaskLayer();
        this.refreshCardLayer();
        this.refreshManagerLayer();
        this.refershRoomLayer();
        this.refreshComposeHint();
        this.refreshBottomLayer();
        this.refreshBuildLayer();
        this.refreshBtnTaskList();
        console.log(" show 4")

        this.on(GD.event.boardSlotSpawn, this.boardSlotSpawnRet, this);
        this.on(GD.event.roomBubbleBurst, this.roomBubbleBurstRet, this);
        this.on(GD.event.boardBagWithdraw, this.boardBagWithdrawRet, this);
        this.on(GD.event.boardMilestoneRefresh, this.boardMilestoneRefreshRet, this);
        this.on(GD.event.boardCardRefresh, this.boardCardRefreshRet, this);
        this.on(GD.event.boardDiscovery, this.boardDiscoveryRet, this);
        this.on(GD.event.refreshHandLayer, this.refreshHandLayerRet, this);
        this.on(GD.event.goToBuildScene, this.goToBuildSceneRet, this);
        this.on(GD.event.refreshTask, this.refreshTaskRet, this);
        this.on(GD.event.boardSpeedupEnded, this.boardSpeedupEndedRet, this);
        this.on(GD.event.onClickTaskDone, this.onClickBtnTaskDoneEvent, this);
        console.log(" show 5")


        director.off(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
        director.on(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);


        this.scheduleOnce(() => {
            mergeBoardStateStore.markMergeBoardReady();
            this.refreshHandLayer();
        }, 0.5);
        console.log(" show 6")

        this.schedule(this.startBuildBodyAnimation, 6);
        this.schedule(this.updateLogic, 0.5);

        UtilPub.for2Arr(mergeBoardStateStore.roomArr, (roomData: any) => {
            if (roomData.st == roomStatus.carton) {
                UtilPub.loadSpineSkeletonData(this.cartonSpinePath);
                return true;
            }
        });
        console.log(" show 7")

        let hadnIdnex = mergeBoardStateStore.getHandIndex();
        if (hadnIdnex == handIndexs.shopOpen) {
            let obj: any = {};
            obj.id = hadnIdnex;
            obj.node = this.btnShop
            obj.delayTime = 0.5;
            UiLayerService.instance.showDialog(Const.Dialogs.HandLayer, obj);
        }
        console.log(" show 8")

    }

    close() {
        super.close();
        UtilGame.sceneOpen();

        AudioPlaybackService.instance.playSound(Const.Audio.sceneChange);

        this.off(GD.event.boardSlotSpawn, this.boardSlotSpawnRet);
        this.off(GD.event.roomBubbleBurst, this.roomBubbleBurstRet);
        this.off(GD.event.boardBagWithdraw, this.boardBagWithdrawRet);
        this.off(GD.event.boardMilestoneRefresh, this.boardMilestoneRefreshRet);
        this.off(GD.event.boardCardRefresh, this.boardCardRefreshRet);
        this.off(GD.event.boardDiscovery, this.boardDiscoveryRet);
        this.off(GD.event.refreshHandLayer, this.refreshHandLayerRet);
        this.off(GD.event.goToBuildScene, this.goToBuildSceneRet);
        this.off(GD.event.refreshTask, this.refreshTaskRet);
        this.off(GD.event.onClickTaskDone, this.onClickBtnTaskDoneEvent);

        director.off(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);

    }

    onDisable() {
        mergeBoardStateStore.close();

        this.unschedule(this.scheduleAudioCountReset);
        this.unschedule(this.startBuildBodyAnimation);
        this.unschedule(this.updateLogic);
    }

    refreshBtnTaskList() {






    }

    updateLogic() {

        UtilPub.for2Arr(this.roomItemUIArr, (itemUI: Node, row: number, col: number) => {
            this.refreshSpeedUpSpine(itemUI);
        });

        this.showWeakHand()
    }

    startBuildBodyAnimation() {
        if (Math.random() > 0.3) {
            return;
        }
        let aniName = this.buildBody.getComponent(sp.Skeleton)!.animation;
        if (aniName == "idle2") {
            aniName = "idle3";
        } else {
            aniName = "idle2";
        }
        this.buildBody.getComponent(AnimationCtrl)!.playAnimation(aniName, true);
    }

    refreshHandLayer() {
        let handIndex = mergeBoardStateStore.getHandIndex();

        let obj: any = {};
        obj.id = handIndex;
        let isShow = true;
        switch (handIndex) {
            case handIndexs.firstCompose:
                obj.node = this.roomListLayer;
                obj.startNode = this.roomItemUIArr[4][3];
                obj.endNode = this.roomItemUIArr[4][4];
                break;
            case handIndexs.secondCompose:
                obj.node = this.roomListLayer;
                obj.startNode = this.roomItemUIArr[4][2];
                obj.endNode = this.roomItemUIArr[4][4];
                break;
            case handIndexs.thirdCompose:
                obj.node = this.roomListLayer;
                obj.startNode = this.roomItemUIArr[4][4];
                obj.endNode = this.roomItemUIArr[3][4];
                break;
            case handIndexs.boardItemReveal:
                mergeBoardStateStore.addHandIndex();
                this.refreshHandLayer();
                break;
            case handIndexs.clickRoomNew:
                obj.node = this.roomListLayer;
                obj.nodeHand = this.roomItemUIArr[3][4];
                break;
            case handIndexs.clickRoomNew2:
                obj.node = this.roomListLayer;
                obj.nodeHand = this.roomItemUIArr[3][4];
                break;
            case handIndexs.boardMergeStepA:
                obj.node = this.roomListLayer;
                obj.startNode = this.roomItemUIArr[4][3];
                obj.endNode = this.roomItemUIArr[5][3];
                break;
            case handIndexs.boardMergeStepB:
                obj.node = this.roomListLayer;
                obj.startNode = this.roomItemUIArr[5][3];
                obj.endNode = this.roomItemUIArr[3][2];
                break;
            case handIndexs.taskMittens:
                obj.node = find("btnTaskDone", this.taskLayer.children[0]);
                break;
            case handIndexs.btnBuild:
                obj.node = this.btnBuild;
                break;
            case handIndexs.boardCardPanel:
                obj.node = this.cardLayer;
                break;
            default:
                isShow = false;
                break;
        }
        if (isShow) {
            UiLayerService.instance.showDialog(Const.Dialogs.HandLayer, obj);
        }

    }

    initRoomLayer() {
        let roomListBg = find("ui/roomLayer/roomListBg", this.node)!;
        let roomBgItem = find("bgItem", roomListBg)!;

        let colNum = mergeBoardStateStore.colNum;
        let rowNum = mergeBoardStateStore.rowNum;

        this.roomListLayer.getComponent(UITransform)!.width = this.roomWidth * colNum;
        this.roomListLayer.getComponent(UITransform)!.height = this.roomWidth * rowNum;

        let dx = colNum * this.roomWidth * 0.5 - this.roomWidth * 0.5;
        let dy = rowNum * this.roomWidth * 0.5 - this.roomWidth * 0.5;
        this.dPos.x = dx;
        this.dPos.y = dy;
        this.roomItemUIArr = [];
        for (let i = 0; i < rowNum; i++) {
            this.roomItemUIArr[i] = [];
            for (let j = 0; j < colNum; j++) {
                let bgItem = instantiate(roomBgItem)!;
                let roomItem = instantiate(this.roomItem);
                roomItem.active = true;
                roomItem.parent = this.roomListLayer;
                let pos = v3(0, 0, 0);
                pos.x = this.roomWidth * j - dx;
                pos.y = this.roomWidth * i - dy;
                roomItem.position = pos;
                // @ts-ignore
                roomItem.row = i;
                // @ts-ignore
                roomItem.col = j;
                this.roomItemUIArr[i].push(roomItem);

                bgItem.parent = roomListBg;
                bgItem.position = pos;
                let bgNode = find("bg", bgItem)!;
                let bgNode2 = find("bg2", bgItem)!;
                bgNode.active = false;
                bgNode2.active = false;
                if ((i % 2 == 0 && j % 2 == 1) || (i % 2 == 1 && j % 2 == 0)) {
                    bgNode.active = true;
                } else {
                    bgNode2.active = true;
                }
            }
        }

        roomBgItem.destroy();
    }

    refershRoomLayer() {
        UtilPub.for2Arr(this.roomItemUIArr, (itemUI: Node, row: number, col: number) => {
            this.refreshRoomItemUI(itemUI);
        });
    }

    refreshCardLayer() {
        if (mergeBoardStateStore.cardArr.length <= 0) {
            this.cardLayer.active = false;
            return;
        }
        this.cardLayer.active = true;
        this.cardLayer.removeAllChildren();

        let arr = [];
        let show = 3;
        for (let i = 0; i < show; i++) {
            let id = mergeBoardStateStore.cardArr[i];
            if (!id) {
                break;
            }
            arr.unshift(id);
        }
        let showNum = 0;
        if (mergeBoardStateStore.cardArr.length > show) {
            showNum = mergeBoardStateStore.cardArr.length;
        }
        for (let i = 0; i < arr.length; i++) {
            let itemUI = instantiate(this.cardItem);
            itemUI.active = true;
            itemUI.parent = this.cardLayer;
            let id = arr[i];
            let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, id);

            let iconNode = find("icon", itemUI)!;
            Tween.stopAllByTarget(iconNode);
            let effectNode = find("spine", itemUI)!;
            this.setSpriteFrame2(iconNode.getComponent(Sprite)!, Const.resPath.icon + propRow.icon);
            let numNode = find("num", itemUI)!;
            if (i == arr.length - 1 && showNum > 0) {
                numNode.active = true;
                this.setString(find("val", numNode), showNum);
            } else {
                numNode.active = false;
            }
            if (i == arr.length - 1) {
                effectNode.active = true;
                let time = 0.3;
                let scale = 1.2;
                tween(iconNode)
                    .to(time, { scale: v3(scale, scale, 1) })
                    .to(time, { scale: v3(1, 1, 1) })
                    .to(time, { scale: v3(scale, scale, 1) })
                    .to(time, { scale: v3(1, 1, 1) })
                    .delay(3)
                    .union()
                    .repeatForever()
                    .start();
            } else {
                effectNode.active = false;
            }
        }

    }

    refreshManagerLayer() {
        if (mergeBoardStateStore.isManagerAllGet()) {
            this.btnManager.active = false;
            return;
        }
        this.btnManager.active = true;

        let infoLayer = find("info", this.btnManager)!;
        let hintNode = find("hint", this.btnManager)!;
        let btnLookManager = find("btnLookManager", this.btnManager)!;
        infoLayer.active = false;
        hintNode.active = false;
        btnLookManager.active = false;


        let manager = null;
        let hasCanGetAward = false;
        for (let i in mergeBoardStateStore.managerArr) {
            let temp = mergeBoardStateStore.managerArr[i];
            if (!manager && !temp.get) {
                manager = temp;
            }
            let row = TableDataService.ins().getTableValueByID(Const.Tables.manager, temp.id);
            if (mergeBoardStateStore.getManagerVal(temp) >= row.p1 && !temp.get) {
                hasCanGetAward = true;
            }
        }
        if (hasCanGetAward) {
            btnLookManager.active = true;
            hintNode.active = true;
        } else {
            if (manager) {
                infoLayer.active = true;
                let row = TableDataService.ins().getTableValueByID(Const.Tables.manager, manager.id);
                this.setString(find("info/id/val", this.btnManager), manager.id);
                this.setProgressBar(find("info/progress", this.btnManager)!, mergeBoardStateStore.getManagerVal(manager) / row.p1);
                let propId = row.price[0];
                let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, propId);
                this.setSpriteFrame2(find("info/icon", this.btnManager)?.getComponent(Sprite)!, Const.resPath.icon + propRow.icon);
            }
        }
    }

    initTaskLayer() {
        this.taskLayer.removeAllChildren();

        for (let i = 0; i < mergeBoardStateStore.taskArr.length; i++) {
            let TaskItemCellController = instantiate(this.taskItem);
            TaskItemCellController.active = true;
            TaskItemCellController.parent = this.taskLayer;
        }

        this.refreshTaskLayer();
    }

    refreshTaskLayer() {
        let arr = mergeBoardStateStore.getTaskArrSort();
        for (let i = 0; i < arr.length; i++) {
            let task = arr[i];
            let TaskItemCellController = this.taskLayer.children[i];

            this.refreshTaskItem(TaskItemCellController, task);

            if (TaskItemCellController == null) {
                continue
            }
            if (this.lastTaskArr && !this.checkIsLastTaskArr(task)) {

                TaskItemCellController.scale = v3(0, 0, 1);

                tween(TaskItemCellController).to(0.3, { scale: v3(1, 1, 1) }, {
                    onUpdate: () => {
                        this.updateTaskLayerLayout();
                    }
                }).set({ scale: v3(1, 1, 1) }).start();
            } else {
                TaskItemCellController.scale = v3(1, 1, 1);
                this.updateTaskLayerLayout();
            }
            this.bindButton(TaskItemCellController, this.onClickTaskItem);
        }

    }

    checkIsLastTaskArr(task: any) {
        if (this.lastTaskArr == null) {
            return
        }
        for (let index = 0; index < this.lastTaskArr.length; index++) {
            const element = this.lastTaskArr[index];
            if (element.id == task.id) {
                return true
            }
        }
        return false
    }

    refreshTaskItem(itemUI: Node, task: any) {

        if (itemUI == null) {
            itemUI = instantiate(this.taskItem);
            itemUI.active = true;
            itemUI.parent = this.taskLayer;
        }
        // @ts-ignore
        itemUI.task = task;
        let chs = find("propLayer", itemUI)!.children;
        let hasDone = true;
        chs.forEach((propItem: Node, i: number) => {
            let prop = task.propArr[i];
            if (prop) {
                propItem.active = true;
                let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, prop.id);
                if (!propRow) {
                    propItem.active = false;
                    return;
                }
                this.setSpriteFrame2(find("icon", propItem)?.getComponent(Sprite)!, Const.resPath.icon + propRow.icon);
                let hasInfo = mergeBoardStateStore.getRoomDataHasInfoById(prop.id);
                let showNum = hasInfo.num;
                if (showNum >= prop.num) {
                    showNum = prop.num;
                }
                this.setString(find("num", propItem), showNum + "/" + prop.num);
                let bgNode = find("bg", propItem)!;
                let gouNode = find("gou", propItem)!;
                if (hasInfo.num >= prop.num) {
                    gouNode.active = true;
                    bgNode.active = true;
                } else {
                    gouNode.active = false;
                    hasDone = false;
                    bgNode.active = false;
                }
                // @ts-ignore
                propItem.propRow = propRow;
                this.bindButton(propItem, this.onClickTaskPropItem);

                let btnPropInfo = find("propInfo", propItem)!;
                // @ts-ignore
                btnPropInfo.propRow = propRow;
                this.bindButton(btnPropInfo, this.onClickTaskPropInfo);

            } else {
                propItem.active = false;
            }
        });
        if (hasDone) {
            chs.forEach((propItem: Node, i: number) => {
                find("gou", propItem)!.active = false;
            });
        }
        this.setString(find("award/num", itemUI), task.starNum);
        let btnTaskDone = find("btnTaskDone", itemUI)!;
        let btnTaskDonebug = find("btnTaskDonebug", itemUI)!;

        btnTaskDone.active = hasDone;
        // @ts-ignore
        btnTaskDone.task = task;

        // @ts-ignore
        btnTaskDonebug.task = task;

        this.bindButtonNoAudio(btnTaskDone, this.onClickBtnTaskDone.bind(this));

        this.bindButtonNoAudio(btnTaskDonebug, this.addTaskProp.bind(this));

    }

    addTaskProp(btn: Button) {
        let node = btn.node;
        // @ts-ignore
        let task = node.task;


        for (let i in task.propArr) {
            let prop = task.propArr[i];
            mergeBoardStateStore.addPropNum(prop.id, prop.num)
        }
    }

    refreshBuildLayer() {
        this.setString(find("num", this.btnBuild), mergeBoardStateStore.getPropNumById(propIds.star));
        this.showWeakHand()
    }


    _handDelay = 0
    showWeakHand() {
        if (this._handDelay > 0) {
            this._handDelay--
            return
        }
        if (playerDataStore.roleLv > 4) {
            return
        }
        let handIndex = mergeBoardStateStore.getHandIndex();
        if (handIndex >= 19) {
            let children = find("Canvas")!.children
            if (UtilScene.isSceneItemCouldBeBuild() && children[children.length - 1].name == "MergeBoardLayer") {
                let obj: any = {};
                obj.id = 20;
                obj.node = this.btnBuild;
                obj.delayTime = 0.5;
                obj.weak = true
                UiLayerService.instance.showDialog(Const.Dialogs.HandLayer, obj);
                this._handDelay = 10
            }
        }
    }

    refreshBottomLayer() {
        this.infoUILayer.active = false;
        this.sellBackLayer.active = false;
        this.infoHintNode.active = false;

        if (this.sellData) {
            this.sellBackLayer.active = true;
            let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, this.sellData.roomData.id);
            this.setString(find("info", this.sellBackLayer), localText.sellBackHint.format(propRow.name, propRow.luna));
            return;
        }

        if (!this.choseRoomItem) {
            this.infoHintNode.active = true;
            return;
        }

        let row = this.choseRoomItem.row;
        let col = this.choseRoomItem.col;
        let roomData = this.getRoomDataByItemUI(this.choseRoomItem);
        if (!roomData.id) {

            this.choseRoomItem = null;
            this.infoHintNode.active = true;
            return;
        }

        this.infoUILayer.active = true;

        // @ts-ignore
        if (this.infoUILayer.roomData != roomData) {
            // @ts-ignore
            this.infoUILayer.roomData = roomData;
            let uiOpacity = this.infoUILayer.getComponent(UIOpacity)!;
            Tween.stopAllByTarget(uiOpacity);
            uiOpacity.opacity = 0;
            tween(uiOpacity).to(0.5, { opacity: 255 }).start();
        }

        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, roomData.id);
        let titleLayer = find("titleLayer", this.infoUILayer)!;
        this.setString(find("name", titleLayer), propRow.name);
        this.setString(find("lv", titleLayer), propRow.luna + localText.lv);

        let infoNode = find("info", this.infoUILayer)!;
        this.setString(infoNode, propRow.mask);

        this.btnSell.active = false;
        this.btnUnlock.active = false;
        this.btnCdOver.active = false;
        this.btnBubbleGet.active = false;
        this.btnBubbleOver.active = false;

        if (propRow.levelGold > 0 && !mergeBoardStateStore.isRoomBubble(row, col)
            && !mergeBoardStateStore.isRoomCarton(row, col) && !mergeBoardStateStore.isRoomSpider(row, col)) {
            this.btnSell.active = true;
            this.setString(find("num", this.btnSell), propRow.levelGold);
        }

        this.btnPropDetail.active = true;
        if (roomData.st == roomStatus.spider) {
            this.btnSell.active = false;
            this.btnPropDetail.active = false;
        }

        if (this.btnSell.active && propRow.she) {

            let maxLvCount = 0;
            let maxLv = 0;
            let maxRoomData: any = null;
            UtilPub.for2Arr(mergeBoardStateStore.roomArr, (pRoom: any, pRow: any, pCol: any) => {
                if (!pRoom.id || pRoom.st == roomStatus.spider || pRoom.st == roomStatus.carton || mergeBoardStateStore.isRoomBubble(pRow, pCol)) {
                    return;
                }
                let tmpRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, pRoom.id);
                if (propRow.type == tmpRow.type && propRow.typeson == tmpRow.typeson) {
                    if (maxLv < tmpRow.luna) {
                        maxLv = tmpRow.luna;
                        maxLvCount = 1;
                        maxRoomData = pRoom;
                    } else if (maxLv == tmpRow.luna) {
                        maxLvCount++;
                    }
                }
            });
            if (maxLvCount == 1 && maxRoomData && maxRoomData.id == roomData.id) {
                this.btnSell.active = false;
            }
        }


        this.refreshBottomLayerUpdate();


        let btnsLayer = find("btnsLayer", this.infoUILayer)!;
        let layout = btnsLayer.getComponent(Layout)!;
        layout.enabled = false;
        layout.enabled = true;
        layout.updateLayout();
        let width = this.infoUILayer.getComponent(UITransform)!.width - btnsLayer.getComponent(UITransform)!.width - 40;
        infoNode.getComponent(UITransform)!.width = width;

    }

    getRoomDataByItemUI(itemUI: Node) {
        return mergeBoardStateStore.getRoomDataByItemUI(itemUI)
        // @ts-ignore
        return mergeBoardStateStore.roomArr[itemUI.row][itemUI.col];
    }

    refreshRoomItemUI(itemUI: Node, roomData?: any) {
        if (!itemUI) {
            return;
        }
        if (!roomData) {
            roomData = this.getRoomDataByItemUI(itemUI);
        }
        if (!roomData.id) {
            itemUI.active = false;
            return;
        }

        // @ts-ignore
        let row = itemUI.row;
        // @ts-ignore
        let col = itemUI.col;

        itemUI.active = true;


        let choseNode = find("chose", itemUI)!;
        if (itemUI == this.choseRoomItem) {
            let choseIcon = "chose_pink";
            if (mergeBoardStateStore.isRoomBubble(row, col) || mergeBoardStateStore.getPropMaxLvId(roomData.id) == roomData.id) {
                choseIcon = "chose_green";
            }
            this.setSpriteFrame2(choseNode.getComponent(Sprite)!, Const.resPath.mergeIcon + "board/" + choseIcon, () => {
                choseNode.active = true;
            });
        } else {
            choseNode.active = false;
        }

        this.refreshRoomItemUIBubble(itemUI);
        this.refreshRoomItemUICd(itemUI);
        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, roomData.id);
        let iconNode = find("icon", itemUI)!;
        iconNode.active = true;
        iconNode.scale = v3(1, 1, 1);
        this.setSpriteFrame2(iconNode.getComponent(Sprite)!, Const.resPath.icon + propRow.icon);


        let bagHint = find("bagHint", itemUI)!;
        if (roomData.id == propIds.bag) {
            if (!bagHint) {
                bagHint = new Node("bagHint");
                bagHint.parent = itemUI;
                bagHint.addComponent(Sprite);
                bagHint.position = v3(30, 30);
                tween(bagHint).to(1.2, { scale: v3(1.2, 1.2, 1) }).to(0.7, { scale: v3(1, 1, 1) }).union().repeatForever().start();
            }
            this.setSpriteFrame2(bagHint.getComponent(Sprite)!, Const.resPath.mergeIcon + "board/bag_hint");
            if (mergeBoardStateStore.isRoomCarton(row, col) || mergeBoardStateStore.isRoomSpider(row, col)) {
                bagHint.active = false;
            } else {
                bagHint.active = true;
            }
        } else if (bagHint) {
            bagHint.destroy();
        }


        let superCard = find("superCard", itemUI);
        if (roomData.id == propIds.superCard) {
            if (!superCard) {
                superCard = new Node("superCard");
                superCard.parent = itemUI;
                this.addSpine(this.tbgxSpinePath, superCard, (err: any, aniCtrl: AnimationCtrl) => {
                    aniCtrl.playAnimation("8", true);
                });
            }
        } else if (superCard) {
            superCard.destroy();
        }


        let taskNode = find("taskGou", itemUI)!;
        let taskNodeLan = find("taskGouLan", itemUI)!;

        if (mergeBoardStateStore.isRoomBubble(row, col) || mergeBoardStateStore.isRoomSpider(row, col) || mergeBoardStateStore.isRoomCarton(row, col)) {
            taskNode.active = false;
            taskNodeLan.active = false;
        } else {
            taskNode.active = mergeBoardStateStore.isTaskNeedWithId(roomData.id);
            taskNodeLan.active = TreasureModel.checkCompseHasProp(roomData.id)
        }


        let lockNode = find("lock", itemUI)!;
        if (propRow.mdt == 1 && !roomData.unlock) {
            lockNode.active = true;
        } else {
            lockNode.active = false;
        }


        let statusNode = find("roomStatus", itemUI)!;
        if (roomData.st > 0) {
            if (!statusNode) {
                statusNode = instantiate(this.roomStatus);
                statusNode.active = true;
                statusNode.parent = itemUI;
            }
            let spiderNode = find("spider", statusNode)!;
            let cartonNode = find("carton", statusNode)!;
            spiderNode.active = false;
            cartonNode.active = false;
            switch (roomData.st) {
                case roomStatus.spider:
                    spiderNode.active = true;
                    break;
                case roomStatus.carton:
                    iconNode.active = false;
                    let flag = row * mergeBoardStateStore.colNum + col + 1;
                    let suffix = flag % 3 + 1;
                    this.setSpriteFrame2(cartonNode.getComponent(Sprite)!, Const.resPath.mergeIcon + "board/xz" + suffix, () => {
                        cartonNode.active = true;
                    });
                    break;
                default:
                    break;
            }
        } else if (statusNode) {
            statusNode.destroy();
        }
        this.refreshSpeedUpSpine(itemUI);

    }

    refreshSpeedUpSpine(itemUI: any) {
        let row = itemUI.row;
        let col = itemUI.col;
        let roomData = this.getRoomDataByItemUI(itemUI);
        if (!mergeBoardStateStore.isRoomNormal(row, col)) {
            return;
        }
        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, roomData.id);
        if (propRow.mdt != 11 || !roomData.cd) {
            return;
        }
        if (this.touching) {
            return;
        }

        nineAroundArr.forEach((posArr: any) => {
            let r = row + posArr[0];
            let c = col + posArr[1];
            let angle = posArr[2];
            if (r >= 0 && r <= mergeBoardStateStore.rowNum - 1 && c >= 0 && c <= mergeBoardStateStore.colNum - 1) {
                let name = "speedUp_" + (row * 100 + col) + "_" + (r * 100 + c);
                let rData = mergeBoardStateStore.roomArr[r][c];
                let node = find(name, this.mergeFxLayer);
                if (!mergeBoardStateStore.isRoomNormal(r, c) || !mergeBoardStateStore.propCanSpeedUp(rData.id)) {

                    if (node) {
                        node.removeFromParent();
                    }
                } else {

                    if (!node) {
                        this.addSpine(this.jsqSpinePath, this.mergeFxLayer, (err, aniCtrl: AnimationCtrl) => {
                            aniCtrl.playAnimation("animation", true);
                            aniCtrl.node.name = name;
                            UtilPub.setNodePositionByOtherNode(aniCtrl.node, itemUI);

                            aniCtrl.node.angle = angle;
                            if (angle % 10 == 0) {
                                aniCtrl.node.scale = v3(1, 1, 1);
                            } else {

                                aniCtrl.node.scale = v3(1.3, 1.3, 1);
                            }
                        });
                    }
                }
            }
        });
    }
    removeAllSpeedUpSpine(itemUI: any, isForce = false) {
        let row = itemUI.row;
        let col = itemUI.col;
        if (!isForce) {
            let roomData = this.getRoomDataByItemUI(itemUI);
            if (!mergeBoardStateStore.isRoomNormal(row, col)) {
                return;
            }
            let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, roomData.id);
            if (propRow.mdt != 11) {
                return;
            }
        }

        nineAroundArr.forEach((posArr: any) => {
            let r = row + posArr[0];
            let c = col + posArr[1];
            if (r >= 0 && r <= mergeBoardStateStore.rowNum - 1 && c >= 0 && c <= mergeBoardStateStore.colNum - 1) {
                let name = "speedUp_" + (row * 100 + col) + "_" + (r * 100 + c);
                let node = find(name, this.mergeFxLayer);
                if (node) {
                    node.removeFromParent();
                }
            }
        });
    }
    refreshRoomItemUIByRowCol(row: number, col: number) {
        let roomItem = this.roomItemUIArr[row][col];
        this.refreshRoomItemUI(roomItem);
    }
    refreshRoomItemUICd(roomItem: Node) {
        let cdNode = find("cd", roomItem)!;
        let roomData = this.getRoomDataByItemUI(roomItem);


        let itemSpineNode = find("itemSpine", roomItem)!;
        if (!roomData.id) {
            cdNode.active = false;
            itemSpineNode.active = false;
            return;
        }

        // @ts-ignore
        let row = roomItem.row;
        // @ts-ignore
        let col = roomItem.col;

        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, roomData.id);


        let isClickSpine = false;
        if (propRow.mdt == 1 && !roomData.unlock) {
            isClickSpine = false;
        } else if (propRow.anc && roomData.times > 0 && !roomData.cdSum) {
            isClickSpine = true;
        } else {
            isClickSpine = false;
        }

        let dt = -1;
        let sum = 0;
        if (roomData.cd > 0 && roomData.cdSum > 0) {
            dt = roomData.cd - mergeBoardStateStore.getCurrentTimestamp();
            sum = roomData.cdSum;
        }

        let dtAuto = -1;
        if (roomData.cdAuto > 0) {
            dtAuto = roomData.cdAuto - mergeBoardStateStore.getCurrentTimestamp();
        }

        if (dt == -1 && dtAuto == -1) {
            cdNode.active = false;
        } else {
            if (dt == -1) {
                dt = dtAuto;
                sum = propRow.faircd * 1000;
            } else if (dtAuto != -1) {
                if (dtAuto < dt) {
                    dt = dtAuto;
                    sum = propRow.faircd * 1000;
                }
            }
            cdNode.active = true;
            this.setProgressBar(cdNode, dt / sum);
        }


        let isAutoSpine = false;
        if (propRow.fair > 0 && !roomData.cdAuto && roomData.timesAuto > 0) {
            isAutoSpine = true;
        }

        let skeleton = itemSpineNode.getComponent(sp.Skeleton)!;
        if (isClickSpine) {
            itemSpineNode.active = true;
            if (propRow.noPower) {

                if (skeleton.animation != "4") {
                    skeleton.setAnimation(0, "4", true);
                }
            } else {

                if (skeleton.animation != "3") {
                    skeleton.setAnimation(0, "3", true);
                }
            }
        } else if (isAutoSpine) {

            itemSpineNode.active = true;
            if (skeleton.animation != "4") {
                skeleton.setAnimation(0, "4", true);
            }
        } else {
            itemSpineNode.active = false;
        }

        if (mergeBoardStateStore.isRoomSpider(row, col) || mergeBoardStateStore.isRoomBubble(row, col)) {
            itemSpineNode.active = false;
            cdNode.active = false;
            isClickSpine = false;
            isAutoSpine = false;
        }

        if (isClickSpine || isAutoSpine) {
            this.showItemCreateTween(roomItem);
        } else {
            this.stopItemCreateTween(roomItem);
        }

    }
    refreshRoomItemUIBubble(roomItem: Node) {
        let roomData = this.getRoomDataByItemUI(roomItem);
        let bubbleNode = find("bubble", roomItem)!;
        if (!roomData.id || !roomData.cdBubble) {
            bubbleNode.active = false;
            return;
        }
        bubbleNode.active = true;
    }
    refreshRoomItemUIUpdate(roomItem: Node) {
        this.refreshRoomItemUICd(roomItem);
        this.refreshRoomItemUIBubble(roomItem);
    }

    getRoomItemByPos(pos: Vec2) {
        let p = UtilPub.convertToNodeSpace(this.roomListLayer, v3(pos.x, pos.y, 0));
        p.x += this.dPos.x + this.roomWidth * 0.5;
        p.y += this.dPos.y + this.roomWidth * 0.5;

        let col = Math.floor(p.x / this.roomWidth);
        let row = Math.floor(p.y / this.roomWidth);

        if (mergeBoardStateStore.isCellInsideMergeBoard(row, col)) {
            return this.roomItemUIArr[row][col];
        }

        return null;
    }

    setChoseRoomItem(roomItem: any) {
        if (this.choseRoomItem) {
            find("chose", this.choseRoomItem)!.active = false;
        }
        this.choseRoomItem = roomItem;
        this.refreshBottomLayer();
    }

    showRoomListMaskLayer(row: number, col: number, targetRoomItem: any) {
        let roomData = mergeBoardStateStore.roomArr[row][col];
        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, roomData.id);


        let isShow = false;
        if (propRow.mdt == 4 && targetRoomItem) {
            let targetRoomData = this.getRoomDataByItemUI(targetRoomItem);
            if (mergeBoardStateStore.isRoomNormal(targetRoomItem.row, targetRoomItem.col) && mergeBoardStateStore.canSplitProp(roomData.id, targetRoomData.id)) {
                isShow = true;
            }
        }
        let spineName = "spineSplit";
        let spineNode = find(spineName, this.mergeFxLayer);
        if (isShow) {
            if (spineNode) {
                UtilPub.setNodePositionByOtherNode(spineNode, targetRoomItem);
            } else {
                this.addSpine(this.tbgxSpinePath, this.mergeFxLayer, (err: any, aniCtrl: AnimationCtrl) => {
                    aniCtrl.node.name = spineName;
                    aniCtrl.playAnimation("3", true);
                    UtilPub.setNodePositionByOtherNode(aniCtrl.node, targetRoomItem);
                });
            }
        } else {
            if (spineNode) {
                spineNode.removeFromParent();
            }
        }

        if (this.roomBgMaskNode.active) {
            return;
        }
        this.roomBgMaskNode.active = true;

        let nextPropRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, roomData.id + 1);
        let isMaxLv = false;
        if (!nextPropRow || nextPropRow.type != propRow.type || nextPropRow.typeson != propRow.typeson) {
            isMaxLv = true;
        }

        let arr: any = [];
        UtilPub.for2Arr(this.roomItemUIArr, (roomItem: any, r: number, c: number) => {
            if (!mergeBoardStateStore.isRoomNormal(r, c)) {
                return;
            }
            if (row == r && col == c) {
                return;
            }
            let tmpRoomData = this.getRoomDataByItemUI(roomItem);
            if (tmpRoomData.id == propIds.bag) {

                arr.push(roomItem);
                return;
            }
            let tmpPropRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, tmpRoomData.id);
            if (!isMaxLv && propRow.id == tmpPropRow.id) {

                arr.push(roomItem);
                return;
            }

            switch (propRow.mdt) {
                case 3:

                    if (tmpPropRow.chongneng && tmpPropRow.anc) {
                        arr.push(roomItem);
                        roomItem.maskSpine = "4";
                    }
                    break;
                case 4:

                    if (tmpPropRow.jiandao && tmpPropRow.luna > 1 && tmpPropRow.luna <= propRow.p1) {
                        arr.push(roomItem);
                        roomItem.maskSpine = "2";
                    }
                    break;
                case 6:

                    if (!mergeBoardStateStore.propIsMaxLv(tmpRoomData.id) && tmpPropRow.putong1) {
                        arr.push(roomItem);
                        roomItem.maskSpine = "";
                    }
                    break;
                case 7:

                    if (!mergeBoardStateStore.propIsMaxLv(tmpRoomData.id) && tmpPropRow.putong2) {
                        arr.push(roomItem);
                        roomItem.maskSpine = "";
                    }
                    break;
                case 8:

                    if (!mergeBoardStateStore.propIsMaxLv(tmpRoomData.id) && tmpPropRow.putong3) {
                        arr.push(roomItem);
                        roomItem.maskSpine = "";
                    }
                    break;
                case 9:

                    if (!mergeBoardStateStore.propIsMaxLv(tmpRoomData.id) && !tmpPropRow.nochaoji) {
                        arr.push(roomItem);
                        roomItem.maskSpine = "";
                    }
                    break;
                case 10:

                    if (!mergeBoardStateStore.propIsMaxLv(tmpRoomData.id) && tmpPropRow.quanneng) {
                        arr.push(roomItem);
                        roomItem.maskSpine = "";
                    }
                    break;
                default:
                    break;
            }
        });

        for (let i = 0, len = arr.length; i < len; i++) {
            let roomItem = arr[i];
            roomItem.parent = this.roomBgMaskNode;
            if (roomItem.maskSpine) {
                find("itemSpine", roomItem)!.getComponent(sp.Skeleton)!.enabled = false;
                this.addSpine(this.tbgxSpinePath, find("tempSpine", roomItem)!, (err: any, aniCtrl: AnimationCtrl) => {
                    aniCtrl.playAnimation("1", true);
                });
                this.addSpine(this.tbgxSpinePath, find("tempSpine", roomItem)!, (err: any, aniCtrl: AnimationCtrl) => {
                    aniCtrl.playAnimation(roomItem.maskSpine, true);
                });
            }
        }

    }

    hideRoomListMaskLayer() {
        this.roomBgMaskNode.active = false;
        let arr: any = [];
        this.roomBgMaskNode.children.forEach((roomItem: any) => {
            arr.push(roomItem);
        });
        arr.forEach((roomItem: any) => {
            roomItem.parent = this.roomListLayer;
            find("itemSpine", roomItem)!.getComponent(sp.Skeleton)!.enabled = true;
            find("tempSpine", roomItem)!.removeAllChildren();
        });

        let spineName = "spineSplit";
        let spineNode = find(spineName, this.mergeFxLayer);
        if (spineNode) {
            spineNode.removeFromParent();
        }
    }

    resetBagIconScale() {
        // @ts-ignore
        if (this.bagIconNode) {
            // @ts-ignore
            this.bagIconNode.scale = v3(1, 1, 1);
            // @ts-ignore
            delete this.bagIconNode;
        }
    }

    roomListTouchStart(event: EventTouch) {
        UtilPub.log("roomListTouchStart");
        this.touching = true;

        this.clearComposeHintTween();
        this.touchMoveCount = 0;
        if (this.moveRoomItem && isValid(this.moveRoomItem)) {
            this.moveRoomItem.destroy();
        }
        this.moveRoomItem = null;
        this.startRoomItem = null;
        let roomItem = this.getRoomItemByPos(event.getUILocation());
        let roomData = this.getRoomDataByItemUI(roomItem);
        if (!roomData.id || roomData.st == roomStatus.carton) {
            return;
        }
        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, roomData.id);
        find("hintSpine", roomItem)!.active = false;
        if (!mergeBoardStateStore.isHandDone()) {
            let handIndex = mergeBoardStateStore.getHandIndex();
            switch (handIndex) {
                case handIndexs.firstCompose:
                case handIndexs.secondCompose:
                case handIndexs.thirdCompose:
                case handIndexs.boardMergeStepA:
                case handIndexs.boardMergeStepB:
                    if (roomItem != mergeBoardStateStore.getHandLayer()!.startNode) {
                        return;
                    }
                    break;
                case handIndexs.clickRoomNew:
                case handIndexs.clickRoomNew2:
                    if (this.getRoomDataByItemUI(roomItem).id != 10004) {
                        return;
                    }
                    break;
                default:
                    break;
            }
        }
        this.startRoomItem = roomItem;
        this.clearSellBack();
        this.removeAllSpeedUpSpine(roomItem);
        this.emit(GD.event.canvasTouchEvent)
        this._handDelay = 10

    }

    roomListTouchMove(event: EventTouch) {
        this.emit(GD.event.canvasTouchEvent)

        UtilPub.log("roomListTouchMove");
        if (!this.startRoomItem) {
            return;
        }
        this.touchMoveCount++;
        if (this.touchMoveCount <= 4) {
            return;
        }

        if (!mergeBoardStateStore.isHandDone()) {
            let handIndex = mergeBoardStateStore.getHandIndex();
            switch (handIndex) {
                case handIndexs.clickRoomNew:
                case handIndexs.clickRoomNew2:
                    return;
                    break;
                default:
                    break;
            }
        }

        let moveRoomData = this.getRoomDataByItemUI(this.startRoomItem);
        let row = this.startRoomItem.row;
        let col = this.startRoomItem.col;

        if (moveRoomData.st == roomStatus.spider || moveRoomData.st == roomStatus.carton) {
            return;
        }

        if (!this.moveRoomItem) {
            this.setChoseRoomItem(this.startRoomItem);
            this.moveRoomItem = instantiate(this.startRoomItem);
            this.moveRoomItem.parent = this.moveItemLayer;
            this.moveRoomItem.row = this.startRoomItem.row;
            this.moveRoomItem.col = this.startRoomItem.col;
            this.startRoomItem.active = false;
            this.refreshRoomItemUI(this.moveRoomItem, moveRoomData);
        }
        let pos = event.getUILocation();

        let p = UtilPub.convertToNodeSpace(this.moveRoomItem, v3(pos.x, pos.y, 0));
        this.moveRoomItem.position = p;

        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, moveRoomData.id);

        let isShowComposeEffect = false;
        let targetRoomItem = this.getRoomItemByPos(pos);
        if (!mergeBoardStateStore.isRoomBubble(row, col) && propRow.blessId > 0 && targetRoomItem) {
            let targetRoomData = this.getRoomDataByItemUI(targetRoomItem);
            let targetRow = targetRoomItem.row;
            let targetCol = targetRoomItem.col;
            if (targetRoomData != moveRoomData
                && targetRoomData.id == moveRoomData.id
                && !mergeBoardStateStore.isRoomCarton(targetRow, targetCol)
                && !mergeBoardStateStore.isRoomBubble(targetRow, targetCol)
            ) {
                isShowComposeEffect = true;
            }
        }
        if (isShowComposeEffect) {
            if (!this.currentMergeFx || this.currentMergeFx.targetRoomItem != targetRoomItem) {
                if (this.currentMergeFx) {
                    this.currentMergeFx.destroy();
                    this.currentMergeFx = null;
                }
                let mergeFxItem = instantiate(this.mergeFxItem);
                mergeFxItem.active = true;
                mergeFxItem.parent = this.mergeFxLayer;
                mergeFxItem.getComponent(AnimationCtrl)?.playAnimation("1", true);
                UtilPub.setNodePositionByOtherNode(mergeFxItem, targetRoomItem);
                this.currentMergeFx = mergeFxItem;
                this.currentMergeFx.targetRoomItem = targetRoomItem;
            }
        } else {
            if (this.currentMergeFx) {
                this.currentMergeFx.destroy();
                this.currentMergeFx = null;
            }
        }

        if (targetRoomItem && this.getRoomDataByItemUI(targetRoomItem).id == propIds.bag) {
            // @ts-ignore
            this.bagIconNode = find("icon", targetRoomItem)!;
            // @ts-ignore
            this.bagIconNode.scale = v3(1.2, 1.2, 1);
        } else {
            this.resetBagIconScale();
        }


        if (propRow.mdt == 3 || propRow.mdt == 4
            || propRow.mdt == 6 || propRow.mdt == 7 || propRow.mdt == 8 || propRow.mdt == 9 || propRow.mdt == 10) {
            this.showRoomListMaskLayer(row, col, targetRoomItem);
        }
    }

    eventCanvasTouchEvent() {
        this.emit(GD.event.canvasTouchEvent)
        this._handDelay = 10
    }

    roomListTouchEnd(event: EventTouch) {
        UtilPub.log("roomListTouchEnd");
        this.emit(GD.event.canvasTouchEvent)
        this._handDelay = 10

        this.touching = false;
        if (!this.startRoomItem) {
            this.refreshComposeHint();
            return;
        }
        this.resetBagIconScale();
        console.log("roomListTouchEnd  1")
        if (this.moveRoomItem) {
            this.hideRoomListMaskLayer();
            this.setChoseRoomItem(this.startRoomItem);
            let row = this.moveRoomItem.row;
            let col = this.moveRoomItem.col;
            console.log("roomListTouchEnd  2")
            let roomData = this.getRoomDataByItemUI(this.moveRoomItem);
            let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, roomData.id);
            let endRoomItem = this.getRoomItemByPos(event.getUILocation());
            let endRoomData = this.getRoomDataByItemUI(endRoomItem);
            if (row == endRoomItem.row && col == endRoomItem.col) {

                this.moveRoomItemToRowCol(this.moveRoomItem, row, col, () => {
                    mergeBoardStateStore.refreshRoomAutoNew(row, col);
                });
                this.refreshComposeHint();
                return;
            }
            console.log("roomListTouchEnd  3")
            let endRoomIsBubble = mergeBoardStateStore.isRoomBubble(endRoomItem.row, endRoomItem.col);
            if (!endRoomData.id || roomData.id != endRoomData.id
                || mergeBoardStateStore.isRoomBubble(row, col)
                || endRoomIsBubble
                || mergeBoardStateStore.isRoomCarton(endRoomItem.row, endRoomItem.col)
            ) {
                console.log("roomListTouchEnd  4")

                if (endRoomData.id == propIds.bag) {
                    console.log("roomListTouchEnd  5")


                    if (mergeBoardStateStore.putDataInRoomBag(row, col, endRoomItem.row, endRoomItem.col)) {

                        this.refreshRoomItemUIByRowCol(row, col);
                        this.choseRoomItem = endRoomItem;
                        this.refreshRoomItemUIByRowCol(endRoomItem.row, endRoomItem.col);
                        this.moveRoomItem.destroy();
                        this.moveRoomItem = null;
                    } else {

                        this.moveRoomItemToRowCol(this.moveRoomItem, row, col);
                    }
                } else {
                    console.log("roomListTouchEnd  6")


                    if (mergeBoardStateStore.isRoomSpider(endRoomItem.row, endRoomItem.col) || mergeBoardStateStore.isRoomCarton(endRoomItem.row, endRoomItem.col)) {
                        console.log("roomListTouchEnd  7")
                        this.setChoseRoomItem(this.startRoomItem);
                        this.moveRoomItemToRowCol(this.moveRoomItem, row, col);
                        this.refreshComposeHint();
                        console.log("roomListTouchEnd  8")

                        return;
                    }

                    let handIndex = mergeBoardStateStore.getHandIndex();
                    switch (handIndex) {
                        case handIndexs.firstCompose:
                        case handIndexs.secondCompose:
                        case handIndexs.thirdCompose:
                        case handIndexs.boardMergeStepA:
                        case handIndexs.boardMergeStepB:
                            if (endRoomItem != mergeBoardStateStore.getHandLayer()!.endNode) {
                                this.setChoseRoomItem(this.startRoomItem);
                                this.moveRoomItemToRowCol(this.moveRoomItem, row, col);
                                return;
                            }
                            break;
                        default:
                            break;
                    }

                    if (propRow && propRow.mdt == 3 && mergeBoardStateStore.canAddTimes(endRoomData.id) && !endRoomIsBubble) {

                        this.moveRoomItem.destroy();
                        this.moveRoomItem = null;
                        mergeBoardStateStore.roomAddTimes(row, col, endRoomItem.row, endRoomItem.col, propRow.p1);
                        this.setChoseRoomItem(endRoomItem);
                        this.refreshRoomItemUI(endRoomItem);
                        this.refreshRoomItemUIByRowCol(row, col);
                        this.refreshComposeHint();
                        this.refreshRoomNineAroundAutoNew(row, col);
                        this.addSpine(this.tbgxSpinePath, endRoomItem, (err: any, aniCtrl: AnimationCtrl) => {
                            aniCtrl.playAnimationOnce("5", () => {
                                aniCtrl.node.destroy();
                            });
                        });
                        return;
                    }

                    if (propRow && propRow.mdt == 4 && mergeBoardStateStore.canSplitProp(propRow.id, endRoomData.id) && !endRoomIsBubble) {

                        this.moveRoomItem.destroy();
                        this.moveRoomItem = null;
                        let retObj = mergeBoardStateStore.roomPropSplit(row, col, endRoomItem.row, endRoomItem.col);
                        this.setChoseRoomItem(endRoomItem);
                        this.refreshRoomItemUI(endRoomItem);
                        this.refreshComposeHint();
                        mergeBoardStateStore.refreshRoomAutoNew(row, col);
                        let mRow = retObj.emptyPos.row;
                        let mCol = retObj.emptyPos.col;
                        this.addNewMoveNewItemRoomToRowCol(endRoomItem, mRow, mCol, 1, () => {
                            mergeBoardStateStore.refreshRoomAutoNew(mRow, mCol);
                            this.showHintSpineOnce(this.roomItemUIArr[mRow][mCol], "5");
                            this.refreshTaskLayer();
                        });
                        this.showHintSpineOnce(endRoomItem, "5");
                        return;
                    }

                    if (propRow && (propRow.mdt == 6 || propRow.mdt == 7 || propRow.mdt == 8 || propRow.mdt == 9 || propRow.mdt == 10)
                        && mergeBoardStateStore.canLvUpProp(propRow.id, endRoomData.id) && !endRoomIsBubble) {

                        this.moveRoomItem.destroy();
                        this.moveRoomItem = null;
                        mergeBoardStateStore.roomPropLvUp(row, col, endRoomItem.row, endRoomItem.col);
                        this.setChoseRoomItem(endRoomItem);
                        this.refreshRoomItemUI(endRoomItem);
                        this.refreshRoomItemUIByRowCol(row, col);
                        this.refreshComposeHint();
                        this.showChoseTween(endRoomItem);
                        this.refreshTaskLayer();
                        this.addSpine(this.tbgxSpinePath, this.mergeFxLayer, (err: any, aniCtrl: AnimationCtrl) => {
                            UtilPub.setNodePositionByOtherNode(aniCtrl.node, endRoomItem);
                            aniCtrl.playAnimationOnce("6", () => {
                                aniCtrl.node.destroy();
                            });
                        });
                        return;
                    }


                    mergeBoardStateStore.roomDataExchange(row, col, endRoomItem.row, endRoomItem.col);
                    this.setChoseRoomItem(endRoomItem);
                    this.moveRoomItemToRowCol(this.moveRoomItem, endRoomItem.row, endRoomItem.col, () => {
                        mergeBoardStateStore.refreshRoomAutoNew(endRoomItem.row, endRoomItem.col);
                        this.refreshComposeHint();
                        this.refreshRoomNineAroundAutoNew(row, col);
                    });
                    if (endRoomData.id) {

                        endRoomItem.active = false;
                        this.addNewMoveNewItemRoomToRowCol(endRoomItem, row, col, 0, () => {
                            mergeBoardStateStore.refreshRoomAutoNew(row, col);
                        });
                    }
                }
                return;
            }

            if (roomData.id == endRoomData.id) {
                console.log("roomListTouchEnd  9")


                if (propRow.blessId) {
                    console.log("merge board item");
                    GameEventManager.eventTarget.emit(GameEventManager.EEventName.ADD_EXP_ANIMATION,1)
                    let handIndex = mergeBoardStateStore.getHandIndex();
                    if (handIndex == handIndexs.firstCompose && propRow.blessId == 10002) {
                        mergeBoardStateStore.addHandIndex();
                        this.refreshHandLayer();
                    } else if (handIndex == handIndexs.secondCompose && propRow.blessId == 10003) {
                        mergeBoardStateStore.addHandIndex();
                        this.refreshHandLayer();
                    } else if (handIndex == handIndexs.thirdCompose && propRow.blessId == 10004) {
                        mergeBoardStateStore.addHandIndex();
                        mergeBoardStateStore.closeHandLayer();
                    } else if (handIndex == handIndexs.boardMergeStepA && propRow.blessId == 10027) {
                        mergeBoardStateStore.addHandIndex();
                        this.refreshHandLayer();
                    } else if (handIndex == handIndexs.boardMergeStepB && propRow.blessId == 10028) {
                        mergeBoardStateStore.addHandIndex();
                        this.refreshHandLayer();
                    }

                    let retObj = mergeBoardStateStore.mergeRoomData(row, col, endRoomItem.row, endRoomItem.col);

                    for (let i in retObj.cartonArr) {
                        let posInfo = retObj.cartonArr[i];
                        let cRoomItem = this.roomItemUIArr[posInfo.row][posInfo.col];
                        this.addSpine(this.cartonSpinePath, cRoomItem, (err: any, aniCtrl: AnimationCtrl) => {
                            if (err) {
                                return;
                            }
                            let cartonNode = find("roomStatus/carton", cRoomItem)!;
                            if (cartonNode) {
                                let tempParent = cartonNode.parent;
                                cartonNode = instantiate(cartonNode);
                                cartonNode.parent = tempParent;
                                tween(cartonNode)
                                    .to(0.2, { scale: v3(0.5, 1.5, 1) })
                                    .to(0.2, { scale: v3(1.3, 0.5, 1) })
                                    .call(() => {
                                        cartonNode.destroy();
                                    })
                                    .start();
                            }
                            this.refreshRoomItemUIByRowCol(posInfo.row, posInfo.col);
                            aniCtrl.playAnimationOnce("animation", () => {
                                aniCtrl.node.destroy();
                            });
                            aniCtrl.node.scale = v3(1.2, 1.2, 1);
                        });
                    }
                    this.choseRoomItem = endRoomItem;
                    this.moveRoomItem.destroy();
                    this.moveRoomItem = null;
                    this.refreshRoomItemUIByRowCol(row, col);
                    this.refreshRoomItemUI(endRoomItem);
                    this.showComposeEndTween(endRoomItem);

                    let audioName = Const.Audio.mergeTap + (this.mergeAudioCount % 4)
                    this.mergeAudioCount++;
                    AudioPlaybackService.instance.playSound(audioName);
                    this.unschedule(this.scheduleAudioCountReset);
                    this.scheduleOnce(this.scheduleAudioCountReset, 2);

                    mergeBoardStateStore.refreshRoomAutoNew(endRoomItem.row, endRoomItem.col);
                    this.refreshRoomNineAroundAutoNew(row, col);

                    if (propRow.luna >= 4)
                        mergeBoardStateStore.afterRoomMerge(endRoomItem.row, endRoomItem.col);

                    this.refreshBottomLayer();
                    this.refreshTaskLayer();

                    if (this.currentMergeFx) {
                        this.currentMergeFx.getComponent(AnimationCtrl).playAnimationOnce("2", () => {
                            this.currentMergeFx.destroy();
                            this.currentMergeFx = null;
                        });
                    }
                } else {

                    this.moveRoomItemToRowCol(this.moveRoomItem, row, col);
                }
                this.refreshComposeHint();
                return;
            }
        }
        console.log("roomListTouchEnd  10")


        if (this.choseRoomItem == this.startRoomItem) {

            this.onClickRoomItem(this.startRoomItem);
            let handIndex = mergeBoardStateStore.getHandIndex();
            if (handIndex == handIndexs.clickRoomNew || handIndex == handIndexs.clickRoomNew2) {
                mergeBoardStateStore.addHandIndex();
                this.refreshHandLayer();
            }
        } else {
            this.refreshRoomItemUI(this.choseRoomItem);
        }
        this.setChoseRoomItem(this.startRoomItem);
        this.refreshRoomItemUI(this.choseRoomItem);

        this.showChoseTween(this.choseRoomItem);

        this.refreshComposeHint();
        console.log("roomListTouchEnd  11")

    }

    scheduleAudioCountReset() {
        this.mergeAudioCount = 0;
    }

    roomListTouchCancel(event: EventTouch) {
        UtilPub.log("roomListTouchCancel");
        this.touching = false;
        this.refreshComposeHint();
        this.hideRoomListMaskLayer();
        this.resetBagIconScale();
        if (!this.moveRoomItem) {
            return;
        }
        this.setChoseRoomItem(this.startRoomItem);

        let row = this.moveRoomItem.row;
        let col = this.moveRoomItem.col;

        this.moveRoomItemToRowCol(this.moveRoomItem, row, col);
    }

    getCardLayerPos() {
        return UtilPub.convertToWorldSpace(this.cardLayer);
    }

    getBtnBuildStarPos() {
        return UtilPub.convertToWorldSpace(find("icon", this.btnBuild)!);
    }


    refreshRoomNineAroundAutoNew(row: number, col: number) {
        nineAroundArr.forEach((posArr: any) => {
            let r = row + posArr[0];
            let c = col + posArr[1];
            if (r >= 0 && r <= mergeBoardStateStore.rowNum - 1 && c >= 0 && c <= mergeBoardStateStore.colNum - 1) {
                let rData = mergeBoardStateStore.roomArr[r][c];
                if (rData.id > 0) {
                    mergeBoardStateStore.refreshRoomAutoNew(r, c);
                }
            }
        });
    }






    clearTouchStatus(row: number, col: number) {
        if (this.startRoomItem && this.startRoomItem.row == row && this.startRoomItem.col == col) {
            if (this.moveRoomItem) {
                this.moveRoomItem.destroy();
                this.moveRoomItem = null;
            }
            this.startRoomItem = null;
            this.refreshRoomItemUIByRowCol(row, col);
        }
    }

    onMessageEvent(value: any) {
        console.log("onMessageEvent:", value);
        let data = ServerCtrJSF.GetInstance().getUserDataByKey(value, Const.MoneyKeys.MonthCharge)
        if (data && this.choseRoomItem) {
            let monthCardVal = MonthCard.checkMonthCard(value)
            if (monthCardVal) {
                let row = this.choseRoomItem.row;
                let col = this.choseRoomItem.col;
                mergeBoardStateStore.rommDataCdBubbleOver(row, col);
            } else {

                UtilPub.log("prompt purchase privilege");
            }
        }

    }

    boardSpeedupEndedRet(data: any) {
        this.refreshRoomItemUIByRowCol(data.row, data.col);
        this.removeAllSpeedUpSpine(this.roomItemUIArr[data.row][data.col], true);
    }

    refreshTaskRet() {
        this.refreshTaskLayer();
        this.refershRoomLayer();
    }

    goToBuildSceneRet() {
        this.close();
    }

    refreshHandLayerRet() {
        this.refreshHandLayer();
    }

    boardDiscoveryRet(propId: number) {
        UiLayerService.instance.showDialog(Const.Dialogs.NewItemLayer, propId);
    }

    boardCardRefreshRet() {
        this.refreshCardLayer();
    }

    boardMilestoneRefreshRet() {
        this.refreshManagerLayer();
    }

    showHintSpineOnce(roomItem: any, aniName: string) {
        let hintSpine = find("hintSpine", roomItem)!;
        hintSpine.active = true;
        hintSpine.getComponent(AnimationCtrl)!.playAnimationOnce(aniName, () => {
            hintSpine.active = false;
        });
    }

    boardBagWithdrawRet(data: any) {
        UtilPub.log("boardBagWithdrawRet", data);
        let roomItem = this.roomItemUIArr[data.row][data.col];
        data.getOutArr.forEach((pos: any) => {
            this.addNewMoveNewItemRoomToRowCol(roomItem, pos.row, pos.col, 1, () => {

                let outItem = this.roomItemUIArr[pos.row][pos.col];
                this.showHintSpineOnce(outItem, "5");
            });
        });
    }

    roomBubbleBurstRet(data: any) {
        UtilPub.log("roomBubbleBurstRet", data);
        let row = data.row;
        let col = data.col;
        let roomItem = this.roomItemUIArr[row][col];
        this.refreshRoomItemUIByRowCol(row, col);
        this.showChoseTween(roomItem);

        this.clearTouchStatus(row, col);
        if (this.choseRoomItem == roomItem) {
            this.refreshBottomLayer();
        }
        this.refreshTaskLayer();
        this.addSpine(Const.resPath.mergeSpine + "qipao/qipao", this.bubbleLayer, (err, aniCtrl: AnimationCtrl) => {
            UtilPub.setNodePositionByOtherNode(aniCtrl.node, roomItem);
            aniCtrl.playAnimationOnce("3", () => {
                aniCtrl.node.destroy();
            })
        });
        AudioPlaybackService.instance.playSound(Const.Audio.bubbleBomb);
    }

    boardSlotSpawnRet(data: any) {
        UtilPub.log("boardSlotSpawnRet", data);
        let row = data.row;
        let col = data.col;
        let roomItem = this.roomItemUIArr[row][col];
        data.newPosArr.forEach((posArr: any) => {
            this.addNewMoveNewItemRoomToRowCol(roomItem, posArr[0], posArr[1], 1);
            if (mergeBoardStateStore.isRoomBubble(posArr[0], posArr[1])) {
                AudioPlaybackService.instance.playSound(Const.Audio.bubble);
            }
        });
        if (data.isAuto) {
            AudioPlaybackService.instance.playSound(Const.Audio.createProp);
        }
        this.clearTouchStatus(row, col);
        this.refreshTaskLayer();
    }









    addNewMoveNewItemRoomToRowCol(roomItem: Node, row: number, col: number, aniType: number = 0, cb?: Function) {
        let moveRoomItem = instantiate(this.roomItem);
        moveRoomItem.active = true;
        moveRoomItem.parent = this.moveItemLayer;
        // @ts-ignore
        moveRoomItem.row = row;
        // @ts-ignore
        moveRoomItem.col = col;
        this.refreshRoomItemUI(moveRoomItem, mergeBoardStateStore.roomArr[row][col]);
        let pos = UtilPub.convertToWorldSpace(roomItem);
        pos = UtilPub.convertToNodeSpace(moveRoomItem, pos);
        moveRoomItem.position = pos;
        if (aniType == 1) {
            let targetRoomItem = this.roomItemUIArr[row][col];
            let targetPos = UtilPub.convertToNodeSpace(moveRoomItem, UtilPub.convertToWorldSpace(targetRoomItem));
            let midPos = v3(0, 0, 0);
            let dis = UtilPub.getDis(pos, targetPos);
            Vec3.lerp(midPos, pos, targetPos, 1 - (this.roomWidth * 0.6) / dis);

            let t1 = tween(moveRoomItem)
                .to(0.2, { position: midPos })
                .to(0.3, { position: targetPos });

            moveRoomItem.scale = v3(0.2, 0.2, 1);
            let t2 = tween(moveRoomItem)
                .to(0.1, { scale: v3(1.3, 1.3, 1) })
                .to(0.1, { scale: v3(1, 1, 1) })
                .to(0.15, { scale: v3(0.8, 0.8, 1) })
                .to(0.15, { scale: v3(1, 1, 1) });

            tween(moveRoomItem).parallel(t1, t2).call(() => {
                moveRoomItem.destroy();
                this.refreshRoomItemUIByRowCol(row, col);
                if (cb) {
                    cb();
                }
            }).start();
        } else {
            this.moveRoomItemToRowCol(moveRoomItem, row, col, cb);
        }
    }







    addMoveItemToWorldPos(propId: number, startWorldPos: Vec3, endWorldPos: Vec3, cb?: Function) {
        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, propId);
        let moveItem = instantiate(this.moveItem);
        moveItem.active = true;
        moveItem.parent = this.moveItemLayer;
        this.setSpriteFrame2(find("icon", moveItem)?.getComponent(Sprite)!, Const.resPath.icon + propRow.icon);
        moveItem.addComponent(MovePath).startMove(startWorldPos, endWorldPos, 0.3, () => {
            moveItem.destroy();
            if (cb) {
                cb();
            }
        });
    }


    refreshComposeHint() {
        this.clearComposeHintTween();
        if (!mergeBoardStateStore.isHandDone()) {
            return;
        }
        let tmpObj: any = {};
        let idArr: any = [];

        let tmpFunc = (arr: any, isRemove: boolean = false) => {
            let tmpArr = [];
            for (let i in arr) {
                let tmpItem = arr[i];
                let tmpRoomData = this.getRoomDataByItemUI(tmpItem);
                if (!tmpRoomData.st) {
                    tmpArr.push(tmpItem);
                }
            }
            let retItem = UtilPub.getRandomItemByArr(tmpArr);
            if (retItem && isRemove) {
                let index = arr.indexOf(retItem);
                arr.splice(index, 1);
            }
            return retItem;
        };
        UtilPub.for2Arr(this.roomItemUIArr, (roomItem: any) => {
            let roomData = this.getRoomDataByItemUI(roomItem);
            let id = roomData.id;
            if (!id) {
                return;
            }
            if (mergeBoardStateStore.isRoomBubble(roomItem.row, roomItem.col)) {
                return;
            }
            let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, id);
            if (!propRow.blessId) {
                return;
            }
            if (roomData.st == roomStatus.carton) {
                return;
            }
            if (!tmpObj[id]) {
                tmpObj[id] = [];
            }
            tmpObj[id].push(roomItem);
            if (tmpObj[id].length >= 2 && tmpFunc(tmpObj[id]) && idArr.indexOf(id) == -1) {
                idArr.push(id);
            }
        });
        if (idArr.length > 0) {
            let id = UtilPub.getRandomItemByArr(idArr);
            let arr = tmpObj[id];

            let normalRoomItem = tmpFunc(arr, true);
            this.showComposeHintTween(normalRoomItem);
            this.roomItemMergeHintArr.push(normalRoomItem);

            let otherRoomItem = UtilPub.getRandomItemByArr(arr, true);
            this.showComposeHintTween(otherRoomItem);
            this.roomItemMergeHintArr.push(otherRoomItem);

        }
    }

    moveRoomItemToRowCol(moveRoomItem: Node, row: number, col: number, cb?: Function) {
        let roomItem = this.roomItemUIArr[row][col];
        let wpos = UtilPub.convertToWorldSpace(roomItem);
        let pos = UtilPub.convertToNodeSpace(moveRoomItem, wpos);
        tween(moveRoomItem).to(0.1, { position: pos }).call(() => {
            moveRoomItem.destroy();
            this.refreshRoomItemUIByRowCol(row, col);
            if (cb) {
                cb();
            }
        }).start();
    }

    showChoseTween(node: Node) {
        if (!node) {
            return;
        }
        let roomData = this.getRoomDataByItemUI(node);
        if (!roomData.id) {
            return;
        }
        let tag = 101;
        let iconNode = find("icon", node)!;
        Tween.stopAllByTag(tag, iconNode);
        tween(iconNode).tag(tag)
            .to(0.1, { scale: v3(0.85, 0.85, 1) })
            .to(0.15, { scale: v3(1.2, 1.2, 1) })
            .to(0.15, { scale: v3(0.9, 0.9, 1) })
            .to(0.15, { scale: v3(1.1, 1.1, 1) })
            .to(0.1, { scale: v3(1, 1, 1) })
            .start();
    }

    showComposeEndTween(node: Node) {
        let tag = 101;
        let iconNode = find("icon", node)!;
        Tween.stopAllByTag(tag, iconNode);
        tween(iconNode).tag(tag)
            .to(0.1, { scale: v3(0.3, 0.3, 1) })
            .to(0.15, { scale: v3(1.3, 1.3, 1) })
            .to(0.1, { scale: v3(0.9, 0.9, 1) })
            .to(0.1, { scale: v3(1.1, 1.1, 1) })
            .to(0.05, { scale: v3(1, 1, 1) })
            .start();
    }

    showComposeHintTween(node: Node) {
        let tag = 102;
        let iconNode = find("icon", node)!;
        Tween.stopAllByTag(tag, iconNode);
        iconNode.scale = v3(1, 1, 1);
        let mergeHintTween = tween(iconNode).tag(tag).delay(3)
            .to(0.3, { scale: v3(1.4, 1.4, 1) })
            .to(0.25, { scale: v3(0.8, 0.8, 1) })
            .to(0.15, { scale: v3(1.15, 1.15, 1) })
            .to(0.15, { scale: v3(0.9, 0.9, 1) })
            .to(0.1, { scale: v3(1.05, 1.05, 1) })
            .to(0.1, { scale: v3(1, 1, 1) })
            .union().repeatForever().start();
        // @ts-ignore
        node.mergeHintTween = mergeHintTween;
    }

    clearComposeHintTween() {
        this.roomItemMergeHintArr.forEach((node: Node) => {
            let iconNode = find("icon", node)!;
            iconNode.scale = v3(1, 1, 1);
            Tween.stopAllByTag(102, iconNode);
            // @ts-ignore
            delete node.mergeHintTween;
        });
        this.roomItemMergeHintArr = [];
    }

    showItemCreateTween(node: Node) {

        // @ts-ignore
        if (node.mergeHintTween) {
            this.stopItemCreateTween(node);
            return;
        }

        // @ts-ignore
        let itemCreateTween = node.itemCreateTween;
        if (itemCreateTween) {
            return;
        }
        let tag = 103;
        let iconNode = find("icon", node)!;
        Tween.stopAllByTag(tag, iconNode);
        let time = 0.3;
        itemCreateTween = tween(iconNode).tag(tag)
            .to(time, { scale: v3(1.1, 1.1, 1) })
            .to(time, { scale: v3(1, 1, 1) })
            .to(time, { scale: v3(1.1, 1.1, 1) })
            .to(time, { scale: v3(1, 1, 1) })
            .to(time, { scale: v3(1.1, 1.1, 1) })
            .to(time, { scale: v3(1, 1, 1) })
            .delay(1)
            .union()
            .repeatForever()
            .start();
        // @ts-ignore
        node.itemCreateTween = itemCreateTween;
    }
    stopItemCreateTween(node: Node) {
        // @ts-ignore
        let itemCreateTween = node.itemCreateTween;
        if (itemCreateTween) {
            let tag = 103;
            let iconNode = find("icon", node)!;
            Tween.stopAllByTag(tag, iconNode);
            iconNode.scale = v3(1, 1, 1);
            // @ts-ignore
            delete node.itemCreateTween;
        }
    }

    refreshBottomLayerUpdate() {
        if (!this.choseRoomItem) {
            return;
        }
        let roomData = this.getRoomDataByItemUI(this.choseRoomItem);
        if (!roomData.id) {
            return;
        }

        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, roomData.id);
        let row = this.choseRoomItem.row;
        let col = this.choseRoomItem.col;


        let timestamp = mergeBoardStateStore.getCurrentTimestamp();
        let dt = -1;
        if (roomData.cd > 0 && roomData.cdSum > 0) {
            dt = roomData.cd - timestamp;
        }
        // @ts-ignore
        this.btnCdOver.cdType = 1;
        let dtAuto = -1;
        if (roomData.cdAuto > 0) {
            dtAuto = roomData.cdAuto - timestamp;
        }
        if (dt == -1 && dtAuto == -1) {
            this.btnCdOver.active = false;
        } else {
            this.btnCdOver.active = true;
            if (dt == -1) {
                dt = dtAuto;
                // @ts-ignore
                this.btnCdOver.cdType = 2;
            } else if (dtAuto != -1) {
                if (dtAuto < dt) {
                    dt = dtAuto;
                    // @ts-ignore
                    this.btnCdOver.cdType = 2;
                }
            }
            // @ts-ignore
            this.btnCdOver.dt = dt;
            let timeStr = UtilPub.getDurationStr(dt);
            this.setString(find("cd/time", this.btnCdOver), timeStr);
            let num = mergeBoardStateStore.getOverCdCostDiamond(dt);
            this.setString(find("num", this.btnCdOver), num);
        }


        if (mergeBoardStateStore.isRoomBubble(row, col) && roomData.cdBubble > 0) {
            this.btnBubbleGet.active = true;
            this.btnBubbleOver.active = true;
            let dt2 = roomData.cdBubble - timestamp;
            this.setString(find("time", this.btnBubbleGet), UtilPub.getDurationStr(dt2));
            this.setString(find("num", this.btnBubbleGet), propRow.bubble);
            this.btnUnlock.active = false;
        } else {
            this.btnBubbleGet.active = false;
            this.btnBubbleOver.active = false;
            if (propRow.mdt == 1 && !roomData.unlock && !roomData.cdSum) {
                this.btnUnlock.active = true;
                this.setString(find("time", this.btnUnlock)!, UtilPub.getDurationStr(propRow.p1 * 1000));
            } else {
                this.btnUnlock.active = false;
            }
        }

        if (roomData.notSubCd) {
            this.btnCdOver.active = false;
        }

    }

    update(dt: number) {
        UtilPub.for2Arr(this.roomItemUIArr, (roomItem: Node) => {
            this.refreshRoomItemUIUpdate(roomItem);
        });
        this.refreshBottomLayerUpdate();
    }


    onClickRoomItem(roomItem: any) {
        let row = roomItem.row;
        let col = roomItem.col;
        let roomData = this.getRoomDataByItemUI(roomItem);
        UtilPub.log("点击了房�?row:%d,col:%d".format(row, col), roomData);

        if (roomData.id == propIds.bag) {

            let obj = {
                row: row,
                col: col
            };
            UiLayerService.instance.showDialog(Const.Dialogs.BagLayer, obj);
            return;
        }

        let propRow = TableDataService.ins().getTableValueByID(Const.Tables.prop, roomData.id);

        if (mergeBoardStateStore.isRoomBubble(row, col)) {

            let aniCtrl = find("bubble", roomItem)!.getComponent(AnimationCtrl)!;
            aniCtrl.playAnimationOnce("2", () => {
                aniCtrl.playAnimation("1", true);
            });
            return;
        }

        if (mergeBoardStateStore.isRoomCd(row, col)) {

            return;
        }

        if (propRow.clickAwardId > 0) {

            mergeBoardStateStore.onClickRoomAward(row, col, UtilPub.convertToWorldSpace(roomItem));
            this.setChoseRoomItem(null);
            this.refreshRoomItemUIByRowCol(row, col);
            this.refreshTaskLayer();
            if (propRow.clickAwardId == propIds.coin) {
                AudioPlaybackService.instance.playSound(Const.Audio.clickCoin);
            }
            return;
        }

        if (propRow.mdt == 1 && !roomData.unlock) {

            mergeBoardStateStore.onClickUnlockRoom(row, col);
            this.refreshBottomLayer();
            return;
        }

        if (propRow.mdt == 2 || propRow.mdt == 5 || propRow.mdt == 11) {
            let ret = mergeBoardStateStore.onClickEspRoom(row, col);
            this.refreshRoomItemUIByRowCol(row, col);
            this.refreshBottomLayer();
            if (propRow.mdt == 5) {
                ret.arr.forEach((info: any) => {
                    let tempRoomItem = this.roomItemUIArr[info.row][info.col];
                    this.addSpine(this.tbgxSpinePath, this.mergeFxLayer, (err: any, aniCtrl: AnimationCtrl) => {
                        UtilPub.setNodePositionByOtherNode(aniCtrl.node, tempRoomItem);
                        aniCtrl.playAnimationOnce("7", () => {
                            aniCtrl.node.destroy();
                        });
                    });
                });
            }
            return;
        }

        if (roomData.st == roomStatus.spider || roomData.st == roomStatus.carton) {
            return;
        }


        if (!propRow.anc) {

            return;
        }

        if (!propRow.atom || !propRow.matic) {

            return;
        }

        let emptyPos = mergeBoardStateStore.getEmptyRoomPos();
        if (!emptyPos) {

            return;
        }

        if (roomData.times <= 0) {

            return;
        }

        if (!propRow.noPower && mergeBoardStateStore.getPropNumById(propIds.power) <= 0 && mergeBoardStateStore.getBoardEnergyCooldown() <= 0) {

            UiLayerService.instance.showDialog(Const.Dialogs.ShopPowerDialog);
            return;
        }


        mergeBoardStateStore.onClickRoomNew(row, col, emptyPos.row, emptyPos.col);
        this.addNewMoveNewItemRoomToRowCol(roomItem, emptyPos.row, emptyPos.col, 1, () => {
            mergeBoardStateStore.refreshRoomAutoNew(emptyPos.row, emptyPos.col);
            this.refreshTaskLayer();
        });

        AudioPlaybackService.instance.playSound(Const.Audio.createProp);

        this.refreshRoomItemUI(roomItem);
        roomData = this.getRoomDataByItemUI(roomItem);
        if (!roomData.id) {
            UtilPub.log("clicked item disappeared");
            this.choseRoomItem = null;
        }

    }

    clearSellBack() {
        this.sellData = null;
        this.refreshBottomLayer();
    }

    onClickInfoUI() {
        if (!this.choseRoomItem) {
            return;
        }
        let roomData = this.getRoomDataByItemUI(this.choseRoomItem);
        if (roomData.st == roomStatus.spider) {
            return;
        }
        mergeBoardStateStore.openPropInfoLayer(roomData.id);
    }

    onClickBtnUnlock(btn: Button) {
        if (!this.choseRoomItem) {
            return;
        }
        let row = this.choseRoomItem.row;
        let col = this.choseRoomItem.col;
        mergeBoardStateStore.onClickUnlockRoom(row, col);
        this.refreshRoomItemUI(this.choseRoomItem);
        this.refreshBottomLayer();
    }

    onClickBtnSell() {
        AudioPlaybackService.instance.playSound(Const.Audio.sellBack);

        if (!this.choseRoomItem) {
            return;
        }

        let row = this.choseRoomItem.row;
        let col = this.choseRoomItem.col;
        let sellData = mergeBoardStateStore.sellRoomData(row, col, UtilPub.convertToWorldSpace(this.choseRoomItem));
        if (!sellData) {
            return;
        }

        this.sellData = sellData;
        this.setChoseRoomItem(null);
        this.refreshRoomItemUIByRowCol(row, col);
        this.refreshTaskLayer();
        this.refreshComposeHint();
        this.refreshRoomNineAroundAutoNew(row, col);

    }

    onClickBtnSellBack() {
        AudioPlaybackService.instance.playSound(Const.Audio.sellBack);

        let pos = mergeBoardStateStore.sellBack(this.sellData);
        if (!pos) {

            this.refreshCardLayer();
            return;
        }
        let roomItem = this.roomItemUIArr[pos.row][pos.col];
        this.setChoseRoomItem(roomItem);
        this.refreshRoomItemUI(roomItem);
        this.showChoseTween(roomItem);
        this.clearSellBack();
        this.refreshTaskLayer();
        this.refreshComposeHint();
    }

    onClickBtnCdOver(btn: Button) {
        if (!this.choseRoomItem) {
            return;
        }
        let row = this.choseRoomItem.row;
        let col = this.choseRoomItem.col;
        // @ts-ignore
        let dt = btn.node.dt;
        // @ts-ignore
        let cdType = btn.node.cdType;
        mergeBoardStateStore.roomDataCdOver(row, col, dt, cdType);
    }

    onClickBtnBubbleGet() {
        if (!this.choseRoomItem) {
            return;
        }
        let row = this.choseRoomItem.row;
        let col = this.choseRoomItem.col;
        let isSuccess = mergeBoardStateStore.roomDataBubbleGet(row, col);
        if (!isSuccess) {
            return;
        }
        this.refreshRoomItemUI(this.choseRoomItem);
        this.showChoseTween(this.choseRoomItem);
        this.refreshTaskLayer();
    }

    onClickBtnBubbleOver() {
        if (!this.choseRoomItem) {
            return;
        }
        GamePlatform.showRewardVideo("气泡免费跳过", (st) => {
            if (st == 1) {
                let row = this.choseRoomItem.row;
                let col = this.choseRoomItem.col;
                mergeBoardStateStore.rommDataCdBubbleOver(row, col);
            }
        });
        return;
        ServerCtrJSF.GetInstance().reqGetUserDataObjByKey(GameStorage.Key(Const.MoneyKeys.MonthCharge));
    }

    updateTaskLayerLayout() {
        let layout = this.taskLayer.getComponent(Layout)!;

        layout.enabled = false;
        layout.enabled = true;
    }

    onClickTaskPropInfo(btn: Button) {
        // @ts-ignore
        let propRow = btn.node.propRow;
        mergeBoardStateStore.openPropInfoLayer(propRow.id);
    }

    onClickTaskPropItem(btn: Button) {
        // @ts-ignore
        let propRow = btn.node.propRow;
        mergeBoardStateStore.openPropInfoLayer(propRow.id);
    }

    onClickBtnTaskDoneEvent(btn: Button) {
        let node = btn.node;
        // @ts-ignore
        let task1 = node.task;

        let arr = mergeBoardStateStore.getTaskArrSort();
        for (let i = 0; i < arr.length; i++) {
            let TaskItemCellController = this.taskLayer.children[i];
            if (TaskItemCellController) {

                let btnTaskDone = find("btnTaskDone", TaskItemCellController)!;
                if (btnTaskDone) {
                    // @ts-ignore
                    let task2 = btnTaskDone.task;
                    if (task1.id == task2.id) {
                        this.onClickBtnTaskDone(btnTaskDone.getComponent(Button)!)
                        return true
                    }
                }
            }
        }
        return false
    }

    onClickBtnTaskDone(btn: Button) {
        let handIndex = mergeBoardStateStore.getHandIndex();
        if (handIndex == handIndexs.taskMittens) {
            mergeBoardStateStore.addHandIndex();
            this.refreshHandLayer();
        }

        AudioPlaybackService.instance.playSound(Const.Audio.taskDone);

        let node = btn.node;
        node.active = false;
        // @ts-ignore
        let task = node.task;
        this.lastTaskArr = [];
        for (let i in mergeBoardStateStore.taskArr) {
            let t = mergeBoardStateStore.taskArr[i];
            if (t.id == task.id) {
                continue;
            }
            this.lastTaskArr.push(t);
        }


        GameEventManager.eventTarget.emit(GameEventManager.EEventName.ADD_EXP_ANIMATION,task.starNum)
        let subPropArr = mergeBoardStateStore.onClickTaskDone(task, UtilPub.convertToWorldSpace(find("award/icon", node.parent!)!));
        let bagInfo = mergeBoardStateStore.getRoomDataBagInfo();
        let TaskItemCellController = node.parent!;
        let worldPos = UtilPub.convertToWorldSpace(TaskItemCellController);
        let hasCb = false;
        let tmpCb = () => {
            if (hasCb) {
                return;
            }
            hasCb = true;
            tween(TaskItemCellController).to(0.3, { scale: v3(0, 0, 1) }, {
                onUpdate: () => {
                    this.updateTaskLayerLayout();
                }
            }).call(() => {
                mergeBoardStateStore.createTask()
                this.initTaskLayer();
                this.refershRoomLayer();
                this.refreshBuildLayer();
                this.refreshComposeHint();
                this.lastTaskArr = null;
            }).start();
        };
        for (let i in subPropArr) {
            let subProp = subPropArr[i];
            if (subProp.isBag) {
                let roomItem = this.roomItemUIArr[bagInfo.row][bagInfo.col];
                let startPos = UtilPub.convertToWorldSpace(roomItem);
                this.addMoveItemToWorldPos(subProp.id, startPos, worldPos, tmpCb);
            } else {
                let roomItem = this.roomItemUIArr[subProp.row][subProp.col];
                let startPos = UtilPub.convertToWorldSpace(roomItem);
                this.addMoveItemToWorldPos(subProp.id, startPos, worldPos, tmpCb);
                this.refreshRoomItemUIByRowCol(subProp.row, subProp.col);
            }
        }
        this.refreshBottomLayer();
        this.refreshBtnTaskList();
    }

    onClickTaskItem(btn: Button) {
        let task = mergeBoardStateStore.taskArr[0];







        UiLayerService.instance.showDialog(Const.Dialogs.TaskListLayer);
    }

    onClickBtnTaskList() {
        UiLayerService.instance.showDialog(Const.Dialogs.TaskListLayer);
    }


    onClickCardLayer(btn: Button) {
        let emptyPos = mergeBoardStateStore.onClickCardLayer();
        if (!emptyPos) {
            return;
        }
        let roomItem = this.roomItemUIArr[emptyPos.row][emptyPos.col];
        let roomData = this.getRoomDataByItemUI(roomItem);
        let ch = btn.node.children;
        let cardItem = ch[ch.length - 1];
        this.addMoveItemToWorldPos(roomData.id, UtilPub.convertToWorldSpace(cardItem), UtilPub.convertToWorldSpace(roomItem), () => {
            this.refreshRoomItemUI(roomItem);
            this.refreshTaskLayer()
        });
        this.refreshCardLayer();

        let handIndex = mergeBoardStateStore.getHandIndex();
        if (handIndex == handIndexs.boardCardPanel) {
            mergeBoardStateStore.addHandIndex();
            mergeBoardStateStore.closeHandLayer();
        }
    }


    onClickBtnBuild() {
        mergeBoardStateStore.closeHandLayer();
        UiLayerService.instance.showDialog(Const.Dialogs.BuildListPanelController);
    }


    onClickBtnManager() {



        UiLayerService.instance.showDialog(Const.Dialogs.ManagerLayer);
    }


    onClickBtnShop() {













        if (playerDataStore.roleLv < 3) {
            this.toast("还未解锁商店")
            return
        }
        this.clearSellBack();
        UiLayerService.instance.showDialog(Const.Dialogs.ShopSynthesisDialog);
        let handIndex = mergeBoardStateStore.getHandIndex();
        if (handIndex == handIndexs.shopOpen) {
            mergeBoardStateStore.addHandIndex();
        }




















    }

    onClickBtnClose() {
        this.close();
    }

    onClickBtnDeleteData() {
        mergeBoardStateStore.deleteAllRoomData();
        this.close();
    }

}

