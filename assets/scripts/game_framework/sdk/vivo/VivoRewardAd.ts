

import BaseRewardAd, { RewardADState } from "../base/BaseRewardAd";
import TipController from "../../tip/TipController";
import GlobalEvent from "../../event/GlobalEvent";
import ToastController from "../../toast/ToastController";


export default class VivoRewardAd extends BaseRewardAd {

    createVideoAd(id: string): void {
        this.rewardedVideoAd = qg.createRewardedVideoAd({
            posId: id
        });
        this.rewardedVideoAd.onLoad(() => {
            console.log("激励视频已加载");
            // this.isFinish = true;
            // callback(null)
            // this.isFinish = true;
        });
        this.rewardedVideoAd.onError(err => {
            console.log("激励视频异常", err);
            // ToastController.instance().show('播放加载失败，无法获得奖励')
            TipController.instance().intoLayer('广告播放失败\n请检查网络或者重试',(result:number)=>{
                this.show(this.rewardCallback)
            },'再试一次')    
            if(this.rewardCallback){
                this.rewardCallback(false)
            }
        
        });
        this.rewardedVideoAd.onClose(res => {
            // GlobalEvent.instance().resume()
            this.state = RewardADState.close;
            GlobalEvent.instance().changeAdState(RewardADState.close)
            if (res && res.isEnded) {
                console.log("正常播放结束，可以下发游戏奖励");
                this.rewardCallback(true)
            } else {
                console.log("播放中途退出，不下发游戏奖励");
                this.rewardCallback(false)
                ToastController.instance().intoLayer('ui.not_finish');
            }
            // this.load();
        });
    }



}
