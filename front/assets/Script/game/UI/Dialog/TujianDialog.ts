import { _decorator, Node, Label, ScrollView, find, Sprite, SpriteFrame, tween, v3, UITransform, math, VideoPlayer, Root, ProgressBar, instantiate, Vec3, Layout, Color, UIOpacity, Prefab, } from 'cc';
import { Const } from '../../../config/Const';
import { GSceneSkinState, TujianState } from '../../../config/global';
import { AudioPlaybackService } from '../../../easyFramework/mgr/audioManager';
import BaseView from '../../../easyFramework/mgr/BaseView';
import { UiLayerService } from '../../../easyFramework/mgr/uiManager';
import TableDataService from '../../../easyFramework/other/tables';
import { UtilPub } from '../../../easyFramework/utils/UtilPub';
import { redPointManager, RPointEvent } from '../../comm/RedPointManager';
import { SceneData } from '../../comm/SceneData';
import { playerDataStore } from '../../comm/UserData';
import { UtilScene } from '../../comm/UtilScene';
import { PropItem, PropItemFlag } from './PropItem';
import { ScrollViewUtil } from "../../comm/ScrollViewUtil";
import { PropReceive } from './PropReceive';
import { GamePlatform } from '../../platform/GamePlatform';

const { ccclass, property } = _decorator;



@ccclass('TujianDialog')
export class TujianDialog extends BaseView {
    @property({ type: Node, tooltip: "图鉴列表" }) tujianScroll: Node = null!;
    @property({ type: Node, tooltip: "图鉴列表详情" }) tujianInfoScroll: Node = null!;
    @property({ type: Node, tooltip: "icon" }) layerPool: Node = null!;
    @property({ type: Node, tooltip: "skinItem" }) skinItem: Node = null!;


    @property({ type: Node }) btnItem: Node = null!;
    @property({ type: Node }) btndress: Node = null!;

    @property({ type: Prefab }) propItem: Prefab = null!;



    _propdata: any = null

    _curListType: any = null

    start() {


    }

    show(args: any) {
        super.show(args)
        this.layerPool.position = v3(285, 0, 0)
        this.bindButton(find("root/btnClose", this.node)!, this._fn_xe)

        this.initElementArr()
        GamePlatform._fn_aja("查看道具图鉴")
        redPointManager._fn_afp(this.btnItem, RPointEvent.RPM_TujianProp, false)
        redPointManager._fn_afp(this.btndress, RPointEvent.RPM_TujianScene, false)


    }

    initElementArr() {
        this.tujianScroll.getChildByName("view")!.active = true
        let tujiandata = playerDataStore.TujianArr
        this._fn_adc(this.tujianScroll, tujiandata, this._fn_oc, this)
    }

    initDressArr() {
        this.tujianScroll.getChildByName("view")!.active = true

        let tujiandata = playerDataStore.TujianSceneArr
        this._fn_adc(this.tujianScroll, tujiandata, this._fn_nx, this)
    }

    _fn_oc(itemUI: Node, item: any, index: number, self: any) {
        itemUI.getChildByName("title")!.getComponent(Label)!.string = "" + item.typename
        itemUI.getChildByName("info")!.getComponent(Label)!.string = "" + item.mask1
        self.addButtonHander(itemUI, self.node, "TujianDialog", "openTujianArr", item)
        UtilPub._fn_je(Const.resPath.icon + item.icon, (sf: SpriteFrame) => {
            itemUI.getChildByName("icon")!.getComponent(Sprite)!.spriteFrame = sf
            UtilPub._fn_aer(itemUI.getChildByName("icon")!, 110)
        })
        let propData = TableDataService.ins()._fn_mb(Const.Tables.prop, "type", item.type)
        let totalNum = 0
        let getNum = 0

        propData.forEach(element => {
            totalNum++
            if (playerDataStore._fn_pv(element.id) != TujianState.unGet) {
                getNum++
            }
        });

        let progressBar = find("ProgressBar", itemUI)!.getComponent(ProgressBar)
        progressBar!.progress = getNum / totalNum

        find("getLabel", itemUI)!.getComponent(Label)!.string = getNum + "/" + totalNum

        redPointManager._fn_afq(itemUI, RPointEvent.RPM_Null, playerDataStore._fn_cm(item.type))
    }

    openTujianArr(event: any, data: any) {
        AudioPlaybackService.instance._fn_xc(Const.Audio.btn)
        this._curListType = data.type

        this.tujianInfoScroll.getChildByName("view")!.active = true
        this._fn_og()
        tween(this.layerPool).to(0.2, { position: v3(-285, 0, 0) }).call(() => {
            this.tujianScroll.getChildByName("view")!.active = false
        }).start()
    }

    _fn_og() {
        let propData = TableDataService.ins()._fn_mb(Const.Tables.prop, "type", this._curListType)
        let dataArr: any = []
        propData.forEach(element => {
            if (!dataArr[element.typeson - 1]) {
                dataArr[element.typeson - 1] = []
            }
            dataArr[element.typeson - 1].push(element)
        });

        let newArr = []
        for (let i = 0; i < dataArr.length; i++) {
            newArr.push(dataArr[i][0].sonname + "")
            let arr: any = []
            let num = 0

            for (let index = 0; index < dataArr[i].length; index++) {
                const element = dataArr[i][index];
                arr.push(element)
                num++
                if (num >= 4 || index == dataArr[i].length - 1) {
                    newArr.push(arr)
                    arr = []
                    num = 0
                }
            }

        }
        let content = find("view/content", this.tujianInfoScroll)!
        content.getComponent(Layout)!.spacingY = 10

        this._fn_adc(this.tujianInfoScroll, newArr, this._fn_oe, this)





    }

    _fn_oe(itemUI: Node, itemData: any, index: number, self: TujianDialog) {

        let title = itemUI.getChildByName("titl2")!
        let layer = itemUI.getChildByName("Layout")!

        if (typeof (itemData) == "string") {
            title.active = true
            title.getChildByName("title")!.getComponent(Label)!.string = itemData + ""
            title.getChildByName("title")!.position = v3(0, 0, 0)
            title.getChildByName("titl2")!.position = v3(0, 0, 0)
            layer.active = false
        } else {
            title.active = false
            layer.active = true

            if (itemData.length > 0) {

                let layer = itemUI.getChildByName("Layout")!
                for (let index = 0; index < 4; index++) {
                    let item = layer.getChildByName("propItem" + index)!
                    if (item)
                        item.active = false

                    item = layer.getChildByName("skinNode" + index)!
                    if (item)
                        item.active = false
                }

                layer.getComponent(Layout)!.spacingX = 40


                for (let index = 0; index < itemData.length; index++) {
                    const element = itemData[index];
                    let item = layer.getChildByName("propItem" + index)!
                    if (item == null) {
                        item = instantiate(self.propItem)!
                        item!.parent = layer
                        item!.name = "propItem" + index
                    }
                    let propReceive = find("root/PropReceive", item)!
                    if (propReceive) {
                        propReceive.active = false
                    }
                    item.active = true
                    if (playerDataStore._fn_pv(element.id) == TujianState.received) {
                        item!.getComponent(PropItem)!.setData(element.id, PropItemFlag.HideName | PropItemFlag.ShowLevel | PropItemFlag.ShowMinInfo)
                    } else if (playerDataStore._fn_pv(element.id) == TujianState.geted) {
                        item!.getComponent(PropItem)!.setData(element.id, PropItemFlag.HideName | PropItemFlag.ShowLevel | PropItemFlag.ShowMinInfo)
                        if (propReceive == null) {
                            self.addPrefab(Const.Prefabs.PropReceive, item.getChildByName("root")!, undefined, { propId: element.id, key: Const.DataKeys.tujianProp })
                        } else {
                            propReceive.getComponent(PropReceive)!._layerData = { propId: element.id, key: Const.DataKeys.tujianProp }
                            propReceive.getComponent(PropReceive)!.initData()
                            propReceive.active = true
                        }
                    } else {
                        item!.getComponent(PropItem)!.setData(element.id, PropItemFlag.HideInfo)
                    }
                    item!.getComponent(PropItem)!.setSize(100).setItemBg(2)
                    if (index != itemData.length - 1 && (index + 1) % 4 != 0) {
                        let jiantou = item.getChildByName("jiantou")!
                        if (jiantou == null) {
                            jiantou = self.createSprite(Const.resPath.Tujian + "an1")
                            jiantou.name = "jiantou"
                            jiantou.scale = v3(1.2, 1.2, 1)
                            jiantou.position = v3(70, 0, 1)
                            item.addChild(jiantou)
                        }
                    }
                }
            }
        }

    }

    _fn_od(itemUI: Node, itemData: any, index: number, self: any) {

        if (itemData.length > 0) {
            itemUI.getChildByName("titl2")!.getChildByName("title")!.getComponent(Label)!.string = itemData[0].sonname + ""
            let layer = itemUI.getChildByName("Layout")!
            layer!.removeAllChildren()
            layer.getComponent(Layout)!.spacingX = 40
            layer.getComponent(Layout)!.constraintNum = 4
            layer!.getComponent(UITransform)!.height = 120 * Math.ceil(itemData.length / 4)
            for (let index = 0; index < itemData.length; index++) {
                const element = itemData[index];
                self.addPrefab(Const.Prefabs.PropItem, layer!, (item: any) => {
                    if (playerDataStore._fn_pv(element.id) == TujianState.received) {
                        item.getComponent(PropItem).setData(element.id, PropItemFlag.HideName | PropItemFlag.ShowLevel | PropItemFlag.ShowMinInfo)
                    } else if (playerDataStore._fn_pv(element.id) == TujianState.geted) {
                        item.getComponent(PropItem).setData(element.id, PropItemFlag.HideName | PropItemFlag.ShowLevel | PropItemFlag.ShowMinInfo)
                        self.addPrefab(Const.Prefabs.PropReceive, item.getChildByName("root"), null, { propId: element.id, key: Const.DataKeys.tujianProp })
                    } else {
                        item.getComponent(PropItem).setData(element.id, PropItemFlag.HideInfo)
                    }
                    item.getComponent(PropItem).setSize(100).setItemBg(2)
                    if (index != itemData.length - 1 && (index + 1) % 4 != 0) {
                        let jiantou = self.createSprite(Const.resPath.Tujian + "an1")
                        jiantou.scale = v3(1.2, 1.2, 1)
                        jiantou.position = v3(70, 0, 1)
                        item.addChild(jiantou)
                    }
                })
            }
        }
    }


    _fn_nx(itemUI: Node, item: any, index: number, self: TujianDialog) {
        itemUI.getChildByName("title")!.getComponent(Label)!.string = "" + item.name
        itemUI.getChildByName("info")!.getComponent(Label)!.string = "" + item.desc


        let icon = item.tujianIcon
        if (icon == "") {
            icon = "icon_" + item.id
        }
        self._fn_agk(find("icon", itemUI)!.getComponent(Sprite)!, UtilScene._fn_kb(icon), undefined, 120)


        self.addButtonHander(itemUI, self.node, "TujianDialog", "openSceneTujianArr", item)

        let totalNum = 0
        let getNum = 0
        let isCanReceive = false
        let propData = TableDataService.ins()._fn_mb(Const.Tables.scene_item, "room", item.id)

        propData.forEach(element => {
            let skinData = TableDataService.ins()._fn_mb(Const.Tables.scene_skin, "scene", element.id)
            skinData.forEach(skin => {
                let index = skin.id % element.id
                if (index > 0) {
                    totalNum++

                    if (playerDataStore._fn_pv(skin.id, Const.DataKeys.tujianScene) != TujianState.unGet) {
                        getNum++
                        if (playerDataStore._fn_pv(skin.id, Const.DataKeys.tujianScene) == TujianState.geted) {
                            isCanReceive = true
                        }
                    }
                }
            })
        });

        let progressBar = find("ProgressBar", itemUI)!.getComponent(ProgressBar)
        progressBar!.progress = getNum / totalNum

        find("getLabel", itemUI)!.getComponent(Label)!.string = getNum + "/" + totalNum
        redPointManager._fn_afq(itemUI, RPointEvent.RPM_Null, isCanReceive)
    }

    openSceneTujianArr(event: any, data: any) {
        AudioPlaybackService.instance._fn_xc(Const.Audio.btn)
        this._curListType = data


        this.tujianScroll.getChildByName("view")!.active = false
        this._fn_ox()

        tween(this.layerPool).to(0.2, { position: v3(-285, 0, 0) }).call(() => {
            this.tujianInfoScroll.getChildByName("view")!.active = true
        }).start()
    }

    _fn_ox() {
        let propData = TableDataService.ins()._fn_mb(Const.Tables.scene_item, "room", this._curListType.id)
        let dataArr: any = []





        propData.forEach(element => {
            let skinData = TableDataService.ins()._fn_mb(Const.Tables.scene_skin, "scene", element.id)
            skinData.forEach(skin => {
                let index = skin.tujianId
                if (index > 0) {
                    if (!dataArr[index]) {
                        dataArr[index] = []
                    }
                    dataArr[index].push(skin)
                }
            })
        });

        let newArr = []
        for (let i = 1; i < dataArr.length; i++) {
            newArr.push(this._curListType.tujianName[i - 1])

            let arr: any = []
            let num = 0
            if (dataArr[i]) {
                for (let index = 0; index < dataArr[i].length; index++) {
                    const element = dataArr[i][index];
                    arr.push(element)
                    num++
                    if (num >= 3 || index == dataArr[i].length - 1) {
                        newArr.push(arr)
                        arr = []
                        num = 0
                        newArr.push([])
                    }
                }
            }
        }
        let content = find("view/content", this.tujianInfoScroll)!
        content.getComponent(Layout)!.spacingY = 0
        this._fn_adc(this.tujianInfoScroll, newArr, this._fn_pb, this)




    }

    _fn_pb(itemUI: Node, itemData: any, index: number, self: any) {

        let title = itemUI.getChildByName("titl2")!
        let layer = itemUI.getChildByName("Layout")!

        if (typeof (itemData) == "string") {
            title.active = true
            title.getChildByName("title")!.getComponent(Label)!.string = itemData + ""
            title.getChildByName("title")!.position = v3(0, 44, 0)
            title.getChildByName("titl2")!.position = v3(0, 40, 0)
            layer.active = false
        } else {
            title.active = false
            layer.active = true



            layer.getComponent(Layout)!.spacingX = 20

            for (let index = 0; index < 4; index++) {
                let item = layer.getChildByName("propItem" + index)!
                if (item)
                    item.active = false

                item = layer.getChildByName("skinNode" + index)!
                if (item)
                    item.active = false
            }

            if (itemData.length > 0) {
                itemUI.getChildByName("titl2")!.getChildByName("title")!.getComponent(Label)!.string = self._curListType.tujianName[index - 1] + ""

                for (let index = 0; index < itemData.length; index++) {
                    const element = itemData[index];
                    let skinNode = layer.getChildByName("skinNode" + index)!
                    if (skinNode == null) {
                        skinNode = instantiate(self.skinItem)
                        skinNode.name = "skinNode" + index
                        skinNode.position = Vec3.ZERO;
                        layer!.addChild(skinNode)
                    }
                    skinNode.active = true
                    find("name", skinNode)!.getComponent(Label)!.string = element.name
                    let iconSprite = find("icon", skinNode)!.getComponent(Sprite)!
                    UtilScene._fn_agh(iconSprite, element)

                    let propReceive = find("PropReceive", skinNode)!
                    if (propReceive) {
                        propReceive.active = false
                    }

                    if (playerDataStore._fn_pv(element.id, Const.DataKeys.tujianScene) == TujianState.received) {
                        iconSprite.color = Color.WHITE
                        iconSprite.node.getComponent(UIOpacity)!.opacity = 255
                    } else if (playerDataStore._fn_pv(element.id, Const.DataKeys.tujianScene) == TujianState.geted) {
                        iconSprite.color = Color.WHITE
                        iconSprite.node.getComponent(UIOpacity)!.opacity = 255

                        if (propReceive == null) {
                            self.addPrefab(Const.Prefabs.PropReceive, skinNode, null, { propId: element.id, key: Const.DataKeys.tujianScene })
                        } else {
                            propReceive.getComponent(PropReceive)!._layerData = { propId: element.id, key: Const.DataKeys.tujianScene }
                            propReceive.getComponent(PropReceive)!.initData()
                            propReceive.active = true
                        }

                    } else {
                        iconSprite.color = Color.BLACK
                        iconSprite.node.getComponent(UIOpacity)!.opacity = 120
                    }

                    self.bindButton(skinNode, () => {
                        UiLayerService.instance._fn_ahg(Const.Dialogs.SceneSkinDetailListController, { skinId: element.id })
                    })
                }
            }
        }
    }


    _fn_pa(itemUI: Node, itemData: any, index: number, self: any) {

        if (itemData.length > 0) {
            itemUI.getChildByName("titl2")!.getChildByName("title")!.getComponent(Label)!.string = self._curListType.tujianName[index - 1] + ""
            let layer = itemUI.getChildByName("Layout")!
            layer!.removeAllChildren()
            layer!.getComponent(UITransform)!.height = 120 * Math.ceil(itemData.length / 4)
            layer.getComponent(Layout)!.spacingX = 20
            layer.getComponent(Layout)!.constraintNum = 3

            for (let index = 0; index < itemData.length; index++) {
                const element = itemData[index];
                let skinNode = instantiate(self.skinItem)
                skinNode.active = true
                skinNode.position = Vec3.ZERO;
                layer!.addChild(skinNode)
                find("name", skinNode)!.getComponent(Label)!.string = element.name
                let iconSprite = find("icon", skinNode)!.getComponent(Sprite)!
                UtilScene._fn_agh(iconSprite, element)

                if (playerDataStore._fn_pv(element.id, Const.DataKeys.tujianScene) == TujianState.received) {
                    iconSprite.color = Color.WHITE
                    iconSprite.node.getComponent(UIOpacity)!.opacity = 255
                } else if (playerDataStore._fn_pv(element.id, Const.DataKeys.tujianScene) == TujianState.geted) {
                    iconSprite.color = Color.WHITE
                    iconSprite.node.getComponent(UIOpacity)!.opacity = 255
                    self.addPrefab(Const.Prefabs.PropReceive, skinNode, null, { propId: element.id, key: Const.DataKeys.tujianScene })
                } else {
                    iconSprite.color = Color.BLACK
                    iconSprite.node.getComponent(UIOpacity)!.opacity = 120
                }

                self.bindButton(skinNode, () => {
                    UiLayerService.instance._fn_ahg(Const.Dialogs.SceneSkinDetailListController, { skinId: element.id })
                })
            }
        }
    }

    closeTujianArr() {
        this.tujianScroll.getChildByName("view")!.active = true
        tween(this.layerPool).to(0.2, { position: v3(285, 0, 0) }).call(() => {
            this.tujianInfoScroll.getChildByName("view")!.active = true
        }).start()
        this.tujianScroll.getComponent(ScrollViewUtil)!.refreshList()

    }

    public static _fn_agh(node: Sprite, skinData: any) {
        let icon = skinData.tujianIcon
        if (icon == "") {
            icon = "icon_" + skinData.id
        }
        UtilPub._fn_je(UtilScene._fn_kb(icon), (sf: SpriteFrame) => {
            if (sf != null) {
                node.spriteFrame = sf
            } else {
                UtilPub._fn_je(Const.resPath.defaultSceneIcons + "icon_default", (sf: SpriteFrame) => {
                    node.spriteFrame = sf
                })
            }
        })
    }
}


