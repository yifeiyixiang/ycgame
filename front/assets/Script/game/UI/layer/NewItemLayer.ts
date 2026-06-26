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

        let propConfig = TableDataService.ins().getTableValueByID(Const.Tables.prop, propConfigId);
        this.setString(this.nameNode, propConfig.name);
        this.setString(this.lvNode, propConfig.luna + localText.lv);
        this.setSpriteFrame2(this.iconNode.getComponent(Sprite)!, Const.resPath.icon + propConfig.icon);
        this.setString(this.infoNode, propConfig.mask);

        this.bindButton(this.btnClose, this.onClickBtnClose);

        let handIndex = mergeBoardStateStore.getHandIndex();
        if (handIndex == handIndexs.boardItemReveal) {
            mergeBoardStateStore.addHandIndex();
            let handGuidePayload: any = {};
            handGuidePayload.id = handIndex;
            handGuidePayload.node = this.btnClose;
            handGuidePayload.delayTime = 0.5;
            UiLayerService.instance.showDialog(Const.Dialogs.HandLayer, handGuidePayload);
        }

        this.produceLayer.removeAllChildren();
        if (propConfig.atom) {
            let atomPropIds = (propConfig.atom + "").split(",");
            for (let atomIndex = 0; atomIndex < atomPropIds.length; atomIndex++) {
                let atomPropId = parseInt(atomPropIds[atomIndex]);
                let atomNode = instantiate(this.propItem);
                atomNode.parent = this.produceLayer;
                atomNode.active = true;
                let atomPropConfig = TableDataService.ins().getTableValueByID(Const.Tables.prop, atomPropId);
                this.setString(find("name", atomNode), atomPropConfig.name);
                this.setSpriteFrame2(find("icon", atomNode)!.getComponent(Sprite)!, Const.resPath.icon + atomPropConfig.icon);
            }
        }
    }

    onClickBtnClose() {
        this.close();
        mergeBoardStateStore.closeHandLayer();
        this.emit(GD.event.refreshHandLayer);
    }

}

