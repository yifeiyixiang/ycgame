import { find, Label, Node, Sprite, tween, Tween, Vec3, v3, _decorator, ProgressBar } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { WidgetType } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { uiManager } from '../../../easyFramework/mgr/uiManager';
import tables from '../../../easyFramework/other/tables';
import { CdComponent, CDType } from '../../../easyFramework/utils/CdComponent';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { mergeBoardModel } from '../../comm/mergeBoardModel';
import { numAction } from '../../comm/numAction';
import { userData } from '../../comm/UserData';
import { handIndexs } from '../../data/handData';
import { EventManger } from '../../../../typeScript/EventManger';
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


    public static getTopNode() {
        return main_top._topNode;
    }

    onLoad() {
        this.updateMoney()
        this.fitNodeWidgetY(find("root/top", this.node)!, WidgetType.top, -50)
        this.fitNodeWidgetY(find("root/level", this.node)!, WidgetType.top, -20)

        this.bindButton(find("root/top/btnSet", this.node)!, () => {
            uiManager.instance.pushShowDialog(Const.Dialogs.SetDialog)
        })

        this.bindButton(find("root/top/btnAvatar", this.node)!, () => {
            uiManager.instance.pushShowDialog(Const.Dialogs.UserinfoView)
        })

        this.bindButton(find("root/top/gold/addGoldBtn", this.node)!, () => {
            uiManager.instance.pushShowDialog(Const.Dialogs.GetgoldView, 1)
        })

        this.bindButton(find("root/top/power/addGoldBtn", this.node)!, () => {
            uiManager.instance.pushShowDialog(Const.Dialogs.GetgoldView, 2)
        })

        this.expPos =  new Vec3(this.addExpLab.node.parent.position.x, this.addExpLab.node.parent.position.y, this.addExpLab.node.parent.position.z);
    }

    onEnable() {
        this.on(GD.event.updateMoney, this.updateMoney)
        this.on(GD.event.updateMoneyAction, this.updateMoneyAction)
        this.on(GD.event.updateGame, this.refresh)
        this.updateMoney()

        EventManger.eventTarget.on(EventManger.EEventName.ADD_EXP_ANIMATION, this.expAddAnimation, this);

        this.coinLabel.string = userData.coin + ""
        this.diamondsLabel.string = userData.diamonds + ""
        main_top._topNode = this.node
        this.on(GD.event.refreshHandLayer, this.refreshHandLayerRet, this)
        this.refreshHandLayer();

        this.refresh();
    }

    

    refreshHandLayer() {
        let handIndex = mergeBoardModel.getHandIndex();
        if (handIndex == handIndexs.btnLvUp) {
            let obj: any = {};
            obj.id = handIndex;
            obj.node = find("root/level", this.node);
            obj.click2 = 1;
            uiManager.instance.showDialog(Const.Dialogs.HandLayer, obj);
        }
        if (handIndex == handIndexs.btnLvUp3) {
            let lvdata = tables.ins().getTableValueByID(Const.Tables.herolevel, userData.roleLv)
            if (userData.roleExp >= lvdata.exp) {
                let obj: any = {};
                obj.id = handIndex;
                obj.node = find("root/level", this.node);
                obj.click2 = 1;
                uiManager.instance.showDialog(Const.Dialogs.HandLayer, obj);
                //  mergeBoardModel.addHandIndex()
            }
        }
    }

    refreshHandLayerRet() {
        this.refreshHandLayer();
    }

    onDisable() {
        this.off(GD.event.updateMoney, this.updateMoney)
        this.off(GD.event.updateMoneyAction, this.updateMoneyAction)
        this.off(GD.event.refreshHandLayer, this.refreshHandLayerRet)
        this.off(GD.event.updateGame, this)

        EventManger.eventTarget.off(EventManger.EEventName.ADD_EXP_ANIMATION, this.expAddAnimation, this);
    }

    start() {
        let flag = this._layerData.flag
        this.timeLabel.string = ""
        find("root/level", this.node)!.active = (flag & main_top.ShowLevel) != 0
        find("root/top/dressup", this.node)!.active = (flag & main_top.ShowDress) != 0
        find("root/top/gold", this.node)!.active = (flag & main_top.ShowCoin) != 0
        find("root/top/power", this.node)!.active = (flag & main_top.ShowPower) != 0
        find("root/top/diamond", this.node)!.active = (flag & main_top.ShowDiamond) != 0

        // find("root/level", this.node)!.active = false;
        // find("root/top/diamond", this.node)!.active = false

        
    }

    refresh(){
        if (!userData.userInfodata){
            return;
        }
        this.powerLabel.string = userData.power + ""
        this.coinLabel.string = userData.coin + ""

        this.diamondsLabel.string = userData.diamonds + ""

        this.nameLab.string = userData.userInfodata.nickname;
        this.nameIdLab.string = "ID: " + userData.userInfodata.userid + "";
        this.petCountLab.string = "宠物数量: " + userData.pet_count + "";
        this.petScoreLab.string = "宠物积分: " + userData.pet_score + "";

        this.lvLabelNew.string = userData.roleLv + ""
    }

    updateMoney() {
        this.refresh();
        this.powerLabel.string = userData.power + ""
        //  this.coinLabel.string = userData.coin + ""
        // this.diamondsLabel.string = userData.diamonds + ""
        this.lvLabel2.string = userData.roleLv + ""
        this.styleVoucherLabel.string = userData.styleVoucher + ""
        let lvdata = tables.ins().getTableValueByID(Const.Tables.herolevel, userData.roleLv)
        if (lvdata) {
            // this.lvBar2.fillRange = userData.roleExp / lvdata.exp
            this.lvBar2.progress = Math.min(1, userData.roleExp / lvdata.exp)
            this.expLab2.string = userData.roleExp + "/" + lvdata.exp
        }

        if (userData.power < 100) {
            this.timeLabel.getComponent(CdComponent)!.setCD(CDType.CDCountdown, "video_powerAuto", 2 * 60, (time: number) => {
                if (userData.power + time >= 100) {
                    userData.power = Math.max(userData.power, 100)
                    this.timeLabel.getComponent(CdComponent)!.clearCD()
                } else {
                    userData.power += time
                    this.updateMoney()
                }
                this.powerLabel.string = userData.power + ""
            })
        } else {
            this.timeLabel.getComponent(CdComponent)!.clearCD()
        }

        if (userData.roleExp >= lvdata.exp) {
            this.levelEffect2.active = true
            tween(this.star2).to(0.6, { scale: v3(1.1, 1.1, 1.1) }).to(0.6, { scale: v3(1, 1, 1) }).union().repeatForever().start()
        } else {
            this.levelEffect2.active = false
            Tween.stopAllByTarget(this.star2)
            this.star2.scale = v3(1, 1, 1)
        }
    }

    updateMoneyAction() {
        let coinCom = this.coinLabel.getComponent(numAction) || this.coinLabel.addComponent(numAction)
        coinCom!.setTargetNum(userData.coin)

        let diamondsCom = this.diamondsLabel.getComponent(numAction) || this.diamondsLabel.addComponent(numAction)
        diamondsCom!.setTargetNum(userData.diamonds)

        let powerCom = this.powerLabel.getComponent(numAction) || this.powerLabel.addComponent(numAction)
        powerCom!.setTargetNum(userData.power)

        let styleVoucherCom = this.styleVoucherLabel.getComponent(numAction) || this.styleVoucherLabel.addComponent(numAction)
        styleVoucherCom!.setTargetNum(userData.styleVoucher)
    }

    addMoney(event: any, data: any) {
        if (data == 1) { //  获得体力
            //  userData.checkAndUsePower(2)
            //  this.emit(GD.event.updateMoney)
            uiManager.instance.showDialog(Const.Dialogs.ShopPowerDialog)
            //    RechargeManager.RechargeTest()
        } else if (data == 2) { // 获得金币
            uiManager.instance.showDialog(Const.Dialogs.FreeGiftDialog, { type: "4" })
            // if (NATIVE) {
            //     return
            // }
            // uiManager.instance.showDialog(Const.Dialogs.ShopDialog)
        } else if (data == 3) { // 获得钻石
            // if (NATIVE) {
            //     return
            // }
            // uiManager.instance.showDialog(Const.Dialogs.ShopSynthesisDialog)
            uiManager.instance.showDialog(Const.Dialogs.FreeGiftDialog, { type: "1" })

        } else if (data == 4) {
            uiManager.instance.showDialog(Const.Dialogs.FreeGiftDialog, { type: "3" })
        }
    }

    showLevelDialog() {
        mergeBoardModel.closeHandLayer();
        uiManager.instance.pushShowDialog(Const.Dialogs.LevelDialog)
    }

    update() {
        if (userData.power >= 100) {
            this.timeLabel.string = ""
            this.timeLabel.getComponent(CdComponent)!.clearCD()
        }
    }

    lateUpdate() {
        if (mergeBoardModel.getBoardEnergyCooldown() > 0) {
            this.powerLabel.node.active = false;
            this.wuxianEffect.active = true;
            this.timeLabel.string = UtilPub.getDurationStr(mergeBoardModel.getBoardEnergyCooldown());
        } else {
            this.powerLabel.node.active = true;
            this.wuxianEffect.active = false;
        }
    }

    expAddAnimation(exp:number){
        // console.log("合成新道�?);
        userData.roleExp+=exp;
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

