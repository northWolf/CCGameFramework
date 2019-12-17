import LoginInterface from "../../../game_framework/sdk/base/LoginInterface";
import {LoginCallback} from "../../../game_framework/sdk/ChannelID";
import Log from "../../../game_framework/utils/Log";

export default class DefaultLogin implements LoginInterface {

    login(account, func: LoginCallback) {
        Log.info("登录 account");
        func("", null);
    }

    logout() {

    }

}
