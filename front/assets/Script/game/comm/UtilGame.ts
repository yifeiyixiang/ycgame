import { _decorator, Node, v3, v2, Vec2, Vec3, UITransform, Prefab } from 'cc';
import { Const } from '../../config/Const';
import { GCurFace, GTypeStrNode } from '../../config/global';
import { BaseUiComponent } from '../../easyFramework/mgr/comm';
import TableDataService from '../../easyFramework/other/tables';
import { UtilPub } from '../../easyFramework/utils/UtilPub';
import { UiLayerService } from '../../easyFramework/mgr/uiManager';
const { ccclass, property } = _decorator;




@ccclass('UtilGame')
export class UtilGame extends BaseUiComponent {


    public static const(code: string) {
        return TableDataService.ins().getTableValueByKey(Const.Tables.const, "code", code).val
    }


    public static ui(code: string): string {
        return TableDataService.ins().getTableValueByKey(Const.Tables.ui, "code", code).name
    }


    public static language(code: string): string {
        return TableDataService.ins().getTableValueByKey(Const.Tables.language, "key", code).chinese
    }


    public static getNearestNode(centerNode: Node, nodes: GTypeStrNode): Node {
        let min = 10000
        let minNode: Node = null!

        for (let strkey in nodes) {
            if (nodes.hasOwnProperty(strkey)) {
                let n = nodes[strkey]
                let dis = UtilPub.getDis(centerNode.worldPosition, n.worldPosition)
                if (dis < min) {
                    min = dis
                    minNode = n
                }
            }
        }
        return minNode
    }


    public static sceneClose() {
        UiLayerService.instance.hideDialog(Const.Dialogs.main)
        Const.SceneNode.active = false
    }

    public static sceneOpen() {
        UiLayerService.instance.showDialog(Const.Dialogs.main)
        Const.SceneNode.active = true
    }

}

