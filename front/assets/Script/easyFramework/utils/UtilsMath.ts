import { _decorator, Component, Node, Vec2, Vec3, math } from "cc";
const { ccclass, property } = _decorator;

@ccclass("UtilsMath")








export default class UtilsMath {



    public textNumString(num: number, len: number = 2) {
        let need = len - String(num).length;
        let str = "";
        for (let i = 0; i < need; i++) {
            str += "0";
        }
        str += num;
        return str;
    }






    public calcDistance(pos1: Vec2 | Vec3, pos2: Vec2 | Vec3) {
        let xdiff = pos1.x - pos2.x;
        let ydiff = pos1.y - pos2.y;
        let dis = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
        return dis;
    };






    public fixAngle(angle: number): number {
        angle = -angle % 360;
        if (angle > 180)
            angle = -180 + angle % 180;
        else if (angle < -180)
            angle = 180 + angle % 180;
        return angle;
    }






    public getRandom(maxNum: number, minNum: number): number {
        return MathRandom.getInstance().randomRange(minNum, maxNum);
    };
    public getRandom2(maxNum: number, minNum: number, floatLen: number = 0): number {
        let ranNum = 0;
        ranNum = MathRandom.getInstance().random() * (maxNum - minNum + 1) + minNum;
        if (floatLen > 0) {
            ranNum = parseFloat(ranNum.toFixed(floatLen));
        } else
            ranNum = parseInt(ranNum + '');
        return ranNum;
    };
    public getRandom3(maxNum: number, minNum: number, floatLen: number = 0): number {
        let ranNum = 0;
        ranNum = Math.random() * (maxNum - minNum + 1) + minNum;
        if (floatLen > 0) {
            ranNum = parseFloat(ranNum.toFixed(floatLen));
        } else
            ranNum = parseInt(ranNum + '');
        return ranNum;
    };

    public setRandomSeed(value: number): void {
        MathRandom.getInstance().setSeed(value);
    };







    public toFixedUnRound(nOriginalNum: number, nFixed: number, bCeil: boolean = false) {
        let nNewValue = 0
        let nEqualPower = Math.pow(10, nFixed)
        if (bCeil) {
            nNewValue = Math.ceil(nOriginalNum * nEqualPower) / nEqualPower
        } else {
            nNewValue = Math.floor(nOriginalNum * nEqualPower) / nEqualPower
        }
        return nNewValue
    }






    public toFixed(value: number, len: number = 2, mode: number = 1){
        let pow = Math.pow(10, len);
        switch (mode) {
            case 1: return Math.round(value * pow) / pow;
            case 2: return Math.ceil(value * pow) / pow;
            case 3: return Math.floor(value * pow) / pow;
        }
    };








    public getDirection(x: number, y: number, z: number, node: Node): Vec3 {
        const result = new Vec3(x, y, z);
        math.Vec3.transformQuat(result, result, node.getRotation());
        return result;
    }
};






export class MathRandom {
    private static _instance: MathRandom = null;
    public static getInstance(): MathRandom {
        if (!MathRandom._instance) {
            MathRandom._instance = new MathRandom();
        }
        return this._instance;
    }

    public _seed = 12345;




    public setSeed(value: number): void {
        this._seed = value;
    };

    public random(): number {





        this._seed = (this._seed * 9301 + 49297) % 233280;
        return Math.ceil(this._seed);
    }







    public randomRange(min: number, max: number): number {








        return Math.round(Math.random() * (max - min) + min);
    }






    public RandomNumBoth(Min: number, Max: number): number {

        var Range = Max - Min;

        var Rand = Math.random();

        var num = Min + Math.round(Rand * Range);

        return num;

    }
};


export class MathUtil {
    private static _instance: MathUtil = null;
    public static getInstance(): MathUtil {
        if (!MathUtil._instance) {
            MathUtil._instance = new MathUtil();
        }
        return this._instance;
    }









    public getPointB(x: number, y: number, radius: number, angle): Vec2 {
        let newX: number = x + radius * Math.cos(this.getEulerAngle(angle));
        let newY: number = y + radius * Math.sin(this.getEulerAngle(angle));
        return cc.v2(newX, newY);
    }





    public getEulerAngle(angle: number): number {
        return angle * Math.PI / 180;
    };






    public getAngle2(pos1: Vec2, pos2: Vec2, is360: boolean = false): number {
        let x: number = pos2.x - pos1.x;
        let y: number = pos2.y - pos1.y;
        let xrad = Math.atan2(y, x)
        let angle: number = xrad / Math.PI * 180;
        if (is360 && angle < 0)
            angle += 360;
        return angle;
    }







    public getAngle(x1: number, y1: number, x2: number, y2: number): number {
        let radian: number = this.getRadian(x1, y1, x2, y2);
        let angle: number = 180 / (Math.PI / radian);
        let x: number = x2 - x1;
        let y: number = y2 - y1;
        if (y < 0)
            angle = -angle;
        else if ((y == 0) && (x < 0))
            angle = 180;
        return angle;
    }








    public getRadian(x1: number, y1: number, x2: number, y2: number): number {

        let x: number = x2 - x1;
        let y: number = y2 - y1;
        let hypotenuse: number = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

        let cos: number = x / hypotenuse;
        let radian: number = Math.acos(cos);
        return radian;
    }







    public calcDistance3D(pos1: Vec3, pos2: Vec3) {
        let xdiff = pos1.x - pos2.x;
        let ydiff = pos1.y - pos2.y;
        let zdiff = pos1.z - pos2.z
        let dis = Math.pow((xdiff * xdiff + ydiff * ydiff + zdiff * zdiff), 0.5);
        return dis;
    };






    public calcDistance(pos1: Vec2 | Vec3, pos2: Vec2 | Vec3) {
        let xdiff = pos1.x - pos2.x;
        let ydiff = pos1.y - pos2.y;
        let dis = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
        return dis;
    };
}