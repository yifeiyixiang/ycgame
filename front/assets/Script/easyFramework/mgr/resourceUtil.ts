import { Asset, assetManager, AssetManager, error, find, sp,ImageAsset, instantiate, isValid, loader, Node, Prefab, resources, Sprite, SpriteFrame, Texture2D, _decorator } from "cc";
import { UtilPub } from "../utils/UtilPub";
import { PetProfileRecord, ShopConfigRecord } from "../../../typeScript/gameData";
import TableDataService from "../other/tables";
import { Const } from "../../config/Const";
export type Constructor<T = unknown> = new (...args: any[]) => T;
export type AssetType<T = Asset> = Constructor<T>;
export type LoadCompleteCallback<T> = (error: Error | null, asset: T) => void;
export type LoadDirCompleteCallback<T = Asset> = (error: Error | null, asset: Asset[]) => void;
const { ccclass } = _decorator;

declare global {
    namespace globalThis {
        var LZString: any;
    }
}

interface ITextAsset {
    text?: string;
    _file?: string;
    json?: string
}

@ccclass("resourceUtil")
export class ResourceLoaderService {
    public static dialog: { [key: string]: Node } = {}
    public static prefabs: { [key: string]: Prefab } = {}
    public static spriteFrames: { [key: string]: SpriteFrame } = {}

    public static preloadPrefabs(ps: any) {
        return new Promise<void>((resolve, reject) => {
            let cnt = Object.keys(ps).length
            UtilPub.log("----------加载预制体 个数", cnt)
            for (let key in ps) {
                if (ps.hasOwnProperty(key)) {
                    let url = ps[key]
                    let bundleName = url.split("|")[0]
                    let pathName = url.split("|")[1]

                    assetManager.getBundle(bundleName)!.load(pathName, Prefab, (err, res) => {
                        if (err) {
                            error(err.message || err);
                            reject()
                            return;
                        } else {
                            this.prefabs[key] = res
                            UtilPub.log("----------加载预制体", url)
                            cnt -= 1
                            if (cnt == 0) {
                                resolve()
                            }
                        }
                    })
                }
            }
        })
    }

    public static preloadPrefab(ps: string) {
        return new Promise<Prefab>((resolve, reject) => {
            let cnt = 1
            let url = ps
            let bundleName = url.split("|")[0]
            let pathName = url.split("|")[1]
            let arr = url.split("/")
            let key = arr[arr.length - 1]

            assetManager.getBundle(bundleName)!.load(pathName, Prefab, (err, res) => {
                if (err) {
                    error(err.message || err);
                    reject()
                    return;
                } else {
                    this.prefabs[key] = res
                    resolve(res)
                }
            })
        })
    }

    public static loadRes<T extends Asset>(url: string, type: AssetType<T> | null, cb?: LoadCompleteCallback<T>) {
        if (type) {
            resources.load(url, type, (err, res) => {
                if (err) {
                    error(err.message || err);
                    if (cb) {
                        cb(err, res);
                    }

                    return;
                }
                if (cb) { cb(err, res); }
            });
        } else {
            resources.load(url, (err, res) => {
                if (err) {
                    error(err.message || err);
                    if (cb) {
                        cb(err, res as T);
                    }
                    return;
                }
                if (cb) { cb(err, res as T); }
            });
        }
    }

    public static bandleHandler<T extends Asset>(bundleObj: AssetManager.Bundle | null, pathName: string, type: AssetType<T> | null, cb?: LoadCompleteCallback<T>) {
        if (type) {
            bundleObj!.load(pathName, type, (err, res) => {
                if (err) {
                    error(err.message || err);
                    if (cb) {
                        cb(err, res);
                    }

                    return;
                }

                if (cb) { cb(err, res); }
            });
        } else {
            bundleObj!.load(pathName, (err, res) => {
                if (err) {
                    error(err.message || err);
                    if (cb) {
                        cb(err, res as T);
                    }
                    return;
                }

                if (cb) { cb(err, res as T); }
            });
        }
    }


    public static loadResWithBundle<T extends Asset>(url: string, type: AssetType<T> | null, cb?: LoadCompleteCallback<T>) {

        let bundleName = url.split("|")[0]
        let pathName = url.split("|")[1]

        let bundleObj = assetManager.getBundle(bundleName)

        if (bundleObj == null) {
            console.log("---开始下载---", bundleName, pathName, bundleObj)
            UtilPub.loadBundle(bundleName).then((bundle: AssetManager.Bundle | null) => {
                this.bandleHandler(bundle, pathName, type, cb)
            })
        } else {
            this.bandleHandler(bundleObj, pathName, type, cb)
        }

    }
    public static loadResDirWithBundle<T extends Asset>(bundleName: string, dir: string, cb?: LoadDirCompleteCallback<T>) {
        let bundleObj = assetManager.getBundle(bundleName)
        bundleObj!.loadDir(dir, (err, res) => {
            if (err) {
                error(err.message || err);
                if (cb) {
                    cb(err, res);
                }

                return;
            }
            if (cb) { cb(err, res); }
        });
    }






    public static getUIPrefabRes(prefabPath: string, cb?: (err: Error | null, asset?: Prefab) => void) {
        this.loadRes(prefabPath, Prefab, cb);
    }


    public static getUIPrefabResWithBundle(prefabPath: string, cb?: (err: Error | null, asset?: Prefab) => void) {
        this.loadResWithBundle(prefabPath, Prefab, cb);
    }








    public static createUIWithBundle(path: string, cb?: (err: Error | null, node?: Node) => void, parent?: Node | null) {
        this.getUIPrefabResWithBundle(path, (err: Error | null, prefab?: Prefab) => {
            if (err) return;
            let node;
            // @ts-ignore
            if (this.dialog[path] != undefined) {
                // @ts-ignore
                node = this.dialog[path]
            } else {
                node = instantiate(prefab!);
            }

            if (!parent) {
                parent = find("Canvas");
            }
            node.setPosition(0, 0, 0);

            parent!.addChild(node);
            if (cb) {
                cb(null, node);
            }
        });
    }

    public static setSpriteFrame<T extends Asset>(path: string, sprite: Sprite, cb: LoadCompleteCallback<SpriteFrame>) {
        this.loadRes<SpriteFrame>(path + '/spriteFrame', SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.error('set sprite frame failed! err:', path, err);
                cb(err, spriteFrame);
                return;
            }

            if (sprite && isValid(sprite)) {
                sprite.spriteFrame = spriteFrame;
                cb(null, spriteFrame);
            }
        });
    }




    public static setRemoteImage(url: string, sprite: Sprite, cb: LoadCompleteCallback<SpriteFrame>) {
        if (!url || !url.startsWith('http')) {
            return;
        }

        assetManager.loadRemote(url, { ext: ".png" }, (err, texture2d:ImageAsset) => {
            if (err || !texture2d) {
                console.error('set avatar failed! err:', url, err);
                return;
            }
            const texture = new Texture2D();
            texture.image = texture2d;
            let spriteFrame = new SpriteFrame();
            spriteFrame.texture = texture;
            sprite.spriteFrame = spriteFrame
            cb && cb(null, spriteFrame);
        })

    }






	public static setSkeEffect(skele:sp.Skeleton[], petData:PetProfileRecord, thisObj?:any){
		let petCfg = TableDataService.ins().getTableValueByID(Const.Tables.new_prop, petData.prop_id);
		let path:string = "";
		if (petCfg.typeson == 1){

			path = "d1scene2|pets/gou";
		}
		else{

			path = "cat/json/mao/mao";
		}

        ResourceLoaderService.loadResWithBundle( "d1scene2|pets/gou", sp.SkeletonData, (err, skedata) => {
            if (err) {
					UtilPub.error("加载模型失败", err);
					return;
				}




            skele[0].skeletonData = skedata;
			skele[0].setSkin(petCfg.pet_effect);


            skele[1].skeletonData = skedata;
            skele[1].node.active = false;


            skele[2].skeletonData = skedata;
            skele[2].node.active = false;


            skele[3].skeletonData = skedata;
            skele[3].node.active = false;


            skele[4].skeletonData = skedata;
            skele[4].node.active = false;

            for (let i = 0; i < petData.fs_prop_id.length; i++) {
                let itemCfg:ShopConfigRecord = TableDataService.ins().getTableValueByID(Const.Tables.new_prop, petData.fs_prop_id[i]);
                if (itemCfg.sonname == 1){

                    skele[1].node.active = true;
                    skele[1].setSkin(itemCfg.pet_effect);
                }
                else if (itemCfg.sonname == 4){

                    skele[2].node.active = true;
                    skele[2].setSkin(itemCfg.pet_effect);
                }
                else if (itemCfg.sonname == 2){


                    skele[3].setSkin(itemCfg.pet_effect);
                }
                else if (itemCfg.sonname == 3){

                    skele[4].node.active = true;
                    skele[4].setSkin(itemCfg.pet_effect);
                }
            }

            if (thisObj){
                thisObj.updateAnima();
            }
        })


	}

}
