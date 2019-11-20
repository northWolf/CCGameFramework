import BaseController from "../../../game_framework/mvc/controller/BaseController";
import BaseProxy from "../../../game_framework/mvc/proxy/BaseProxy";

export default class LoginProxy extends BaseProxy {
    public constructor($controller: BaseController) {
        super($controller);
        // 注册从服务器返回消息的监听

    }

    /**
     * 账号密码登陆
     * @param accounts
     * @param pwd
     */
    public login_proxy(accounts: string, pwd: string): void {

    }
}