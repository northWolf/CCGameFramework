import DefaultLogin from "./DefaultLogin";
import BaseChannel from "../../../game_framework/sdk/base/BaseChannel";
export default class DefaultChannel  extends BaseChannel{

    constructor(id:number){
        super(id)
        this.loginMgr = new DefaultLogin();
    }

}
