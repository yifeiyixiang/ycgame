import { _decorator, Component, dragonBones, Label, Node,EventTouch,UITransform, randomRangeInt, SkeletalAnimation, sp, Sprite, SpriteFrame, Tween, tween, Vec2, Vec3 } from 'cc';
import { BagPropRecord, GameRuntimeData, PetProfileRecord, ShopConfigRecord } from './gameData';
import { ItemEnumId, ItemEnumType, LanguageContentManager, PetConfigRecord } from './LanauageManager';
import { GameHttpClient } from './net/HttpClient';
import { GameEventManager } from './EventManger';
import { Const } from '../Script/config/Const';
import { UiLayerService } from '../Script/easyFramework/mgr/uiManager';
import TableDataService from '../Script/easyFramework/other/tables';
import BaseView from '../Script/easyFramework/mgr/BaseView';
import { playerDataStore } from '../Script/game/comm/UserData';
const { ccclass, property } = _decorator;

@ccclass('goodItem')
export class GoodsItemDragController extends BaseView {

    @property(Sprite)
    icon: Sprite = null;

    @property(Node)
    closeBtn: Node = null;

    public bagData!:BagPropRecord;

    public shopCfg!:ShopConfigRecord;


    id:number = 0;

    private isDragging: boolean = false;

    private touchOffset: Vec3 = new Vec3();

    onLoad() {

        this.icon.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.icon.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.icon.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.icon.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        GameEventManager.eventTarget.on(GameEventManager.EEventName.REFRESH_GOOD_STATU, this.refreshStatu, this);
    }

    onDestroy() {

        this.icon.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.icon.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.icon.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.icon.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        GameEventManager.eventTarget.off(GameEventManager.EEventName.REFRESH_GOOD_STATU, this.refreshStatu, this);
    }

     init(bagData:BagPropRecord){

        this.bagData = bagData;

        this.id = this.bagData.id

        this.shopCfg = TableDataService.ins().getTableValueByID(Const.Tables.new_prop, this.bagData.prop_id);


        this.node.setPosition(this.bagData.position_x, this.bagData.position_y, 0)

        if (this.shopCfg.decoration_res){
            this.setSpriteFrame(this.icon, Const.resPath.icon + this.shopCfg.decoration_res, () => { })
            this.icon.node.active = true;
        }else{
            this.icon.node.active = false;
        }

        this.refreshStatu();
    }

    refreshStatu(){

        let data = GameRuntimeData.getBagDataById(this.id)
        if (data){
            this.bagData = data;
        }
        if (!this.bagData){
            this.node.active = false;
            return;
        }
        if (!this.bagData.is_active){
            this.node.active = false;
        }
        else if (playerDataStore.sceneStau == 1 && this.shopCfg.typeson == 1){
            this.node.active = true;
        }else if (playerDataStore.sceneStau == 2 && this.shopCfg.typeson == 2){
            this.node.active = true;
        }else{
            this.node.active = false;
        }

        if (this.node.active){
            if (playerDataStore.goodIsCanOperate){
                this.closeBtn.active = true;
            }else{
                this.closeBtn.active = false;
            }
        }
    }

    private onTouchStart(event: EventTouch) {
        if (!playerDataStore.goodIsCanOperate){
            return;
        }
        this.isDragging = true;

        const uiPos = event.getUILocation();
        const localTouchPos = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(uiPos.x, uiPos.y, 0));


        this.touchOffset.set(
            localTouchPos.x - this.node.position.x,
            localTouchPos.y - this.node.position.y,
            0
        );
        GameEventManager.eventTarget.emit(GameEventManager.EEventName.ID_Drangging,  this.isDragging)
    }

    private onTouchMove(e: EventTouch): void {
         if (!playerDataStore.goodIsCanOperate){
            return;
        }
        if (!this.isDragging) return;

        const uiPos = e.getUILocation();
        const localPos = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(uiPos.x, uiPos.y, 0));

        this.node.setPosition(
            localPos.x - this.touchOffset.x,
            localPos.y - this.touchOffset.y,
            this.node.position.z
        );
    }


    private onTouchEnd() {
        this.isDragging = false;
        if (!playerDataStore.goodIsCanOperate){
            return;
        }

        GameHttpClient.getInstance().sendGoodPos(1, this.bagData.id, this.node.position.x, this.node.position.y);

        GameEventManager.eventTarget.emit(GameEventManager.EEventName.ID_Drangging,  this.isDragging)
    }

    onCloseClick(){
        GameHttpClient.getInstance().sendGoodPos(2, this.bagData.id, 0, 0);
    }
}


