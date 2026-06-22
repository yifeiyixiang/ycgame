
import { Camera, color, Node, v2, Vec2, _decorator } from 'cc';
import { TaskView } from '../game/UI/DialogNew/TaskView';

const { ccclass, property } = _decorator;

@ccclass('Const')
export class Const {
    // private static _instance: Const;
    // static get instance () {
    //     if (this._instance) {
    //         return this._instance;
    //     }T

    //     this._instance = new Const();
    //     return this._instance;
    // }

    public static isTest = true;    //鏄惁娴嬭瘯鐗堟湰

    // app鎵撳寘鐗堟湰鍙?
    public static appBuildVersion = 0;
    // 鐑洿鏂扮増鏈彿
    public static hotupdateVersion = "0.0.0";

    public static gameName: string = "鑲ュ暰鐦﹁韩棣? //鍒嗕韩鐢ㄧ殑娓告垙鍚嶇О

    //todo 涓存椂璋冩暣
    public static isOnline: boolean = false //鏄惁涓婄嚎锛屼笂绾垮悗鍏抽棴鏃ュ織
    public static isOpenCheat: boolean = true //鏄惁寮€鍚綔寮婂櫒

    public static isDebug: boolean = false //鏄惁璋冭瘯
    public static version: string = "1.0.9" //鐗堟湰鍙?
    public static SaveHead: string = "JSF_" //淇敼鏍囬澶达紝鍙互鍒锋柊鐜╁鏁版嵁
    public static camera3D: Node = null! //3D闀滃ご
    public static cameraParam: number = null! //3D闀滃ご绯绘暟
    public static isLow: boolean = true //鏄惁鏄綆绔満

    public static CameraScene: Camera = null! //鍦烘櫙鐩告満
    public static SceneNode: Node = null! //鍦烘櫙鑺傜偣
    public static SceneBottom: Node = null! //鍦烘櫙搴曢儴
    public static ShadowParent: Node = null! //闃村奖鐨勭埗鑺傜偣
    public static ShadowWallParent: Node = null! //澧欏闃村奖鐨勭埗鑺傜偣
    public static GridParent: Node = null! //鏍煎瓙鐨勭埗鑺傜偣
    public static WallGridParent: Node = null! //澧欑殑鏍煎瓙鐨勭埗鑺傜偣
    public static ItemParent: Node = null! //鍦烘櫙閬撳叿鐨勭埗鑺傜偣
    public static CarpetParent: Node = null! //鍦烘櫙鍦版鐨勭埗鑺傜偣
    public static PendantParent: Node = null! //鎸備欢鐨勭埗鑺傜偣
    public static WallFixedNode: Node = null! //澧欎綋鐨勭埗鑺傜偣
    public static StreetFixedNode: Node = null! //琛楅亾鐨勭埗鑺傜偣
    public static FloorFixedNode: Node = null! //鍦版澘鐨勭埗鑺傜偣
    public static SelSceneNode: Node = null! //閫夋嫨鐨勫満鏅妭鐐?
    public static GuestStartPos: Node = null! //瀹汉璧风偣浣嶇疆锛屽湴閾佸彛澶?
    public static LightParent: Node = null! //璺伅鐨勭埗鑺傜偣
    public static IsShowOpsDialog: boolean = null! //鏄惁鏄剧ず鎿嶄綔鐣岄潰
    public static isGodWealthShow: boolean = false // 鏄惁鏄剧ず璐㈢浜?

    public static FloatStarParent: Node = null! //娴姩鏄熸槦鐖惰妭鐐?
    public static SelBuildingParent: Node = null! //鎿嶄綔鎸夐挳鐨勭埗鑺傜偣

    public static AllItems: Node[] = [] //鎴块棿鍐呮墍鏈夊彲浠ouch鐨勭偣
    public static Guests: Node[] = [] //鎵€鏈夊浜鸿妭鐐逛俊鎭?

    public static OriOffset: Vec2 = v2(0, 0) //鍘熷鍋忕Щ鍊?
    public static MaxStreetX: number = 66 //琛楀尯鏈€澶鏂瑰悜,鍙充笅瑙掍负x鏂瑰悜
    public static MaxStreetY: number = 23 //琛楀尯鏈€澶鏂瑰悜
    public static MaxRoomX: number = 88 //88鏈€澶鏂瑰悜锛屽彲鏍规嵁鎴块棿瑙ｉ攣鎯呭喌鏀瑰彉
    public static MaxRoomY: number = 88 //88鏈€澶鏂瑰悜锛屽彲鏍规嵁鎴块棿瑙ｉ攣鎯呭喌鏀瑰彉
    public static MaxWallXRight: number = 24 //88*2鏈€澶鏂瑰悜锛屽彲鏍规嵁鎴块棿瑙ｉ攣鎯呭喌鏀瑰彉
    public static MaxWallXLeft: number = -24 //88*2鏈€澶鏂瑰悜锛屽彲鏍规嵁鎴块棿瑙ｉ攣鎯呭喌鏀瑰彉
    public static MaxWallY: number = 8 //8鏈€澶鏂瑰悜锛屽彲鏍规嵁鎴块棿瑙ｉ攣鎯呭喌鏀瑰彉
    public static GuestSpeedTime: number = 0.66 //瀹汉閫熷害澶氬皯鍊?
    public static UICanvas: Node = null! //UI鐢诲竷鑺傜偣
    public static SceneOffsetX: number = 10000 //瀹汉閫熷害澶氬皯鍊?

    public static skillTitleColor: string[] = ['#74e530', '#30d1ff', '#ee51ff', '#ff8230'] //鐧斤紝缁匡紝钃濓紝绱紝姗欙紝绾?
    public static skillTitleColorOutline: string[] = ['#026900', '#003270', '#54015e', '#8f3710']  //鐧斤紝缁匡紝钃濓紝绱紝姗欙紝绾?

    public static weaponColorOutline: string[] = ['#6f6b54', '#0c5a1a', '#022867', '#4f0059', '#741602', '#6c100e'] //鐧借壊锛岀豢鑹诧紝钃濊壊锛岀传鑹诧紝姗欒壊锛岀孩鑹?
    public static weaponColor: string[] = ['#e3dcb9', '#54d240', '#37bfff', '#d45afd', '#ff9437', '#fc3737'] //鐧借壊锛岀豢鑹诧紝钃濊壊锛岀传鑹诧紝姗欒壊锛岀孩鑹?
    public static weaponHead: string[] = ['鏅€?, '绮捐壇', '绋€鏈?, '鍙茶瘲', '浼犺', '绁炶瘽'] //灞炴€у垪琛?
    public static weaponColorName: string[] = ['white', 'green', 'blue', 'purple', 'orange', 'red']

    public static bundlesAhead1 = ["json", "font", "d1prefabUI", "d1pub", "d1audio", "d1scene","d1scene2", "prefabUI", "prop1", "prop3"]
    public static bundlesAhead2 = ["d2audio", "d2prefabUI", "d2scene", "textures", "prop2"]
    public static bundlesGame = ["audio", "img"]

    public static bundles = [...Const.bundlesAhead1, ...Const.bundlesAhead2, ...Const.bundlesGame]

    public static GodWealthRefleshTime = 1  // 璐㈢瑙嗛鍒锋柊娆℃暟
    public static LimitShopRefleshPrice = 20 //鍟嗗簵閽荤煶鍒锋柊浠锋牸
    public static GodWealthReceiveOtherTime = 2  // 璐㈢棰嗗彇鍒汉娆℃暟


    /** 杞洏寮€1娆℃秷鑰楅噾甯?*/
    public static TURNTABLE_GOLD_COST: number = 300; // 瀵瑰簲ID:1

    /** 鏀瑰悕瀛楁秷鑰楅噾甯?*/
    public static NAME_CHANGE_GOLD_COST: number = 300; // 瀵瑰簲ID:2

    /** 鐪嬪箍鍛婄粰閲戝竵鏁伴噺 */
    public static AD_GOLD_REWARD: number = 300; // 瀵瑰簲ID:3

    /** 鐪嬪箍鍛婄粰閲戝竵姣忔棩娆℃暟涓婇檺 */
    public static AD_GOLD_DAILY_LIMIT: number = 5; // 瀵瑰簲ID:4

    /** 鐪嬪箍鍛婄粰浣撳姏鏁伴噺 */
    public static AD_ENERGY_REWARD: number = 5; // 瀵瑰簲ID:5

    /** 鐪嬪箍鍛婄粰浣撳姏姣忔棩娆℃暟涓婇檺 */
    public static AD_ENERGY_DAILY_LIMIT: number = 5; // 瀵瑰簲ID:6

    /** 瀹跺洯瀹犵墿蹇冩儏搴﹁“鍑忛棿闅旓紙绉掞級 */
    public static HOME_MOOD_DECAY_SECONDS: number = 3600; // 瀵瑰簲ID:7

    /** 瀹跺洯瀹犵墿楗ラタ搴﹁“鍑忛棿闅旓紙绉掞級 */
    public static HOME_HUNGER_DECAY_SECONDS: number = 3600; // 瀵瑰簲ID:8

    /** 瀹跺洯瀹犵墿娓呮磥搴﹁“鍑忛棿闅旓紙绉掞級 */
    public static HOME_CLEAN_DECAY_SECONDS: number = 3600; // 瀵瑰簲ID:9

    /** 瀹犵墿蹇冩儏搴﹀洖鏀堕槇鍊?*/
    public static MOOD_RECALL_THRESHOLD: number = 20; // 瀵瑰簲ID:10

    /** 瀹犵墿楗ラタ搴﹀洖鏀堕槇鍊?*/
    public static HUNGER_RECALL_THRESHOLD: number = 20; // 瀵瑰簲ID:11

    /** 瀹犵墿娓呮磥搴﹀洖鏀堕槇鍊?*/
    public static CLEAN_RECALL_THRESHOLD: number = 20; // 瀵瑰簲ID:12

    /** 鏈斁缃疇鐗╅ゥ楗垮害琛板噺闂撮殧锛堢锛?*/
    public static UNPLACED_HUNGER_DECAY_SECONDS: number = 86400; // 瀵瑰簲ID:13

    /** 鏈斁缃疇鐗╂竻娲佸害琛板噺闂撮殧锛堢锛?*/
    public static UNPLACED_CLEAN_DECAY_SECONDS: number = 86400; // 瀵瑰簲ID:14

    /** 瀹犵墿楗ラタ搴﹀綊闆跺悗鑷姩鍒犻櫎澶╂暟 */
    public static HUNGER_AUTO_DELETE_DAYS: number = 7; // 瀵瑰簲ID:15

    /** 瀹犵墿娓呮磥搴﹀綊闆跺悗鑷姩鍒犻櫎澶╂暟 */
    public static CLEAN_AUTO_DELETE_DAYS: number = 7; // 瀵瑰簲ID:16

    /** 瀹犵墿楗ラタ搴︾姝㈡斁缃槇鍊?*/
    public static HUNGER_PLACE_BAN_THRESHOLD: number = 20; // 瀵瑰簲ID:17

    /** 瀹犵墿娓呮磥搴︾姝㈡斁缃槇鍊?*/
    public static CLEAN_PLACE_BAN_THRESHOLD: number = 20; // 瀵瑰簲ID:18

    /** 瀹犵墿鏀瑰悕娑堣€楅噾甯?*/
    public static PET_NAME_CHANGE_GOLD_COST: number = 300; // 瀵瑰簲ID:19

    /** 瀹犵墿楗ラタ搴﹂ゥ楗跨姸鎬侀槇鍊?*/
    public static PET_HUNGER_STARVATION_THRESHOLD: number = 30; // 瀵瑰簲ID:20

    /** 楗ラタ鐘舵€佹彁绀鸿锛?=鏄剧ず锛?*/
    public static HUNGER_WARNING_MESSAGE: number = 1; // 瀵瑰簲ID:21

    /** 瀹犵墿娓呮磥搴﹁剰鑴忕姸鎬侀槇鍊?*/
    public static PET_CLEAN_DIRTY_THRESHOLD: number = 30; // 瀵瑰簲ID:22

    /** 鑴忚剰鐘舵€佹彁绀鸿锛?=鏄剧ず锛?*/
    public static CLEAN_WARNING_MESSAGE: number = 2; // 瀵瑰簲ID:23

    /** 濂藉弸鏁伴噺涓婇檺 */
    public static FRIEND_MAX_COUNT: number = 50; // 瀵瑰簲ID:24

    /** 瀹犵墿浜掑姩澧炲姞蹇冩儏鍊?*/
    public static PET_INTERACTION_MOOD_BOOST: number = 30; // 瀵瑰簲ID:25

    /**寮€蹇?楗ラタ 娓呮磥 鎬绘暟 */
    public static CLEAN_FULL:number = 100;


    public static color = {
        white: color(255, 255, 255, 255),
        red: color(244, 0, 2, 255),
        gray: color(49, 49, 49, 255),
        lightGray: color(155, 155, 155, 225),
        black: color(0, 0, 0, 255),
    }

    public static ManagerTypes = {
        // 瑙掕壊杈惧埌%d绾?
        roleLv: 1,
        // 鍙戝皠浠绘剰鍙戠敓鍣ㄦ鏁?
        roomClickAdd: 2,
        // 瀹屾垚璁㈠崟鏁伴噺
        taskDone: 3,
        // 瑙ｉ攣绮夎壊鎵嬫彁鍖呮鏁?
        unlockPinkBag: 4,
        // 鍦ㄦ鐩樺悎鎴愭鏁?
        composeCount: 5,
        // 涓哄仴韬埧寤洪€犳鏁?
        buildCount: 6,
        // 娑堣€楅捇鐭宠喘涔拌兘閲忔鏁?
        diamondBuyPower: 7,
        // 鍦ㄦ鐩樹笂鍑哄敭浠绘剰鐗╁搧娆℃暟
        roomSell: 8,
        // 鍔犻€熷彂灏勫櫒娆℃暟
        roomSpeedUp: 9,
        // 绱娑堣€楄兘閲忔暟閲?
        powerCost: 10,
        // 鍚堟垚鏈€楂樼瓑绾ч噾甯佷釜鏁?
        composeCoinMaxLv: 11,
        // 鍚堟垚鏈€楂樼瓑绾ц兘閲忕悆涓暟
        composePowerMaxLv: 12,
        // 绱娑堣€楅噾甯佹暟閲?
        coinCost: 13,
    };

    public static CacheDataKey = {
        music: "music",
        sound: "sound",
    }

    public static DataKeys = {
        isInitData: "isInitData", //鏄惁鍒濆鍖栬繃鏁版嵁
        roleLv: "roleLv", // 鐜╁绛夌骇
        roleName: "roleName", // 鐜╁鍚嶅瓧
        roleID: "roleID", // 鐜╁ID
        roleAvatar: "roleAvatar", // 鐜╁澶村儚


        roleExp: "roleExp", // 鐜╁缁忛獙
        coin: "coin", // 閲戝竵
        diamonds: "diamonds", // 閽荤煶
        power: "power", //浣撳姏

        tujianProp: "tujianProp",  // 鍥鹃壌閬撳叿
        tujianScene: "tujianScene",  // 鍥鹃壌閬撳叿

        growUp: "growUp",  // 鍥鹃壌閬撳叿
        warehouseProp: "warehouseProp", // 浠撳簱閬撳叿


        sceneHead: "sceneHead_", //鍦烘櫙瀛樺偍鐨勫ご閮ㄤ俊鎭?
        sceneItem: "sceneHead_item_", //鍦烘櫙閬撳叿绫诲瀷瀛樺偍
        sceneCarpet: "sceneHead_carpet_", //鍦烘櫙鍦板灚鏁版嵁
        scenePendant: "sceneHead_pendant_", //鍦烘櫙鎸備欢鏁版嵁
        sceneWall: "sceneHead_wall_", //鍦烘櫙澧欎綋
        sceneFloor: "sceneHead_floor_", //鍦烘櫙鍦版澘

        // 璺ㄥぉ淇濆瓨鏃堕棿鐐?
        saveDayTime: "saveDayTime",

        // 鎴樹护绉垎
        seasonScore: "seasonScore",
        // 鎴樹护id
        seasonId: "seasonId",
        // 鎴樹护瀵瑰簲id濂栧姳鎯呭喌
        seasonAwardInfo: "seasonAwardInfo_",
        // 鎴樹护瑙ｉ攣
        seasonOpen: "seasonOpen",

        // 涓荤嚎妫嬬洏鏁版嵁
        composeRoomData: "composeRoomData",
        // 涓荤嚎浠诲姟鍒楄〃
        composeTaskArr: "composeTaskArr",
        // 搴楅暱鍊肩彮鏃?
        composeManagerArr: "composeManagerArr",
        // 鏄惁鏄凡缁忓叏閮ㄥ畬鎴愬簵闀垮€肩彮鏃?
        composeManagerAllGet: "composeManagerAllGet",
        // 鍗＄墖鍒楄〃
        composeCardArr: "composeCardArr",
        // 鍚堟垚UI閬撳叿鑾峰緱娆℃暟鏍囪
        composePropCount: "composePropCount_",
        // 鏃犻檺鑳介噺鏃堕棿
        composePowerTime: "composePowerTime",

        // 鏂版墜鏁欑▼-寮哄紩瀵肩储寮?
        handIndex: "handIndex",

        sceneSkinIsGotted: "sceneSkinIsGotted_", //+鐨偆琛↖D锛屽満鏅噷鐨勭毊鑲ゆ槸鍚﹁幏寰楋紝0鏈幏寰楋紝1鑾峰緱锛?
        sceneRoomIsUnlock: "sceneRoomIsUnlock_", //+鎴块棿ID锛屽満鏅噷鐨勬埧闂存槸鍚﹁В閿侊紝0鏈В閿侊紝1瑙ｉ攣锛?
        sceneRoomIsUnReceive: "sceneRoomIsUnReceive_", //+鎴块棿ID锛屽満鏅噷鐨勬埧闂存槸鍚﹀凡棰嗗彇锛? 銆?锛?

        dailyTime: "dailyTime",
        buyPowerTime: "buyPowerTime1",

        greenStar: "greenStar",
        styleVoucher: "styleVoucher",
        dressValue: "dressValue",

        isVip: "isVip",
        avatarLookId: "avatarLookId",

        timeCD: "timeCD",

        propBuyTime: "propBuyTime",

        emailList: "emailList",

        newEmailIDs: "newEmailIDs",

        signdayReceive: "signdayReceive",

        signdaytime: "signdaytime",

        GodWealthData: "GodWealthData",

        authSetting: "authSetting",

        TaskLineStep: "TaskLineStep",
        TaskLineFinsh: "TaskLineFinsh",
        TaskLineFinshReward: "TaskLineFinshReward",


    }

    public static MoneyKeys = {
        MoneyVip: "Money_Vip",
        FirstCharge: "Money_FirstCharge",
        MonthCharge: "Money_MonthCharge",
        WeekCharge: "Money_WeekCharge",

    }

    public static Tables = {
        scene_item: "scene_item", //鍦烘櫙閬撳叿琛?
        scene_skin: "scene_skin", //鍦烘櫙閬撳叿鐨偆琛?
        scene_room: "scene_room", //鍦烘櫙鎴块棿琛?
        scene_guest: "scene_guest", //鍦烘櫙瀹汉琛?
        scene_guest_ani: "scene_guest_ani", //鍦烘櫙瀹汉鍔ㄧ敾琛?
        const: "const", //鍏ㄥ眬甯搁噺琛?
        ui: "ui_table", //ui鏂囧瓧琛?
        draw: "draw_table", //ui鏂囧瓧琛?
        resTable: "res_table", //ui鏂囧瓧琛?

        // 閬撳叿琛?
        prop: "prop_prop",
        // 鍚堟垚棰濆濂栧姳
        composeAward: "prop_composeAward",
        // 鑳屽寘鎵╁
        bagGrid: "prop_bagGrid",
        // 璁㈠崟鐢熸垚琛?
        taskType: "task_orderType",

        taskMainType: "taskMain_orderType",
        taskUnlock: "taskMain_taskUnlock",

        // 搴楅暱鍊兼棩琛?
        manager: "task_manager",
        // 妫嬬洏鍒濆鍖?
        composeRoomInit: "prop_new",
        // 鏂版墜寮曞浠诲姟
        handTask: "task_newTask",
        // 淇濆簳浠诲姟
        leastTask: "task_SafeTask",
        // 鎴樹护
        seasonAward: "task_seasonAward",
        // 绂忚
        fuBag: "prop_FuBag",

        // 鏈哄櫒浜?妫嬬洏鍒濆鍖?
        composeRoomInitRobot: "robot_robotCompose",

        herolevel: "herolevel_table", //瑙掕壊绛夌骇琛?

        setting: "setting_table", //debug琛?

        shopTable: "shop_shop",
        recharge: "recharge_recharge",
        privilege: "privilege_table",

        giftFree: "shop_giftFree",

        task_growUp: "task_growUp",

        sign: "sign_sign",


        avatarStyle: "Change_change",

        language: "language_table",
        saleShop: "saleshop_shop",
        saleShopItem: "saleshop_item",

        saleshop_totalRecharge: "saleshop_totalRecharge",
        saleshop_RechargeReward: "saleshop_RechargeReward",
        lockActivity_item: "lockActivity_item",

        new_prop:"new_prop",    //閬撳叿琛?
        new_sign:"new_sign",    //绛惧埌琛?
        new_turn:"new_turn",    //杞洏琛?
        new_task:"new_task",    //浠诲姟琛?
        new_activityPrpgress:"new_activityPrpgress",    //娲诲姩杩涘害琛?
    }

    public static Shaders = {
        shineColor: 'd1pub|shader/shineColor',
    }

    public static Icons = {
        default: "img|icons/default", //榛樿鍥炬爣
    }

    //鎵€鏈夊璇濇鍔犺浇鐨勫湴鍧€
    public static Dialogs = {
        //閽辨湁鍏崇殑
        gold_no_enough: 'd1prefabUI|UI/money/gold_no_enough',
        diamond_no_enough: 'd1prefabUI|UI/money/diamond_no_enough',
        tick_no_enough: 'd1prefabUI|UI/money/tick_no_enough',
        firstRecharge: "d1prefabUI|UI/money/firstRecharge",
        MonthCard: "d1prefabUI|UI/money/MonthCard",

        SaleDailyDialog: "d2prefabUI|shopLayer/SaleDailyDialog",

        RewardActivityDialog: "d2prefabUI|activity/RewardActivityDialog",

        TotalRechargeDialog: "d2prefabUI|shopLayer/TotalRechargeDialog",


        //瑁呮壆鍒囨崲鐣岄潰
        scene_ui_skin: 'd1prefabUI|UI/scene/scene_ui_skin/scene_ui_skin',
        scene_ui_skin_detail: 'd1prefabUI|UI/scene/scene_ui_skin/scene_ui_skin_detail',
        scene_ui_skin_detailList: 'd1prefabUI|UI/scene/scene_ui_skin/scene_ui_skin_detailList',

        build_list: 'd1prefabUI|UI/main/build_list', //寤洪€犳竻鍗曞垪琛?
        build_prompt: 'd1prefabUI|UI/main/build_prompt', //鎻愮ず寤洪€犵殑鐣岄潰
        build_info: 'd1prefabUI|UI/main/build_info', //鎻愮ず寤洪€犵殑鐣岄潰


        pop_reward_item: "d1prefabUI|UI/main/pop_reward_item",

        RoleDressUp: 'd2prefabUI|' + 'role' + 'Dress' + 'Up/RoleDressUp',
        RoleInfoDialog: 'd2prefabUI|' + 'role' + 'Dress' + 'Up/RoleInfoDialog',

        // 鎴樹护濂栧姳鐣岄潰
        SeasonTrackLayer: 'd2prefabUI|seasonAward/' + 'Season' + 'Award' + 'Layer',
        SeasonAwardAdLayer: 'd2prefabUI|seasonAward/SeasonAwardAdLayer',
        // 鎴樺姏璇存槑椤甸潰
        SeasonHelpLayer: 'd2prefabUI|seasonAward/SeasonHelpLayer',
        // 鎴樺姏璐拱鐣岄潰
        SeasonBuyLayer: 'd2prefabUI|seasonAward/SeasonBuyLayer',

        // 璐㈢鐣岄潰
        GodWealthLayer: 'd1prefabUI|godWealth/GodWealthLayer',
        // 绂忚鐣岄潰
        FuBagLayer: 'd1prefabUI|godWealth/FuBagLayer',
        FuBagReceiveLayer: 'd1prefabUI|godWealth/FuBagReceiveLayer',
        GodWealthOther: 'd1prefabUI|godWealth/GodWealthOther',


        // 鍚堟垚鐣岄潰
        ComposeLayer: 'prefabUI|UI/ComposeLayer',
        more_game: 'prefabUI|UI/more_game',
        main: 'd1prefabUI|UI/main/main', // 涓婚〉
        fly_tip: 'd1prefabUI|UI/main/fly_tip',
        prompt_sure: 'd1prefabUI|UI/main/prompt_sure', //鎻愮ず纭畾
        LevelDialog: 'd1prefabUI|UI/LevelDialog/LevelDialog',
        GMInputLayer: 'prefabUI|UI/GMInputLayer',

        // 鑳屽寘鐣岄潰
        BagLayer: 'prefabUI|UI/BagLayer',
        // 搴楅暱鍊肩彮鏃ョ晫闈?
        ManagerLayer: 'prefabUI|UI/ManagerLayer',
        // 鏂版墜鏁欑▼鐣岄潰
        HandLayer: 'prefabUI|UI/HandLayer',
        // 鑾峰緱鏂扮墿鍝?
        NewItemLayer: 'prefabUI|UI/NewItemLayer',
        // 閬撳叿璇︽儏椤?
        ItemInsightLayer: 'prefabUI|UI/' + 'Prop' + 'Detail' + 'Layer',
        // 璁㈠崟鍒楄〃
        TaskListLayer: 'prefabUI|UI/TaskListLayer',
        // 鏂拌偉楣?
        NewGuest: 'd1prefabUI|UI/main/NewGuest',

        Tujian: "d1prefabUI|UI/Tujian/TujianDialog",

        PropItemInfo: 'd1prefabUI|UI/propInfo/PropItemInfo',
        PropMinInfo: "d1prefabUI|UI/propInfo/PropMinInfo",
        ShopPowerDialog: "d2prefabUI|shopLayer/ShopPowerDialog",

        ShopSynthesisDialog: "d2prefabUI|shopLayer/ShopSynthesisDialog",

        DebugDialog: "d2prefabUI|shopLayer/DebugDialog",
        ShopDialog: "d2prefabUI|shopLayer/ShopDialog",

        /**璁剧疆鐣岄潰 */
        SetDialog: "d2prefabUI|setting/SetDialog",
        CodeDialog: "d2prefabUI|setting/DuihuanDialog",

        RewardDialog: "d1prefabUI|common/RewardLayer",
        ActivityDialog: "d2prefabUI|activity/ActivityDialog",
        FreeGiftDialog: "d2prefabUI|activity/FreeGiftDialog",

        /**绛惧埌鐣岄潰 */
        SignDialog: "d1prefabUI|UI/sign/SignDialog",

        GrowUpDialog: "d2prefabUI|activity/GrowUpDialog",

        EmailDialog: "d2prefabUI|Email/EmailDialog",
        EmailInfoDialog: "d2prefabUI|Email/EmailInfoDialog",

        FeijiuDialog: "d2prefabUI|setting/FeijiuDialog",

        FeijiuInfoDialog: "d2prefabUI|setting/FeijiuInfoDialog",
        /**淇敼鏄电О */
        ModifyDailog: "d2prefabUI|setting/ModifyDailog",

        RefleshDialog: "d2prefabUI|shopLayer/RefleshDialog",

        //闃垮疂鐨勮揣杞?
        TreasureDialog: "d2prefabUI|Treasure/TreasureDialog",
        TreasureFinishDialog: "d2prefabUI|Treasure/TreasureFinishDialog",

        //闅愮鏀跨瓥
        PrivacyDialog: "d2prefabUI|setting/PrivacyDialog",

        /**杞洏鐣岄潰 */
        TurnTableView:'d1prefabUI|UI/DialogNew/TurntableView',

        /**浠诲姟鐣岄潰 */
        TaskView:'d1prefabUI|UI/DialogNew/TaskView',

        /**涓汉淇℃伅鐣岄潰 */
        UserinfoView:'d1prefabUI|UI/DialogNew/UserinfoView',

        /**澶村儚鍒囨崲 */
        AvatarListView:'d1prefabUI|UI/DialogNew/AvatarListView',

        /**鑾峰緱浣撳姏锛岄噾甯?/
        GetgoldView:'d1prefabUI|UI/DialogNew/GetgoldView',

        /**瀹犵墿 鍒楄〃*/
        PetListView:'d1prefabUI|UI/DialogNew/PetListView',

        /**瀹犵墿 璇︽儏鐣岄潰*/
        PetDetialsView:'d1prefabUI|UI/DialogNew/PetDetialsView',

        /**瀹犵墿 淇敼鏄电О */
        PetNameView:'d1prefabUI|UI/DialogNew/PetNameView',

        /**瀹犵墿鏀剧敓 閫氱敤鎻愮ず妗?*/
        PetComonTipView:'d1prefabUI|UI/DialogNew/PetComonTipView',

        /**濂藉弸 鍒楄〃*/
        FriendListView:'d1prefabUI|UI/DialogNew/FriendListView',

        /**濂藉弸 寮规*/
        FriendDialogView:'d1prefabUI|UI/DialogNew/FriendDialogView',

        /**鏂拌儗鍖呯晫闈?*/
        BagNewLayer:'d1prefabUI|UI/DialogNew/BagNewLayer',

        /**鏄惁鍑哄敭 浜岀骇闈㈡澘 */
        ItmeComonTipView:'d1prefabUI|UI/DialogNew/ItmeComonTipView',

        /**鏂?鍟嗗簵鐣岄潰 */
        ShopNewView:'d1prefabUI|UI/DialogNew/ShopNewView',

        /**楗板搧鐣岄潰 */
        ZhuanshiView:'d1prefabUI|UI/DialogNew/ZhuangshiLayer',

        /**鐩茬洅娲诲姩鐣岄潰 */
        ActivityView:'d1prefabUI|UI/DialogNew/ActivityView',
    }

    public static resPath = {
        roleSpine: "d1scene2|guests/",

        icon: "",
        roleIcon: "d1prefabUI|common/roleIcon/",

        freeGiftIcon: "d2prefabUI|activity/",

        heroIcon: "textures|heroIcon/",

        defaultGuestSpine: "d2scene|guests/", //榛樿鍦烘櫙瀹汉
        defaultSceneIcons: "d2scene|icons/", //榛樿鍦烘櫙鍥炬爣
        defaultScenePrefabs: 'd2scene|items/', //榛樿鍦烘櫙棰勫埗浣?

        Tujian: "d1prefabUI|UI/Tujian/res/",
        composeSpine: "prefabUI|compose/spine/",// 鍚堟垚妯″潡spine鍔ㄧ敾鐩綍
        composeIcon: "prefabUI|compose/icon/",
        common: "d1prefabUI|common/",

        icon_diamons: "d1prefabUI|common/icon_diamond",
        icon_coin: "d1prefabUI|common/icon_coin",
        icon_video: "d1prefabUI|common/icon_video",
        propItembg: "d1prefabUI|UI/propInfo/res/",

        buildpicture: "d1prefabUI|UI/main/res/buildpicture/"

    }

    //棰勫埗浣撳姞杞?
    public static Prefabs = {

        //UI-涓荤晫闈?
        main_top: 'd1prefabUI|UI/main/main_top',
        fly_tip_item: 'd1prefabUI|UI/main/fly_tip_item',
        build_list_item: 'd1prefabUI|UI/main/build_list_item', //寤虹瓚娓呭崟鐨勯€夐」
        pop_reward_item: 'd1prefabUI|UI/main/pop_reward_item', //璺冲嚭鐨勮祫婧愬皬妗?
        float_star: 'd1prefabUI|UI/main/float_star', //瀹跺叿涓婇潰椋樼潃鐨勬槦鏄?
        flash_star: 'd1prefabUI|UI/main/flash_star', //闂儊鐨勬槦鏄?
        scene_day: 'd1prefabUI|UI/scene/scene_day/scene_day',
        grid: 'd1prefabUI|UI/scene/grid/grid',
        grid_wall: 'd1prefabUI|UI/scene/grid_wall/grid_wall',
        scene_ui_ops: 'd1prefabUI|UI/scene/scene_ui_ops/scene_ui_ops',
        scene_ui_arrow: 'd1prefabUI|UI/scene/scene_ui_ops/scene_ui_arrow',
        store_skin_item: 'd1prefabUI|UI/scene/scene_ui_skin/store_skin_item', //瑁呮壆閫夐」
        guest: 'd1scene2|guests/guest',

        Main_top: "d1prefabUI|UI/main/main_top",

        PropItem: "d1prefabUI|UI/propInfo/PropItem",
        PropReceive: "d1prefabUI|UI/propInfo/PropReceive",
        ShopMoneyItem: "d2prefabUI|shopLayer/ShopMoneyItem",
        ShopSynthesisItem: "d2prefabUI|shopLayer/ShopSynthesisItem",

        GetAnimalLayer: "d1prefabUI|common/GetAnimalLayer",

        RedPoint: "d1prefabUI|common/RedPoint",
        FeijiuItem: "d2prefabUI|setting/FeijiuItem",


    }

    public static Audio = {
        bgm: 'd1audio|bgm',
        btn: 'd1audio|btn',
        thunder: 'audio|thunder',
        show_ten: 'audio|show_ten',
        electric: 'audio|electric',
        ten_prompt2: 'audio|ten_prompt2',
        ten_summon: 'audio|ten_summon',
        num: 'audio|num',
        flash_show: 'd1audio|flash_show',
        star_touch: 'd1audio|star_touch',

        sellBack: 'd1audio|sell_back',
        bubble: 'd1audio|bubble',
        bubbleBomb: 'd1audio|bubble_bomb',
        sceneChange: 'd1audio|scene_change',
        createProp: 'd1audio|create_prop',
        taskDone: 'd1audio|task_done',
        clickCoin: 'd1audio|click_coin',
        compose: 'd1audio|compose',

        ack: 'd2audio|ack',
        // bubble: 'd2audio|bubble',
        aim: 'd2audio|aim',
        card: 'd2audio|card',
        fireball: 'd2audio|fireball',
        foot: 'd2audio|foot',
        getGold: 'd2audio|getGold',
        gold_drop1: 'd2audio|gold_drop1',
        hBone: 'd2audio|hBone',
        hGhost: 'd2audio|hGhost',
        hit: 'd2audio|hit',
        hMeat: 'd2audio|hMeat',
        hStone: 'd2audio|hStone',
        hWood: 'd2audio|hWood',
        ice: 'd2audio|ice',
        laser: 'd2audio|laser',
        lose: 'd2audio|lose',
        over_card: 'd2audio|over_card',
        prompt: 'd2audio|prompt',
        show_up: 'd2audio|show_up',
        skill_show: 'd2audio|skill_show',
        summon: 'd2audio|summon',
        uplv: 'd2audio|uplv',
        upstar: 'd2audio|upstar',
        open_box: 'd2audio|open_box',

        absorb: 'd2audio|absorb',
        collect: 'd2audio|collect',
        land: 'd2audio|land',
        sweep: 'd2audio|sweep',
        win: 'd2audio|win',
        wind: 'd2audio|wind',
    }

    public static config = {
        basicGold: 'basicGold',
        basicDiamons: 'basicGem',
        basicDress: 'basicDress',
        basicDressMoney: 'basicDressMoney',
        basicGreenStar: 'basicGreenStar',

        energyMax: "energyMax",
        freePower: "freePower",
        diamonsPower: "diamonsPower",
        CardAddPower: "CardAddPower",
    }

    //澹伴煶鐨勯暱搴︾粺璁★紝鐢ㄤ簬骞跺彂鎺у埗锛屽崟浣嶆绉?
    public static AudioCnt: number = 6
    public static AudioTime: { [key: string]: number } = {
        "alarm": 4640,
        "summon": 2063,
    }

}
