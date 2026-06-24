import { _decorator, Component, Node, Vec3, v3, UITransform, tween, find, sp, Vec2, v2, Details, Asset, Texture2D, SpriteAtlas, SpriteFrame, Scene } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { GCurFace, GGuestState, GISceneItemParent, GSceneItemData, GSceneItemType, GSceneSkinState, GSpineAni } from '../../../config/global';
import { ResourceLoaderService } from '../../../easyFramework/mgr/resourceUtil';
import TableDataService from '../../../easyFramework/other/tables';
import AStar, { AStarNode } from '../../../easyFramework/utils/AStar';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { SceneData } from '../../comm/SceneData';
import { UtilScene } from '../../comm/UtilScene';
import { SceneItemBaseController } from './scene_item_parent';
import { playerDataStore } from '../../comm/UserData';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import { guest_mgr } from './guest_mgr';
const { ccclass, property } = _decorator;

@ccclass('guest')
export class guest extends SceneItemBaseController {

    type: GSceneItemType = GSceneItemType.guest
    itemSize: Vec2 = v2(2, 2)

    get spineAni() { return find("spineAni", this.node)!.getComponent(sp.Skeleton)! }
    get btn() { return find("btn", this.node)! }
    state: GGuestState = GGuestState.nothing
    targetPos: Vec3 = v3()
    speed: number = 0
    quickSpeed: number = 880 * Const.GuestSpeedTime
    private star = new AStar();
    path: AStarNode[] = []
    curGridPoint: Vec2 = v2(0, 0)
    targetPoint: Vec2 = v2(0, 0)
    isMoving: boolean = true
    isMovingEnd: boolean = true
    aniState: GSpineAni | string = null!
    aniScaleX: number = 1

    failCnt: number = 0
    maxFailCnt: number = 15
    calEnterRoomTime: number = 0

    guestData: any = null!
    sceneItemData: any = null!
    sceneNewItemNewSkinData: any = null!
    targetSceneItemScript: GISceneItemParent = null!

    calWorkTime: number = 0
    workTime: number = 30


    isSelOps: boolean = false
    calTimeForOps: number = 0
    calTimeWorkRest: number = 0

    poseRate: number = 3
    defaultSkin: string = "skin1"
    curSceneItemFace: number = 0
    isGodWealthShow: boolean = false


    maxRoomTime: number = 20
    toWorkRate: number = 50
    workTimeBaseVal: number = 30

    onLoad() {

        this.bindButton(this.btn, () => {
            UiLayerService.instance.showDialog(Const.Dialogs.GodWealthLayer)
        })
    }

    getOneGuest(guestId?: number) {
        let unlockGuestsData = UtilScene.getUnlockGuestData()
        if (unlockGuestsData.length == 0) {
            return false
        }
        let guestData = unlockGuestsData[UtilPub.ranInt(0, unlockGuestsData.length - 1)]
        if (guestId != null) {
            guestData = TableDataService.ins().getTableValueByID(Const.Tables.scene_guest, guestId)
        }
        let spineName = UtilScene.getResSpineIcon(guestData.sp)

        if (guestData.id == 88801) {
            let item = TableDataService.ins().getTableValueByID(Const.Tables.avatarStyle, playerDataStore.avatarLookId)
            if (item.type == 1) {
                spineName = UtilScene.getResSpineIcon(guestData.sp)
            } else {
                spineName = UtilScene.getResSpineIcon(guestData.sp2)
            }
        }

        ResourceLoaderService.loadResWithBundle(spineName, sp.SkeletonData, (err, skedata) => {
            if (err) {
                console.error("guest spine resource not found", guestData, err)
            }
            this.spineAni.skeletonData = skedata;

            this.spineAni.setSkin(this.defaultSkin)
            this.spineAni.setAnimation(0, GSpineAni.walk1, true);
        })

        this.guestData = guestData
        this.sceneNewItemNewSkinData = TableDataService.ins().getTableValueByID(Const.Tables.scene_skin, this.guestData.skin)
        this.sceneItemData = TableDataService.ins().getTableValueByID(Const.Tables.scene_item, this.sceneNewItemNewSkinData.scene)

        UtilPub.log("--增加客人ID--", guestId)

        return true
    }





    getIdleSceneItem() {

        let skinDataArr = TableDataService.ins().getTableValuesByType(Const.Tables.scene_skin, "prefab", this.sceneNewItemNewSkinData.prefab)

        if (this.guestData.id == 88001) {
            skinDataArr = []
            let skinAllDataArr = TableDataService.ins().getTableValuesByType(Const.Tables.scene_guest_ani, "guest", this.guestData.id)
            skinAllDataArr.forEach(row => {
                if ((row.skin + "").indexOf("10061") != -1) {
                    skinDataArr.push(TableDataService.ins().getTableValueByID(Const.Tables.scene_skin, row.skin))
                }
            })
        }

        let pickOne: GISceneItemParent = null!
        let map: Map<string, GISceneItemParent> = new Map()

        for (let i = 0; i < skinDataArr.length; i++) {
            let item = skinDataArr[i]

            if (SceneData.ins.getSceneSkinById(item.id) == GSceneSkinState.noGotted) {
                continue
            }
            let script: GISceneItemParent = UtilScene.getSceneItemNodeById(item.scene)!


            if (Const.IsShowOpsDialog == true && Const.SelSceneNode != null && UtilScene.getSceneNodeScript(Const.SelSceneNode).id == script.id) {

                continue
            }
            if (script != null && script.guestNode == null && SceneData.ins.getSceneSkinById(script.skin) == GSceneSkinState.gotted) {
                map.set(item.scene, script)
            }
        }
        if (map.size > 0) {
            let arr: string[] = []
            for (let key of map.keys()) {
                arr.push(key)
            }
            let k = arr[UtilPub.ranInt(0, arr.length - 1)]

            pickOne = map.get(k)!
        }

        this.targetSceneItemScript = pickOne
    }

    initGodWealth(state: GGuestState = GGuestState.streetWalk) {
        this.btn.active = true
        let res = this.getOneGuest(88014)
        this.state = state
        this.node.active = true
        this.scheduleOnce(() => {
            this.node.active = true
        }, 1)
        this.curGridPoint = this.getEmptyStreetTargetPoint()
        if (this.curGridPoint == null) {
            return
        }
        let pos = UtilScene.getBottomGridPos(this.curGridPoint.x, this.curGridPoint.y)
        this.node.worldPosition = this.node.parent!.getComponent(UITransform)!.convertToWorldSpaceAR(pos)
        this.calEnterRoomTime = -999999
        let val = 100 * Const.GuestSpeedTime
        this.speed = UtilPub.ranInt(Math.round(val * 0.8), Math.round(val * 1.5))
        Const.Guests.push(this.node)
    }

    init(state: GGuestState = GGuestState.subway) {

        this.btn.active = false
        let res = this.getOneGuest()

        if (res == false) {
            UtilPub.log("没有客人--------------")
            return
        }
        let val = 100 * Const.GuestSpeedTime
        this.speed = UtilPub.ranInt(Math.round(val * 0.8), Math.round(val * 1.5))


        if (this.guestData.id == 88801) {
            state = GGuestState.roomWalk
            this.node.parent = Const.ItemParent
        }
        this.state = state

        if (this.state == GGuestState.streetWalk) {
            this.node.parent = Const.StreetFixedNode
            this.curGridPoint = this.getEmptyStreetTargetPoint()
            let pos = UtilScene.getBottomGridPos(this.curGridPoint.x, this.curGridPoint.y)
            this.node.worldPosition = this.node.parent!.getComponent(UITransform)!.convertToWorldSpaceAR(pos)

        } else if (this.state == GGuestState.roomWalk) {
            this.node.parent = Const.ItemParent
            this.curGridPoint = this.getEmptyRoomTargetPoint()
            let pos = UtilScene.getBottomGridPos(this.curGridPoint.x, this.curGridPoint.y)
            this.node.worldPosition = this.node.parent!.getComponent(UITransform)!.convertToWorldSpaceAR(pos)

        } else if (this.state == GGuestState.subway) {
            this.node.parent = Const.StreetFixedNode
            this.node.worldPosition = Const.GuestStartPos.worldPosition
        }

        this.node.active = true
        this.calEnterRoomTime = 0
        Const.Guests.push(this.node)

    }

    setAniState(scaleX: number, aniState: GSpineAni | string, isLoop: boolean = true) {
        if (this.aniState != aniState) {
            this.aniState = aniState
            this.spineAni.setAnimation(0, aniState, isLoop);
        }
        if (this.node.scale.x != scaleX) {
            this.aniScaleX = scaleX
            this.node.scale = v3(scaleX, 1, 1)
        }

    }


    setSkin(aniDataL: any) {
        if (aniDataL.spineSkin == null) {
            this.spineAni.setSkin(this.defaultSkin)
        } else {
            UtilPub.log("@@@@------设置皮肤", aniDataL.skin, aniDataL.spineSkin)
            this.spineAni.setSkin(aniDataL.spineSkin)
        }
    }




    getEmptyStreetTargetPoint() {
        let idx = UtilPub.ranInt(0, UtilScene.streetEmptyGrids.length - 1)
        let p = UtilScene.streetEmptyGrids[idx]
        return p
    }





    getEmptyRoomTargetPoint() {
        let idx = UtilPub.ranInt(0, UtilScene.roomEmptyGrids.length - 1)
        let p = UtilScene.roomEmptyGrids[idx]
        return p
    }

    nextPosIsBlock(p: Vec2) {
        if (this.state == GGuestState.streetWalking) {
            return UtilScene.streetObstaclesMap.get(p.x + "," + p.y) != null
        } else if (this.state == GGuestState.roomWalking || this.state == GGuestState.backing) {
            return UtilScene.roomObstaclesMap.get(p.x + "," + p.y) != null
        }
    }

    getWalkTime() {
        return UtilPub.getDis2D(this.node.worldPosition, this.targetPos) / this.speed / Const.GuestSpeedTime
    }

    testRoomWayIsBlock() {

        if (UtilScene.roomObstaclesMap.get(UtilScene.roomDoorPos.x + "," + UtilScene.roomDoorPos.y) != null) {
            return true
        }

        let endPos = this.getEmptyRoomTargetPoint()
        this.star.init(v2(Const.MaxRoomX, Const.MaxRoomY), UtilScene.roomDoorPos, endPos, UtilScene.roomObstacles)
        this.star.run()
        this.path = this.star.getPath()
        this.isMoving = true

        if (this.path.length == 1 && this.path[0].x == endPos.x && this.path[0].y == endPos.y) {
            return true
        }
        return false
    }

    checkStandy() {

        if (this.state == GGuestState.subway) {
            this.state = GGuestState.subwaying
            this.node.parent = Const.StreetFixedNode
            this.node.worldPosition = Const.GuestStartPos.worldPosition

            this.curGridPoint = v2(UtilScene.subway.x, UtilScene.subway.y)
            let pos = UtilScene.getBottomGridPos(UtilScene.subway.x, UtilScene.subway.y)
            this.targetPos = this.node.parent!.getComponent(UITransform)!.convertToWorldSpaceAR(pos)

            this.spineAni.setAnimation(0, GSpineAni.walk1, true);
            this.aniTween.stop()

            this.aniTween = tween(this.node).to(this.getWalkTime(), { worldPosition: this.targetPos }).call(() => {

                this.state = GGuestState.streetWalk
            }).start()
        }
    }

    checkStreet() {
        if (this.state == GGuestState.streetWalk) {

            if (UtilPub.ranInt(0, 100) < 30 && this.guestData && this.guestData.id != 88014) {
                this.state = GGuestState.queueForRoomDoor

            } else if (this.curGridPoint) {

                this.node.parent = Const.StreetFixedNode

                this.targetPoint = this.getEmptyStreetTargetPoint()


                this.star.init(v2(Const.MaxStreetX, Const.MaxStreetY - 1), this.curGridPoint, this.targetPoint, UtilScene.streetObstacles)
                this.star.run()
                this.path = this.star.getPath()


                if (this.path.length == 1) {
                    if (this.guestData.id != 88014) this.failCnt += 1
                    this.state = GGuestState.streetWalk
                } else {
                    this.failCnt = 0
                    this.isMoving = false
                    this.isMovingEnd = true
                    this.state = GGuestState.streetWalking
                }
            }






        }
    }

    checkQueueApproachPath() {

        if (this.state == GGuestState.queueForRoomDoor) {
            this.aniTween.stop()
            this.node.parent = Const.StreetFixedNode




            this.star.init(v2(Const.MaxStreetX, Const.MaxStreetY), this.curGridPoint, this.targetPoint, UtilScene.streetObstacles)
            this.star.run()
            this.path = this.star.getPath()





            if (this.path.length == 1) {
                this.failCnt += 1
                this.state = GGuestState.queueForRoomDoor
            } else {
                this.failCnt = 0
                this.isMoving = false
                this.isMovingEnd = true
                this.state = GGuestState.pathingToRoomQueue

            }
        }
    }

    checkRoomWalk() {
        if (this.state == GGuestState.roomWalk) {

            if (this.calEnterRoomTime > this.maxRoomTime) {
                this.calEnterRoomTime = 0
                this.state = GGuestState.back
                UtilPub.log("-------选择离开----")
            } else if (UtilPub.ranInt(0, 100) < this.toWorkRate && this.calTimeWorkRest <= 0 && this.guestData.id != 88011 && this.guestData.id != 88801) {
                this.state = GGuestState.goToWork

            } else {
                let pos = UtilScene.getBottomGridPos(this.curGridPoint.x, this.curGridPoint.y)
                this.node.worldPosition = this.node.parent!.getComponent(UITransform)!.convertToWorldSpaceAR(pos)

                let endPoint = this.getEmptyRoomTargetPoint()
                this.star.init(v2(Const.MaxRoomX, Const.MaxRoomY), this.curGridPoint, endPoint, UtilScene.roomObstacles)
                this.star.run()
                this.path = this.star.getPath()






                if (this.path.length == 1) {
                    this.failCnt += 1
                    this.state = GGuestState.roomWalk
                } else {
                    this.failCnt = 0
                    this.isMoving = false
                    this.isMovingEnd = true
                    this.state = GGuestState.roomWalking
                }
            }
        }
    }

    checkBack() {
        if (this.state == GGuestState.back) {
            let endPoint = UtilScene.roomDoorPos
            this.star.init(v2(Const.MaxRoomX, Const.MaxRoomY), this.curGridPoint, endPoint, UtilScene.roomObstacles)
            this.star.run()
            this.path = this.star.getPath()






            if (this.path.length == 1) {
                this.failCnt += 1
                this.state = GGuestState.back


                if (this.failCnt > this.maxFailCnt / 3) {
                    this.state = GGuestState.roomWalk
                }
            } else {

                this.failCnt = 0
                this.isMoving = false
                this.isMovingEnd = true
                this.state = GGuestState.backing
            }
        }
    }





    getTargetRoundEmptyGrid() {
        let startPos = v2(this.targetSceneItemScript.curGridPoint.x - 1, this.targetSceneItemScript.curGridPoint.y - 1)
        let size = v2(this.targetSceneItemScript.itemSize.x + 1, this.targetSceneItemScript.itemSize.y + 1)
        for (let i = 0; i < size.x; i++) {
            for (let j = 0; j < size.y; j++) {
                let x = startPos.x + i
                let y = startPos.y + j
                if (UtilScene.roomEmptyGridsMap.get(x + "," + y) != null) {
                    return v2(x, y)
                }
            }
        }
        return null
    }

    checkToWork() {
        if (this.state == GGuestState.goToWork) {
            this.state = GGuestState.goToWorking
            this.getIdleSceneItem()

            if (this.targetSceneItemScript != null) {
                this.targetSceneItemScript.guestNode = this.node
                UtilPub.log("-------找到工作----", this.targetSceneItemScript)

                let endPoint = this.getTargetRoundEmptyGrid()
                if (endPoint == null) {

                    this.state = GGuestState.roomWalk
                    return
                }
                this.star.init(v2(Const.MaxRoomX, Const.MaxRoomY), this.curGridPoint, endPoint, UtilScene.roomObstacles)
                this.star.run()
                this.path = this.star.getPath()






                if (this.path.length == 1) {
                    this.failCnt += 1
                    this.state = GGuestState.goToWork
                    UtilPub.log("-------寻找工作失败----", this.failCnt)

                    if (this.failCnt < this.maxFailCnt / 3) {
                        this.state = GGuestState.roomWalk
                    }
                } else {
                    this.failCnt = 0
                    this.isMoving = false
                    this.isMovingEnd = true
                    this.state = GGuestState.goToWorking
                }

            } else {

                this.isMoving = false
                this.isMovingEnd = true
                this.state = GGuestState.roomWalk
            }
        }
    }

    ops(isUp: boolean) {
        this.isSelOps = isUp
    }

    setWorkingAni() {

        let selIconNode = this.targetSceneItemScript.node.getChildByName("icon" + this.targetSceneItemScript.curFace)!
        selIconNode.active = false

        let aniData = TableDataService.ins().getTableValuesByType2(Const.Tables.scene_guest_ani, "guest", this.guestData.id, "skin", this.targetSceneItemScript.skin + "")[0]


        let delta = v2(0, 0)

        this.setSkin(aniData)
        if (this.targetSceneItemScript.curFace == GCurFace.face1) {
            this.setAniState(-1, aniData.ani + "1", true)
            delta = v2(aniData.offset1[0], aniData.offset1[1])

        } else if (this.targetSceneItemScript.curFace == GCurFace.face2) {
            this.setAniState(1, aniData.ani + "1", true)
            delta = v2(aniData.offset2[0], aniData.offset2[1])

        } else if (this.targetSceneItemScript.curFace == GCurFace.face3) {
            this.setAniState(-1, aniData.ani + "2", true)
            delta = v2(aniData.offset3[0], aniData.offset3[1])

        } else if (this.targetSceneItemScript.curFace == GCurFace.face4) {
            this.setAniState(1, aniData.ani + "2", true)
            delta = v2(aniData.offset4[0], aniData.offset4[1])
        }

        this.node.parent = this.targetSceneItemScript.node
        this.node.worldPosition = selIconNode.worldPosition

        UtilPub.log("###-----设置偏移", this.targetSceneItemScript.id, this.targetSceneItemScript.curFace, delta)
        this.node.worldPosition = v3(this.node.worldPosition.x + delta.x, this.node.worldPosition.y + delta.y, this.node.worldPosition.z)
    }

    checkWork() {
        if (this.state == GGuestState.work) {
            this.state = GGuestState.working
            this.setWorkingAni()
        }
    }

    runPath() {

        if (this.path.length > 0 && this.isMoving == false && this.state % 2 == 0) {

            this.isMoving = true
            this.isMovingEnd = false


            let delay = 0
            let targetPoint = new AStarNode(this.curGridPoint.x, this.curGridPoint.y)

            if (UtilPub.ranInt(0, 100) < this.poseRate) {
                delay = 3
                if (UtilPub.ranInt(0, 100) < 50) {
                    this.setAniState(this.node.scale.x, GSpineAni.pose1, false)
                } else {
                    this.setAniState(this.node.scale.x, GSpineAni.pose2, false)
                }
                let pos = UtilScene.getBottomGridPos(targetPoint.x, targetPoint.y)
                this.targetPos = this.node.parent!.getComponent(UITransform)!.convertToWorldSpaceAR(pos)
            } else {
                targetPoint = this.path.pop()!



                if (this.nextPosIsBlock(v2(targetPoint.x, targetPoint.y))) {

                    this.path = []
                    this.isMoving = true

                    if (this.state == GGuestState.goToWorking) {
                        this.state = GGuestState.roomWalk
                    } else {




                        this.state = this.state - 1
                    }
                    this.failCnt += this.maxFailCnt

                    UtilPub.warn("!!!!!!-BlOCK---------", this.state, this.targetPoint.x, this.targetPoint.y)
                    return
                }

                let pos = UtilScene.getBottomGridPos(targetPoint.x, targetPoint.y)
                this.targetPos = this.node.parent!.getComponent(UITransform)!.convertToWorldSpaceAR(pos)





                let deltaX = this.curGridPoint.x - targetPoint.x
                let deltaY = this.curGridPoint.y - targetPoint.y

                if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {

                    UtilPub.error("-------异常情况直接飞过�?---", this.curGridPoint, "----终点--", this.targetPoint)
                    for (let i = 0; i < this.path.length; i++) {
                        UtilPub.error("-------路径是否错误----", this.path[i].x, ", ", this.path[i].y)
                    }
                    deltaX = 0
                    deltaY = 0
                    this.curGridPoint = v2(targetPoint.x, targetPoint.y)
                    let pos = UtilScene.getBottomGridPos(this.curGridPoint.x, this.curGridPoint.y)
                    this.node.worldPosition = this.node.parent!.getComponent(UITransform)!.convertToWorldSpaceAR(pos)
                }

                if (deltaX > 0 && deltaY == 0) {

                    this.setAniState(-1, GSpineAni.walk2, true)

                } else if (deltaX < 0 && deltaY == 0) {

                    this.setAniState(-1, GSpineAni.walk1, true)

                } else if (deltaX == 0 && deltaY < 0) {

                    this.spineAni.node.scale = v3(1, 1, 1)
                    this.setAniState(1, GSpineAni.walk1, true)

                } else if (deltaX == 0 && deltaY > 0) {

                    this.spineAni.node.scale = v3(1, 1, 1)
                    this.setAniState(1, GSpineAni.walk2, true)
                } else {


                }
            }


            this.aniTween.stop()

            if (delay == 0) {
                this.aniTween = tween(this.node).to(this.getWalkTime(), { worldPosition: this.targetPos }).call(() => {
                    this.runPathEnd(targetPoint)
                }).start()
            } else {
                this.aniTween = tween(this.node).to(this.getWalkTime(), { worldPosition: this.targetPos }).delay(delay / Const.GuestSpeedTime).call(() => {
                    this.runPathEnd(targetPoint)
                }).start()
            }

        }
    }

    runPathEnd(targetPoint: AStarNode) {
        this.targetPos = null!
        this.curGridPoint = v2(targetPoint.x, targetPoint.y)

        if (this.path.length == 0) {
            this.isMovingEnd = true
            this.isMoving = false

            if (this.state == GGuestState.streetWalking) {
                this.state = GGuestState.streetWalk
            } else if (this.state == GGuestState.pathingToRoomQueue) {

                this.setAniState(this.node.scale.x, GSpineAni.idle1, true)
                this.state = GGuestState.roomDoorStay
            } else if (this.state == GGuestState.roomWalking) {
                this.state = GGuestState.roomWalk
            } else if (this.state == GGuestState.goToWorking) {
                this.state = GGuestState.work
            } else if (this.state == GGuestState.backing) {

                this.leaveAway()
            }
        } else {
            this.isMoving = false
            this.runPath()
        }
    }

    leaveAway() {
        this.state = GGuestState.subway
        this.node.active = false
        this.emit(GD.event.guestLeave, this.node)
    }

    update(deltaTime: number) {
        this.calTime += deltaTime
        if (this.calTime > 0.3 / Const.GuestSpeedTime) {
            this.calTime = 0
            this.checkWork()
            this.checkToWork()
            this.checkBack()
            this.checkRoomWalk()
            this.checkStandy()
            this.checkStreet()
            if (this.isMovingEnd == true) this.runPath()

        }


        if (this.state == GGuestState.working) {
            if (this.targetSceneItemScript != null) {
                if (this.isSelOps) {
                    this.targetSceneItemScript.setFace(this.targetSceneItemScript.curFace)
                    this.spineAni.node.active = false
                } else {
                    let selIconNode = this.targetSceneItemScript.node.getChildByName("icon" + this.targetSceneItemScript.curFace)!
                    selIconNode.active = false
                    this.spineAni.node.active = true

                    if (this.curSceneItemFace != this.targetSceneItemScript.curFace) {
                        this.curSceneItemFace = this.targetSceneItemScript.curFace
                        this.setWorkingAni()
                        UtilPub.log("--------测试---")
                    }

                }
            }


            if (!this.isSelOps) {
                this.calWorkTime += deltaTime
            }
            if (this.calWorkTime > this.workTime) {
                this.workTime = UtilPub.ranInt(this.workTimeBaseVal * 0.7, this.workTimeBaseVal * 1.3)
                this.calWorkTime = 0
                this.targetSceneItemScript.guestNode = null!
                this.node.parent = Const.ItemParent

                let curPos = this.getTargetRoundEmptyGrid()
                if (curPos == null) {
                    this.leaveAway()
                    UtilPub.log("-----被强制离开", this.targetSceneItemScript.node)
                } else {
                    this.state = GGuestState.roomWalk
                    this.curGridPoint = curPos
                    let pos = UtilScene.getBottomGridPos(this.curGridPoint.x, this.curGridPoint.y)
                    this.node.worldPosition = this.node.parent!.getComponent(UITransform)!.convertToWorldSpaceAR(pos)
                    this.setAniState(this.node.scale.x, GSpineAni.idle1, false)
                }

                this.targetSceneItemScript.setFace(this.targetSceneItemScript.curFace)
                this.spineAni.node.active = true
                this.calTimeWorkRest = 10

                this.targetSceneItemScript = null!
            }

        } else {
            this.calTimeWorkRest -= deltaTime
        }

    }
}


