import { Node, _decorator } from 'cc';
import BaseView from '../../../easyFramework/mgr/BaseView';
const { ccclass, property } = _decorator;

@ccclass('SeasonGuideLayer')
export class SeasonGuideLayer extends BaseView {

    @property({ type: Node })
    btnClose: Node = null!;

    onLoad() {

        this.bindButton(this.btnClose, this._fn_sz);

    }

    show(args: any) {
        super.show(args);
        this._fn_ph();
    }

    _fn_ph() {

    }

    _fn_sz() {
        this.close();
    }

}

