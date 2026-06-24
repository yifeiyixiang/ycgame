import { _decorator, Component, Node, v2, Vec2, find, v3, Sprite, Scene, v4, view } from 'cc';
import { Const } from '../../../config/Const';
import { GCurFace, GFace, GGridType, GISceneItemParent, GLockState, GSceneItemData, GSceneItemType, GSceneRoomState, GSceneSkinState, GWorkState } from '../../../config/global';
import { BaseUiComponent } from '../../../easyFramework/mgr/comm';
import TableDataService from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { SceneData } from '../../comm/SceneData';
import { UtilScene } from '../../comm/UtilScene';
import { ShineColor } from '../../../easyFramework/utils/ShaderShine';
const { ccclass, property } = _decorator;

@ccclass('scene_item_parent')
export class SceneItemBaseController extends BaseUiComponent {
   protected id:number=0
   protected skin:number=0
   protected lockState:GLockState=GLockState.locked
   protected faceMax: GFace = GFace.face1





   protected curFace: GCurFace = GCurFace.face1
   protected itemSize: Vec2 = v2(1, 1)
   protected curGridPoint: Vec2 = v2(0, 0)
   protected type : GSceneItemType = null!
   protected row: any
   protected workState: GWorkState = GWorkState.idle
   protected guestNode: Node = null!

   private _curPointsNode:Node=null!
   private _curIconNode:Node =null!
   private _isShowPoint:boolean = Const.isDebug
   private _isFlashForever:boolean = false

   get icon1() { return find("icon1", this.node)! }
   get icon2() { return find("icon2", this.node)! }
   get icon3() { return find("icon3", this.node)! }
   get icon4() { return find("icon4", this.node)! }
   get points1() { return find("points1", this.node)! }
   get points2() { return find("points2", this.node)! }
   get points3() { return find("points3", this.node)! }
   get points4() { return find("points4", this.node)! }

   protected floatStar:Node = null!

   start() {


   }

   private hideElements(){
      if (this.points1) {
         this.points1.active = false
      }
      if (this.points2) {
         this.points2.active = false
      }
      if (this.points3) {
         this.points3.active = false
      }
      if (this.points4) {
         this.points4.active = false
      }
      if(this.icon1){
         this.icon1.active = false
      }
      if(this.icon2){
         this.icon2.active = false
      }
      if(this.icon3){
         this.icon3.active = false
      }
      if(this.icon4){
         this.icon4.active = false
      }
   }




   getCurIconNode(){
      return this._curIconNode
   }





   getPointsArr(){
      let arr:Array<Array<number>> = []

      this._curPointsNode.children.forEach(item=>{
         arr.push([Number(item.worldPosition.x.toFixed(1))!, Number(item.worldPosition.y.toFixed(2))])
      })

      this._curPointsNode.active = this._isShowPoint
      return arr
   }


   public setFace(curFace:GCurFace){
      this.curFace = curFace
      this.hideElements()
      if(this.row.type==GSceneItemType.item || this.row.type==GSceneItemType.carpet){
         if(this.curFace == GCurFace.face1){

            this._curPointsNode = this.points1
            this._curIconNode = this.icon1
            this.itemSize = v2(this.row.x, this.row.y)

         }else if(this.curFace == GCurFace.face2){

            this._curPointsNode = this.points2
            this._curIconNode = this.icon2
            this.itemSize = v2(this.row.y, this.row.x)

         }else if(this.curFace == GCurFace.face3){

            this._curPointsNode = this.points3
            this._curIconNode = this.icon3
            this.itemSize = v2(this.row.x, this.row.y)

         }else if(this.curFace == GCurFace.face4){

            this._curPointsNode = this.points4
            this._curIconNode = this.icon4
            this.itemSize = v2(this.row.y, this.row.x)

         }

      }else if(this.row.type==GSceneItemType.pendant){
         if(this.curGridPoint.x >=0 ){

            this.curFace = GCurFace.face2
            this._curPointsNode = this.points2
            this._curIconNode = this.icon2

         }else{
            this.curFace = GCurFace.face1
            this._curPointsNode = this.points1
            this._curIconNode = this.icon1
         }
      }else if(this.row.type==GSceneItemType.wall || this.row.type==GSceneItemType.floor ){
         this.curFace = GCurFace.face1
         this._curPointsNode = this.points1
         this._curIconNode = this.icon1
      }


      this._curIconNode.active = true
      this._curPointsNode.active = this._isShowPoint



      if(this.type==GSceneItemType.wall){
         let isUnlock = SceneData.ins.getRoomLockInfoById(this.row.room)

         if(isUnlock==GSceneRoomState.unlock){
            this.node.active = true
            let lightNode = Const.LightParent.getChildByName("light_"+this.row.room)
            if(lightNode!=null){
               lightNode.active = false
            }
         }else{
            this.node.active =false
            let lightNode = Const.LightParent.getChildByName("light_"+this.row.room)
            if(lightNode!=null){
               lightNode.active = true
            }
         }
      }











   }




   public setPendantFace(){
      this.setFace(this.curFace)
   }




   public rotateItem(){
      if(this.curFace>=this.faceMax){
         this.curFace=GCurFace.face1
      }else{
         this.curFace+=1
      }
      this.setFace(this.curFace)
   }


   initByConfigTable(row: any) {
      this.id = row.id
      this.row = row
      this.lockState = row.st
      this.faceMax = this.row.faceMax
      this.itemSize = v2(this.row.x, this.row.y)
      this.curGridPoint = v2(this.row.pos[0], this.row.pos[1])
      this.type = this.row.type
      this.skin = this.row.skin
      this.curFace = this.row.face


      if(this.type==GSceneItemType.floor){
         if(SceneData.ins.getRoomLockInfoById(this.row.room)==GSceneRoomState.locked){
            this.skin = this.row.workSkin
         }
      }





      let data = SceneData.ins.getSceneItemById(this.id, this.type)
      if(data!=null){
         if(data.lockState){
            this.lockState = data.lockState
         }
         if(data.curGridPoint){
            this.curGridPoint = data.curGridPoint
         }
         if(data.curFace && data.curFace<=row.faceMax){
            this.curFace = data.curFace
         }
         if(data.skin){
            this.skin = data.skin
         }

      }else{
         let data = UtilScene.getSceneData(this as unknown as GISceneItemParent)
         UtilPub.log("-----初始化数据1111----", data)
         SceneData.ins.setSceneItem(data)
      }
      this.setFace(this.curFace)
      this.setIcon()
   }



























   setIcon(){
      let skinData = TableDataService.ins().getTableValueByID(Const.Tables.scene_skin, this.skin)

      if(this.icon1!=null){
         this.setSpriteFrame(this.icon1.getComponent(Sprite)!, UtilScene.getResSceneIcon(skinData.icon1))
      }
      if(this.icon2!=null){
         this.setSpriteFrame(this.icon2.getComponent(Sprite)!, UtilScene.getResSceneIcon(skinData.icon1))
      }
      if(this.icon3!=null){
         this.setSpriteFrame(this.icon3.getComponent(Sprite)!, UtilScene.getResSceneIcon(skinData.icon2))
      }
      if(this.icon4!=null){
         this.setSpriteFrame(this.icon4.getComponent(Sprite)!, UtilScene.getResSceneIcon(skinData.icon2))
      }
   }

   switchIcon(skinId:number){
      this.skin=skinId
      UtilPub.log("-----切换皮肤----", skinId)
      this.setFace(this.curFace)
      this.setIcon()
   }




   flashOnce(){
      if(this.type==GSceneItemType.floor || this.type==GSceneItemType.wall){
         return
      }

       let flashTime=2
       if(this.icon1){
         if(this.icon1.getComponent(ShineColor)==null) this.icon1.addComponent(ShineColor)!
         this.icon1.getComponent(ShineColor)!.startShine(Const.Shaders.shineColor, flashTime)
      }
      if(this.icon2){
         if(this.icon2.getComponent(ShineColor)==null) this.icon2.addComponent(ShineColor)!
         this.icon2.getComponent(ShineColor)!.startShine(Const.Shaders.shineColor, flashTime)
      }
      if(this.icon3){
         if(this.icon3.getComponent(ShineColor)==null) this.icon3.addComponent(ShineColor)!
         this.icon3.getComponent(ShineColor)!.startShine(Const.Shaders.shineColor, flashTime)
      }
      if(this.icon4){
         if(this.icon4.getComponent(ShineColor)==null) this.icon4.addComponent(ShineColor)!
         this.icon4.getComponent(ShineColor)!.startShine(Const.Shaders.shineColor, flashTime)
      }
   }




   flashForever(isShow:boolean){
      if(this.type==GSceneItemType.floor || this.type==GSceneItemType.wall){
         return
      }
      UtilPub.log("-=-=-=-=-选择场景", isShow, this.node.uuid)
      if(isShow==false){

         if(this.icon1 && this.icon1.getComponent(ShineColor)!){
            this.icon1.getComponent(ShineColor)!.closeFlash()
         }
         if(this.icon2 && this.icon2.getComponent(ShineColor)!){
            this.icon2.getComponent(ShineColor)!.closeFlash()
         }
         if(this.icon3 && this.icon3.getComponent(ShineColor)!){
            this.icon3.getComponent(ShineColor)!.closeFlash()
         }
         if(this.icon4 && this.icon4.getComponent(ShineColor)!){
            this.icon4.getComponent(ShineColor)!.closeFlash()
         }
      }else{

         if(this.icon1){
            if(this.icon1.getComponent(ShineColor)==null) this.icon1.addComponent(ShineColor)!
            this.icon1.getComponent(ShineColor)!.setWhiteCycle(Const.Shaders.shineColor, 1)
         }
         if(this.icon2){
            if(this.icon2.getComponent(ShineColor)==null) this.icon2.addComponent(ShineColor)!
            this.icon2.getComponent(ShineColor)!.setWhiteCycle(Const.Shaders.shineColor,  1)
         }
         if(this.icon3){
            if(this.icon3.getComponent(ShineColor)==null) this.icon3.addComponent(ShineColor)!
            this.icon3.getComponent(ShineColor)!.setWhiteCycle(Const.Shaders.shineColor, 1)
         }
         if(this.icon4){
            if(this.icon4.getComponent(ShineColor)==null) this.icon4.addComponent(ShineColor)!
            this.icon4.getComponent(ShineColor)!.setWhiteCycle(Const.Shaders.shineColor, 1)
         }
      }
   }

   isNodeOutView(){
      let size = view.getVisibleSize();
      let cPos = Const.CameraScene.node.worldPosition
      let nPos = this.node.worldPosition
      let rate = Const.CameraScene.orthoHeight/350
      if(Const.CameraScene.orthoHeight<1000){
         rate = Const.CameraScene.orthoHeight/150
      }

      let isInView = UtilPub.IsPointInArea2D(nPos, cPos, size.width*rate, size.height*rate)
      if(!isInView){
         this.hideElements()
      } else{
         this.setFace(this.curFace)
      }
   }


   update(deltaTime:number){
      this.calTime+= deltaTime
      if(this.calTime>0.2){
         this.calTime=0

         if(Const.SelSceneNode!=null){
            if(this.node.uuid == Const.SelSceneNode.uuid){
               this.node.active = true
               this.setFace(this.curFace)
            }
         }



      }

   }

}


