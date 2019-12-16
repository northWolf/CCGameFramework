
import BaseBanner from "../base/BaseBanner";

export default class VivoBannerAd extends BaseBanner {



    private closeCount:number = 0;
    create(callback:Function) {
        this.destroyBanner();
        this.bannerAd = qg.createBannerAd({
            posId: this.adUnitID,
            style: {}
        });

        let that = this;
        function onLoad(){
            that.bannerAd.offLoad(onLoad)
            callback(null)
            console.log('banner  ad load success')
        }
        this.bannerAd.onLoad(onLoad)
        function onError(err){
            callback(err)
            console.log('banner ad load fail  ', err)
            that.bannerAd.offError(onError)
        }
        this.bannerAd.onError(onError)

        function onClose(){
            that.bannerAd.offClose(onClose)
            if(that.closeCount < 5){
                that.closeCount ++;
                that.reLoad();
            }
           
        }

        this.bannerAd.onClose(onClose)
    }

    show(): void {
        this.bannerAd.show();
    }

    hide(): void {
        this.bannerAd.hide()
    }

    destroy(): void {
        this.bannerAd.destroy();
    }
}
