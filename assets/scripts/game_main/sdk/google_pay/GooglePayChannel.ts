import BaseChannel from "../../../game_framework/sdk/base/BaseChannel";
import DefaultLogin from "../default/DefaultLogin";

export default class GooglePayChannel  extends BaseChannel{

    constructor(id:number){
        super(id)
        this.loginMgr = new DefaultLogin();
    }

}
