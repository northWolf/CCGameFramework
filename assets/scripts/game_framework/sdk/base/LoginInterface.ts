import {LoginCallback} from "../ChannelID";

export default interface LoginInterface {
    logout();

    login(account, fun: LoginCallback);
}
