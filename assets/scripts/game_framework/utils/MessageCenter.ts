/**
 * 服务端返回消息处理
 */
import BaseClass from "../base/BaseClass";
import Log from "./Log";
import ObjectPool from "./ObjectPool";
import App from "../App";

export default class MessageCenter extends BaseClass {

    private dict: any;
    private eventVector: Array<MessageVo>;
    private lastRunTime: number;
    private type: number;

    /**
     * 构造函数
     * @param type 0:使用分帧处理 1:及时执行
     */
    public constructor(type: number) {
        super();
        this.type = type;
        this.dict = {};
        this.eventVector = new Array<MessageVo>();
        this.lastRunTime = 0;
    }

    /**
     * 清空处理
     */
    public clear() {
        this.dict = {};
        this.eventVector.splice(0);
    }

    /**
     * 添加消息监听
     * @param type 消息唯一标识
     * @param listener 侦听函数
     * @param listenerObj 侦听函数所属对象
     */
    public addListener(type: string, listener: Function, listenerObj: any): void {
        var arr: Array<any> = this.dict[type];
        if (arr == null) {
            arr = new Array<any>();
            this.dict[type] = arr;
        }

        // 检测是否已经存在
        var i: number = 0;
        var len: number = arr.length;
        for (i; i < len; i++) {
            if (arr[i][0] == listener && arr[i][1] == listenerObj) {
                return;
            }
        }
        arr.push([listener, listenerObj]);
    }

    /**
     * 移除消息监听
     * @param type 消息唯一标识
     * @param listener 侦听函数
     * @param listenerObj 侦听函数所属对象
     */
    public removeListener(type: string, listener: Function, listenerObj: any): void {
        var arr: Array<any> = this.dict[type];
        if (arr == null) {
            return;
        }

        var i: number = 0;
        var len: number = arr.length;
        for (i; i < len; i++) {
            if (arr[i][0] == listener && arr[i][1] == listenerObj) {
                arr.splice(i, 1);
                break;
            }
        }

        if (arr.length == 0) {
            this.dict[type] = null;
            delete this.dict[type];
        }
    }

    /**
     * 移除某一对象的所有监听
     * @param listenerObj 侦听函数所属对象
     */
    public removeAll(listenerObj: any): void {
        var keys = Object.keys(this.dict);
        for (var i: number = 0, len = keys.length; i < len; i++) {
            var type = keys[i];
            var arr: Array<any> = this.dict[type];
            for (var j = 0; j < arr.length; j++) {
                if (arr[j][1] == listenerObj) {
                    arr.splice(j, 1);
                    j--;
                }
            }

            if (arr.length == 0) {
                this.dict[type] = null;
                delete this.dict[type];
            }
        }
    }

    /**
     * 触发消息
     * @param type 消息唯一标识
     * @param param 消息参数
     */
    public dispatch(type: string, ...param: any[]): void {
        if (this.dict[type] == null) {
            return;
        }

        var vo: MessageVo = ObjectPool.pop(MessageVo, "MessageVo");
        vo.type = type;
        vo.param = param;
        if (this.type == 0) {
            this.eventVector.push(vo);
        } else if (this.type == 1) {
            this.dealMsg(vo);
        } else {
            Log.error("MessageCenter未实现的类型");
        }
    }

    /**
     * 运行
     */
    private run(): void {
        var currTime: number = App.DateUtils.now();
        var inSleep: boolean = currTime - this.lastRunTime > 100;
        this.lastRunTime = currTime;
        if (inSleep) {
            while (this.eventVector.length > 0) {
                this.dealMsg(this.eventVector.shift());
            }
        } else {
            while (this.eventVector.length > 0) {
                this.dealMsg(this.eventVector.shift());
                if ((App.DateUtils.now() - currTime) > 5) {
                    break;
                }
            }
        }
    }

    /**
     * 处理一条消息
     * @param msgVo
     */
    private dealMsg(msgVo: MessageVo): void {
        var listeners: Array<any> = this.dict[msgVo.type];
        var i: number = 0;
        var len: number = listeners.length;
        var listener: Array<any> = null;
        while (i < len) {
            listener = listeners[i];
            listener[0].apply(listener[1], msgVo.param);
            if (listeners.length != len) {
                len = listeners.length;
                i--;
            }
            i++;
        }
        msgVo.dispose();
        ObjectPool.push(msgVo);
    }
}

class MessageVo {
    public type: string;
    public param: any[];

    public constructor() {

    }

    public dispose(): void {
        this.type = null
        this.param = null;
    }
}