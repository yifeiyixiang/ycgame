import { Animation, AnimationState, Component, Node, sp, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AnimationCtrl')
export class AnimationCtrl extends Component {

    spineSkeleton: sp.Skeleton = null!;
    animationComponent: Animation = null!;

    lastAni: any = undefined;
    lastLoop: any = undefined;

    animationEndCallback: Function = null!;

    onLoad() {
        if (!this.spineSkeleton) {
            this.spineSkeleton = this.getComponent(sp.Skeleton)!;
        }
        if (!this.spineSkeleton) {
            this.spineSkeleton = this.getComponentInChildren(sp.Skeleton)!;
        }

        if (!this.spineSkeleton) {
            this.animationComponent = this.getComponent(Animation)!;
        }
        if (!this.animationComponent) {
            this.animationComponent = this.getComponentInChildren(Animation)!;
        }
        if (this.animationComponent) {
            this.animationComponent.on(Animation.EventType.FINISHED, this._fn_v, this);
        }
    }

    _fn_agj(node: Node) {
        this.spineSkeleton = node.getComponent(sp.Skeleton)!;
    }
    _fn_aeh(node: Node) {
        this.animationComponent = node.getComponent(Animation)!;
    }

    _fn_ws() {
        if (!this.spineSkeleton) {
            return;
        }
        this.spineSkeleton.paused = true;
    }
    _fn_abz() {
        if (!this.spineSkeleton) {
            return;
        }
        this.spineSkeleton.paused = false;
    }

    _fn_v(eventName: string, animationState: AnimationState) {
        if (eventName == Animation.EventType.FINISHED) {
            if (this.animationEndCallback) {
                this.animationEndCallback(animationState.name);
            }
        }
    }

    playAnimation(name: string, isLoop: boolean = true, completeCb?: Function) {
        if (!name) {
            return;
        }

        if (this.spineSkeleton) {
            this.spineSkeleton.loop = isLoop;
            this.spineSkeleton.setAnimation(0, name, isLoop);
            if (completeCb) {
                this.spineSkeleton.setCompleteListener(() => {

                    completeCb(name);
                });
            } else {

                this.spineSkeleton.setCompleteListener(null!);
            }
            return;
        }

        if (this.animationComponent) {
            this.animationEndCallback = completeCb!;
            this.animationComponent.play(name);
            return;
        }

    }

    async playAnimationOnce(name: string, endCb?: Function) {
        return new Promise((resolve, reject) => {
            if (!name) {
                resolve(1);
                if (endCb) {
                    endCb();
                }
                return;
            }
            if (this.spineSkeleton) {
                if (this.lastAni == undefined) {
                    this.lastAni = this.spineSkeleton.animation;
                }
                if (this.lastLoop == undefined) {
                    this.lastLoop = this.spineSkeleton.loop;
                }
            }

            this.playAnimation(name, false, () => {
                if (this.spineSkeleton) {
                    this.playAnimation(this.lastAni, this.lastLoop);
                    this.lastAni = undefined;
                    this.lastLoop = undefined;
                }
                resolve(1);
                if (endCb) {
                    endCb();
                }
            });

        });
    }

}

