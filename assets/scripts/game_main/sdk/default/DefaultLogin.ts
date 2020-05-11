import LoginInterface from "../../../game_framework/sdk/base/LoginInterface";
import Log from "../../../game_framework/utils/Log";
import {LoginCallback, LogoutCallback} from "../../../game_framework/sdk/SDKCallback";

export default class DefaultLogin implements LoginInterface {

    login(account, func: LoginCallback) {
        Log.info("登录 account");
        this.loginCallback = func;
    }

    logout(func: LogoutCallback) {
        this.logoutCallback = func;
    }

    loginCallback:LoginCallback;
    logoutCallback:LogoutCallback;

}
