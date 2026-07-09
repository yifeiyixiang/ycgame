import { isValid, Node, UIRenderer, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RenderChildBatch')
export class RenderChildBatch extends UIRenderer {

    private pathArr: string[] = [];
    private path2RenderArr: Map<string, UIRenderer[]> = new Map();

    private rootNodeArr: Node[] = [];


    public _fn_o(node: Node) {
        if (this.rootNodeArr.indexOf(node) == -1) {
            this._fn_wu(node, "");
            this.rootNodeArr.push(node);
        }
    }

    private _fn_wu(node: Node, rootPath: string) {
        if (!node || !isValid(node)) {
            return ;
        }

        let path = rootPath + node.name;
        let renderable = node.getComponent(UIRenderer);
        if (renderable) {
            if (this.pathArr.indexOf(path) == -1) {
                this.pathArr.push(path);
            }
            let renderArr = this.path2RenderArr.get(path);
            if (!renderArr) {
                renderArr = [];
                this.path2RenderArr.set(path, renderArr);
            }
            if (renderArr.indexOf(renderable) == -1) {
                if (!renderable._realRender) {
                    renderable._realRender = renderable._render;
                    renderable._render = function () { };
                }
                renderArr.push(renderable);
            }
        }

        node.children.forEach((child: Node) => {
            this._fn_wu(child, path + "/");
        });
    }


    public _fn_aak(node: Node) {
        this._fn_aaj(node, "");
        let index = this.rootNodeArr.indexOf(node);
        if (index >= 0) {
            this.rootNodeArr.splice(index, 1);
        }
    }

    private _fn_aaj(node: Node, rootPath: string) {
        if (!node || !isValid(node)) {
            return ;
        }
        let path = rootPath + node.name;
        let arr = this.path2RenderArr.get(path);
        if (arr) {
            let renderable = node.getComponent(UIRenderer);
            if (renderable) {
                if (renderable._realRender) {
                    renderable._render = renderable._realRender;
                    delete renderable._realRender;
                }
                let index = arr.indexOf(renderable);
                if (index != -1) {
                    arr.splice(index, 1);
                }
            }
        }
        node.children.forEach((child: Node) => {
            this._fn_aaj(child, path + "/");
        });
    }


    _fn_ajk(batch: any) {

    }


    _fn_xk(batch: any) {
        this.pathArr.forEach((path: string) => {
            let arr = this.path2RenderArr.get(path);
            let tmpArr = [];
            arr.forEach((renderable: UIRenderer) => {

                if (!renderable || !isValid(renderable)||!renderable.node || !isValid(renderable.node)) {
                    return ;
                }

                tmpArr.push(renderable);
                if (!renderable.node.activeInHierarchy) {
                    return;
                }
                if (renderable._renderFlag && renderable._assembler) {
                    renderable._realRender(batch);
                }
            });
            this.path2RenderArr.set(path, tmpArr);
        });
    }


    onDestroy() {
        this.pathArr.forEach((path: string) => {
            let arr = this.path2RenderArr.get(path);
            arr.forEach((renderable: UIRenderer) => {
                if (!renderable || !isValid(renderable)) {
                    return ;
                }
                if (renderable._realRender) {
                    renderable._render = renderable._realRender;
                    delete renderable._realRender;
                }
            });
        });
        this.path2RenderArr = undefined!;
        this.pathArr = undefined!;
        this.rootNodeArr = undefined!;
    }

}

