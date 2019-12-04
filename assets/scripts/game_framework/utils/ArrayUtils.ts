/**
 * Created by egret on 15-8-7.
 */
import BaseClass from "../base/BaseClass";

export default class ArrayUtils extends BaseClass {

    /**
     * 遍历操作
     * @param arr
     * @param func
     */
    public forEach(arr: Array<any>, func: Function, funcObj: any): void {
        for (var i: number = 0, len: number = arr.length; i < len; i++) {
            func.apply(funcObj, [arr[i]]);
        }
    }

    /**
     * 根据键检索值
     * @param obj 要遍历的对象
     * @param keyName 键名
     * @return any 值
     */
    public searchByKey(obj: any, keyName: string): any {
        for (let prop of Object.keys(obj)) {
            if (prop == keyName) {
                return obj[keyName];
            }
        }
        return null;
    }
}