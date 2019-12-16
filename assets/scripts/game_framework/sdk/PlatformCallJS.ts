import SDKManager from "./SDKManager";
import VideoAdInterface from "./base/VideoAdInterface";
import BaseRewardAd from "./base/BaseRewardAd";

class PlatformCallJS {

    rewardAdCallback(num: number) {
        let rewardAd: BaseRewardAd = SDKManager.getChannel().getRewardAd();
        if (rewardAd) {
            rewardAd.callback(num);
        }
    }

    payCallback(productID: string) {

    }
}


export default class Platform {
    constructor() {
        window['PlatformCallJS'] = new PlatformCallJS()
    }
}
