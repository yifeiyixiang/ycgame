
class DataManager{
    data: object  = {}

    public _fn_lt(tableName:string) {

        //@ts-ignore
        return this.data[tableName];
    }

    public _fn_nf (tableName:string, arr: string[]) {

        let tips = arr[0].split(',');

        let types = arr[1].split(',');

        let names = arr[2].split(',');


        let table: {[key: string]: object} = {};
        for (let i = 3; i < arr.length; i++) {
            let single = arr[i].split(/,/g);
            let obj = this._fn_aic(names, types, single, tableName, single[0]);
            let key = single[0];
            table[key] = obj;
        }


        //@ts-ignore
        this.data[tableName] = table;

    }

    private _fn_aic(names:string[], types:string[], single: string[], tableName:string, taK:string) {
        let obj = {};
        for (let i = 0; i < single.length; i++) {

            if (!names[i]) {
                continue;
            }

            let key = names[i].replace(/\b\s*/g,"");
            let value = single[i].replace(/\b\s*/g,"");
            let typeName = types[i].replace(/\b\s*/g,"");


            if (typeName == 'string') {
                //@ts-ignore
                obj[key] = value;
            }else if (typeName == "number"){
                //@ts-ignore
                obj[key] = Number(value);
            }
        }
        return obj;
    }

    public _fn_lv(name : any, typename : any, type : any){
        let list = [];
        let table = this._fn_lt(name);
        for(let i in table){
            //@ts-ignore
            if(table[i][`${typename}`] == type){
                //@ts-ignore
                list.push(table[i]);
            }
        }
        return list;
    }

    public _fn_lu(name : string, id : Number){
        let tabeldata ;
        let table = this._fn_lt(name);
        for(let i in table){
            //@ts-ignore
            if(table[i].id == id){
                //@ts-ignore
                tabeldata = table[i];
                return tabeldata;
            }
        }
        return tabeldata;
    }
}

export default new DataManager();
