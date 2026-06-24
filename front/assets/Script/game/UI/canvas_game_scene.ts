import { Camera, EventMouse, EventTouch, find, Input, Node, Prefab, tween, UITransform, v2, v3, Vec2, Vec3, view, _decorator } from 'cc';
import { Const } from '../../config/Const';
import GD from '../../config/GD';
import { GBuildType, GIGridData, GLockState, GSceneItemType, GSceneRoomState, GTouchState } from '../../config/global';
import { BaseUiComponent } from '../../easyFramework/mgr/comm';
import { NodePoolService } from '../../easyFramework/mgr/poolManager';
import { UiLayerService } from '../../easyFramework/mgr/uiManager';
import TableDataService from '../../easyFramework/other/tables';
import { UtilPub } from '../../easyFramework/utils/UtilPub';
import { mergeBoardStateStore } from '../comm/mergeBoardModel';
import { SceneData } from '../comm/SceneData';
import { playerDataStore } from '../comm/UserData';
import { UtilScene } from '../comm/UtilScene';
import { handIndexs, sceneBuildIds } from '../data/handData';
import { FloatingStarController } from './main/float_star';
import { SceneOperationPanelController } from './scene/scene_ui_ops';
const { ccclass, property } = _decorator;

@ccclass('canvas_game_scene')
export class SceneCanvasController extends BaseUiComponent {

    get SceneCameraNode() { return find("SceneCamera", this.node)!.getComponent(Camera)! }
    get SceneBottom() { return find("SceneBottom", this.node)! }
    get SceneObjs() { return find("SceneObjs", this.node)! }
    get WallFixedNode() { return find("SceneObjs/buildingParent/wall", this.node)! }
    get StreetFixedNode() { return find("SceneObjs/buildingParent/street", this.node)! }
    get FloorFixedNode() { return find("SceneObjs/buildingParent/floor", this.node)! }
    get ShadowGridParent() { return find("SceneObjs/shadowGridParent", this.node)! }
    get ShadowWallParent() { return find("SceneObjs/shadowWallParent", this.node)! }
    get GridParent() { return find("SceneObjs/gridParent", this.node)! }
    get WallGridParent() { return find("SceneObjs/wallGridParent", this.node)! }
    get LightParent() { return find("SceneObjs/lightParent", this.node)! }
    get PendantParent() { return find("SceneObjs/buildingParent/pendant", this.node)! }
    get ItemParent() { return find("SceneObjs/buildingParent/item", this.node)! }
    get CarpetParent() { return find("SceneObjs/buildingParent/carpet", this.node)! }
    get SelBuildingParent() { return find("SceneObjs/selBuildingParent", this.node)! }
    get FloatStarParent() { return find("SceneObjs/floatStarParent", this.node)! }


    get GuestStartPos() { return find("SceneObjs/guestStartPos", this.node)! }

    buildingNode: Node = null!
    player: Node = null!
    dir: Vec3 = null!
    dirOps: Vec3 = null!

    oriPos: Vec3 = v3(0, 0, 0)
    startPos1: Vec2 = null!
    startPos2: Vec2 = null!
    pointsDis: number = 0
    rate: number = 1


    borderRrthoHeightMinY: number = 3100
    borderRrthoHeightMinX: number = 3381

    borderRrthoHeightMaxY: number = 600
    borderRrthoHeightMaxX: number = 2230

    oriRate: number = 0.46


    touchState: GTouchState = GTouchState.noYet
    isActiveTouchMove: boolean = false


    gridParentOriPos: Vec3 = v3(11, 1706)
    room1Pos: Vec2 = v2(0, 20)


    touchWorldPos: Vec3 = v3(0, 0, 0)
    arrow: Node = null!
    ops: Node = null!
    selItemNode: Node = null!
    idx: number = 0

    calTimeForFloatStar: number = -1
    starNodes: Node[] = []

    scaleArr: number[] = [500, 525, 551, 608, 638, 704, 815, 856, 989, 1028]

    onLoad() {

        this.on(GD.event.chgGreenStar, this.chgGreenStar, this)
        this.on(GD.event.goToBuildScene, this.goToBuildScene, this)
        this.on(GD.event.cancelOps, this.cancelOps, this)
        this.on(GD.event.sureOps, this.sureOps, this)
        this.on(GD.event.clickDressItem, this.clickDressItem, this)
        this.on(GD.event.popOpsWindow, this.popOpsWindow, this)

        NodePoolService.instance.putNodeArr(Const.AllItems)
        Const.AllItems = []
        NodePoolService.instance.putNodeArr(Const.Guests)
        Const.Guests = []

        Const.CameraScene = this.SceneCameraNode
        Const.SceneNode = this.node
        Const.ShadowParent = this.ShadowGridParent
        Const.ShadowWallParent = this.ShadowWallParent
        Const.GridParent = this.GridParent
        Const.WallGridParent = this.WallGridParent
        Const.ItemParent = this.ItemParent
        Const.CarpetParent = this.CarpetParent
        Const.CameraScene.orthoHeight = UtilScene.initVal
        Const.WallFixedNode = this.WallFixedNode
        Const.FloorFixedNode = this.FloorFixedNode
        Const.PendantParent = this.PendantParent
        Const.StreetFixedNode = this.StreetFixedNode
        Const.GuestStartPos = this.GuestStartPos
        Const.LightParent = this.LightParent
        Const.FloatStarParent = this.FloatStarParent
        Const.SelBuildingParent = this.SelBuildingParent;



        this.GridParent.position = this.gridParentOriPos
        this.ItemParent.position = this.gridParentOriPos
        this.CarpetParent.position = this.gridParentOriPos
        this.ShadowGridParent.position = this.gridParentOriPos


        UtilScene.initGridsData(this.GridParent.getComponent(UITransform)!, Const.MaxRoomY, Const.MaxRoomX)
        UtilScene.initGridsWallData(this.WallGridParent.getComponent(UITransform)!, Math.abs(Const.MaxWallXLeft), Math.abs(Const.MaxWallXRight))


        UtilPub.log("触摸事件绑定-------------")
        this.touchEvent()

        this.calTimeForFloatStar = -3000
    }

    start() {









        tween(this.SceneCameraNode.node).to(0.3, { position: v3(0, 1366, 1000) }).start()




        UtilScene.initRoom()
    }

    goToBuildScene(buildId: number, buildType: GBuildType) {

        let target: Node = null!
        if (buildType == GBuildType.room) {


            let itemData = TableDataService.ins().getTableValuesByType2(Const.Tables.scene_item, "room", buildId + "", "type", GSceneItemType.floor + "")[0]
            target = Const.FloorFixedNode.getChildByName("floor_" + itemData.id)!

        } else if (buildType == GBuildType.item) {

            for (let i = 0; i < Const.AllItems.length; i++) {
                let script = UtilScene.getSceneNodeScript(Const.AllItems[i])
                if (script.id == buildId) {
                    target = Const.AllItems[i]
                    break
                }
            }

        }

        if (target != null) {
            Const.CameraScene.orthoHeight = UtilScene.initVal
            this.aniTween.stop()
            let targtPos = v3(target.worldPosition.x, target.worldPosition.y, Const.CameraScene.node.worldPosition.z)

            this.aniTween = tween(Const.CameraScene.node).to(0.3, { worldPosition: targtPos }).call(() => {
                let handIndex = mergeBoardStateStore.getHandIndex();
                if (handIndex == handIndexs.buildCashDesk) {
                    let obj: any = {};
                    obj.id = handIndex;
                    obj.node = find("root", Const.FloatStarParent.children[0]);
                    obj.isScene = 1;
                    obj.delayTime = 0.2;
                    UiLayerService.instance.showDialog(Const.Dialogs.HandLayer, obj);
                } else if (handIndex == handIndexs.putCashDesk) {
                    this.popOpsWindow(UtilScene.getSceneItemNodeById(sceneBuildIds.cashDesk)!.node);
                }
            }).start()
        }

    }

    getBorderX() {
        const sceneCanvas = view.getVisibleSize();
        let gameWidthX = sceneCanvas.width;
        let gameHeightX = sceneCanvas.height;
        let delta = (gameWidthX / gameHeightX - this.oriRate) * 1100

        let rate = (Const.CameraScene.orthoHeight - UtilScene.minVal) / (UtilScene.maxVal - UtilScene.minVal)
        return this.borderRrthoHeightMinX - delta + rate * (this.borderRrthoHeightMaxX - this.borderRrthoHeightMinX)
    }

    getBorderY() {
        let rate = (Const.CameraScene.orthoHeight - UtilScene.minVal) / (UtilScene.maxVal - UtilScene.minVal)
        return this.borderRrthoHeightMinY + rate * (this.borderRrthoHeightMaxY - this.borderRrthoHeightMinY)
    }



    checkOutBorder(pos: Vec3) {

        if (pos.x >= this.getBorderX()) {
            pos.x = this.getBorderX()
        }
        if (pos.x <= -this.getBorderX()) {
            pos.x = -this.getBorderX()
        }
        if (pos.y >= this.getBorderY()) {
            pos.y = this.getBorderY()
        }
        if (pos.y <= -this.getBorderY()) {
            pos.y = -this.getBorderY()
        }
        this.SceneCameraNode.node.setPosition(pos)
    }

    isTouchBuilding(pos: Vec2) {
        if (this.isActiveTouchMove) {
            let script = UtilScene.getSceneNodeScript(this.selItemNode)
            if (UtilPub.insidePolygon(script.getPointsArr(), [pos.x, pos.y]) == true) {
                return { res: true, item: this.selItemNode }
            }

        } else {
            for (let i = 0; i < Const.AllItems.length; i++) {
                let item = Const.AllItems[i]
                let script = UtilScene.getSceneNodeScript(item)
                if (UtilPub.insidePolygon(script.getPointsArr(), [pos.x, pos.y]) == true) {
                    return { res: true, item: item }
                }
            }
        }

        return { res: false, item: null! }
    }

    clickDressItem(skinId: number) {

        UtilScene.getSceneNodeScript(this.selItemNode).switchIcon(skinId)
    }

    cancelOps() {
        this.isActiveTouchMove = false
        this.touchState = GTouchState.noYet
        NodePoolService.instance.putNode(this.ops)
        UtilScene.orderAllItems()
        UtilScene.orderSceneItemNodeChildren(Const.ItemParent)
    }

    sureOps() {
        this.isActiveTouchMove = false
        this.touchState = GTouchState.noYet
        let sceneItemScript = UtilScene.getSceneNodeScript(this.selItemNode)
        NodePoolService.instance.putNode(this.ops)

        if (sceneItemScript.type == GSceneItemType.pendant) {
            this.selItemNode.position = UtilScene.getWallGridPos(
                sceneItemScript.curGridPoint.x,
                sceneItemScript.curGridPoint.y
            )
        } else {
            this.selItemNode.position = UtilScene.getBottomGridPos(
                sceneItemScript.curGridPoint.x + Const.OriOffset.x,
                sceneItemScript.curGridPoint.y + Const.OriOffset.y
            )
        }
        if (sceneItemScript.type == GSceneItemType.carpet || sceneItemScript.type == GSceneItemType.item || sceneItemScript.type == GSceneItemType.pendant) {
            UtilScene.orderAllItems()
            UtilScene.orderSceneItemNodeChildren(Const.ItemParent)
            UtilScene.initAStarObstacles()
            UtilPub.log("--------确定按钮---", sceneItemScript.curGridPoint, this.selItemNode.parent)
        }
        SceneData.ins.setSceneItem(UtilScene.getSceneData(sceneItemScript))
    }

    touchStart(event: EventTouch) {




        let touches = event.getTouches();

        if (touches.length == 1) {
            this.calTime = 0
            let touchPos = event.getLocation()
            this.touchWorldPos = Const.CameraScene.screenToWorld(v3(touchPos.x, touchPos.y, 0))
            this.touchState = GTouchState.noYet


            let touchRes = this.isTouchBuilding(v2(this.touchWorldPos.x, this.touchWorldPos.y))



            if (touchRes.res == true) {
                if (this.isActiveTouchMove) {

                    if (this.selItemNode.uuid == touchRes.item.uuid) {
                        this.touchState = GTouchState.touchOpsArea
                    }
                } else {











                    this.selItemNode = touchRes.item
                    this.touchState = GTouchState.touchBuildingReady

                }
            } else {
                this.touchState = GTouchState.touchNewEmptyNewArea
            }

        } else if (touches.length == 2) {
            this.startPos1 = touches[0].getUILocation()
            this.startPos2 = touches[1].getUILocation()
            this.pointsDis = Vec2.distance(this.startPos1, this.startPos2)
        }
    }

    touchMove(event: EventTouch) {
        let touches = event.getTouches();

        if (touches.length == 1) {


            if (this.touchState == GTouchState.touchBuildingReady) {
                let ePos = event.getUIDelta()
                let rate = 1.8 * UtilScene.initVal / Const.CameraScene.orthoHeight
                let eFakePos = v2(Math.abs(ePos.x) < rate ? 0 : ePos.x, Math.abs(ePos.y) < rate ? 0 : ePos.y)
                if (eFakePos.x != 0 || eFakePos.y != 0) {
                    this.touchState = GTouchState.touchNewEmptyNewArea
                }
            }
            if (this.touchState == GTouchState.touchNewEmptyNewArea) {
                let ePos = event.getUIDelta()
                let pos = this.SceneCameraNode.node.position.clone()

                let rate = Const.CameraScene.orthoHeight / UtilScene.initVal
                this.SceneCameraNode.node.setPosition(v3(pos.x - ePos.x * rate, pos.y - ePos.y * rate, pos.z))
                this.checkOutBorder(this.SceneCameraNode.node.position)


            } else if (this.touchState == GTouchState.touchOpsArea) {

                let sceneItemScript = UtilScene.getSceneNodeScript(this.selItemNode)
                if (sceneItemScript.type == GSceneItemType.item || sceneItemScript.type == GSceneItemType.carpet) {

                    let touchPos = event.getLocation()
                    let touchWorldPos = Const.CameraScene.screenToWorld(v3(touchPos.x, touchPos.y, 0))
                    let min: GIGridData = null!
                    let mindis: number = 1000000
                    let idx: number = 0
                    let realX = 0
                    let realY = 0
                    UtilScene.gridData.forEach(item => {
                        if (item.wps.x - touchWorldPos.x < 60 && item.wps.y - touchWorldPos.y < 60) {
                            idx++
                            let dis = UtilPub.getDis2D(item.wps, touchWorldPos)
                            if (dis < mindis) {
                                mindis = dis
                                min = item
                            }
                        }
                    })

                    if (min != null) {
                        realX = min.point.x + Const.OriOffset.x
                        realY = min.point.y + Const.OriOffset.y


                        if (realX >= 0 && realX <= Const.MaxRoomX - sceneItemScript.itemSize.x) {
                            realX = realX
                        } else {
                            realX = sceneItemScript.curGridPoint.x
                        }

                        if (realY <= Const.MaxRoomY - sceneItemScript.itemSize.y && realY >= 0) {
                            realY = realY
                        } else {
                            realY = sceneItemScript.curGridPoint.y
                        }


                        if (realX != sceneItemScript.curGridPoint.x || realY != sceneItemScript.curGridPoint.y) {
                            let gridPos = UtilScene.getBottomGridPos(realX, realY)
                            let worldPos = this.GridParent.getComponent(UITransform)!.convertToWorldSpaceAR(gridPos)


                            this.ops.setWorldPosition(worldPos)
                            sceneItemScript.curGridPoint = v2(realX - Const.OriOffset.x, realY - Const.OriOffset.y)
                            this.ops.getComponent(SceneOperationPanelController)!.updShadowOrGrid(sceneItemScript)
                        }
                    }

                } else if (sceneItemScript.type == GSceneItemType.pendant) {

                    let touchPos = event.getLocation()
                    let touchWorldPos = Const.CameraScene.screenToWorld(v3(touchPos.x, touchPos.y, 0))
                    let min: GIGridData = null!
                    let mindis: number = 1000000
                    let idx: number = 0
                    let realX = 0
                    let realY = 0
                    UtilScene.gridWallData.forEach(item => {
                        if (item.wps.x - touchWorldPos.x < 60 && item.wps.y - touchWorldPos.y < 60) {
                            idx++
                            let dis = UtilPub.getDis2D(item.wps, touchWorldPos)
                            if (dis < mindis) {
                                mindis = dis
                                min = item
                            }
                        }
                    })

                    if (min != null) {
                        realX = min.point.x
                        realY = min.point.y

                        if (realX >= Const.MaxWallXLeft && realX <= Const.MaxWallXRight - sceneItemScript.itemSize.x) {
                            UtilPub.log("---距离检测1--", realX, Const.MaxWallXRight)
                            realX = realX
                        } else {
                            UtilPub.log("---距离检测2--", realX, Const.MaxWallXRight)
                            realX = sceneItemScript.curGridPoint.x
                        }


                        if (realY >= 0 && realY <= Const.MaxWallY - sceneItemScript.itemSize.y) {
                            realY = realY
                        } else {
                            realY = sceneItemScript.curGridPoint.y
                        }



                        if (sceneItemScript.curGridPoint.x >= 0 && realX < 0 && Math.abs(realX) < sceneItemScript.itemSize.x) {

                            realX = 0
                        } else if (sceneItemScript.curGridPoint.x < 0 && Math.abs(realX) < sceneItemScript.itemSize.x) {
                            realX = 0

                        }



                        UtilPub.log("---取消操作?--", realX, realY, sceneItemScript.curGridPoint)
                        if (realX != sceneItemScript.curGridPoint.x || realY != sceneItemScript.curGridPoint.y) {
                            let gridPos = UtilScene.getWallGridPos(realX, realY)
                            let worldPos = Const.ShadowWallParent.getComponent(UITransform)!.convertToWorldSpaceAR(gridPos)

                            UtilPub.log("@#########---UIDelta3-- 最新坐标", realX, realY, " --之前的坐标--", sceneItemScript.curGridPoint)
                            this.ops.setWorldPosition(worldPos)
                            sceneItemScript.curGridPoint = v2(realX, realY)
                            sceneItemScript.setPendantFace()
                            this.ops.getComponent(SceneOperationPanelController)!.updShadowOrGrid(sceneItemScript)
                        }

                    }
                } else {
                    let ePos = event.getUIDelta()
                    let pos = this.SceneCameraNode.node.position.clone()

                    let rate = Const.CameraScene.orthoHeight / UtilScene.initVal
                    this.SceneCameraNode.node.setPosition(v3(pos.x - ePos.x * rate, pos.y - ePos.y * rate, pos.z))
                    this.checkOutBorder(this.SceneCameraNode.node.position)
                }

            }

        } else if (touches.length == 2) {

            let touchPoint1 = touches[0].getUILocation()
            let touchPoint2 = touches[1].getUILocation()
            let newPointsDis = Vec2.distance(touchPoint1, touchPoint2)


            if (!this.pointsDis) {
                this.pointsDis = 0;
            }

            if (newPointsDis < this.pointsDis) {

                this.pointsDis = newPointsDis;


                Const.CameraScene.orthoHeight = Const.CameraScene.orthoHeight + 50
                if (Const.CameraScene.orthoHeight >= UtilScene.maxVal) {
                    Const.CameraScene.orthoHeight = UtilScene.maxVal
                }
                this.checkOutBorder(this.SceneCameraNode.node.position)

            } else if (newPointsDis > this.pointsDis) {

                this.pointsDis = newPointsDis;


                Const.CameraScene.orthoHeight = Const.CameraScene.orthoHeight - 50
                if (Const.CameraScene.orthoHeight <= UtilScene.minVal) {
                    Const.CameraScene.orthoHeight = UtilScene.minVal
                }
                this.checkOutBorder(this.SceneCameraNode.node.position)
            }


        }
    }


    touchEnd(event: EventTouch) {
        UtilPub.log("------touchEnd----")
        this.touchState = GTouchState.noYet
    }

    touchCancel(event: EventTouch) {
        UtilPub.log("------touchCancel----")
        this.touchState = GTouchState.noYet
    }

    onMouseWheel(event: EventMouse) {
        let scrollY = event.getScrollY();

        if (scrollY > 0) {
            Const.CameraScene.orthoHeight = Const.CameraScene.orthoHeight - 50
            if (Const.CameraScene.orthoHeight < UtilScene.minVal) {
                Const.CameraScene.orthoHeight = UtilScene.minVal
            }
        } else {
            Const.CameraScene.orthoHeight = Const.CameraScene.orthoHeight + 50
            if (Const.CameraScene.orthoHeight > UtilScene.maxVal) {
                Const.CameraScene.orthoHeight = UtilScene.maxVal
            }
        }


        this.checkOutBorder(this.SceneCameraNode.node.position)
    }

    onMouseDown(event: EventMouse) {

    }

    onMouseUp(event: EventMouse) {

    }

    public touchEvent() {
        this.offTouchEvent()
        this.SceneBottom.on(Input.EventType.TOUCH_START, this.touchStart, this)
        this.SceneBottom.on(Input.EventType.TOUCH_MOVE, this.touchMove, this)
        this.SceneBottom.on(Input.EventType.TOUCH_END, this.touchEnd, this)
        this.SceneBottom.on(Input.EventType.TOUCH_CANCEL, this.touchCancel, this)


        this.SceneBottom.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.SceneBottom.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        this.SceneBottom.on(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
    }

    public offTouchEvent() {
        this.SceneBottom.off(Input.EventType.TOUCH_START, this.touchStart, this);
        this.SceneBottom.off(Input.EventType.TOUCH_MOVE, this.touchMove, this);
        this.SceneBottom.off(Input.EventType.TOUCH_END, this.touchEnd, this);
        this.SceneBottom.off(Input.EventType.TOUCH_CANCEL, this.touchCancel, this);

        this.SceneBottom.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.SceneBottom.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        this.SceneBottom.off(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
    }


    setStarNode(itemData: any, p: Prefab) {
        let itemScript = UtilScene.getSceneItemNodeById(itemData.id)
        if (itemScript != null) {
            let starNode = NodePoolService.instance.getNode(p, Const.FloatStarParent)!
            starNode.getComponent(FloatingStarController)!.init(itemScript.id, GBuildType.item, itemScript.row.stars.split(",")[1])
            starNode.worldPosition = itemScript.node.worldPosition
            this.starNodes.push(starNode)
        }
    }

    chgGreenStar() {
        this.calTimeForFloatStar = -3
        NodePoolService.instance.putNodeArr(this.starNodes)
        Const.FloatStarParent.removeAllChildren()

        return;

        let roomRows = UtilScene.getNeedShowStarRooms()

        UtilPub.getPrefab(Const.Prefabs.FloatingStarController, (p: Prefab) => {
            roomRows.forEach((roomData: any) => {




                let floorData = TableDataService.ins().getTableValuesByType2(Const.Tables.scene_item, "type", "5", "room", roomData.id + "")[0]

                if (playerDataStore.roleLv >= roomData.lv) {
                    if (SceneData.ins.getRoomLockInfoById(roomData.id) == GSceneRoomState.locked) {

                        let starNode = NodePoolService.instance.getNode(p, Const.FloatStarParent)!

                        starNode.getComponent(FloatingStarController)!.init(floorData.id, GBuildType.room, roomData.stars.split(",")[1])
                        starNode.worldPosition = UtilScene.getFloorNodePos(floorData.id).worldPosition
                    } else {

                        let itemsData = UtilScene.getNeedShowStarSceneItems(roomData.id)
                        if (itemsData.length > 0) {

                            this.setStarNode(itemsData[0], p)
                        }
                        if (itemsData.length >= 2 && itemsData.length % 3 == 0) {

                            if (itemsData[1].order > 6) {
                                this.setStarNode(itemsData[1], p)
                            }
                        }
                    }
                }
            })

            let handIndex = mergeBoardStateStore.getHandIndex();
            if (handIndex == handIndexs.buildCashDesk
                || handIndex == handIndexs.putCashDesk
            ) {
                this.goToBuildScene(sceneBuildIds.cashDesk, GBuildType.item);
            }
        })
    }

    popOpsWindow(selItemNode: Node) {
        if (this.SelBuildingParent.children.length > 0) {
            return;
        }
        this.touchState = GTouchState.touchNewBuildingNewAlready
        this.isActiveTouchMove = true
        this.popSelectLayer(selItemNode)
    }

    popSelectLayer(selItemNode: Node) {
        this.selItemNode = selItemNode;
        UtilPub.getPrefab(Const.Prefabs.SceneOperationPanelController, (p: Prefab) => {
            this.ops = NodePoolService.instance.getNode(p, this.SelBuildingParent)!
            this.ops.worldPosition = v3(selItemNode.worldPosition.x, selItemNode.worldPosition.y + 100, 0)

            let itemScript = UtilScene.getSceneNodeScript(selItemNode)
            Const.SelSceneNode = selItemNode

            this.ops.getComponent(SceneOperationPanelController)!.initParam(itemScript, selItemNode.getComponent(UITransform)!.height, selItemNode)
            itemScript.flashForever(true)
        })
    }

    update(dt: number) {
        if (this.touchState == GTouchState.touchBuildingReady) {

            this.calTime += dt
            if (this.calTime >= 0.2) {
                this.touchState = GTouchState.touchBuildingArrow


                UtilPub.getPrefab(Const.Prefabs.SceneArrowIndicatorController, (p: Prefab) => {
                    this.arrow = NodePoolService.instance.getNode(p, this.SelBuildingParent)!


                    let script = UtilScene.getSceneNodeScript(this.selItemNode)
                    this.arrow.worldPosition = script.getCurIconNode().worldPosition
                })
            }

        } else if (this.touchState == GTouchState.touchBuildingArrow) {
            this.calTime += dt
            if (this.calTime >= 0.7) {
                this.touchState = GTouchState.touchNewBuildingNewAlready



                let script = UtilScene.getSceneNodeScript(this.selItemNode)
                let sData = SceneData.ins.getSceneItemById(script.id, script.type)!

                if (sData.lockState == GLockState.locked) {
                    this.emit(GD.event.showTip, { msg: "该装饰暂未解锁" })
                    this.touchState = GTouchState.noYet
                    let itemScript = UtilScene.getSceneNodeScript(this.selItemNode)
                    itemScript.flashOnce()
                } else {
                    this.touchState = GTouchState.touchNewBuildingNewAlready
                    this.isActiveTouchMove = true


                    NodePoolService.instance.putNode(this.arrow)
                    this.popSelectLayer(this.selItemNode);
                }
            }

        } else if (this.touchState == GTouchState.noYet) {
            NodePoolService.instance.putNode(this.arrow)
            this.touchState = GTouchState.touchNewBuildingNewAlready
        }

        this.calTimeForFloatStar += dt
        if (this.calTimeForFloatStar > 2) {
            this.calTimeForFloatStar = 0

        }
    }

}
