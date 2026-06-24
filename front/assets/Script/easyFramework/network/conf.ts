import { Const } from "../../config/Const"
import ServerCtrJSF from "./ServerCtrJSF"

export const GNetUrl = {

	GetWsUrl: ()=>{


	},
	GetH1ttpUrl: ()=>{

	}
}



export const GNetCmd = {
	StickPack: 100000,
	Heartbeat: 101000,
	UserLogin: 101001,
	UserRegister: 101002,
	AntiAddiction: 101003,
	SensitiveWordsCheck: 101004,
	UniqueLogin: 101005,

	SaveUserRecord: 102003,
	GetRegionData: 102004,
	GetRegionList: 102005,
	SaveUserRecordAll: 102007,
	UploadAvatar: 102008,
	GetUserDataByKey: 102009,

	SaveUserRecordMulti: 102010,
	GetCodeDataByKey: 102011,

	ReqWxSession: 103001,
	ReqSendAuthCode: 103002,
	ReqPhoneLogin: 103003,

	BindFaceBook: 104001,
	BindGoogle: 104002,
	ToClientNewMail: 104003,
	GetActiveCode : 104004,

	SetPlayerPkgLog: 105001,
	ReceiveGodWealth: 105002,

	CreateChargeOrder: 106001,
	UpdChargeOrderStatus: 106002,

	GetRankInfo: 201001,
	GetInviteCode: 201002,
	GetInviteCodeReward: 201003,
	GetInviteLevelReward: 201004,
	PushInviteProcess: 201005,
	IsRankOpen: 201006,
	GetSomeonePlayerInfo: 201007,

	GetMidAutumnRank: 301001,
	SetMidAutumnRank: 301002,
	GetWorldBossRank: 301003,
	SetWorldBossRank: 301004,
	PushWorldBossSettle: 301005,
	SetWorldBossPlayerStatus: 301006,
	GetWorldBossPlayerStatus: 301007,

	GetEmpireSpotData: 302001,
	ActionEmpireSpot: 302002,
}

export const GNetConst = {
	ResSuccess: "success",
	ResFail: "fail",
	DataTypeInt: "int",
	DataTypeString: "string",
	DataTypeBoolean: "boolean",
	DataTypeObject: "object",
	ServerEventHead: "ServerDown_",
	Http_isAlive: "/isAlive",
}

export const GEvent = {
	connect_fail: "connect_fail",
	ws_reconnect: "ws_reconnect",
	ws_colse: "ws_colse",
	ws_open: "ws_open",
}