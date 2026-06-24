
import { Camera, color, Node, v2, Vec2, _decorator } from 'cc';
import { TaskView } from '../game/UI/DialogNew/TaskView';

const { ccclass, property } = _decorator;

@ccclass('Const')
export class Const {










    public static isTest = true;


    public static appBuildVersion = 0;

    public static hotupdateVersion = "0.0.0";

    public static gameName: string = "Fitness Party"


    public static isOnline: boolean = false
    public static isOpenCheat: boolean = true

    public static isDebug: boolean = false
    public static version: string = "1.0.9"
    public static SaveHead: string = "JSF_"
    public static camera3D: Node = null!
    public static cameraParam: number = null!
    public static isLow: boolean = true

    public static CameraScene: Camera = null!
    public static SceneNode: Node = null!
    public static SceneBottom: Node = null!
    public static ShadowParent: Node = null!
    public static ShadowWallParent: Node = null!
    public static GridParent: Node = null!
    public static WallGridParent: Node = null!
    public static ItemParent: Node = null!
    public static CarpetParent: Node = null!
    public static PendantParent: Node = null!
    public static WallFixedNode: Node = null!
    public static StreetFixedNode: Node = null!
    public static FloorFixedNode: Node = null!
    public static SelSceneNode: Node = null!
    public static GuestStartPos: Node = null!
    public static LightParent: Node = null!
    public static IsShowOpsDialog: boolean = null!
    public static isGodWealthShow: boolean = false

    public static FloatStarParent: Node = null!
    public static SelBuildingParent: Node = null!

    public static AllItems: Node[] = []
    public static Guests: Node[] = []

    public static OriOffset: Vec2 = v2(0, 0)
    public static MaxStreetX: number = 66
    public static MaxStreetY: number = 23
    public static MaxRoomX: number = 88
    public static MaxRoomY: number = 88
    public static MaxWallXRight: number = 24
    public static MaxWallXLeft: number = -24
    public static MaxWallY: number = 8
    public static GuestSpeedTime: number = 0.66
    public static UICanvas: Node = null!
    public static SceneOffsetX: number = 10000

    public static skillTitleColor: string[] = ['#74e530', '#30d1ff', '#ee51ff', '#ff8230']
    public static skillTitleColorOutline: string[] = ['#026900', '#003270', '#54015e', '#8f3710']

    public static weaponColorOutline: string[] = ['#6f6b54', '#0c5a1a', '#022867', '#4f0059', '#741602', '#6c100e']
    public static weaponColor: string[] = ['#e3dcb9', '#54d240', '#37bfff', '#d45afd', '#ff9437', '#fc3737']
    public static weaponHead: string[] = ['white', 'green', 'blue', 'purple', 'orange', 'red']
    public static weaponColorName: string[] = ['white', 'green', 'blue', 'purple', 'orange', 'red']

    public static bundlesAhead1 = ["json", "font", "d1prefabUI", "d1pub", "d1audio", "d1scene","d1scene2", "prefabUI", "prop1", "prop3"]
    public static bundlesAhead2 = ["d2audio", "d2prefabUI", "d2scene", "textures", "prop2"]
    public static bundlesGame = ["audio", "img"]

    public static bundles = [...Const.bundlesAhead1, ...Const.bundlesAhead2, ...Const.bundlesGame]

    public static GodWealthRefleshTime = 1
    public static LimitShopRefleshPrice = 20
    public static GodWealthReceiveOtherTime = 2



    public static TURNTABLE_GOLD_COST: number = 300;


    public static NAME_CHANGE_GOLD_COST: number = 300;


    public static AD_GOLD_REWARD: number = 300;


    public static AD_GOLD_DAILY_LIMIT: number = 5;


    public static AD_ENERGY_REWARD: number = 5;


    public static AD_ENERGY_DAILY_LIMIT: number = 5;


    public static HOME_MOOD_DECAY_SECONDS: number = 3600;


    public static HOME_HUNGER_DECAY_SECONDS: number = 3600;


    public static HOME_CLEAN_DECAY_SECONDS: number = 3600;


    public static MOOD_RECALL_THRESHOLD: number = 20;


    public static HUNGER_RECALL_THRESHOLD: number = 20;


    public static CLEAN_RECALL_THRESHOLD: number = 20;


    public static UNPLACED_HUNGER_DECAY_SECONDS: number = 86400;


    public static UNPLACED_CLEAN_DECAY_SECONDS: number = 86400;


    public static HUNGER_AUTO_DELETE_DAYS: number = 7;


    public static CLEAN_AUTO_DELETE_DAYS: number = 7;


    public static HUNGER_PLACE_BAN_THRESHOLD: number = 20;


    public static CLEAN_PLACE_BAN_THRESHOLD: number = 20;


    public static PET_NAME_CHANGE_GOLD_COST: number = 300;


    public static PET_HUNGER_STARVATION_THRESHOLD: number = 30;


    public static HUNGER_WARNING_MESSAGE: number = 1;


    public static PET_CLEAN_DIRTY_THRESHOLD: number = 30;


    public static CLEAN_WARNING_MESSAGE: number = 2;


    public static FRIEND_MAX_COUNT: number = 50;


    public static PET_INTERACTION_MOOD_BOOST: number = 30;


    public static CLEAN_FULL:number = 100;


    public static color = {
        white: color(255, 255, 255, 255),
        red: color(244, 0, 2, 255),
        gray: color(49, 49, 49, 255),
        lightGray: color(155, 155, 155, 225),
        black: color(0, 0, 0, 255),
    }

    public static ManagerTypes = {

        roleLv: 1,

        roomClickAdd: 2,

        taskDone: 3,

        unlockPinkBag: 4,

        mergeActionCount: 5,

        buildCount: 6,

        diamondBuyPower: 7,

        roomSell: 8,

        roomSpeedUp: 9,

        powerCost: 10,

        coinPeakMergeCount: 11,

        energyPeakMergeCount: 12,

        coinCost: 13,
    };

    public static CacheDataKey = {
        music: "music",
        sound: "sound",
    }

    public static DataKeys = {
        isInitData: "isInitData",
        roleLv: "roleLv",
        roleName: "roleName",
        roleID: "roleID",
        roleAvatar: "roleAvatar",


        roleExp: "roleExp",
        coin: "coin",
        diamonds: "diamonds",
        power: "power",

        tujianProp: "tujianProp",
        tujianScene: "tujianScene",

        growUp: "growUp",
        warehouseProp: "warehouseProp",


        sceneHead: "sceneHead_",
        sceneItem: "sceneHead_item_",
        sceneCarpet: "sceneHead_carpet_",
        scenePendant: "sceneHead_pendant_",
        sceneWall: "sceneHead_wall_",
        sceneFloor: "sceneHead_floor_",


        saveDayTime: "saveDayTime",


        seasonScore: "seasonScore",

        seasonId: "seasonId",

        seasonPassInfo: String.fromCharCode(115, 101, 97, 115, 111, 110, 65, 119, 97, 114, 100, 73, 110, 102, 111, 95),

        seasonOpen: "seasonOpen",


        boardRoomData: String.fromCharCode(99, 111, 109, 112, 111, 115, 101, 82, 111, 111, 109, 68, 97, 116, 97),

        boardOrderQueue: String.fromCharCode(99, 111, 109, 112, 111, 115, 101, 84, 97, 115, 107, 65, 114, 114),

        boardMilestoneArr: String.fromCharCode(99, 111, 109, 112, 111, 115, 101, 77, 97, 110, 97, 103, 101, 114, 65, 114, 114),

        boardMilestoneAllClaimed: String.fromCharCode(99, 111, 109, 112, 111, 115, 101, 77, 97, 110, 97, 103, 101, 114, 65, 108, 108, 71, 101, 116),

        boardCardArr: String.fromCharCode(99, 111, 109, 112, 111, 115, 101, 67, 97, 114, 100, 65, 114, 114),

        boardItemCount: String.fromCharCode(99, 111, 109, 112, 111, 115, 101, 80, 114, 111, 112, 67, 111, 117, 110, 116, 95),

        boardEnergyReadyAt: String.fromCharCode(99, 111, 109, 112, 111, 115, 101, 80, 111, 119, 101, 114, 84, 105, 109, 101),


        handIndex: "handIndex",

        sceneSkinIsGotted: "sceneSkinIsGotted_",
        sceneRoomIsUnlock: "sceneRoomIsUnlock_",
        sceneRoomIsUnReceive: "sceneRoomIsUnReceive_",

        dailyTime: "dailyTime",
        buyPowerTime: "buyPowerTime1",

        greenStar: "greenStar",
        styleVoucher: "styleVoucher",
        dressValue: "dressValue",
        legacyStyleVoucher: String.fromCharCode(100, 114, 101, 115, 115, 77, 111, 110, 101, 121),

        isVip: "isVip",
        avatarLookId: "avatarLookId",
        avatarLookOwned: "avatarLookOwned_",
        legacyAvatarLookId: String.fromCharCode(114, 111, 108, 101, 68, 114, 101, 115, 115, 85, 112, 73, 100),

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
        scene_item: "scene_item",
        scene_skin: "scene_skin",
        scene_room: "scene_room",
        scene_guest: "scene_guest",
        scene_guest_ani: "scene_guest_ani",
        const: "const",
        ui: "ui_table",
        draw: "draw_table",
        resTable: "res_table",


        prop: "prop_prop",

        mergeReward: "prop_mergeReward",

        bagGrid: "prop_bagGrid",

        taskType: "task_orderType",

        taskMainType: "taskMain_orderType",
        taskUnlock: "taskMain_taskUnlock",


        manager: "task_manager",

        boardSeed: "prop_new",

        handTask: "task_newTask",

        leastTask: "task_SafeTask",

        seasonPass: "task_seasonPass",

        fuBag: "prop_FuBag",


        botBoardSeed: "robot_boardSeed",

        herolevel: "herolevel_table",

        setting: "setting_table",

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

        new_prop:"new_prop",
        new_sign:"new_sign",
        new_turn:"new_turn",
        new_task:"new_task",
        new_activityPrpgress:"new_activityPrpgress",
    }

    public static Shaders = {
        shineColor: 'd1pub|shader/shineColor',
    }

    public static Icons = {
        default: "img|icons/default",
    }


    public static Dialogs = {

        GoldNotEnoughDialogController: 'd1prefabUI|UI/money/gold_no_enough',
        DiamondNotEnoughDialogController: 'd1prefabUI|UI/money/diamond_no_enough',
        TicketNotEnoughDialogController: 'd1prefabUI|UI/money/tick_no_enough',
        FirstRechargeDialogController: "d1prefabUI|UI/money/firstRecharge",
        MonthCard: "d1prefabUI|UI/money/MonthCard",

        SaleDailyDialog: "d2prefabUI|shopLayer/SaleDailyDialog",

        RewardActivityDialog: "d2prefabUI|activity/RewardActivityDialog",

        TotalRechargeDialog: "d2prefabUI|shopLayer/TotalRechargeDialog",



        SceneSkinPanelController: 'd1prefabUI|UI/scene/scene_ui_skin/scene_ui_skin',
        SceneSkinDetailController: 'd1prefabUI|UI/scene/scene_ui_skin/scene_ui_skin_detail',
        SceneSkinDetailListController: 'd1prefabUI|UI/scene/scene_ui_skin/scene_ui_skin_detailList',

        BuildListPanelController: 'd1prefabUI|UI/main/build_list',
        BuildPromptDialogController: 'd1prefabUI|UI/main/build_prompt',
        BuildInfoPanelController: 'd1prefabUI|UI/main/build_info',


        RewardPopupItemController: "d1prefabUI|UI/main/pop_reward_item",

        AvatarStyleLayer: 'd2prefabUI|avatarStyle/AvatarStyleLayer',
        RoleInfoDialog: 'd2prefabUI|avatarStyle/RoleInfoDialog',


        SeasonRoadmapLayer: 'd2prefabUI|seasonPass/SeasonRoadmapLayer',
        SeasonPassLayer: 'd2prefabUI|seasonPass/SeasonPassLayer',

        SeasonGuideLayer: 'd2prefabUI|seasonPass/SeasonGuideLayer',

        SeasonAccessLayer: 'd2prefabUI|seasonPass/SeasonAccessLayer',


        GodWealthLayer: 'd1prefabUI|godWealth/GodWealthLayer',

        FuBagLayer: 'd1prefabUI|godWealth/FuBagLayer',
        FuBagReceiveLayer: 'd1prefabUI|godWealth/FuBagReceiveLayer',
        GodWealthOther: 'd1prefabUI|godWealth/GodWealthOther',



        MergeBoardLayer: 'prefabUI|UI/MergeBoardLayer',
        more_game: 'prefabUI|UI/more_game',
        main: 'd1prefabUI|UI/main/main',
        FloatingTipPanelController: 'd1prefabUI|UI/main/fly_tip',
        ConfirmPromptDialogController: 'd1prefabUI|UI/main/prompt_sure',
        LevelDialog: 'd1prefabUI|UI/LevelDialog/LevelDialog',
        GMInputLayer: 'prefabUI|UI/GMInputLayer',


        BagLayer: 'prefabUI|UI/BagLayer',

        ManagerLayer: 'prefabUI|UI/ManagerLayer',

        HandLayer: 'prefabUI|UI/HandLayer',

        NewItemLayer: 'prefabUI|UI/NewItemLayer',

        ItemCodexLayer: 'prefabUI|UI/ItemCodexLayer',

        TaskListLayer: 'prefabUI|UI/TaskListLayer',

        NewGuest: 'd1prefabUI|UI/main/NewGuest',

        Tujian: "d1prefabUI|UI/Tujian/TujianDialog",

        PropItemInfo: 'd1prefabUI|UI/propInfo/PropItemInfo',
        PropMinInfo: "d1prefabUI|UI/propInfo/PropMinInfo",
        ShopPowerDialog: "d2prefabUI|shopLayer/ShopPowerDialog",

        ShopSynthesisDialog: "d2prefabUI|shopLayer/ShopSynthesisDialog",

        DebugDialog: "d2prefabUI|shopLayer/DebugDialog",
        ShopDialog: "d2prefabUI|shopLayer/ShopDialog",


        SetDialog: "d2prefabUI|setting/SetDialog",
        CodeDialog: "d2prefabUI|setting/DuihuanDialog",

        RewardDialog: "d1prefabUI|common/RewardLayer",
        ActivityDialog: "d2prefabUI|activity/ActivityDialog",
        FreeGiftDialog: "d2prefabUI|activity/FreeGiftDialog",


        SignDialog: "d1prefabUI|UI/sign/SignDialog",

        GrowUpDialog: "d2prefabUI|activity/GrowUpDialog",

        EmailDialog: "d2prefabUI|Email/EmailDialog",
        EmailInfoDialog: "d2prefabUI|Email/EmailInfoDialog",

        FeijiuDialog: "d2prefabUI|setting/FeijiuDialog",

        FeijiuInfoDialog: "d2prefabUI|setting/FeijiuInfoDialog",

        ModifyDailog: "d2prefabUI|setting/ModifyDailog",

        RefleshDialog: "d2prefabUI|shopLayer/RefleshDialog",


        TreasureDialog: "d2prefabUI|Treasure/TreasureDialog",
        TreasureFinishDialog: "d2prefabUI|Treasure/TreasureFinishDialog",


        PrivacyDialog: "d2prefabUI|setting/PrivacyDialog",


        TurnTableView:'d1prefabUI|UI/DialogNew/TurntableView',


        TaskView:'d1prefabUI|UI/DialogNew/TaskView',


        UserinfoView:'d1prefabUI|UI/DialogNew/UserinfoView',


        AvatarListView:'d1prefabUI|UI/DialogNew/AvatarListView',





        PetListView:'d1prefabUI|UI/DialogNew/PetListView',


        PetDetialsView:'d1prefabUI|UI/DialogNew/PetDetialsView',


        PetNameView:'d1prefabUI|UI/DialogNew/PetNameView',


        PetComonTipView:'d1prefabUI|UI/DialogNew/PetComonTipView',


        FriendListView:'d1prefabUI|UI/DialogNew/FriendListView',


        FriendDialogView:'d1prefabUI|UI/DialogNew/FriendDialogView',


        BagNewLayer:'d1prefabUI|UI/DialogNew/BagNewLayer',


        ItmeComonTipView:'d1prefabUI|UI/DialogNew/ItmeComonTipView',


        ShopNewView:'d1prefabUI|UI/DialogNew/ShopNewView',


        ZhuanshiView:'d1prefabUI|UI/DialogNew/ZhuangshiLayer',


        ActivityView:'d1prefabUI|UI/DialogNew/ActivityView',
    }

    public static resPath = {
        roleSpine: "d1scene2|guests/",

        icon: "",
        roleIcon: "d1prefabUI|common/roleIcon/",

        freeGiftIcon: "d2prefabUI|activity/",

        heroIcon: "textures|heroIcon/",

        defaultGuestSpine: "d2scene|guests/",
        defaultSceneIcons: "d2scene|icons/",
        defaultScenePrefabs: 'd2scene|items/',

        Tujian: "d1prefabUI|UI/Tujian/res/",
        mergeSpine: "prefabUI|mergeBoard/spine/",
        mergeIcon: "prefabUI|mergeBoard/icon/",
        common: "d1prefabUI|common/",

        icon_diamons: "d1prefabUI|common/icon_diamond",
        icon_coin: "d1prefabUI|common/icon_coin",
        icon_video: "d1prefabUI|common/icon_video",
        propItembg: "d1prefabUI|UI/propInfo/res/",

        buildpicture: "d1prefabUI|UI/main/res/buildpicture/"

    }


    public static Prefabs = {


        main_top: 'd1prefabUI|UI/main/main_top',
        FloatingTipItemController: 'd1prefabUI|UI/main/fly_tip_item',
        BuildListItemController: 'd1prefabUI|UI/main/build_list_item',
        RewardPopupItemController: 'd1prefabUI|UI/main/pop_reward_item',
        FloatingStarController: 'd1prefabUI|UI/main/float_star',
        FlashStarController: 'd1prefabUI|UI/main/flash_star',
        scene_day: 'd1prefabUI|UI/scene/scene_day/scene_day',
        grid: 'd1prefabUI|UI/scene/grid/grid',
        grid_wall: 'd1prefabUI|UI/scene/grid_wall/grid_wall',
        SceneOperationPanelController: 'd1prefabUI|UI/scene/scene_ui_ops/scene_ui_ops',
        SceneArrowIndicatorController: 'd1prefabUI|UI/scene/scene_ui_ops/scene_ui_arrow',
        StoreSkinItemController: 'd1prefabUI|UI/scene/scene_ui_skin/store_skin_item',
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
        mergeTap: 'd1audio|mergeTap',

        ack: 'd2audio|ack',

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
        basicStyleVoucher: String.fromCharCode(98, 97, 115, 105, 99, 68, 114, 101, 115, 115, 77, 111, 110, 101, 121),
        basicGreenStar: 'basicGreenStar',

        energyMax: "energyMax",
        freePower: "freePower",
        diamonsPower: "diamonsPower",
        CardAddPower: "CardAddPower",
    }


    public static AudioCnt: number = 6
    public static AudioTime: { [key: string]: number } = {
        "alarm": 4640,
        "summon": 2063,
    }

}
