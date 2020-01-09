import App from "../App";
import BaseClass from "../base/BaseClass";
import Log from "../utils/Log";

export class HttpEvent {
    public static NO_NETWORK: string = "http_request_no_network";               // 断网
    public static UNKNOWN_ERROR: string = "http_request_unknown_error";            // 未知错误
}

export default class HttpRequest extends BaseClass {

    private urls = {};           // 当前请求地址集合
    /**
     * HTTP GET请求
     * 例：
     *
     * Get
     var url = "http://httpbin.org/get?show_env=1";
     var complete = function(response){
               
            cc.log(response);
        }
     var error = function(response){
            cc.log(response);
        }
     game.HttpRequest.get(url, complete, error);
     */
    public get(url, completeCallback, errorCallback) {
        this.sendRequest(url, null, false, completeCallback, errorCallback, "text")
    }

    public getByArraybuffer(url, completeCallback, errorCallback) {
        this.sendRequest(url, null, false, completeCallback, errorCallback, 'arraybuffer');
    }

    public getWithParams(url, params, completeCallback, errorCallback) {
        this.sendRequest(url, params, false, completeCallback, errorCallback, "text")
    }

    public getWithParamsByArraybuffer(url, params, completeCallback, errorCallback) {
        this.sendRequest(url, params, false, completeCallback, errorCallback, 'arraybuffer');
    }


    /**
     * HTTP POST请求
     * 例：
     *
     * Post
     var url = "http://192.168.1.188/api/LoginNew/Login1";
     var param = '{"LoginCode":"donggang_dev","Password":"e10adc3949ba59abbe56e057f20f883e"}'
     var complete = function(response){
                var jsonData = JSON.parse(response);
                var data = JSON.parse(jsonData.Data);
            cc.log(data.Id);
        }
     var error = function(response){
            cc.log(response);
        }
     game.HttpRequest.post(url, param, complete, error);
     */
    public post(url, params, completeCallback, errorCallback) {
        this.sendRequest(url, params, true, completeCallback, errorCallback, "text");
    }

    /**
     * Http请求
     * @param url(string)               请求地址
     * @param params(JSON)              请求参数
     * @param isPost(boolen)            是否为POST方式
     * @param callback(function)        请求成功回调
     * @param errorCallback(function)   请求失败回调
     * @param responseType(string)      响应类型
     */
    sendRequest(url, params, isPost, completeCallback, errorCallback, responseType) {
        if (url == null || url == '')
            return;

        var newUrl;
        if (params) {
            newUrl = url + "?" + this._getParamString(params);
        } else {
            newUrl = url;
        }

        if (this.urls[newUrl] != null) {
            Log.warn(App.StringUtils.Format("地址【{0}】已正在请求中，不能重复请求",url));
            return;
        }

        // 防重复请求功能
        this.urls[newUrl] = true;

        var xhr = cc.loader.getXMLHttpRequest();
        if (isPost) {
            xhr.open("POST", url);
        } else {
            xhr.open("GET", newUrl);
        }

        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onerror = function () {
            delete this.urls[newUrl];
            if (errorCallback == null) return;
            if (xhr.readyState == 1 && xhr.status == 0) {
                errorCallback(HttpEvent.NO_NETWORK);               // 断网
            } else {
                errorCallback(HttpEvent.UNKNOWN_ERROR);            // 未知错误
            }
        }.bind(this);

        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;

            delete this.urls[newUrl];
            if (xhr.status == 200) {
                if (completeCallback) {
                    if (responseType == 'arraybuffer') {
                        xhr.responseType = responseType;
                        completeCallback(xhr.response);                 // 加载非文本格式
                    } else {
                        completeCallback(xhr.responseText);             // 加载文本格式
                    }
                }
            } else {
                if (errorCallback) errorCallback(xhr.status);
            }
        }.bind(this);

        if (params == null || params == "") {
            xhr.send();
        } else {
            xhr.send(JSON.stringify(params));
        }
    }

    /**
     * 获得字符串形式的参数
     */
    _getParamString(params) {
        var result = "";
        for (var name in params) {
            result += App.StringUtils.Format("{0}={1}&", name, params[name]);
        }

        return result.substr(0, result.length - 1);
    }
}