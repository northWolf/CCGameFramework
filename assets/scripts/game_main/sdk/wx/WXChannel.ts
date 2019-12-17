// import BaseChannel from "../../../game_framework/sdk/base/BaseChannel";
// import WXLogin from "./WXLogin";
// import WXBanner from "./WXBanner";
// import WXVideoAd from "./WXVideoAd";
// import WXShare from "./WXShare";
// import WXInterstitialAd from "./WXInterstitialAd";
// import GameBoxItemModel from "./gamebox/GameBoxItemModel";
//
// export default class WXChannel extends BaseChannel {
//
//     // private urls: string[] = ['https://www.sarsgame.com/games/gongzhonghao.jpg', 'https://www.sarsgame.com/games/tuchuchongwei.jpg']
//
//     private isCheck: boolean = false
//
//     constructor(id, bannerID: string, rewardAdID: string, insertAdID: string, shareTitle: string) {
//         super(id)
//         this.loginMgr = new WXLogin();
//         this.bannerAd = new WXBanner(bannerID);
//         this.rewardAd = new WXVideoAd(rewardAdID);
//         // this.exchagneVolume = new LayaExchangeVolume()
//         this.share = new WXShare(shareTitle);
//         this.interstitialAd = new WXInterstitialAd(insertAdID)
//         // GameProxy.getInstance().addEventListener(Protocals.FOLLOW_REWARD, this.onFollowRewardRes, this)
//
//     }
//
//     // onFollowRewardRes(msg: ReceiveMessage) {
//     //     if (!msg.isError()) {
//     //         ToastController.instance().intoLayer('ui.follow_reward', { num: StringHelper.getShortStr(FOLLOW_REWARD_NUM) })
//     //     }
//
//     // }
//     isHaveFollow() {
//         return true;
//     }
//
//     followResult(func: (result: boolean) => void) {
//         cc.game.on(cc.game.EVENT_SHOW, () => {
//             let loginInfo = wx.getLaunchOptionsSync()
//             if (loginInfo) {
//                 console.log('loginInfo.scene ' + loginInfo.scene)
//                 switch (loginInfo.scene) {
//                     case 1035://公众号
//                         func(true);
//                         break;
//                 }
//             }
//         });
//     }
//
//     isHaveGameBox() {
//         return true;
//     }
//
//     showImage(imgUrl: string) {
//         wx.previewImage({
//             current: imgUrl, // 当前显示图片的http链接
//             urls: [imgUrl] // 需要预览的图片http链接列表
//         })
//     }
//
//     jumpToApp(appID: string) {
//         wx.navigateToMiniProgram({
//             appId: appID,
//             success: () => {
//
//             }
//         })
//     }
//
//
//     isHaveRank() {
//         return true;
//     }
//
//     postMessage(message) {
//         let context = wx.getOpenDataContext()
//         if (context) {
//             message.channelID = this.id;
//             context.postMessage(message)
//         }
//     }
//
//     //微量小程序联盟的获取入口。
//     getAds(num: number, func: (result: any) => void) {
//         let list: GameBoxItemModel[] = []
//         if (wx.wladGetAds) {
//             wx.wladGetAds(num, function (res) { //第⼀个参数为获取⼴告条数，第⼆个参数为获取成功后回调⽅法
//                 if (res.code == 0) {
//                     if (res.data) {
//                         for (let index = 0; index < res.data.length; index++) {
//                             const element = res.data[index];
//                             let item = new GameBoxItemModel()
//                             item.setAppID(element.appid)
//                             item.setIcon(element.logo)
//                             item.setImage(element.img)
//                             item.setName(element.name)
//                             item.setDesc(element.desc)
//                             list.push(item)
//                         }
//                     }
//
//                     func(list)
//                 } else {
//                     func(list)
//                 }
//
//                 console.log(res);
//             })
//         } else {
//             func(list)
//             console.log('wx.wladGetAds is null  ')
//         }
//
//     }
//
//     protected vibrateShort() {
//         wx.vibrateShort();
//     }
// }
