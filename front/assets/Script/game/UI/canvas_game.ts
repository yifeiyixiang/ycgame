import { game, Node, v3, Vec2, Vec3, _decorator, director, Game, find, EventTouch } from 'cc';
import { Const } from '../../config/Const';
import GD from '../../config/GD';
import { BaseUiComponent } from '../../easyFramework/mgr/comm';
import { ResourceLoaderService } from '../../easyFramework/mgr/resourceUtil';
import { UiLayerService } from '../../easyFramework/mgr/uiManager';
import TimeCtrJSF from '../../easyFramework/network/TimeCtrJSF';
import { UtilPub } from '../../easyFramework/utils/UtilPub';
import { seasonProgressStore } from '../comm/playerModel';
import { GNetCmd } from '../../easyFramework/network/conf';
import ServerCtrJSF from '../../easyFramework/network/ServerCtrJSF';
import { AudioPlaybackService } from '../../easyFramework/mgr/audioManager';
import { mergeBoardStateStore } from '../comm/mergeBoardModel';
import { UtilScene } from '../comm/UtilScene';
import { playerDataStore } from '../comm/UserData';
const { ccclass, property } = _decorator;

@ccclass('canvas_game')
export class GameCanvasController extends BaseUiComponent {

    private clickPos: Vec2 = new Vec2();
    private starPos: Vec2 = new Vec2();

    buildingNode: Node = null!
    player: Node = null!
    dir: Vec3 = null!
    dirOps: Vec3 = null!

    oriPos: Vec3 = v3(0, 0, 0)
    startPos1: Vec2 = null!
    startPos2: Vec2 = null!
    pointsDis: number = 0
    rate: number = 1

    isDownloading: boolean = false
    curDownLoadIdx: number = 0
    isLoadingPrefab: boolean = false
    curPrefabIdx: number = 0
    prefabsArr: string[] = []
    calGameTime: number = 0

    onLoad() {
        director.off(GNetCmd.GetRegionData.toString(), this._fn_uw, this);
        director.off(GNetCmd.UniqueLogin.toString(), this._fn_uw, this);
        director.off(GNetCmd.ReqWxSession.toString(), this._fn_uw, this);

        director.on(GNetCmd.GetRegionData.toString(), this._fn_uw, this);
        director.on(GNetCmd.UniqueLogin.toString(), this._fn_uw, this);
        director.on(GNetCmd.ReqWxSession.toString(), this._fn_uw, this);
        Const.UICanvas = this.node
        this.prefabsArr = Object.keys(Const.Prefabs)
    }

    _fn_uw(value: any) {
        ServerCtrJSF._fn_hp()._fn_rz(value)
    }

    start() {
        Const.isLow = UtilPub._fn_bx()
        if (Const.isLow) {
            game.frameRate = 30;
        } else {
            game.frameRate = 60;
        }

        UtilPub.log("---------展示主页-0-----")
        seasonProgressStore.initData();
        UiLayerService.instance._fn_ahg(Const.Dialogs.main)

        AudioPlaybackService.instance._fn_oj()
        AudioPlaybackService.instance._fn_wz(true, Const.Audio.bgm);

        game.on(Game.EVENT_HIDE, () => {
            // @ts-ignore

        });

        playerDataStore._fn_ahi()
        game.on(Game.EVENT_SHOW, () => {
            UtilPub.log("---------展示主页-1-----")
            playerDataStore._fn_ahi()
        });


    }

    onEnable() {
        UtilPub.log("---------展示主页-onEnable-----")

        this.on(GD.event.showToast, this._fn_ahw, this);

    }

    onDisable() {
        this.off(GD.event.showToast, this._fn_ahw);
    }

    _fn_ahw(info: string) {
        this._fn_aiu(info);
    }

    update(dt: number) {
        TimeCtrJSF._fn_hp().serverTime += (dt * 1000);

        this.calGameTime += dt
        if (this.calGameTime > 1) {
            this.calGameTime -= 1
            ServerCtrJSF._fn_hp()._fn_d(1)
        }


        this.calTime += dt
        if (this.calTime > 0.1 && ServerCtrJSF._fn_hp()._fn_qe() == true) {
            this.calTime = 0
            if (this.isDownloading == false) {
                if (this.curDownLoadIdx >= Const.bundles.length) {

                } else {
                    this.isDownloading = true
                    UtilPub.loadBundle(Const.bundles[this.curDownLoadIdx]).then(() => {
                        this.curDownLoadIdx++
                        this.isDownloading = false
                        UtilPub.warn("------------下载完毕", Const.bundles[this.curDownLoadIdx], this.curDownLoadIdx)
                    })
                }
            }



            if (this.curDownLoadIdx >= Const.bundles.length) {
                if (this.isLoadingPrefab == false) {
                    if (this.curPrefabIdx >= this.prefabsArr.length) {
                        return
                    }

                    this.isLoadingPrefab = true
                    let prefabName = this.prefabsArr[this.curPrefabIdx]

                    //@ts-ignore
                    let prefab = Const.Prefabs[prefabName]
                    ResourceLoaderService._fn_xl(prefab).then(() => {
                        this.curPrefabIdx++
                        this.isLoadingPrefab = false

                    })
                }
            }
        }

    }

}
