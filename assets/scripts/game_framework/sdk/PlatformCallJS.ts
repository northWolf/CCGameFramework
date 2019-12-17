import BaseRewardAd from "./base/BaseRewardAd";
import App from "../App";

class PlatformCallJS {

    rewardAdCallback(num: number) {
        let rewardAd: BaseRewardAd = App.SDK.getChannel().getRewardAd();
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
