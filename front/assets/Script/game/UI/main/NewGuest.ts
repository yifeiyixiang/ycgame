import { find, Label, Node, Prefab, sp, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { ResourceLoaderService } from '../../../easyFramework/mgr/resourceUtil';
import TableDataService from '../../../easyFramework/other/tables';
import { GamePlatform } from '../../platform/GamePlatform';
const { ccclass, property } = _decorator;

@ccclass('NewGuest')
export class NewGuest extends BaseView {
    @property({ type: Label }) titlelabel: Label = null!
    @property({ type: Label }) infoLabel: Label = null!

    @property({ type: sp.Skeleton }) guestSpine: sp.Skeleton = null!

    onLoad() {
        this.bindButton(find("btnSure", this.node)!, () => {
            this.close()
        })
    }


    show(args: any) {
        super.show(args)
        this._fn_ob(this._layerData.id)

    }

    _fn_ob(id: number) {
        let guestData = TableDataService.ins()._fn_ly(Const.Tables.scene_guest, id)
        this.titlelabel.string = guestData.name
        this.infoLabel.string = guestData.desc

        GamePlatform._fn_aja("解锁新肥鹅-" + guestData.name)

        ResourceLoaderService._fn_rq( guestData.sp, sp.SkeletonData, (err, skedata) => {
            this.guestSpine.skeletonData = skedata;
            this.guestSpine.setSkin("skin1")
            this.guestSpine.setAnimation(0, "idle1", true);
        })
    }



}


