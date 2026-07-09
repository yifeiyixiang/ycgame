import { _decorator, Component, Node, Prefab, instantiate, Game } from 'cc';
import { Const } from '../../config/Const';
import DataManager from '../../config/DataManager';
import { BaseUiComponent } from '../mgr/comm';
import { NodePoolService } from '../mgr/poolManager';
import { UtilPub } from '../utils/UtilPub';
const { ccclass, property } = _decorator;

@ccclass('toCsv')
export class CsvExportTool extends BaseUiComponent {




    onLoad(){

    }






    public _fn_ajb(level:number, grids:Node[][], parentNode:Node, objgrids:number[][], cb:Function){
        let tab = DataManager._fn_lt("level"+level)

        let keys = Object.keys(tab)


        let rows:{[key: string]: any[]} = {}
        for(let i=0; i<keys.length; i++){
            let key = keys[i]
            let row = tab[key]
            if(!rows.hasOwnProperty(row.row)){
                rows[row.row] = []
            }
            rows[row.row].push(row)
        }



        let rows2 = []
        for(let rowKey in rows){
            let r = rows[rowKey]
            r.sort((a,b)=>{
                return a.col-b.col
            })
            rows2.push(r)
        }

        let final = []
        for(let i=0; i<rows2.length; i++){
            for(let j=0; j<rows2[i].length; j++){
                final.push(rows2[i][j])
            }
        }


        UtilPub.log("-----自定义场景1---", final, level)

        let idx = 0
        for(let i=0; i<final.length; i++){
            let row = final[i]
            UtilPub.log("------row---", row, i, final.length)
            if(row==undefined || row.name==undefined || row.ID==0){
                idx+=1
                if(idx>=final.length-1){
                    cb && cb()
                }
                continue
            }
            if(row.name=="prerfab_stump"){
                row.name="prefab_stump"
            }


            //@ts-ignore
            let pName = Const.Prefabs[row.name]
            UtilPub._fn_jj(pName, (p:Prefab)=>{
                if(p){
                    UtilPub.log(row.name)
                    let node = NodePoolService.instance.getNode(p, parentNode)

                    let rowIdx = row.row
                    let colIdx = row.col
                    if(objgrids[rowIdx]==null){
                        objgrids[rowIdx] = []
                    }
                    objgrids[rowIdx][colIdx]=1

                    node.worldPosition = grids[rowIdx][colIdx].worldPosition
                    node.setScale(row.ScaX, row.ScaY, row.ScaZ);
                    node.setRotationFromEuler(row.rotX, row.rotY, row.rotZ);
                    node.setWorldPosition(node.worldPosition.x + row.posX, node.worldPosition.y + row.posY, node.worldPosition.z + row.posZ);

                    if(node.name.includes("prefab_water")){
                        grids[rowIdx][colIdx].active = false
                    }
                    if(node.name == "prefab_box"){
                        NodePoolService.instance._fn_xz(node)
                    }
                }else{
                    UtilPub.log("---------warn---存在未解析的预制体--", row.name)
                }


                idx +=1
                if(idx>=final.length-1){
                    cb && cb()
                }
            })
        }

    }

    public _fn_ajc(node:Node):string {
        var data1 = '';
        var index = 1;
        var da = '索引,' + '节点名字,' + 'posX,' + 'posY,' + 'posZ,' + 'rotX,' + 'rotY,' + 'rotZ,' + 'ScaX,' + 'ScaY,' + 'ScaZ,' + 'row,'+ 'col,' + '\n' +
            'number,' + 'string,' + 'number,' + 'number,' + 'number,' + 'number,' + 'number,' + 'number,' + 'number,' + 'number,' + 'number,' + 'number,' + 'number,' + '\n' +
            'ID,' + 'name,' + 'posX,' + 'posY,' + 'posZ,' + 'rotX,' + 'rotY,' + 'rotZ,' + 'ScaX,' + 'ScaY,' + 'ScaZ,' + 'row,'+ 'col,' + '\n';
        data1 += da;

        for(let rowIdx=0; rowIdx<node.children.length; rowIdx++ ){
            let row = node.children[rowIdx]

            let cols = row.children
            for(let colIdx=0; colIdx<cols.length; colIdx++){
                let col = cols[colIdx]
                for(let idx=0; idx<col.children.length; idx++){
                    let option = col.children[idx]
                    if(option.name=="prefab_floor") continue
                    da = index + ',' + option.name + "," + option.position.x + "," + option.position.y + "," + option.position.z + "," + option.eulerAngles.x + "," + option.eulerAngles.y + "," + option.eulerAngles.z + "," +
                    option.scale.x + ',' + option.scale.y + "," + option.scale.z + "," + rowIdx + "," + colIdx  +  '\n';
                    data1 += da;
                    index++
                }
            }
        }
        return data1;
    }

}

