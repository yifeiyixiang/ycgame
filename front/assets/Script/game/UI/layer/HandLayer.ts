import { find, Node, RichText, sp, tween, Tween, UIOpacity, UITransform, v3, view, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { AnimationCtrl } from '../../comm/AnimationCtrl';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
import { handData } from '../../data/handData';
import { GamePlatform } from '../../platform/GamePlatform';
const { ccclass, property } = _decorator;

@ccclass('HandLayer')
export class HandLayer extends BaseView {

    @property({ type: Node })
    bgNode: Node = null!;
    @property({ type: Node })
    uiNode: Node = null!;

    @property({ type: Node })
    btnOver: Node = null!;

    @property({ type: Node })
    maskNode: Node = null!;
    @property({ type: Node })
    areaBgNode: Node = null!;

    @property({ type: Node })
    dialogNode: Node = null!;
    @property({ type: Node })
    infoNode: Node = null!;

    @property({ type: Node })
    handNode: Node = null!;

    id: number = 0;
    handIndex: number = 0;

    startNode: any;
    endNode: any;
    obj: any

    onLoad() {
        this.bindButton(this.btnOver, this._fn_th);

        if (Const.isOnline) {
            this.btnOver.active = false;
        }

        let visibleHeight = view.getVisibleSize().height;
        let designHeight = view.getDesignResolutionSize().height;
        if (visibleHeight < designHeight) {
            let s = visibleHeight / designHeight;
            this.dialogNode.scale = v3(s, s, 1);
        }

        this.on(GD.event.canvasTouchEvent, this.canvasTouchEvent, this)
    }

    canvasTouchEvent() {
        if (this.obj.weak) {

            this.close()
        }
    }

    show(obj: any) {



        this.obj = obj

        let id = obj.id;
        if (id <= this.id && obj.weak != true) {
            return;
        }

        this.id = id;
        this.unschedule(this._fn_pi)
        this.startNode = obj.startNode;
        this.endNode = obj.endNode;

        if (obj.delayTime > 0) {
            this.bgNode.active = true;
            this.uiNode.active = false;
            this.scheduleOnce(this._fn_pi, obj.delayTime);
        } else {
            this._fn_ph(obj);
        }
    }

    _fn_pi() {
        this._fn_ph(this.obj)
    }

    _fn_ph(obj: any) {
        let id = this.id;

        this.bgNode.active = false;
        this.uiNode.active = true;

        let node = obj.node;
        let nodeHand = obj.nodeHand;
        this.handIndex = id;

        let data = handData[id];
        let bottom = data.dialogBottom;


        Tween.stopAllByTarget(this.maskNode);

        let pos = UtilPub._fn_dp(node);
        pos = UtilPub._fn_do(this.maskNode, pos);
        let ratio = 1;
        if (obj.isScene) {

            let visibleSize = view.getVisibleSize();
            ratio = visibleSize.height * 0.5 / 1000;


            let referNode = obj.referNode;
            referNode = Const.CameraScene.node;
            let dx = node.worldPosition.x - referNode.worldPosition.x;
            let dy = node.worldPosition.y - referNode.worldPosition.y;
            pos.x = dx * visibleSize.height * 0.5 / 1000;
            pos.y = dy * visibleSize.height * 0.5 / 1000;
        }
        if (obj.dx) {
            pos.x += obj.dx;
        }
        if (obj.dy) {
            pos.y += obj.dy;
        }

        tween(this.maskNode).to(0.3, { position: pos.clone() }).start();
        let tf = this.maskNode.getComponent(UITransform)!;
        Tween.stopAllByTarget(tf);
        if (ratio == 1) {
            ratio = node.worldScale.x;
        }
        let width = node.getComponent(UITransform).width * ratio;
        let height = node.getComponent(UITransform).height * ratio;
        let anchorY = node.getComponent(UITransform).anchorY;
        tween(tf).to(0.3, { width: width, height: height }).start();

        let areaTf = this.areaBgNode.getComponent(UITransform);
        tween(areaTf).to(0.3, { width: width + 10, height: height + 10 }).start();


        this.dialogNode.active = false;
        if (data.content) {
            this.scheduleOnce(() => {
                this.dialogNode.active = true;
                if (obj.weak) {
                    this.dialogNode.active = false
                }
                this.infoNode.getComponent(RichText)!.string = "<color=#a47d63>" + data.content + "</color>";
                if (data.dialogPos) {

                    this.dialogNode.position = data.dialogPos;
                } else if (bottom) {

                    let dh = anchorY * height + this.dialogNode.getComponent(UITransform)!.height * 0.5 + 30;
                    this.dialogNode.position = v3(0, pos.y - dh);
                } else {

                    let dh = (1 - anchorY) * height + this.dialogNode.getComponent(UITransform)!.height * 0.5 + 30;
                    this.dialogNode.position = v3(0, pos.y + dh);
                }




            }, 0.2);
        }


        this.handNode.active = true;
        Tween.stopAllByTarget(this.handNode);
        this.handNode.getComponent(UIOpacity)!.opacity = 255;
        if (obj.startNode && obj.endNode) {

            let startNode = obj.startNode;
            let endNode = obj.endNode;
            Tween.stopAllByTarget(this.handNode);
            let endPos = UtilPub._fn_dp(endNode);
            endPos = UtilPub._fn_do(this.handNode, endPos);

            let handOpacity = this.handNode.getComponent(UIOpacity)!;
            tween(this.handNode).call(() => {
                UtilPub._fn_afg(this.handNode, startNode);
                handOpacity.opacity = 255;
                this.handNode.getComponent(sp.Skeleton)!.paused = false;
                this.handNode.getComponent(AnimationCtrl)!.playAnimation("move", true);
            }).delay(0.5).call(() => {
                this.handNode.getComponent(sp.Skeleton)!.paused = true;
            }).to(0.6, { position: endPos }).to(0.5, {}, {
                onUpdate(target, ratio) {
                    let op = (1 - ratio!) * 255;
                    handOpacity.opacity = op;
                }
            }).union().repeatForever().start();
        } else {

            let handPos = pos.clone();
            if (nodeHand) {
                handPos = UtilPub._fn_dp(nodeHand);
                handPos = UtilPub._fn_do(this.handNode, handPos);
            }
            this.handNode.position = handPos;
            this.handNode.getComponent(sp.Skeleton)!.paused = false;
            let clickName = "click";



            this.handNode.getComponent(AnimationCtrl)!.playAnimation(clickName, true);
        }

        if (obj.weak) {
            this.maskNode.active = false
            this.dialogNode.active = false
        } else {
            this.maskNode.active = true
            this.dialogNode.active = true
        }
    }



    hideHand() {
        this.handNode.active = false;
    }

    _fn_nk() {
        this.dialogNode.active = false;
    }

    close() {
        super.close();
    }

    _fn_th() {
        let handIndex = mergeBoardStateStore._fn_hj();
        for (let i = handIndex; i < handData.length; i++) {
            GamePlatform._fn_aja("完成新手教程" + i);
        }
        mergeBoardStateStore._fn_aev(handData.length);
        this.close();
    }

    update(dt: number) {

        let chs = find("Canvas")!.children;
        if (chs.length > 0 && chs[chs.length - 1] != this.node) {
            let parent = this.node.parent;
            this.node.parent = null;
            this.node.parent = parent;
        }
    }

}

