import { Vec2 } from "cc";

export class AStarNode {
    private _x: number = 0;
    private _y: number = 0;
    get x() {return this._x;}
    get y() {return this._y;}




    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }
    priority = 0;
}

export class Frontier {
    private arr: AStarNode[] = [];
    put(node: AStarNode, priority: number) {
        node.priority = priority;
        this.arr.push(node);
        this.arr.sort((a,b)=>b.priority - a.priority);
    }
    get() {
        return this.arr.pop();
    }

    get size() {
        return this.arr.length;
    }
}

export default class AStar {

    private mSize: Vec2 = null!;
    private mStart: Vec2 = null!;
    private mEnd: Vec2 = null!;

    private mStartNode: AStarNode = null!;
    private mEndNode: AStarNode = null!;







    public init(size: Vec2, start: Vec2, end: Vec2, obstacles: Vec2[] = []) {
        this.mSize = size;
        this.mStart = start;
        this.mEnd = end;
        this.obstacles = {};
        obstacles.forEach((ele) => {
            this.setObstacles(ele.x, ele.y);
        });

        this.nodePool = {};

        this.mStartNode  = this.createNode(this.mStart.x, this.mStart.y);
        this.mEndNode    = this.createNode(this.mEnd.x, this.mEnd.y);
    }

    public clean() {
        this.mStartNode = null!;
        this.mEndNode = null!;
    }

    private obstacles: {[x_y: string]: boolean} = {};





    public setObstacles(x: number, y: number) {
        if (!this.checkNode(x, y)) return;
        this.obstacles[`${x}_${y}`] = true;
    }





    public clearObstacles(x: number, y: number) {
        delete this.obstacles[`${x}_${y}`];
    }





    public checkObstacles(x: number, y: number) {
        return this.obstacles[`${x}_${y}`];
    }






    public checkNode(x: number, y: number) {
        return x >= 0 && y >= 0 && x <= this.mSize.x && y <= this.mSize.y;
    }




    private nodePool: {[x_y: string]: AStarNode} = {};

    private frontier: Frontier = null!;

    private cameForm: Map<AStarNode, AStarNode> = new Map();

    private costSoFar: Map<AStarNode, number> = new Map();

    private mType: 4|8  =4;





    public run(type: 4|8 = 4) {
        this.mType = type;










        const start = this.mStartNode;
        const goal = this.mEndNode;
        this.frontier = new Frontier();

        this.frontier.put(start, 0);

        this.cameForm.set(start, null!);
        this.costSoFar.set(start, 0);

        while (this.frontier.size > 0) {
            let curr = this.frontier.get()!;
            if (curr === goal) {
                break;
            }
            for (let next of this.getNeighbors(curr)) {
                const nextCost = this.costSoFar.get(curr)! + this.getCost(curr, next);
                if (!this.costSoFar.has(next) || nextCost < this.costSoFar.get(next)!) {
                    this.costSoFar.set(next, nextCost);
                    const preCost = this.getCost(next, goal);
                    this.frontier.put(next, nextCost + preCost);
                    this.cameForm.set(next, curr);
                }
            }
        }

    }





    getPath() {
        const arr = [];
        let node = this.mEndNode;
        arr.push(node);
        while (this.cameForm.has(node)) {
            node = this.cameForm.get(node)!;
            node && arr.push(node);
        }
        return arr;
    }

    getNeighbors(node: AStarNode) {
        const neighbors = [];

        if (this.mType === 8) {
            const upright = this.getNode(node.x + 1, node.y + 1);
            upright && neighbors.push(upright);

            const upleft = this.getNode(node.x - 1, node.y + 1);
            upleft && neighbors.push(upleft);

            const downleft = this.getNode(node.x - 1, node.y - 1);
            downleft && neighbors.push(downleft);

            const downright = this.getNode(node.x + 1, node.y - 1);
            downright && neighbors.push(downright);
        }

        const up = this.getNode(node.x, node.y + 1);
        up && neighbors.push(up);

        const down = this.getNode(node.x, node.y - 1);
        down && neighbors.push(down);

        const left = this.getNode(node.x - 1, node.y);
        left && neighbors.push(left);

        const right = this.getNode(node.x + 1, node.y);
        right && neighbors.push(right);

        return neighbors;
    }

    getCost(node1: AStarNode, node2: AStarNode) {
        return Vec2.distance(new Vec2(node1.x, node1.y), new Vec2(node2.x, node2.y));
    }


    public next() {

    }

    private getNode(x: number, y: number): AStarNode {
        if (!this.checkNode(x, y)) return null!;
        if (this.checkObstacles(x, y)) return null!;
        const key = this.getNodeKey(x, y);
        return this.nodePool[key] || this.createNode(x, y);
    }
    private createNode(x: number, y: number) {
        const key = this.getNodeKey(x, y);
        this.nodePool[key] = new AStarNode(x, y);
        return this.nodePool[key];
    }

    private getNodeKey(x: number, y: number) {
        return `${x}_${y}`;
    }
}
