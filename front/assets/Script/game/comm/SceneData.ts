
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

    public _fn_pz() {
        return GameStorage._fn_ft(Const.DataKeys.isInitData, false)
    }
    public _fn_eu() {
        GameStorage._fn_aej(Const.DataKeys.isInitData, true)
    }

    public _fn_kk(roomId: number) {

        if (roomId == 1001) return GSceneRoomState.unlock
        return GameStorage._fn_lq(Const.DataKeys.sceneRoomIsUnlock + roomId, GSceneRoomState.locked)
    }
    public _fn_afv(roomId: number, state: GSceneRoomState) {
        GameStorage._fn_ago(Const.DataKeys.sceneRoomIsUnlock + roomId, state)
    }



    public _fn_kn(roomId: number) {

        return GameStorage._fn_lq(Const.DataKeys.sceneRoomIsUnReceive + roomId, GSceneRoomReceiveState.unReceive)
    }
    public _fn_afw(roomId: number, state: GSceneRoomReceiveState) {
        GameStorage._fn_ago(Const.DataKeys.sceneRoomIsUnReceive + roomId, state)
    }



    public _fn_ky(skinId: number) {
        return GameStorage._fn_lq(Const.DataKeys.sceneSkinIsGotted + skinId, GSceneSkinState.noGotted)
    }
    public _fn_agb(skinId: number, state: GSceneSkinState) {
        GameStorage._fn_ago(Const.DataKeys.sceneSkinIsGotted + skinId, state)
        if (state == GSceneSkinState.gotted) {
            playerDataStore._fn_aes(skinId, TujianState.geted, Const.DataKeys.tujianScene)
        }
    }
    public _fn_kx() {
        return GameStorage._fn_ip(Const.DataKeys.sceneSkinIsGotted)
    }


    public _fn_lk(sceneId: number) {

    }


    private _fn_kr(type: GSceneItemType) {
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
    public _fn_afx(data: GSceneItemData) {
        let head = this._fn_kr(data.type)
        if (head != null) {
            GameStorage._fn_afh(head + data.id, data)
        } else {
            UtilPub.error("@！！场景的数据存储,未知的类型", data)
            return null!
        }
    }





    public _fn_afz(dataObj: { [key: string]: GSceneItemData }) {
        GameStorage._fn_afj(dataObj)
    }





    public _fn_ku(id: number, type: GSceneItemType): GSceneItemData | null {
        let head = this._fn_kr(type)
        if (head != null) {
            return GameStorage._fn_io(head + id, null!)
        } else {
            UtilPub.error("@！！场景的数据存储,未知的类型", type, id)
            return null!
        }
    }




    public _fn_ks() {
        return GameStorage._fn_ip(Const.DataKeys.sceneHead)
    }






    public _fn_kt(type: GSceneItemType) {
        let head = this._fn_kr(type)
        if (head != null) {
            return GameStorage._fn_ip(Const.DataKeys.sceneHead)
        } else {
            UtilPub.error("@！！场景的数据存储,未知的类型", type)
            return null!
        }

    }



    init() {
        if (!this._fn_pz()) {

        }
    }

}


