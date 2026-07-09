import { _decorator,sp,resources } from 'cc';
import { ResourceLoaderService } from '../mgr/resourceUtil';
import { UtilPub } from '../utils/UtilPub';
import { Const } from '../../config/Const';
import { PetProfileRecord } from '../../../typeScript/gameData';
const { ccclass, property } = _decorator;




export default class TableDataService {
	private static _instance: TableDataService;

	public static ins(): TableDataService {
		if (!this._instance) {
			this._instance = new TableDataService();
		}
		return this._instance;
	}

	public TableDataService: any = {};


	public config: any = {};

	public async _fn_rs() {
		return new Promise<void>(resolve => {
			console.log("表格数据处理")
			ResourceLoaderService._fn_rp('json', "./", (err, assets) => {

				console.log("table err----------", err)
				console.log("table data----------", assets.length)
				if (err) {
					console.log('加载json文件失败');

					return;
				}
				if (err) {
					console.error('加载bundle错误:', name, err)
					return;
				}
				for (let i = 0; i < assets.length; i++) {
					let asset = assets[i];

					//@ts-ignore
					this.TableDataService[asset.name] = asset.json;
					console.log("xxxxx--------aasset:", asset.name)
					if (asset.name == "config_table") {
						for (let index = 0; index < this.TableDataService[asset.name].length; index++) {
							let row = this.TableDataService[asset.name][index];
							this.config[row.key] = row.value;

						}
					}
				}
				resolve()
			})
		})
	}

	public _fn_lt(name: string) {
		return this.TableDataService[name];
	}
	public _fn_ly(name: string, id: number) {
		let table = this._fn_lt(name);
		for (let i = 0; i < table.length; i++) {
			const t = table[i];
			if (t.id == id) {
				if (name == Const.Tables.new_sign){
					if (t.sign_in_rewards && typeof t.sign_in_rewards === "string"){
						 t.sign_in_rewards = JSON.parse(t.sign_in_rewards);
					}
				}
				else if (name == Const.Tables.new_task){
					if (t.task_gift && typeof t.task_gift === "string"){
						 t.task_gift = JSON.parse(t.task_gift);
					}
				}
				else if (name == Const.Tables.new_activityPrpgress){
					if (t.task_gift && typeof t.task_gift === "string"){
						 t.task_gift = JSON.parse(t.task_gift);
					}
				}
				return JSON.parse(JSON.stringify(t));
			}
		}

	}





	public _fn_lw(name: string) {
		let table = this._fn_lt(name);
		return JSON.parse(JSON.stringify(table[table.length - 1]));
	}
	public _fn_lz(name: string, key: string, value: any) {
		let table = this._fn_lt(name);
		for (let i = 0; i < table.length; i++) {
			const t = table[i];
			if (t[key] == value) {
				return t;
			}
		}
	}

	public _fn_mb(tableName: string, colName: string, colVal: string | number) {
		let table = this._fn_lt(tableName);
		let res = []
		for (let i = 0; i < table.length; i++) {
			const row = table[i];
			if (row[colName] == colVal) {
				res.push(row)
			}
		}
		return res
	}

	public _fn_mf(tableName: string, colName: string, colVal: string | number, colName2: string) {
		let table = this._fn_lt(tableName);
		let res: any = []
		let num = 0
		for (let i = 0; i < table.length; i++) {
			const row = table[i];
			if (row[colName] == colVal && res[row[colName2]] == null) {
				num++
				res[row[colName2]] = 1
			}
		}
		return num
	}

	public _fn_mc(tableName: string, colName: string, colVal: string, colName2: string, colVal2: string) {
		let table = this._fn_lt(tableName);
		let res = []
		for (let i = 0; i < table.length; i++) {
			const row = table[i];
			if (row[colName] == colVal && row[colName2] == colVal2) {
				res.push(row)
			}
		}
		return res
	}

	public _fn_md(tableName: string, colName: string, colVal: string, colName2: string, colVal2: string) {
		let table = this._fn_lt(tableName);
		let res = []
		for (let i = 0; i < table.length; i++) {
			const row = table[i];
			if (row[colName] == colVal && row[colName2] == colVal2) {
				res.push(row)
			}
		}
		if (res.length > 0)
			return res[0]
		return null
	}

	public _fn_me(tableName: string, colName: string, colVal: string, colName2: string, colVal2: string, colName3: string, colVal3: string) {
		let table = this._fn_lt(tableName);
		let res = []
		for (let i = 0; i < table.length; i++) {
			const row = table[i];
			if (row[colName] == colVal && row[colName2] == colVal2 && row[colName3] == colVal3) {
				res.push(row)
			}
		}
		return res
	}

	public _fn_ma(name: string, id: number) {
		let table = this._fn_lt(name);
		for (let i = 0; i < table.length; i++) {
			const t = table[i];
			if (t.level == id) {
				return t;
			}
		}
	}

	public _fn_lx(name: string) {
		let level = 1;
		let tab = null;
		let table = this._fn_lt(name);
		for (let i = 0; i < table.length; i++) {
			const t = table[i];
			if (t.level > level) {
				level = t.level;
				tab = t;
			}
		}
		return tab
	}
}
