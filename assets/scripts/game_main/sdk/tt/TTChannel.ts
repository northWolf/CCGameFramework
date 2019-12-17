// import BaseChannel from "../../../game_framework/sdk/base/BaseChannel";
// import TTLogin from "./TTLogin";
// import TTBanner from "./TTBanner";
// import TTVideoAd from "./TTVideoAd";
// import TTShare from "./TTShare";
// import TTRecorder from "./TTRecorder";
//
// export default class TTChannel extends BaseChannel {
//
//
//     constructor(id, bannerID: string, rewardAdID: string, shareTitle: string) {
//         super(id)
//         this.loginMgr = new TTLogin();
//         this.recorder = new TTRecorder()
//         this.bannerAd = new TTBanner(bannerID);
//         this.rewardAd = new TTVideoAd(rewardAdID);
//         this.share = new TTShare(shareTitle);
//     }
//
//     isHaveRank() {
//         return false
//     }
//
//     isHaveGameBox() {
//         return false;
//     }
//
//     showImage(imgUrl: string) {
//         tt.previewImage({
//             current: imgUrl, // 当前显示图片的http链接
//             urls: [imgUrl] // 需要预览的图片http链接列表
//         })
//     }
//
//     jumpToApp(appID: string) {
//         tt.navigateToMiniProgram({
//             appId: appID,
//             success: () => {
//
//             }
//         })
//     }
//
//     postMessage(message) {
//         let context = tt.getOpenDataContext()
//         if (context) {
//             message.channelID = this.id;
//             context.postMessage(message)
//         }
//     }
//
//
//     protected vibrateShort() {
//         tt.vibrateShort();
//     }
// }
