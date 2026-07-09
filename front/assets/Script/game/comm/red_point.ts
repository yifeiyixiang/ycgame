import { _decorator, tween, Vec3, v3,Sprite } from 'cc';
import {  GRedPoint } from '../../config/global';
import { BaseUiComponent } from '../../easyFramework/mgr/comm';
const { ccclass, property } = _decorator;

@ccclass('red_point')
export class RedPointIndicatorController extends BaseUiComponent {
    @property({ type: GRedPoint, displayName: "埋点信息" })
    redPointPos: number = -1;

    data:any=null!
    skillId:number=0
    petId:number=0
    sp:Sprite=null!
    oriAngle:Vec3=null!
    onlineItemData:any={}
    dailyTaskData:any={}

    start() {
        this.oriAngle= this.node.eulerAngles.clone()
        this.ani()
        this.sp = this.node.getComponent(Sprite)!
    }

    ani(){
        this.aniTween.stop()
        this.node.eulerAngles = this.oriAngle
        this.aniTween = tween(this.node).repeatForever(
            tween()
                .by(0.2, {eulerAngles:v3(0,0,10)})
                .by(0.2, {eulerAngles:v3(0,0,-20)})
                .by(0.2, {eulerAngles:v3(0,0,10)})
                .to(0.1, {eulerAngles:this.oriAngle})
                .delay(0.5)
        ).start()
    }

    onEnable(){
        this.sp = this.node.getComponent(Sprite)!
        this.sp.enabled = this._fn_qw(this.redPointPos)
    }


    _fn_qw(pos:number){
        return false
    }



    update(deltaTime: number) {
        this.calTime+=deltaTime
        if(this.calTime>1.2){
            this.calTime=0
            this.sp.enabled = this._fn_qw(this.redPointPos)
            if(this.sp.enabled==true){
                this.ani()
            }else{
                this.aniTween.stop()
            }
        }
    }
}

