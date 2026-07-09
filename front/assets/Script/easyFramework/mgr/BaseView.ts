import { CCInteger, Node, tween, Vec3, view, _decorator } from "cc";
import { UtilPub } from "../utils/UtilPub";
import { BaseUiComponent } from "./comm";
import { UiLayerService } from "./uiManager";
const { ccclass, property } = _decorator;

@ccclass("BaseView")
export default class BaseView extends BaseUiComponent {

    @property(CCInteger)
    zIndex: number = 100

    AniNode: Node = null!
    dialogPath: string = ""


    show(args: any) {
        this._layerData = args
        this.AniNode = this.node.getChildByName("root")!
        if (this.AniNode != null) {
            this.AniNode.scale = new Vec3(0.5, 0.5, 0.5)
            tween(this.AniNode).to(0.1, { scale: new Vec3(1.05, 1.05, 1.05) }).to(0.03, { scale: new Vec3(1, 1, 1) }).start()
        }

        if (this.node.getChildByName("bg") != null) {
            this.node.getChildByName("bg")!.active = true
        }

        this._clickEnable = true;

    }

    close() {
        this.AniNode = this.node.getChildByName("root")!
        if (this.AniNode != null) {
            if (this.node.getChildByName("bg") != null) {
                this.node.getChildByName("bg")!.active = false
            }

            tween(this.AniNode).to(0.1, { scale: new Vec3(0.3, 0.3, 0.3) }).call(() => {
                this.node.active = false
                this.AniNode.scale = new Vec3(1, 1, 1)
                UiLayerService.instance._fn_nk(this.dialogPath)
            }).start()
        } else {
            UiLayerService.instance._fn_nk(this.dialogPath)
        }
        UtilPub.log("close---this.dialogPath----", this.dialogPath)
    }

    _fn_xe() {
        this.AniNode = this.node.getChildByName("root")!
        if (this.AniNode != null) {
            tween(this.AniNode).to(0.1, { scale: new Vec3(0.3, 0.3, 0.3) }).call(() => {
                this.node.active = false
                this.AniNode.scale = new Vec3(1, 1, 1)
                UiLayerService.instance._fn_xf(this.dialogPath)
            }).start()
        } else {
            UiLayerService.instance._fn_xf(this.dialogPath)
        }
        UtilPub.log("popClose---this.dialogPath----", this.dialogPath)
    }


    _fn_la() {
        let screen1 = view.getVisibleSize()
        let resolute = view.getDesignResolutionSize()
        let scale = 1
        if (screen1.width / screen1.height <= 720 / 1280) {
            scale = screen1.width / resolute.width
        } else {
            scale = screen1.height / resolute.height
        }
        return scale
    }

    updateInfo() {

    }

    _fn_aem(target:Node, gray:boolean){

    }
}
