import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import * as cc from "cc";
import * as env from "cc/env";


module mygame {



	const pause_data = new (class {

		state_b = false;

		physics_2d_b: boolean=false;

		physics_3d_b: boolean=true;

		scheduler_as: any[]=[];

		anim_as: cc.AnimationState[] = [];

		tween_target_as: any[]=[];


	})();





	export class pause_config {

		exclude_as?: cc.Node[];

		recu_exclude_as?: cc.Node[];
	}

	function recu_node_list(node_: cc.Node, result_as: cc.Node[] = []): cc.Node[] {
		if (!node_) {
			return result_as;
		}
		result_as.push(node_);
		node_.children.forEach(v1 => {
			result_as.push(v1);
			recu_node_list(v1);
		});
		return result_as;
	}


	export function pause(config_?: pause_config): void {
		if (pause_data.state_b) {
			return;
		}

		pause_data.scheduler_as = cc.director.getScheduler().pauseAllTargets();


















		pause_data.tween_target_as = cc.TweenSystem.instance.ActionManager.pauseAllRunningActions();

		{




			if (cc.PhysicsSystem && cc.PhysicsSystem.instance.enable) {
				pause_data.physics_3d_b = cc.PhysicsSystem.instance.enable;
				cc.PhysicsSystem.instance.enable = false;
			}
		}











		pause_data.state_b = true;
	}

	export function resume(): void {

		cc.director.getScheduler().resumeTargets(pause_data.scheduler_as);











		cc.TweenSystem.instance.ActionManager.resumeTargets(pause_data.tween_target_as);

		{



			if (pause_data.physics_3d_b) {
				cc.PhysicsSystem.instance.enable = pause_data.physics_3d_b;
			}
		}
		pause_data.state_b = false;
	}



	export function pause_node(node_: cc.Node): void;
	export function pause_node(node_as_: cc.Node[]): void;
	export function pause_node(args1_: cc.Node | cc.Node[]): void {
		let node_as: cc.Node[];
		if (Array.isArray(args1_)) {
			node_as = args1_;
		} else {
			node_as = [args1_];
		}
		node_as.forEach(v1 => {

			cc.director.getScheduler().pauseTarget(v1);

			v1.getComponent(cc.Animation)?.pause();

			if (v1.getComponent(cc.dragonBones.ArmatureDisplay)) {
				v1.getComponent(cc.dragonBones.ArmatureDisplay)!.timeScale = 0;
			}

			cc.TweenSystem.instance.ActionManager.pauseTarget(v1);
		});
	}

	export function resume_node(node_: cc.Node): void;
	export function resume_node(node_as_: cc.Node[]): void;
	export function resume_node(args1_: cc.Node | cc.Node[]): void {
		let node_as: cc.Node[];
		if (Array.isArray(args1_)) {
			node_as = args1_;
		} else {
			node_as = [args1_];
		}
		node_as.forEach(v1 => {

			cc.director.getScheduler().resumeTarget(v1);

			v1.getComponent(cc.Animation)?.resume();

			if (v1.getComponent(cc.dragonBones.ArmatureDisplay)) {
				v1.getComponent(cc.dragonBones.ArmatureDisplay)!.timeScale = 1;
			}

			cc.TweenSystem.instance.ActionManager.resumeTarget(v1);
		});
	}

}

export default mygame;
