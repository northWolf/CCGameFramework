
import BaseShare from "../base/BaseShare";
import GlobalEvent from "../../event/GlobalEvent";
export default class WXShare extends BaseShare {

  private title:string ;
  constructor(title:string) {
    super();
    this.title = title;
    GlobalEvent.instance().addEventListener(GlobalEvent.EVENT_SHOW, this.backGame, this)
    wx.showShareMenu({
      withShareTicket: true,
    });
    wx.updateShareMenu({
      withShareTicket: true
    })
    wx.onShareAppMessage(function () {
      // 用户点击了“转发”按钮
      let visibleOrigin = cc.view.getVisibleOrigin();
      let visibleSize = cc.view.getFrameSize();

      return {
        title: title,
        imageUrl: canvas.toTempFilePathSync({
          x: visibleOrigin.x,
          y: visibleOrigin.y,
          destWidth: visibleSize.width,
          destHeight: visibleSize.height
        })
      }
    })
  }

  share(title: string, func?: Function,isShowRecorder?:boolean) {
    title = title || this.title;
    this.callback = func;
    let visibleOrigin = cc.view.getVisibleOrigin();
    let visibleSize = cc.view.getFrameSize();
    cc.log('shareAppMessage title ', title)
    wx.shareAppMessage({
      title: title,
      x: visibleOrigin.x,
      y: visibleOrigin.y,
      imageUrl: canvas.toTempFilePathSync({
        destWidth: visibleSize.width,
        destHeight: visibleSize.height
      })
    })
    this.shareFlag = true;
  }

  getShareInfo(shareTicket: string, func: (result) => void) {
    if (shareTicket) {
      wx.getShareInfo({
        shareTicket: shareTicket,
        success: () => {

        },
        fail: () => {

        }
      });
    }

  }

  backGame() {
    // cc.log('this.shareFlag ', this.shareFlag,' UserModel.getInstance().getShareCount() ',UserModel.getInstance().getShareCount())
    if (this.shareFlag) {
        if(this.callback){
            this.callback();
            this.callback = null;
        }
        this.shareFlag = false;
        // this.shareSuccess();
        //    else {
        //     ToastController.instance().intoLayer('ui.share_tip')
        //   }
    }
}
}
