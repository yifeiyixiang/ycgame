
import { _decorator, Component, Node, game } from 'cc';
import { Const } from "../../config/Const";
import { GSceneItemData, GSceneItemType, GSceneRoomReceiveState, GSceneRoomState, GSceneSkinState, TujianState } from '../../config/global';
import { GameStorage } from '../../easyFramework/mgr/gameStorage';
import { UtilPub } from '../../easyFramework/utils/UtilPub';
import { playerDataStore } from './UserData';
const { ccclass, property } = _decorator;


@ccclass('SceneData')
export class SceneData extends Component {
    private static _instance: SceneData;
    static get ins() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new SceneData();
        return this._instance;
    }

    public isInitSceneData() {
        return GameStorage.getBoolean(Const.DataKeys.isInitData, false)
    }
    public finishInitSceneData() {
        GameStorage.setBoolean(Const.DataKeys.isInitData, true)
    }

    public getRoomLockInfoById(roomId: number) {

        if (roomId == 1001) return GSceneRoomState.unlock
        return GameStorage.getString(Const.DataKeys.sceneRoomIsUnlock + roomId, GSceneRoomState.locked)
    }
    public setRoomLockInfoById(roomId: number, state: GSceneRoomState) {
        GameStorage.setString(Const.DataKeys.sceneRoomIsUnlock + roomId, state)
    }



    public getRoomReceiveInfoById(roomId: number) {

        return GameStorage.getString(Const.DataKeys.sceneRoomIsUnReceive + roomId, GSceneRoomReceiveState.unReceive)
    }
    public setRoomReceiveInfoById(roomId: number, state: GSceneRoomReceiveState) {
        GameStorage.setString(Const.DataKeys.sceneRoomIsUnReceive + roomId, state)
    }



    public getSceneSkinById(skinId: number) {
        return GameStorage.getString(Const.DataKeys.sceneSkinIsGotted + skinId, GSceneSkinState.noGotted)
    }
    public setSceneSkinById(skinId: number, state: GSceneSkinState) {
        GameStorage.setString(Const.DataKeys.sceneSkinIsGotted + skinId, state)
        if (state == GSceneSkinState.gotted) {
            playerDataStore.setGetPropTujian(skinId, TujianState.geted, Const.DataKeys.tujianScene)
        }
    }
    public getSceneSkinAll() {
        return GameStorage.getObjectArrayByKey(Const.DataKeys.sceneSkinIsGotted)
    }


    public getSkinListByScene(sceneId: number) {

    }


    private getSceneHead(type: GSceneItemType) {
        if (type == GSceneItemType.wall) {
            return Const.DataKeys.sceneWall
        } else if (type == GSceneItemType.floor) {
            return Const.DataKeys.sceneFloor
        } else if (type == GSceneItemType.carpet) {
            return Const.DataKeys.sceneCarpet
        } else if (type == GSceneItemType.item) {
            return Const.DataKeys.sceneItem
        } else if (type == GSceneItemType.pendant) {
            return Const.DataKeys.scenePendant
        }
        return null!
    }
    public setSceneItem(data: GSceneItemData) {
        let head = this.getSceneHead(data.type)
        if (head != null) {
            GameStorage.setObject(head + data.id, data)
        } else {
            UtilPub.error("@！！场景的数据存储,未知的类型", data)
            return null!
        }
    }





    public setSceneItems(dataObj: { [key: string]: GSceneItemData }) {
        GameStorage.setObjectMulti(dataObj)
    }





    public getSceneItemById(id: number, type: GSceneItemType): GSceneItemData | null {
        let head = this.getSceneHead(type)
        if (head != null) {
            return GameStorage.getObject(head + id, null!)
        } else {
            UtilPub.error("@！！场景的数据存储,未知的类型", type, id)
            return null!
        }
    }




    public getSceneItemArrAll() {
        return GameStorage.getObjectArrayByKey(Const.DataKeys.sceneHead)
    }






    public getSceneItemArrByType(type: GSceneItemType) {
        let head = this.getSceneHead(type)
        if (head != null) {
            return GameStorage.getObjectArrayByKey(Const.DataKeys.sceneHead)
        } else {
            UtilPub.error("@！！场景的数据存储,未知的类型", type)
            return null!
        }

    }



    init() {
        if (!this.isInitSceneData()) {

        }
    }

}


