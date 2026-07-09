import { _decorator, Component, Node, find, isValid, Vec3, UIOpacity } from "cc";
import { UtilPub } from "../utils/UtilPub";
import BaseView from "./BaseView";
import { ResourceLoaderService } from "./resourceUtil";
import { Const } from "../../config/Const";
const { ccclass, property } = _decorator;

interface IPanel extends Component {
    show: Function;
    hide: Function;
    zIndex: number;
    dialogPath?: string;
}

@ccclass("uiManager")
export class UiLayerService {

    dictSharedPanel: { [path: string]: Node } = {}
    dictLoading: { [path: string]: boolean } = {};
    arrPopupDialog: {
        panelPath: string,
        scriptName?: string,
        param: any,
        isShow: boolean
    }[] = [];
    showTipsTime: number = 0
    panelPath: string = ""

    dialogList: string[] = []
    private static _instance: UiLayerService;

    static get instance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new UiLayerService();
        return this._instance;
    }

    show() {

    }

    hide() {

    }

    close() {

    }

    _fn_gs(panelPath: string) {
        return this.dictSharedPanel[panelPath]
    }

    async _fn_ri(panelPath: string) {
        return new Promise<void>(resolve => {
            let _panelPath = panelPath.split("|")[1]
            let idxSplit = _panelPath.lastIndexOf('/');
            let scriptName = _panelPath.slice(idxSplit + 1);
            ResourceLoaderService._fn_ea(panelPath, (err, node) => {
                this.dictLoading[panelPath] = false;
                if (err) {
                    console.error(err);
                    return;
                }

                this.dictSharedPanel[panelPath] = node!;

                let script = node!.getComponent(scriptName)! as IPanel;

                script.dialogPath = panelPath

                node!.active = false
                resolve();
            })
        })
    }










    _fn_ahg(panelPath: string, args?: any, cb?: Function, parent?: Node, active: boolean = true) {
        this.panelPath = panelPath
        if (this.dictLoading[panelPath]) {
            return;
        }

        if (panelPath == Const.Dialogs.HandLayer){
            console.log("关闭引导");
            return;
        }

        let _panelPath = panelPath.split("|")[1]
        let idxSplit = _panelPath.lastIndexOf('/');
        let scriptName = _panelPath.slice(idxSplit + 1);

        if (!args) {
            args = [];
        }

        if (this.dictSharedPanel.hasOwnProperty(panelPath)) {
            let panel = this.dictSharedPanel[panelPath];
            if (isValid(panel)) {

                if (parent == undefined) {

                    panel.parent = find("Canvas")
                } else {
                    panel.parent = parent
                }



                let script = panel.getComponent(scriptName) as IPanel;




                script.show(args);



                panel.setSiblingIndex(script.zIndex!)
                script.dialogPath = panelPath


                this._fn_afl(panel, scriptName)


                panel.active = true;

                cb && cb(script);

                return;
            }
        }

        this.dictLoading[panelPath] = true;
        ResourceLoaderService._fn_ea(panelPath, (err, node) => {

            let isCloseBeforeShow = false;
            if (!this.dictLoading[panelPath]) {

                isCloseBeforeShow = true;
            }

            this.dictLoading[panelPath] = false;
            if (err) {
                console.error(err);
                return;
            }



            this.dictSharedPanel[panelPath] = node!;
            let script = node!.getComponent(scriptName)! as IPanel;

            if (script.show) {


                script.show(args);
            }


            script.dialogPath = panelPath


            node && (node.active = active)



            this._fn_afl(node!, scriptName)

            cb && cb(script);











            if (isCloseBeforeShow) {


                this._fn_nk(panelPath);
            }
        }, parent);
    }

    _fn_afl(panel: Node, scriptName: string) {

























    }

















    _fn_nk(panelPath: string, callback?: Function) {

        if (this.dictSharedPanel.hasOwnProperty(panelPath)) {
            let panel = this.dictSharedPanel[panelPath];
            if (panel && isValid(panel)) {









                let _panelPath = panelPath.split("|")[1]
                let idxSplit = _panelPath.lastIndexOf('/');
                let scriptName = _panelPath.slice(idxSplit + 1);
                let script = panel!.getComponent(scriptName)! as IPanel;

                if (script.hide) {


                    script.hide();
                }
                panel.active = false
                panel.parent = null;
                if (callback && typeof callback === 'function') {
                    callback();
                }

            } else if (callback && typeof callback === 'function') {
                callback();
            }
        }

        this.dictLoading[panelPath] = false;
    }

    _fn_xw(panelPath: string, args?: any, cb?: Function, parent?: Node, active: boolean = true) {
        let callBack = (script: BaseView) => {
            cb && cb(script)
            this.dialogList.push(script.node.name)
        }

        if (this.dialogList.length > 0) {
            let scp = this.dialogList[this.dialogList.length - 1]
            let dialog = find("Canvas/" + scp)
            if (dialog) {
                dialog.active = false
            }
        }
        this._fn_ahg(panelPath, args, callBack, parent, active)
    }

    _fn_xf(panelPath: string, cb?: Function) {

        let callBack = (script: BaseView) => {
            cb && cb(script)
            if (this.dialogList.length > 0) {
                let scp = this.dialogList[this.dialogList.length - 1]
                let dialog = find("Canvas/" + scp)!
                if (dialog) {
                    dialog.active = true
                    dialog.getComponent(BaseView)!.updateInfo()
                }
            }
        }
        if (this.dialogList.length > 0) {
            this.dialogList.pop()
        }
        this._fn_nk(panelPath, callBack)
    }

    _fn_ej(panelPath: string) {
        if (this.dictSharedPanel.hasOwnProperty(panelPath)) {
            let panel = this.dictSharedPanel[panelPath];
            delete this.dictSharedPanel[panelPath]
            panel.destroy()
        }
    }







    _fn_xx(panelPath: string, scriptName: string, param: any) {
        let popupDialog = {
            panelPath: panelPath,
            scriptName: scriptName,
            param: param,
            isShow: false
        };

        this.arrPopupDialog.push(popupDialog);

        this._fn_cf();
    }








    _fn_pn(index: number, panelPath: string, param: any) {
        let popupDialog = {
            panelPath: panelPath,
            param: param,
            isShow: false
        };

        this.arrPopupDialog.splice(index, 0, popupDialog);

    }





    _fn_agx(panelPath: string) {
        this._fn_nk(panelPath, () => {
            if (this.arrPopupDialog[0] && this.arrPopupDialog[0].panelPath === panelPath) {
                this.arrPopupDialog.shift();
                this._fn_cf();
            }
        })
    }




    _fn_cf() {
        if (this.arrPopupDialog.length > 0) {
            let first = this.arrPopupDialog[0];

            if (!first.isShow) {
                this._fn_ahg(first.panelPath, first.param);
                this.arrPopupDialog[0].isShow = true;
            }
        }
    }


}
