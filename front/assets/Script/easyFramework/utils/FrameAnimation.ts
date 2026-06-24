import { Component, error, EventHandler, Sprite, SpriteAtlas , _decorator} from "cc";


const {ccclass, property} = _decorator;

@ccclass
export class FrameAnimation extends Component {

    @property({
        type: SpriteAtlas,
        tooltip : "帧动画合图"
    })
    protected atlas : SpriteAtlas|null = null;

    @property({tooltip:"切割下标的符号"})
    private splitter : string = "=";

    @property({tooltip:"每多少秒播放一张图"})
    protected interval : number = 0.05;

    @property({tooltip:"是否循环播放"})
    private loop : boolean = false;

    @property({tooltip:"载入时播放"})
    private runAtStart : boolean = false;

    @property({tooltip:"是否要添加下标"})
    protected fixedZero : boolean = true;

    @property({
        type : EventHandler,
        tooltip:"一轮动画完成时回调，"
    })
    protected completeCallback: Array<EventHandler> = [];

    @property({
        type: EventHandler,
        tooltip:"所有动画完成时回调"
    })
    protected endCallback: Array<EventHandler> = [];



    private running : boolean = false;


    private currentIndex : number = 0;

    private frameStep = 0;


    public get Loop() : boolean { return this.loop; }


    public get Running () : boolean { return this.running; }

    private frameCount : number = 0;


    private frameNamHead : string = "";

    protected onLoad () : void {
        this.InitAtlas();
    }

    private InitAtlas(){
        if(!this.atlas) {
            error("atlas not exist!")
            return;
        }
        let frames = this.atlas.getSpriteFrames();
        let firstFrame = frames[0];
        this.frameCount = frames.length;
        if(firstFrame) {
            let lastIndexOf = firstFrame.name.lastIndexOf(this.splitter) + 1;
            this.frameNamHead = firstFrame.name.substring(0, lastIndexOf);
        }
    }

    protected start () : void {
        if(this.runAtStart) {
            this.Play(this.Loop);
        }
    }

    protected update(dt: number): void {
        if(!this.running) {
            return;
        }
        this.frameStep += dt;
        if(this.frameStep >= this.interval) {
            this.frameStep-= this.interval;
            this.ChangeFrame();
        }

    }




    private ChangeFrame() : void{
        let isIndexEnd = this.currentIndex >= this.frameCount;

        if(!this.loop && isIndexEnd) {
            this.completeCallback.forEach(callback => { callback.emit([]); });
            this.endCallback.forEach(callback => { callback.emit([]); });
            this.running = false;
            return;
        }

        if(isIndexEnd) {
            this.completeCallback.forEach(callback => { callback.emit([]); });
            this.currentIndex = 0;
        }

        let tail : any = this.currentIndex + 1;
        if(tail < 10 && this.fixedZero) {
            tail = "0" + tail;
        }
        if(!this.atlas) {
            error("atlas not exist!")
            return;
        }
        let frameName = this.frameNamHead + tail;
        let sprite = this.node.getComponent(Sprite);
        let spriteFrame = this.atlas.getSpriteFrame(frameName);
        if(sprite) {
            sprite.spriteFrame = spriteFrame;
        }
        ++this.currentIndex;
    }





    public setAtlas(atlas: SpriteAtlas) : void {
        this.atlas = atlas;
        this.InitAtlas();
    }





    public Play(loop : boolean = false) : void {

        this.loop = loop;
        this.running = true;

        this.currentIndex = 0;


        this.ChangeFrame();
    }




    public Resume(loop : boolean = false) : void {
        this.loop = loop;
        this.running = true;

        this.ChangeFrame();
    }

    public Pause() : void {
        this.running = false;
    }




    public Stop() : void {
        this.running = false;
        this.runAtStart = false;
    }
}
