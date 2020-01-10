import BaseRewardAd from "../../../game_framework/sdk/base/BaseRewardAd";
import JsNativeBridge from "../../../game_framework/utils/JsNativeBridge";


export default class GoogleAppVideoAd extends BaseRewardAd {

    createVideoAd(id: string): void {

    }

    private func: Function = null;


    callback(num: number) {
        cc.log(' GoogleAppVideoAd callback ', num)
        if (this.func) {
            this.func(num);
        }
    }

    show(func: Function): void {
        cc.log('GoogleAppVideoAd ======= show  ')
        this.func = func;
        let className = 'org/cocos2dx/javascript/AppActivity'
        let methodName = 'showRewardAd'
        let sign = '(I)V'
        JsNativeBridge.callStaticMethod(className, methodName, 1, sign)
    }

    isLoad(): boolean {
        return true;
    }

}
