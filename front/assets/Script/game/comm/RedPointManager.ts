

import { Node, Prefab, UITransform, v3 } from "cc";
import { Const } from "../../config/Const";
import { BaseUiComponent } from "../../easyFramework/mgr/comm";
import { NodePoolService } from "../../easyFramework/mgr/poolManager";
import { UtilPub } from "../../easyFramework/utils/UtilPub";
import { EmailManager } from "./EmailManager";

import { RedPointComm } from "./RedPointComm";
import { playerDataStore } from "./UserData";
import { UtilScene } from "./UtilScene";

export enum RPointEvent {

    RPM_Null = "RPM_Null",
    RPM_Email = "RPM_Email",
    RPM_Tujian = "RPM_Tujian",
    RPM_TujianProp = "RPM_TujianProp",
    RPM_TujianScene = "RPM_TujianScene",



    boardBuildHint = "boardBuildHint",

}

class RedPointManager {
    private static _instance: RedPointManager = null!
    private eventManger = { RPM_Email: false }

    public static _fn_ho() {
        if (this._instance == null) {
            this._instance = new RedPointManager()

        }
        return this._instance
    }

    public _fn_afp(parent: Node, event: RPointEvent, forece: boolean, scale: number = 1, offsetX: number = 0, offsetY: number = 0) {
        let redPointComm = parent.getComponent(RedPointComm) || parent.addComponent(RedPointComm)
        redPointComm.setRedPointFlag(event, forece)
        let redPointNode = parent.getChildByName("RedPoint")
        if (redPointNode == null) {
            UtilPub._fn_jj(Const.Prefabs.RedPoint, (p: Prefab) => {
                let node = NodePoolService.instance.getNode(p, parent!)!
                node.name = "RedPoint"
                let uiTransform = node.getComponent(UITransform) || node.addComponent(UITransform)
                node.position = v3(uiTransform.width * (1 - uiTransform.anchorX) - 30 + offsetX, uiTransform.height * (1 - uiTransform.anchorY) - 20 + offsetY, 1);
                node.scale = v3(scale, scale, scale)
                let script = node.getComponent(node.name) as BaseUiComponent
                if (script && event) {
                    script!._layerData.event = event
                }
                redPointComm.setRedPointNode(node)
            })
        } else {
            redPointComm.setRedPointNode(redPointNode)
        }
    }

    public _fn_afq(parent: Node, event: RPointEvent, forece: boolean) {

        let redPointNode = parent.getChildByName("RedPoint")
        if (redPointNode == null) {
            if (!forece) {
                return
            }
            UtilPub._fn_jj(Const.Prefabs.RedPoint, (p: Prefab) => {
                let node = NodePoolService.instance.getNode(p, parent!)!
                node.name = "RedPoint"
                let uiTransform = node.getComponent(UITransform) || node.addComponent(UITransform)
                node.position = v3(uiTransform.width * (1 - uiTransform.anchorX) - 30, uiTransform.height * (1 - uiTransform.anchorY) - 20, 1);
                let script = node.getComponent(node.name) as BaseUiComponent
                if (script && event) {
                    script!._layerData.event = event
                }
                node.active = forece
            })
        } else {
            redPointNode.active = forece
        }
    }

    public _fn_by(flag: RPointEvent) {
        let value = false
        switch (flag) {
            case RPointEvent.RPM_Email:
                value = EmailManager._fn_ho()._fn_qv()
                break;
            case RPointEvent.RPM_Tujian:
                value = playerDataStore._showPropTujianRed || playerDataStore._showSceneTujianRed
                break;

            case RPointEvent.RPM_TujianProp:
                value = playerDataStore._showPropTujianRed
                break;
            case RPointEvent.RPM_TujianScene:
                value = playerDataStore._showSceneTujianRed
                break;
            case RPointEvent.boardBuildHint:
                value = UtilScene._fn_qt();
                break;
            default:
                break;
        }
        return value;
    }

}

export const redPointManager = RedPointManager._fn_ho()
