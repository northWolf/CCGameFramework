// import SDKManager from "../../../game_framework/sdk/SDKManager";
// import BaseShare from "../../../game_framework/sdk/base/BaseShare";
// import {ShareCallback} from "../../../game_framework/sdk/ChannelID";
//
// export default class TTShare extends BaseShare {
//
//
//     constructor(title) {
//         super();
//         // GlobalEvent.instance().addEventListener(GlobalEvent.EVENT_SHOW, this.backGame, this)
//         tt.showShareMenu({
//             withShareTicket: true,
//         });
//         tt.updateShareMenu({
//             withShareTicket: true
//         })
//         wx.onShareAppMessage(function () {
//             // 用户点击了“转发”按钮
//             let visibleOrigin = cc.view.getVisibleOrigin();
//             let visibleSize = cc.view.getFrameSize();
//
//             return {
//                 title: title,
//                 imageUrl: canvas.toTempFilePathSync({
//                     x: visibleOrigin.x,
//                     y: visibleOrigin.y,
//                     destWidth: visibleSize.width,
//                     destHeight: visibleSize.height
//                 }),
//                 success: () => {
//                     console.log('分享成功')
//                     this.shareSuccess();
//                 },
//                 fail: (e) => {
//                     console.log('分享失败', e)
//                 }
//             }
//         })
//     }
//
//     share(title: string, func: ShareCallback, isShowRecorder?: boolean) {
//         // this.callback = func;
//         cc.log('shareAppMessage title ', title)
//         let videoPath = SDKManager.getChannel().getRecorder().getVideoPath();
//         if (isShowRecorder && videoPath) {
//
//             tt.shareAppMessage({
//                 channel: 'video',
//                 title: title,
//                 extra: {
//                     videoPath: videoPath,
//                 },
//                 success: () => {
//                     console.log('分享成功');
//                     if (func) {
//                         func(true);
//                     }
//                 },
//                 fail: (e) => {
//                     console.log('分享失败', e);
//                     if (e.errMsg.indexOf('short') >= 0) {
//                         this.share(title, func, false)
//                     } else {
//                         func(false)
//                     }
//
//                 }
//             })
//         } else {
//             tt.shareAppMessage({
//                 channel: 'article',
//                 title: '分享有礼',
//                 description: title,
//                 success: () => {
//                     console.log('分享成功');
//                     if (func) {
//                         func(true);
//                     }
//                 },
//                 fail: (e) => {
//                     console.log('分享失败');
//                     func(false)
//                 }
//                 // x: visibleOrigin.x,
//                 // y: visibleOrigin.y,
//                 // imageUrl: canvas.toTempFilePathSync({
//                 //   destWidth: visibleSize.width,
//                 //   destHeight: visibleSize.height
//                 // })
//             })
//         }
//
//         this.shareFlag = true;
//     }
//
//     getShareInfo(shareTicket: string, func: (result) => void) {
//         if (shareTicket) {
//             tt.getShareInfo({
//                 shareTicket: shareTicket,
//                 success: () => {
//
//                 },
//                 fail: () => {
//
//                 }
//             });
//         }
//
//     }
//
//
// }
