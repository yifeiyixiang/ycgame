import { find, Label, Node, Prefab, Sprite, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import BaseView from '../../../easyFramework/mgr/BaseView';
import TableDataService from '../../../easyFramework/other/tables';
const { ccclass, property } = _decorator;

@ccclass('build_info')
export class BuildInfoPanelController extends BaseView {

    @property({ type: Label }) titleLabel: Label = null!
    @property({ type: Label }) infoLabel: Label = null!
    @property({ type: Sprite }) icon: Sprite = null!




    onLoad() {
        this.bindButton(find("root/btnSure", this.node)!, () => {
            this.close()
        })
    }


    show(args: any) {
        super.show(args)
        this.initInfo(this._layerData.id)
    }

    initInfo(id: number) {
        let roomData = TableDataService.ins().getTableValueByID(Const.Tables.scene_room, id)
        this.titleLabel.string = roomData.name
        this.infoLabel.string = roomData.desc
        this.setSpriteFrame(this.icon, Const.resPath.buildpicture + roomData.picture)

    }




}


