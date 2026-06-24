import { find, Label, v3, _decorator } from 'cc';
import { Const } from '../../../config/Const';
import { GBuildType } from '../../../config/global';
import { BaseUiComponent } from '../../../easyFramework/mgr/comm';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { mergeBoardStateStore } from '../../comm/mergeBoardModel';
const { ccclass, property } = _decorator;

@ccclass('float_star')
export class FloatingStarController extends BaseUiComponent {
    get root() { return find("root", this.node)! }
    get StarLabel() { return find("root/starLabel", this.node)!.getComponent(Label)! }

    id: number = 0
    type: GBuildType = null!
    star: number = 0

    onLoad() {
        this.aniTween.stop()
        this.root.position = v3(0, 110, 0)
        this.aniTween = UtilPub.breathFloat(this.root, 110)

        this.bindButton(this.root, this.onClickBtnPrompt);
    }

    init(id: number, type: GBuildType, star: number) {
        this.id = id
        this.type = type
        this.star = star
        this.StarLabel.string = "x" + star

    }

    onClickBtnPrompt() {

        mergeBoardStateStore.closeHandLayer();
        UiLayerService.instance.showDialog(Const.Dialogs.BuildPromptDialogController, { id: this.id, type: this.type })
    }

}


