import { find, Label, Node, Prefab, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { NodePoolService } from '../../../easyFramework/mgr/poolManager';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
import { playerDataStore } from '../../comm/UserData';
import { UtilScene } from '../../comm/UtilScene';
import { handIndexs } from '../../data/handData';
import { BuildListItemController } from './build_list_item';
import { GamePlatform } from '../../platform/GamePlatform';
const { ccclass, property } = _decorator;

@ccclass('build_list')
export class BuildListPanelController extends BaseView {
    get titleLabel() { return find("root/window/titleLabel", this.node)!.getComponent(Label)! }
    get topLabel() { return find("root/window/top/star/topLabel", this.node)!.getComponent(Label)! }
    get closeBtn() { return find("root/window/btnClose", this.node)! }
    get starLabel() { return find("root/window/top/star/btnBg/starLayout/starLabel", this.node)!.getComponent(Label)! }
    get buildListLayout() { return find("root/window/sview/mask/build_list", this.node)! }

    items: Node[] = []

    onLoad() {
        this.on(GD.event.chgGreenStar, this.chgGreenStar, this)
        this.bindButton(this.closeBtn, () => {
            this.close()
        })
    }

    chgGreenStar() {
        this.starLabel.string = playerDataStore.greenStar + ""
    }

    show(args: any) {
        super.show(args)
        this._fn_aac()
        GamePlatform._fn_aja("查看建造清单")
    }

    _fn_aac() {
        this.chgGreenStar()
        NodePoolService.instance._fn_ya(this.items)
        let needShowRooms = UtilScene._fn_ik()

        UtilPub._fn_jj(Const.Prefabs.BuildListItemController, (p: Prefab) => {
            needShowRooms.forEach((row: any) => {
                let item = NodePoolService.instance.getNode(p, this.buildListLayout)!
                item.getComponent(BuildListItemController)!.init(row.id)
                this.items.push(item)
            })

            let handIndex = mergeBoardStateStore._fn_hj();
            if (handIndex == handIndexs.btnBuild) {
                mergeBoardStateStore._fn_e();
                let obj: any = {};
                obj.id = mergeBoardStateStore._fn_hj();
                let btnGo = find("root/mid/goBtn", this.buildListLayout.children[0]);
                obj.node = btnGo;
                obj.delayTime = 0.5;
                UiLayerService.instance._fn_ahg(Const.Dialogs.HandLayer, obj);
                mergeBoardStateStore._fn_e();
            }
        })
    }




}


