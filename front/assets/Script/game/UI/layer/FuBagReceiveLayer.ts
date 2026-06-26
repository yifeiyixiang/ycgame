import { Button, find, Label, Node, Sprite, tween, UITransform, v3, Vec3, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import BaseView from '../../../easyFramework/mgr/BaseView';
import TableDataService from '../../../easyFramework/other/tables';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
const { ccclass, property } = _decorator;

@ccclass('FuBagReceiveLayer')
export class FuBagReceiveLayer extends BaseView {


    @property({ type: Node })
    fuBag: Node = null!;

    @property({ type: Node })
    btnSure: Node = null!;

    bagId: number = 0;
    _curIndex = 1

    _rewardList: any = []

    start() {
        this.bindButton(this.btnSure, this.onClickBtnSure);
        this.bindButton(this.fuBag, this.onClickFuBag);

    }

    show(args: any) {
        super.show(args);
        this.bagId = this._layerData.id;
        this.btnSure.active = false
        this.fuBag.active = true
        this._curIndex = 1
        this._rewardList = []
        for (let i = 1; i <= 3; i++) {
            find("root/item" + i, this.node)!.active = false
        }
    }

    onClickPropItem(btn: Button) {
        // @ts-ignore
        let propConfig = btn.node.propRow;
        mergeBoardStateStore.openPropInfoLayer(propConfig.id);
    }

    onClickBtnSure() {
        for (let rewardIndex = 0; rewardIndex < this._rewardList.length; rewardIndex++) {
            const rewardEntry = this._rewardList[rewardIndex];
            console.log("prop : " + rewardEntry[0] + "  num: " + rewardEntry[1])
            mergeBoardStateStore.addPropNum(rewardEntry[0], rewardEntry[1], this.node.getComponent(UITransform)!.convertToWorldSpaceAR(Vec3.ZERO))
        }
        this.close();
    }

    onClickFuBag() {
        let rewardItemNode = find("root/item" + this._curIndex, this.node)!
        rewardItemNode.active = true

        let fuBagRewardList = TableDataService.ins().getTableValueByID(Const.Tables.fuBag, this.bagId).price
        let selectedReward = fuBagRewardList[Math.floor(fuBagRewardList.length * Math.random())]
        let propId = selectedReward[0]
        let rewardCount = selectedReward[1]
        this._rewardList.push(selectedReward)
        let propConfig = TableDataService.ins().getTableValueByID(Const.Tables.prop, propId)
        this.setSpriteFrame(find("icon", rewardItemNode)!.getComponent(Sprite)!, Const.resPath.icon + propConfig.icon, undefined, 100)
        find("num", rewardItemNode)!.getComponent(Label)!.string = "x" + rewardCount
        tween(rewardItemNode).set({ scale: v3(0, 0, 0) }).to(0.2, { scale: v3(1.1, 1.1, 1.1) }).to(0.1, { scale: v3(1, 1, 1) }).call(() => {

        }).start()
        this._curIndex++

        if (this._curIndex > 3) {
            this.fuBag.active = false
            this.btnSure.active = true
        }
    }


}

