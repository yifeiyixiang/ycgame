import { _decorator, Component, error, warn, Node } from 'cc';
import { ZcEndpointConfig } from './ZCConfig';
import { NativeSdkBridge } from '../AndroidSdk';
const { ccclass, property } = _decorator;

type HttpCallback = (responsePacket: HttpResponsePacket) => void;

var activeRequestMap:any = {};
var requestParamCache:any = {};


export enum HttpEvent {
    NO_NETWORK = "http_request_no_network",

    UNKNOWN_ERROR = "http_request_unknown_error",

    TIMEOUT = "http_request_timout"
}

export class HttpResponsePacket {

    isSucc: boolean = false;

    res?: any;

    err?: any;
}

export class HttpRequestTransport {

    defaultUrl: string = "https://app.petlove.top"

    h5defaultUrl:string =  "http://localhost:9991/"

    timeout:number = 10000;

    private header: Map<string, string> = new Map<string, string>();

    constructor() {

        this.timeout = ZcEndpointConfig.httpServerTimeout;
    }






    addHeader(name:string, value:string) {
        this.header.set(name, value);
    }

    getHeader(name:string):string {
        return this.header.get(name);
    }

    isHeader(name:string):boolean {
        return this.header.has(name);
    }

    get(name:string, onComplete:HttpCallback, requestParams:any = null) {
        this.sendRequest(name, requestParams, false, onComplete)
    }

    getAsync(name:string, requestParams:any = null): Promise<HttpResponsePacket> {
        return new Promise((resolve, reject) => {
            this.sendRequest(name, requestParams, false, (responsePacket:HttpResponsePacket) => {
                resolve(responsePacket);
            });
        });
    }

    getByArraybuffer(name:string, onComplete:HttpCallback, requestParams:any = null) {
        this.sendRequest(name, requestParams, false, onComplete, 'arraybuffer', false);
    }

    getAsyncByArraybuffer(name:string, requestParams:any = null): Promise<HttpResponsePacket> {
        return new Promise((resolve, reject) => {
            this.sendRequest(name, requestParams, false, (responsePacket:HttpResponsePacket) => {
                resolve(responsePacket);
            }, 'arraybuffer', false);
        });
    }

    post(name:string, onComplete:HttpCallback, requestParams:any = null) {
        this.sendRequest(name, requestParams, true, onComplete);
    }









    postAsync(name:string, requestParams:any = null): Promise<HttpResponsePacket> {
        return new Promise((resolve, reject) => {
            this.sendRequest(name, requestParams, true, (responsePacket: HttpResponsePacket) => {
                resolve(responsePacket);
            });
        });
    }





    abort(name:string) {
        var activeRequest = activeRequestMap[this.defaultUrl + name];
        if (activeRequest) {
            activeRequest.abort();
        }
    }












    private sendRequest(name:string, requestParams:any, isPost:boolean, onComplete:HttpCallback, responseType?:string, isOpenTimeout:boolean = true):void {
        if (NativeSdkBridge.isLocal){
            return;
        }
        if (name == null || name == '') {
            return ;
        }


        var url:string;


        var requestUrl:string;

        var queryString:string = "";

        if (name.toLocaleLowerCase().indexOf("http") == 0) {
            url = name;
        } else {
            url = this.defaultUrl + name;
        }
        if (requestParams) {
            queryString = this.getParamString(requestParams);
            if (url.indexOf("?") > -1) {
                requestUrl = url + "&" + queryString;
            } else {
                requestUrl = url + "?" + queryString;
            }
        } else {
            requestUrl = url;
        }
        console.log("RequestUrl:" + requestUrl);
        if (activeRequestMap[requestUrl] != null && requestParamCache[requestUrl] == queryString) {
            warn(`地址[${url}]已正在请求中，不能重复请求`);
            return ;
        }

        var request = new XMLHttpRequest();

        activeRequestMap[requestUrl] = request;
        requestParamCache[requestUrl] = queryString;

        if (isPost) {
            request.open("POST", url);
        } else {
            request.open("GET", requestUrl);
        }

        for (const [key, value] of this.header) {
            request.setRequestHeader(key, value);
        }








        var requestContext:any = {};
        requestContext.url = url;
        requestContext.params = requestParams;

        var responsePacket: HttpResponsePacket = new HttpResponsePacket();
        if (isOpenTimeout) {
            request.timeout = this.timeout;
            request.ontimeout = () => {
                this.deleteCache(requestUrl);

                responsePacket.isSucc = false;
                responsePacket.err = HttpEvent.TIMEOUT;
                onComplete(requestContext);
            }
        }

        request.onloadend = () => {
            if (request.status == 500) {
                this.deleteCache(requestUrl);

                responsePacket.isSucc = false;
                responsePacket.err = HttpEvent.NO_NETWORK;
                onComplete(responsePacket);
            }
        }

        request.onerror = () => {
            this.deleteCache(requestUrl);
            console.log("断网------------------" + request);
            responsePacket.isSucc = false;
            if (request.readyState == 0 || request.readyState == 1 || request.status == 0) {
                responsePacket.err = HttpEvent.NO_NETWORK;
            } else {
                responsePacket.err = HttpEvent.UNKNOWN_ERROR;
            }
            onComplete(responsePacket);
        }

        request.onreadystatechange = () => {
            if (request.readyState != 4) return ;

            this.deleteCache(requestUrl);

            if (request.status == 200 && onComplete) {
                responsePacket.isSucc = true;
                if (responseType == 'arraybuffer') {
                    request.responseType = responseType;
                    responsePacket.res = request.response;
                } else {
                    responsePacket.res = JSON.parse(request.response);
                }
                onComplete(responsePacket);
                console.log(name + ":   ", responsePacket.res)
            }
        }

        if (requestParams == null || requestParams == "") {
            request.send();
        } else {
            if (isPost) {
                if (NativeSdkBridge.isAndroid){
                    request.send(this.getParamBodyAndroid(requestParams));
                }else{


                    request.send(JSON.stringify(requestParams));
                }
            } else {
                request.send(queryString);
            }
        }
    }









    private getParamString(requestParams:any): string {
        var queryString = "";
        for (var paramName in requestParams) {
            let paramValue = requestParams[paramName];
            if (paramValue instanceof Object) {
                for (var nestedKey in paramValue) {
                    queryString += `${nestedKey}=${paramValue[nestedKey]}&`;
                }
            } else {
                queryString += `${paramName}=${paramValue}&`;
            }
        }

        return queryString.substring(0, queryString.length - 1);
    }

    private getParamBodyAndroid(requestParams: any): string {
        let formBody = '';
        for (let paramName in requestParams) {
            if (formBody !== '') {
                formBody += '&';
            }
            let paramValue = requestParams[paramName];
            formBody += encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
        }
        return formBody;
    }

    private getParamBody(requestParams:any):FormData {
        if (!requestParams){
            return;
        }
        var formData = new FormData();
        for (var paramName in requestParams) {
            let paramValue = requestParams[paramName];
            formData.append(paramName, String(paramValue));
        }

        return formData;
    }

    private deleteCache(url:string) {
        delete activeRequestMap[url];
        delete requestParamCache[url];
    }
}

