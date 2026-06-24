import { _decorator, Component, Node } from 'cc';
import { HttpRequestTransport } from './ZCHttpRequest';

const { ccclass, property } = _decorator;

export class ZcApiGateway {
    public static instance:ZcApiGateway = null;

    public static getInstance():ZcApiGateway{
        if (this.instance === null) {
            this.instance = new ZcApiGateway();
        }

        return this.instance;
    }

    public static http:HttpRequestTransport = new HttpRequestTransport();
}