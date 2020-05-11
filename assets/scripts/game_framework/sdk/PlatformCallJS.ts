import BaseRewardAd from "./base/BaseRewardAd";
import App from "../App";
import BaseChannel from "./base/BaseChannel";

class PlatformCallJS {

    loginCallback(err: string, data: any)
    {
        let channel: BaseChannel = App.SDK.getChannel();
        if (channel) {
            channel.getLoginMgr().loginCallback(err,data);
        }
    }

    logoutCallback(result:boolean)
    {
        let channel: BaseChannel = App.SDK.getChannel();
        if (channel) {
            channel.getLoginMgr().logoutCallback(result);
        }
    }

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
