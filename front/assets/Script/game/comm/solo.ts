import { _decorator, Component, Node, Vec3, tween, v3, EventTouch, Vec2, v2, macro} from 'cc';
import { Const } from '../../config/Const';
import { BaseUiComponent } from '../../easyFramework/mgr/comm';
import { UtilPub } from '../../easyFramework/utils/UtilPub';
const { ccclass, property } = _decorator;




@ccclass('solo')
export class solo extends BaseUiComponent {

    @property({ type: Node, displayName: "camera_相机对象" })
    camera3D: Node = null!;
    @property({ type: Node, displayName: "opsPoint_操作点" })
    opsPoint: Node = null!;


    camera:Node=null!
    oriPos:Vec3= v3()
    isShow: boolean = true
    isTouch: boolean = false
    calTime: number = 2
    startPos1: Vec2 = v2()
    startPos2: Vec2 = v2()
    pointsDis: number = 0

    start() {
        macro.ENABLE_MULTI_TOUCH = true;
        this.camera = this.camera3D.getChildByName("Camera")!
        this.oriPos = this.camera.getPosition().clone()
        this.onTouchEvent()
        Const.SoloCameraParent = this.camera3D.parent!


    }

    onTouchEvent() {
        this.node.on(Node.EventType.TOUCH_START, (event: EventTouch) => {
            let touches = event.getTouches();
            UtilPub.log("--------touches start", touches.length)
            if (touches.length == 1) {
                let touchPos = event.getUILocation()

                if (UtilPub.IsPointInNodeArea2D(this.opsPoint, touchPos)) {
                    this.isTouch = true

                }
            }
            else if (touches.length == 2) {
                this.startPos1 = touches[0].getUILocation()
                this.startPos2 = touches[1].getUILocation()
                this.pointsDis = Vec2.distance(this.startPos1, this.startPos2)
            }

        }, this)

        this.node.on(Node.EventType.TOUCH_MOVE, (event: EventTouch) => {

            let touches = event.getTouches();

            if (touches.length == 1) {
                if (this.isTouch) {
                    let ePos = event.getUIDelta()
                    let oriFake = this.camera3D.getWorldPosition()
                    let elu = this.camera3D.eulerAngles
                    let eluX = elu.x + ePos.y * 0.1
                    if(eluX>-1){
                        eluX = -1
                    }
                    if(eluX<-30){
                        eluX = -30
                    }
                    this.camera3D.eulerAngles = v3(eluX, elu.y - ePos.x * 0.5, elu.z )

                }
            }
            else if (touches.length == 2) {

                let touchPoint1 = touches[0].getUILocation()
                let touchPoint2 = touches[1].getUILocation()
                let newPointsDis = Vec2.distance(touchPoint1, touchPoint2)


                if (!this.pointsDis){
                    this.pointsDis = 0;
                }

                if (newPointsDis < this.pointsDis) {

                    this.pointsDis = newPointsDis;
                    let cameraPos = this.camera.getPosition()

                    if(cameraPos.z<=this.oriPos.z*2){
                        cameraPos.z += 0.25
                        this.camera.setPosition(cameraPos)
                    }

                }else if (newPointsDis > this.pointsDis) {

                    this.pointsDis = newPointsDis;
                    let cameraPos = this.camera.getPosition()
                    if(cameraPos.z>=this.oriPos.z/2){
                        cameraPos.z -= 0.25
                        this.camera.setPosition(cameraPos)
                    }
                }

            }


        }, this)
        this.node.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
            this.isTouch = false
        }, this)
        this.node.on(Node.EventType.TOUCH_CANCEL, (event: EventTouch) => {
            this.isTouch = false
        }, this)

    }

    offTouchEvent() {
        this.node.off(Node.EventType.TOUCH_START);
        this.node.off(Node.EventType.TOUCH_MOVE);
        this.node.off(Node.EventType.TOUCH_END);
        this.node.off(Node.EventType.TOUCH_CANCEL);
    }


    update(deltaTime: number) {





















    }
}

