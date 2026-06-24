import { find, Node, Prefab, Sprite, tween, UITransform, v2, v3, Vec2, Vec3, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { GCurFace, GFace, GGridType, GISceneItemParent, GSceneItemType, GSceneRoomState, GSceneSkinState } from '../../../config/global';
import { BaseUiComponent } from '../../../easyFramework/mgr/comm';
import { NodePoolService } from '../../../easyFramework/mgr/poolManager';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
import { SceneData } from '../../comm/SceneData';
import { UtilScene } from '../../comm/UtilScene';
import { handIndexs } from '../../data/handData';
import { grid } from './grid';
import { grid_wall } from './grid_wall';
import { guest } from './guest';
const { ccclass, property } = _decorator;

@ccclass('scene_ui_ops')
export class SceneOperationPanelController extends BaseUiComponent {

    private _oriPos: Vec3 = null!
    private _oriParent: Node = null!
    private _selItemNode: Node = null!
    private _oriCurPoint: Vec2 = v2()
    private _oriFace: GCurFace = null!
    private _selItemAttr: GISceneItemParent = null!
    private _isShowGrid: boolean = false
    private _oriSkin: number = 0

    private _targetHeight: number = 0
    private _face: GFace = GFace.face1
    get ops() { return find("ops", this.node)! }
    get item() { return find("item", this.node)! }
    get sure() { return find("ops/sure", this.node)! }
    get cancel() { return find("ops/cancel", this.node)! }
    get rotate() { return find("ops/rotate", this.node)! }
    get buy() { return find("ops/buy", this.node)! }


    shadowGrids: Node[] = []
    shadowGridsData: Map<string, number> = new Map<string, number>()

    start() {
        this.on(GD.event.cancelOpsHandler, this.cancelHandler)
        this.on(GD.event.clickDressItem, this.clickDressItem)
        this.bindButton(this.sure, this.sureHandler)
        this.bindButton(this.cancel, this.cancelHandler)
        this.bindButton(this.rotate, () => {
            if (this._face == GFace.face1) {
                return
            }

            let itemSize = v2(this._selItemAttr.itemSize.y, this._selItemAttr.itemSize.x)
            let checkRes = UtilScene.isBottomGridOutBorder(this._selItemAttr.curGridPoint.x, this._selItemAttr.curGridPoint.y, itemSize)

            if (checkRes.res == false) {
                this._selItemAttr.curGridPoint = v2(this._selItemAttr.curGridPoint.x - checkRes.offset.x, this._selItemAttr.curGridPoint.y - checkRes.offset.y)
                let gridPos = UtilScene.getBottomGridPos(this._selItemAttr.curGridPoint.x, this._selItemAttr.curGridPoint.y)
                let worldPos = Const.GridParent.getComponent(UITransform)!.convertToWorldSpaceAR(gridPos)
                this.node.worldPosition = worldPos
            }
            this._selItemAttr.rotateItem()
            UtilPub.log("====当前面", this._selItemAttr.curFace)
            this.updShadowOrGrid(this._selItemAttr)
        })

        this.bindButton(this.buy, () => {
            UiLayerService.instance.showDialog(Const.Dialogs.SceneSkinDetailController, { skinId: this._selItemAttr.skin })
        })
    }

    clickDressItem(skinId: number) {
        if (SceneData.ins.getSceneSkinById(skinId) == GSceneSkinState.noGotted) {
            this.buy.active = true
            this.sure.active = false
        } else {
            this.buy.active = false
            this.sure.active = true
        }
    }

    sureHandler() {
        if (this._selItemAttr.type == GSceneItemType.carpet || this._selItemAttr.type == GSceneItemType.item || this._selItemAttr.type == GSceneItemType.pendant) {
            if (this._isShowGrid) {
                return
            }
            this._selItemNode.parent = this._oriParent

            this.hideShadow()
        }

        if (mergeBoardStateStore.getHandIndex() == handIndexs.putCashDesk) {
            mergeBoardStateStore.closeHandLayer();
            mergeBoardStateStore.addHandIndex();
        } else if (mergeBoardStateStore.getHandIndex() == handIndexs.btnLvUp2) {
            mergeBoardStateStore.addHandIndex()
        }


        this._selItemAttr.guestNode && this._selItemAttr.guestNode.getComponent(guest)!.ops(false)
        this._selItemAttr.flashForever(false)
        this.emit(GD.event.sureOps)
        UiLayerService.instance.showDialog(Const.Dialogs.main)
        this.emit(GD.event.refreshHandLayer);
        Const.IsShowOpsDialog = false
        Const.FloatStarParent.active = true
    }

    cancelHandler() {
        if (this._selItemAttr.type == GSceneItemType.carpet || this._selItemAttr.type == GSceneItemType.item || this._selItemAttr.type == GSceneItemType.pendant) {
            this._selItemNode.parent = this._oriParent
            this._selItemNode.worldPosition = this._oriPos
            this._selItemAttr.curGridPoint = this._oriCurPoint
            this._selItemAttr.setFace(this._oriFace)
            this.hideShadow()
        }

        this._selItemAttr.guestNode && this._selItemAttr.guestNode.getComponent(guest)!.ops(false)
        this._selItemAttr.skin = this._oriSkin
        this._selItemAttr.switchIcon(this._oriSkin)
        this._selItemAttr.flashForever(false)
        this.emit(GD.event.cancelOps)
        UiLayerService.instance.showDialog(Const.Dialogs.main)
        Const.IsShowOpsDialog = false
        Const.FloatStarParent.active = true
    }

    initParam(selItemAttr: GISceneItemParent, targetHeight: number, selItemNode: Node) {
        this.buy.active = false
        this.sure.active = true
        Const.IsShowOpsDialog = true
        Const.FloatStarParent.active = false


        UiLayerService.instance.hideDialog(Const.Dialogs.main)


        UiLayerService.instance.showDialog(Const.Dialogs.SceneSkinPanelController, { selScript: selItemAttr })

        this._oriSkin = selItemAttr.skin
        this._face = selItemAttr.faceMax
        this._targetHeight = targetHeight

        if (selItemAttr.type == GSceneItemType.wall || selItemAttr.type == GSceneItemType.floor) {
            this._oriParent = selItemNode.parent!
            this._selItemNode = selItemNode
            this._oriCurPoint = v2(selItemAttr.curGridPoint.x, selItemAttr.curGridPoint.y)
            this._selItemAttr = selItemAttr
            this._oriFace = selItemAttr.curFace
            this.node.worldPosition = selItemNode.worldPosition
            this.ops.position = v3(0, -60, 0)

        } else {

            let offsety = 30
            if (selItemAttr.type == GSceneItemType.pendant) {
                let pos = UtilScene.getWallGridPos(selItemAttr.curGridPoint.x, selItemAttr.curGridPoint.y)
                this._oriPos = Const.ShadowWallParent.getComponent(UITransform)!.convertToWorldSpaceAR(pos).clone()
                offsety = 18
            } else {
                let pos = UtilScene.getBottomGridPos(selItemAttr.curGridPoint.x, selItemAttr.curGridPoint.y)
                this._oriPos = Const.GridParent.getComponent(UITransform)!.convertToWorldSpaceAR(pos).clone()
            }


            this._oriParent = selItemNode.parent!
            this._selItemNode = selItemNode
            this._oriCurPoint = v2(selItemAttr.curGridPoint.x, selItemAttr.curGridPoint.y)
            this._selItemAttr = selItemAttr
            this._oriFace = selItemAttr.curFace
            this.node.worldPosition = this._oriPos

            selItemNode.parent = this.item
            selItemNode.position = v3(0, offsety, 0)

            this.ops.position = v3(0, -this._targetHeight * 0.6, 0)

            this.getItemPointMap(UtilScene.getItemSize(selItemAttr.itemSize, selItemAttr.curFace), selItemAttr.curGridPoint)
            this.showShadow()
        }



        this.rotate.getComponent(Sprite)!.grayscale = (this._face == GFace.face1)


        this._selItemAttr.guestNode && this._selItemAttr.guestNode.getComponent(guest)!.ops(true)

        let handIndex = mergeBoardStateStore.getHandIndex();
        if (handIndex == handIndexs.putCashDesk) {
            let obj: any = {};
            obj.id = mergeBoardStateStore.getHandIndex();
            obj.node = this.sure;
            obj.referNode = this._selItemNode;
            obj.isScene = 1;
            obj.delayTime = 0.5;
            UiLayerService.instance.showDialog(Const.Dialogs.HandLayer, obj);
        }
    }


    updShadowOrGrid(selItemAttr: GISceneItemParent) {


        this.getItemPointMap(
            UtilScene.getItemSize(selItemAttr.itemSize, selItemAttr.curFace),
            UtilScene.getRealGridPoint(selItemAttr.curGridPoint)
        )


        this._isShowGrid = false
        if (selItemAttr.type == GSceneItemType.item || selItemAttr.type == GSceneItemType.carpet) {
            let node = Const.ItemParent
            if (selItemAttr.type == GSceneItemType.carpet) {
                node = Const.CarpetParent
            }
            node.children.forEach(item => {
                let script = UtilScene.getSceneNodeScript(item)
                if (script.type == GSceneItemType.item || script.type == GSceneItemType.carpet) {
                    for (let i = 0; i < script.itemSize.x; i++) {
                        for (let j = 0; j < script.itemSize.y; j++) {
                            let x = i + script.curGridPoint.x
                            let y = j + script.curGridPoint.y

                            if (this.shadowGridsData.get((x + Const.OriOffset.x) + "," + (y + Const.OriOffset.y)) == 0) {

                                this.shadowGridsData.set((x + Const.OriOffset.x) + "," + (y + Const.OriOffset.y), 1)
                                this._isShowGrid = true
                            }
                        }
                    }
                }
            })


            let roomRows = TableDataService.ins().getTableValuesByType(Const.Tables.scene_room, "type", "1")
            roomRows.forEach((row: any) => {

                if (SceneData.ins.getRoomLockInfoById(row.id) == GSceneRoomState.locked) {
                    let roomSize = v2(row.x, row.y)
                    let roomPoint = v2(row.offset[0], row.offset[1])
                    for (let i = 0; i < roomSize.x; i++) {
                        for (let j = 0; j < roomSize.y; j++) {
                            let x = i + roomPoint.x
                            let y = j + roomPoint.y

                            if (this.shadowGridsData.get((x) + "," + (y)) == 0) {
                                this.shadowGridsData.set((x) + "," + (y), 1)
                                this._isShowGrid = true
                            }
                        }
                    }
                }
            })

        } else if (selItemAttr.type == GSceneItemType.pendant) {
            Const.PendantParent.children.forEach(item => {
                let script = UtilScene.getSceneNodeScript(item)
                for (let i = 0; i < script.itemSize.x; i++) {
                    for (let j = 0; j < script.itemSize.y; j++) {
                        let x = i + script.curGridPoint.x
                        let y = j + script.curGridPoint.y

                        if (this.shadowGridsData.get((x) + "," + (y)) == 0) {

                            this.shadowGridsData.set((x) + "," + (y), 1)
                            this._isShowGrid = true
                        }
                    }
                }
            })


            let doorSize = v2(3, 6)
            let doorPoint = v2(12, 2)
            for (let i = 0; i < doorSize.x; i++) {
                for (let j = 0; j < doorSize.y; j++) {
                    let x = i + doorPoint.x
                    let y = j + doorPoint.y

                    if (this.shadowGridsData.get((x) + "," + (y)) == 0) {
                        this.shadowGridsData.set((x) + "," + (y), 1)
                        this._isShowGrid = true
                    }
                }
            }
        }

        if (this._isShowGrid) {
            this.showGrid()
        } else {
            this.showShadow()
        }

    }

    hideShadow() {

        NodePoolService.instance.putNodeArr(this.shadowGrids)
        this.shadowGrids = []

    }

    getItemPointMap(itemSize: Vec2, startPoint: Vec2) {
        this.shadowGridsData.clear()
        for (let i = 0; i < itemSize.x; i++) {
            for (let j = 0; j < itemSize.y; j++) {
                let x = i + startPoint.x
                let y = j + startPoint.y
                this.shadowGridsData.set((x + Const.OriOffset.x) + "," + (y + Const.OriOffset.y), 0)
            }
        }
    }

    showShadow() {

        NodePoolService.instance.putNodeArr(this.shadowGrids)
        this.shadowGrids = []
        if (this._selItemAttr.type == GSceneItemType.item || this._selItemAttr.type == GSceneItemType.carpet) {
            UtilPub.getPrefab(Const.Prefabs.grid, (p: Prefab) => {
                this.shadowGridsData.forEach((value: number, key: string) => {
                    let arr = key.split(",")
                    let x = Number(arr[0])
                    let y = Number(arr[1])
                    let item = NodePoolService.instance.getNode(p, Const.ShadowParent, true)!
                    item.getComponent(grid)!.init(x, y, GGridType.shadow)

                    item.scale = v3(1, 1, 1)
                    item.position = UtilScene.getBottomGridPos(x, y)
                    this.shadowGrids.push(item)
                })

            })

        } else if (this._selItemAttr.type == GSceneItemType.pendant) {
            UtilPub.getPrefab(Const.Prefabs.grid_wall, (p: Prefab) => {
                this.shadowGridsData.forEach((value: number, key: string) => {
                    let arr = key.split(",")
                    let x = Number(arr[0])
                    let y = Number(arr[1])
                    let item = NodePoolService.instance.getNode(p, Const.ShadowWallParent, true)!
                    item.getComponent(grid_wall)!.init(x, y, GGridType.shadow)

                    if (x < 0) {
                        item.scale = v3(-Math.abs(item.scale.x), item.scale.y, item.scale.z)
                    } else {
                        item.scale = v3(Math.abs(item.scale.x), item.scale.y, item.scale.z)
                    }
                    item.position = UtilScene.getWallGridPos(x, y)
                    this.shadowGrids.push(item)
                })

            })
        }

    }

    showGrid() {
        NodePoolService.instance.putNodeArr(this.shadowGrids)
        this.shadowGrids = []
        if (this._selItemAttr.type == GSceneItemType.item || this._selItemAttr.type == GSceneItemType.carpet) {
            UtilPub.getPrefab(Const.Prefabs.grid, (p: Prefab) => {
                this.shadowGridsData.forEach((value: number, key: string) => {
                    let arr = key.split(",")
                    let x = Number(arr[0])
                    let y = Number(arr[1])
                    let item = NodePoolService.instance.getNode(p, Const.GridParent, true)!
                    item.getComponent(grid)!.init(x, y, value == 1 ? GGridType.red : GGridType.green)

                    item.scale = v3(1, 1, 1)
                    item.position = UtilScene.getBottomGridPos(x, y)
                    this.shadowGrids.push(item)
                })

            })

        } else if (this._selItemAttr.type == GSceneItemType.pendant) {
            UtilPub.getPrefab(Const.Prefabs.grid_wall, (p: Prefab) => {
                this.shadowGridsData.forEach((value: number, key: string) => {
                    let arr = key.split(",")
                    let x = Number(arr[0])
                    let y = Number(arr[1])
                    let item = NodePoolService.instance.getNode(p, Const.WallGridParent, true)!
                    item.getComponent(grid_wall)!.init(x, y, value == 1 ? GGridType.red : GGridType.green)

                    if (x < 0) {
                        item.scale = v3(-Math.abs(item.scale.x), item.scale.y, item.scale.z)
                    } else {
                        item.scale = v3(Math.abs(item.scale.x), item.scale.y, item.scale.z)
                    }
                    item.position = UtilScene.getWallGridPos(x, y)
                    this.shadowGrids.push(item)
                })

            })
        }

    }

    onEnable() {
        this.aniTween.stop()
        this.ops.scale = v3(0.3, 0.3, 1,)
        this.aniTween = tween(this.ops).to(0.15, { scale: v3(1, 1, 1) }).start()
    }

}


