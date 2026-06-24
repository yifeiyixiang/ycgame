import { director, find, Label, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { AudioPlaybackService } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import { GNetCmd } from '../../../easyFramework/network/conf';
import ServerCtrJSF from '../../../easyFramework/network/ServerCtrJSF';
import { CdComponent, CDType } from '../../../easyFramework/utils/CdComponent';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { aiRobot } from '../../comm/AIRobot';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
import { seasonProgressStore } from '../../comm/playerModel';
import { redPointManager, RPointEvent } from '../../comm/RedPointManager';
import { SignUtil } from '../../comm/SignUtil';
import { playerDataStore } from '../../comm/UserData';
import { handIndexs } from '../../data/handData';
import { TreasureModel } from '../Dialog/TreasureModel';
import { main_top } from './main_top';
import { GamePlatform } from '../../platform/GamePlatform';
const { ccclass, property } = _decorator;

@ccclass('main')
export class main extends BaseView {


    get starNode() { return find("root/LayoutLeft/buildList/star", this.node)! }


    get sceneNode() { return find("root/sceneNode", this.node)! }


    get menuBtnForMergeBoard() { return find("root/bottom/mergeBoard", this.node)! }


    get buildListNode() { return find("root/LayoutLeft/buildList", this.node)! }
    get buildListStarLabel() { return find("root/LayoutLeft/buildList/starLabel", this.node)!.getComponent(Label)! }

    onLoad() {

        this.on(GD.event.chgGreenStar, this.chgGreenStar, this)
        this.on(GD.event.SceneNodeScale, this.SceneNodeScale, this)




        this.bindButton(find("root/top/btnTurntable", this.node)!, () => {
            UiLayerService.instance.showDialog(Const.Dialogs.TurnTableView)
        })

        this.bindButton(find("root/top/btnActivity", this.node)!, () => {
            UiLayerService.instance.showDialog(Const.Dialogs.ActivityView)
        })

        this.bindButton(find("root/top/btnTask", this.node)!, () => {
            UiLayerService.instance.showDialog(Const.Dialogs.TaskView)


        })


        this.bindButton(find("root/bottom/btnFriend", this.node)!, () => {

            UiLayerService.instance.showDialog(Const.Dialogs.FriendListView)
        })

        this.bindButton(find("root/bottom/btnBag", this.node)!, () => {

            UiLayerService.instance.showDialog(Const.Dialogs.BagNewLayer)
        })

        this.bindButton(find("root/bottom/btnShop", this.node)!, () => {

            UiLayerService.instance.showDialog(Const.Dialogs.ShopNewView)
        })

        this.bindButton(find("root/bottom/btnSkin", this.node)!, () => {

            UiLayerService.instance.showDialog(Const.Dialogs.ZhuanshiView)
        })




        this.bindButton(this.buildListNode, () => {
            UiLayerService.instance.showDialog(Const.Dialogs.BuildListPanelController)
        })
        this.bindButtonNoAudio(this.menuBtnForMergeBoard, this.openMergeBoard);

        this.bindButton(find("root/LayoutRight/btnTujian", this.node)!, () => {
            UiLayerService.instance.showDialog(Const.Dialogs.Tujian)
        })

        this.bindButton(find("root/LayoutRight/btndebug", this.node)!, () => {
            UiLayerService.instance.showDialog(Const.Dialogs.DebugDialog)
        })

        find("root/LayoutRight/btndebug", this.node)!.active = Const.isOpenCheat





        this.bindButton(find("root/LayoutRight/btnEmail", this.node)!, () => {
            UiLayerService.instance.pushShowDialog(Const.Dialogs.EmailDialog)
        })

        this.bindButton(find("root/LayoutLeft/btnFree", this.node)!, () => {
            UiLayerService.instance.showDialog(Const.Dialogs.ActivityDialog)

        })

        this.bindButton(find("root/LayoutLeft/btnfirstRecharge", this.node)!, () => {
            UiLayerService.instance.showDialog(Const.Dialogs.FirstRechargeDialogController)
        })

        this.bindButton(find("root/LayoutLeft/btnMonthCard", this.node)!, () => {
            UiLayerService.instance.showDialog(Const.Dialogs.MonthCard)
        })

        this.bindButton(find("root/LayoutRight/btnRoleInfo", this.node)!, () => {
            UiLayerService.instance.showDialog(Const.Dialogs.FeijiuDialog)
        })

        this.bindButton(find("root/LayoutLeft/btnSale", this.node)!, () => {
            UiLayerService.instance.showDialog(Const.Dialogs.RewardActivityDialog)
        })

        this.bindButton(find("root/btnsRight/btnTreasure", this.node)!, () => {
            if (TreasureModel.receiveNum >= 6) {
                UiLayerService.instance.showDialog(Const.Dialogs.TreasureFinishDialog)
            } else {
                UiLayerService.instance.showDialog(Const.Dialogs.TreasureDialog)
            }

        })


        this.bindButton(find("root/top/btnSign", this.node)!, () => {








            UiLayerService.instance.showDialog(Const.Dialogs.SignDialog)


        })

        find("root/top/btnSign", this.node)!.active = SignUtil.getInstance().getCurSignDay() > 0

        this.bindButton(find("root/btnsRight/btnSeasonPass", this.node)!, () => {

            UiLayerService.instance.showDialog(Const.Dialogs.SeasonPassLayer);
        });

        this.addPrefab(Const.Prefabs.Main_top, find("root", this.node)!, null!, { flag: main_top.ShowLevel | main_top.ShowCoin | main_top.ShowPower | main_top.ShowDiamond });

        UiLayerService.instance.showDialog(Const.Dialogs.FloatingTipPanelController)

        UtilPub.breathScale(this.starNode, 1.1)
        aiRobot.initRobot();
    }

    onEnable() {
        this.chgGreenStar()
        console.log("onMessageEvent --- start listen")
        director.off(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
        director.on(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);

        this.on(GD.event.refreshHandLayer, this.refreshHandLayerRet, this)
        this.on(GD.event.unlockSystem, this.unlockSystemRet, this);
        this.on(GD.event.updateTreasure, this.updateTreasure, this);


        this.refreshUnlockLayer();
        this.refreshHandLayer();
        this.initBtns()
        this.updateTreasure()

        playerDataStore._showPropTujianRed = playerDataStore.checkTujianRedPoint()
        playerDataStore._showSceneTujianRed = playerDataStore.checkTujianSceneRedPoint()

        redPointManager.setRedpoint(find("root/LayoutRight/btnEmail", this.node)!, RPointEvent.RPM_Email, false)
        redPointManager.setRedpoint(find("root/LayoutRight/btnTujian", this.node)!, RPointEvent.RPM_Tujian, false)
        GamePlatform.track("enter main scene")

        this.scheduleOnce(() => {
            mergeBoardStateStore.btnMergeBoardPos = UtilPub.convertToWorldSpace(find("root/bottom/mergeBoard", this.node)!);
        });

    }

    updateTreasure() {
        let receicedNum = TreasureModel.receiveNum
        let numLabel = find("root/btnsRight/btnTreasure/numLabel", this.node)!.getComponent(Label)!
        if (receicedNum < 6) {
            numLabel.string = receicedNum + "/6"
            let cd = numLabel.node.getComponent(CdComponent)
            if (cd) {
                cd.destroy()
            }
        } else {
            let cd = numLabel.node.getComponent(CdComponent)
            if (cd == null) {
                cd = numLabel.node.addComponent(CdComponent)
            }
            cd.setIgnoreSec(true).setCD(CDType.CDIneterVal, TreasureModel.timeData.key, TreasureModel.timeData.cdTime)
        }
    }

    initBtns() {

        find("root/LayoutLeft/btnMonthCard", this.node)!.active = false
        find("root/LayoutLeft/btnfirstRecharge", this.node)!.active = false
        find("root/LayoutLeft/btnSale", this.node)!.active = false

    }

    unlockSystemRet() {
        this.refreshUnlockLayer();
    }

    refreshUnlockLayer() {
        let btnSeasonPass = find("root/btnsRight/btnSeasonPass", this.node)!;



        if (seasonProgressStore.seasonOpen) {
            btnSeasonPass.active = true;
        } else {
            btnSeasonPass.active = false;
        }
    }

    refreshHandLayer() {
        let handIndex = mergeBoardStateStore.getHandIndex();
        if (handIndex >= handIndexs.firstCompose && handIndex <= handIndexs.goBuildScene) {
            handIndex = handIndexs.enterMergeBoard;
        } else if (handIndex == handIndexs.boardCardPanel) {
            handIndex = handIndexs.returnMergeBoardLayer;
        }
        if (handIndex == handIndexs.enterMergeBoard || handIndex == handIndexs.returnMergeBoardLayer) {
            let obj: any = {};
            obj.id = handIndex;
            obj.node = this.menuBtnForMergeBoard;
            UiLayerService.instance.showDialog(Const.Dialogs.HandLayer, obj);
        }
    }

    refreshHandLayerRet() {
        this.refreshHandLayer();
    }

    onDisable() {
        console.log("onMessageEvent --- 取消监听")
        director.off(GNetCmd.GetUserDataByKey.toString(), this.onMessageEvent, this);
        this.off(GD.event.refreshHandLayer, this.refreshHandLayerRet)
        this.off(GD.event.updateTreasure, this.updateTreasure);

    }

    onMessageEvent(value: any) {
        console.log("onMessageEvent:", value);
        let data = ServerCtrJSF.GetInstance().getUserDataByKey(value, Const.MoneyKeys.FirstCharge)
        if (data) {
            if (parseInt(data.val + "") == 2) {
                find("root/LayoutLeft/btnfirstRecharge", this.node)!.active = false
            } else {
                find("root/LayoutLeft/btnfirstRecharge", this.node)!.active = true
                if (parseInt(data.val + "") == 1) {

                }
            }
        }
    }

    chgGreenStar() {
        this.buildListStarLabel.string = playerDataStore.greenStar + ""
    }

    SceneNodeScale() {

    }

    start() {
        this.chgGreenStar()
    }

    show() {

    }

    openMergeBoard() {
        if (mergeBoardStateStore.getHandIndex() == handIndexs.enterMergeBoard
            || mergeBoardStateStore.getHandIndex() == handIndexs.returnMergeBoardLayer
        ) {
            mergeBoardStateStore.addHandIndex();
            mergeBoardStateStore.closeHandLayer();
        }
        UtilPub.log("------------handIndex Main0", mergeBoardStateStore.getHandIndex())
        AudioPlaybackService.instance.playSound(Const.Audio.sceneChange);
        UiLayerService.instance.showDialog(Const.Dialogs.MergeBoardLayer);
    }


}

