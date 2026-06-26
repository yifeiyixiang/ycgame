import { Button, find, instantiate, Node, Sprite, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import { TujianState } from '../../../config/global';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { playerDataStore } from '../../comm/UserData';
const { ccclass, property } = _decorator;

@ccclass('ItemCodexLayer')
export class ItemCodexLayer extends BaseView {


    @property({ type: Node })
    nameNode: Node = null!;
    @property({ type: Node })
    propLayer: Node = null!;
    @property({ type: Node })
    propItem: Node = null!;

    @property({ type: Node })
    btnClose: Node = null!;

    @property({ type: Node })
    bottomLayer: Node = null!;
    @property({ type: Node })
    fromList: Node = null!;

    propId: number = 0;

    onLoad() {
        this.propItem.parent = this.node;
        this.propItem.active = false;
    }

    show(selectedPropId: any) {
        super.show(selectedPropId);

        UtilPub.log("show propId:" + selectedPropId);
        this.initUI(selectedPropId);
    }

    initUI(selectedPropId: number) {
        let selectedPropConfig = TableDataService.ins().getTableValueByID(Const.Tables.prop, selectedPropId);
        this.propId = selectedPropId;
        this.setString(this.nameNode, selectedPropConfig.sonname);

        this.propLayer.removeAllChildren();
        let sameTypePropList = this.getPropRowArr();
        for (let propIndex = 0; propIndex < sameTypePropList.length; propIndex++) {
            let propCellNode = instantiate(this.propItem);
            propCellNode.active = true;
            propCellNode.parent = this.propLayer;
            let propConfig = sameTypePropList[propIndex];
            let createIcon = find("create", propCellNode)!;
            createIcon.active = false;
            let wenhaoNode = find("wenhao", propCellNode)!;
            wenhaoNode.active = false;
            if (propConfig.anc || propConfig.fair) {
                createIcon.active = true;
            }

            let iconNode = find("icon", propCellNode)!;
            iconNode.active = true;
            this.setSpriteFrame2(iconNode.getComponent(Sprite)!, Const.resPath.icon + propConfig.icon);
            this.setString(find("lv", propCellNode), propConfig.luna);
            let bgName = "grid_normal";
            if (propConfig.id == selectedPropId) {
                bgName = "grid_chose";
            } else {
                if (playerDataStore.isGetPropTujian(propConfig.id) == TujianState.unGet) {
                    wenhaoNode.active = true;
                    iconNode.active = false;
                    createIcon.active = false;
                }
            }

            this.setSpriteFrame2(find("bg", propCellNode)!.getComponent(Sprite)!, Const.resPath.mergeIcon + "item_codex/" + bgName);
            this.bindButton(propCellNode, this.onClickPropItem);
            // @ts-ignore
            propCellNode.propRow = propConfig;
        }

        let sourcePropList = this.getPropFromArr();
        if (sourcePropList.length > 0) {
            this.bottomLayer.active = true;
            this.scrollViewSetData(this.fromList, sourcePropList, this.refreshFromItemUI.bind(this));
        } else {
            this.bottomLayer.active = false;
        }

        this.bindButton(this.btnClose, this.onClickBtnClose);
    }

    refreshFromItemUI(sourceCellNode: Node, propConfig: any) {
        // @ts-ignore
        sourceCellNode.propRow = propConfig;
        this.setSpriteFrame2(find("icon", sourceCellNode)!.getComponent(Sprite)!, Const.resPath.icon + propConfig.icon);
        this.bindButton(sourceCellNode, this.onClickBtnFromItem);
    }

    getPropRowArr() {
        let sameTypePropList: any = [];
        let selectedPropConfig = TableDataService.ins().getTableValueByID(Const.Tables.prop, this.propId);
        let propTable = TableDataService.ins().getTable(Const.Tables.prop);
        for (let tableKey in propTable) {
            let propConfig = propTable[tableKey];
            if (selectedPropConfig.type == propConfig.type && selectedPropConfig.typeson == propConfig.typeson) {
                sameTypePropList.push(propConfig);
            }
        }
        return sameTypePropList;
    }

    getPropFromArr() {
        let sourcePropList: any = [];
        let propTable = TableDataService.ins().getTable(Const.Tables.prop);
        let selectedPropConfig = TableDataService.ins().getTableValueByID(Const.Tables.prop, this.propId);
        let basePropId = this.propId - selectedPropConfig.luna + 1;

        let firstPropId = -1;
        let firstPropConfig = TableDataService.ins().getTableValueByID(Const.Tables.prop, basePropId);
        if (basePropId != this.propId && firstPropConfig && firstPropConfig.type == selectedPropConfig.type && firstPropConfig.typeson == selectedPropConfig.typeson) {
            firstPropId = basePropId;
        }

        let sourceTypeMap: any = {};
        for (let tableKey in propTable) {
            let propConfig = propTable[tableKey];
            let sourceTypeKey = propConfig.type * 10000 + propConfig.typeson;
            if (propConfig.fair == this.propId || propConfig.fair == firstPropId) {
                if (!sourceTypeMap[sourceTypeKey]) {
                    sourceTypeMap[sourceTypeKey] = 1;
                    sourcePropList.push(propConfig);
                }
                continue;
            }
            if (propConfig.atom) {
                let atomPropIds = (propConfig.atom + "").split(",");
                if (atomPropIds.indexOf(this.propId + "") != -1 || atomPropIds.indexOf(firstPropId + "") != -1) {
                    if (!sourceTypeMap[sourceTypeKey]) {
                        sourceTypeMap[sourceTypeKey] = 1;
                        sourcePropList.push(propConfig);
                    }
                    continue;
                }
            }
            if (propConfig.blessId == this.propId) {
                if (!sourceTypeMap[sourceTypeKey]) {
                    sourceTypeMap[sourceTypeKey] = 1;
                    sourcePropList.push(propConfig);
                }
            }
        }

        return sourcePropList;
    }

    onClickPropItem(btn: Button) {
        // @ts-ignore
        let propConfig = btn.node.propRow;




        UiLayerService.instance.showDialog(Const.Dialogs.PropMinInfo, { propdata: propConfig });
    }

    onClickBtnFromItem(btn: Button) {
        // @ts-ignore
        let propConfig = btn.node.propRow;
        if (propConfig.tan) {
            UiLayerService.instance.showDialog(Const.Dialogs.PropItemInfo, { propdata: propConfig });
        } else {
            this.show(propConfig.id);
        }
    }

    onClickBtnClose() {
        this.close();
    }

}

