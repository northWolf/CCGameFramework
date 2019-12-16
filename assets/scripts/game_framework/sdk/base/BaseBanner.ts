
export default abstract class BaseBanner {

    protected adUnitID: string = ''

    protected isShow: number = 0// 游戏逻辑是否要求显示

    protected finish: boolean = false;//加载完成

    protected bannerAd: any = null;

    protected isShowing: boolean = false

    protected layerName:string = ''

    constructor(id) {
        this.adUnitID = id;
        this.init();
    }

    init() {
        this.create((err) => {
            if (!err) {
                this.finish = true
                if (this.isShow == 1) {
                    this.showBanner(this.layerName)
                } else if (this.isShow == 2) {
                    this.hideBanner();
                }
            }else{
                this.reLoad();
            }
        })
    }

    reLoad(){
        console.log(' reLoad ')
        let id = setTimeout(()=>{
            this.init();
            clearTimeout(id)
        },8000)
    }



    showBanner(layerName:string) {
        this.isShow = 1;
        this.layerName = layerName;
        if (!this.finish) {
            return;
        }
        if (this.isShowing) {
            return;
        }
        this.isShowing = true;
        if (!this.bannerAd) {
            return
        }
        this.show()
    }

    hideBanner() {
        if (!this.bannerAd) {
            return
        }
        this.isShow = 2;
        if (!this.finish) {
            return;
        }
        if (!this.isShowing) {
            return;
        }
        this.isShowing = false;
        this.hide()
    }

    pause(){
        if(this.isShowing){
            this.hide();
        }
    }

    resume(){
        if(this.isShowing){
            this.show();
        }
    }

    destroyBanner() {
        if (!this.bannerAd) {
            return
        }
        this.destroy();
        this.isShow = 0
        this.finish = false;
        this.bannerAd = null;
    }

    protected abstract show(): void
    protected abstract hide(): void
    protected abstract destroy(): void;
    protected abstract create(callback: Function);

}
