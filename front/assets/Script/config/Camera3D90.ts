import { _decorator, Component, Node, Camera, view } from 'cc';
import { UtilPub } from '../easyFramework/utils/UtilPub';
import { Const } from './Const';
const { ccclass, property } = _decorator;

@ccclass('Camera3D90')
export class Camera3D90 extends Component {
    onLoad() {



        let size = view.getVisibleSize();


        let cFov = 42
        let screenH = 1525
        let cFovReal = size.height/screenH * cFov
        let camera = this.node.getChildByName("Camera90")!.getComponent(Camera)!
        if(camera!=null){
            camera.fov = cFovReal
        }

    }
}

