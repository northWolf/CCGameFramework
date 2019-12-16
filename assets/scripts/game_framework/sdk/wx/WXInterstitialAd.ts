import InterstitialAd from "../base/InterstitialAd";

export default class WXInterstitialAd implements InterstitialAd {
    private interstitialAd = null;

    private finish: boolean = false

    constructor(id) {
        this.load(id);
    }


    show(func: Function) {
        if (this.interstitialAd) {
            this.interstitialAd.show((code) => {
                cc.log(' insterstitailAd show result ', code)
                if (!code) {
                    func(null)
                } else {
                    func(code)
                }
            });
        }
    }

    isLoad() {
        return this.finish;
    }

    load(id) {
        // 创建插屏广告实例，提前初始化
        if (wx.createInterstitialAd) {
            this.interstitialAd = wx.createInterstitialAd({
                adUnitId:id
            })
            this.interstitialAd.onLoad(() => {
                cc.log('插屏 广告加载成功')
                this.finish = true;
            })
            this.interstitialAd.onError(err => {
                cc.log(err)
            })
            this.interstitialAd.onClose(res => {
                cc.log('插屏 广告关闭')
            })            
        }

    }

    // loaded(code){
    //     console.log(' InterstitailAd loaded code ',code)
    //     if(this.interstitialAd){
    //         this.interstitialAd.offLoad(this.loaded.bind(this))
    //     }
    //     this.finish = true
    // }
}
