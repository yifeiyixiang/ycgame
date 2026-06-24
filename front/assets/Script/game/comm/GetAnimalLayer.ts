import { _decorator, Node, Prefab, instantiate, Sprite, Label, UITransform, v3, tween, find } from 'cc';
import { Const } from '../../config/Const';
import GD from '../../config/GD';
import { GoodsType } from '../../config/global';
import BaseView from '../../easyFramework/mgr/BaseView';
import { Notifications } from '../../easyFramework/mgr/notifications';
import TableDataService from '../../easyFramework/other/tables';
import { UtilPub } from '../../easyFramework/utils/UtilPub';
import { main_top } from '../UI/main/main_top';
import { MovePath } from './MovePath';
const { ccclass, property } = _decorator;



@ccclass('GetAnimalLayer')
export class GetAnimalLayer extends BaseView {

    @property({ type: Sprite, displayName: "icon" }) icon: Sprite = null!

    get main_top() { return main_top.getTopNode() || find("Canvas/main/root/main_top")! }

    _propdata: any = null
    start() {

    }
    _dir = 0

    show(args: any) {
        super.show(args)
        this.showAni()
    }

    showAni() {
        this._propdata = TableDataService.ins().getTableValueByID(Const.Tables.prop, this._layerData.propId)

        let target = null
        if (this._propdata.type == GoodsType.Coin) {
            target = find("root/top/gold/jb", this.main_top)!
        } else if (this._propdata.type == GoodsType.Diamonds) {
            target = find("root/top/diamond/jb", this.main_top)!
        } else if (this._propdata.type == GoodsType.Power) {
            target = find("root/top/power/jb", this.main_top)!
        } else if (this._propdata.type == GoodsType.StyleVoucher) {
            target = find("root/top/dressup/jb", this.main_top)!
        }
        let startPos = this._layerData.startPos

        let endPos = target != null ? target!.parent!.getComponent(UITransform)!.convertToWorldSpaceAR(target!.position) : this._layerData.endPos

        let delay = this._propdata.type < 100 ? this.node.children.length * 0.1 : 0

        let cb = (sprite: any) => {
            this.setImageCustomSize(this.icon.node, this._propdata.type > 100 ? 70 : 120)
            this.playCoinFlyAnim(this._layerData.num, startPos, endPos, 50, delay)

        }

        this.setSpriteFrame(this.icon, Const.resPath.icon + this._propdata.icon, cb)
        this.icon.node.active = false
        this.scheduleOnce(this.checkClose, 2)
    }

    checkClose() {

        if (this.node.children.length <= 1) {
            this.close()
        }
    }


    protected playCoinFlyAnim(count: number, startPos: any, endPos: any, r: number = 50, delay = 0) {

        let dir = this._dir == 0 ? (Math.random() > 0.5 ? 1 : -1) : this._dir
        this._dir = dir
        for (let index = 0; index < count; index++) {
            let coin = instantiate(this.icon.node);
            coin.active = false

            this.node.addChild(coin);

            let endCb = () => {
                Notifications.emit(GD.event.updateMoneyAction);
                coin.removeFromParent()
                this.scheduleOnce(this.checkClose, 1)
            }

            tween(coin).delay(index * 0.05 + delay).call(() => {
                if (this.node && startPos && endPos){
                    coin.active = true
                    coin.addComponent(MovePath).startMove(startPos, endPos, 2, endCb, dir)
                }
            }).start()
        }

        return


        let points = this.getCirclePoints(r, startPos, count);
        let coinNodeList = points.map(pos => {
            var coin = instantiate(this.icon.node);
            coin.active = true

            this.node.addChild(coin);
            coin.position = v3(pos.x, pos.y, 0);
            coin.scale = v3(0, 0, 0)
            tween(coin).to(0.2, { scale: v3(1.2, 1.2, 1.2) }).to(0.2, { scale: v3(1, 1, 1) }).union().repeatForever().start()
            return {
                node: coin,
                startPos: startPos,
                midPos: pos,
                endPos: endPos,
                dis: this.calcDistance(pos, endPos)
            }
        })


        let i = 0;
        coinNodeList.forEach((item, idx) => {
            i++;
            tween(item.node)
                .to(0.15, { position: v3(item.midPos.x, item.midPos.y, 0) })
                .delay(idx * 0.05 + 0.5 + delay)
                .to(0.35, { position: v3(item.endPos.x, item.endPos.y, 0) })
                .call(() => {
                    item.node.destroy();
                })
                .union()
                .start()
        });
    }

    protected getCirclePoints(r: number, pos: any, count: number, randomScope: number = 50) {
        let points = []
        for (let i = 0; i < count; i++) {
            let radians = (Math.PI / 180) * Math.round(360 / count)
            let x = pos.x + r * Math.sin(radians * i)
            let y = pos.y + r * Math.cos(radians * i)
            points.unshift(v3(x + Math.random() * randomScope, y + Math.random() * randomScope, 0))
        }
        return points
    }






    public calcDistance(pos1: any, pos2: any) {
        let xdiff = pos1.x - pos2.x;
        let ydiff = pos1.y - pos2.y;
        let dis = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
        return dis;
    };

}

