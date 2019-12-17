
import BaseChannel from "../../../game_framework/sdk/base/BaseChannel";
import DefaultLogin from "../default/DefaultLogin";
export default class YingYongBao  extends BaseChannel{

    constructor(id:number){
        super(id)
        this.loginMgr = new DefaultLogin();
    }

}
