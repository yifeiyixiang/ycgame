import { Component, find, game, instantiate, isValid, Layout, Node, ScrollView, tween, UITransform, v3, _decorator } from 'cc';
import { RenderChildBatch } from './RenderChildBatch';
const { ccclass, property } = _decorator;

@ccclass('ScrollViewUtil')
export class ScrollViewUtil extends Component {

    @property({ type: Boolean, tooltip: "排序" }) reIndex: Boolean = false!;


    scrollView: ScrollView = null!;
    vertical: boolean = true;
    gapX: number = 0;
    gapY: number = 0;
    paddingLeft: number = 0;
    paddingRight: number = 0;
    paddingTop: number = 0;
    paddingBottom: number = 0;
    contentNode: Node = null!;
    contentTransform: UITransform = null!;

    viewNode: Node = null!;
    viewWidth: number = 0;
    viewHeight: number = 0;
    viewTransform: UITransform = null!;

    itemUI: Node = null!;
    itemUITransform: UITransform = null!;
    itemUIWidth: number = 0;
    itemUIHeight: number = 0;

    itemUIFreeArr: any = [];

    startPosX: number = 0;
    startPosY: number = 0;


    viewNum: number = 0;

    changeNum: number = 1;

    maxLines: number = 1;


    frameUpdateArr: any = [];

    frameTime: number = Math.floor(1000 / (game.getFrameRate() + 10));

    itemArr: any = [];
    refreshItemFunc: Function = null!;

    itemTween: boolean = false;
    setDataFlag: boolean = false;



    startIndex: number = 0;

    stopIndex: number = 0;

    private renderChildBatch: RenderChildBatch = null!;

    onLoad() {
        this.scrollView = this.node.getComponent(ScrollView)!;
        this.contentNode = this.scrollView.content!;

        this.itemUI = this.contentNode.children[0];
        if (!this.itemUI) {

        }
        this.itemUITransform = this.itemUI.getComponent(UITransform)!;
        this.itemUIWidth = this.itemUITransform.width;
        this.itemUIHeight = this.itemUITransform.height;


        this.vertical = this.scrollView.vertical;
        let contentLayout = this.contentNode.getComponent(Layout);
        this.gapX = contentLayout!.spacingX;
        this.gapY = contentLayout!.spacingY;
        this.paddingLeft = contentLayout!.paddingLeft;
        this.paddingRight = contentLayout!.paddingRight;
        this.paddingTop = contentLayout!.paddingTop;
        this.paddingBottom = contentLayout!.paddingBottom;
        contentLayout!.enabled = false;
        this.contentTransform = this.contentNode.getComponent(UITransform)!;

        let contentWidth = this.contentTransform.width;
        let contentHeight = this.contentTransform.height;

        this.viewNode = find("view", this.node)!;
        this.viewTransform = this.viewNode.getComponent(UITransform)!;
        this.viewWidth = this.viewTransform.width;
        this.viewHeight = this.viewTransform.height;

        this.itemUIFreeArr = [];
        this.contentNode.children.forEach((node: Node) => {
            node.active = false;
            this.itemUIFreeArr.push(node);
        });

        if (this.vertical) {
            this.viewTransform.anchorX = 0.5;
            this.viewTransform.anchorY = 1;
            this.contentTransform.anchorX = 0.5;
            this.contentTransform.anchorY = 1;
            this.viewNum = Math.ceil(this.viewHeight / (this.itemUIHeight + this.gapY)) + 1;
            this.changeNum = Math.floor((contentWidth + this.gapX - this.paddingLeft - this.paddingRight) / (this.itemUIWidth + this.gapX));
        } else {
            this.viewTransform.anchorX = 0;
            this.viewTransform.anchorY = 0.5;
            this.contentTransform.anchorX = 0;
            this.contentTransform.anchorY = 0.5;
            this.viewNum = Math.ceil(this.viewWidth / (this.itemUIWidth + this.gapX)) + 1;
            this.changeNum = Math.floor((contentHeight + this.gapY - this.paddingTop - this.paddingBottom) / (this.itemUIHeight + this.gapY));
        }
        if (this.changeNum < 1) {
            this.changeNum = 1;
        }


        this.startPosX = this.itemUIWidth * this.itemUITransform.anchorX - this.contentTransform.width * this.contentTransform.anchorX + this.paddingLeft;
        this.startPosY = contentHeight * (1 - this.contentTransform.anchorY) - this.itemUIHeight * (1 - this.itemUITransform.anchorY) - this.paddingTop;


        this.node.on('scrolling', this._fn_vh, this);


        this.frameUpdateArr = [];

        this._fn_n();
    }

    public _fn_n() {
        if (this.renderChildBatch) {
            return;
        }

    }


    _fn_vh() {
        if (this.itemArr.length <= 0) {
            return;
        }

        let start = 0;

        if (this.vertical) {
            let posY = this.contentNode.getPosition().y;
            if (posY > this.contentTransform.height - this.viewHeight) {
                posY = this.contentTransform.height - this.viewHeight;
            }
            if (posY < 0) {
                posY = 0;
            }

            start = Math.floor((posY + this.gapY - this.paddingTop) / (this.itemUIHeight + this.gapY));
        } else {

            let posX = this.contentNode.getPosition().x;
            if (posX < this.viewWidth - this.contentTransform.width) {
                posX = this.viewWidth - this.contentTransform.width;
            }
            if (posX > 0) {
                posX = 0;
            }
            posX = Math.abs(posX);

            start = Math.floor((posX + this.gapX - this.paddingLeft) / (this.itemUIWidth + this.gapX));
        }

        if (start < 0) {
            start = 0;
        }
        if (start > this.maxLines - 1) {
            start = this.maxLines - 1;
        }


        let stop = start + this.viewNum;
        if (stop > this.maxLines - 1) {
            stop = this.maxLines - 1;
        }



        if (start != this.startIndex || stop != this.stopIndex) {
            this.startIndex = start;
            this.stopIndex = stop;
            this._fn_aam();
        }
    }


    _fn_aam() {
        let item = null;

        let hideIndex = this.startIndex * this.changeNum;
        for (let i = 0; i < hideIndex; i++) {
            item = this.itemArr[i];
            this._fn_yq(item);
        }

        hideIndex = (this.stopIndex + 1) * this.changeNum;
        for (let i = hideIndex; i < this.itemArr.length; i++) {
            item = this.itemArr[i];
            this._fn_yq(item);
        }
        let isupdate = false

        for (let i = this.startIndex; i <= this.stopIndex; i++) {
            let startIndex = i * this.changeNum;
            let stopIndex = startIndex + this.changeNum;
            for (let k = startIndex; k < stopIndex; k++) {
                if (!this.itemArr[k]) {
                    continue;
                }
                item = this.itemArr[k];
                if (item.node) {

                    continue;
                }

                item.needUpdate = true;
                isupdate = true
                this.frameUpdateArr.push(item);
            }
        }
        this._fn_aih();
        if (isupdate && this.reIndex)
            this.updateItemZindex()
    }


    _fn_dv() {
        let node = null;
        if (this.itemUIFreeArr.length > 0) {
            node = this.itemUIFreeArr.shift();
        } else {
            node = instantiate(this.itemUI);
        }
        node.parent = this.contentNode;

        if (this.renderChildBatch) {
            this.renderChildBatch._fn_o(node);
        }

        return node;
    }

    _fn_aih() {
        let startTime = new Date().getTime();
        while (true) {
            if (!this.frameUpdateArr || this.frameUpdateArr.length <= 0) {
                this.setDataFlag = false;
                break;
            }

            let item = this.frameUpdateArr.shift();
            if (!item.needUpdate) {
                continue;
            }

            if (!item.node) {
                item.node = this._fn_dv();
            }
            if (!item.node.active) {
                item.node.active = true;
            }
            item.node.setPosition(item.x, item.y);

            item.node.item = item.data;
            item.node.index = item.index;
            item.node.scale = v3(1, 1, 1);
            if (item.node.showTween) {
                item.node.showTween.stop();
                item.node.showTween = undefined;
            }
            this.refreshItemFunc(item.node, item.data, item.index);

            if (this.itemTween && this.setDataFlag) {
                item.node.setScale(0, 0, 1);
                let tn = tween(item.node).to(0.2, { scale: v3(1.2, 1.2, 1) }).to(0.1, { scale: v3(1, 1, 1) }).call(() => {
                    item.node.showTween = undefined;
                }).start();
                item.node.showTween = tn;
                this.scheduleOnce(() => {
                    this._fn_aih();
                }, 0.05);
                break;
            } else {
                if (new Date().getTime() - startTime >= this.frameTime) {

                    this.scheduleOnce(this._fn_aih.bind(this));
                    break;
                }
            }
        }
    }


    _fn_yq(item: any) {
        if (item.node && isValid(item.node)) {
            if (this.itemUIFreeArr.indexOf(item.node) == -1) {
                this.itemUIFreeArr.push(item.node);
            }
            item.node.active = false;
            item.node.showTween = undefined;
            item.node = null;
            item.needUpdate = undefined;
        }
    }


    _fn_cs() {
        for (let item of this.itemArr) {
            this._fn_yq(item);
        }
    }


    _fn_oc(data: any, index: number) {
        let item = {
            node: null,
            data: data,
            index: index,
            x: 0,
            y: 0
        };

        return item;
    }

    _fn_zg(item: any, index: number) {
        item.index = index;
        if (item.node) {
            item.node.index = index;
        }
    }

    setData(dataArr: any, refreshItemFunc: Function, resetPos: boolean = true, itemTween: boolean = false) {
        if (!this.scrollView) {
            return;
        }
        let contentLayout = this.contentNode.getComponent(Layout);
        this.gapX = contentLayout!.spacingX;
        this.gapY = contentLayout!.spacingY;

        this.itemTween = itemTween;
        this.setDataFlag = true;

        this.frameUpdateArr = [];
        this.unscheduleAllCallbacks();

        this._fn_cs();
        this.itemArr = [];

        if (!dataArr) {
            dataArr = [];
        }

        this.refreshItemFunc = refreshItemFunc;
        for (let i = 0; i < dataArr.length; i++) {
            let data = dataArr[i];
            let item = this._fn_oc(data, i);
            this.itemArr.push(item);
        }

        this.maxLines = Math.ceil(this.itemArr.length / this.changeNum);
        if (this.maxLines < 1) {
            this.maxLines = 1;
        }

        this._fn_zf(0, resetPos);
    }


    _fn_rc(start: number) {
        if (this.itemArr.length <= 0) {
            return;
        }

        for (let index = start; index < this.itemArr.length; index++) {
            let line = Math.floor(index / this.changeNum);
            let line2 = index % this.changeNum;
            let item = this.itemArr[index];
            if (this.vertical) {
                item.x = this.startPosX + line2 * (this.itemUIWidth + this.gapX);
                item.y = this.startPosY - line * (this.itemUIHeight + this.gapY);
            } else {
                item.x = this.startPosX + line * (this.itemUIWidth + this.gapX);
                item.y = this.startPosY - line2 * (this.itemUIHeight + this.gapY);
            }
        }
    }


    _fn_abs() {
        if (!this.contentNode || !this.itemUI) {
            return;
        }
        if (this.itemArr.length <= 0) {
            this.contentTransform.width = 0;
            this.contentTransform.height = 0;
            return;
        }
        let lastItem = this.itemArr[this.itemArr.length - 1];
        if (this.vertical) {
            let height = -lastItem.y + this.itemUIHeight * this.itemUITransform.anchorY;
            this.contentTransform.height = height + this.paddingBottom;
        } else {
            let width = lastItem.x + this.itemUIWidth * (1 - this.itemUITransform.anchorX);
            this.contentTransform.width = width + this.paddingRight;
        }
    }


    _fn_abt() {
        if (!this.contentNode || !this.itemUI) {
            return;
        }
        if (this.itemArr.length <= 0) {
            this.contentTransform.width = 0;
            this.contentTransform.height = 0;
            return;
        }
        let lastItem = this.itemArr[this.itemArr.length - 1];
        if (this.vertical) {
            let height = 0
            for (let index = 0; index < this.itemArr.length; index++) {
                height += this.itemArr[index].height + this.gapY
            }
            this.contentTransform.height = height
        } else {
            let width = lastItem.x + this.itemUIWidth * (1 - this.itemUITransform.anchorX);
            this.contentTransform.width = width + this.paddingRight;
        }
    }


    _fn_zf(start: number, resetPos: boolean = true) {
        if (!this.scrollView) {
            return;
        }

        this._fn_rc(start);
        this._fn_abs();

        this.startIndex = -1;
        this.stopIndex = -1;

        this.scrollView.stopAutoScroll();
        let maxOffset = this.scrollView.getMaxScrollOffset();
        let offset = this.scrollView.getScrollOffset();
        if (this.vertical) {
            let posY = 0;
            if (!resetPos) {
                posY = this.contentNode.getPosition().y;
                if (posY > maxOffset.y) {
                    posY = maxOffset.y;
                }
                if (posY < 0) {
                    posY = 0;
                }
            }
            offset.y = posY;
            this.scrollView.scrollToOffset(offset, 0);
        } else {
            let posX = 0;
            if (!resetPos) {
                posX = Math.abs(this.contentNode.getPosition().x);
                if (posX > Math.abs(maxOffset.x)) {
                    posX = Math.abs(maxOffset.x);
                }
                if (posX < 0) {
                    posX = 0;
                }
            }
            offset.x = -posX;
            this.scrollView.scrollToOffset(offset, 0);
        }

        this._fn_vh();
    }


    refreshList() {
        if (!this.refreshItemFunc) {
            return;
        }
        this.itemArr.forEach((item: any) => {
            if (!item.node) {
                return;
            }
            this.refreshItemFunc(item.node, item.data, item.index);
        });
    }


    _fn_aag(index: number, resetPos: boolean = false) {
        if (index < 0 || index >= this.itemArr.length) {
            console.log("无效的index", index);
            return;
        }
        let item = this.itemArr[index];
        if (!item || !this.refreshItemFunc) {
            return;
        }

        this.itemArr.splice(index, 1);
        this._fn_yq(item);


        for (let i = index; i < this.itemArr.length; i++) {
            let item = this.itemArr[i];
            this._fn_zg(item, i);
        }
        this.maxLines = Math.ceil(this.itemArr.length / this.changeNum);
        if (this.maxLines < 1) {
            this.maxLines = 1;
        }
        this._fn_zf(index, resetPos);
    }


    refreshIndex(index: number, data?: any) {
        if (index == undefined || index < 0 || index >= this.itemArr.length) {
            console.log("无效的index", index);
            return;
        }
        let item = this.itemArr[index];
        if (!item) {
            return;
        }
        if (data != undefined) {
            item.data = data;
        }
        if (item.node) {
            item.node.item = item.data;
            if (this.refreshItemFunc) {
                this.refreshItemFunc(item.node, item.data, index);
            }
        }
    }


    _fn_pm(index: number, arr: any, resetPos: boolean = false) {
        if (!arr || arr.length == 0) {
            console.log("没有要添加的数据");
            return;
        }
        if (index < 0 || index > this.itemArr.length) {
            console.log("无效的index", index);
            return;
        }
        if (!this.refreshItemFunc) {
            console.log("首次请调用setData方法");
            return;
        }

        for (let i = 0; i < arr.length; i++) {
            let pIndex = index + i;
            let item = this._fn_oc(arr[i], pIndex);
            this.itemArr.splice(pIndex, 0, item);
        }
        for (let i = index + arr.length; i < this.itemArr.length; i++) {
            let item = this.itemArr[i];
            this._fn_zg(item, i);
        }

        this.maxLines = Math.ceil(this.itemArr.length / this.changeNum);
        if (this.maxLines < 1) {
            this.maxLines = 1;
        }

        this._fn_zf(index, resetPos);

    }


    _fn_xt(arr: any, resetPos: boolean = false) {
        this._fn_pm(this.itemArr.length, arr, resetPos);
    }


    _fn_qu() {
        let maxOffset = this.scrollView.getMaxScrollOffset();
        let offset = this.scrollView.getScrollOffset();
        if (Math.abs(maxOffset.x - offset.x) <= 10 && Math.abs(maxOffset.y - offset.y) <= 10) {
            return true;
        }

        return false;
    }


    scrollToEnd(time?: number) {
        this.scrollView.stopAutoScroll();
        if (time == undefined || time < 0) {
            time = 0.5;
        }
        if (this.vertical) {
            this.scrollView.scrollToBottom(time);
        } else {
            this.scrollView.scrollToRight(time);
        }
    }


    scrollToIndex(index: number, time?: number) {
        if (time == undefined || time < 0) {
            time = 0;
        }
        if (index < 0) {
            return;
        }
        if (index >= this.itemArr.length) {
            index = this.itemArr.length - 1;
        }
        let item = this.itemArr[index];
        if (!item) {
            return;
        }

        this.scrollView.stopAutoScroll();
        let maxOffset = this.scrollView.getMaxScrollOffset();
        let offset = this.scrollView.getScrollOffset();
        if (this.vertical) {
            let dy = Math.abs(item.y) + this.itemUIHeight - this.viewHeight;
            if (dy < 0) {
                dy = 0;
            }
            if (dy > maxOffset.y) {
                dy = maxOffset.y;
            }
            offset.y = dy;
            this.scrollView.scrollToOffset(offset, time);
        } else {
            let dx = Math.abs(item.x) + this.itemUIWidth - this.viewWidth;
            if (dx < 0) {
                dx = 0;
            }
            if (dx > Math.abs(maxOffset.x)) {
                dx = Math.abs(maxOffset.x);
            }
            offset.x = -dx;
            this.scrollView.scrollToOffset(offset, time);
        }
        this._fn_vh();
    }

    onDestroy() {
        this.itemUIFreeArr = [];
        this.itemArr = [];
        this.frameUpdateArr = [];
        this.refreshItemFunc = null!;
        this.node.off("scrolling", this._fn_vh, this);
        this.unscheduleAllCallbacks();
    }

    updateItemZindex() {

        for (let index = this.itemArr.length - 1; index > 0; index--) {
            const element = this.itemArr[index];
            if (element.node) {
                element.node.removeFromParent()
                element.node.parent = this.contentNode
            }
        }

    }
}

