import { find, instantiate, Node, Sprite, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { localText } from '../../../config/localText';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
import { handIndexs } from '../../data/handData';
const { ccclass, property } = _decorator;

@ccclass('NewItemLayer')
export class NewItemLayer extends BaseView {


    @property({ type: Node })
    nameNode: Node = null!;
    @property({ type: Node })
    lvNode: Node = null!;
    @property({ type: Node })
    iconNode: Node = null!;
    @property({ type: Node })
    infoNode: Node = null!;

    @property({ type: Node })
    produceLayer: Node = null!;
    @property({ type: Node })
    propItem: Node = null!;

    @property({ type: Node })
    btnClose: Node = null!;

    onLoad() {
        this.propItem.parent = this.node;
        this.propItem.active = false;
    }

    show(propConfigId: any) {
        super.show(propConfigId);

        let propConfig = TableDataService.ins()._fn_ly(Const.Tables.prop, propConfigId);
        this._fn_ago(this.nameNode, propConfig.name);
        this._fn_ago(this.lvNode, propConfig.luna + localText.lv);
        this._fn_agl(this.iconNode.getComponent(Sprite)!, Const.resPath.icon + propConfig.icon);
        this._fn_ago(this.infoNode, propConfig.mask);

        this.bindButton(this.btnClose, this._fn_sz);

        let handIndex = mergeBoardStateStore._fn_hj();
        if (handIndex == handIndexs.boardItemReveal) {
            mergeBoardStateStore._fn_e();
            let handGuidePayload: any = {};
            handGuidePayload.id = handIndex;
            handGuidePayload.node = this.btnClose;
            handGuidePayload.delayTime = 0.5;
            UiLayerService.instance._fn_ahg(Const.Dialogs.HandLayer, handGuidePayload);
        }

        this.produceLayer.removeAllChildren();
        if (propConfig.atom) {
            let atomPropIds = (propConfig.atom + "").split(",");
            for (let atomIndex = 0; atomIndex < atomPropIds.length; atomIndex++) {
                let atomPropId = parseInt(atomPropIds[atomIndex]);
                let atomNode = instantiate(this.propItem);
                atomNode.parent = this.produceLayer;
                atomNode.active = true;
                let atomPropConfig = TableDataService.ins()._fn_ly(Const.Tables.prop, atomPropId);
                this._fn_ago(find("name", atomNode), atomPropConfig.name);
                this._fn_agl(find("icon", atomNode)!.getComponent(Sprite)!, Const.resPath.icon + atomPropConfig.icon);
            }
        }
    }

    _fn_sz() {
        this.close();
        mergeBoardStateStore._fn_df();
        this.emit(GD.event.refreshHandLayer);
    }

}

