import DevLogin from "./DevLogin";
import BaseChannel from "../base/BaseChannel";
export default class DevChannel  extends BaseChannel{

    constructor(id:number){
        super(id)
        this.loginMgr = new DevLogin();
    }

}
