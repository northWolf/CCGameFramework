import VideoAdInterface from "./VideoAdInterface";

export enum RewardADState {
    close,
    open,
}

export default abstract class BaseRewardAd {
    protected state: RewardADState = RewardADState.close;
    protected rewardedVideoAd: VideoAdInterface;
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

    load():void {}

    show(callback: (isFinish: boolean) => void): void {
        if (!this.rewardedVideoAd) {
            callback(false)
            return;
        }
        this.rewardCallback = callback;
        this.rewardedVideoAd.show(() => {
            this.state = RewardADState.open;
            // GlobalEvent.instance().changeAdState(RewardADState.open)
        });
    }


}
