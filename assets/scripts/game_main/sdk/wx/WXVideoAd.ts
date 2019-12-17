// import BaseRewardAd, {RewardADState} from "../../../game_framework/sdk/base/BaseRewardAd";
// import ToastController from "../../toast/ToastController";
// import GlobalEvent from "../../event/GlobalEvent";
//
//
// export default class WXVideoAd extends BaseRewardAd {
//     createVideoAd(id: string): void {
//         this.rewardedVideoAd = wx.createRewardedVideoAd({adUnitId: id})
//         if (this.rewardedVideoAd) {
//             this.rewardedVideoAd.onLoad(() => {
//                 // this.loadFinish = true
//             })
//             this.rewardedVideoAd.onError(err => {
//
//                 console.log(err)
//                 ToastController.instance().show('视频加载失败，无法获得奖励')
//                 if (this.rewardCallback) {
//                     this.rewardCallback(false)
//                 }
//             })
//             this.rewardedVideoAd.onClose(res => {
//                 // this.resume()
//                 // GlobalEvent.instance().resume();
//                 this.state = RewardADState.close;
//                 GlobalEvent.instance().changeAdState(RewardADState.close)
//                 // 用户点击了【关闭广告】按钮
//                 // 小于 2.1.0 的基础库版本，res 是一个 undefined
//                 if (res && res.isEnded || res === undefined) {
//                     // 正常播放结束，可以下发游戏奖励
//                     if (this.rewardCallback) {
//                         this.rewardCallback(true)
//                     }
//
//                 } else {
//                     // 播放中途退出，不下发游戏奖励
//                     if (this.rewardCallback) {
//                         this.rewardCallback(false);
//                         ToastController.instance().intoLayer('ui.not_finish');
//                     }
//
//                 }
//             })
//         }
//
//     }
//
//
// }
