// import InterstitialAd from "../../../game_framework/sdk/base/InterstitialAd";
// import SDKManager from "../../../game_framework/sdk/SDKManager";
//
// export default class VivoInsertAd implements InterstitialAd {
//     private interstitialAd = null;
//
//     private finish: boolean = false
//
//     constructor(id) {
//         this.load(id);
//     }
//
//
//     show(func: Function) {
//         let that = this
//         if (this.interstitialAd) {
//             this.interstitialAd.show().then(() => {
//                 SDKManager.getChannel().getBannerAd().pause();
//             })
//                 .catch((err) => {
//                     that.interstitialAd.load().then(() => {
//                         that.interstitialAd.show()
//                         SDKManager.getChannel().getBannerAd().pause();
//                     })
//                 })
//         }
//     }
//
//     isLoad() {
//         return this.finish;
//     }
//
//     load(id) {
//         this.interstitialAd = qg.createInterstitialAd({
//             posId: id
//         });
//         this.interstitialAd.onLoad(() => {
//             console.log('插屏广告加载成功')
//             this.finish = true
//         })
//         this.interstitialAd.onError((err) => {
//             console.log('VivoInsertAd load fail ', err);
//             this.finish = false;
//         })
//         this.interstitialAd.onClose(() => {
//             SDKManager.getChannel().getBannerAd().resume();
//         })
//     }
// }
