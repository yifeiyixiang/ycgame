
export default class HttpTransport {



	private static _instance: HttpTransport;

	public static _fn_ho(): HttpTransport {
		if (!this._instance) {
			this._instance = new HttpTransport();
		}
		return this._instance;
	}







	_fn_np(url: string, params: any, callback: Function) {


	}


}