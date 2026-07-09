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

    public decorationRecord!:BagPropRecord;

    public decorationConfig!:ShopConfigRecord;


    id:number = 0;

    private isDragging: boolean = false;

    private touchOffset: Vec3 = new Vec3();

    onLoad() {

        this.icon.node.on(Node.EventType.TOUCH_START, this._fn_wa, this);
        this.icon.node.on(Node.EventType.TOUCH_MOVE, this._fn_vz, this);
        this.icon.node.on(Node.EventType.TOUCH_END, this._fn_vx, this);
        this.icon.node.on(Node.EventType.TOUCH_CANCEL, this._fn_vx, this);

        GameEventManager.eventTarget.on(GameEventManager.EEventName.REFRESH_GOOD_STATU, this._fn_zu, this);
    }

    onDestroy() {

        this.icon.node.off(Node.EventType.TOUCH_START, this._fn_wa, this);
        this.icon.node.off(Node.EventType.TOUCH_MOVE, this._fn_vz, this);
        this.icon.node.off(Node.EventType.TOUCH_END, this._fn_vx, this);
        this.icon.node.off(Node.EventType.TOUCH_CANCEL, this._fn_vx, this);

        GameEventManager.eventTarget.off(GameEventManager.EEventName.REFRESH_GOOD_STATU, this._fn_zu, this);
    }

     init(decorationRecord:BagPropRecord){

        this.decorationRecord = decorationRecord;

        this.id = this.decorationRecord.id

        this.decorationConfig = TableDataService.ins()._fn_ly(Const.Tables.new_prop, this.decorationRecord.prop_id);


        this.node.setPosition(this.decorationRecord.position_x, this.decorationRecord.position_y, 0)

        if (this.decorationConfig.decoration_res){
            this._fn_agk(this.icon, Const.resPath.icon + this.decorationConfig.decoration_res, () => { })
            this.icon.node.active = true;
        }else{
            this.icon.node.active = false;
        }

        this._fn_zu();
    }

    _fn_zu(){

        let latestDecorationRecord = GameRuntimeData._fn_fp(this.id)
        if (latestDecorationRecord){
            this.decorationRecord = latestDecorationRecord;
        }
        if (!this.decorationRecord){
            this.node.active = false;
            return;
        }
        if (!this.decorationRecord.is_active){
            this.node.active = false;
        }
        else if (playerDataStore.sceneStau == 1 && this.decorationConfig.typeson == 1){
            this.node.active = true;
        }else if (playerDataStore.sceneStau == 2 && this.decorationConfig.typeson == 2){
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

    private _fn_wa(event: EventTouch) {
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

    private _fn_vz(e: EventTouch): void {
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


    private _fn_vx() {
        this.isDragging = false;
        if (!playerDataStore.goodIsCanOperate){
            return;
        }

        GameHttpClient._fn_ho().sendGoodPos(1, this.decorationRecord.id, this.node.position.x, this.node.position.y);

        GameEventManager.eventTarget.emit(GameEventManager.EEventName.ID_Drangging,  this.isDragging)
    }

    onCloseClick(){
        GameHttpClient._fn_ho().sendGoodPos(2, this.decorationRecord.id, 0, 0);
    }
}


