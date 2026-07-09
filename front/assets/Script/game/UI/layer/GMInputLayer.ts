import { EditBox, Label, Node, _decorator } from 'cc';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { GameStorageJSF } from '../../../easyFramework/mgr/gameStorage';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { aiRobot } from '../../comm/AIRobot';
import { UtilScene } from '../../comm/UtilScene';
const { ccclass, property } = _decorator;

@ccclass('GMInputLayer')
export class GMInputLayer extends BaseView {

    @property(EditBox)
    editBox: EditBox = null!;
    @property({ type: Node })
    btnSure: Node = null!;
    @property({ type: Label })
    hintLabel: Label = null!;

    @property({ type: Node })
    btnClose: Node = null!;

    start() {
        this.bindButton(this.btnClose, this._fn_sz);
        this.bindButton(this.btnSure, this._fn_to);
    }

    show(args: any) {
        super.show(args);

        this._fn_ph();

    }

    _fn_ph() {
        if (aiRobot.isRobot()) {
            this.hintLabel.string = "当前是机器人";
        } else {
            this.hintLabel.string = "";
        }
    }

    _fn_sz() {
        this.close();
    }

    _fn_to() {
        let str = this.editBox.string;
        UtilPub.log(str);
        switch (str) {
            case "tyq666":

                GameStorageJSF.ins._fn_aft(true);
                UtilScene._fn_abw();
                break;
            case "666":

                GameStorageJSF.ins._fn_aft(false);
                UtilScene._fn_abw();
                break;
            default:
                break;
        }
        this.close();
    }


}

