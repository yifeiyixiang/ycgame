
export default class HttpTransport {



	private static _instance: HttpTransport;

	public static getInstance(): HttpTransport {
		if (!this._instance) {
			this._instance = new HttpTransport();
		}
		return this._instance;
	}







	ht1tpPost(url: string, params: any, callback: Function) {


	}


}