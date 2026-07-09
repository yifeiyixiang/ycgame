import { Button, find, instantiate, Label, Node, Tween, tween, UIOpacity, v2, v3, Vec3, view } from "cc";
import { Const } from "../../config/Const";
import { GameStorageJSF } from "../../easyFramework/mgr/gameStorage";
import TableDataService from "../../easyFramework/other/tables";
import { UtilPub } from "../../easyFramework/utils/UtilPub";
import { GameCanvasController } from "../UI/canvas_game";
import { MergeBoardLayer } from "../UI/layer/MergeBoardLayer";
import { BuildListPanelController } from "../UI/main/build_list";
import { BuildListItemController } from "../UI/main/build_list_item";
import { BuildPromptDialogController } from "../UI/main/build_prompt";
import { FloatingStarController } from "../UI/main/float_star";
import { main } from "../UI/main/main";
import { SceneOperationPanelController } from "../UI/scene/scene_ui_ops";
import { mergeBoardStateStore } from "./mergeBoardModel";
import { UtilScene } from "./UtilScene";

enum AIRobotStatus {
    idle = 1,
    clickNew,
    boardMerge,
    taskDone,
    clcikBtnBuild,
    goBuild,
    clickStar,
    clickBuild,
    clickGou,
    enterMergeBoard,
};

class AIRobot {
    private static instance: AIRobot = null!;
    public static _fn_ho(): AIRobot {
        if (this.instance == null) {
            this.instance = new AIRobot();
        }
        return this.instance;
    }

    canvasGame: GameCanvasController = null!;
    updateInterval: any = null;

    aiRobotStatus: AIRobotStatus = AIRobotStatus.idle;

    clickPos: any = null;
    boardSearchId: any = 0;
    boardTargetId: any = 0;

    buildId: number = 0;
    starCost: number = 0;

    broadcastUINode: Node = null!;
    textLayer: Node = null!;
    textItem: Node = null!;

    public _fn_or() {
        this.canvasGame = find("Canvas")!.getComponent(GameCanvasController)!;
        this.broadcastUINode = find("Canvas2/broadcastLayer/ui")!;
        this.broadcastUINode.active = false;
        this.textLayer = find("pmd/textLayer", this.broadcastUINode)!;
        this.textItem = instantiate(this.textLayer.children[0]);
        this.textLayer.destroyAllChildren();

        if (!this.isRobot()) {
            return;
        }

        this.starCost = 0;

        this._fn_ain();

        this.canvasGame.schedule(aiRobot.update, 2);

        this.canvasGame.scheduleOnce(() => {
            aiRobot.aiRobotStatus = AIRobotStatus.enterMergeBoard;
        }, 3);

        this._fn_ahc();
    }

    public _fn_ain() {
        aiRobot.canvasGame.unschedule(aiRobot.update);
        aiRobot.aiRobotStatus = AIRobotStatus.idle;
    }

    public _fn_wf() {
        find("Canvas/main")?.getComponent(main)?.openMergeBoard();
        aiRobot.canvasGame.scheduleOnce(() => {
            aiRobot.clickPos = null;
            aiRobot.aiRobotStatus = AIRobotStatus.clickNew;
        }, 5);
    }

    public _fn_jo(id: number) {
        let num = 0;
        UtilPub._fn_ex(mergeBoardStateStore.roomArr, (roomData: any) => {
            if (roomData.id == id) {
                num++;
            }
        });
        return num;
    }

    public _fn_ng() {
        let task = mergeBoardStateStore.taskArr[0];
        if (aiRobot._fn_jo(task.propArr[0].id) > 0) {
            return true;
        }
        return false;
    }

    public _fn_ahc(info?: string) {
        if (!this.isRobot()) {
            return;
        }
        this.canvasGame.scheduleOnce(() => {
            let arr = ["微", "信", "搜", "索", "：", "肥", "宅", "打", "工", "人"];
            this.textLayer.destroyAllChildren();
            for (let i in arr) {
                let text = arr[i];
                let textItem = instantiate(this.textItem);
                textItem.parent = this.textLayer;
                textItem.getComponent(Label)!.string = text;
            }
            Tween.stopAllByTarget(this.broadcastUINode);
            this.broadcastUINode.active = true;
            let pos = this.broadcastUINode.position;
            let width = view.getVisibleSize().width;
            this.broadcastUINode.position = v3(width, pos.y);
            tween(this.broadcastUINode).to(1, { position: v3(0, pos.y) }).call(() => {
                let chs = this.textLayer.children;
                for (let i = 0; i < chs.length; i++) {
                    let ch = chs[i];
                    tween(ch).delay(1 + i * 0.1).by(0.1, { position: v3(0, 50) }).by(0.1, { position: v3(0, -50) }).delay(0.9).union().repeat(2).start();
                }
            }).delay(6).to(1, { position: v3(-width, pos.y) }).call(() => {
                this.broadcastUINode.active = false;
                this._fn_ahc();
            }).start();
        }, 5 + Math.random() * 5);
    }

    update() {
        try {
            aiRobot._fn_ajm();
        } catch (e) { }
    }

    _fn_ajm() {
        if (!aiRobot.isRobot()) {
            aiRobot._fn_ain();
            return;
        }
        switch (aiRobot.aiRobotStatus) {
            case AIRobotStatus.clickNew:
                if (aiRobot.clickPos == null) {
                    aiRobot.clickPos = aiRobot._fn_ge();
                }
                if (mergeBoardStateStore._fn_gz() && aiRobot.clickPos && !mergeBoardStateStore.roomArr[aiRobot.clickPos.row][aiRobot.clickPos.col].cdSum) {

                    aiRobot._fn_ao(aiRobot.clickPos.row, aiRobot.clickPos.col);
                    return;
                }

                let needId = mergeBoardStateStore.taskArr[0].propArr[0].id;
                aiRobot.boardTargetId = needId;
                aiRobot.aiRobotStatus = AIRobotStatus.boardMerge;
                break;
            case AIRobotStatus.boardMerge:
                if (aiRobot._fn_ng()) {
                    aiRobot.aiRobotStatus = AIRobotStatus.taskDone;
                    return;
                }
                let searchId = aiRobot.boardTargetId;
                let retInfo = null;
                while (true) {
                    searchId--;
                    if (!aiRobot._fn_qj(searchId, aiRobot.boardTargetId)) {
                        break;
                    }
                    if (aiRobot._fn_jo(searchId) >= 2) {
                        retInfo = aiRobot._fn_add(searchId);
                        break;
                    }
                }
                if (retInfo) {
                    aiRobot._fn_an(retInfo.startPos.row, retInfo.startPos.col,
                        retInfo.endPos.row, retInfo.endPos.col);
                } else {
                    aiRobot._fn_ain();
                }
                break;
            case AIRobotStatus.taskDone:
                aiRobot._fn_am();
                aiRobot.aiRobotStatus = AIRobotStatus.clcikBtnBuild;
                break;
            case AIRobotStatus.clcikBtnBuild:
                if (!UtilScene._fn_qt()) {

                    aiRobot.aiRobotStatus = AIRobotStatus.clickNew;
                    return;
                }
                aiRobot._fn_ap();
                aiRobot.aiRobotStatus = AIRobotStatus.goBuild;
                break;
            case AIRobotStatus.goBuild:
                let buildListItem = find("Canvas/build_list")!.getComponent(BuildListPanelController)!.buildListLayout.children[0].getComponent(BuildListItemController)!;
                buildListItem.onClickBtnGo();
                aiRobot.buildId = buildListItem.buildId;
                aiRobot.aiRobotStatus = AIRobotStatus.clickStar;
                break;
            case AIRobotStatus.clickStar:
                Const.FloatStarParent.children.forEach((node: Node) => {
                    let floatStar = node.getComponent(FloatingStarController)!;
                    UtilPub.log(floatStar.id, aiRobot.buildId);
                    if (floatStar.id == aiRobot.buildId) {
                        floatStar.onClickBtnPrompt();
                    }
                });
                aiRobot.aiRobotStatus = AIRobotStatus.idle;
                aiRobot.canvasGame.scheduleOnce(() => {
                    aiRobot.aiRobotStatus = AIRobotStatus.clickBuild;
                }, 2);
                break;
            case AIRobotStatus.clickBuild:
                find("Canvas/build_prompt")!.getComponent(BuildPromptDialogController)!.onClickBtnBuild();
                aiRobot.aiRobotStatus = AIRobotStatus.idle;
                aiRobot.canvasGame.scheduleOnce(() => {
                    aiRobot.aiRobotStatus = AIRobotStatus.clickGou;
                }, 3);
                break;
            case AIRobotStatus.clickGou:
                Const.SelBuildingParent.children[0].getComponent(SceneOperationPanelController)?.sureHandler();
                aiRobot.aiRobotStatus = AIRobotStatus.enterMergeBoard;
                break;
            case AIRobotStatus.enterMergeBoard:
                aiRobot.aiRobotStatus = AIRobotStatus.idle;
                aiRobot._fn_wf();
                break;
            case AIRobotStatus.idle:
                break;
            default:
                break;
        }
    }

    public _fn_ap() {
        let mergeBoardLayer = aiRobot._fn_es()!;
        mergeBoardLayer.onClickBtnBuild();
    }

    public _fn_am() {
        let mergeBoardLayer = aiRobot._fn_es()!;
        mergeBoardLayer._fn_tp(find("btnTaskDone", mergeBoardLayer.taskLayer.children[0])!.getComponent(Button)!);
    }

    public _fn_add(id: number) {
        let ret: any = null;
        let arr: any = [];
        UtilPub._fn_ex(mergeBoardStateStore.roomArr, (roomData: any, row: number, col: number) => {
            if (roomData.id == id) {
                arr.push({ row: row, col: col });
            }
        });
        if (arr.length >= 2) {
            ret = {};
            ret.startPos = UtilPub._fn_jv(arr, true);
            ret.endPos = UtilPub._fn_jv(arr, true);
        }
        return ret;
    }

    public _fn_ge() {
        let arr = [[0, 0], [0, 1], [0, 2]];
        let pArr: any = [];
        for (let i in arr) {
            let pos = arr[i];
            let row = pos[0];
            let col = pos[1];
            let roomData = mergeBoardStateStore.roomArr[row][col];
            if (roomData.cdSum) {
                continue;
            }
            pArr.push({ row: row, col: col });
        }
        if (pArr.length > 0) {
            return UtilPub._fn_jv(pArr);
        }
        return 0;
    }

    public _fn_ao(row: number, col: number) {
        let mergeBoardLayer = aiRobot._fn_es()!;
        let roomItem = mergeBoardLayer.roomItemUIArr[row][col];
        let touchEvent = aiRobot._fn_mq(roomItem);
        mergeBoardLayer.roomListTouchStart(touchEvent);
        mergeBoardLayer.roomListTouchEnd(touchEvent);
    }

    public _fn_an(startRow: number, startCol: number, endRow: number, endCol: number) {
        let mergeBoardLayer = aiRobot._fn_es()!;
        let startRoomItem = mergeBoardLayer.roomItemUIArr[startRow][startCol];
        let endRoomItem = mergeBoardLayer.roomItemUIArr[endRow][endCol];
        let touchEvent = aiRobot._fn_mq(startRoomItem);
        mergeBoardLayer.roomListTouchStart(touchEvent);
        let roomItem = instantiate(startRoomItem);
        roomItem.parent = startRoomItem.parent;
        roomItem.addComponent(UIOpacity).opacity = 0;

        let dis = Vec3.distance(startRoomItem.position, endRoomItem.position);
        let time = dis / 1000;
        if (time > 0.6) {
            time = 0.6;
        }
        tween(roomItem).to(time + Math.random() * 0.05, {
            position: endRoomItem.position.clone()
        }, {
            onUpdate(target, ratio) {
                let tEvent = aiRobot._fn_mq(roomItem);
                mergeBoardLayer.roomListTouchMove(tEvent);
            }
        }).call(() => {
            mergeBoardLayer.roomListTouchEnd(aiRobot._fn_mq(roomItem));
            roomItem.destroy();
        }).start();
    }

    public _fn_mq(node: Node) {
        let pos = UtilPub._fn_dp(node);
        let touchEvent: any = {};
        touchEvent.getUILocation = () => {
            return v2(pos.x, pos.y);
        };
        return touchEvent;
    }

    public _fn_dw() {
        let infoObj: any = {};
        UtilPub._fn_ex(mergeBoardStateStore.roomArr, (roomData: any, row: number, col: number) => {
            if (!mergeBoardStateStore._fn_qn(row, col)) {
                return;
            }
            let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, roomData.id);
            if (propRow.anc) {
                return;
            }
            if (!infoObj[roomData.id]) {
                infoObj[roomData.id] = [];
            }
            infoObj[roomData.id].push({ data: roomData, row: row, col: col });
        });

        let idArr: any = [];
        for (let i in infoObj) {
            let id = parseInt(i);
            let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, id);
            let arr = infoObj[i];
            if (arr.length < 2) {
                continue;
            }
            let addLv: any = [];
            if (arr.length >= 16) {
                addLv = [1, 2, 3, 4];
            } else if (arr.length >= 8) {
                addLv = [1, 2, 3];
            } else if (arr.length >= 4) {
                addLv = [1, 2];
            } else {
                addLv = [1];
            }
            for (let tmp in addLv) {
                let add = addLv[tmp];
                let id2 = id + add;
                if (aiRobot._fn_qj(propRow.id, id2)) {
                    idArr.push(id2);
                }
            }
        }
        if (idArr.length <= 0) {

            UtilPub._fn_ex(mergeBoardStateStore.roomArr, (roomData: any, row: number, col: number) => {
                if (!mergeBoardStateStore._fn_qn(row, col)) {
                    return;
                }
                let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, roomData.id);
                if (propRow.anc) {
                    return;
                }
                idArr.push(roomData.id);
            });
        }
        let retId = UtilPub._fn_jv(idArr);

        let starNum = 2;
        let rVal = Math.random();
        if (rVal > 0.8) {
            starNum = 4;
        } else if (rVal > 0.4) {
            starNum = 3;
        }
        return {
            propArr: [{ id: retId, num: 1 }],
            starNum: starNum
        };
    }

    public _fn_qj(id: number, id2: number) {
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, id);
        let tmpRow = TableDataService.ins()._fn_ly(Const.Tables.prop, id2);
        if (propRow && tmpRow && propRow.type == tmpRow.type && propRow.typeson == tmpRow.typeson) {
            return true;
        }
        return false;
    }

    public _fn_es(): MergeBoardLayer | null {
        let mergeBoardLayer = find("Canvas/MergeBoardLayer");
        if (mergeBoardLayer) {
            return mergeBoardLayer.getComponent(MergeBoardLayer);
        }
        return null;
    }

    public _fn_r(num: number) {
        if (aiRobot.isRobot()) {
            aiRobot.starCost += num;
            UtilPub.log("=====================", aiRobot.starCost, num);
            if (aiRobot.starCost >= 130) {
                aiRobot._fn_ain();
                UtilScene._fn_abw();
            }
        }
    }

    public isRobot() {
        return GameStorageJSF.ins.isRobot;
    }

}

const aiRobot = AIRobot._fn_ho();

export { aiRobot };

