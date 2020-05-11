import {LoginCallback, LogoutCallback} from "../SDKCallback";


export default interface LoginInterface {
    logout(func?:LogoutCallback);

    login(account, fun: LoginCallback);

    loginCallback:LoginCallback;

    logoutCallback:LogoutCallback;
}
