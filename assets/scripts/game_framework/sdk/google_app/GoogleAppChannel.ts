import BaseChannel from "../base/BaseChannel";
import DevLogin from "../dev/DevLogin";
import GoogleAppVideoAd from "./GoogleAppVideoAd";

export default class GoogleAppChannel  extends BaseChannel{

    constructor(id:number){
        super(id);
        this.loginMgr = new DevLogin();
        this.rewardAd = new GoogleAppVideoAd('');
    }

}
