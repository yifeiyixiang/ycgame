import { _decorator, Component, Node,Vec3, Prefab, CCInteger, CCFloat, director } from "cc";
import {PhysicsUtil} from "./PhysicsUtil"
const { ccclass, property } = _decorator;
@ccclass("PhysicsUtilParabolaObj")
export class PhysicsUtilParabolaObj extends Component {

    lineList:Vec3[] = [];

    _Physics:PhysicsUtil =null!





    @property({ type: CCFloat, tooltip: "高度" })
    height:number=16
    @property({ type: CCFloat, tooltip: "重力加速度" })
    gravity:number = -9.8;
    @property({ type: Prefab, tooltip: "描点的预制体" })
    pointPrefab:Prefab = null!;
    @property({ type: CCInteger, tooltip: "抛物线预测计数" })
    segmentCount:number=20

    private playPos:Vec3 = null!
    private targetPos:Vec3 = null!

    private targetFinalPos:Vec3 = null!
    private targetFinalEulerAngles:Vec3 = null!
    private flyNode:Node = null!

    isStart:boolean = false
    isLine:boolean=false
    isLookAtTarget:boolean=false
    calTime:number=0

    cb:Function = null!
    _deltaTime:number=0

    init(targetFinalPos:Vec3, targetFinalEulerAngles:Vec3, cb:Function, height:number=5, gravity:number=-5.8, isLookAtTarget:boolean=true, pointPrefab:Prefab=null!, segmentCount:number=3){
        this.flyNode = this.node;
        this.targetFinalPos = targetFinalPos;
        this.targetFinalEulerAngles = targetFinalEulerAngles;
        this.height=height
        this.gravity=gravity
        this.pointPrefab=pointPrefab
        this.segmentCount=segmentCount
        this.isLookAtTarget=isLookAtTarget
        this._fn_agn(cb)
    }


    _fn_agn(cb:Function)
    {
        this.cb = cb
        this._fn_dt()
        this._Physics = new PhysicsUtil();
        this._fn_el()

        this.isStart=true
        this._fn_aij()
    }

    update (deltaTime: number) {
        this._deltaTime=deltaTime

        this.calTime+=deltaTime
        if(this.isStart){
            this._fn_aij()
        }

    }


    _fn_dt()
    {
        this.lineList=[]
        for(let i=0;i<this.segmentCount;i++){
            this.lineList[i]=Vec3.ZERO
        }
    }


    _fn_el()
    {
        this.playPos=this.flyNode.worldPosition.clone()
        this.targetPos=this.targetFinalPos.clone()
        this._Physics.init(this.playPos,this.targetPos,this.height, this.gravity)


        let timeStep = this._Physics.totalTime/this.segmentCount
        if(this.lineList!=null)
        {
            for(let i=0;i<this.segmentCount;i++)
            {
                let pos = this._Physics._fn_ji(timeStep*i)
                this.lineList[i] = pos
            }
        }
    }


    _fn_aij()
    {

        this._Physics.time=this._Physics.time+this._deltaTime
        this.flyNode.worldPosition =  this._Physics.position;
        this.playPos=this.flyNode.worldPosition.clone()

        if(this.isLookAtTarget){
            this.flyNode.lookAt(this._Physics._fn_ji(this._Physics.time + this._deltaTime));
        }

        if (this._Physics.time >= this._Physics.totalTime)
        {
           this.flyNode.worldPosition=this.targetFinalPos.clone()
           this.flyNode.eulerAngles=this.targetFinalEulerAngles.clone()

           this.cb && this.cb()
           this.isStart=false
           this.isLine=true

        }
    }
}