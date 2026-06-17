import { _decorator, Component, Node, Prefab, instantiate,Sprite, SpriteFrame,ScrollView ,EventTouch} from 'cc';
import { BagPropData, gameData, petItemData } from './gameData';
import { pet } from './pet';
import BaseView from '../Script/easyFramework/mgr/BaseView';
import { userData } from '../Script/game/comm/UserData';
import { Const } from '../Script/config/Const';
import { EventManger } from './EventManger';
import { uiManager } from '../Script/easyFramework/mgr/uiManager';
import { audioManager } from '../Script/easyFramework/mgr/audioManager';
import GD from '../Script/config/GD';
import { HttpClient } from './net/HttpClient';
import { goodItem } from './goodItem';
const { ccclass, property } = _decorator;

@ccclass('mainPet')
export class mainPet extends BaseView {

    //宠物预制体
    @property(Node)
    bg:Node = null;

    @property(Node)
    bg2:Node = null;

    @property(Node)
    btn1:Node = null;

    @property(Node)
    btn2:Node = null;

    @property(ScrollView)
    scroll:ScrollView = null;

    //宠物预制体
    @property(Prefab)
    petPfb:Prefab = null;

    //宠物显示父类
    @property(Node)
    petPfbParent:Node = null;

    //装饰预制体
    @property(Prefab)
    goodPfb:Prefab = null;

    //装饰父类
    @property(Node)
    goodPfbParent:Node = null;

    start() {

        EventManger.eventTarget.on(EventManger.EEventName.SHOW_TIP, this.showTip, this)

        EventManger.eventTarget.on(EventManger.EEventName.ADD_ZHUNASHI, this.refreshGoodPfb, this)

        EventManger.eventTarget.on(EventManger.EEventName.ID_Drangging, this.isdrage, this)

        this.on(GD.event.updateScenePet, this.addPetPfb)

        this.addPetPfb();

        this.refresh();

        // 在滚动视图脚本中添加以下配置
        this.scroll.cancelInnerEvents = false; // 允许内部节点处理事件
        this.scroll.content.zIndex = 1;        // 确保内容节点层级低于家具

        HttpClient.getInstance().sednBagInfo(4,  ()=>{
            this.refreshGoodPfb();
        });
    }

    refresh(){
        this.btn1.active = userData.sceneStau == 2

        this.btn2.active = userData.sceneStau == 1

        // this.bg.active = userData.sceneStau == 1

        this.bg2.active = userData.sceneStau == 1
    }

    isdrage(isdrage:boolean = false){
        // 临时禁用滚动视图滚动
        this.scroll.enabled = !isdrage;
    }

    update(deltaTime: number) {
        
    }

    onClickHandler(eve:Event, str:string){
        audioManager.instance.playSound(Const.Audio.btn)
        if (str == "btn1"){
            userData.sceneStau = 1
            this.refreshGoodPfb();
            this.refresh();
        }
        else if (str == "btn2"){
            userData.sceneStau = 2;
             this.refreshGoodPfb();
            this.refresh();
        }
        else if (str == "btn3"){
           if(userData.pets.length == 0){
                 HttpClient.getInstance().getPetList(()=>{
                if (userData.pets.length == 0){
                    this.toast("您还未拥有宠物");
                    return;
                }
                uiManager.instance.pushShowDialog(Const.Dialogs.PetListView)
            })
           }else{
                uiManager.instance.pushShowDialog(Const.Dialogs.PetListView)
           }
        }
    }

    //增加宠物
    addPetPfb(){

        let pets:petItemData[] = userData.pets;

        //移除放生的宠物
         for (let ind = 0; ind < this.petPfbParent.children.length; ind++) {
            let pfb = this.petPfbParent.children[ind];
            let pfbData:petItemData = gameData.getPetDataById(pfb.getComponent(pet).petId);
            if(!pfbData){
                pfb.removeFromParent()
                pfb.destroy();
                pfb = null;
            }else{
                pfb.active = pfbData.is_active;
            }
        }

        for (let index = 0; index < pets.length; index++) {
            let isIns:boolean = true;
            let petData:petItemData = pets[index];
            
            for (let ind = 0; ind < this.petPfbParent.children.length; ind++) {
                let pfb = this.petPfbParent.children[ind];
                let pfbData:petItemData = pfb.getComponent(pet).petData
                if (pfb && pfbData && pfbData.id == petData.id){
                    isIns = false;
                    break;
                }
            }
            if (!petData.is_active){
                continue;
            }
            if (isIns){
                let pfb = instantiate(this.petPfb);
                pfb.getComponent(pet).init(petData);

                this.petPfbParent.addChild(pfb);

            }
        }
    }

    //刷新 场景装饰
    refreshGoodPfb(){

        let goods:BagPropData[] = userData.bagProps;

        //移除卸下的装饰
         for (let ind = 0; ind < this.goodPfbParent.children.length; ind++) {
            let pfb = this.goodPfbParent.children[ind];
            let pfbData:BagPropData = gameData.getBagDataById(pfb.getComponent(goodItem).id);
            if(!pfbData){
                pfb.removeFromParent()
                pfb.destroy();
                pfb = null;
            }else{
                pfb.active = pfbData.is_active;
            }
        }

        for (let index = 0; index < goods.length; index++) {
            let isIns:boolean = true;
            let goodData:BagPropData = goods[index];
            
            for (let ind = 0; ind < this.goodPfbParent.children.length; ind++) {
                let pfb = this.goodPfbParent.children[ind];
                let id:number = pfb.getComponent(goodItem).id
                if (pfb && id == goodData.id){
                    isIns = false;
                    break;
                }
            }
            if (!goodData.is_active){
                continue;
            }
            if (isIns){
                let pfb = instantiate(this.goodPfb);
                pfb.getComponent(goodItem).init(goodData);

                this.goodPfbParent.addChild(pfb);
            }
        }
        EventManger.eventTarget.emit(EventManger.EEventName.REFRESH_GOOD_STATU)
    }

    addZhuanshi(bagData:BagPropData){
        let isIns:boolean = false;
         for (let ind = 0; ind < this.goodPfbParent.children.length; ind++) {
            let pfb = this.goodPfbParent.children[ind];
            let pfbData:BagPropData = pfb.getComponent(goodItem).bagData
            if (pfb && pfbData && pfbData.id == bagData.id){
                isIns = true;
                break;
            }
        }
        if (isIns){
            //场景内已生成
            return;
        }
        if (bagData){
            let pfb = instantiate(this.goodPfb);
            pfb.getComponent(goodItem).init(bagData);

            this.goodPfbParent.addChild(pfb);
        }
    }

    showTip(tip:string){
        this.toast(tip);
    }
}

