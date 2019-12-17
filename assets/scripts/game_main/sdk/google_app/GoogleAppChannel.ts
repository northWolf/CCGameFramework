import BaseChannel from "../../../game_framework/sdk/base/BaseChannel";
import DefaultLogin from "../default/DefaultLogin";
import GoogleAppVideoAd from "./GoogleAppVideoAd";

export default class GoogleAppChannel  extends BaseChannel{

    constructor(id:number){
        super(id);
        this.loginMgr = new DefaultLogin();
        this.rewardAd = new GoogleAppVideoAd('');
    }

}
