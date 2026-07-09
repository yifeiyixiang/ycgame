import { Button, find, instantiate, Layout, Node, ProgressBar, ScrollView, Sprite, UIOpacity, UITransform, v2, v3, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { localText } from '../../../config/localText';
import BaseView from '../../../easyFramework/mgr/BaseView';
import TableDataService from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
import { seasonProgressStore } from '../../comm/playerModel';
import { main_top } from '../main/main_top';
const { ccclass, property } = _decorator;

@ccclass('SeasonPassLayer')
export class SeasonPassLayer extends BaseView {

    @property({ type: Node })
    btnClose: Node = null!;

    @property({ type: Node })
    nextProgress: Node = null!;
    @property({ type: Node })
    scoreNode: Node = null!;
    @property({ type: Node })
    lvNode: Node = null!;

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

        this.addPrefab(Const.Prefabs.Main_top, this.node, null!, { parentNode: this.node, flag: main_top.ShowLevel | main_top.ShowCoin | main_top.ShowPower | main_top.ShowDiamond });

        this.bindButton(this.btnClose, this._fn_sz);
    }

    onEnable() {
        this.on(GD.event.overMonth, this._fn_wp);

    }

    onDisable() {
        this.off(GD.event.overMonth, this._fn_wp);

    }

    show() {
        this._fn_ph();
    }

    _fn_ph() {
        this._fn_zy();
        this._fn_zh();
        this._fn_zj();
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
        this.progressNode.getComponent(ProgressBar)!.totalLength = len - 8;

        let y = len + itemHeight * 0.5;
        this.progressNode.position = v3(0, -y);

        this.scheduleOnce(() => {

            let dy = (chs.length - seasonProgressStore.seasonId - 3) * itemHeight;
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
        let info = seasonProgressStore._fn_lb(row.id);

        let lvNode = find("rank/lv", itemUI)!;
        let rankBg1Node = find("rank/bg1", itemUI)!;
        let rankBg2Node = find("rank/bg2", itemUI)!;
        rankBg1Node.active = false;
        rankBg2Node.active = false;
        if (row.lv == 0) {
            rankBg1Node.active = true;
            lvNode.active = false;
            find("star", rankBg1Node)!.active = true;
        } else {
            lvNode.active = true;
            if (info) {
                rankBg1Node.active = true;
                find("star", rankBg1Node)!.active = false;
            } else {
                rankBg2Node.active = true;
            }
        }
        this._fn_ago(lvNode, row.lv);

        let award1 = row.award1;
        let propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, award1[0]);
        let award1Node = find("award1", itemUI)!;
        // @ts-ignore
        award1Node.row = row;
        this.bindButton(award1Node, this._fn_sr);
        let btnInfo1 = find("btnInfo", award1Node)!;
        btnInfo1.active = false;
        if (mergeBoardStateStore._fn_xr(propRow.id)) {
            btnInfo1.active = true;
            // @ts-ignore
            btnInfo1.propRow = propRow;
            let propRowid = propRow.id
            this.bindButton(btnInfo1, () => {
                mergeBoardStateStore._fn_wh(propRowid);
            });
        }

        this._fn_agl(find("icon", award1Node)!.getComponent(Sprite)!, Const.resPath.icon + propRow.icon);
        this._fn_ago(find("num", award1Node)!, "x" + award1[1]);
        let get1Node = find("get", award1Node)!;
        let gou1Node = find("gou", award1Node)!;
        get1Node.active = false;
        gou1Node.active = false;
        if (info) {

            award1Node.getComponent(UIOpacity)!.opacity = 255;
            if (info.a1) {

                gou1Node.active = true;
            } else {

                get1Node.active = true;
            }
        } else {

            award1Node.getComponent(UIOpacity)!.opacity = 170;
        }

        let award2 = row.award2;
        propRow = TableDataService.ins()._fn_ly(Const.Tables.prop, award2[0]);
        let award2Node = find("award2", itemUI)!;
        // @ts-ignore
        award2Node.row = row;
        this.bindButton(award2Node, this._fn_ss);

        let btnInfo2 = find("btnInfo", award2Node)!;
        btnInfo2.active = false;
        if (mergeBoardStateStore._fn_xr(propRow.id)) {
            btnInfo2.active = true;
            // @ts-ignore
            btnInfo2.propRow = propRow;
            let propRowid = propRow.id

            this.bindButton(btnInfo2, () => {
                mergeBoardStateStore._fn_wh(propRowid);
            });
        }

        this._fn_agl(find("icon", award2Node)?.getComponent(Sprite)!, Const.resPath.icon + propRow.icon);
        this._fn_ago(find("num", award2Node)!, "x" + award2[1]);
        let get2Node = find("get", award2Node)!;
        let gou2Node = find("gou", award2Node)!;
        let lock2Node = find("lock", award2Node)!;
        get2Node.active = false;
        gou2Node.active = false;
        lock2Node.active = false;
        if (info) {

            award2Node.getComponent(UIOpacity)!.opacity = 255;
            if (!info.a1) {
                lock2Node.active = true;
            }
            if (info.a2) {

                gou2Node.active = true;
            } else if (info.a1) {

                get2Node.active = true;
            }
        } else {
            award2Node.getComponent(UIOpacity)!.opacity = 170;
        }

    }

    _fn_wp() {
        this._fn_ph();
    }

    _fn_sr(btn: Button) {
        // @ts-ignore
        let row = btn.node.row;
        let info = seasonProgressStore._fn_lb(row.id);
        if (!info || info.a1) {
            return;
        }
        seasonProgressStore._fn_ade(row.id, UtilPub._fn_dp(btn.node));
        this._fn_yt(btn.node.parent!, row);
    }

    _fn_ss(btn: Button) {
        // @ts-ignore
        let row = btn.node.row;
        let info = seasonProgressStore._fn_lb(row.id);
        if (!info || !info.a1 || info.a2) {
            return;
        }
        mergeBoardStateStore._fn_we("战令超级会员奖励", (isAward: any) => {
            if (isAward) {
                seasonProgressStore._fn_adf(row.id, UtilPub._fn_dp(btn.node));
                this._fn_yt(btn.node.parent!, row);
            }
        });
    }

    _fn_sz() {
        this.close();





    }

}

