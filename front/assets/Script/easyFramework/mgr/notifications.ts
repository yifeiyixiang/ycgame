
export class notifications {
	public static readonly _instance: notifications = new notifications();
	private _eventMap: any = {};




	public clear(){
		this._eventMap = {}
	}







	public on(type: string, callback: Function, target: Object) {
		if (!callback || !type) {
			console.error(`${type}事件注册失败...`);
			return null;
		}
		if (!this._eventMap[type]) {
			this._eventMap[type] = [];
		}

		this._eventMap[type].push({callback, target});

	}







	public once(type: string, callback: Function, target: Object) {
		this.on(type, (parameters: any) => {
			this.off(type, target);
			callback.call(target, parameters);
		}, target);
	}






	public emit(type: string, ...parameters: any[]) {
		let eventList = this._eventMap[type];
		if (!eventList) {

			return;
		}
		for (let key in eventList) {
			if (eventList.hasOwnProperty(key)) {
				let element = eventList[key];
				if (element && element.target) {
					let a = element.callback.call(element.target, ...parameters);
					if(a){
						return a;
					}

				}
			}
		}
	}






	public off(type: string, target: Object) {
		let eventList: Array<Object> = this._eventMap[type];
		if (!eventList) return;
		for (let key in eventList) {
			if (eventList.hasOwnProperty(key)) {
				let element: any = eventList[key];
				if (element && element.target === target) {
					eventList[key] = null!;
					eventList.splice(Number(key), 1);

				}
			}
		}
		if (eventList.length === 0) {
			delete this._eventMap[type];
		}
	}





	public offTarget(target: Object) {
		for (let type in this._eventMap) {
			if (this._eventMap.hasOwnProperty(type)) {
				let eventList: Array<any> = this._eventMap[type];
				for (let index = 0; index < eventList.length; index++) {
					let obj: { callback: Function; target: Object } = eventList[index];

					if (obj && obj.target && obj.target === target) {
						eventList.splice(index, 1);
					}
				}
			}
			if (this._eventMap.hasOwnProperty(type) && this._eventMap[type].length === 0) {
				delete this._eventMap[type];
			}
		}
	}
}

export const Notifications = notifications._instance;
