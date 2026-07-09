import { _decorator, Vec3,} from "cc";
const { ccclass, property } = _decorator;

@ccclass("PhysicsUtil")
export class PhysicsUtil {
    private m_start:Vec3 = null!
    private m_end:Vec3 = null!
    private m_height:number = 0
    private m_gravity:number = 0
    private m_upTime:number =0
    private m_downTime:number =0
    private m_totalTime:number =0
    private m_velocityStart:Vec3 =null!
    private m_position:Vec3 =null!
    private m_time:number =0


    public get start():Vec3{return this.m_start}

    public get end():Vec3 {return this.m_end}

    public get height():number {return this.m_height}

    public get gravity():number { return this.m_gravity}

    public get upTime():number {return this.m_upTime}

    public get downTime():number {return this.m_downTime}

    public get totalTime():number {return this.m_totalTime}

    public get top():Vec3 {return this._fn_ji(this.m_upTime)}

    public get velocityStart():Vec3 {return this.m_velocityStart}

    public get position():Vec3 {return this.m_position}

    public get velocity():Vec3 {return this._fn_mw(this.m_time)}

    public get time() {return this.m_time;}
    public set time(val) {
        this.m_time = val;
        this.m_position = this._fn_ji(this.m_time);
    }






    init(start:Vec3,end:Vec3,height:number=10,gravity:number=-9.8)
    {
        let topY:number = Math.max(start.y, end.y) + height;
        let d1:number  = topY - start.y;
        let d2:number  = topY - end.y;
        let g2:number  = 2 / -gravity;
        let t1:number  = Math.sqrt(g2 * d1);
        let t2:number  = Math.sqrt(g2 * d2);
        let t:number  = t1 + t2;
        let vX:number  = (end.x - start.x) / t;
        let vZ:number  = (end.z - start.z) / t;
        let vY:number  = -gravity * t1;
        this.m_start = start;
        this.m_end = end;
        this.m_height = height;
        this.m_gravity = gravity;
        this.m_upTime = t1;
        this.m_downTime = t2;
        this.m_totalTime = t;
        this.m_velocityStart = new Vec3(vX, vY, vZ);
        this.m_position = this.m_start;
        this.m_time = 0;
    }


    public _fn_ji(time:number):Vec3
    {
        if (time == 0) {
            return this.m_start;
        }
        if (time == this.m_totalTime) {
            return this.m_end;
        }
        let dY:number = 0.5 * this.m_gravity * time * time;
        let vector3:Vec3= new Vec3(this.m_velocityStart.x*time,this.m_velocityStart.y*time,this.m_velocityStart.z*time)
        let dYVec3:Vec3=new Vec3(0+this.m_start.x+vector3.x, dY+this.m_start.y+vector3.y, (0+this.m_start.z+vector3.z))
        return dYVec3
    }


    public _fn_mw(time:number):Vec3
    {
        if (time == 0) return this.m_velocityStart;
        let dYVec3=new Vec3(0+this.m_velocityStart.x, this.m_velocityStart.y +this.m_velocityStart.y + (this.m_gravity * time), this.m_velocityStart.z)
        return dYVec3
    }
}
