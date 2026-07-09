import { Button, find, instantiate, Layout, Node, ProgressBar, ScrollView, Sprite, UITransform, v2, v3, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { localText } from '../../../config/localText';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
import { seasonProgressStore } from '../../comm/playerModel';
const { ccclass, property } = _decorator;

@ccclass('SeasonRoadmapLayer')
export class SeasonRoadmapLayer extends BaseView {

    @property({ type: Node })
    btnClose: Node = null!;
    @property({ type: Node })
    btnHelp: Node = null!;
    @property({ type: Node })
    btnBuy: Node = null!;

    @property({ type: Node })
    nextProgress: Node = null!;
    @property({ type: Node })
    scoreNode: Node = null!;
    @property({ type: Node })
    lvNode: Node = null!;
    @property({ type: Node })
    timeNode: Node = null!;

    @property({ type: Node })
    listNode: Node = null!;
    @property({ type: Node })
    contentNode: Node = null!;

    @property({ type: Node })
    progressNode: Node = null!;

    @property({ type: Node })
    itemLayer: Node = null!;
    @property({ type: Node })
    awardItem: Node = null!;

    onLoad() {
        this.awardItem.parent = this.node;
        this.awardItem.active = false;

        this.bindButton(this.btnClose, this._fn_sz);
        this.bindButton(this.btnHelp, this._fn_te);
        this.bindButton(this.btnBuy, this._fn_sw);
    }

    onEnable() {
        this.on(GD.event.overMonth, this._fn_wp);

        this.schedule(this._fn_ajo, 1);
    }

    onDisable() {
        this.off(GD.event.overMonth, this._fn_wp);

        this.unschedule(this._fn_ajo);
    }

    show() {
        this._fn_ph();
    }

    _fn_ph() {
        this._fn_zy();
        this._fn_zh();
        this._fn_zj();
        this._fn_ajo();
    }

    _fn_zy() {
        let nextRow = TableDataService.ins()._fn_ly(Const.Tables.seasonPass, seasonProgressStore.seasonId + 1);
        if (nextRow) {
            this._fn_ago(this.scoreNode, seasonProgressStore.seasonScore + "/" + nextRow.num);
            this._fn_afm(this.nextProgress, seasonProgressStore.seasonScore / nextRow.num);
            this._fn_ago(this.lvNode, nextRow.lv);
        } else {
            this._fn_ago(this.lvNode, seasonProgressStore.seasonId - 1);
            this._fn_ago(this.scoreNode, localText.lvMax);
            this._fn_afm(this.nextProgress, 1);
        }
    }

    _fn_zh() {
        this.itemLayer.removeAllChildren();
        let tb = TableDataService.ins()._fn_lt(Const.Tables.seasonPass);
        for (let i = tb.length - 1; i >= 0; i--) {
            let row = tb[i];
            let itemUI = instantiate(this.awardItem);
            itemUI.active = true;
            itemUI.parent = this.itemLayer;
            this._fn_yt(itemUI, row);
        }

        let itemLayout = this.itemLayer.getComponent(Layout)!;
        itemLayout.updateLayout();
        this.contentNode.getComponent(UITransform)!.height = this.itemLayer.getComponent(UITransform)!.height + 100;

        let itemHeight = this.awardItem.getComponent(UITransform)!.height;

        let chs = this.itemLayer.children;

        let len = (chs.length - 1) * (itemHeight + itemLayout.spacingY);
        this.progressNode.getComponent(UITransform)!.height = len;
        this.progressNode.getComponent(ProgressBar)!.totalLength = len;

        let y = len + itemHeight * 0.5;
        this.progressNode.position = v3(0, -y);

        this.scheduleOnce(() => {

            let dy = (chs.length - seasonProgressStore.seasonId - 5) * itemHeight;
            this.listNode.getComponent(ScrollView)!.scrollToOffset(v2(0, dy));
        });
    }

    _fn_zj() {
        let tb = TableDataService.ins()._fn_lt(Const.Tables.seasonPass);
        let nextRow = TableDataService.ins()._fn_ly(Const.Tables.seasonPass, seasonProgressStore.seasonId + 1);
        if (nextRow) {
            let oneP = 1 / (tb.length - 1);
            let p = oneP * (seasonProgressStore.seasonId - 1) + seasonProgressStore.seasonScore / nextRow.num * oneP;
            this._fn_afm(this.progressNode, p);
        } else {
            this._fn_afm(this.progressNode, 1);
        }
    }

    _fn_yt(itemUI: Node, row: any) {
        this._fn_ago(find("rank/lv", itemUI), row.lv);

        let info = seasonProgressStore._fn_lb(row.id);

        let award1 = row.award1;
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, award1[0]);
        let award1Node = find("award1", itemUI)!;
        // @ts-ignore
        award1Node.row = row;
        this.bindButton(award1Node, this._fn_sr);

        this._fn_agl(find("icon", award1Node)!.getComponent(Sprite)!, Const.resPath.icon + propRow.icon);
        this._fn_ago(find("num", award1Node)!, "x" + award1[1]);
        let get1Node = find("get", award1Node)!;
        if (info && !info.a1) {
            get1Node.active = true;
        } else {
            get1Node.active = false;
        }

        let award2 = row.award2;
        propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, award2[0]);
        let award2Node = find("award2", itemUI)!;
        // @ts-ignore
        award2Node.row = row;
        this.bindButton(award2Node, this._fn_ss);
        this._fn_agl(find("icon", award2Node)?.getComponent(Sprite)!, Const.resPath.icon + propRow.icon);
        this._fn_ago(find("num", award2Node)!, "x" + award2[1]);
        let get2Node = find("get", award2Node)!;
        if (info && !info.a2) {
            get2Node.active = true;
        } else {
            get2Node.active = false;
        }

    }

    _fn_wp() {
        this._fn_ph();
    }

    _fn_ajo() {
        let nowTime = mergeBoardStateStore._fn_gm();

        let tmpTime = new Date(nowTime);
        tmpTime.setMonth(tmpTime.getMonth() + 1);
        tmpTime.setDate(0);
        let monthDay = tmpTime.getDate();

        let monthStart = new Date(nowTime);
        monthStart.setDate(1);
        monthStart.setHours(0);
        monthStart.setMinutes(0);
        monthStart.setSeconds(0);
        monthStart.setMilliseconds(0);

        let addDayTime = monthDay * 24 * 60 * 60 * 1000;
        let monthEndTime = monthStart.getTime() + addDayTime;

        let dt = monthEndTime - nowTime;

        let timeStr = UtilPub._fn_gx(dt);
        this._fn_ago(this.timeNode, timeStr);

    }

    _fn_sr(btn: Button) {
        // @ts-ignore
        let row = btn.node.row;
        let info = seasonProgressStore._fn_lb(row.id);
        if (!info || info.a1) {
            return;
        }
        seasonProgressStore._fn_ade(row.id);
        this._fn_yt(btn.node.parent!, row);
    }

    _fn_ss(btn: Button) {


        // @ts-ignore
        let row = btn.node.row;
        let info = seasonProgressStore._fn_lb(row.id);
        if (!info || info.a2) {
            return;
        }
        seasonProgressStore._fn_adf(row.id);
        this._fn_yt(btn.node.parent!, row);
    }

    _fn_sz() {
        this.close();





    }

    _fn_te() {
        UiLayerService.instance._fn_ahg(Const.Dialogs.SeasonGuideLayer);
    }

    _fn_sw() {
        UiLayerService.instance._fn_ahg(Const.Dialogs.SeasonAccessLayer);
    }

}

