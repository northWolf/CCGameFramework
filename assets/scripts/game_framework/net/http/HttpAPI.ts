import BaseClass from "../../base/BaseClass";
import {isNull} from "../../utils/GlobalDefine";
/**
 * 简单Http请求
 */
export default class HttpAPI extends BaseClass {

    public constructor() {
        super();
    }

    /**
     * HTTP GET
     * @param path          请求路径
     * @param param         参数列表
     * @param onComplete    请求成功回调
     * @param onIOError     请求失败回调
     * @param thisObj       this目标
     */
    public httpGET(path: string, data?: any, onComplete?: (response?: string) => void, onIOError?: (response?: string) => void, thisObj?: any): void {
        let encodedData = encodeURI(this.encode(data));
        let url: string = data ? `${path}?${encodedData}` : path;
        let request: XMLHttpRequest = new XMLHttpRequest();
        request.setRequestHeader('Access-Control-Allow-Origin', '*');
        request.responseType = "text";
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                var response = request.responseText;
                if (onComplete)
                    onComplete(response);
            } else {
                onIOError();
            }
        };

        request.open("GET", url, true);
        request.send();
    }

    /**
     * HTTP POST
     * @param path          请求路径
     * @param param         参数列表
     * @param onComplete    请求成功回调
     * @param onIOError     请求失败回调
     * @param thisObj       this目标
     */
    public httpPOST(path: string, data?: any, onComplete?: (response?: string) => void, onIOError?: (response?: string) => void, thisObj?: any): void {
        let encodedData = encodeURI(this.encode(data));
        let request: XMLHttpRequest = new XMLHttpRequest();
        request.responseType = "text";
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                var response = request.responseText;
                if (onComplete)
                    onComplete(response);
            } else {
                onIOError();
            }
        };
        request.open("POST", path, true);
        request.send(encodedData);
    }

    public encode(data: any): string {
        if (!data) return null;
        let paramURL: string = '';
        for (let key in data) {
            paramURL += `${key}=${data[key]}&`
        }
        if (paramURL.length > 1) {
            return `${paramURL.substring(0, paramURL.length - 1)}`
        }
        paramURL = escape(encodeURI(paramURL));
        return paramURL;
    }

    public decode(paramURL: string): any {
        var data = {};
        if (isNull(paramURL)) {
            return data;
        }
        var name, value;
        paramURL = unescape(decodeURI(paramURL));
        var indexOfParamStart = paramURL.indexOf("?");
        paramURL = paramURL.substr(indexOfParamStart + 1); //取得所有参数   stringvar.substr(start [, length ]

        var arr = paramURL.split("&"); //各个参数放到数组里
        for (var i = 0; i < arr.length; i++) {
            indexOfParamStart = arr[i].indexOf("=");
            if (indexOfParamStart > 0) {
                name = arr[i].substring(0, indexOfParamStart);
                value = arr[i].substr(indexOfParamStart + 1);
                data[name] = value;
            }
        }
        return data;
    }
}
