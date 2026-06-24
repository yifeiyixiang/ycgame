import { _decorator, Component, Node, sys, director } from 'cc';
import { Const } from '../../config/Const';
import { GameStorage } from '../mgr/gameStorage';
import { GNetUrl } from './conf';
const { ccclass, property } = _decorator;




@ccclass('TimeCtrJSF')
export default class TimeCtrJSF extends Component {

    private static instance: TimeCtrJSF = null!;

    public static GetInstance() {
        if (!this.instance) {
            this.instance = new TimeCtrJSF();
            this.instance.InitTimeCtr();
        }
        return this.instance;
    }

    urls: string[] = [


    ];

    public serverTime: number = 0;
    public diffServerTime: number = 0;


    public isRunServerTime: boolean = false;
    public loginTime: string = '';

    InitTimeCtr() {

    }

    UpdateServerTime(time: number) {
        director.getScheduler().unschedule(this.updateTimer, this)

        this.serverTime = time;

        director.getScheduler().schedule(this.updateTimer, this, 1);


    }

    UpdateServerTimeByHeartbeat(time: number) {

        this.serverTime = time;
    }

    ReInit() {
        director.getScheduler().unschedule(this.updateTimer, this)
    }

    public updateTimer() {

        this.isRunServerTime = true;





    }

    get ServerTime() {
        return Date.now();
        if (this.serverTime != 0) {
            let delay = GameStorage.getInt("modifyTime", 0)
            if (delay > 0) {
                return this.serverTime + delay * 60 * 1000;
            }
            return this.serverTime ;
        }
        return Date.now();
    }

    get ServerDate() {
        if (this.serverTime != 0) {
            return new Date(this.serverTime);
        }
    }

    public static isSameDay(t1: number, t2: number) {
        let time1 = new Date(t1)
        let time2 = new Date(t2)
        if (time1.getFullYear() == time2.getFullYear() && time1.getMonth() == time2.getMonth() && time1.getDate() == time2.getDate()) {
            return true
        }
        return false
    }








    public static isSameHalfDay(t1: number, t2: number) {
        let time1 = new Date(t1)
        let time2 = new Date(t2)
        if (time1.getFullYear() == time2.getFullYear() && time1.getMonth() == time2.getMonth() && time1.getDate() == time2.getDate()) {
            if (this.isMorningTime(t1) && this.isMorningTime(t2)) {
                return true
            }
            if (this.isAfternoonTime(t1) && this.isAfternoonTime(t2)) {
                return true
            }
            return false
        }
        return false
    }

    public static isSameInterval(t1: number, t2: number, interval: number) {
        let time1 = new Date(t1)
        let time2 = new Date(t2)
        if (interval <= 24 * 60) {
            if (time1.getFullYear() == time2.getFullYear() && time1.getMonth() == time2.getMonth() && time1.getDate() == time2.getDate()) {
                let curmin1 = time1.getHours() * 60 + time1.getMinutes()
                let curmin2 = time2.getHours() * 60 + time2.getMinutes()
                if (Math.floor(curmin1 / interval) == Math.floor(curmin2 / interval)) {
                    return true
                }
                return false
            }
        } else if (interval <= 24 * 60 * 7) {
            return TimeCtrJSF.isSameWeek(t1, t2)
        } else {
            if (time1.getFullYear() == time2.getFullYear() && time1.getMonth() == time2.getMonth()) {
                return true
            }
            return false
        }

        return false
    }



    public static isMorningTime(t1: number) {
        let time1 = new Date(t1)
        let hours = time1.getHours()
        return hours < 12
    }

    public static isAfternoonTime(t1: number) {
        let time1 = new Date(t1)
        let hours = time1.getHours()
        return hours >= 12
    }

    public static isSameWeek(t1: number, t2: number) {
        let day1 = new Date(t1).getDay()
        let day2 = new Date(t2).getDay()

        let week1 = t1 + (7 - day1) * 24 * 60 * 60000;
        let week2 = t2 + (7 - day2) * 24 * 60 * 60000;

        let time1 = new Date(week1)
        let time2 = new Date(week2)

        if (time1.getFullYear() == time2.getFullYear() && time1.getMonth() == time2.getMonth() && time1.getDate() == time2.getDate()) {
            return true
        }
        return false
    }

}
