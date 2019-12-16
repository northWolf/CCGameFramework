
import BaseChannel from "../base/BaseChannel";
import DevLogin from "../dev/DevLogin";
export default class YingYongBao  extends BaseChannel{

    constructor(id:number){
        super(id)
        this.loginMgr = new DevLogin();
    }

}
