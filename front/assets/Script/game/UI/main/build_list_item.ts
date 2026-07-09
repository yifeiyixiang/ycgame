import { find, Label, ProgressBar, Sprite, UITransform, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { GBuildType, GSceneRoomReceiveState, GSceneRoomState } from '../../../config/global';
import { BaseUiComponent } from '../../../easyFramework/mgr/comm';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
import { SceneData } from '../../comm/SceneData';
import { playerDataStore } from '../../comm/UserData';
import { UtilScene } from '../../comm/UtilScene';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';

const { ccclass, property } = _decorator;

@ccclass('build_list_item')
export class BuildListItemController extends BaseUiComponent {
    get roomNameLabel() { return find("root/top/roomNameLabel", this.node)!.getComponent(Label)! }

    get roomIntroLabel() { return find("root/roomIntroLabel", this.node)!.getComponent(Label)! }

    get bar() { return find("root/bar", this.node)! }
    get roomBar() { return find("root/bar/roomBar", this.node)!.getComponent(ProgressBar)! }
    get roomBarLabel() { return find("root/bar/roomBar/roomBarLabel", this.node)!.getComponent(Label)! }
    get gift() { return find("root/bar/gift", this.node)! }
    get giftReward() { return find("root/bar/giftReward", this.node)! }

    get giftReceive() { return find("root/giftReceive", this.node)! }

    get mid() { return find("root/mid", this.node)! }
    get icon() { return find("root/mid/iconbg/icon", this.node)!.getComponent(Sprite)! }
    get expLabel() { return find("root/mid/iconbg/expLabel", this.node)!.getComponent(Label)! }
    get tipLabel() { return find("root/mid/tipLabel", this.node)!.getComponent(Label)! }
    get starNumLabel() { return find("root/mid/starNum/starNumLabel", this.node)!.getComponent(Label)! }
    get goBtn() { return find("root/mid/goBtn", this.node)! }
    get goBtnLabel() { return find("root/mid/goBtn/goBtnLabel", this.node)!.getComponent(Label)! }

    get bottom() { return find("root/bottom", this.node)! }
    get lockLabel() { return find("root/bottomLock/lockLabel", this.node)!.getComponent(Label)! }

    get picture() { return find("root/top/mask/picture", this.node)!.getComponent(Sprite)! }


    roomId: number = 0
    buildId: number = 0
    buildType: GBuildType = GBuildType.room

    onLoad() {
        this.bindButton(this.gift, () => {

            if (this.roomId > 0) {
                let roomData = TableDataService.ins()._fn_ly(Const.Tables.scene_room, this.roomId)
                let pos = UtilPub._fn_dp(this.gift)
                UiLayerService.instance._fn_ahg(Const.Dialogs.RewardPopupItemController, { RewardItemRecord: roomData.resAll, pos: pos })
            }
        })

        this.bindButton(this.goBtn, this.onClickBtnGo);

        this.bindButton(this.giftReceive, () => {
            if (this.roomId > 0) {
                let roomData = TableDataService.ins()._fn_ly(Const.Tables.scene_room, this.roomId)
                UiLayerService.instance._fn_ahg(Const.Dialogs.RewardDialog, { reward: roomData.resAll })
                SceneData.ins._fn_afw(this.roomId, GSceneRoomReceiveState.received)
                this.node.removeFromParent()
            }
        })
    }

    init(roomId: number) {
        this.roomId = roomId
        let roomData = TableDataService.ins()._fn_ly(Const.Tables.scene_room, roomId)
        this.roomNameLabel.string = roomData.name
        this.roomIntroLabel.string = roomData.desc
        this.giftReceive.active = false
        this._fn_agk(this.picture, Const.resPath.buildpicture + roomData.picture)

        this.bindButton(find("root/top", this.node)!, () => {
            UiLayerService.instance._fn_ahg(Const.Dialogs.BuildInfoPanelController, { id: roomId })
        })


        if (playerDataStore.roleLv >= roomData.lv) {
            this.bottom.active = false
            this.mid.active = true


            if (SceneData.ins._fn_kk(roomId) == GSceneRoomState.unlock) {
                this.bar.active = true


                let roomItems = TableDataService.ins()._fn_mc(Const.Tables.scene_item, "room", roomId + "", "eff", "1")
                roomItems.sort((a, b) => {
                    return a.stars.split(",")[1] - b.stars.split(",")[1]
                })


                let items = UtilScene._fn_il(roomId)
                if (items.length > 0) {
                    let item = items[0]


                    let skinData = TableDataService.ins()._fn_ly(Const.Tables.scene_skin, item.skin)
                    let unlockSkin = TableDataService.ins()._fn_ly(Const.Tables.scene_skin, item.unlockSkin)
                    UtilScene._fn_agh(this.icon, unlockSkin)


                    this.expLabel.string = "+" + item.stars.split(",")[1] * UtilScene.ExpTimes
                    this.starNumLabel.string = "x" + item.stars.split(",")[1]

                    this.tipLabel.string = "搭建 " + skinData.desc
                    this.buildType = GBuildType.item
                    this.buildId = item.id
                }


                let val = UtilScene._fn_aw(roomId)
                this.roomBar.progress = val
                this.roomBarLabel.string = Math.round(val * 100) + "%"
                if (val >= 1) {

                    this.mid.active = false
                    this.giftReceive.active = true
                }

            } else {

                this.buildType = GBuildType.room
                this.buildId = this.roomId
                this.bar.active = false
                let skinData = TableDataService.ins()._fn_mb(Const.Tables.scene_item, "room", roomData.id)[0]
                UtilPub.log("-----skin---", roomData.id, skinData)
                let unlockSkinData = TableDataService.ins()._fn_ly(Const.Tables.scene_skin, skinData.unlockSkin)
                UtilScene._fn_agh(this.icon, unlockSkinData)


                this.expLabel.string = "+" + roomData.stars.split(",")[1] * UtilScene.ExpTimes
                this.starNumLabel.string = "x" + roomData.stars.split(",")[1]
                this.tipLabel.string = "扩建 " + roomData.name
            }

        } else {
            this.bottom.active = true
            this.mid.active = false

            this.lockLabel.string = '等级达到' + roomData.lv
        }

        console.log("builditem height = ", this.node.getComponent(UITransform)!.height)
    }

    onClickBtnGo(){

        mergeBoardStateStore._fn_df();
        UiLayerService.instance._fn_nk(Const.Dialogs.BuildListPanelController)
        this.emit(GD.event.goToBuildScene, this.buildId, this.buildType)
    }

}


