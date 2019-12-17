// import BaseChannel from "../../../game_framework/sdk/base/BaseChannel";
// import DefaultLogin from "../default/DefaultLogin";
// import VivoBannerAd from "./VivoBannerAd";
// import VivoInsertAd from "./VivoInsertAd";
// import VivoRewardAd from "./VivoRewardAd";
//
//
// export default class VivoChannel extends BaseChannel {
//
//
//     constructor(id, bannerID: string, rewardAdID: string, insertAdID: string) {
//         super(id);
//         this.loginMgr = new DefaultLogin();
//         // cc.log(' qg.getSystemInfoSync().platformVersionCode ',qg.getSystemInfoSync().platformVersionCode)
//         if (qg.getSystemInfoSync().platformVersionCode < 1031) {
//             // 不支持广告
//         } else {
//             // 支持广告
//             this.bannerAd = new VivoBannerAd(bannerID)
//             this.interstitialAd = new VivoInsertAd(rewardAdID)
//             this.rewardAd = new VivoRewardAd(insertAdID)
//         }
//     }
//
//     isVideoLvUp() {
//         return true;
//     }
//
//     sevenButtonNum() {
//         return 1;
//     }
//
//     protected vibrateShort() {
//         qg.vibrateShort()
//     }
//
//     isBattleHaveBanner() {
//         return true
//     }
//
//     showShare(title: string, func?: Function) {
//         this.openRewardAd((result) => {
//             if (result) {
//                 func();
//             }
//         })
//     }
// }
