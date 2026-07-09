
import { AssetManager, AudioClip, Color, Component, Label, Node, Prefab, SpriteFrame, TextAsset, Tween, UIOpacity, UITransform, Vec2, Vec3, _decorator, assetManager, renderer, sp, tween, v2, v3 } from 'cc';
import { Const } from '../../config/Const';
import DataManager from '../../config/DataManager';
import { AudioPlaybackService } from '../mgr/audioManager';
import { NodePoolService } from '../mgr/poolManager';
import { ResourceLoaderService } from '../mgr/resourceUtil';
import { MathRandom, MathUtil } from './UtilsMath';
const { ccclass, property } = _decorator;

// @ts-ignore
import md5 from "./md5.js";




@ccclass('UtilPub')
export class UtilPub extends Component {

    public static isStartGame: boolean = false

    public static _fn_yh(len: number) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        var maxPos = $chars.length;
        var pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    public static md5(info: any) {
        return md5(info);
    }







    public static _fn_po(polygon: Array<Array<number>>, point: Array<number>) {

        var x = point[0], y = point[1];
        var inside = false;
        for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            var xi = polygon[i][0], yi = polygon[i][1];
            var xj = polygon[j][0], yj = polygon[j][1];
            var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }






    public static _fn_afg(node: Node, otherNode: Node) {
        let pos = this._fn_dp(otherNode);
        pos = this._fn_do(node, pos);
        node.position = pos;
    }






    public static _fn_aid(arr: any, compareFunc: Function) {
        if (!arr || arr.length <= 1) {
            return arr;
        }
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                let item1 = arr[i];
                let item2 = arr[j];
                if (compareFunc(item1, item2)) {
                    arr[i] = item2;
                    arr[j] = item1;
                }
            }
        }
    }








    public static _fn_kp(arr: any, num: number, canRepeat?: boolean) {
        if (!num) {
            num = 1;
        }
        var ret = [];
        arr = JSON.parse(JSON.stringify(arr));
        for (var i = 0; i < num; i++) {
            if (arr.length <= 0) {
                break;
            }
            var row = this._fn_ko(arr);
            ret.push(row);
            if (!canRepeat) {
                var index = arr.indexOf(row);
                arr.splice(index, 1);
            }
        }
        return ret;
    }






    public static _fn_ko(arr: any, totalWeight?: number) {
        if (!totalWeight) {
            totalWeight = 0;
            for (var i in arr) {
                var weight = arr[i].weight;
                if (!weight) {
                    weight = 0;
                }
                totalWeight += weight;
            }
        }
        var random = Math.random() * totalWeight;
        var left = 0;
        var row = null;
        for (var i in arr) {
            var tmpRow = arr[i];
            var weight = tmpRow.weight;
            if (!weight) {
                weight = 0;
            }
            if (random >= left && random < left + weight) {
                row = tmpRow;
                break;
            }
            left += weight;
        }

        return row;
    }







    public static _fn_jv(arr: any, isRemove: boolean = false) {
        if (!arr || arr.length <= 0) {
            return null;
        }
        let index = Math.floor(Math.random() * arr.length);
        let item = arr[index];
        if (isRemove) {
            arr.splice(index, 1);
        }

        return item;
    }


    public static _fn_ey(arr: any, cb: Function) {
        for (let i = 0, len = arr.length; i < len; i++) {
            if (cb(arr[i], i)) {
                return;
            }
        }
    }

    public static _fn_ex(arr: any, cb: Function, isReverse: boolean = false) {
        if (isReverse) {
            for (let i = arr.length - 1; i >= 0; i--) {
                let tmpArr = arr[i];
                for (let j = 0, len2 = tmpArr.length; j < len2; j++) {
                    if (cb(tmpArr[j], i, j)) {
                        return;
                    }
                }
            }
            return;
        }
        for (let i = 0, len = arr.length; i < len; i++) {
            let tmpArr = arr[i];
            for (let j = 0, len2 = tmpArr.length; j < len2; j++) {
                if (cb(tmpArr[j], i, j)) {
                    return;
                }
            }
        }
    }






    public static _fn_dp(node: Node, isCenter?: boolean): Vec3 {
        let transform = node.parent!.getComponent(UITransform);

        let pos = node.getPosition();
        if (isCenter) {
            let tf = node.getComponent(UITransform)!;
            pos.x = pos.x + (0.5 - tf.anchorX) * tf.width;
            pos.y = pos.y + (0.5 - tf.anchorY) * tf.height;
        }

        return transform!.convertToWorldSpaceAR(pos);
    }

    public static _fn_dq(node: Node, pos: Vec3): Vec3 {
        let transform = node.parent!.getComponent(UITransform);
        pos = transform!.convertToWorldSpaceAR(pos);

        return pos;
    }






    public static _fn_do(node: Node, pos: Vec3): Vec3 {
        if (node.parent == null) {
            return Vec3.ZERO
        }
        let transform = node.parent!.getComponent(UITransform);

        return transform!.convertToNodeSpaceAR(pos);
    }

    public static _fn_pu(obj: any) {
        for (let key in obj) {
            return false
        }
        return true
    }

    public static debug(...parameters: any[]) {
        if (Const.isDebug == true) {
            console.debug(...parameters)
        }
    }

    public static log(...parameters: any[]) {
        if (Const.isOnline == false) {
            console.log(...parameters)
        }
    }
    public static warn(...parameters: any[]) {
        console.warn(...parameters)
    }
    public static error(...parameters: any[]) {
        console.error(...parameters)
    }


    public static num2(num: number) {
        return Number(num.toFixed(2))
    }

    public static _fn_si(num: number) {
        if (num < 10) {
            return "0" + num
        } else {
            return "" + num
        }
    }

    public static _fn_sj(num: number) {
        if (num < 10) {
            return "00" + num
        } else if (num < 100) {
            return "0" + num
        } else {
            return num + ""
        }
    }


    public static loadBundle(name: string) {
        return new Promise<AssetManager.Bundle>(result => {
            let b = assetManager.getBundle(name)
            if (b != null) return result(b);
            assetManager.loadBundle(name, (err, bundle) => {
                result(bundle);
                if (err) {
                    return console.error(err);
                }
                if (err) {
                    console.error('加载bundle错误:', name, err)
                    return;
                }
                UtilPub.log("加载完成", name)
            })
        })
    }


    public static _fn_re(bundleName: string) {
        return new Promise<void>((resolve, reject) => {
            ResourceLoaderService._fn_rp(bundleName, "./", (err, res) => {
                UtilPub.log("加载音乐数据----------", res.length)
                for (let i = 0; i < res.length; i++) {
                    let audioClip = res[i] as AudioClip
                    AudioPlaybackService.instance.clips[audioClip.name] = audioClip
                }
                resolve()
            })
        })
    }


    public static _fn_rg() {
        return new Promise<void>((resolve, reject) => {
            ResourceLoaderService._fn_rp('config', "./", (err, res) => {



                for (let i = 0; i < res.length; i++) {
                    let textAsset = res[i] as TextAsset
                    let items = textAsset.text.split("\n");
                    DataManager._fn_nf(textAsset.name, items);
                }
                resolve()
            })
        })
    }


    public static _fn_rm() {
        return new Promise<void>((resolve, reject) => {
            ResourceLoaderService._fn_rp('img', "./icons", (err, res) => {


                UtilPub.log("spriteFrames data----------", res.length)
                for (let i = 0; i < res.length; i++) {
                    let spAsset = res[i] as SpriteFrame
                    ResourceLoaderService.spriteFrames[spAsset.name] = spAsset
                }
                UtilPub.log("spriteFrames data----------", ResourceLoaderService.spriteFrames.length)
                resolve()
            })
        })
    }

    public static _fn_rr(url: any, cb?: Function) {
        let bundleName = url.split("|")[0]
        let pathName = url.split("|")[1]

        let bundleObj = assetManager.getBundle(bundleName)!;

        let res = bundleObj.get(pathName, sp.SkeletonData);
        if (res) {
            if (cb) {
                cb(null, res);
            }
            return;
        }
        bundleObj!.load(pathName, sp.SkeletonData, (err, res) => {
            if (cb) {
                cb(err, res);
            }
        });
    }

    public static _fn_je(pname: any, cb: Function) {



        if (ResourceLoaderService.spriteFrames.hasOwnProperty(pname)) {
            let p = ResourceLoaderService.spriteFrames[pname]
            cb(p)
        } else {
            ResourceLoaderService._fn_rq(pname + "/spriteFrame", SpriteFrame, (err, sf) => {

                if (err) {
                    console.error("-----------not find pname", pname)
                    return
                }
                ResourceLoaderService.spriteFrames[pname] = sf;
                cb(ResourceLoaderService.spriteFrames[pname])
            })
        }
    }

    public static _fn_jf(pname: any, cb: Function) {



        if (ResourceLoaderService.spriteFrames.hasOwnProperty(pname)) {
            let p = ResourceLoaderService.spriteFrames[pname]
            cb(p)
        } else {
            ResourceLoaderService._fn_rq(pname + "/spriteFrame", SpriteFrame, (err, sf) => {

                if (err) {

                    cb();
                    return
                }
                ResourceLoaderService.spriteFrames[pname] = sf;
                cb(ResourceLoaderService.spriteFrames[pname])
            })
        }
    }

    public static _fn_jj(prefabPath: string, cb: Function) {
        let arr = prefabPath.split("/")
        let pname = arr[arr.length - 1]

        if (ResourceLoaderService.prefabs.hasOwnProperty(pname)) {
            let p = ResourceLoaderService.prefabs[pname]
            cb(p)
        } else {
            ResourceLoaderService._fn_rq(prefabPath, Prefab, (err, prefab) => {
                if (err) {
                    console.log("========loadResWithBundle error:", prefabPath, err.message);
                }
                ResourceLoaderService.prefabs[pname] = prefab
                cb(prefab)
            })
        }
    }






















    public static _fn_fr(): number {
        // @ts-ignore
        if (window.wx) {
            //@ts-ignore
            const sys = window.wx.getSystemInfoSync();
            const isIOS = sys.system.indexOf('iOS') >= 0;
            if (isIOS) {
                const model = sys.model;

                const ultraLowPhoneType = ['iPhone1,1', 'iPhone1,2', 'iPhone2,1', 'iPhone3,1', 'iPhone3,3', 'iPhone4,1', 'iPhone5,1', 'iPhone5,2', 'iPhone5,3', 'iPhone5,4', 'iPhone6,1', 'iPhone6,2'];

                const lowPhoneType = ['iPhone6,2', 'iPhone7,1', 'iPhone7,2', 'iPhone8,1', 'iPhone8,2', 'iPhone8,4'];

                const middlePhoneType = ['iPhone9,1', 'iPhone9,2', 'iPhone9,3', 'iPhone9,4', 'iPhone10,1', 'iPhone10,2', 'iPhone10,3', 'iPhone10,4', 'iPhone10,5', 'iPhone10,6', 'iPhone11,2', 'iPhone11,4', 'iPhone11,6', 'iPhone11,8'];

                const highPhoneType = ['iPhone12,1', 'iPhone12,3', 'iPhone12,5', 'iPhone12,8', 'iPhone13', 'iPhone14', 'iPhone15', 'iPhone16', 'iPhone17', 'iPhone18', 'iPhone19', 'iPhone20'];
                for (let i = 0; i < ultraLowPhoneType.length; i++) {
                    if (model.indexOf(ultraLowPhoneType[i]) >= 0)
                        return 5;
                }
                for (let i = 0; i < lowPhoneType.length; i++) {
                    if (model.indexOf(lowPhoneType[i]) >= 0)
                        return 10;
                }
                for (let i = 0; i < middlePhoneType.length; i++) {
                    if (model.indexOf(middlePhoneType[i]) >= 0)
                        return 20;
                }
                for (let i = 0; i < highPhoneType.length; i++) {
                    if (model.indexOf(highPhoneType[i]) >= 0)
                        return 21;
                }

                return -1;
            } else {
                return sys.benchmarkLevel;
            }
        } else {
            return 50;
        }
    }










    public static _fn_sh(label: Label, oriVal: number, addVal: number, cnt: number, cb: Function, perTime: number = 0.1) {
        if (cnt <= 0) {
            cb && cb()
            return
        }
        label.string = Math.round(oriVal + Math.round(addVal / cnt)) + ""
        cnt--
        tween(label.node).delay(perTime).call(() => {
            this._fn_sh(label, oriVal, addVal, cnt, cb, perTime)
        }).start()
    }




    public static _fn_bx() {
        UtilPub.log("----判断低端机的性能等级", UtilPub._fn_fr())
        let checkBenchmark = 22;
        return UtilPub._fn_fr() < checkBenchmark
    }











    public static _fn_ab(startNode: Node, endNode: Node, radio: number, deltaX: number, deltaY: number, duration: number, cb: Function) {
        let e = endNode.getComponent(UITransform)!.convertToWorldSpaceAR(new Vec3(0, 0, 0))
        let eNode = startNode.parent!.getComponent(UITransform)!.convertToNodeSpaceAR(e)



        let pArr = []
        let p1 = startNode.position
        let p2 = eNode
        let cp = UtilPub._fn_z(p1, p2, radio, deltaX, deltaY)

        for (let i = 0; i < 30; i++) {
            let p = UtilPub._fn_af(i / 30, p1, cp, p2)
            pArr.push(new Vec3(p[0], p[1], startNode.position.z))

        }
        pArr.push(eNode)
        UtilPub._fn_aa(pArr, startNode, 0, duration, cb)
    }











    public static _fn_ac(startNode: Node, delta: Vec3, radio: number, deltaX: number, deltaY: number, duration: number, cb: Function) {


        let pArr = []
        let p1 = startNode.position
        let p2 = new Vec3(startNode.position.x + delta.x, startNode.position.y + delta.y, startNode.position.z + delta.z)
        let cp = UtilPub._fn_z(p1, p2, radio, deltaX, deltaY)

        for (let i = 0; i < 30; i++) {
            let p = UtilPub._fn_af(i / 30, p1, cp, p2)
            pArr.push(new Vec3(p[0], p[1], 0))

        }
        pArr.push(p2)
        UtilPub._fn_aa(pArr, startNode, 0, duration, cb)
    }











    public static _fn_ad(startNode: Node, endPoint: Vec3, radio: number, deltaX: number, deltaY: number, duration: number, cb: Function) {


        let pArr = []
        let p1 = startNode.worldPosition
        let p2 = endPoint
        let cp = UtilPub._fn_z(p1, p2, radio, deltaX, deltaY)

        for (let i = 0; i < 30; i++) {
            let p = UtilPub._fn_af(i / 30, p1, cp, p2)
            pArr.push(new Vec3(p[0], p[1], 0))
            console.log("------通用贝塞尔接口------", p)
        }
        pArr.push(p2)
        UtilPub._fn_aa(pArr, startNode, 0, duration, cb)
    }










    public static _fn_aa(pArr: Vec3[], startNode: Node, i: number, duration: number, cb: Function) {
        if (i > pArr.length) {
            cb && cb()
            return;
        }
        if (startNode == undefined) return
        tween(startNode).to(duration / pArr.length, { position: pArr[i] }).call(() => {
            UtilPub._fn_aa(pArr, startNode, i + 1, duration, cb)
        }).start()
    }










    public static _fn_z(p1: any, p2: any, radio: any, deltaX: any, deltaY: any) {
        return new Vec3((p1.x + p2.x) * radio + deltaX, (p1.y + p2.y) * radio + deltaY, 1)
    }






    public static _fn_ae(t: number, p1: any, p2: any) {
        const x1 = p1.x
        const x2 = p2.x
        const y1 = p1.y
        const y2 = p2.y

        let x = x1 + (x2 - x1) * t;
        let y = y1 + (y2 - y1) * t;
        return [x, y];
    }








    public static _fn_af(t: number, p1: any, cp: any, p2: any) {
        const x1 = p1.x
        const x2 = p2.x
        const y1 = p1.y
        const y2 = p2.y
        const cx = cp.x
        const cy = cp.y
        let x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2;
        let y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
        return [Math.round(x), Math.round(y)];
    }

































    public static _fn_agu(target: Node, times: number = 8, range: number = 0.1) {
        let oriPos = target.position
        UtilPub._fn_a(target, new Vec3(oriPos.x, oriPos.y, oriPos.z), times, range)
    }

    private static _fn_a(target: Node, oriPos: Vec3, times: number, range: number) {
        let randOffsetX = UtilPub._fn_ym(0, 1) == 1 ? range : -range
        let randOffsetY = UtilPub._fn_ym(0, 1) == 1 ? range : -range
        let randOffsetZ = UtilPub._fn_ym(0, 1) == 1 ? range : -range
        tween(target)
            .to(0.05, { position: new Vec3(oriPos.x + randOffsetX, oriPos.y + randOffsetY, oriPos.z + randOffsetZ) })
            .call(() => {
                times--
                if (times > 0) {
                    UtilPub._fn_a(target, oriPos, times, range)
                } else {
                    target.setPosition(oriPos)
                }
            }).start()
    }


    public static _fn_ym(min: number, max: number) {
        if (min > max) {
            let tmp = min
            min = max
            max = tmp
        } else if (min == max) {
            return min
        }
        return Math.round(Math.random() * (max - min) + min);
    }


    public static _fn_iq(obj: any[], key: string): any[] {
        let res = []
        for (let i = 0; i < obj.length; i++) {
            let row = obj[i]
            UtilPub.log("-------row", row, key, row[key])
            res.push(row[key])
        }
        return res
    }


    public static _fn_yn(min: number, max: number, num: number) {
        let arr = []
        for (let i = min; i < max; i++) {
            arr.push(i)
        }
        let res: number[] = []
        UtilPub._fn_jw(arr, num, res)
        return res
    }

    private static _fn_jw(arr: number[], num: number, res: number[]) {



        UtilPub._fn_aia(arr)
        let element = arr.shift()
        if (element) {
            res.push(element)
        }
        num -= 1
        if (num >= 0) {
            this._fn_jw(arr, num, res)
        } else {
            return res
        }
    }


    public static _fn_yd(dataArr: any[], num: number) {
        let res = []
        if (dataArr.length < num) {
            UtilPub.log("--------参数违规----!!!")
            return []
        }
        while (true) {
            let idx = UtilPub._fn_ym(0, dataArr.length - 1)
            let isExist = res.find(e => e === idx)
            if (isExist == null) {
                res.push(idx)
            }

            if (res.length >= num) break;
        }
        return res
    }


    public static _fn_ye(dataArr: any[], num: number) {
        let weightIds = []
        let res: number[] = []
        for (let i = 0; i < dataArr.length; i++) {
            weightIds.push(dataArr[i].weight)
        }
        while (true) {
            let idx = UtilPub._fn_yj(weightIds)
            let isExist = res.find(e => e === idx)
            if (isExist == null) {
                res.push(idx)
            }

            if (res.length >= num) break;
        }
        return res
    }

    public static _fn_aia(array: number[]) {
        var j, x, i;
        for (i = array.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = array[i - 1];
            array[i - 1] = array[j];
            array[j] = x;
        }
        return array;
    }

    public static _fn_ajf(cur: Node, target: Node, isAni: boolean = false, aniTween: Tween<any> = null!, cb?: Function) {
        let oriX = cur.eulerAngles.x
        let oriZ = cur.eulerAngles.z
        let oriY = cur.eulerAngles.y
        if (isAni) {
            cur.lookAt(target.worldPosition)
            let final = v3(oriX, cur.eulerAngles.y, oriZ)
            cur.eulerAngles = v3(oriX, oriY, oriZ)
            let t = Math.abs(oriY - final.y) / 180
            aniTween.stop()
            aniTween = tween(cur).to(t, { position: final }).call(() => {
                cb && cb()
            }).start()
        } else {
            cur.lookAt(target.worldPosition)
            cur.eulerAngles = v3(oriX, cur.eulerAngles.y, oriZ)
        }

    }
    public static _fn_ajg(cur: Node, target: Vec3, isAni: boolean = false, aniTween: Tween<any> = null!, cb?: Function) {
        let oriX = cur.eulerAngles.x
        let oriZ = cur.eulerAngles.z
        let oriY = cur.eulerAngles.y
        if (isAni) {
            cur.lookAt(target)
            let final = v3(oriX, cur.eulerAngles.y, oriZ)
            cur.eulerAngles = v3(oriX, oriY, oriZ)
            let t = Math.abs(oriY - final.y) / 180
            aniTween.stop()
            aniTween = tween(cur).to(t, { position: final }).call(() => {
                cb && cb()
            }).start()
        } else {
            cur.lookAt(target)
            cur.eulerAngles = v3(oriX, cur.eulerAngles.y, oriZ)
        }


    }



    public static _fn_iu(row: any, lv: number) {
        let p = []
        for (let i = 1; i < 7; i++) {
            let val = row[`p${i}`]
            if (val) {
                if (val[lv]) {
                    p.push(val[lv])
                } else {
                    p.push(val[val.length - 1])
                }
            }
        }
        return p
    }


    public static _fn_ez(desc: string, ...args: any) {
        let str = desc;
        let len = args.length;
        for (let i = 1; i < len + 1; i++) {
            const value = args[i - 1];
            let key = `{p${i}}`;
            UtilPub.log("------key", key, value)
            str = str.replace(key, value + "");
        }
        return str
    }

    public static _fn_gu(pos1: Vec3, pos2: Vec3) {
        let xdiff = pos1.x - pos2.x;
        let ydiff = pos1.y - pos2.y;
        let zdiff = pos1.z - pos2.z
        let dis = Math.pow((xdiff * xdiff + ydiff * ydiff + zdiff * zdiff), 0.5);
        return dis;
    }

    public static _fn_gv(pos1: Vec3, pos2: Vec3) {
        let xdiff = pos1.x - pos2.x;
        let ydiff = pos1.y - pos2.y;
        let dis = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
        return dis;
    }

    /**
     * @description: 使用一个id数组，一个权重数组，根据权重数组刷一个id出来，配合randomWeightsByAttr可以随领域词条
     * @author ctj
     * @date 2021/9/6 11:30
     * @version 1.0
     * @return 返回idsArr中的id
     */
    public static _fn_yk(idsArr: any[], weightArr: number[]) {
        let totalWeight = 0;
        for (let i = 0; i < weightArr.length; i++) {
            totalWeight += weightArr[i];
        }
        let ran = UtilPub._fn_ym(1, totalWeight);
        let calWeight = 0;
        for (let i = 0; i < weightArr.length; i++) {
            calWeight += weightArr[i];

            if (ran <= calWeight) {
                return idsArr[i];
            }
        }
        return idsArr[Math.floor(Math.random() * (idsArr.length - 1))]
    }

    public static _fn_yj(weights: number[]) {
        let totalWeight = 0;
        for (let i = 0; i < weights.length; i++) {
            totalWeight += weights[i];
        }
        let ran = UtilPub._fn_ym(1, totalWeight);
        for (let i = 0; i < weights.length; i++) {
            const weight = weights[i];
            if (ran <= weight) {

                return i;
            }
            else {
                ran -= weight;
            }
        }
        return 0
    }







    public static _fn_rl(prefabName: string, parentNode: Node) {
        return new Promise<Node>((resolve, reject) => {
            if (parentNode.children.length == 0) {
                ResourceLoaderService._fn_rq(prefabName, Prefab, (err, prefab) => {
                    let item = NodePoolService.instance.getNode(prefab, parentNode)!
                    item.worldPosition = parentNode.worldPosition
                    resolve(item)
                })
            } else {
                resolve(parentNode.children[0])
            }
        })
    }


    public static _fn_air(_time: number) {

        let time = Math.round(_time);
        let t = Number(time);
        let h = Math.floor(t / 3600);
        let m = Math.floor((t - h * 3600) / 60);
        let s = t % 60;
        let str_h = h < 10 ? '0' + h : h;
        let str_m = m < 10 ? '0' + m : m;
        let str_s = s < 10 ? '0' + s : s;
        if (h != 0) {
            let str = `${str_h}:${str_m}:${str_s}`;
            return str;
        }
        else {
            let str = `${str_m}:${str_s}`;
            return str;
        }
    }

    public static _fn_mm(d: number) {
        var ret = "";
        if (d < 0) {
            d = 0;
        }

        d = d / 1000;
        var hours = Math.floor(d / 3600);
        var mins = Math.floor((d - hours * 3600) / 60);
        var seconds = Math.floor(d - hours * 3600 - mins * 60);

        if (hours >= 10) {
            ret = ret + hours + ":";
        } else {
            ret = ret + "0" + hours + ":";
        }

        if (mins >= 10) {
            ret = ret + mins + ":";
        } else {
            ret = ret + "0" + mins + ":";
        }
        if (seconds >= 10) {
            ret = ret + seconds;
        } else {
            ret = ret + "0" + seconds;
        }

        return ret;
    }





    public static _fn_gw(duration: number) {
        if (duration < 0) {
            duration = 0;
        }
        let dt = Math.ceil(duration / 1000);
        let d = Math.floor(dt / (3600 * 24));
        let h = Math.floor((dt - d * 24 * 3600) / 3600);
        let m = Math.floor((dt - d * 24 * 3600 - h * 3600) / 60);
        let s = dt - d * 24 * 3600 - h * 3600 - m * 60;
        let str = "";
        if (d > 0) {
            str = d + "d";
        }
        if (h > 0) {
            str += h + "h";
        }
        if (m > 0) {
            str += m + "m";
        }
        str += s + "s";

        return str;
    }





    public static _fn_gx(duration: number) {
        if (duration < 0) {
            duration = 0;
        }
        let dt = Math.ceil(duration / 1000);
        let d = Math.floor(dt / (3600 * 24));
        let h = Math.floor((dt - d * 24 * 3600) / 3600);
        let m = Math.floor((dt - d * 24 * 3600 - h * 3600) / 60);
        let s = dt - d * 24 * 3600 - h * 3600 - m * 60;
        let str = "";
        if (d > 0) {
            str = d + "d" + h + "h";
        } else if (h > 0) {
            str = h + "h" + m + "m";
        } else if (m > 0) {
            str = m + "m" + s + "s";
        } else {
            str = s + "s";
        }

        return str;
    }

    public static _fn_as(node: Node, s: number = 0.98) {
        let oriScale = node.scale
        return tween(node).repeatForever(
            tween()
                .to(0.5, { scale: new Vec3(s * oriScale.x, s * oriScale.y, s * oriScale.z) })
                .to(0.5, { scale: new Vec3(1 * oriScale.x, 1 * oriScale.y, 1 * oriScale.z) })


        ).start()
    }

    public static _fn_agv(node: Node, s: number = 1.2) {
        let oriScale = node.scale
        return tween(node).repeatForever(
            tween()
                .to(0.2, { scale: new Vec3(s * oriScale.x, s * oriScale.y, s * oriScale.z) })
                .to(0.2, { scale: new Vec3(1 * oriScale.x, 1 * oriScale.y, 1 * oriScale.z) })
                .to(0.2, { scale: new Vec3(s * oriScale.x, s * oriScale.y, s * oriScale.z) })
                .to(0.2, { scale: new Vec3(1 * oriScale.x, 1 * oriScale.y, 1 * oriScale.z) })
                .delay(2.5)
        ).start()
    }

    public static _fn_ar(node: UIOpacity) {
        return tween(node).repeatForever(
            tween()
                .to(0.5, { opacity: 50 })
                .to(0.5, { opacity: 255 })
                .to(0.5, { opacity: 50 })
                .to(0.5, { opacity: 255 })
        ).start()
    }

    public static _fn_aq(node: Node, y: number = 1) {
        return tween(node).repeatForever(
            tween()
                .to(3, { position: v3(0, 15 + y, 0) })
                .to(3, { position: v3(0, y, 0) })
                .to(3, { position: v3(0, 30 + y, 0) })
                .to(3, { position: v3(0, y, 0) })
        ).start()
    }






    public static _fn_ahv(node: Node, idx: number) {
        for (let i = 0; i < node.children.length; i++) {
            node.children[i].active = (idx == i)
        }
    }

    public static _fn_yl(pos: Vec3, x: number, y: number, z: number) {
        let r1 = MathRandom._fn_ho()._fn_yg(-x * 100, x * 100) / 100
        let r2 = MathRandom._fn_ho()._fn_yg(-y * 100, y * 100) / 100
        let r3 = MathRandom._fn_ho()._fn_yg(-z * 100, z * 100) / 100
        pos.x += r1
        pos.y += r2
        pos.z += r3
        return pos
    }





    public static _fn_fq(left: Vec3, mid: Vec3): Vec3 {
        let vec = v3(0, 0, 0)
        vec.x = 2 * mid.x - left.x
        vec.y = 2 * mid.y - left.y
        vec.z = 2 * mid.z - left.z
        return vec
    }


    public static _fn_ep(node: Node, center: Vec3 = null!) {
        let enemy = node.getChildByName("root")!
        let bottom = node.getChildByName("bottom")!
        enemy.eulerAngles = v3(0, 0, 0)
        let pos = enemy.getWorldPosition().clone()
        let nodePos = node.worldPosition
        let h = MathRandom._fn_ho()._fn_yg(20, 40) / 10
        let t = 1 + (h / 4) / 3
        let delta = v3(0, 0, 0)
        if (center) {
            let dis = MathUtil._fn_ho()._fn_av(center, node.worldPosition)
            Vec3.subtract(delta, node.worldPosition, center)

            let range = 2
            if (dis > range) dis = range
            let mul = 4.2 * ((range - dis) / range)
            delta.multiplyScalar(mul)

        }
        pos.x += delta.x
        pos.z += delta.z

        tween(bottom).to(0.6 * t, { worldPosition: v3(pos.x, bottom.worldPosition.y, pos.z) }).start()

        tween(enemy)
            .to(0.6 * t, { worldPosition: v3(pos.x, pos.y + h, pos.z) }).call(() => { })
            .delay(0.3)
            .to(0.1, { worldPosition: v3(pos.x, (pos.y + h) * 0.8, pos.z) })
            .to(0.1, { worldPosition: v3(pos.x, (pos.y + h) * 0.5, pos.z) })
            .to(0.1, { worldPosition: v3(pos.x, (pos.y + h) * 0.3, pos.z) })
            .to(0.1, { worldPosition: v3(pos.x, (pos.y + h) * 0.1, pos.z) })
            .to(0.1, { worldPosition: v3(pos.x, 0, pos.z) })
            .start()
        let randAngle1 = MathRandom._fn_ho()._fn_yg(-360, 360)
        let randAngle2 = MathRandom._fn_ho()._fn_yg(-360, 360)
        let randAngle3 = MathRandom._fn_ho()._fn_yg(-360, 360)
        let randAngle4 = MathRandom._fn_ho()._fn_yg(-360, 360)
        let randAngle5 = MathRandom._fn_ho()._fn_yg(-360, 360)
        let randAngle6 = MathRandom._fn_ho()._fn_yg(-360, 360)
        tween(enemy)
            .to(1.5, { eulerAngles: v3(randAngle1, randAngle2, randAngle3) })
            .to(0.1, { eulerAngles: v3(0, randAngle2, 0) })


            .start()


    }


















    public static _fn_jh(sPos: Vec3, ePos: Vec3, cnt: number = 30): Vec3[] {
        let pArr = []
        let p1 = v2(sPos.x, sPos.z)
        let p2 = v2(ePos.x, sPos.z)
        for (let i = 0; i < cnt; i++) {
            let p = UtilPub._fn_ae(i / cnt, p1, p2)
            pArr.push(v3(p[0], ePos.y, p[1]))

        }
        pArr.push(ePos)
        return pArr
    }







    public static _fn_qi(node: Node, pos: Vec2) {
        const nodeUIT = node.getComponent(UITransform)!;
        let wordPos = nodeUIT.convertToWorldSpaceAR(new Vec3(0, 0, 0))


        if (pos.x < wordPos.x + nodeUIT.width / 2 && pos.x > wordPos.x - nodeUIT.width / 2) {

            if (pos.y < wordPos.y + nodeUIT.height / 2 && pos.y > wordPos.y - nodeUIT.height / 2) {

                return true
            }
        }
        return false
    }






    public static _fn_qh(pos: Vec3, wordPos: Vec3, width: number, height: number) {




        if (pos.x < wordPos.x + width / 2 && pos.x > wordPos.x - width / 2) {

            if (pos.y < wordPos.y + height / 2 && pos.y > wordPos.y - height / 2) {

                return true
            }
        }
        return false
    }

    public static _fn_ee(num: number) {
        return Math.floor(num * 100) / 100
    }











    public static _fn_er(duration: number, frame: number, cnt: number, pass: renderer.Pass, color: Color, meshNode: Node) {


        if (cnt <= 0) {
            return
        }
        let interval = duration / frame
        let total = duration * frame
        let opacity = Math.round(255 * (cnt / total))

        tween(meshNode).call(() => {
            const h = pass.getHandle('mainColor');

            color.a = opacity
            pass.setUniform(h, color)
            cnt -= 1
        }).delay(interval).call(() => {
            UtilPub._fn_er(duration, frame, cnt, pass, color, meshNode)
        }).start()
    }


    public static _fn_dk(node: Node, sec: number, cbEach: Function, cbFinal: Function) {
        setTimeout(() => {
            if (node.active) {
                if (sec > 0) {
                    sec -= 1
                    cbEach && cbEach(sec)
                    this._fn_dk(node, sec, cbEach, cbFinal)
                } else {

                    cbFinal && cbFinal()
                }
            }
        }, 1000)
    }

    public static _fn_aer(node: Node, size: number) {
        let nodeH = node.getComponent(UITransform)?.height
        let nodeW = node.getComponent(UITransform)?.width

        let scale = Math.min(size / nodeW!, size / nodeH!)
        node.scale = v3(scale, scale, scale)

    }

}

