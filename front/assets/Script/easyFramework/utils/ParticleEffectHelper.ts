import { ParticleSystem,Node } from "cc";
export module ParticleEffectHelper{
    export function _fn_wv(node:Node){
        if(node==null || node.active==false ||node.isValid==false) return
        const arr = node.getComponentsInChildren(ParticleSystem);
        for(let a of arr){
            if(a!=null && a.node.active==true){
                a.stop();
                a.play();
            }

        }
    }
    export function _fn_ail(node:Node){
        if(node==null || node.active==false ||node.isValid==false) return
        const arr = node.getComponentsInChildren(ParticleSystem);
        for(let a of arr){
            if(a!=null && a.node.active==true){
                a.stop();
            }
        }
    }
}