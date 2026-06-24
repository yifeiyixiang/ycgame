import { _decorator, Component, Node, Prefab, instantiate,Sprite, SpriteFrame,ScrollView ,EventTouch} from 'cc';
import { BagPropRecord, GameRuntimeData, PetProfileRecord } from './gameData';
import { pet } from './pet';
import BaseView from '../Script/easyFramework/mgr/BaseView';
import { playerDataStore } from '../Script/game/comm/UserData';
import { Const } from '../Script/config/Const';
import { GameEventManager } from './EventManger';
import { UiLayerService } from '../Script/easyFramework/mgr/uiManager';
import { AudioPlaybackService } from '../Script/easyFramework/mgr/audioManager';
import GD from '../Script/config/GD';
import { GameHttpClient } from './net/HttpClient';
import { GoodsItemDragController } from './goodItem';
const { ccclass, property } = _decorator;

@ccclass('mainPet')
export class PetHomePanelController extends BaseView {


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


    @property(Prefab)
    petPfb:Prefab = null;


    @property(Node)
    petPfbParent:Node = null;


    @property(Prefab)
    goodPfb:Prefab = null;


    @property(Node)
    goodPfbParent:Node = null;

    start() {

        GameEventManager.eventTarget.on(GameEventManager.EEventName.SHOW_TIP, this.showTip, this)

        GameEventManager.eventTarget.on(GameEventManager.EEventName.ADD_ZHUNASHI, this.refreshGoodPfb, this)

        GameEventManager.eventTarget.on(GameEventManager.EEventName.ID_Drangging, this.isdrage, this)

        this.on(GD.event.updateScenePet, this.addPetPfb)

        this.addPetPfb();

        this.refresh();


        this.scroll.cancelInnerEvents = false;
        this.scroll.content.zIndex = 1;

        GameHttpClient.getInstance().sednBagInfo(4,  ()=>{
            this.refreshGoodPfb();
        });
    }

    refresh(){
        this.btn1.active = playerDataStore.sceneStau == 2

        this.btn2.active = playerDataStore.sceneStau == 1



        this.bg2.active = playerDataStore.sceneStau == 1
    }

    isdrage(isdrage:boolean = false){

        this.scroll.enabled = !isdrage;
    }

    update(deltaTime: number) {

    }

    onClickHandler(eve:Event, str:string){
        AudioPlaybackService.instance.playSound(Const.Audio.btn)
        if (str == "btn1"){
            playerDataStore.sceneStau = 1
            this.refreshGoodPfb();
            this.refresh();
        }
        else if (str == "btn2"){
            playerDataStore.sceneStau = 2;
             this.refreshGoodPfb();
            this.refresh();
        }
        else if (str == "btn3"){
           if(playerDataStore.pets.length == 0){
                 GameHttpClient.getInstance().getPetList(()=>{
                if (playerDataStore.pets.length == 0){
                    this.toast("您还未拥有宠物");
                    return;
                }
                UiLayerService.instance.pushShowDialog(Const.Dialogs.PetListView)
            })
           }else{
                UiLayerService.instance.pushShowDialog(Const.Dialogs.PetListView)
           }
        }
    }


    addPetPfb(){

        let pets:PetProfileRecord[] = playerDataStore.pets;


         for (let ind = 0; ind < this.petPfbParent.children.length; ind++) {
            let pfb = this.petPfbParent.children[ind];
            let pfbData:PetProfileRecord = GameRuntimeData.getPetDataById(pfb.getComponent(pet).petId);
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
            let petData:PetProfileRecord = pets[index];

            for (let ind = 0; ind < this.petPfbParent.children.length; ind++) {
                let pfb = this.petPfbParent.children[ind];
                let pfbData:PetProfileRecord = pfb.getComponent(pet).petData
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


    refreshGoodPfb(){

        let goods:BagPropRecord[] = playerDataStore.bagProps;


         for (let ind = 0; ind < this.goodPfbParent.children.length; ind++) {
            let pfb = this.goodPfbParent.children[ind];
            let pfbData:BagPropRecord = GameRuntimeData.getBagDataById(pfb.getComponent(GoodsItemDragController).id);
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
            let goodData:BagPropRecord = goods[index];

            for (let ind = 0; ind < this.goodPfbParent.children.length; ind++) {
                let pfb = this.goodPfbParent.children[ind];
                let id:number = pfb.getComponent(GoodsItemDragController).id
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
                pfb.getComponent(GoodsItemDragController).init(goodData);

                this.goodPfbParent.addChild(pfb);
            }
        }
        GameEventManager.eventTarget.emit(GameEventManager.EEventName.REFRESH_GOOD_STATU)
    }

    addZhuanshi(bagData:BagPropRecord){
        let isIns:boolean = false;
         for (let ind = 0; ind < this.goodPfbParent.children.length; ind++) {
            let pfb = this.goodPfbParent.children[ind];
            let pfbData:BagPropRecord = pfb.getComponent(GoodsItemDragController).bagData
            if (pfb && pfbData && pfbData.id == bagData.id){
                isIns = true;
                break;
            }
        }
        if (isIns){

            return;
        }
        if (bagData){
            let pfb = instantiate(this.goodPfb);
            pfb.getComponent(GoodsItemDragController).init(bagData);

            this.goodPfbParent.addChild(pfb);
        }
    }

    showTip(tip:string){
        this.toast(tip);
    }
}

