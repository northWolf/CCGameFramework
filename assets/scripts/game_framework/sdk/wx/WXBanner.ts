import BaseBanner from "../base/BaseBanner";
export default class WXBanner extends BaseBanner {


    protected create(callback: Function) {
        let winSize = wx.getSystemInfoSync();

        // console.log(winSize);
        let bannerHeight = 120;
        let bannerWidth = 350;
        this.destroyBanner();
        this.bannerAd = wx.createBannerAd({
            adUnitId: this.adUnitID,
            style: {
                left: (winSize.windowWidth - bannerWidth) / 2,
                top: winSize.windowHeight - bannerHeight,
                width: bannerWidth
            }
        })
        let that = this;
        function onLoad() {
            that.bannerAd.offLoad(this)
            callback(null)
            cc.log('banner 广告加载成功')
        }
        this.bannerAd.onLoad(onLoad)
        function onError(err) {
            callback(err)
            cc.log('banner 广告加载失败 ', err)
            that.bannerAd.offError(this)
        }
        this.bannerAd.onError(onError)
    }

    protected show(): void {
        this.bannerAd.show();
    }

    protected hide(): void {
        this.bannerAd.hide();
    }

    protected destroy(): void {
        this.bannerAd.destroy()
    }
}
