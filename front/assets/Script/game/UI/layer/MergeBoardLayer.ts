

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
        mergeBoardStateStore._fn_m(parseInt(id), parseInt(propnum))

    }

    onLoad() {
        UtilPub._fn_rr(this.tbgxSpinePath);
        UtilPub._fn_rr(this.jsqSpinePath);

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

        this._fn_ow();
        this._fn_ag(this.btnClose, this._fn_sz);
        this.bindButton(this.btnShop, this._fn_tn);
        this.bindButton(this.btnDeleteData, this._fn_ta);

        this.bindButton(this.infoUILayer, this._fn_uc);
        this.bindButton(this.btnUnlock, this._fn_ts);
        this.bindButton(this.btnCdOver, this._fn_sx);
        this.bindButton(this.btnBubbleGet, this._fn_su);
        this.bindButton(this.btnBubbleOver, this._fn_sv);

        this._fn_ag(this.btnSellBack, this._fn_tl);
        this._fn_ag(this.btnSell, this._fn_tk);

        this.bindButton(this.btnBuild, this.onClickBtnBuild);
        this.bindButton(this.btnManager, this._fn_tg);
        this.bindButton(this.cardLayer, this._fn_tu);
        this.bindButton(this.btnTaskList, this._fn_tr);

        this.addPrefab(Const.Prefabs.Main_top, this.node, null!, { parentNode: this.node, flag: main_top.ShowLevel | main_top.ShowCoin | main_top.ShowPower | main_top.ShowDiamond });

        redPointManager._fn_afp(this.btnBuild, RPointEvent.boardBuildHint, false, 1.5, 35, 22);

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

        UtilGame._fn_acu();
        console.log(" show 2")


        mergeBoardStateStore._fn_rh();
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

        this._fn_pf();
        this._fn_yz();
        this._fn_zi();
        this._fn_yr();
        this._fn_za();
        this._fn_yv();
        this._fn_yy();
        this._fn_yx();
        console.log(" show 4")

        this.on(GD.event.boardSlotSpawn, this.boardSlotSpawnRet, this);
        this.on(GD.event.roomBubbleBurst, this.roomBubbleBurstRet, this);
        this.on(GD.event.boardBagWithdraw, this.boardBagWithdrawRet, this);
        this.on(GD.event.boardMilestoneRefresh, this._fn_ak, this);
        this.on(GD.event.boardCardRefresh, this._fn_ai, this);
        this.on(GD.event.boardDiscovery, this._fn_aj, this);
        this.on(GD.event.refreshHandLayer, this._fn_ze, this);
        this.on(GD.event.goToBuildScene, this._fn_nc, this);
        this.on(GD.event.refreshTask, this._fn_zx, this);
        this.on(GD.event.boardSpeedupEnded, this._fn_al, this);
        this.on(GD.event.onClickTaskDone, this._fn_tq, this);
        console.log(" show 5")


        director.off(GNetCmd.GetUserDataByKey.toString(), this._fn_uw, this);
        director.on(GNetCmd.GetUserDataByKey.toString(), this._fn_uw, this);


        this.scheduleOnce(() => {
            mergeBoardStateStore._fn_sc();
            this.refreshHandLayer();
        }, 0.5);
        console.log(" show 6")

        this.schedule(this._fn_aig, 6);
        this.schedule(this._fn_ajm, 0.5);

        UtilPub._fn_ex(mergeBoardStateStore.roomArr, (roomData: any) => {
            if (roomData.st == roomStatus.carton) {
                UtilPub._fn_rr(this.cartonSpinePath);
                return true;
            }
        });
        console.log(" show 7")

        let hadnIdnex = mergeBoardStateStore._fn_hj();
        if (hadnIdnex == handIndexs.shopOpen) {
            let obj: any = {};
            obj.id = hadnIdnex;
            obj.node = this.btnShop
            obj.delayTime = 0.5;
            UiLayerService.instance._fn_ahg(Const.Dialogs.HandLayer, obj);
        }
        console.log(" show 8")

    }

    close() {
        super.close();
        UtilGame._fn_acv();

        AudioPlaybackService.instance._fn_xc(Const.Audio.sceneChange);

        this.off(GD.event.boardSlotSpawn, this.boardSlotSpawnRet);
        this.off(GD.event.roomBubbleBurst, this.roomBubbleBurstRet);
        this.off(GD.event.boardBagWithdraw, this.boardBagWithdrawRet);
        this.off(GD.event.boardMilestoneRefresh, this._fn_ak);
        this.off(GD.event.boardCardRefresh, this._fn_ai);
        this.off(GD.event.boardDiscovery, this._fn_aj);
        this.off(GD.event.refreshHandLayer, this._fn_ze);
        this.off(GD.event.goToBuildScene, this._fn_nc);
        this.off(GD.event.refreshTask, this._fn_zx);
        this.off(GD.event.onClickTaskDone, this._fn_tq);

        director.off(GNetCmd.GetUserDataByKey.toString(), this._fn_uw, this);

    }

    onDisable() {
        mergeBoardStateStore.close();

        this.unschedule(this._fn_acw);
        this.unschedule(this._fn_aig);
        this.unschedule(this._fn_ajm);
    }

    _fn_yx() {






    }

    _fn_ajm() {

        UtilPub._fn_ex(this.roomItemUIArr, (itemUI: Node, row: number, col: number) => {
            this._fn_zt(itemUI);
        });

        this._fn_ahz()
    }

    _fn_aig() {
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
        let handIndex = mergeBoardStateStore._fn_hj();

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
                mergeBoardStateStore._fn_e();
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
            UiLayerService.instance._fn_ahg(Const.Dialogs.HandLayer, obj);
        }

    }

    _fn_ow() {
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

    _fn_yr() {
        UtilPub._fn_ex(this.roomItemUIArr, (itemUI: Node, row: number, col: number) => {
            this._fn_zm(itemUI);
        });
    }

    _fn_yz() {
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
            let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, id);

            let iconNode = find("icon", itemUI)!;
            Tween.stopAllByTarget(iconNode);
            let effectNode = find("spine", itemUI)!;
            this._fn_agl(iconNode.getComponent(Sprite)!, Const.resPath.icon + propRow.icon);
            let numNode = find("num", itemUI)!;
            if (i == arr.length - 1 && showNum > 0) {
                numNode.active = true;
                this._fn_ago(find("val", numNode), showNum);
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

    _fn_zi() {
        if (mergeBoardStateStore._fn_qa()) {
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
            let row = TableDataService.ins()._fn_ly(Const.Tables.manager, temp.id);
            if (mergeBoardStateStore._fn_ii(temp) >= row.p1 && !temp.get) {
                hasCanGetAward = true;
            }
        }
        if (hasCanGetAward) {
            btnLookManager.active = true;
            hintNode.active = true;
        } else {
            if (manager) {
                infoLayer.active = true;
                let row = TableDataService.ins()._fn_ly(Const.Tables.manager, manager.id);
                this._fn_ago(find("info/id/val", this.btnManager), manager.id);
                this._fn_afm(find("info/progress", this.btnManager)!, mergeBoardStateStore._fn_ii(manager) / row.p1);
                let propId = row.price[0];
                let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, propId);
                this._fn_agl(find("info/icon", this.btnManager)?.getComponent(Sprite)!, Const.resPath.icon + propRow.icon);
            }
        }
    }

    _fn_pf() {
        this.taskLayer.removeAllChildren();

        for (let i = 0; i < mergeBoardStateStore.taskArr.length; i++) {
            let TaskItemCellController = instantiate(this.taskItem);
            TaskItemCellController.active = true;
            TaskItemCellController.parent = this.taskLayer;
        }

        this._fn_zw();
    }

    _fn_zw() {
        let arr = mergeBoardStateStore._fn_mh();
        for (let i = 0; i < arr.length; i++) {
            let task = arr[i];
            let TaskItemCellController = this.taskLayer.children[i];

            this._fn_zv(TaskItemCellController, task);

            if (TaskItemCellController == null) {
                continue
            }
            if (this.lastTaskArr && !this._fn_bw(task)) {

                TaskItemCellController.scale = v3(0, 0, 1);

                tween(TaskItemCellController).to(0.3, { scale: v3(1, 1, 1) }, {
                    onUpdate: () => {
                        this._fn_aju();
                    }
                }).set({ scale: v3(1, 1, 1) }).start();
            } else {
                TaskItemCellController.scale = v3(1, 1, 1);
                this._fn_aju();
            }
            this.bindButton(TaskItemCellController, this._fn_ui);
        }

    }

    _fn_bw(task: any) {
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

    _fn_zv(itemUI: Node, task: any) {

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
                let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, prop.id);
                if (!propRow) {
                    propItem.active = false;
                    return;
                }
                this._fn_agl(find("icon", propItem)?.getComponent(Sprite)!, Const.resPath.icon + propRow.icon);
                let hasInfo = mergeBoardStateStore._fn_kg(prop.id);
                let showNum = hasInfo.num;
                if (showNum >= prop.num) {
                    showNum = prop.num;
                }
                this._fn_ago(find("num", propItem), showNum + "/" + prop.num);
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
                this.bindButton(propItem, this._fn_uk);

                let btnPropInfo = find("propInfo", propItem)!;
                // @ts-ignore
                btnPropInfo.propRow = propRow;
                this.bindButton(btnPropInfo, this._fn_uj);

            } else {
                propItem.active = false;
            }
        });
        if (hasDone) {
            chs.forEach((propItem: Node, i: number) => {
                find("gou", propItem)!.active = false;
            });
        }
        this._fn_ago(find("award/num", itemUI), task.starNum);
        let btnTaskDone = find("btnTaskDone", itemUI)!;
        let btnTaskDonebug = find("btnTaskDonebug", itemUI)!;

        btnTaskDone.active = hasDone;
        // @ts-ignore
        btnTaskDone.task = task;

        // @ts-ignore
        btnTaskDonebug.task = task;

        this._fn_ag(btnTaskDone, this._fn_tp.bind(this));

        this._fn_ag(btnTaskDonebug, this._fn_s.bind(this));

    }

    _fn_s(btn: Button) {
        let node = btn.node;
        // @ts-ignore
        let task = node.task;


        for (let i in task.propArr) {
            let prop = task.propArr[i];
            mergeBoardStateStore._fn_m(prop.id, prop.num)
        }
    }

    _fn_yy() {
        this._fn_ago(find("num", this.btnBuild), mergeBoardStateStore._fn_jp(propIds.star));
        this._fn_ahz()
    }


    _handDelay = 0
    _fn_ahz() {
        if (this._handDelay > 0) {
            this._handDelay--
            return
        }
        if (playerDataStore.roleLv > 4) {
            return
        }
        let handIndex = mergeBoardStateStore._fn_hj();
        if (handIndex >= 19) {
            let children = find("Canvas")!.children
            if (UtilScene._fn_qt() && children[children.length - 1].name == "MergeBoardLayer") {
                let obj: any = {};
                obj.id = 20;
                obj.node = this.btnBuild;
                obj.delayTime = 0.5;
                obj.weak = true
                UiLayerService.instance._fn_ahg(Const.Dialogs.HandLayer, obj);
                this._handDelay = 10
            }
        }
    }

    _fn_yv() {
        this.infoUILayer.active = false;
        this.sellBackLayer.active = false;
        this.infoHintNode.active = false;

        if (this.sellData) {
            this.sellBackLayer.active = true;
            let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, this.sellData.roomData.id);
            this._fn_ago(find("info", this.sellBackLayer), localText.sellBackHint.format(propRow.name, propRow.luna));
            return;
        }

        if (!this.choseRoomItem) {
            this.infoHintNode.active = true;
            return;
        }

        let row = this.choseRoomItem.row;
        let col = this.choseRoomItem.col;
        let roomData = this._fn_kf(this.choseRoomItem);
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

        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, roomData.id);
        let titleLayer = find("titleLayer", this.infoUILayer)!;
        this._fn_ago(find("name", titleLayer), propRow.name);
        this._fn_ago(find("lv", titleLayer), propRow.luna + localText.lv);

        let infoNode = find("info", this.infoUILayer)!;
        this._fn_ago(infoNode, propRow.mask);

        this.btnSell.active = false;
        this.btnUnlock.active = false;
        this.btnCdOver.active = false;
        this.btnBubbleGet.active = false;
        this.btnBubbleOver.active = false;

        if (propRow.levelGold > 0 && !mergeBoardStateStore._fn_qk(row, col)
            && !mergeBoardStateStore._fn_ql(row, col) && !mergeBoardStateStore._fn_qo(row, col)) {
            this.btnSell.active = true;
            this._fn_ago(find("num", this.btnSell), propRow.levelGold);
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
            UtilPub._fn_ex(mergeBoardStateStore.roomArr, (pRoom: any, pRow: any, pCol: any) => {
                if (!pRoom.id || pRoom.st == roomStatus.spider || pRoom.st == roomStatus.carton || mergeBoardStateStore._fn_qk(pRow, pCol)) {
                    return;
                }
                let tmpRow = TableDataService.ins()._fn_ly(Const.Tables.prop, pRoom.id);
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


        this._fn_yw();


        let btnsLayer = find("btnsLayer", this.infoUILayer)!;
        let layout = btnsLayer.getComponent(Layout)!;
        layout.enabled = false;
        layout.enabled = true;
        layout.updateLayout();
        let width = this.infoUILayer.getComponent(UITransform)!.width - btnsLayer.getComponent(UITransform)!.width - 40;
        infoNode.getComponent(UITransform)!.width = width;

    }

    _fn_kf(itemUI: Node) {
        return mergeBoardStateStore._fn_kf(itemUI)
        // @ts-ignore
        return mergeBoardStateStore.roomArr[itemUI.row][itemUI.col];
    }

    _fn_zm(itemUI: Node, roomData?: any) {
        if (!itemUI) {
            return;
        }
        if (!roomData) {
            roomData = this._fn_kf(itemUI);
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
            if (mergeBoardStateStore._fn_qk(row, col) || mergeBoardStateStore._fn_jn(roomData.id) == roomData.id) {
                choseIcon = "chose_green";
            }
            this._fn_agl(choseNode.getComponent(Sprite)!, Const.resPath.mergeIcon + "board/" + choseIcon, () => {
                choseNode.active = true;
            });
        } else {
            choseNode.active = false;
        }

        this._fn_zn(itemUI);
        this._fn_zp(itemUI);
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, roomData.id);
        let iconNode = find("icon", itemUI)!;
        iconNode.active = true;
        iconNode.scale = v3(1, 1, 1);
        this._fn_agl(iconNode.getComponent(Sprite)!, Const.resPath.icon + propRow.icon);


        let bagHint = find("bagHint", itemUI)!;
        if (roomData.id == propIds.bag) {
            if (!bagHint) {
                bagHint = new Node("bagHint");
                bagHint.parent = itemUI;
                bagHint.addComponent(Sprite);
                bagHint.position = v3(30, 30);
                tween(bagHint).to(1.2, { scale: v3(1.2, 1.2, 1) }).to(0.7, { scale: v3(1, 1, 1) }).union().repeatForever().start();
            }
            this._fn_agl(bagHint.getComponent(Sprite)!, Const.resPath.mergeIcon + "board/bag_hint");
            if (mergeBoardStateStore._fn_ql(row, col) || mergeBoardStateStore._fn_qo(row, col)) {
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
                this._fn_q(this.tbgxSpinePath, superCard, (err: any, aniCtrl: AnimationCtrl) => {
                    aniCtrl.playAnimation("8", true);
                });
            }
        } else if (superCard) {
            superCard.destroy();
        }


        let taskNode = find("taskGou", itemUI)!;
        let taskNodeLan = find("taskGouLan", itemUI)!;

        if (mergeBoardStateStore._fn_qk(row, col) || mergeBoardStateStore._fn_qo(row, col) || mergeBoardStateStore._fn_ql(row, col)) {
            taskNode.active = false;
            taskNodeLan.active = false;
        } else {
            taskNode.active = mergeBoardStateStore._fn_qz(roomData.id);
            taskNodeLan.active = TreasureModel._fn_bq(roomData.id)
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
                    this._fn_agl(cartonNode.getComponent(Sprite)!, Const.resPath.mergeIcon + "board/xz" + suffix, () => {
                        cartonNode.active = true;
                    });
                    break;
                default:
                    break;
            }
        } else if (statusNode) {
            statusNode.destroy();
        }
        this._fn_zt(itemUI);

    }

    _fn_zt(itemUI: any) {
        let row = itemUI.row;
        let col = itemUI.col;
        let roomData = this._fn_kf(itemUI);
        if (!mergeBoardStateStore._fn_qn(row, col)) {
            return;
        }
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, roomData.id);
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
                if (!mergeBoardStateStore._fn_qn(r, c) || !mergeBoardStateStore._fn_xp(rData.id)) {

                    if (node) {
                        node.removeFromParent();
                    }
                } else {

                    if (!node) {
                        this._fn_q(this.jsqSpinePath, this.mergeFxLayer, (err, aniCtrl: AnimationCtrl) => {
                            aniCtrl.playAnimation("animation", true);
                            aniCtrl.node.name = name;
                            UtilPub._fn_afg(aniCtrl.node, itemUI);

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
    _fn_aaf(itemUI: any, isForce = false) {
        let row = itemUI.row;
        let col = itemUI.col;
        if (!isForce) {
            let roomData = this._fn_kf(itemUI);
            if (!mergeBoardStateStore._fn_qn(row, col)) {
                return;
            }
            let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, roomData.id);
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
    _fn_zo(row: number, col: number) {
        let roomItem = this.roomItemUIArr[row][col];
        this._fn_zm(roomItem);
    }
    _fn_zp(roomItem: Node) {
        let cdNode = find("cd", roomItem)!;
        let roomData = this._fn_kf(roomItem);


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

        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, roomData.id);


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
            dt = roomData.cd - mergeBoardStateStore._fn_gm();
            sum = roomData.cdSum;
        }

        let dtAuto = -1;
        if (roomData.cdAuto > 0) {
            dtAuto = roomData.cdAuto - mergeBoardStateStore._fn_gm();
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
            this._fn_afm(cdNode, dt / sum);
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

        if (mergeBoardStateStore._fn_qo(row, col) || mergeBoardStateStore._fn_qk(row, col)) {
            itemSpineNode.active = false;
            cdNode.active = false;
            isClickSpine = false;
            isAutoSpine = false;
        }

        if (isClickSpine || isAutoSpine) {
            this._fn_ahm(roomItem);
        } else {
            this._fn_aim(roomItem);
        }

    }
    _fn_zn(roomItem: Node) {
        let roomData = this._fn_kf(roomItem);
        let bubbleNode = find("bubble", roomItem)!;
        if (!roomData.id || !roomData.cdBubble) {
            bubbleNode.active = false;
            return;
        }
        bubbleNode.active = true;
    }
    _fn_zq(roomItem: Node) {
        this._fn_zp(roomItem);
        this._fn_zn(roomItem);
    }

    _fn_kj(pos: Vec2) {
        let p = UtilPub._fn_do(this.roomListLayer, v3(pos.x, pos.y, 0));
        p.x += this.dPos.x + this.roomWidth * 0.5;
        p.y += this.dPos.y + this.roomWidth * 0.5;

        let col = Math.floor(p.x / this.roomWidth);
        let row = Math.floor(p.y / this.roomWidth);

        if (mergeBoardStateStore._fn_ps(row, col)) {
            return this.roomItemUIArr[row][col];
        }

        return null;
    }

    _fn_aep(roomItem: any) {
        if (this.choseRoomItem) {
            find("chose", this.choseRoomItem)!.active = false;
        }
        this.choseRoomItem = roomItem;
        this._fn_yv();
    }

    _fn_ahs(row: number, col: number, targetRoomItem: any) {
        let roomData = mergeBoardStateStore.roomArr[row][col];
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, roomData.id);


        let isShow = false;
        if (propRow.mdt == 4 && targetRoomItem) {
            let targetRoomData = this._fn_kf(targetRoomItem);
            if (mergeBoardStateStore._fn_qn(targetRoomItem.row, targetRoomItem.col) && mergeBoardStateStore._fn_ba(roomData.id, targetRoomData.id)) {
                isShow = true;
            }
        }
        let spineName = "spineSplit";
        let spineNode = find(spineName, this.mergeFxLayer);
        if (isShow) {
            if (spineNode) {
                UtilPub._fn_afg(spineNode, targetRoomItem);
            } else {
                this._fn_q(this.tbgxSpinePath, this.mergeFxLayer, (err: any, aniCtrl: AnimationCtrl) => {
                    aniCtrl.node.name = spineName;
                    aniCtrl.playAnimation("3", true);
                    UtilPub._fn_afg(aniCtrl.node, targetRoomItem);
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

        let nextPropRow = TableDataService.ins()._fn_ly(Const.Tables.prop, roomData.id + 1);
        let isMaxLv = false;
        if (!nextPropRow || nextPropRow.type != propRow.type || nextPropRow.typeson != propRow.typeson) {
            isMaxLv = true;
        }

        let arr: any = [];
        UtilPub._fn_ex(this.roomItemUIArr, (roomItem: any, r: number, c: number) => {
            if (!mergeBoardStateStore._fn_qn(r, c)) {
                return;
            }
            if (row == r && col == c) {
                return;
            }
            let tmpRoomData = this._fn_kf(roomItem);
            if (tmpRoomData.id == propIds.bag) {

                arr.push(roomItem);
                return;
            }
            let tmpPropRow = TableDataService.ins()._fn_ly(Const.Tables.prop, tmpRoomData.id);
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

                    if (!mergeBoardStateStore._fn_xq(tmpRoomData.id) && tmpPropRow.putong1) {
                        arr.push(roomItem);
                        roomItem.maskSpine = "";
                    }
                    break;
                case 7:

                    if (!mergeBoardStateStore._fn_xq(tmpRoomData.id) && tmpPropRow.putong2) {
                        arr.push(roomItem);
                        roomItem.maskSpine = "";
                    }
                    break;
                case 8:

                    if (!mergeBoardStateStore._fn_xq(tmpRoomData.id) && tmpPropRow.putong3) {
                        arr.push(roomItem);
                        roomItem.maskSpine = "";
                    }
                    break;
                case 9:

                    if (!mergeBoardStateStore._fn_xq(tmpRoomData.id) && !tmpPropRow.nochaoji) {
                        arr.push(roomItem);
                        roomItem.maskSpine = "";
                    }
                    break;
                case 10:

                    if (!mergeBoardStateStore._fn_xq(tmpRoomData.id) && tmpPropRow.quanneng) {
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
                this._fn_q(this.tbgxSpinePath, find("tempSpine", roomItem)!, (err: any, aniCtrl: AnimationCtrl) => {
                    aniCtrl.playAnimation("1", true);
                });
                this._fn_q(this.tbgxSpinePath, find("tempSpine", roomItem)!, (err: any, aniCtrl: AnimationCtrl) => {
                    aniCtrl.playAnimation(roomItem.maskSpine, true);
                });
            }
        }

    }

    _fn_nm() {
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

    _fn_abo() {
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

        this._fn_cx();
        this.touchMoveCount = 0;
        if (this.moveRoomItem && isValid(this.moveRoomItem)) {
            this.moveRoomItem.destroy();
        }
        this.moveRoomItem = null;
        this.startRoomItem = null;
        let roomItem = this._fn_kj(event.getUILocation());
        let roomData = this._fn_kf(roomItem);
        if (!roomData.id || roomData.st == roomStatus.carton) {
            return;
        }
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, roomData.id);
        find("hintSpine", roomItem)!.active = false;
        if (!mergeBoardStateStore._fn_px()) {
            let handIndex = mergeBoardStateStore._fn_hj();
            switch (handIndex) {
                case handIndexs.firstCompose:
                case handIndexs.secondCompose:
                case handIndexs.thirdCompose:
                case handIndexs.boardMergeStepA:
                case handIndexs.boardMergeStepB:
                    if (roomItem != mergeBoardStateStore._fn_hk()!.startNode) {
                        return;
                    }
                    break;
                case handIndexs.clickRoomNew:
                case handIndexs.clickRoomNew2:
                    if (this._fn_kf(roomItem).id != 10004) {
                        return;
                    }
                    break;
                default:
                    break;
            }
        }
        this.startRoomItem = roomItem;
        this._fn_cz();
        this._fn_aaf(roomItem);
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

        if (!mergeBoardStateStore._fn_px()) {
            let handIndex = mergeBoardStateStore._fn_hj();
            switch (handIndex) {
                case handIndexs.clickRoomNew:
                case handIndexs.clickRoomNew2:
                    return;
                    break;
                default:
                    break;
            }
        }

        let moveRoomData = this._fn_kf(this.startRoomItem);
        let row = this.startRoomItem.row;
        let col = this.startRoomItem.col;

        if (moveRoomData.st == roomStatus.spider || moveRoomData.st == roomStatus.carton) {
            return;
        }

        if (!this.moveRoomItem) {
            this._fn_aep(this.startRoomItem);
            this.moveRoomItem = instantiate(this.startRoomItem);
            this.moveRoomItem.parent = this.moveItemLayer;
            this.moveRoomItem.row = this.startRoomItem.row;
            this.moveRoomItem.col = this.startRoomItem.col;
            this.startRoomItem.active = false;
            this._fn_zm(this.moveRoomItem, moveRoomData);
        }
        let pos = event.getUILocation();

        let p = UtilPub._fn_do(this.moveRoomItem, v3(pos.x, pos.y, 0));
        this.moveRoomItem.position = p;

        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, moveRoomData.id);

        let isShowComposeEffect = false;
        let targetRoomItem = this._fn_kj(pos);
        if (!mergeBoardStateStore._fn_qk(row, col) && propRow.blessId > 0 && targetRoomItem) {
            let targetRoomData = this._fn_kf(targetRoomItem);
            let targetRow = targetRoomItem.row;
            let targetCol = targetRoomItem.col;
            if (targetRoomData != moveRoomData
                && targetRoomData.id == moveRoomData.id
                && !mergeBoardStateStore._fn_ql(targetRow, targetCol)
                && !mergeBoardStateStore._fn_qk(targetRow, targetCol)
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
                UtilPub._fn_afg(mergeFxItem, targetRoomItem);
                this.currentMergeFx = mergeFxItem;
                this.currentMergeFx.targetRoomItem = targetRoomItem;
            }
        } else {
            if (this.currentMergeFx) {
                this.currentMergeFx.destroy();
                this.currentMergeFx = null;
            }
        }

        if (targetRoomItem && this._fn_kf(targetRoomItem).id == propIds.bag) {
            // @ts-ignore
            this.bagIconNode = find("icon", targetRoomItem)!;
            // @ts-ignore
            this.bagIconNode.scale = v3(1.2, 1.2, 1);
        } else {
            this._fn_abo();
        }


        if (propRow.mdt == 3 || propRow.mdt == 4
            || propRow.mdt == 6 || propRow.mdt == 7 || propRow.mdt == 8 || propRow.mdt == 9 || propRow.mdt == 10) {
            this._fn_ahs(row, col, targetRoomItem);
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
            this._fn_za();
            return;
        }
        this._fn_abo();
        console.log("roomListTouchEnd  1")
        if (this.moveRoomItem) {
            this._fn_nm();
            this._fn_aep(this.startRoomItem);
            let row = this.moveRoomItem.row;
            let col = this.moveRoomItem.col;
            console.log("roomListTouchEnd  2")
            let roomData = this._fn_kf(this.moveRoomItem);
            let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, roomData.id);
            let endRoomItem = this._fn_kj(event.getUILocation());
            let endRoomData = this._fn_kf(endRoomItem);
            if (row == endRoomItem.row && col == endRoomItem.col) {

                this._fn_se(this.moveRoomItem, row, col, () => {
                    mergeBoardStateStore._fn_zl(row, col);
                });
                this._fn_za();
                return;
            }
            console.log("roomListTouchEnd  3")
            let endRoomIsBubble = mergeBoardStateStore._fn_qk(endRoomItem.row, endRoomItem.col);
            if (!endRoomData.id || roomData.id != endRoomData.id
                || mergeBoardStateStore._fn_qk(row, col)
                || endRoomIsBubble
                || mergeBoardStateStore._fn_ql(endRoomItem.row, endRoomItem.col)
            ) {
                console.log("roomListTouchEnd  4")

                if (endRoomData.id == propIds.bag) {
                    console.log("roomListTouchEnd  5")


                    if (mergeBoardStateStore._fn_xy(row, col, endRoomItem.row, endRoomItem.col)) {

                        this._fn_zo(row, col);
                        this.choseRoomItem = endRoomItem;
                        this._fn_zo(endRoomItem.row, endRoomItem.col);
                        this.moveRoomItem.destroy();
                        this.moveRoomItem = null;
                    } else {

                        this._fn_se(this.moveRoomItem, row, col);
                    }
                } else {
                    console.log("roomListTouchEnd  6")


                    if (mergeBoardStateStore._fn_qo(endRoomItem.row, endRoomItem.col) || mergeBoardStateStore._fn_ql(endRoomItem.row, endRoomItem.col)) {
                        console.log("roomListTouchEnd  7")
                        this._fn_aep(this.startRoomItem);
                        this._fn_se(this.moveRoomItem, row, col);
                        this._fn_za();
                        console.log("roomListTouchEnd  8")

                        return;
                    }

                    let handIndex = mergeBoardStateStore._fn_hj();
                    switch (handIndex) {
                        case handIndexs.firstCompose:
                        case handIndexs.secondCompose:
                        case handIndexs.thirdCompose:
                        case handIndexs.boardMergeStepA:
                        case handIndexs.boardMergeStepB:
                            if (endRoomItem != mergeBoardStateStore._fn_hk()!.endNode) {
                                this._fn_aep(this.startRoomItem);
                                this._fn_se(this.moveRoomItem, row, col);
                                return;
                            }
                            break;
                        default:
                            break;
                    }

                    if (propRow && propRow.mdt == 3 && mergeBoardStateStore._fn_ax(endRoomData.id) && !endRoomIsBubble) {

                        this.moveRoomItem.destroy();
                        this.moveRoomItem = null;
                        mergeBoardStateStore._fn_ace(row, col, endRoomItem.row, endRoomItem.col, propRow.p1);
                        this._fn_aep(endRoomItem);
                        this._fn_zm(endRoomItem);
                        this._fn_zo(row, col);
                        this._fn_za();
                        this._fn_zr(row, col);
                        this._fn_q(this.tbgxSpinePath, endRoomItem, (err: any, aniCtrl: AnimationCtrl) => {
                            aniCtrl.playAnimationOnce("5", () => {
                                aniCtrl.node.destroy();
                            });
                        });
                        return;
                    }

                    if (propRow && propRow.mdt == 4 && mergeBoardStateStore._fn_ba(propRow.id, endRoomData.id) && !endRoomIsBubble) {

                        this.moveRoomItem.destroy();
                        this.moveRoomItem = null;
                        let retObj = mergeBoardStateStore._fn_acj(row, col, endRoomItem.row, endRoomItem.col);
                        this._fn_aep(endRoomItem);
                        this._fn_zm(endRoomItem);
                        this._fn_za();
                        mergeBoardStateStore._fn_zl(row, col);
                        let mRow = retObj.emptyPos.row;
                        let mCol = retObj.emptyPos.col;
                        this._fn_j(endRoomItem, mRow, mCol, 1, () => {
                            mergeBoardStateStore._fn_zl(mRow, mCol);
                            this._fn_ahl(this.roomItemUIArr[mRow][mCol], "5");
                            this._fn_zw();
                        });
                        this._fn_ahl(endRoomItem, "5");
                        return;
                    }

                    if (propRow && (propRow.mdt == 6 || propRow.mdt == 7 || propRow.mdt == 8 || propRow.mdt == 9 || propRow.mdt == 10)
                        && mergeBoardStateStore._fn_az(propRow.id, endRoomData.id) && !endRoomIsBubble) {

                        this.moveRoomItem.destroy();
                        this.moveRoomItem = null;
                        mergeBoardStateStore._fn_aci(row, col, endRoomItem.row, endRoomItem.col);
                        this._fn_aep(endRoomItem);
                        this._fn_zm(endRoomItem);
                        this._fn_zo(row, col);
                        this._fn_za();
                        this._fn_ahd(endRoomItem);
                        this._fn_zw();
                        this._fn_q(this.tbgxSpinePath, this.mergeFxLayer, (err: any, aniCtrl: AnimationCtrl) => {
                            UtilPub._fn_afg(aniCtrl.node, endRoomItem);
                            aniCtrl.playAnimationOnce("6", () => {
                                aniCtrl.node.destroy();
                            });
                        });
                        return;
                    }


                    mergeBoardStateStore._fn_ach(row, col, endRoomItem.row, endRoomItem.col);
                    this._fn_aep(endRoomItem);
                    this._fn_se(this.moveRoomItem, endRoomItem.row, endRoomItem.col, () => {
                        mergeBoardStateStore._fn_zl(endRoomItem.row, endRoomItem.col);
                        this._fn_za();
                        this._fn_zr(row, col);
                    });
                    if (endRoomData.id) {

                        endRoomItem.active = false;
                        this._fn_j(endRoomItem, row, col, 0, () => {
                            mergeBoardStateStore._fn_zl(row, col);
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
                    let handIndex = mergeBoardStateStore._fn_hj();
                    if (handIndex == handIndexs.firstCompose && propRow.blessId == 10002) {
                        mergeBoardStateStore._fn_e();
                        this.refreshHandLayer();
                    } else if (handIndex == handIndexs.secondCompose && propRow.blessId == 10003) {
                        mergeBoardStateStore._fn_e();
                        this.refreshHandLayer();
                    } else if (handIndex == handIndexs.thirdCompose && propRow.blessId == 10004) {
                        mergeBoardStateStore._fn_e();
                        mergeBoardStateStore._fn_df();
                    } else if (handIndex == handIndexs.boardMergeStepA && propRow.blessId == 10027) {
                        mergeBoardStateStore._fn_e();
                        this.refreshHandLayer();
                    } else if (handIndex == handIndexs.boardMergeStepB && propRow.blessId == 10028) {
                        mergeBoardStateStore._fn_e();
                        this.refreshHandLayer();
                    }

                    let retObj = mergeBoardStateStore._fn_sd(row, col, endRoomItem.row, endRoomItem.col);

                    for (let i in retObj.cartonArr) {
                        let posInfo = retObj.cartonArr[i];
                        let cRoomItem = this.roomItemUIArr[posInfo.row][posInfo.col];
                        this._fn_q(this.cartonSpinePath, cRoomItem, (err: any, aniCtrl: AnimationCtrl) => {
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
                            this._fn_zo(posInfo.row, posInfo.col);
                            aniCtrl.playAnimationOnce("animation", () => {
                                aniCtrl.node.destroy();
                            });
                            aniCtrl.node.scale = v3(1.2, 1.2, 1);
                        });
                    }
                    this.choseRoomItem = endRoomItem;
                    this.moveRoomItem.destroy();
                    this.moveRoomItem = null;
                    this._fn_zo(row, col);
                    this._fn_zm(endRoomItem);
                    this._fn_ahe(endRoomItem);

                    let audioName = Const.Audio.mergeTap + (this.mergeAudioCount % 4)
                    this.mergeAudioCount++;
                    AudioPlaybackService.instance._fn_xc(audioName);
                    this.unschedule(this._fn_acw);
                    this.scheduleOnce(this._fn_acw, 2);

                    mergeBoardStateStore._fn_zl(endRoomItem.row, endRoomItem.col);
                    this._fn_zr(row, col);

                    if (propRow.luna >= 4)
                        mergeBoardStateStore._fn_u(endRoomItem.row, endRoomItem.col);

                    this._fn_yv();
                    this._fn_zw();

                    if (this.currentMergeFx) {
                        this.currentMergeFx.getComponent(AnimationCtrl).playAnimationOnce("2", () => {
                            this.currentMergeFx.destroy();
                            this.currentMergeFx = null;
                        });
                    }
                } else {

                    this._fn_se(this.moveRoomItem, row, col);
                }
                this._fn_za();
                return;
            }
        }
        console.log("roomListTouchEnd  10")


        if (this.choseRoomItem == this.startRoomItem) {

            this._fn_ug(this.startRoomItem);
            let handIndex = mergeBoardStateStore._fn_hj();
            if (handIndex == handIndexs.clickRoomNew || handIndex == handIndexs.clickRoomNew2) {
                mergeBoardStateStore._fn_e();
                this.refreshHandLayer();
            }
        } else {
            this._fn_zm(this.choseRoomItem);
        }
        this._fn_aep(this.startRoomItem);
        this._fn_zm(this.choseRoomItem);

        this._fn_ahd(this.choseRoomItem);

        this._fn_za();
        console.log("roomListTouchEnd  11")

    }

    _fn_acw() {
        this.mergeAudioCount = 0;
    }

    roomListTouchCancel(event: EventTouch) {
        UtilPub.log("roomListTouchCancel");
        this.touching = false;
        this._fn_za();
        this._fn_nm();
        this._fn_abo();
        if (!this.moveRoomItem) {
            return;
        }
        this._fn_aep(this.startRoomItem);

        let row = this.moveRoomItem.row;
        let col = this.moveRoomItem.col;

        this._fn_se(this.moveRoomItem, row, col);
    }

    _fn_gc() {
        return UtilPub._fn_dp(this.cardLayer);
    }

    _fn_fy() {
        return UtilPub._fn_dp(find("icon", this.btnBuild)!);
    }


    _fn_zr(row: number, col: number) {
        nineAroundArr.forEach((posArr: any) => {
            let r = row + posArr[0];
            let c = col + posArr[1];
            if (r >= 0 && r <= mergeBoardStateStore.rowNum - 1 && c >= 0 && c <= mergeBoardStateStore.colNum - 1) {
                let rData = mergeBoardStateStore.roomArr[r][c];
                if (rData.id > 0) {
                    mergeBoardStateStore._fn_zl(r, c);
                }
            }
        });
    }






    _fn_da(row: number, col: number) {
        if (this.startRoomItem && this.startRoomItem.row == row && this.startRoomItem.col == col) {
            if (this.moveRoomItem) {
                this.moveRoomItem.destroy();
                this.moveRoomItem = null;
            }
            this.startRoomItem = null;
            this._fn_zo(row, col);
        }
    }

    _fn_uw(value: any) {
        console.log("onMessageEvent:", value);
        let data = ServerCtrJSF._fn_hp()._fn_mu(value, Const.MoneyKeys.MonthCharge)
        if (data && this.choseRoomItem) {
            let monthCardVal = MonthCard._fn_ca(value)
            if (monthCardVal) {
                let row = this.choseRoomItem.row;
                let col = this.choseRoomItem.col;
                mergeBoardStateStore._fn_acd(row, col);
            } else {

                UtilPub.log("prompt purchase privilege");
            }
        }

    }

    _fn_al(data: any) {
        this._fn_zo(data.row, data.col);
        this._fn_aaf(this.roomItemUIArr[data.row][data.col], true);
    }

    _fn_zx() {
        this._fn_zw();
        this._fn_yr();
    }

    _fn_nc() {
        this.close();
    }

    _fn_ze() {
        this.refreshHandLayer();
    }

    _fn_aj(propId: number) {
        UiLayerService.instance._fn_ahg(Const.Dialogs.NewItemLayer, propId);
    }

    _fn_ai() {
        this._fn_yz();
    }

    _fn_ak() {
        this._fn_zi();
    }

    _fn_ahl(roomItem: any, aniName: string) {
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
            this._fn_j(roomItem, pos.row, pos.col, 1, () => {

                let outItem = this.roomItemUIArr[pos.row][pos.col];
                this._fn_ahl(outItem, "5");
            });
        });
    }

    roomBubbleBurstRet(data: any) {
        UtilPub.log("roomBubbleBurstRet", data);
        let row = data.row;
        let col = data.col;
        let roomItem = this.roomItemUIArr[row][col];
        this._fn_zo(row, col);
        this._fn_ahd(roomItem);

        this._fn_da(row, col);
        if (this.choseRoomItem == roomItem) {
            this._fn_yv();
        }
        this._fn_zw();
        this._fn_q(Const.resPath.mergeSpine + "qipao/qipao", this.bubbleLayer, (err, aniCtrl: AnimationCtrl) => {
            UtilPub._fn_afg(aniCtrl.node, roomItem);
            aniCtrl.playAnimationOnce("3", () => {
                aniCtrl.node.destroy();
            })
        });
        AudioPlaybackService.instance._fn_xc(Const.Audio.bubbleBomb);
    }

    boardSlotSpawnRet(data: any) {
        UtilPub.log("boardSlotSpawnRet", data);
        let row = data.row;
        let col = data.col;
        let roomItem = this.roomItemUIArr[row][col];
        data.newPosArr.forEach((posArr: any) => {
            this._fn_j(roomItem, posArr[0], posArr[1], 1);
            if (mergeBoardStateStore._fn_qk(posArr[0], posArr[1])) {
                AudioPlaybackService.instance._fn_xc(Const.Audio.bubble);
            }
        });
        if (data.isAuto) {
            AudioPlaybackService.instance._fn_xc(Const.Audio.createProp);
        }
        this._fn_da(row, col);
        this._fn_zw();
    }









    _fn_j(roomItem: Node, row: number, col: number, aniType: number = 0, cb?: Function) {
        let moveRoomItem = instantiate(this.roomItem);
        moveRoomItem.active = true;
        moveRoomItem.parent = this.moveItemLayer;
        // @ts-ignore
        moveRoomItem.row = row;
        // @ts-ignore
        moveRoomItem.col = col;
        this._fn_zm(moveRoomItem, mergeBoardStateStore.roomArr[row][col]);
        let pos = UtilPub._fn_dp(roomItem);
        pos = UtilPub._fn_do(moveRoomItem, pos);
        moveRoomItem.position = pos;
        if (aniType == 1) {
            let targetRoomItem = this.roomItemUIArr[row][col];
            let targetPos = UtilPub._fn_do(moveRoomItem, UtilPub._fn_dp(targetRoomItem));
            let midPos = v3(0, 0, 0);
            let dis = UtilPub._fn_gu(pos, targetPos);
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
                this._fn_zo(row, col);
                if (cb) {
                    cb();
                }
            }).start();
        } else {
            this._fn_se(moveRoomItem, row, col, cb);
        }
    }







    _fn_i(propId: number, startWorldPos: Vec3, endWorldPos: Vec3, cb?: Function) {
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, propId);
        let moveItem = instantiate(this.moveItem);
        moveItem.active = true;
        moveItem.parent = this.moveItemLayer;
        this._fn_agl(find("icon", moveItem)?.getComponent(Sprite)!, Const.resPath.icon + propRow.icon);
        moveItem.addComponent(MovePath).startMove(startWorldPos, endWorldPos, 0.3, () => {
            moveItem.destroy();
            if (cb) {
                cb();
            }
        });
    }


    _fn_za() {
        this._fn_cx();
        if (!mergeBoardStateStore._fn_px()) {
            return;
        }
        let tmpObj: any = {};
        let idArr: any = [];

        let _fn_ait = (arr: any, isRemove: boolean = false) => {
            let tmpArr = [];
            for (let i in arr) {
                let tmpItem = arr[i];
                let tmpRoomData = this._fn_kf(tmpItem);
                if (!tmpRoomData.st) {
                    tmpArr.push(tmpItem);
                }
            }
            let retItem = UtilPub._fn_jv(tmpArr);
            if (retItem && isRemove) {
                let index = arr.indexOf(retItem);
                arr.splice(index, 1);
            }
            return retItem;
        };
        UtilPub._fn_ex(this.roomItemUIArr, (roomItem: any) => {
            let roomData = this._fn_kf(roomItem);
            let id = roomData.id;
            if (!id) {
                return;
            }
            if (mergeBoardStateStore._fn_qk(roomItem.row, roomItem.col)) {
                return;
            }
            let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, id);
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
            if (tmpObj[id].length >= 2 && _fn_ait(tmpObj[id]) && idArr.indexOf(id) == -1) {
                idArr.push(id);
            }
        });
        if (idArr.length > 0) {
            let id = UtilPub._fn_jv(idArr);
            let arr = tmpObj[id];

            let normalRoomItem = _fn_ait(arr, true);
            this._fn_ahf(normalRoomItem);
            this.roomItemMergeHintArr.push(normalRoomItem);

            let otherRoomItem = UtilPub._fn_jv(arr, true);
            this._fn_ahf(otherRoomItem);
            this.roomItemMergeHintArr.push(otherRoomItem);

        }
    }

    _fn_se(moveRoomItem: Node, row: number, col: number, cb?: Function) {
        let roomItem = this.roomItemUIArr[row][col];
        let wpos = UtilPub._fn_dp(roomItem);
        let pos = UtilPub._fn_do(moveRoomItem, wpos);
        tween(moveRoomItem).to(0.1, { position: pos }).call(() => {
            moveRoomItem.destroy();
            this._fn_zo(row, col);
            if (cb) {
                cb();
            }
        }).start();
    }

    _fn_ahd(node: Node) {
        if (!node) {
            return;
        }
        let roomData = this._fn_kf(node);
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

    _fn_ahe(node: Node) {
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

    _fn_ahf(node: Node) {
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

    _fn_cx() {
        this.roomItemMergeHintArr.forEach((node: Node) => {
            let iconNode = find("icon", node)!;
            iconNode.scale = v3(1, 1, 1);
            Tween.stopAllByTag(102, iconNode);
            // @ts-ignore
            delete node.mergeHintTween;
        });
        this.roomItemMergeHintArr = [];
    }

    _fn_ahm(node: Node) {

        // @ts-ignore
        if (node.mergeHintTween) {
            this._fn_aim(node);
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
    _fn_aim(node: Node) {
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

    _fn_yw() {
        if (!this.choseRoomItem) {
            return;
        }
        let roomData = this._fn_kf(this.choseRoomItem);
        if (!roomData.id) {
            return;
        }

        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, roomData.id);
        let row = this.choseRoomItem.row;
        let col = this.choseRoomItem.col;


        let timestamp = mergeBoardStateStore._fn_gm();
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
            let timeStr = UtilPub._fn_gw(dt);
            this._fn_ago(find("cd/time", this.btnCdOver), timeStr);
            let num = mergeBoardStateStore._fn_it(dt);
            this._fn_ago(find("num", this.btnCdOver), num);
        }


        if (mergeBoardStateStore._fn_qk(row, col) && roomData.cdBubble > 0) {
            this.btnBubbleGet.active = true;
            this.btnBubbleOver.active = true;
            let dt2 = roomData.cdBubble - timestamp;
            this._fn_ago(find("time", this.btnBubbleGet), UtilPub._fn_gw(dt2));
            this._fn_ago(find("num", this.btnBubbleGet), propRow.bubble);
            this.btnUnlock.active = false;
        } else {
            this.btnBubbleGet.active = false;
            this.btnBubbleOver.active = false;
            if (propRow.mdt == 1 && !roomData.unlock && !roomData.cdSum) {
                this.btnUnlock.active = true;
                this._fn_ago(find("time", this.btnUnlock)!, UtilPub._fn_gw(propRow.p1 * 1000));
            } else {
                this.btnUnlock.active = false;
            }
        }

        if (roomData.notSubCd) {
            this.btnCdOver.active = false;
        }

    }

    update(dt: number) {
        UtilPub._fn_ex(this.roomItemUIArr, (roomItem: Node) => {
            this._fn_zq(roomItem);
        });
        this._fn_yw();
    }


    _fn_ug(roomItem: any) {
        let row = roomItem.row;
        let col = roomItem.col;
        let roomData = this._fn_kf(roomItem);
        UtilPub.log("点击了房�?row:%d,col:%d".format(row, col), roomData);

        if (roomData.id == propIds.bag) {

            let obj = {
                row: row,
                col: col
            };
            UiLayerService.instance._fn_ahg(Const.Dialogs.BagLayer, obj);
            return;
        }

        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, roomData.id);

        if (mergeBoardStateStore._fn_qk(row, col)) {

            let aniCtrl = find("bubble", roomItem)!.getComponent(AnimationCtrl)!;
            aniCtrl.playAnimationOnce("2", () => {
                aniCtrl.playAnimation("1", true);
            });
            return;
        }

        if (mergeBoardStateStore._fn_qm(row, col)) {

            return;
        }

        if (propRow.clickAwardId > 0) {

            mergeBoardStateStore._fn_uf(row, col, UtilPub._fn_dp(roomItem));
            this._fn_aep(null);
            this._fn_zo(row, col);
            this._fn_zw();
            if (propRow.clickAwardId == propIds.coin) {
                AudioPlaybackService.instance._fn_xc(Const.Audio.clickCoin);
            }
            return;
        }

        if (propRow.mdt == 1 && !roomData.unlock) {

            mergeBoardStateStore._fn_um(row, col);
            this._fn_yv();
            return;
        }

        if (propRow.mdt == 2 || propRow.mdt == 5 || propRow.mdt == 11) {
            let ret = mergeBoardStateStore._fn_ty(row, col);
            this._fn_zo(row, col);
            this._fn_yv();
            if (propRow.mdt == 5) {
                ret.arr.forEach((info: any) => {
                    let tempRoomItem = this.roomItemUIArr[info.row][info.col];
                    this._fn_q(this.tbgxSpinePath, this.mergeFxLayer, (err: any, aniCtrl: AnimationCtrl) => {
                        UtilPub._fn_afg(aniCtrl.node, tempRoomItem);
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

        let emptyPos = mergeBoardStateStore._fn_gz();
        if (!emptyPos) {

            return;
        }

        if (roomData.times <= 0) {

            return;
        }

        if (!propRow.noPower && mergeBoardStateStore._fn_jp(propIds.power) <= 0 && mergeBoardStateStore._fn_fs() <= 0) {

            UiLayerService.instance._fn_ahg(Const.Dialogs.ShopPowerDialog);
            return;
        }


        mergeBoardStateStore._fn_uh(row, col, emptyPos.row, emptyPos.col);
        this._fn_j(roomItem, emptyPos.row, emptyPos.col, 1, () => {
            mergeBoardStateStore._fn_zl(emptyPos.row, emptyPos.col);
            this._fn_zw();
        });

        AudioPlaybackService.instance._fn_xc(Const.Audio.createProp);

        this._fn_zm(roomItem);
        roomData = this._fn_kf(roomItem);
        if (!roomData.id) {
            UtilPub.log("clicked item disappeared");
            this.choseRoomItem = null;
        }

    }

    _fn_cz() {
        this.sellData = null;
        this._fn_yv();
    }

    _fn_uc() {
        if (!this.choseRoomItem) {
            return;
        }
        let roomData = this._fn_kf(this.choseRoomItem);
        if (roomData.st == roomStatus.spider) {
            return;
        }
        mergeBoardStateStore._fn_wh(roomData.id);
    }

    _fn_ts(btn: Button) {
        if (!this.choseRoomItem) {
            return;
        }
        let row = this.choseRoomItem.row;
        let col = this.choseRoomItem.col;
        mergeBoardStateStore._fn_um(row, col);
        this._fn_zm(this.choseRoomItem);
        this._fn_yv();
    }

    _fn_tk() {
        AudioPlaybackService.instance._fn_xc(Const.Audio.sellBack);

        if (!this.choseRoomItem) {
            return;
        }

        let row = this.choseRoomItem.row;
        let col = this.choseRoomItem.col;
        let sellData = mergeBoardStateStore._fn_adj(row, col, UtilPub._fn_dp(this.choseRoomItem));
        if (!sellData) {
            return;
        }

        this.sellData = sellData;
        this._fn_aep(null);
        this._fn_zo(row, col);
        this._fn_zw();
        this._fn_za();
        this._fn_zr(row, col);

    }

    _fn_tl() {
        AudioPlaybackService.instance._fn_xc(Const.Audio.sellBack);

        let pos = mergeBoardStateStore.sellBack(this.sellData);
        if (!pos) {

            this._fn_yz();
            return;
        }
        let roomItem = this.roomItemUIArr[pos.row][pos.col];
        this._fn_aep(roomItem);
        this._fn_zm(roomItem);
        this._fn_ahd(roomItem);
        this._fn_cz();
        this._fn_zw();
        this._fn_za();
    }

    _fn_sx(btn: Button) {
        if (!this.choseRoomItem) {
            return;
        }
        let row = this.choseRoomItem.row;
        let col = this.choseRoomItem.col;
        // @ts-ignore
        let dt = btn.node.dt;
        // @ts-ignore
        let cdType = btn.node.cdType;
        mergeBoardStateStore._fn_acg(row, col, dt, cdType);
    }

    _fn_su() {
        if (!this.choseRoomItem) {
            return;
        }
        let row = this.choseRoomItem.row;
        let col = this.choseRoomItem.col;
        let isSuccess = mergeBoardStateStore._fn_acf(row, col);
        if (!isSuccess) {
            return;
        }
        this._fn_zm(this.choseRoomItem);
        this._fn_ahd(this.choseRoomItem);
        this._fn_zw();
    }

    _fn_sv() {
        if (!this.choseRoomItem) {
            return;
        }
        GamePlatform._fn_ahr("气泡免费跳过", (st) => {
            if (st == 1) {
                let row = this.choseRoomItem.row;
                let col = this.choseRoomItem.col;
                mergeBoardStateStore._fn_acd(row, col);
            }
        });
        return;
        ServerCtrJSF._fn_hp()._fn_aau(GameStorage._fn_rb(Const.MoneyKeys.MonthCharge));
    }

    _fn_aju() {
        let layout = this.taskLayer.getComponent(Layout)!;

        layout.enabled = false;
        layout.enabled = true;
    }

    _fn_uj(btn: Button) {
        // @ts-ignore
        let propRow = btn.node.propRow;
        mergeBoardStateStore._fn_wh(propRow.id);
    }

    _fn_uk(btn: Button) {
        // @ts-ignore
        let propRow = btn.node.propRow;
        mergeBoardStateStore._fn_wh(propRow.id);
    }

    _fn_tq(btn: Button) {
        let node = btn.node;
        // @ts-ignore
        let task1 = node.task;

        let arr = mergeBoardStateStore._fn_mh();
        for (let i = 0; i < arr.length; i++) {
            let TaskItemCellController = this.taskLayer.children[i];
            if (TaskItemCellController) {

                let btnTaskDone = find("btnTaskDone", TaskItemCellController)!;
                if (btnTaskDone) {
                    // @ts-ignore
                    let task2 = btnTaskDone.task;
                    if (task1.id == task2.id) {
                        this._fn_tp(btnTaskDone.getComponent(Button)!)
                        return true
                    }
                }
            }
        }
        return false
    }

    _fn_tp(btn: Button) {
        let handIndex = mergeBoardStateStore._fn_hj();
        if (handIndex == handIndexs.taskMittens) {
            mergeBoardStateStore._fn_e();
            this.refreshHandLayer();
        }

        AudioPlaybackService.instance._fn_xc(Const.Audio.taskDone);

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
        let subPropArr = mergeBoardStateStore.onClickTaskDone(task, UtilPub._fn_dp(find("award/icon", node.parent!)!));
        let bagInfo = mergeBoardStateStore._fn_ke();
        let TaskItemCellController = node.parent!;
        let worldPos = UtilPub._fn_dp(TaskItemCellController);
        let hasCb = false;
        let _fn_ais = () => {
            if (hasCb) {
                return;
            }
            hasCb = true;
            tween(TaskItemCellController).to(0.3, { scale: v3(0, 0, 1) }, {
                onUpdate: () => {
                    this._fn_aju();
                }
            }).call(() => {
                mergeBoardStateStore._fn_dw()
                this._fn_pf();
                this._fn_yr();
                this._fn_yy();
                this._fn_za();
                this.lastTaskArr = null;
            }).start();
        };
        for (let i in subPropArr) {
            let subProp = subPropArr[i];
            if (subProp.isBag) {
                let roomItem = this.roomItemUIArr[bagInfo.row][bagInfo.col];
                let startPos = UtilPub._fn_dp(roomItem);
                this._fn_i(subProp.id, startPos, worldPos, _fn_ais);
            } else {
                let roomItem = this.roomItemUIArr[subProp.row][subProp.col];
                let startPos = UtilPub._fn_dp(roomItem);
                this._fn_i(subProp.id, startPos, worldPos, _fn_ais);
                this._fn_zo(subProp.row, subProp.col);
            }
        }
        this._fn_yv();
        this._fn_yx();
    }

    _fn_ui(btn: Button) {
        let task = mergeBoardStateStore.taskArr[0];







        UiLayerService.instance._fn_ahg(Const.Dialogs.TaskListLayer);
    }

    _fn_tr() {
        UiLayerService.instance._fn_ahg(Const.Dialogs.TaskListLayer);
    }


    _fn_tu(btn: Button) {
        let emptyPos = mergeBoardStateStore._fn_tu();
        if (!emptyPos) {
            return;
        }
        let roomItem = this.roomItemUIArr[emptyPos.row][emptyPos.col];
        let roomData = this._fn_kf(roomItem);
        let ch = btn.node.children;
        let cardItem = ch[ch.length - 1];
        this._fn_i(roomData.id, UtilPub._fn_dp(cardItem), UtilPub._fn_dp(roomItem), () => {
            this._fn_zm(roomItem);
            this._fn_zw()
        });
        this._fn_yz();

        let handIndex = mergeBoardStateStore._fn_hj();
        if (handIndex == handIndexs.boardCardPanel) {
            mergeBoardStateStore._fn_e();
            mergeBoardStateStore._fn_df();
        }
    }


    onClickBtnBuild() {
        mergeBoardStateStore._fn_df();
        UiLayerService.instance._fn_ahg(Const.Dialogs.BuildListPanelController);
    }


    _fn_tg() {



        UiLayerService.instance._fn_ahg(Const.Dialogs.ManagerLayer);
    }


    _fn_tn() {













        if (playerDataStore.roleLv < 3) {
            this._fn_aiu("还未解锁商店")
            return
        }
        this._fn_cz();
        UiLayerService.instance._fn_ahg(Const.Dialogs.ShopSynthesisDialog);
        let handIndex = mergeBoardStateStore._fn_hj();
        if (handIndex == handIndexs.shopOpen) {
            mergeBoardStateStore._fn_e();
        }




















    }

    _fn_sz() {
        this.close();
    }

    _fn_ta() {
        mergeBoardStateStore._fn_eg();
        this.close();
    }

}

