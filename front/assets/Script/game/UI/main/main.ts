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
            UiLayerService.instance._fn_ahg(Const.Dialogs.TurnTableView)
        })

        this.bindButton(find("root/top/btnActivity", this.node)!, () => {
            UiLayerService.instance._fn_ahg(Const.Dialogs.ActivityView)
        })

        this.bindButton(find("root/top/btnTask", this.node)!, () => {
            UiLayerService.instance._fn_ahg(Const.Dialogs.TaskView)


        })


        this.bindButton(find("root/bottom/btnFriend", this.node)!, () => {

            UiLayerService.instance._fn_ahg(Const.Dialogs.FriendListView)
        })

        this.bindButton(find("root/bottom/btnBag", this.node)!, () => {

            UiLayerService.instance._fn_ahg(Const.Dialogs.BagNewLayer)
        })

        this.bindButton(find("root/bottom/btnShop", this.node)!, () => {

            UiLayerService.instance._fn_ahg(Const.Dialogs.ShopNewView)
        })

        this.bindButton(find("root/bottom/btnSkin", this.node)!, () => {

            UiLayerService.instance._fn_ahg(Const.Dialogs.ZhuanshiView)
        })




        this.bindButton(this.buildListNode, () => {
            UiLayerService.instance._fn_ahg(Const.Dialogs.BuildListPanelController)
        })
        this._fn_ag(this.menuBtnForMergeBoard, this.openMergeBoard);

        this.bindButton(find("root/LayoutRight/btnTujian", this.node)!, () => {
            UiLayerService.instance._fn_ahg(Const.Dialogs.Tujian)
        })

        this.bindButton(find("root/LayoutRight/btndebug", this.node)!, () => {
            UiLayerService.instance._fn_ahg(Const.Dialogs.DebugDialog)
        })

        find("root/LayoutRight/btndebug", this.node)!.active = Const.isOpenCheat





        this.bindButton(find("root/LayoutRight/btnEmail", this.node)!, () => {
            UiLayerService.instance._fn_xw(Const.Dialogs.EmailDialog)
        })

        this.bindButton(find("root/LayoutLeft/btnFree", this.node)!, () => {
            UiLayerService.instance._fn_ahg(Const.Dialogs.ActivityDialog)

        })

        this.bindButton(find("root/LayoutLeft/btnfirstRecharge", this.node)!, () => {
            UiLayerService.instance._fn_ahg(Const.Dialogs.FirstRechargeDialogController)
        })

        this.bindButton(find("root/LayoutLeft/btnMonthCard", this.node)!, () => {
            UiLayerService.instance._fn_ahg(Const.Dialogs.MonthCard)
        })

        this.bindButton(find("root/LayoutRight/btnRoleInfo", this.node)!, () => {
            UiLayerService.instance._fn_ahg(Const.Dialogs.FeijiuDialog)
        })

        this.bindButton(find("root/LayoutLeft/btnSale", this.node)!, () => {
            UiLayerService.instance._fn_ahg(Const.Dialogs.RewardActivityDialog)
        })

        this.bindButton(find("root/btnsRight/btnTreasure", this.node)!, () => {
            if (TreasureModel.receiveNum >= 6) {
                UiLayerService.instance._fn_ahg(Const.Dialogs.TreasureFinishDialog)
            } else {
                UiLayerService.instance._fn_ahg(Const.Dialogs.TreasureDialog)
            }

        })


        this.bindButton(find("root/top/btnSign", this.node)!, () => {








            UiLayerService.instance._fn_ahg(Const.Dialogs.SignDialog)


        })

        find("root/top/btnSign", this.node)!.active = SignUtil._fn_ho()._fn_gn() > 0

        this.bindButton(find("root/btnsRight/btnSeasonPass", this.node)!, () => {

            UiLayerService.instance._fn_ahg(Const.Dialogs.SeasonPassLayer);
        });

        this.addPrefab(Const.Prefabs.Main_top, find("root", this.node)!, null!, { flag: main_top.ShowLevel | main_top.ShowCoin | main_top.ShowPower | main_top.ShowDiamond });

        UiLayerService.instance._fn_ahg(Const.Dialogs.FloatingTipPanelController)

        UtilPub._fn_as(this.starNode, 1.1)
        aiRobot._fn_or();
    }

    onEnable() {
        this.chgGreenStar()
        console.log("onMessageEvent --- start listen")
        director.off(GNetCmd.GetUserDataByKey.toString(), this._fn_uw, this);
        director.on(GNetCmd.GetUserDataByKey.toString(), this._fn_uw, this);

        this.on(GD.event.refreshHandLayer, this._fn_ze, this)
        this.on(GD.event.unlockSystem, this._fn_ajj, this);
        this.on(GD.event.updateTreasure, this.updateTreasure, this);


        this._fn_zz();
        this.refreshHandLayer();
        this._fn_nu()
        this.updateTreasure()

        playerDataStore._showPropTujianRed = playerDataStore._fn_cm()
        playerDataStore._showSceneTujianRed = playerDataStore._fn_cn()

        redPointManager._fn_afp(find("root/LayoutRight/btnEmail", this.node)!, RPointEvent.RPM_Email, false)
        redPointManager._fn_afp(find("root/LayoutRight/btnTujian", this.node)!, RPointEvent.RPM_Tujian, false)
        GamePlatform._fn_aja("enter main scene")

        this.scheduleOnce(() => {
            mergeBoardStateStore.btnMergeBoardPos = UtilPub._fn_dp(find("root/bottom/mergeBoard", this.node)!);
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

    _fn_nu() {

        find("root/LayoutLeft/btnMonthCard", this.node)!.active = false
        find("root/LayoutLeft/btnfirstRecharge", this.node)!.active = false
        find("root/LayoutLeft/btnSale", this.node)!.active = false

    }

    _fn_ajj() {
        this._fn_zz();
    }

    _fn_zz() {
        let btnSeasonPass = find("root/btnsRight/btnSeasonPass", this.node)!;



        if (seasonProgressStore.seasonOpen) {
            btnSeasonPass.active = true;
        } else {
            btnSeasonPass.active = false;
        }
    }

    refreshHandLayer() {
        let handIndex = mergeBoardStateStore._fn_hj();
        if (handIndex >= handIndexs.firstCompose && handIndex <= handIndexs.goBuildScene) {
            handIndex = handIndexs.enterMergeBoard;
        } else if (handIndex == handIndexs.boardCardPanel) {
            handIndex = handIndexs.returnMergeBoardLayer;
        }
        if (handIndex == handIndexs.enterMergeBoard || handIndex == handIndexs.returnMergeBoardLayer) {
            let obj: any = {};
            obj.id = handIndex;
            obj.node = this.menuBtnForMergeBoard;
            UiLayerService.instance._fn_ahg(Const.Dialogs.HandLayer, obj);
        }
    }

    _fn_ze() {
        this.refreshHandLayer();
    }

    onDisable() {
        console.log("onMessageEvent --- 取消监听")
        director.off(GNetCmd.GetUserDataByKey.toString(), this._fn_uw, this);
        this.off(GD.event.refreshHandLayer, this._fn_ze)
        this.off(GD.event.updateTreasure, this.updateTreasure);

    }

    _fn_uw(value: any) {
        console.log("onMessageEvent:", value);
        let data = ServerCtrJSF._fn_hp()._fn_mu(value, Const.MoneyKeys.FirstCharge)
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
        if (mergeBoardStateStore._fn_hj() == handIndexs.enterMergeBoard
            || mergeBoardStateStore._fn_hj() == handIndexs.returnMergeBoardLayer
        ) {
            mergeBoardStateStore._fn_e();
            mergeBoardStateStore._fn_df();
        }
        UtilPub.log("------------handIndex Main0", mergeBoardStateStore._fn_hj())
        AudioPlaybackService.instance._fn_xc(Const.Audio.sceneChange);
        UiLayerService.instance._fn_ahg(Const.Dialogs.MergeBoardLayer);
    }


}

