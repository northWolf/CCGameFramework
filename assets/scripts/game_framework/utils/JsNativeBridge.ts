import Log from "./Log";
import App from "../App";

/**
 *
 */
export default class JsNativeBridge {

    /**
     *  反射调用原生静态方法
     * @param className 安卓是全路径类名，iOS是类名即可
     * @param methodName iOS需要是完整的方法名 callNativeUIWithTitle:andContent:
     * @param parameters 0个或任意多个参数
     * @param methodSignature 方法签名正是用来帮助区分这些相同名字的方法(重载方法）
     * ()V，它表示一个没有参数没有返回值的方法
     * (I)V 表示参数为一个int，没有返回值的方法
     * (Ljava/lang/String;)I 表示参数为一个string，返回值为int的方法
     * (IF)Z 表示参数为一个int和一个float，返回值为boolean的方法
     */
    static callStaticMethod(className: string, methodName: string, parameters:any, methodSignature?: string) {
        if (!App.DeviceUtils.IsNative) {
            return -1;
        }
        Log.info(" JsNativeBridge callStaticMethod = ", methodName, " parameters = ", parameters);
        if (cc.sys.os == cc.sys.OS_IOS) {
            let result = jsb.reflection.callStaticMethod(className, methodName, parameters);
            if (result) {
                Log.info("callStaticMethod ios result = ", result);
            }
        } else {
            let result = jsb.reflection.callStaticMethod(className, methodName, methodSignature, parameters)
            if (result) {
                Log.info("callStaticMethod android result =  ", result);
                return result;
            }
        }
    }
}

