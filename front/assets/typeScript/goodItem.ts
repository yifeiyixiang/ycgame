import { _decorator, Component, dragonBones, Label, Node,EventTouch,UITransform, randomRangeInt, SkeletalAnimation, sp, Sprite, SpriteFrame, Tween, tween, Vec2, Vec3 } from 'cc';
import { BagPropData, gameData, petItemData, ShopCfg } from './gameData';
import { ItemEnumId, ItemEnumType, LanauageManager, petConfig } from './LanauageManager';
import { HttpClient } from './net/HttpClient';
import { EventManger } from './EventManger';
import { Const } from '../Script/config/Const';
import { uiManager } from '../Script/easyFramework/mgr/uiManager';
import tables from '../Script/easyFramework/other/tables';
import BaseView from '../Script/easyFramework/mgr/BaseView';
import { userData } from '../Script/game/comm/UserData';
const { ccclass, property } = _decorator;

@ccclass('goodItem')
export class goodItem extends BaseView {

    @property(Sprite)           //提示底
    icon: Sprite = null;  

    @property(Node)           
    closeBtn: Node = null;  
  
    public bagData!:BagPropData;

    public shopCfg!:ShopCfg;

    //装饰ID
    id:number = 0;   

    private isDragging: boolean = false;

    private touchOffset: Vec3 = new Vec3();

    onLoad() {
        // 启用节点触摸事件
        this.icon.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.icon.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.icon.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.icon.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        EventManger.eventTarget.on(EventManger.EEventName.REFRESH_GOOD_STATU, this.refreshStatu, this);
    }

    onDestroy() {
        // 移除事件监听
        this.icon.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.icon.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.icon.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.icon.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        EventManger.eventTarget.off(EventManger.EEventName.REFRESH_GOOD_STATU, this.refreshStatu, this);
    }

     init(bagData:BagPropData){

        this.bagData = bagData;

        this.id = this.bagData.id

        this.shopCfg = tables.ins().getTableValueByID(Const.Tables.new_prop, this.bagData.prop_id);
        // this.nameLab.string = this.shopCfg.name;

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
        //HttpClient.getInstance().updateGoodPos(this.id, this.node.position.x, this.node.position.y)
        let data = gameData.getBagDataById(this.id)
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
        else if (userData.sceneStau == 1 && this.shopCfg.typeson == 1){
            this.node.active = true;
        }else if (userData.sceneStau == 2 && this.shopCfg.typeson == 2){
            this.node.active = true;
        }else{
            this.node.active = false;
        }

        if (this.node.active){
            if (userData.goodIsCanOperate){
                this.closeBtn.active = true;
            }else{
                this.closeBtn.active = false;  
            } 
        }
    }

    private onTouchStart(event: EventTouch) {  
        if (!userData.goodIsCanOperate){
            return;
        }
        this.isDragging = true;
        
        const uiPos = event.getUILocation();
        const localTouchPos = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(uiPos.x, uiPos.y, 0));
        
        // 只记录偏移量
        this.touchOffset.set(
            localTouchPos.x - this.node.position.x,
            localTouchPos.y - this.node.position.y,
            0
        );
        EventManger.eventTarget.emit(EventManger.EEventName.ID_Drangging,  this.isDragging)
    }

    private onTouchMove(e: EventTouch): void {
         if (!userData.goodIsCanOperate){
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
        if (!userData.goodIsCanOperate){
            return;
        }

        HttpClient.getInstance().sendGoodPos(1, this.bagData.id, this.node.position.x, this.node.position.y);

        EventManger.eventTarget.emit(EventManger.EEventName.ID_Drangging,  this.isDragging)
    }

    onCloseClick(){
        HttpClient.getInstance().sendGoodPos(2, this.bagData.id, 0, 0);
    }
}


