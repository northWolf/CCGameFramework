import LoginInterface from "./LoginInterface";
import PayInterface from "./PayInterface";
import SDKLockState from "./SDKLockState";
import InterstitialAd from "./InterstitialAd";
import BaseBanner from "./BaseBanner";
import BaseRewardAd, {RewardADState} from "./BaseRewardAd";
import BaseRecorder from "./BaseRecorder";
import BaseShare from "./BaseShare";
import {LoginCallback, ShareCallback} from "../ChannelID";


export default class BaseChannel {


    protected id: number;

    protected sdk;

    protected loginMgr: LoginInterface;

    protected payMgr: PayInterface;

    protected rewardAd: BaseRewardAd;

    protected lockState: SDKLockState;

    protected recorder: BaseRecorder;

    protected bannerAd: BaseBanner;

    protected share: BaseShare;

    // protected exchagneVolume:ExchangeVolume;

    protected interstitialAd: InterstitialAd;

    constructor(id) {
        this.id = id;
        this.lockState = new SDKLockState();
    }

    getID(): number {
        return this.id;
    }

    getRewardAd(): BaseRewardAd {
        return this.rewardAd;
    }

    getBannerAd(): BaseBanner {
        return this.bannerAd;
    }

    getShare() {
        return this.share;
    }

    getPay() {
        return this.payMgr;
    }

    getLoginMgr(): LoginInterface {
        return this.loginMgr;
    }


    getLockState() {
        return this.lockState;
    }


    isHaveBannerAd() {
        return this.bannerAd != undefined;
    }


    isHaveStore() {
        return this.payMgr != undefined;
    }

    /**
     *
     */
    isHaveShare() {
        return this.share != undefined;
    }

    // 初始化结束
    initFinish() {

    }

    //初始化sdk
    init() {
        // cc.log(" ",this.data);

    }


    recorderStart(obj) {
        if (this.isHaveRecorder()) {
            this.recorder.start(obj)
        }
    }

    getRecorder() {
        return this.recorder;
    }


    recorderStop(isSave: boolean = true) {
        if (this.isHaveRecorder()) {
            this.recorder.stop(isSave)
        }
    }


    //七日奖励按钮个数
    sevenButtonNum() {
        return 2;
    }

    /**
     * 是否使用视频升级。
     * 由于升级方式改变、已经没有用了。
     */
    isVideoLvUp() {
        return false;
    }


    //添加sdk代码
    addScript(url: string) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = "" + this.id;
        script.onload = this.initFinish.bind(this);
        script.src = url;
        script.onerror = function () {
            // script.src = url;
            cc.error(" load script error ", url);
        }
        head.appendChild(script);
    }


    login(account, func: LoginCallback) {
        this.loginMgr.login(account, func)
    }

    logout() {
        this.loginMgr.logout();
    }

    showBanner(layerName: string) {
        if (this.bannerAd) {
            this.bannerAd.showBanner(layerName);
        }
    }

    hideBanner() {
        if (this.bannerAd) {
            this.bannerAd.hideBanner();
        }
    }

    showShare(title: string, func: ShareCallback, isShowRecorder: boolean = false) {
        if (this.isHaveShare()) {
            this.share.share(title, func, isShowRecorder)
        }
    }


    followResult(func: (result: boolean) => void) {

    }


    hideShare() {

    }

    // getExchangeVolume(){
    //     return this.exchagneVolume;
    // }


    openRewardAd(func: Function): void {
        if (this.isHaveRewardAd()) {
            this.rewardAd.show((isFinish) => {
                if (isFinish) {
                    func(true)
                    // GameProxy.getInstance().sendMessage(Protocals.ADD_VIDEO_CARD,{num:1})
                } else {
                    func(false)

                }
            })
        } else {
            func(true)
        }
    }

    isHaveRewardAd(): boolean {
        return this.rewardAd != null;
    }

    getRewardAdState(): RewardADState {
        if (this.rewardAd) {
            return this.rewardAd.getState();
        }
        return RewardADState.close;
    }

    isHaveFollow() {
        return false;
    }

    isHaveRecorder() {
        return this.recorder != null;
    }

    // isHaveExchangeVolume(ignore:boolean = false){
    //     if(!ignore){
    //         return this.exchagneVolume && cc.sys.os != cc.sys.OS_IOS;
    //     }else{
    //         return !isNull(this.exchagneVolume) ;
    //     }

    // }

    // exchangeVolumeInit(func:(isShow:boolean)=>void){
    //     if(this.isHaveExchangeVolume()){
    //         this.exchagneVolume.init()
    //     }else{
    //         func(false)
    //     }
    // }


    showImage(imageUrl: string) {

    }

    jumpToApp(appID: string) {

    }

    /**
     * 微量小程序联盟使用，获得多个游戏icon和二维码
     * @param num
     * @param func
     */
    getAds(num: number, func: (result: any) => void) {

    }


    isHaveInterstitalAd() {
        return this.interstitialAd && this.interstitialAd.isLoad();
    }

    showInterstitialAd(func: (code) => void) {
        if (this.isHaveInterstitalAd()) {
            this.interstitialAd.show(func)
        }
    }

    intoLobby() {

    }

    isHaveGameBox() {
        return false;
    }

    isHaveRank() {
        return false;
    }

    postMessage(message) {

    }


    vibarate() {
        this.vibrateShort();
    }

    protected vibrateShort() {

    }

    /**
     * 战斗是否有banner
     */
    isBattleHaveBanner() {
        return false
    }

}
