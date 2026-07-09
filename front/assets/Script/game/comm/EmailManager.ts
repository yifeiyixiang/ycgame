
import { director } from "cc";
import { Const } from "../../config/Const";
import { Email, EmailRewardState, EmailState, EmailType } from "../../config/global";
import { GameStorage } from "../../easyFramework/mgr/gameStorage";
import { GNetCmd } from "../../easyFramework/network/conf";
import ServerCtrJSF from "../../easyFramework/network/ServerCtrJSF";
import TimeCtrJSF from "../../easyFramework/network/TimeCtrJSF";


export class EmailManager {
    private static _instance: EmailManager = null!

    private _newEmailIDs: number[] = []

    public static _fn_ho() {
        if (this._instance == null) {
            this._instance = new EmailManager()
            this._instance._newEmailIDs = []
            this._instance._fn_ck()
            director.off(GNetCmd.ToClientNewMail.toString(), this._instance._fn_vb, this);
            director.off(GNetCmd.GetUserDataByKey.toString(), this._instance._fn_uw, this);
            director.on(GNetCmd.ToClientNewMail.toString(), this._instance._fn_vb, this);
            director.on(GNetCmd.GetUserDataByKey.toString(), this._instance._fn_uw, this);
        }
        return this._instance
    }


    public get EmailList() {
        this._fn_cc()
        return GameStorage._fn_ip(Const.DataKeys.emailList).values
    }

    public _fn_ck() {
        for (let emailIndex = 0; emailIndex < this.EmailList.length; emailIndex++) {
            const email: Email = this.EmailList[emailIndex];
            if (TimeCtrJSF._fn_hp().ServerTime - email.time > 50 * 24 * 60 * 60000) {
                this._fn_aah(email.id)
            }
        }
    }

    public _fn_cc() {
        let emailRows = GameStorage._fn_ip(Const.DataKeys.emailList).values
        if (emailRows.length > 50) {
            let _fn_aif = (a: Email, b: Email) => {
                return b.time - a.time
            }
            emailRows.sort(_fn_aif)
            for (let emailIndex = 50; emailIndex < emailRows.length; emailIndex++) {
                if (emailRows[emailIndex]) {
                    this._fn_aah(emailRows[emailIndex].id)
                }
            }
        }
    }

    _fn_vb(value: any) {

       EmailManager._fn_ho()._fn_xu(parseInt(value.id + ""))
    }

    public _fn_xu(id: number) {
        if (!this._newEmailIDs) {
            this._newEmailIDs = []
        }
        this._newEmailIDs.push(id)
    }

    public _fn_xg() {
        if (this._newEmailIDs.length <= 0) {
            return true
        }
        for (let emailIdIndex = 0; emailIdIndex < this._newEmailIDs.length; emailIdIndex++) {
            const emailId = this._newEmailIDs[emailIdIndex];
            this._fn_abd(emailId)
        }
        this._newEmailIDs = []
        return false
    }

    public _fn_qv() {
        if (this._newEmailIDs.length > 0) {
            return true
        }
        let emailList = this.EmailList
        for (let emailIndex = 0; emailIndex < emailList.length; emailIndex++) {
            const email = emailList[emailIndex];
            if (email.readState == EmailState.unRead || (email.reward && email.reward.length > 0 && email.receicedState == EmailRewardState.unReceive)) {
                return true
            }
        }
        return false
    }

    public _fn_abd(id: number) {
        ServerCtrJSF._fn_hp()._fn_aau(GameStorage._fn_rb(Const.DataKeys.emailList + "_" + id))
    }

    _fn_uw(value: any) {
        if (value == null) {
            return
        }
        if (value.key.indexOf(GameStorage._fn_rb(Const.DataKeys.emailList)) >= 0) {
            EmailManager._fn_ho()._fn_acp(value.val)
        }
    }

    public _fn_c() {
        let email: Email = {
            id: 10003,
            type: EmailType.type_sys,
            content: "胖胖的曹间捡到了一个礼盒",
            readState: EmailState.unRead,
            receicedState: EmailRewardState.unReceive,
            reward: [{ propId: 101, cnt: 100 }],
            time: TimeCtrJSF._fn_hp().ServerTime,
            title: "运营补偿",
        }
        this._fn_acp(email)

        let email1: Email = {
            id: 10015,
            type: EmailType.type_sys,
            content: "胖胖的曹间说了一大堆废话aaaaa。。。。。。。",
            readState: EmailState.unRead,
            receicedState: EmailRewardState.unReceive,
            reward: [],
            time: TimeCtrJSF._fn_hp().ServerTime,
            title: "系统公告2",
        }
        this._fn_acp(email1)
    }

    public _fn_acp(email: Email) {
        GameStorage._fn_afh(Const.DataKeys.emailList + "_" + email.id, email)
    }

    public _fn_gy(id: number) {
        return GameStorage._fn_io(Const.DataKeys.emailList + "_" + id, null)
    }

    public _fn_aah(id: number) {
        GameStorage.removeItem(Const.DataKeys.emailList + "_" + id)
    }

    public _fn_aae() {
        GameStorage._fn_aai(GameStorage._fn_ip(Const.DataKeys.emailList).keys)
    }

}
