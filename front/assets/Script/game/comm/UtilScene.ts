import { _decorator, Node, v3, v2, Vec2, Vec3, UITransform, Prefab, Scene, tween, SpriteFrame, Sprite, director } from 'cc';
import { Const } from '../../config/Const';
import { GCurFace, GIGridData, GISceneItemParent, GLockState, GSceneItemData, GSceneItemType, GSceneRoomReceiveState, GSceneRoomState, GSceneSkinState, GStreetQueueFlag, GTypeStrNode } from '../../config/global';
import { BaseUiComponent } from '../../easyFramework/mgr/comm';
import { NodePoolService } from '../../easyFramework/mgr/poolManager';
import TableDataService from '../../easyFramework/other/tables';
import { UtilPub } from '../../easyFramework/utils/UtilPub';
import { grid } from '../UI/scene/grid';
import { grid_wall } from '../UI/scene/grid_wall';
import { guest_mgr } from '../UI/scene/guest_mgr';
import { SceneItemBaseController } from '../UI/scene/scene_item_parent';
import { SceneData } from './SceneData';
import { playerDataStore } from './UserData';
import GD from '../../config/GD';
import { Notifications } from '../../easyFramework/mgr/notifications';
import { guest } from '../UI/scene/guest';
import ServerCtrJSF from '../../easyFramework/network/ServerCtrJSF';
const { ccclass, property } = _decorator;




@ccclass('UtilScene')
export class UtilScene extends BaseUiComponent {
    public static restartGame() {
        Notifications.clear()
        ServerCtrJSF.GetInstance().isLoadAll = false
        ServerCtrJSF.GetInstance().isLogin = false
        Const.isGodWealthShow = false
        director.loadScene("loading")
    }


    public static maxVal: number = 3000
    public static minVal: number = 500
    public static initVal: number = 925
    public static ExpTimes: number = 5

    public static GuestMaxNum: Map<number, number> = new Map<number, number>()

    public static setSkinIcon(node: Sprite, skinData: any) {
        let icon = skinData.icon0
        if (icon == "") {
            icon = "icon_" + skinData.id
        }
        UtilPub.getPic(UtilScene.getResSceneIcon(icon), (sf: SpriteFrame) => {
            if (sf != null) {
                node.spriteFrame = sf
            } else {
                UtilPub.getPic(Const.resPath.defaultSceneIcons + "icon_default", (sf: SpriteFrame) => {
                    node.spriteFrame = sf
                })
            }
        })
    }

    public static hideDebugPoint1() {
        Const.FloorFixedNode.children.forEach((row) => {
            if (row.children.length > 0) {

                row.children[0].getChildByName("points1")!.active = false
            }
        })
        Const.WallFixedNode.children.forEach((row) => {
            if (row.children.length > 0) {

                row.children[0].getChildByName("points1")!.active = false
            }
        })
    }


    public static getResSceneIcon(path: string) {
        let reval = ""
        if (path.indexOf("|") == -1) {
            reval = Const.resPath.defaultSceneIcons + path
        } else {
            reval = path
        }

        return reval
    }


    public static getResPrefabIcon(path: string) {
        let reval = ""
        if (path.indexOf("|") == -1) {
            reval = Const.resPath.defaultScenePrefabs + path
        } else {
            reval = path
        }

        return reval
    }


    public static getResSpineIcon(path: string) {
        let reval = ""
        if (path.indexOf("|") == -1) {
            reval = Const.resPath.defaultGuestSpine + path
        } else {
            reval = path
        }

        return reval
    }





    public static setSceneItemAni(node: Node, cb?: Function) {
        let oriPos = node.position.clone()
        node.position = v3(oriPos.x, oriPos.y + 100, oriPos.z)
        tween(node)
            .to(0.1, { position: oriPos })
            .to(0.1, { position: v3(oriPos.x, oriPos.y + 50, oriPos.z) })
            .to(0.1, { position: oriPos })
            .to(0.1, { position: v3(oriPos.x, oriPos.y + 25, oriPos.z) })
            .to(0.1, { position: oriPos }).call(() => {
                cb && cb()
            }).start()
    }

    public static setGuestMaxNum() {
        let guestsData = TableDataService.ins().getTableValuesByType(Const.Tables.scene_guest, "eff", "1")
        guestsData.forEach((item) => {
            UtilScene.GuestMaxNum.set(item.id, UtilPub.ranInt(item.limit[0], item.limit[1]))
        })
    }





    public static getUnlockGuestData() {
        let guestsData = TableDataService.ins().getTableValuesByType(Const.Tables.scene_guest, "eff", "1")
        let unlockGuestsData: any = []
        guestsData.forEach((item) => {

            if (SceneData.ins.getSceneSkinById(item.skin) == GSceneSkinState.gotted) {

                let cur = UtilScene.getGuestCntById(item.id)
                let max = UtilScene.GuestMaxNum.get(item.id)!

                if (cur < max) {
                    unlockGuestsData.push(item)
                }
            }
        })
        return unlockGuestsData
    }

    public static getGuestCntById(guestId: number) {
        let cnt = 0
        Const.Guests.forEach(item => {
            let script = item.getComponent(guest)!
            if (script.guestData.id == guestId) {
                cnt += 1
            }
        })
        return cnt
    }

    private static getBuildStarCost(itemData: any) {
        let starParts = (itemData.stars + "").split(",")
        let starCost = Number(starParts.length > 1 ? starParts[1] : starParts[0])
        if (!isFinite(starCost) || starCost < 0) {
            return 0
        }
        return starCost
    }

    public static calcRoomCompletionRatio(roomId: number) {
        let roomItems = TableDataService.ins().getTableValuesByType2(Const.Tables.scene_item, "room", roomId + "", "eff", "1")
        let totalStar: number = 0
        let finishedStar: number = 0
        for (let i = 0; i < roomItems.length; i++) {
            let itemData = roomItems[i]
            let starCost = UtilScene.getBuildStarCost(itemData)
            totalStar += starCost
            let sceneItem = SceneData.ins.getSceneItemById(itemData.id, itemData.type)
            if (sceneItem && sceneItem.lockState == GLockState.unlock) {
                finishedStar += starCost
            }
        }
        if (totalStar <= 0) {
            return 0
        }
        return Math.min(1, finishedStar / totalStar)
    }






    public static getFloorNodeById(id: number) {
        let resScript: GISceneItemParent = null!
        for (let i = 0; i < Const.FloorFixedNode.children.length; i++) {
            let item = Const.FloorFixedNode.children[i].children[0]
            let script = UtilScene.getSceneNodeScript(item)
            if (script.id == id) {
                resScript = script
                break;
            }
        }
        return resScript
    }

    public static getFloorNodePos(id: number) {
        let floorNode: Node = null!
        for (let i = 0; i < Const.FloorFixedNode.children.length; i++) {
            let item = Const.FloorFixedNode.children[i]
            if (item.name.split("_")[1] == id + "") {
                floorNode = item
                break;
            }
        }
        return floorNode
    }






    public static getWallNodeById(id: number) {
        let resScript: GISceneItemParent = null!
        for (let i = 0; i < Const.WallFixedNode.children.length; i++) {
            let item = Const.WallFixedNode.children[i].children[0]
            let script = UtilScene.getSceneNodeScript(item)
            if (script.id == id) {
                resScript = script
                break;
            }
        }
        return resScript
    }


    public static isSceneItemCouldBeBuild() {
        let needShowRooms = UtilScene.getNeedShowStarRooms()
        for (let i = 0; i < needShowRooms.length; i++) {
            let roomId = needShowRooms[i].id
            let items = UtilScene.getNeedShowStarSceneItems(roomId)

            if (items.length > 0) {
                if (playerDataStore.greenStar >= items[0].stars.split(",")[1]) {
                    return true
                }
            }
        }
        return false
    }

    public static getNeedShowStarSceneItems(roomId: number) {
        let roomItems = TableDataService.ins().getTableValuesByType2(Const.Tables.scene_item, "room", roomId + "", "eff", "1")
        roomItems.sort((a, b) => {
            return a.order - b.order
        })


        let items: any = []
        for (let i = 0; i < roomItems.length; i++) {
            let itemData = roomItems[i]
            let script = SceneData.ins.getSceneItemById(itemData.id, itemData.type)!
            if (script != null) {
                if (script.lockState == GLockState.locked) {
                    items.push(itemData)
                }
            }
        }
        return items
    }





    public static getNeedShowStarRooms() {

        let roomRows = TableDataService.ins().getTableValuesByType(Const.Tables.scene_room, "type", "1")
        let needShowRooms: any = []
        for (let i = 0; i < roomRows.length; i++) {
            let row = roomRows[i]
            if (SceneData.ins.getRoomLockInfoById(row.id) == GSceneRoomState.unlock) {

                let items = UtilScene.getNeedShowStarSceneItems(row.id)
                if (items.length > 0 || SceneData.ins.getRoomReceiveInfoById(row.id) == GSceneRoomReceiveState.unReceive) {
                    needShowRooms.push(row)
                }
            } else {


                if (playerDataStore.roleLv >= row.lv) {
                    needShowRooms.push(row)
                    break
                }
            }
        }
        return needShowRooms
    }




    public static getSceneItemNodeById(sceneId: number): GISceneItemParent | undefined {
        let resScript: GISceneItemParent = null!
        for (let i = 0; i < Const.AllItems.length; i++) {
            let item = Const.AllItems[i]
            if (item == null) {
                continue
            }
            let script = UtilScene.getSceneNodeScript(item)
            if (script.id == sceneId) {
                resScript = script

                break;
            }
        }
        return resScript
    }

    public static exportAllItems() {
        let arr: Node[] = Object.assign([], Const.AllItems);
        arr.sort((a, b) => {
            let a1 = UtilScene.getSceneNodeScript(a)
            let b1 = UtilScene.getSceneNodeScript(b)
            return a1.id - b1.id
        })
        let s = ""
        arr.forEach(item => {
            let script = UtilScene.getSceneNodeScript(item)
            let skinData = TableDataService.ins().getTableValueByID(Const.Tables.scene_skin, script.skin)




            s += skinData.name + "," + script.skin + "," + script.id + "," + "[" + script.curGridPoint.x + "_" + script.curGridPoint.y + "]" + "," + script.curFace + "\n"

        })
        UtilPub.log(s)
    }



    public static roomEmptyGrids: Vec2[] = []
    public static roomEmptyGridsMap: Map<string, number> = new Map<string, number>();
    public static roomObstacles: Vec2[] = []
    public static roomObstaclesMap: Map<string, number> = new Map<string, number>();

    public static streetEmptyGrids: Vec2[] = []
    public static streetEmptyGridsMap: Map<string, number> = new Map<string, number>();
    public static streetObstacles: Vec2[] = []
    public static streetObstaclesMap: Map<string, number> = new Map<string, number>();

    public static subway: Vec2 = v2(11, 0);
    public static roomDoorPos: Vec2 = v2(12, 0);


    public static streetGrids: Map<string, number> = new Map<string, number>();

    public static grids: Map<string, number> = new Map<string, number>();

    public static wallGrids: Map<string, number> = new Map<string, number>();

    public static tmpGridsUI: Node[] = []

    public static initWallGrids() {
        let len = 24
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < 8; j++) {
                this.wallGrids.set(i + "," + j, 1)
            }
        }
        for (let i = 1; i < len + 1; i++) {
            for (let j = 0; j < 8; j++) {
                this.wallGrids.set(-i + "," + j, 1)
            }
        }
        this.genWallGrids(this.wallGrids)
    }

    public static genWallGrids(grids: Map<string, number>) {
        NodePoolService.instance.putNodeArr(this.tmpGridsUI)
        UtilPub.getPrefab(Const.Prefabs.grid_wall, (p: Prefab) => {
            grids.forEach((value: number, key: string) => {
                let arr = key.split(",")
                let x = Number(arr[0])
                let y = Number(arr[1])
                let item = NodePoolService.instance.getNode(p, Const.WallGridParent, true)!
                item.getComponent(grid_wall)!.init(x, y)
                UtilPub.log("-------日志--", x, -y)
                if (x < 0) {
                    item.scale = v3(-Math.abs(item.scale.x), item.scale.y, item.scale.z)
                    item.position = UtilScene.getWallGridPos(x, y)
                } else {
                    item.scale = v3(Math.abs(item.scale.x), item.scale.y, item.scale.z)
                    item.position = UtilScene.getWallGridPos(x, y)
                }
                this.tmpGridsUI.push(item)
            })


        })
    }

    public static initStreetGrids() {

        for (let i = 0; i < 88; i++) {
            for (let j = 0; j < 23; j++) {
                this.streetGrids.set(i + "," + j, 1)
            }
        }
        this.genStreetGrids(this.streetGrids)
    }

    public static genStreetGrids(streetGrids: Map<string, number>) {
        UtilPub.getPrefab(Const.Prefabs.grid, (p: Prefab) => {
            streetGrids.forEach((value: number, key: string) => {
                let arr = key.split(",")
                let x = Number(arr[0])
                let y = Number(arr[1])
                let item = NodePoolService.instance.getNode(p, Const.StreetFixedNode, true)!
                item.getComponent(grid)!.init(x, y)

                item.position = UtilScene.getBottomGridPos(x, y)
            })


        })
    }

    public static initBottomGrids() {

        for (let i = 0; i < Const.MaxRoomX; i++) {
            for (let j = 0; j < Const.MaxRoomY; j++) {
                this.grids.set(i + "," + j, 1)
            }
        }
        this.genBottomGrids(this.grids)
    }

    public static genBottomGrids(grids: Map<string, number>) {
        NodePoolService.instance.putNodeArr(this.tmpGridsUI)
        UtilPub.getPrefab(Const.Prefabs.grid, (p: Prefab) => {
            grids.forEach((value: number, key: string) => {
                let arr = key.split(",")
                let x = Number(arr[0])
                let y = Number(arr[1])
                let item = NodePoolService.instance.getNode(p, Const.GridParent, true)!
                item.getComponent(grid)!.init(x, y)

                item.position = UtilScene.getBottomGridPos(x, y)
                this.tmpGridsUI.push(item)
            })


        })
    }




    public static initAStarObstacles() {

        UtilScene.streetEmptyGrids = []
        UtilScene.streetEmptyGridsMap = new Map<string, number>()
        UtilScene.streetObstacles = []
        UtilScene.streetObstaclesMap = new Map<string, number>()
        UtilScene.roomObstacles = []
        UtilScene.roomObstaclesMap = new Map<string, number>()
        UtilScene.roomEmptyGrids = []
        UtilScene.roomEmptyGridsMap = new Map<string, number>()

        let tmp = new Map<string, number>()
        let tmpStreet = new Map<string, number>()

        Const.StreetFixedNode.children.forEach(item => {
            let script = UtilScene.getSceneNodeScript(item)
            if (script.type == GSceneItemType.street) {
                for (let i = 0; i < script.itemSize.x; i++) {
                    for (let j = 0; j < script.itemSize.y; j++) {
                        UtilScene.streetObstacles.push(v2(script.curGridPoint.x + i, script.curGridPoint.y + j))
                        UtilScene.streetObstaclesMap.set((script.curGridPoint.x + i) + "," + (script.curGridPoint.y + j), 1)
                    }
                }
            }
        })

        for (let i = 0; i < Const.MaxStreetX; i++) {
            for (let j = 0; j < Const.MaxStreetY; j++) {
                tmpStreet.set(i + "," + j, 1)
            }
        }

        for (let key of UtilScene.streetObstaclesMap.keys()) {
            let x = Number(key.split(",")[0])
            let y = Number(key.split(",")[1])
            UtilScene.streetObstacles.push(v2(x, y))

            if (tmpStreet.get(x + "," + y) != null) {
                tmpStreet.delete(x + "," + y)
            }
        }

        for (let key of tmpStreet.keys()) {
            let x = Number(key.split(",")[0])
            let y = Number(key.split(",")[1])
            UtilScene.streetEmptyGrids.push(v2(x, y))
            UtilScene.streetEmptyGridsMap.set(x + "," + y, 1)
        }



        Const.AllItems.forEach(item => {
            let script = UtilScene.getSceneNodeScript(item)
            if (script.type == GSceneItemType.item) {
                for (let i = 0; i < script.itemSize.x; i++) {
                    for (let j = 0; j < script.itemSize.y; j++) {

                        UtilScene.roomObstaclesMap.set((script.curGridPoint.x + i) + "," + (script.curGridPoint.y + j), 1)
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

                        UtilScene.roomObstaclesMap.set((x) + "," + (y), 1)





                    }
                }
            } else {
                let roomSize = v2(row.x, row.y)
                let roomPoint = v2(row.offset[0], row.offset[1])
                for (let i = 0; i < roomSize.x; i++) {
                    for (let j = 0; j < roomSize.y; j++) {
                        let x = i + roomPoint.x
                        let y = j + roomPoint.y



                        tmp.set((x) + "," + (y), 1)

                    }
                }
            }
        })




        for (let key of UtilScene.roomObstaclesMap.keys()) {
            let x = Number(key.split(",")[0])
            let y = Number(key.split(",")[1])
            UtilScene.roomObstacles.push(v2(x, y))

            if (tmp.get(x + "," + y) != null) {
                tmp.delete(x + "," + y)
            }
        }

        for (let key of tmp.keys()) {
            let x = Number(key.split(",")[0])
            let y = Number(key.split(",")[1])
            UtilScene.roomEmptyGrids.push(v2(x, y))
            UtilScene.roomEmptyGridsMap.set(x + "," + y, 1)
        }






    }





    public static getSceneNodeScript(node: Node) {
        let script = node.getComponent(node.name)!
        if (script == null) {
            script = node.getComponent(SceneItemBaseController)!
        }
        if (script == null) {
            UtilPub.error("场景脚本绑定错误，请修改----!!", node.name, node)
        }
        return script as unknown as GISceneItemParent
    }





    public static setSceneNodeScript(node: Node) {
        if (node.getComponent(node.name) == null) {
            try {
                node.addComponent(node.name)
            } catch (error) {

            }
        }
        if (node.getComponent(node.name) == null) {
            node.addComponent(SceneItemBaseController)
        }
    }

    public static orderAllItems() {


        Const.AllItems.sort((a, b) => {
            return UtilScene.getSortVal(a, b)
        })

        Const.AllItems.sort((a, b) => {
            let a1 = UtilScene.getSceneNodeScript(a)
            let b1 = UtilScene.getSceneNodeScript(b)
            return a1.type - b1.type;
        })

    }







    public static getGridBottomPoint(size: Vec2, curPoint: Vec2) {
        if (curPoint == null) {
            return v2(0, 0)
        }
        let xPlus = 1
        let yPlus = 1
        if (curPoint.x < 0) {
            xPlus = -1
        }
        if (curPoint.y < 0) {
            yPlus = -1
        }
        return v2(curPoint.x + xPlus * size.x / 2, curPoint.y + yPlus * size.y / 2)
    }




    public static getSortVal(a: Node, b: Node) {
        let a1 = UtilScene.getSceneNodeScript(a)
        let a1p = UtilScene.getGridBottomPoint(a1.itemSize, a1.curGridPoint)
        let b1 = UtilScene.getSceneNodeScript(b)
        let b1p = UtilScene.getGridBottomPoint(b1.itemSize, b1.curGridPoint)

        let s1 = a1.itemSize
        let s2 = b1.itemSize


        if (s1.x / s1.y >= 2.5 && s2.x / s2.y >= 2.5) {

            if (Math.abs(a1.curGridPoint.x - b1.curGridPoint.x) == 2 || Math.abs(a1.curGridPoint.x - b1.curGridPoint.x) == 3 || Math.abs(a1.curGridPoint.x - b1.curGridPoint.x) == 4) {
                let deltaX = a1.curGridPoint.x - b1.curGridPoint.x

                return (Math.abs(a1p.x - deltaX + a1p.y)) - (Math.abs(b1p.x + b1p.y));
            }
        }

        if (s1.y / s1.x >= 2.5 && s2.y / s2.x >= 2.5) {

            if (Math.abs(a1.curGridPoint.y - b1.curGridPoint.y) == 2 || Math.abs(a1.curGridPoint.y - b1.curGridPoint.y) == 3 || Math.abs(a1.curGridPoint.y - b1.curGridPoint.y) == 4) {
                let deltaY = a1.curGridPoint.y - b1.curGridPoint.y

                return (Math.abs(a1p.x + a1p.y)) - (Math.abs(b1p.x + b1p.y + deltaY));
            }
        }


        return (Math.abs(a1p.x + a1p.y)) - (Math.abs(b1p.x + b1p.y));
    }





    public static orderSceneItemNodeChildren(node: Node) {
        let arr: Node[] = []
        node.children.forEach((item) => {
            arr.push(item)
        })
        node.removeAllChildren()

        arr.sort((a, b) => {
            return UtilScene.getSortVal(a, b)
        })

        arr.forEach((item) => {
            node.addChild(item)
        })
    }

    public static getParentByType(type: GSceneItemType) {
        if (type == GSceneItemType.item) {
            return Const.ItemParent
        } else if (type == GSceneItemType.carpet) {
            return Const.CarpetParent
        } else if (type == GSceneItemType.pendant) {
            return Const.PendantParent
        } else if (type == GSceneItemType.wall) {
            return Const.WallFixedNode
        } else if (type == GSceneItemType.floor) {
            return Const.FloorFixedNode
        }
        return Const.ItemParent
    }


    public static isBottomGridOutBorder(realX: number, realY: number, itemSize: Vec2) {
        if (realX >= 0 && realX <= Const.MaxRoomX - itemSize.x && realY <= Const.MaxRoomY - itemSize.y && realY >= 0) {
            return { res: true, offset: v2() }
        } else {
            let offset = v2()

            if (realY > Const.MaxRoomY - itemSize.y) {
                offset.y = realY + itemSize.y - Const.MaxRoomY
            }

            if (realX > Const.MaxRoomX - itemSize.x) {
                offset.x = realX + itemSize.x - Const.MaxRoomX
            }
            return { res: false, offset: offset }
        }
    }

    public static getSceneData(script: GISceneItemParent) {
        return {
            id: script.id,
            pos: script.curGridPoint,
            curFace: script.curFace,
            lockState: script.lockState,
            curGridPoint: script.curGridPoint,
            type: script.type,
            skin: script.skin,
        }
    }





    public static getAllSceneData() {
        let dataObj: { [key: string]: GSceneItemData } = {}
        Const.ItemParent.children.forEach(item => {
            let script = UtilScene.getSceneNodeScript(item)
            dataObj[Const.DataKeys.sceneItem + script.id] = UtilScene.getSceneData(script)
        })
        Const.WallFixedNode.children.forEach(item => {
            let script = UtilScene.getSceneNodeScript(item)
            dataObj[Const.DataKeys.sceneWall + script.id] = UtilScene.getSceneData(script)
        })
        Const.FloorFixedNode.children.forEach(item => {
            let script = UtilScene.getSceneNodeScript(item)
            dataObj[Const.DataKeys.sceneFloor + script.id] = UtilScene.getSceneData(script)
        })
        Const.CarpetParent.children.forEach(item => {
            let script = UtilScene.getSceneNodeScript(item)
            dataObj[Const.DataKeys.sceneCarpet + script.id] = UtilScene.getSceneData(script)
        })
        Const.PendantParent.children.forEach(item => {
            let script = UtilScene.getSceneNodeScript(item)
            dataObj[Const.DataKeys.scenePendant + script.id] = UtilScene.getSceneData(script)
        })
        return dataObj
    }

    public static initRoomFinishFn() {
        UtilPub.log("-----触发房间加载结束===")
        UtilScene.hideDebugPoint1()
        UtilScene.orderAllItems()
        UtilScene.orderSceneItemNodeChildren(Const.ItemParent)

        if (SceneData.ins.isInitSceneData() == false) {

            SceneData.ins.setRoomLockInfoById(1001, GSceneRoomState.unlock)
            SceneData.ins.finishInitSceneData()
        }


        Const.SceneNode.getComponent(guest_mgr)!.init()
        Notifications.emit(GD.event.chgGreenStar)



    }


    public static setMaxWall() {

        Const.MaxWallXRight = 24
        Const.MaxWallXLeft = -24
        let rows = TableDataService.ins().getTableValuesByType(Const.Tables.scene_room, "type", "1")
        for (let i = 0; i < rows.length; i++) {
            if (SceneData.ins.getRoomLockInfoById(rows[i].id) == GSceneRoomState.unlock) {

                if (rows[i].wall == 1) {
                    Const.MaxWallXRight += rows[i].x
                } else if (rows[i].wall == -1) {
                    Const.MaxWallXLeft += rows[i].y * rows[i].wall
                }
            }
        }
        UtilScene.initGridsWallData(Const.WallGridParent.getComponent(UITransform)!, Math.abs(Const.MaxWallXLeft), Math.abs(Const.MaxWallXRight))


    }

    public static async initRoom() {

        let rows = TableDataService.ins().getTableValuesByType(Const.Tables.scene_room, "type", "1")

        for (let i = 0; i < rows.length; i++) {
            if (SceneData.ins.getRoomLockInfoById(rows[i].id) == GSceneRoomState.unlock) {

                await UtilScene.initRoomById(rows[i].id)
            }
        }














        this.initRoomFinishFn()
    }





    public static initRoomById(roomId: number) {
        return new Promise<void>((resolve, reject) => {


            let rows = TableDataService.ins().getTableValuesByType2(Const.Tables.scene_item, "eff", "1", "room", roomId + "")

            let idx = 0
            for (let i = 0; i < rows.length; i++) {
                let sceneItemSkin = TableDataService.ins().getTableValueByID(Const.Tables.scene_skin, rows[i].skin)




                if (rows[i].type == GSceneItemType.item || rows[i].type == GSceneItemType.carpet || rows[i].type == GSceneItemType.pendant) {
                    UtilPub.getPrefab(UtilScene.getResPrefabIcon(sceneItemSkin.prefab), (p: Prefab) => {

                        let item = NodePoolService.instance.getNode(p, UtilScene.getParentByType(rows[i].type)!)!
                        UtilScene.setSceneNodeScript(item)
                        let script = UtilScene.getSceneNodeScript(item)

                        script.initByConfigTable(rows[i])

                        let skinData = TableDataService.ins().getTableValueByID(Const.Tables.scene_skin, script.skin)
                        UtilPub.log("-----s加载资源2---", skinData.id, script.skin, skinData.name)

                        if (rows[i].type == GSceneItemType.pendant) {
                            item.position = UtilScene.getWallGridPos(script.curGridPoint.x, script.curGridPoint.y)
                        } else {
                            item.position = UtilScene.getBottomGridPos(script.curGridPoint.x + Const.OriOffset.x, script.curGridPoint.y + Const.OriOffset.y)
                        }

                        Const.AllItems.push(item)
                        idx++
                        if (idx >= rows.length) {
                            UtilScene.setMaxWall()
                            resolve()
                        }
                    })

                } else if (rows[i].type == GSceneItemType.floor) {
                    let parent = UtilScene.getParentByType(rows[i].type)!.getChildByName("floor_" + rows[i].id)!
                    NodePoolService.instance.putNodeArr(parent.children)

                    UtilPub.getPrefab(UtilScene.getResPrefabIcon(sceneItemSkin.prefab), (p: Prefab) => {
                        let item = NodePoolService.instance.getNode(p, parent)!
                        UtilScene.setSceneNodeScript(item)
                        let script = UtilScene.getSceneNodeScript(item)
                        script.initByConfigTable(rows[i])

                        item.position = v3(0, 0, 0)

                        Const.AllItems.push(item)
                        idx++
                        if (idx >= rows.length) {
                            UtilScene.setMaxWall()
                            resolve()

                        }
                    })

                } else if (rows[i].type == GSceneItemType.wall) {
                    let parent = UtilScene.getParentByType(rows[i].type)!.getChildByName("wall_" + rows[i].id)!
                    NodePoolService.instance.putNodeArr(parent.children)

                    console.log("-----设定墙壁的图片�?----", sceneItemSkin.prefab)
                    UtilPub.getPrefab(UtilScene.getResPrefabIcon(sceneItemSkin.prefab), (p: Prefab) => {
                        let item = NodePoolService.instance.getNode(p, parent)!
                        UtilScene.setSceneNodeScript(item)
                        let script = UtilScene.getSceneNodeScript(item)
                        script.initByConfigTable(rows[i])
                        UtilPub.log("-----寻找云端数据3---", script, SceneData.ins.getSceneItemById(script.id, script.type), rows[i])

                        item.position = v3(0, 0, 0)

                        Const.AllItems.push(item)
                        idx++
                        if (idx >= rows.length) {
                            UtilScene.setMaxWall()
                            resolve()

                        }
                    })
                }

            }
        })
    }

    public static initFloorById(sceneItemData: any) {
        return new Promise<void>((resolve, reject) => {
            let sceneItemSkin = TableDataService.ins().getTableValueByID(Const.Tables.scene_skin, sceneItemData.skin)
            let parent = UtilScene.getParentByType(sceneItemData.type)!.getChildByName("floor_" + sceneItemData.id)!
            NodePoolService.instance.putNodeArr(parent.children)

            UtilPub.getPrefab(UtilScene.getResPrefabIcon(sceneItemSkin.prefab), (p: Prefab) => {
                let item = NodePoolService.instance.getNode(p, parent)!
                UtilScene.setSceneNodeScript(item)
                let script = UtilScene.getSceneNodeScript(item)
                script.initByConfigTable(sceneItemData)

                item.position = v3(0, 0, 0)
                Const.AllItems.push(item)
                resolve()
            })
        })

    }

    public static initWallById(sceneItemData: any) {
        return new Promise<void>((resolve, reject) => {
            let sceneItemSkin = TableDataService.ins().getTableValueByID(Const.Tables.scene_skin, sceneItemData.skin)
            let parent = UtilScene.getParentByType(sceneItemData.type)!.getChildByName("wall_" + sceneItemData.id)!
            NodePoolService.instance.putNodeArr(parent.children)

            UtilPub.getPrefab(UtilScene.getResPrefabIcon(sceneItemSkin.prefab), (p: Prefab) => {
                let item = NodePoolService.instance.getNode(p, parent)!
                UtilScene.setSceneNodeScript(item)
                let script = UtilScene.getSceneNodeScript(item)
                script.initByConfigTable(sceneItemData)

                item.position = v3(0, 0, 0)
                Const.AllItems.push(item)
                resolve()
            })
        })

    }




    public static getItemSize(size: Vec2, curFace: GCurFace): Vec2 {
        if (curFace == GCurFace.face2 || curFace == GCurFace.face4) {
            return v2(size.x, size.y)
        }
        return size
    }

    public static getRealGridPoint(size: Vec2): Vec2 {
        return v2(size.x + Const.OriOffset.x, size.y + Const.OriOffset.y)
    }


    public static gridData: Map<string, GIGridData> = new Map<string, GIGridData>;
    public static gridWallData: Map<string, GIGridData> = new Map<string, GIGridData>;

    public static gridIntervalX: number = 40.40
    public static gridIntervalY: number = 23.1
    public static gridOffsetX: number = 40.40
    public static gridOffsetY: number = 23.1


    public static wallGridIntervalX: number = 40.1
    public static wallGridIntervalY: number = 22.7


    public static getWallGridPos(x: number, y: number) {
        if (x < 0) {
            return v3(x * this.wallGridIntervalX, -y * (this.wallGridIntervalY + 25) + x * (this.wallGridIntervalY + 0.5) + 20, 0)
        } else {
            return v3(x * this.wallGridIntervalX, -y * (this.wallGridIntervalY + 25) - x * (this.wallGridIntervalY + 0.5), 0)
        }
    }


    public static getBottomGridPos(x: number, y: number) {
        return v3(x * this.gridIntervalX - y * this.gridOffsetX, -y * this.gridIntervalY - x * this.gridOffsetY, 0)
    }
    public static getBottomGridPosV2(pos: Vec2) {
        return this.getBottomGridPos(pos.x, pos.y)
    }


    public static initGridsData(gridUIT: UITransform, leftDown: number, rightDown: number) {
        for (let x = 0; x < rightDown; x++) {
            for (let y = 0; y < leftDown; y++) {
                let wps = gridUIT.convertToWorldSpaceAR(this.getBottomGridPos(x, y))
                let key = UtilPub.decimal2(wps.x) + "," + UtilPub.decimal2(wps.y)
                UtilScene.gridData.set(key, {
                    "wps": v3(UtilPub.decimal2(wps.x), UtilPub.decimal2(wps.y), wps.z),
                    "point": v2(x, y)
                })
            }
        }

    }

    public static initGridsWallData(gridUIT: UITransform, left: number, right: number) {
        for (let x = 0; x < right; x++) {
            for (let y = 0; y < 8; y++) {
                let wps = gridUIT.convertToWorldSpaceAR(this.getWallGridPos(x, y))
                let key = UtilPub.decimal2(wps.x) + "," + UtilPub.decimal2(wps.y)
                UtilScene.gridWallData.set(key, {
                    "wps": v3(UtilPub.decimal2(wps.x), UtilPub.decimal2(wps.y), wps.z),
                    "point": v2(x, y)
                })
            }
        }
        for (let x = 1; x < left + 1; x++) {
            for (let y = 0; y < 8; y++) {
                let wps = gridUIT.convertToWorldSpaceAR(this.getWallGridPos(-x, y))
                let key = UtilPub.decimal2(wps.x) + "," + UtilPub.decimal2(wps.y)
                UtilScene.gridWallData.set(key, {
                    "wps": v3(UtilPub.decimal2(wps.x), UtilPub.decimal2(wps.y), wps.z),
                    "point": v2(-x, y)
                })
            }
        }

    }

}

