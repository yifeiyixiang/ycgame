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

        GameEventManager.eventTarget.on(GameEventManager.EEventName.ADD_ZHUNASHI, this._fn_zc, this)

        GameEventManager.eventTarget.on(GameEventManager.EEventName.ID_Drangging, this.isdrage, this)

        this.on(GD.event.updateScenePet, this._fn_k)

        this._fn_k();

        this._fn_ys();


        this.scroll.cancelInnerEvents = false;
        this.scroll.content.zIndex = 1;

        GameHttpClient._fn_ho().sednBagInfo(4,  ()=>{
            this._fn_zc();
        });
    }

    _fn_ys(){
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
        AudioPlaybackService.instance._fn_xc(Const.Audio.btn)
        if (str == "btn1"){
            playerDataStore.sceneStau = 1
            this._fn_zc();
            this._fn_ys();
        }
        else if (str == "btn2"){
            playerDataStore.sceneStau = 2;
             this._fn_zc();
            this._fn_ys();
        }
        else if (str == "btn3"){
           if(playerDataStore.pets.length == 0){
                 GameHttpClient._fn_ho()._fn_jc(()=>{
                if (playerDataStore.pets.length == 0){
                    this._fn_aiu("您还未拥有宠物");
                    return;
                }
                UiLayerService.instance._fn_xw(Const.Dialogs.PetListView)
            })
           }else{
                UiLayerService.instance._fn_xw(Const.Dialogs.PetListView)
           }
        }
    }


    _fn_k(){

        let pets:PetProfileRecord[] = playerDataStore.pets;


         for (let petNodeIndex = 0; petNodeIndex < this.petPfbParent.children.length; petNodeIndex++) {
            let petNode = this.petPfbParent.children[petNodeIndex];
            let petRecord:PetProfileRecord = GameRuntimeData._fn_jb(petNode.getComponent(pet).petId);
            if(!petRecord){
                petNode.removeFromParent()
                petNode.destroy();
                petNode = null;
            }else{
                petNode.active = petRecord.is_active;
            }
        }

        for (let petIndex = 0; petIndex < pets.length; petIndex++) {
            let shouldCreatePetNode:boolean = true;
            let petRecord:PetProfileRecord = pets[petIndex];

            for (let petNodeIndex = 0; petNodeIndex < this.petPfbParent.children.length; petNodeIndex++) {
                let petNode = this.petPfbParent.children[petNodeIndex];
                let mountedPetRecord:PetProfileRecord = petNode.getComponent(pet).petData
                if (petNode && mountedPetRecord && mountedPetRecord.id == petRecord.id){
                    shouldCreatePetNode = false;
                    break;
                }
            }
            if (!petRecord.is_active){
                continue;
            }
            if (shouldCreatePetNode){
                let petNode = instantiate(this.petPfb);
                petNode.getComponent(pet).init(petRecord);

                this.petPfbParent.addChild(petNode);

            }
        }
    }


    _fn_zc(){

        let goods:BagPropRecord[] = playerDataStore.bagProps;


         for (let decorationNodeIndex = 0; decorationNodeIndex < this.goodPfbParent.children.length; decorationNodeIndex++) {
            let decorationNode = this.goodPfbParent.children[decorationNodeIndex];
            let decorationRecord:BagPropRecord = GameRuntimeData._fn_fp(decorationNode.getComponent(GoodsItemDragController).id);
            if(!decorationRecord){
                decorationNode.removeFromParent()
                decorationNode.destroy();
                decorationNode = null;
            }else{
                decorationNode.active = decorationRecord.is_active;
            }
        }

        for (let decorationIndex = 0; decorationIndex < goods.length; decorationIndex++) {
            let shouldCreateDecorationNode:boolean = true;
            let decorationRecord:BagPropRecord = goods[decorationIndex];

            for (let decorationNodeIndex = 0; decorationNodeIndex < this.goodPfbParent.children.length; decorationNodeIndex++) {
                let decorationNode = this.goodPfbParent.children[decorationNodeIndex];
                let decorationId:number = decorationNode.getComponent(GoodsItemDragController).id
                if (decorationNode && decorationId == decorationRecord.id){
                    shouldCreateDecorationNode = false;
                    break;
                }
            }
            if (!decorationRecord.is_active){
                continue;
            }
            if (shouldCreateDecorationNode){
                let decorationNode = instantiate(this.goodPfb);
                decorationNode.getComponent(GoodsItemDragController).init(decorationRecord);

                this.goodPfbParent.addChild(decorationNode);
            }
        }
        GameEventManager.eventTarget.emit(GameEventManager.EEventName.REFRESH_GOOD_STATU)
    }

    _fn_t(decorationRecord:BagPropRecord){
        let alreadyMounted:boolean = false;
         for (let decorationNodeIndex = 0; decorationNodeIndex < this.goodPfbParent.children.length; decorationNodeIndex++) {
            let decorationNode = this.goodPfbParent.children[decorationNodeIndex];
            let mountedDecorationRecord:BagPropRecord = decorationNode.getComponent(GoodsItemDragController).decorationRecord
            if (decorationNode && mountedDecorationRecord && mountedDecorationRecord.id == decorationRecord.id){
                alreadyMounted = true;
                break;
            }
        }
        if (alreadyMounted){

            return;
        }
        if (decorationRecord){
            let decorationNode = instantiate(this.goodPfb);
            decorationNode.getComponent(GoodsItemDragController).init(decorationRecord);

            this.goodPfbParent.addChild(decorationNode);
        }
    }

    showTip(tip:string){
        this._fn_aiu(tip);
    }
}

