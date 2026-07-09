import { _decorator, Component, Node, Prefab, Vec2, v2, UITransform, tween } from 'cc';
import { Const } from '../../../config/Const';
import GD from '../../../config/GD';
import { GGuestState, GSceneRoomState, GSpineAni, GStreetQueueFlag } from '../../../config/global';
import { BaseUiComponent } from '../../../easyFramework/mgr/comm';
import { NodePoolService } from '../../../easyFramework/mgr/poolManager';
import TableDataService from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { SceneData } from '../../comm/SceneData';
import { UtilScene } from '../../comm/UtilScene';
import { guest } from './guest';
import { playerDataStore } from '../../comm/UserData';
const { ccclass, property } = _decorator;

@ccclass('guest_mgr')
export class guest_mgr extends BaseUiComponent {
    private static _instance: guest_mgr;
    static get ins() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new guest_mgr();
        return this._instance;
    }


    queueGuests:Node[]=[]


    waitStartPos:Vec2 = v2(16,22)
    waitGrids:Map<string, number>= new Map<string, number>()
    waitGridsArr:Vec2[] = []

    streetLimit:number= 15
    roomLimit:number=15
    interval:number=3
    spineFile:string=""
    queueCalTime:number=0
    orderGuestCalTime:number=0
    bugLeaveCalTime:number=0
    isOutQueuing:boolean = false

    onLoad() {
        this.on(GD.event.intoTheWaitQueue, this.intoTheWaitQueue)
        this.on(GD.event.guestLeave, this.guestLeave)
        this._fn_kl()
        this._fn_fe()
    }

    _fn_kl(){
        let roomRows = TableDataService.ins()._fn_mb(Const.Tables.scene_room, "type", "1")
        this.roomLimit=0
        roomRows.forEach((item:any)=>{
            if(SceneData.ins._fn_kk(item.id)==GSceneRoomState.unlock){
                this.roomLimit+= item.cnt
            }
        })
        UtilPub.log("roomLimit", this.roomLimit)
    }

    guestLeave(node:Node){
        let arr:Node[] = []
        Const.Guests.forEach(item=>{
            if(node.uuid == item.uuid){
                NodePoolService.instance._fn_xz(item)
            }else{
                arr.push(item)
            }
        })
        Const.Guests = arr
    }


    _fn_fe(){
        for(let i=0;i<this.streetLimit; i++){

            this.waitGrids.set(this.waitStartPos.x+","+(this.waitStartPos.y-i), GStreetQueueFlag.noOccupy)
            this.waitGridsArr.push(v2(this.waitStartPos.x, this.waitStartPos.y-i))
        }
    }

    isInTheQueue(node:Node){
        for(let i=0;i<this.queueGuests.length; i++){
            if(node.uuid==this.queueGuests[i].uuid){
                return true
            }
        }
        return false
    }

    intoTheWaitQueue(){


        let pickOne:Node = null!
        let pickScore = Number.MAX_SAFE_INTEGER

        for(let i=0;i<Const.Guests.length; i++){
            let script = Const.Guests[i].getComponent(guest)!
            let isInTheQueue:boolean = this.isInTheQueue(Const.Guests[i])

            if(script.state==GGuestState.queueForRoomDoor && !isInTheQueue){
                let dx = Math.abs(script.curGridPoint.x - this.waitStartPos.x)
                let dy = Math.abs(script.curGridPoint.y - this.waitStartPos.y)
                let score = dx + dy
                if (score < pickScore) {
                    pickScore = score
                    pickOne = Const.Guests[i]
                }
            }
        }
        if(pickOne!=null){


            let script = pickOne.getComponent(guest)!
            let next = this.queueGuests.length
            script.targetPoint =  this.waitGridsArr[next]
            script.checkQueueApproachPath()
            this.queueGuests.push(pickOne)
        }
    }

    _fn_wn(){



        if(this.queueGuests.length>0 && this.isOutQueuing==false){
            let gusetFirst = this.queueGuests[0].getComponent(guest)!

            if(gusetFirst.state==GGuestState.roomDoorStay){
                let isBlock = gusetFirst.testRoomWayIsBlock()

                if(isBlock==false){
                    this.isOutQueuing = true

                    let pickOne:Node = this.queueGuests.shift()!
                    let script = pickOne.getComponent(guest)!
                    let oldPos = pickOne.worldPosition.clone()


                    pickOne.parent = Const.ItemParent
                    pickOne.worldPosition = oldPos
                    script.curGridPoint = v2(UtilScene.roomDoorPos.x, UtilScene.roomDoorPos.y)
                    let pos = UtilScene._fn_fw(script.curGridPoint.x, script.curGridPoint.y)

                    script.targetPos = script.node.parent!.getComponent(UITransform)!.convertToWorldSpaceAR(pos)

                    script.setAniState(script.node.scale.x, GSpineAni.walk1)
                    this.aniTween = tween(script.node).to(script.getWalkTime(), {worldPosition: script.targetPos}).call(()=>{

                        pickOne.getComponent(guest)!.state = GGuestState.roomWalk
                        this.isOutQueuing = false


                        for(let i=0;i<this.queueGuests.length; i++){
                            let item = this.queueGuests[i]
                            let script1 = item.getComponent(guest)!
                            let next = i
                            script1.targetPoint =  this.waitGridsArr[next]
                            if(script1!.state!=GGuestState.roomDoorStay){



                                script1.isMovingEnd=true
                            }
                            script1.state=GGuestState.queueForRoomDoor
                            script1.checkQueueApproachPath()
                        }


                    }).start()
                }
            }
        }
    }

    _fn_ajw(){

    }

    _fn_lp(){
        let streetCnt =0
        Const.Guests.forEach(item=>{
            let script = item.getComponent(guest)!
            if(script.state<=GGuestState.roomDoorStay){
                streetCnt+=1
            }
        })
        return streetCnt
    }

    _fn_ki(){
        let roomCnt =0
        Const.Guests.forEach(item=>{
            let script = item.getComponent(guest)!
            if(script.state>GGuestState.roomDoorStay){
                roomCnt+=1
            }
        })
        return roomCnt
    }

    init(){

        this.spineFile = ""
        UtilScene._fn_aeu()

        UtilScene._fn_nq()



        let unlockGuestsData = UtilScene._fn_mt()
        if(unlockGuestsData.length>0){
            UtilPub._fn_jj(Const.Prefabs.guest,(p:Prefab)=>{

                let n = UtilPub._fn_ym(2, Math.floor(this.streetLimit/2))

                for(let i=0;i<n;i++){

                    UtilPub.log("street spawn count", i)
                    let item = NodePoolService.instance.getNode(p, Const.StreetFixedNode,false)
                    item.getComponent(guest)!.init(GGuestState.streetWalk)
                }
                let roomCnt= Math.round(this.roomLimit * UtilPub._fn_ym(15,35)/100)
                for(let i=0;i<roomCnt;i++){

                    UtilPub.log("room spawn count", i)
                    let item = NodePoolService.instance.getNode(p, Const.ItemParent,false)
                    item.getComponent(guest)!.init(GGuestState.roomWalk)
                }
            })
        }
    }

    _fn_wl(){
       UtilScene._fn_wm(Const.StreetFixedNode)
       UtilScene._fn_wm(Const.ItemParent)
    }

    _fn_nd(){

        let newArr:Node[] = []
        Const.Guests.forEach(item=>{
            let script = item.getComponent(guest)!
            if(script.failCnt>=script.maxFailCnt){
                script.state = GGuestState.subway
                NodePoolService.instance._fn_xz(script.node)
                UtilPub.log("----------清理bug客人", script)
            }
            newArr.push(script.node)
        })
        Const.Guests = newArr

    }

    _fn_bs(){
        Const.Guests.forEach(item=>{
            let g = item.getComponent(guest)!
            UtilPub.log("-----客人信息---", g.state)
        })
    }

    update(deltaTime:number) {
        this.calTime += deltaTime
        if(this.calTime > this.interval){
            this.interval = UtilPub._fn_ym(2,5)
            this.calTime = 0


            if(this._fn_lp() < this.streetLimit && this._fn_ki()<this.roomLimit){

                let unlockGuestsData = UtilScene._fn_mt()
                if(unlockGuestsData.length>0){

                    UtilPub._fn_jj(Const.Prefabs.guest,(p:Prefab)=>{
                        let item = NodePoolService.instance.getNode(p, Const.StreetFixedNode,false)
                        item.getComponent(guest)!.init(GGuestState.subway)
                    })
                }
            }


            if(playerDataStore.roleLv >= TableDataService.ins().config["theGodOfWealthShowLv"] && Const.isGodWealthShow==false ){

                Const.isGodWealthShow=true
                UtilPub.log("----------增加财神-----")
                UtilPub._fn_jj(Const.Prefabs.guest,(p:Prefab)=>{
                    let item = NodePoolService.instance.getNode(p, Const.StreetFixedNode,false)
                    item.getComponent(guest)!.initGodWealth(GGuestState.streetWalk)
                })
            }

        }


        this.queueCalTime += deltaTime
        if(this.queueCalTime>1){
            this.queueCalTime=0
            this.intoTheWaitQueue()


            if(this._fn_ki()< this.roomLimit){
                this._fn_wn()
            }
        }

        this.orderGuestCalTime += deltaTime
        if(this.orderGuestCalTime>0.6){
            this.orderGuestCalTime=0
            this._fn_wl()

        }

        this.bugLeaveCalTime += deltaTime
        if(this.bugLeaveCalTime>3){
            this.bugLeaveCalTime = 0
            this._fn_nd()
            this._fn_kl()


        }

    }
}


