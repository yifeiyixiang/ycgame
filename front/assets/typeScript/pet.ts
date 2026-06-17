import { _decorator, Component, dragonBones, Label, Node,UIOpacity, randomRangeInt, SkeletalAnimation, sp, Sprite, SpriteFrame, Tween, tween, Vec2, Vec3 } from 'cc';
import { gameData, petItemData } from './gameData';
import { ItemEnumId, ItemEnumType, LanauageManager, petConfig } from './LanauageManager';
import { HttpClient } from './net/HttpClient';
import { EventManger } from './EventManger';
import { Const } from '../Script/config/Const';
import { uiManager } from '../Script/easyFramework/mgr/uiManager';
import tables from '../Script/easyFramework/other/tables';
import { resourceUtil } from '../Script/easyFramework/mgr/resourceUtil';
const { ccclass, property } = _decorator;

@ccclass('pet')
export class pet extends Component {

    @property(Node)           //提示底
    statusBg: Node = null;  

    @property(Label)  
    statusLabel: Label = null;  

    @property(sp.Skeleton)  
    nodeSke: sp.Skeleton = null;    //宠物动画

    @property(Sprite)  
    qipao: Sprite = null;    //宠物气泡icon

    @property([SpriteFrame])  
    qipaos: SpriteFrame[] = [];    //宠物气泡icon组


    @property(sp.Skeleton)  
    skeMao: sp.Skeleton = null;         //帽子

    @property(sp.Skeleton)  
    skeYifu: sp.Skeleton = null;         //衣服

    @property(sp.Skeleton)  
    skeLingdai: sp.Skeleton = null;         //领带

    @property(sp.Skeleton)  
    skeXiu: sp.Skeleton = null;         //袖子

    @property(Boolean)  
    isScene: boolean = true;         //是否在场景中
  
    // @property(SpriteFrame)  
    // walkSprite: SpriteFrame = null;  
  
    // @property(SpriteFrame)  
    // sleepSprite: SpriteFrame = null;  

    public petData:petItemData;

    //宠物唯一ID
    petId:number = 0;   
  
    // 宠物状态  
    isHungry: boolean = false;  
    isDirty: boolean = false;  
    isHappy: boolean = true;  

    lastSatiety:number = 1;        //饱食度

    lastThirsty:number = 1;        //干渴度

    lastCleanliness:number = 1;       //清洁度

    tipTween:Tween<Node>;            //提示动画

    walkTween:Tween<Node>;          //行走动画

    public state:number = 0;       //当前状态 0无状态，1饱食，2干渴，3清洁，4爱心, 5抚摸, 6聊天,7货币可领取

    timeSta:number = 0;

    timeRefresh:number = 0;

    timeAiChat:number = 0;

    actionInd:number = 0;
  
    // 行走范围  
    private walkArea: number[] = [-1000, 1000, 200, -700];  //左，右，上，下

    //actions = ["", 'yidong',"shenlanyao",'shuijiao','kaixin', "yidong", "daiji"];

    actions = ["yidong", 'daiji',"kaixin",'shenlanyao','shenlanyao', "yidong"];

    actimes = [1, 10,10,20,10, 10, 5];

    //是否静止展示
    isDaiji:boolean = false;    
  
    onLoad() {  
        if (this.isScene){
            // 监听点击事件  
            this.statusBg.on(Node.EventType.TOUCH_START, this.onPetClicked, this);  

            this.nodeSke.node.on(Node.EventType.TOUCH_START, this.onPetClicked, this);

            this.showStatusTip(0)

            //this.updateAnima();

            EventManger.eventTarget.on(EventManger.EEventName.REFRESH_PET_DATA, this.refreshData, this);
        }
    }  

    start() {
       
    }

    init(petData:petItemData){

        this.petData = petData;

        this.petId = petData.id

        resourceUtil.setSkeEffect([this.nodeSke, this.skeMao, this.skeYifu, this.skeLingdai, this.skeXiu], this.petData, this);

        if(this.isScene){

            let initX:number = Math.random()*600;
            let initY:number = Math.random()*400;

            initX = initX * (Math.random()>0.5?1:-1);
            initY = initY * (Math.random()>0.5?1:-1);

            this.node.setPosition(initX, initY, 1)
        }
        
    }

    refreshData(){
        this.petData = gameData.getPetDataById(this.petId);

        if (!this.petData){
            this.node.active = false;
            return;
        }
        if (this.isScene){

            this.updateStatusLabel();

            this.node.active = this.petData.is_active;
        }
        resourceUtil.setSkeEffect([this.nodeSke, this.skeMao, this.skeYifu, this.skeLingdai, this.skeXiu], this.petData);

        // this.nodeSke.setSkin("gou/chaiquan_hei");
    }

    // 更新宠物状态标签  
    private updateStatusLabel() {

        if (!this.petData){
            return;
        }

        if (this.state != 0){
            return;
        }

        if(false){          
            this.showStatusTip(7);
        }
        else if (this.lastSatiety - this.petData.hunger_value/Const.CLEAN_FULL >= 0.1){
            this.showStatusTip(1)
            this.lastSatiety = this.petData.hunger_value/Const.CLEAN_FULL;
        }
        // else if (this.lastThirsty - this.petData.thirsty/this.petData.thirstyFull >= 0.1)
        // {
        //     this.showStatusTip(2)
        //     this.lastThirsty = this.petData.thirsty/this.petData.thirstyFull;
        // }
        else if (this.lastCleanliness - this.petData.clean_value/Const.CLEAN_FULL >= 0.1)
        {
            this.showStatusTip(3)
            this.lastCleanliness = this.petData.clean_value/Const.CLEAN_FULL;
        }else{

        }
    }  
  
    // 宠物点击事件  
    private onPetClicked(event: Event) {  
        // 可以在这里添加点击后的逻辑，比如弹出详情界面  
        console.log('宠物被点击了！');

        uiManager.instance.pushShowDialog(Const.Dialogs.PetDetialsView, this.petData);

        HttpClient.getInstance().sendPetAction(7, this.petData.id, 0);

        if (this.state == 4 || this.state == 5){
            //EventManger.eventTarget.emit(EventManger.EEventName.PET_REWARD_DROP, this.node, ItemEnumId.petCoin, 0, true);
            //HttpClient.getInstance().interActive(this.state == 4?0:1, [this.petData._id]);
        }
        else if (this.state == 1){

            //UIManager.petFoodType = 1;
            //UIManager.open(UIManager.uiNamePathNew.foodView)
        }
        else if (this.state == 2){

            //UIManager.petFoodType = 2;
            //UIManager.open(UIManager.uiNamePathNew.foodView)

        }
        else if (this.state == 3){
            //UIManager.curPetId = this.petData.id;
            //UIManager.open(UIManager.uiNamePathNew.bathView)
        }
        else if (this.state == 6){
            //UIManager.petAiChatType = 0;
            //UIManager.petAiChatId = this.petData.id;
            //UIManager.open(UIManager.uiNamePathNew.aiChatView);
        }
        else if (this.state == 7){
            //HttpClient.getInstance().interActive(3, [this.petData.id]);
        }
        else{
            HttpClient.getInstance().getPetList();
            //UIManager.petDetialId = this.petData.id;
            //UIManager.open(UIManager.uiNamePathNew.petDetialView);
        }
        this.timeSta = 0;
        this.timeAiChat = 0;
        this.showStatusTip(0)
    }  
  
    // 更新宠物行为  
    public updateAnima() {  
        // 随机选择一种行为 
        //站立、行走、躺下、睡觉、跑动、伸懒腰行为按以下规则进行 

        if (!this.petData){
            return;
        }
        
        let index = Math.floor(Math.random() * this.actions.length);

        if (index == 0){
            index = 5;
        }

        if (!this.isScene){
            index = 1;
        }

        this.actionInd = index;
  
        this.nodeSke.clearAnimations();
        this.skeMao.clearAnimations();
        this.skeYifu.clearAnimations();
        this.skeLingdai.clearAnimations();
        this.skeXiu.clearAnimations();


        if (this.walkTween){
            this.walkTween.stop();
        }

        if (index == 5){
            this.nodeSke.setAnimation(index,this.actions[index], true);
            this.randomWalk();  
        }else{
            
            this.nodeSke.setAnimation(index,this.actions[index], true); 

            this.unschedule(this.updateAnima)
            this.scheduleOnce(this.updateAnima, this.actimes[index]);
        }

        this.skeMao.setAnimation(index,this.actions[index], true);
        this.skeYifu.setAnimation(index,this.actions[index], true);
        this.skeLingdai.setAnimation(index,this.actions[index], true);
        this.skeXiu.setAnimation(index,this.actions[index], true);

        // this.skeLingdai.enabled = false
        // // this.skeLingdai.node.getComponent(UIOpacity).opacity = 0;
        // this.skeLingdai.node.active = false;
        // this.skeLingdai.node.parent.active = false;
        // this.skeLingdai.node.scale = 0;
        
        //console.log("动画状态：" + this.actions[index])
        // 检查并更新状态  
        this.updateStatusLabel();  
    }  

  
    // 随机行走  
    private randomWalk() { 
        if(this.isDaiji){
            return;
        }
        let targetX:number = 0;

        let targetY:number = 0;
        
        let offx = Math.floor(Math.random() * 500);  

        let offy = Math.floor(Math.random() * 400); 

        //console.log("移动距离：" + offx + "  " + offy)

        let randX = Math.random(); 

        
        if(randX < 0.5){
            targetX = this.node.getPosition().x + offx;
            if (targetX > this.walkArea[1]){
                targetX = this.node.getPosition().x - offx;
            }
        }else{
            targetX = this.node.getPosition().x - offx;
            if (targetX < this.walkArea[0]){
                targetX = this.node.getPosition().x + offx;
            }
        }

        let scaleX = targetX > this.node.getPosition().x? 1 : -1;

        this.nodeSke.node.setScale(new Vec3(Math.abs(this.nodeSke.node.scale.x) * scaleX, this.nodeSke.node.scale.y, 1));

        this.skeMao.node.setScale(new Vec3(Math.abs(this.skeMao.node.scale.x) * scaleX, this.skeMao.node.scale.y, 1));
        this.skeYifu.node.setScale(new Vec3(Math.abs(this.skeYifu.node.scale.x) * scaleX, this.skeYifu.node.scale.y, 1));
        this.skeLingdai.node.setScale(new Vec3(Math.abs(this.skeLingdai.node.scale.x) * scaleX, this.skeLingdai.node.scale.y, 1));
        this.skeXiu.node.setScale(new Vec3(Math.abs(this.skeXiu.node.scale.x) * scaleX, this.skeXiu.node.scale.y, 1));

        let randY = Math.random(); 

        if(randY < 0.5){
            targetY = this.node.getPosition().y + offy;
            if (targetY > this.walkArea[2]){
                targetY = this.node.getPosition().y - offy;
            }
        }else{
            targetY = this.node.getPosition().y - offy;
            if (targetY < this.walkArea[3]){
                targetY = this.node.getPosition().y + offy;
            }
        }
   
        let duration = this.actimes[this.actionInd];  //行走的播放时间 

        this.walkTween = tween(this.node)
        .to(duration, {position: new Vec3(targetX, targetY, 0)})
        // .call(()=>{
        //     this.nodeSke.clearAnimations();
        //     this.nodeSke.setAnimation(6,this.actions[6], true);
        // })
        // .delay(2)
        .call(()=>{
            this.updateAnima();
        })
        .start();
    }  
  
    update(dt: number) {
        if (this.state == 0){
            this.timeSta += dt;

            if (this.timeSta > 30){
                this.timeSta = 0;
                this.showStatusTip(randomRangeInt(4,6));
            }

            this.timeRefresh+=dt;

            if (this.timeRefresh > 60){
                this.timeRefresh = 0;
                this.refreshData();
            }

            this.timeAiChat += dt;
            if (this.timeAiChat > 60 * 5){
                this.timeAiChat = 0;
                let isChat = randomRangeInt(0,100) < 5;
                if (isChat){
                    this.showStatusTip(6)
                }
            }
        }
    }
  
    // 显示状态提示  
    public showStatusTip(newState:number = 0) {  
        if (newState == 0){
            this.state = 0;
            this.statusBg.scale = new Vec3(0,0,0);
            return;
        }
        if (this.state != 0 && newState != 6){
            return
        }
        // if ((newState == 4 || newState == 5) && this.state != 0){
        //     return;
        // }
        // if (this.state == 1 || this.state == 2 ||this.state == 3){
        //     return;
        // }

        let str = "";
        this.state = newState;
        switch(this.state){
            case 1:
                str = "饿了"
                break;
            case 2:
                str = "渴了"
                break;
            case 3:
                str = "脏了"
                break;
            case 4:
                str = "爱心";
                break;
            case 5:
                str = "抚摸";
                break;
            case 6:
                str = "聊天";
                break;
        }

        this.statusLabel.string = str;
        if (this.qipaos[this.state-1]){
            this.qipao.spriteFrame = this.qipaos[this.state-1];
        }
        if (this.tipTween){
            this.tipTween.stop();
        }
        //todo 气泡功能关闭
        // this.tipTween = tween(this.statusBg)
        //     .to(0.1,{scale:new Vec3(1,1,1)})
        //     // .delay(3)
        //     // .to(0.1,{scale:new Vec3(0,0,0)})
        //     // .call(()=>{
        //     //     this.state = 0;
        //     // })
        //     .start()
    } 

}


