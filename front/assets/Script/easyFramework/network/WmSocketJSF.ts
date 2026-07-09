import { _decorator, Component, Node, director } from 'cc';
import {NATIVE} from 'cc/env';
import { GEvent, GNetCmd, GNetUrl } from './conf';
import ServerCtrJSF from './ServerCtrJSF';
const { ccclass, property } = _decorator;

@ccclass('WmSocketJSF')
export class WmSocketJSF{
    eventHandlers:any = [];

    public lastHeartbeatTime:number=0;
    public isWsConnect:boolean=false;
	ws:WebSocket = null!;
	wxws:any= null;
	msgBuff:any = {};







    private static _instance: WmSocketJSF;
    public static _fn_ho(): WmSocketJSF {
        if (!this._instance) {
            this._instance = new WmSocketJSF();
			this._instance._fn_g();
        }
        return this._instance;
    }

    private isFirst = true;

    _fn_g(){
		director.off(GEvent.ws_reconnect, this._fn_vf,this);
        director.off(GEvent.ws_colse, this.onClose,this);
		director.off(GNetCmd.StickPack, this._fn_abv, this)

        director.on(GEvent.ws_reconnect, this._fn_vf,this);
        director.on(GEvent.ws_colse, this.onClose,this);
		director.on(GNetCmd.StickPack, this._fn_abv, this)
    }

	_fn_abv(data:any){

		if(data["isEnd"]==false){
			this._fn_aea(data["stick_id"], data["idx"]+1)
		}else{
			delete this.msgBuff[data["stick_id"]]
		}
	}

	_fn_hi(){
		let d = new Date().getTime();
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			let r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
	}

	_fn_mp(arr:any[]){
    	let len = 0;
    	for(let i=0;i<arr.length; i++){
    		len += arr[i].length;
		}
    	return len;
	}

	_fn_aea(uuid:string, i:number){
		let data = {
			"cmd": GNetCmd.StickPack,
			"stick_id": uuid,
			"stick_len": this._fn_mp(this.msgBuff[uuid]),
			"stick_val":this.msgBuff[uuid][i],
			"isEnd": i==this.msgBuff[uuid].length-1,
			"isStart": i==0,
			"idx":i
		}

		WmSocketJSF._fn_ho()._fn_adz(JSON.stringify(data));
	}

    _fn_vf(){

		if(this.isFirst){
			this.isFirst = false;
			this._fn_dm();
			console.log("发起第一次连-------")
		}else{
			if(!this._fn_pt()){
				this._fn_dm();
				console.log("发起重连-------")
			}
		}
    }

    onClose(){

        if (!this._fn_pt()) {
            return;
        }
        else{
            this.ws.close();
        }
    }


    _fn_dm(){
        this._fn_akb();
    }

    _fn_akb(){

    }

    _fn_uv(resp:string){
		let respJson = JSON.parse(resp)

		director.emit(respJson.cmd+"" , respJson)
    }

    _fn_pt(){
    	return this.isWsConnect;
    }
    _fn_adz(jsonData:string){

	}

    send(netdata:any){


    }

}

