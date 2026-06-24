import { Component, Node, NodePool, Prefab, _decorator, instantiate } from "cc";
import { GTypeStrNode } from "../../config/global";
import { UtilPub } from "../utils/UtilPub";
const { ccclass, property } = _decorator;

@ccclass("poolManager")
export class NodePoolService extends Component {
    dictPool: { [name: string]: NodePool }= {}
    dictPrefab: { [name: string]: Prefab } = {}

    static _instance: NodePoolService;

    static get instance () {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new NodePoolService();
        return this._instance;
    }

    isTimeToClear:boolean = false
    markTime:Date=new Date()





    getNode (prefab: Prefab, parent: Node, isActive:boolean=true) {




        try{
            let name = prefab.data.name;
            this.dictPrefab[name] = prefab;
            let node: Node;
            if (this.dictPool.hasOwnProperty(name)) {

                let pool = this.dictPool[name];
                if (pool.size() > 0) {
                    node = pool.get()!;
                    if(node==null){
                        node = instantiate(prefab);
                    }
                } else {
                    node = instantiate(prefab);
                }
            } else {

                let pool = new NodePool();
                this.dictPool[name] = pool;
                node = instantiate(prefab);
            }

            node.parent = parent;
            node.active = isActive
            return node;
        }catch(e:any){
            console.log("===================getNode",e.message,e.stackTrace,e.stack);
        }
        return null;
    }




    putNode (node: Node) {
        if(node==null) return
        let name = node.name;
        let pool = null;
        if (this.dictPool.hasOwnProperty(name)) {

            pool = this.dictPool[name];
        } else {

            pool = new NodePool();
            this.dictPool[name] = pool;
        }
        node.parent = null;
        node.active = false
        pool.put(node);
    }

    putNodeArr(nodes: Node[]){
        if(nodes.length==0) return
        for(let i=0; i<nodes.length; i++){
            NodePoolService.instance.putNode(nodes[i])
        }
    }

    putNodeObjString(nodes:GTypeStrNode){
        for(let key in nodes){
            if(nodes.hasOwnProperty(key)){
                NodePoolService.instance.putNode(nodes[key])
            }
        }
    }

    putNodeObjNumber(nodes:{[key: number]: Node}){
        for(let key in nodes){
            if(nodes.hasOwnProperty(key)){
                NodePoolService.instance.putNode(nodes[key])
            }
        }
    }




    clearPool (name: string) {
        if (this.dictPool.hasOwnProperty(name)) {
            let pool = this.dictPool[name];
            pool.clear();
        }
    }

    clearCompatPool (cb?:Function) {
        for(let nodeName in this.dictPool){
            if(this.dictPool.hasOwnProperty(nodeName)){
                let pool = this.dictPool[nodeName]
                if(nodeName=="player"){continue}
                else if(nodeName=="prefab_building"){continue}





                else if(nodeName=="loading"){continue}



                UtilPub.warn("---------pool名称---", nodeName, pool.size())
            }
        }
        if(cb){
            this.scheduleOnce(()=>{
                cb && cb()
            },0.3)
        }

    }

}
