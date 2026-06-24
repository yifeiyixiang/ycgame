import { _decorator, Component, dragonBones, Label, Node,UIOpacity, randomRangeInt, SkeletalAnimation, sp, Sprite, SpriteFrame, Tween, tween, Vec2, Vec3 } from 'cc';
import { GameRuntimeData, PetProfileRecord } from './gameData';
import { ItemEnumId, ItemEnumType, LanguageContentManager, PetConfigRecord } from './LanauageManager';
import { GameHttpClient } from './net/HttpClient';
import { GameEventManager } from './EventManger';
import { Const } from '../Script/config/Const';
import { UiLayerService } from '../Script/easyFramework/mgr/uiManager';
import TableDataService from '../Script/easyFramework/other/tables';
import { ResourceLoaderService } from '../Script/easyFramework/mgr/resourceUtil';
const { ccclass, property } = _decorator;

@ccclass('pet')
export class pet extends Component {

    @property(Node)
    statusBg: Node = null;

    @property(Label)
    statusLabel: Label = null;

    @property(sp.Skeleton)
    nodeSke: sp.Skeleton = null;

    @property(Sprite)
    qipao: Sprite = null;

    @property([SpriteFrame])
    qipaos: SpriteFrame[] = [];


    @property(sp.Skeleton)
    skeMao: sp.Skeleton = null;

    @property(sp.Skeleton)
    skeYifu: sp.Skeleton = null;

    @property(sp.Skeleton)
    skeLingdai: sp.Skeleton = null;

    @property(sp.Skeleton)
    skeXiu: sp.Skeleton = null;

    @property(Boolean)
    isScene: boolean = true;







    public petData:PetProfileRecord;


    petId:number = 0;


    isHungry: boolean = false;
    isDirty: boolean = false;
    isHappy: boolean = true;

    lastSatiety:number = 1;

    lastThirsty:number = 1;

    lastCleanliness:number = 1;

    tipTween:Tween<Node>;

    walkTween:Tween<Node>;

    public state:number = 0;

    timeSta:number = 0;

    timeRefresh:number = 0;

    timeAiChat:number = 0;

    actionInd:number = 0;


    private walkArea: number[] = [-1000, 1000, 200, -700];



    actions = ["yidong", 'daiji',"kaixin",'shenlanyao','shenlanyao', "yidong"];

    actimes = [1, 10,10,20,10, 10, 5];


    isDaiji:boolean = false;

    onLoad() {
        if (this.isScene){

            this.statusBg.on(Node.EventType.TOUCH_START, this.onPetClicked, this);

            this.nodeSke.node.on(Node.EventType.TOUCH_START, this.onPetClicked, this);

            this.showStatusTip(0)



            GameEventManager.eventTarget.on(GameEventManager.EEventName.REFRESH_PET_DATA, this.refreshData, this);
        }
    }

    start() {

    }

    init(petData:PetProfileRecord){

        this.petData = petData;

        this.petId = petData.id

        ResourceLoaderService.setSkeEffect([this.nodeSke, this.skeMao, this.skeYifu, this.skeLingdai, this.skeXiu], this.petData, this);

        if(this.isScene){

            let initX:number = Math.random()*600;
            let initY:number = Math.random()*400;

            initX = initX * (Math.random()>0.5?1:-1);
            initY = initY * (Math.random()>0.5?1:-1);

            this.node.setPosition(initX, initY, 1)
        }

    }

    refreshData(){
        this.petData = GameRuntimeData.getPetDataById(this.petId);

        if (!this.petData){
            this.node.active = false;
            return;
        }
        if (this.isScene){

            this.updateStatusLabel();

            this.node.active = this.petData.is_active;
        }
        ResourceLoaderService.setSkeEffect([this.nodeSke, this.skeMao, this.skeYifu, this.skeLingdai, this.skeXiu], this.petData);


    }


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





        else if (this.lastCleanliness - this.petData.clean_value/Const.CLEAN_FULL >= 0.1)
        {
            this.showStatusTip(3)
            this.lastCleanliness = this.petData.clean_value/Const.CLEAN_FULL;
        }else{

        }
    }


    private onPetClicked(event: Event) {

        console.log('宠物被点击了！');

        UiLayerService.instance.pushShowDialog(Const.Dialogs.PetDetialsView, this.petData);

        GameHttpClient.getInstance().sendPetAction(7, this.petData.id, 0);

        if (this.state == 4 || this.state == 5){

        }
        else if (this.state == 1){



        }
        else if (this.state == 2){




        }
        else if (this.state == 3){


        }
        else if (this.state == 6){



        }
        else if (this.state == 7){

        }
        else{
            GameHttpClient.getInstance().getPetList();


        }
        this.timeSta = 0;
        this.timeAiChat = 0;
        this.showStatusTip(0)
    }


    public updateAnima() {



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









        this.updateStatusLabel();
    }



    private randomWalk() {
        if(this.isDaiji){
            return;
        }
        let targetX:number = 0;

        let targetY:number = 0;

        let offx = Math.floor(Math.random() * 500);

        let offy = Math.floor(Math.random() * 400);



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

        let duration = this.actimes[this.actionInd];

        this.walkTween = tween(this.node)
        .to(duration, {position: new Vec3(targetX, targetY, 0)})





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


    public showStatusTip(newState:number = 0) {
        if (newState == 0){
            this.state = 0;
            this.statusBg.scale = new Vec3(0,0,0);
            return;
        }
        if (this.state != 0 && newState != 6){
            return
        }







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









    }

}


