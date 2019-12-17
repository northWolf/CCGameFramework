export enum RewardADState {
    close,
    open,
}

export default abstract class BaseRewardAd {
    protected state: RewardADState = RewardADState.close;
    protected rewardedVideoAd: any;
    protected rewardCallback: (isFinish: boolean) => void;

    constructor(id: string) {
        this.createVideoAd(id);

    }

    getState() {
        return this.state;
    }

    callback(num) {

    }

    abstract createVideoAd(id: string): void;

    show(callback: (isFinish: boolean) => void): void {
        if (!this.rewardedVideoAd) {
            callback(false)
            return;
        }
        this.rewardCallback = callback;
        this.rewardedVideoAd.show().then(() => {
            this.state = RewardADState.open;
           // GlobalEvent.instance().changeAdState(RewardADState.open)
        }).catch(() => {
            // 失败重试
            this.rewardedVideoAd.load()
                .then(() => {
                    this.rewardedVideoAd.show()
                    this.state = RewardADState.open;
                 //   GlobalEvent.instance().changeAdState(RewardADState.open)
                })
                .catch(err => {
                    console.log('激励视频 广告显示失败')
                    callback(false)
                })
        })
    }
}
