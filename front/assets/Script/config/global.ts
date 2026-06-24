import { Color, Enum, Node, Vec2, Vec3 } from "cc";

export interface GSceneItemData {
    id: number,
    pos: Vec2,
    curFace: GCurFace,
    curGridPoint: Vec2,
    lockState: GLockState,
    type: GSceneItemType,
    skin: number,
}


export interface GIGridData {
    wps: Vec3,
    point: Vec2,
}










export enum GSpineAni {
    idle1 = "idle1",
    idle2 = "idle2",
    pose1 = "pose1",
    pose2 = "pose1",
    walk1 = "walk1",
    walk2 = "walk2",
    work1 = "work1",
    work2 = "work2",
}


export enum GPromptType {
    reconnect = "reconnect",
    blockAccount = "blockAccount",
    loginOccupy = "loginOccupy",
    loginExpired = "loginExpired",
    unkown = "unkown",
    resNotNewest = "resNotNewest",
}


export enum GOrderStatus {
    noHandle = 1,
    cancelPay = 2,
    paidWithoutGoods = 3,
    success = 4,
}


export enum GAccountWay {
    guest = 0,
    facebook = 1,
    google = 2,
}


export enum GPlatform {
    H5 = 0,
    Google = 1,
    WeChat = 2,
}


export enum GGuestState {
    nothing = 0,
    subway = 101,
    subwaying = 102,
    streetWalk = 201,
    streetWalking = 202,
    queueForRoomDoor = 301,
    pathingToRoomQueue = 302,

    roomDoorStay = 400,
    roomWalk = 401,
    roomWalking = 402,
    goToWork = 501,
    goToWorking = 502,
    work = 601,
    working = 602,
    back = 701,
    backing = 702,
}

export enum GResType {
    gold = 101,
    diamond = 102,
    strength = 103,
    exp = 104,
    tick = 305,
}


export enum GWorkState {
    isWorking = 1,
    idle = 0,
}

export enum GLockState {
    locked = 0,
    unlock = 1,
}
export enum GGridType {
    green = "green",
    red = "red",
    shadow = "shadow",
}

export enum GSceneItemType {
    item = 1,
    carpet = 2,
    pendant = 3,
    wall = 4,
    floor = 5,
    street = 6,
    room = 7,
    guest = 8,
    other = 9,
}




export interface GISceneItemParent {
    node: Node,
    id: number,
    skin: number,
    faceMax: GFace,
    curFace: GCurFace,
    itemSize: Vec2,
    curGridPoint: Vec2,
    type: GSceneItemType,
    lockState: GLockState,
    row: any,
    workState: GWorkState,
    guestNode: Node,
    initByConfigTable(row: any): void,
    getPointsArr(): Array<Array<number>>,
    getCurIconNode(): Node,
    rotateItem(): void,
    setPendantFace(): void,
    setFace(curFace: GCurFace): void
    switchIcon(skinId: number): void
    flashOnce(): void,
    flashForever(isShow: boolean): void,
}




export enum GStoreItemType {
    new = 1,
    gotted = 2,
    using = 3,
}
export enum GSceneSkinState {
    noGotted = "0",
    gotted = "1",
}

export enum GSceneRoomState {
    locked = "0",
    unlock = "1",
}

export enum GSceneRoomReceiveState {
    unReceive = "0",
    received = "1",
}


export enum GBuildType {
    room = "room",
    item = "item",
}


export enum GStreetQueueFlag {
    noOccupy = 0,
    occupy = 1,
}

export enum GFace {
    face1 = 1,
    face2 = 2,
    face4 = 4,
}
export enum GCurFace {
    face1 = 1,
    face2 = 2,
    face3 = 3,
    face4 = 4,
}

export enum GTouchState {
    noYet = "noYet",
    touchNewEmptyNewArea = "touchEmptyArea",
    touchBuildingReady = "touchBuildingReady",
    touchBuildingArrow = "touchBuildingArrow",
    touchNewBuildingNewAlready = "touchBuildingAlready",
    touchOpsArea = "touchOpsArea",
}







export enum GFlyType {
    crit = "crit",
    lost = "lost",
    damage = "damage",
    recover = "recover",
}


export enum WidgetType {
    top = 1 << 1,
    bottom = 1 << 2,
    left = 1 << 3,
    right = 1 << 4,
}

export enum TujianState {
    unGet = 0,
    geted = 1,
    received = 2,
}

export enum GoodsType {
    Coin = 101,
    Diamonds,
    Power,
    Exp,
    GreenStar,
    StyleVoucher = 27,
}



export enum PriceType {
    Free = 0,
    Video = 1,
    Coin = 101,
    Diamonds = 102,
    RMB = 107,
    Dollar = 108,
}

export enum CodeState {
    reward = 1,
    timeOut,
    receiced,
    codeSame,
}

export enum RoleSex {
    men = 1,
    women = 2,
}

export enum GoodsType {
    prop = 1,
    skin = 2,

    propNew = 3,
}

export interface GTypeStrNum {
    [key: string]: number;
}

export interface GTypeStrStr {
    [key: string]: string;
}

export interface GTypeStrNode {
    [key: string]: Node;
}
export interface GTypeNumNode {
    [key: number]: Node;
}




export enum ActivityLockType {
    type_Level = 1,
    type_FixTime = 2,
}




export enum EmailType {
    type_sys = 1,
    type_reward = 2,
    type_notice = 3,
}



export enum EmailRewardState {
    unReceive = 1,
    received = 2,
}




export enum EmailState {
    unRead = 1,
    readFinish = 2,
    timeOut = 3,
}
export interface EmailReward {
    "propId": number,
    "cnt": number,
}
export interface Email {
    "id": number,
    "type": EmailType,
    "time": number,
    "title": string,
    "content": string,
    "reward": EmailReward[],
    "receicedState": EmailRewardState,
    "readState": EmailState,
}

export interface GodWealthReceiveUser {
    "userID": string,
    "avatar": string,
}

export interface GodWealthData {
    "shareUserId": string,
    "shareName": string,
    "propList": []
    "receiveUser": GodWealthReceiveUser[]
    "shareTime": number
}

export enum shopType {

    MoreMonery = 1,
    FirstRecharge = 2,
    MonthCard = 3,
    ToolBox = 4,
    ResourceBox = 5,
    LimitProp = 6,
    StarBox = 7,

}


export const GRedPoint = Enum({

    skinHead: 0,
    skinNeck: 1,
    skinBody: 2,
    skinBelt: 3,
    skinWrist: 4,
    skinShoes: 5,


    menu1: 100,
    menu2: 101,
    menu3: 102,
    menu4: 103,
    menu5: 104,
    menu1petItem: 1001,
    menu1detailItem: 1002,
    menu1petDetailUpStar: 1003,
    menu1petDetailUnlock: 1004,
    menu1petDetailEquip: 1005,
    menu2UpGradeRole: 1011,
    menu3Battle: 1021,
    menu3BattleSwitchMap: 1022,
    menu4UpGradeSkill: 1031,
    menu4UpGradeSkillItem: 1032,
    menu5tenFree: 1041,
    menu5Orangeten: 1042,


    online: 2001,
    onlineItem: 2002,


    daily: 3001,
    dailyTaskItem: 3002,

    tomorrow: 4001,
    seven: 5001,
    offline: 6001,

});


export enum GDailyTask {
    login = 1,
    getOnlineReward = 2,
    getOfflineReward = 3,
    killLittleMonster = 4,
    killSpecMonster = 5,
    defeatBossEncounter = 6,
    killDragon = 7,
    breakBox = 8,
    useHpItem = 9,
    revive = 10,
    useLittleSkill = 11,
    useDragonSkill = 12,
    getGoldCnt = 13,
    getGreenCnt = 14,
    getBlueCnt = 15,
    getPurpleCnt = 16,
    breakLevel10 = 17,
    breakLevel20 = 18,
    breakOneMap = 19,
    getRedWeapon = 20,
}


export enum GLoadPhase {
    one = 0,
    two = 1,
    three = 2,
    none = 99,
    clearPool = 100,
}



export enum GBury {
    step1EnterLoading = "a1EnterLoading",
    step2EnterGame = "a2进入战斗界面",
    step3EnterUI = "a3进入UI界面",
    guide1 = "b1GuideBattle1",

    clickChallengeBtn = "点击挑战",
    clickPet = "点击展示宠物-",
    clickForTen = "normalTenDraw",
    showForHpAd = "showHpAd",
    noAdToShare = "无视频转分享",
    videoForHead = "观看激励视�?头部",
    videoForHeadDone = "观看完激励视�?头部",

}