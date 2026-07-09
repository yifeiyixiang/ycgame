import { find, Label, Node, Sprite, tween, Tween, Vec3, v3, _decorator, ProgressBar } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { WidgetType } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { CdComponent, CDType } from '../../../easyFramework/utils/CdComponent';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
import { NumberActionController } from '../../comm/numAction';
import { playerDataStore } from '../../comm/UserData';
import { handIndexs } from '../../data/handData';
import { GameEventManager } from '../../../../typeScript/EventManger';
import { GameStorage } from '../../../easyFramework/mgr/gameStorage';
const { ccclass, property } = _decorator;

@ccclass('main_top')
export class main_top extends BaseView {
    @property({ type: Label, displayName: "体力Label" }) powerLabel: Label = null!
    @property({ type: Label, displayName: "金币Label" }) coinLabel: Label = null!
    @property({ type: Label, displayName: "钻石Label" }) diamondsLabel: Label = null!
    @property({ type: Label, displayName: "装扮券Label" }) styleVoucherLabel: Label = null!

    @property({ type: Label, displayName: "等级Label" }) lvLabel: Label = null!
    @property({ type: Sprite, displayName: "等级bar" }) lvBar: Sprite = null!

    @property({ type: Label, displayName: "倒计时Label" }) timeLabel: Label = null!

    @property({ type: Node, displayName: "升级特效" }) levelEffect: Node = null!
    @property({ type: Node }) star: Node = null!

    @property({ type: Node, displayName: "无限能量特效" }) wuxianEffect: Node = null!


    @property({ type: Label, displayName: "玩家名称" }) nameLab: Label = null!

    @property({ type: Label, displayName: "玩家ID" }) nameIdLab: Label = null!

    @property({ type: Label, displayName: "宠物数量" }) petCountLab: Label = null!

    @property({ type: Label, displayName: "宠物积分" }) petScoreLab: Label = null!

    @property({ type: Label, displayName: "等级Label" }) lvLabelNew: Label = null!

    @property({ type: Label, displayName: "增加经验" }) addExpLab: Label = null!

    @property({ type: Label, displayName: "等级Label" }) lvLabel2: Label = null!
    @property({ type: ProgressBar, displayName: "等级bar" }) lvBar2: ProgressBar = null!
    @property({ type: Node, displayName: "升级特效" }) levelEffect2: Node = null!
    @property({ type: Label, displayName: "经验label" }) expLab2: Label = null!
     @property({ type: Node }) star2: Node = null!

    public static ShowLevel = 1
    public static ShowCoin = 1 << 1
    public static ShowDress = 1 << 2
    public static ShowPower = 1 << 3
    public static ShowDiamond = 1 << 5

    private static _topNode: Node = null!

    private expPos:any;

    private _isUpdateMoney = false
    _step = 13;


    public static _fn_mo() {
        return main_top._topNode;
    }

    onLoad() {
        this.updateMoney()
        this._fn_ev(find("root/top", this.node)!, WidgetType.top, -50)
        this._fn_ev(find("root/level", this.node)!, WidgetType.top, -20)

        this.bindButton(find("root/top/btnSet", this.node)!, () => {
            UiLayerService.instance._fn_xw(Const.Dialogs.SetDialog)
        })

        this.bindButton(find("root/top/btnAvatar", this.node)!, () => {
            UiLayerService.instance._fn_xw(Const.Dialogs.UserinfoView)
        })

        this.bindButton(find("root/top/gold/addGoldBtn", this.node)!, () => {
            UiLayerService.instance._fn_xw(Const.Dialogs.GetgoldView, 1)
        })

        this.bindButton(find("root/top/power/addGoldBtn", this.node)!, () => {
            UiLayerService.instance._fn_xw(Const.Dialogs.GetgoldView, 2)
        })

        this.expPos =  new Vec3(this.addExpLab.node.parent.position.x, this.addExpLab.node.parent.position.y, this.addExpLab.node.parent.position.z);
    }

    onEnable() {
        this.on(GD.event.updateMoney, this.updateMoney)
        this.on(GD.event.updateMoneyAction, this.updateMoneyAction)
        this.on(GD.event.updateGame, this._fn_ys)
        this.updateMoney()

        GameEventManager.eventTarget.on(GameEventManager.EEventName.ADD_EXP_ANIMATION, this._fn_eo, this);

        this.coinLabel.string = playerDataStore.coin + ""
        this.diamondsLabel.string = playerDataStore.diamonds + ""
        main_top._topNode = this.node
        this.on(GD.event.refreshHandLayer, this._fn_ze, this)
        this.refreshHandLayer();

        this._fn_ys();
    }



    refreshHandLayer() {
        let handIndex = mergeBoardStateStore._fn_hj();
        if (handIndex == handIndexs.btnLvUp) {
            let obj: any = {};
            obj.id = handIndex;
            obj.node = find("root/level", this.node);
            obj.click2 = 1;
            UiLayerService.instance._fn_ahg(Const.Dialogs.HandLayer, obj);
        }
        if (handIndex == handIndexs.btnLvUp3) {
            let lvdata = TableDataService.ins()._fn_ly(Const.Tables.herolevel, playerDataStore.roleLv)
            if (playerDataStore.roleExp >= lvdata.exp) {
                let obj: any = {};
                obj.id = handIndex;
                obj.node = find("root/level", this.node);
                obj.click2 = 1;
                UiLayerService.instance._fn_ahg(Const.Dialogs.HandLayer, obj);

            }
        }
    }

    _fn_ze() {
        this.refreshHandLayer();
    }

    onDisable() {
        this.off(GD.event.updateMoney, this.updateMoney)
        this.off(GD.event.updateMoneyAction, this.updateMoneyAction)
        this.off(GD.event.refreshHandLayer, this._fn_ze)
        this.off(GD.event.updateGame, this)

        GameEventManager.eventTarget.off(GameEventManager.EEventName.ADD_EXP_ANIMATION, this._fn_eo, this);
    }

    start() {
        let flag = this._layerData.flag
        this.timeLabel.string = ""
        find("root/level", this.node)!.active = (flag & main_top.ShowLevel) != 0
        find("root/top/dressup", this.node)!.active = (flag & main_top.ShowDress) != 0
        find("root/top/gold", this.node)!.active = (flag & main_top.ShowCoin) != 0
        find("root/top/power", this.node)!.active = (flag & main_top.ShowPower) != 0
        find("root/top/diamond", this.node)!.active = (flag & main_top.ShowDiamond) != 0





    }

    _fn_ys(){
        if (!playerDataStore.userInfodata){
            return;
        }
        this.powerLabel.string = playerDataStore.power + ""
        this.coinLabel.string = playerDataStore.coin + ""

        this.diamondsLabel.string = playerDataStore.diamonds + ""

        this.nameLab.string = playerDataStore.userInfodata.nickname;
        this.nameIdLab.string = "ID: " + playerDataStore.userInfodata.userid + "";
        this.petCountLab.string = "宠物数量: " + playerDataStore.pet_count + "";
        this.petScoreLab.string = "宠物积分: " + playerDataStore.pet_score + "";

        this.lvLabelNew.string = playerDataStore.roleLv + ""
    }

    updateMoney() {
        this._fn_ys();
        this.powerLabel.string = playerDataStore.power + ""


        this.lvLabel2.string = playerDataStore.roleLv + ""
        this.styleVoucherLabel.string = playerDataStore.styleVoucher + ""
        let lvdata = TableDataService.ins()._fn_ly(Const.Tables.herolevel, playerDataStore.roleLv)
        if (lvdata) {

            this.lvBar2.progress = Math.min(1, playerDataStore.roleExp / lvdata.exp)
            this.expLab2.string = playerDataStore.roleExp + "/" + lvdata.exp
        }

        if (playerDataStore.power < 100) {
            this.timeLabel.getComponent(CdComponent)!.setCD(CDType.CDCountdown, "video_powerAuto", 2 * 60, (time: number) => {
                if (playerDataStore.power + time >= 100) {
                    playerDataStore.power = Math.max(playerDataStore.power, 100)
                    this.timeLabel.getComponent(CdComponent)!.clearCD()
                } else {
                    playerDataStore.power += time
                    this.updateMoney()
                }
                this.powerLabel.string = playerDataStore.power + ""
            })
        } else {
            this.timeLabel.getComponent(CdComponent)!.clearCD()
        }

        if (playerDataStore.roleExp >= lvdata.exp) {
            this.levelEffect2.active = true
            tween(this.star2).to(0.6, { scale: v3(1.1, 1.1, 1.1) }).to(0.6, { scale: v3(1, 1, 1) }).union().repeatForever().start()
        } else {
            this.levelEffect2.active = false
            Tween.stopAllByTarget(this.star2)
            this.star2.scale = v3(1, 1, 1)
        }
    }

    updateMoneyAction() {
        let coinCom = this.coinLabel.getComponent(NumberActionController) || this.coinLabel.addComponent(NumberActionController)
        coinCom!.setTargetNum(playerDataStore.coin)

        let diamondsCom = this.diamondsLabel.getComponent(NumberActionController) || this.diamondsLabel.addComponent(NumberActionController)
        diamondsCom!.setTargetNum(playerDataStore.diamonds)

        let powerCom = this.powerLabel.getComponent(NumberActionController) || this.powerLabel.addComponent(NumberActionController)
        powerCom!.setTargetNum(playerDataStore.power)

        let styleVoucherCom = this.styleVoucherLabel.getComponent(NumberActionController) || this.styleVoucherLabel.addComponent(NumberActionController)
        styleVoucherCom!.setTargetNum(playerDataStore.styleVoucher)
    }

    addMoney(event: any, data: any) {
        if (data == 1) {

            UiLayerService.instance._fn_ahg(Const.Dialogs.ShopPowerDialog)

        } else if (data == 2) {
            UiLayerService.instance._fn_ahg(Const.Dialogs.FreeGiftDialog, { type: "4" })




        } else if (data == 3) {




            UiLayerService.instance._fn_ahg(Const.Dialogs.FreeGiftDialog, { type: "1" })

        } else if (data == 4) {
            UiLayerService.instance._fn_ahg(Const.Dialogs.FreeGiftDialog, { type: "3" })
        }
    }

    showLevelDialog() {
        mergeBoardStateStore._fn_df();
        UiLayerService.instance._fn_xw(Const.Dialogs.LevelDialog)
    }

    update() {
        if (playerDataStore.power >= 100) {
            this.timeLabel.string = ""
            this.timeLabel.getComponent(CdComponent)!.clearCD()
        }
    }

    lateUpdate() {
        if (mergeBoardStateStore._fn_fs() > 0) {
            this.powerLabel.node.active = false;
            this.wuxianEffect.active = true;
            this.timeLabel.string = UtilPub._fn_gw(mergeBoardStateStore._fn_fs());
        } else {
            this.powerLabel.node.active = true;
            this.wuxianEffect.active = false;
        }
    }

    _fn_eo(exp:number){

        playerDataStore.roleExp+=exp;
        this.updateMoney();
        this.addExpLab.string = "exp +" + exp;
        let addNode = this.addExpLab.node.parent;
        addNode.position = new Vec3(this.expPos.x, this.expPos.y, this.expPos.z);
        addNode.active = true;
        tween(addNode)
        .to(0.5, { position: new Vec3(this.expPos.x, this.expPos.y + 20, this.expPos.z) })
        .call(() => {
            addNode.active = false;
        })
        .start();
    }

}

