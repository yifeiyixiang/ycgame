import { find, Label, ProgressBar, sp, Sprite, tween, v3, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { GBuildType, GISceneItemParent, GLockState, GSceneRoomState, GSceneSkinState } from '../../../config/global';
import { AudioPlaybackService } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
import { SceneData } from '../../comm/SceneData';
import { playerDataStore } from '../../comm/UserData';
import { UtilScene } from '../../comm/UtilScene';
import { handIndexs } from '../../data/handData';
import { PropItem, PropItemFlag } from '../Dialog/PropItem';
import { FlashStarController } from './flash_star';
const { ccclass, property } = _decorator;

@ccclass('build_prompt')
export class BuildPromptDialogController extends BaseView {

    get starNode() { return find("root/LayoutLeft/buildList/star", this.node)! }
    get spineAni() { return find("root/spineAni", this.node)!.getComponent(sp.Skeleton)! }
    get btnClose() { return find("root/btnClose", this.node)! }


    get starLabel() { return find("root/LayoutLeft/buildList/starLabel", this.node)!.getComponent(Label)! }

    get titleLabel() { return find("root/titleLabel", this.node)!.getComponent(Label)! }


    get gift() { return find("root/topBg/gift", this.node)! }
    get roomBar() { return find("root/topBg/roomBar", this.node)!.getComponent(ProgressBar)! }
    get roomBarLabel() { return find("root/topBg/roomBar/roomBarLabel", this.node)!.getComponent(Label)! }


    get rewards() { return find("root/bgIcon/rewards", this.node)! }
    get btnBuild() { return find("root/bgIcon/btnBuild", this.node)! }
    get goToMergeBoard() { return find("root/bgIcon/goToMergeBoard", this.node)! }
    get pop() { return find("root/bgIcon/goToMergeBoard/pop", this.node)! }

    get btnBuildLabel() { return find("root/bgIcon/btnBuild/btnBuildLabel", this.node)!.getComponent(Label)! }


    get icon() { return find("root/bgIcon/leftIcon/icon", this.node)!.getComponent(Sprite)! }
    get dressLabel() { return find("root/bgIcon/leftIcon/dressLabel", this.node)!.getComponent(Label)! }
    get sceneItemNameLabel() { return find("root/bgIcon/leftIcon/sceneItemNameLabel", this.node)!.getComponent(Label)! }

    id: number = 0
    type: GBuildType = null!
    sceneItemData: any = null!
    isBtnActive: boolean = false

    start() {
        UtilPub._fn_as(this.starNode, 1.1)
        UtilPub._fn_as(this.pop)
        this.bindButton(this.btnClose, () => {
            this.close()
        })

        this.bindButton(this.gift, () => {

            let roomData = TableDataService.ins()._fn_ly(Const.Tables.scene_room, this.sceneItemData.room)
            let pos = UtilPub._fn_dp(this.gift)
            UiLayerService.instance._fn_ahg(Const.Dialogs.RewardPopupItemController, { RewardItemRecord: roomData.resAll, pos: pos })
        })

        this.bindButton(this.btnBuild, this.onClickBtnBuild);

        this.bindButton(this.goToMergeBoard, () => {
            this.close()
            UiLayerService.instance._fn_ahg(Const.Dialogs.MergeBoardLayer)
        })


        this.spineAni.setCompleteListener((trackEntry: any) => {
            let name = trackEntry.animation ? trackEntry.animation.name : '';
            if (name == "animation") {

                let handIndex = mergeBoardStateStore._fn_hj();
                if (handIndex == handIndexs.buildCashDesk) {
                    mergeBoardStateStore._fn_e();
                    mergeBoardStateStore._fn_e();
                    mergeBoardStateStore._fn_df();
                }

                this.emit(GD.event.chgGreenStar)

                AudioPlaybackService.instance._fn_xc(Const.Audio.flash_show)
                let script = UtilScene._fn_kv(this.sceneItemData.id)!


                if (this.type != GBuildType.room) {
                    this.emit(GD.event.popOpsWindow, UtilScene._fn_kv(this.sceneItemData.id)!.node)

                    this.addPrefab(Const.Prefabs.FlashStarController, script.node, (itemNode: any) => {
                        itemNode.getComponent(FlashStarController).init()
                    })

                }

                if (mergeBoardStateStore._fn_px()) {
                    this.scheduleOnce(() => {
                        UtilScene._fn_afy(script.node, () => {

                        })
                    }, 0.2)
                }
                this.close()

            }
        });
    }

    _fn_agc(script: GISceneItemParent, skin: number) {
        script.lockState = GLockState.unlock
        script.skin = skin
        SceneData.ins._fn_afx(UtilScene._fn_kq(script))
        script.switchIcon(skin)
        this.emit(GD.event.chgGreenStar)
    }

    show(args: any) {
        this.spineAni.node.active = false
        this.isBtnActive = false
        this.id = args.id
        this.type = args.type

        this.sceneItemData = TableDataService.ins()._fn_ly(Const.Tables.scene_item, this.id)
        let roomData = TableDataService.ins()._fn_ly(Const.Tables.scene_room, this.sceneItemData.room)

        let itemSkinData = TableDataService.ins()._fn_ly(Const.Tables.scene_skin, this.sceneItemData.skin)

        this.titleLabel.string = roomData.name
        this.starLabel.string = playerDataStore.greenStar + ""
        this.btnBuildLabel.string = "Build"

        this.sceneItemNameLabel.string = "搭建" + itemSkinData.name

        let val = 0
        if (this.type != GBuildType.room) {
            val = UtilScene._fn_aw(this.sceneItemData.room)
        }
        this.roomBar.progress = val
        this.roomBarLabel.string = Math.round(val * 100) + "%"

        if (this.sceneItemData.reward.length > 0) {
            this.rewards.removeAllChildren()





            this.addPrefab(Const.Prefabs.PropItem, this.rewards, (propItem: any) => {
                propItem.getComponent(PropItem).setData(this.sceneItemData.reward[0], PropItemFlag.TouchInfo, this.sceneItemData.reward[1]).setSize(100)
            })
            this.addPrefab(Const.Prefabs.PropItem, this.rewards, (propItem: any) => {
                propItem.getComponent(PropItem).setData(104, PropItemFlag.HideName | PropItemFlag.ShowNum, parseInt(this.sceneItemData.stars.split(",")[1]) * 5).setSize(100)
            })
        }





        let isShowBuild = false
        if (this.type == GBuildType.room) {

            let star = roomData.stars.split(",")[1]
            isShowBuild = (playerDataStore.greenStar >= star)
        } else {


            let star = this.sceneItemData.stars.split(",")[1]
            isShowBuild = (playerDataStore.greenStar >= star)
        }




        this.btnBuild.active = isShowBuild
        this.goToMergeBoard.active = !isShowBuild

        let handIndex = mergeBoardStateStore._fn_hj();
        if (handIndex == handIndexs.buildCashDesk) {
            let obj: any = {};
            obj.id = mergeBoardStateStore._fn_hj() + 1;
            obj.node = this.btnBuild;
            obj.delayTime = 0.5;
            UiLayerService.instance._fn_ahg(Const.Dialogs.HandLayer, obj);
        }



        let skinData = TableDataService.ins()._fn_ly(Const.Tables.scene_skin, this.sceneItemData.unlockSkin)
        UtilScene._fn_agh(this.icon, skinData)
    }

    close() {
        UiLayerService.instance._fn_nk(this.dialogPath)
    }

    onClickBtnBuild() {
        if (this.isBtnActive) return

        let star = this.sceneItemData.stars.split(",")[1]
        star = parseInt(star);

        if (this.type == GBuildType.room) {

            let roomData = TableDataService.ins()._fn_ly(Const.Tables.scene_room, this.sceneItemData.room)
            star = roomData.stars.split(",")[1]
        }

        if (playerDataStore._fn_bi(star)) {
            this.isBtnActive = true
            AudioPlaybackService.instance._fn_xc(Const.Audio.star_touch)
            mergeBoardStateStore._fn_h(Const.ManagerTypes.buildCount);

            this.spineAni.node.active = true
            this.spineAni.setAnimation(0, "animation", false)


            if (this.type == GBuildType.room) {

                SceneData.ins._fn_afv(this.sceneItemData.room, GSceneRoomState.unlock)
                UtilScene._fn_ot(this.sceneItemData.room).then(() => {
                })

            } else {

                let script = UtilScene._fn_kv(this.sceneItemData.id)!
                SceneData.ins._fn_agb(this.sceneItemData.unlockSkin, GSceneSkinState.gotted)
                this._fn_agc(script, this.sceneItemData.unlockSkin)
            }
            this.emit(GD.event.goToBuildScene, this.id, this.type)


            playerDataStore.roleExp += star * UtilScene.ExpTimes
            this.emit(GD.event.updateMoney);


            mergeBoardStateStore._fn_m(this.sceneItemData.reward[0], this.sceneItemData.reward[1], v3(), v3(), true)


            if (this.type != GBuildType.room) {
                let val = UtilScene._fn_aw(this.sceneItemData.room)
                tween(this.roomBar).to(0.3, { progress: val }).start()
                this.roomBarLabel.string = Math.round(val * 100) + "%"
            }


        }
    }

}


