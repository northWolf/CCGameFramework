

import LoginInterface from "../base/LoginInterface";
import { LoginCallback } from "../ChannelID";

export default class TTLogin implements LoginInterface {

    constructor() {
    }

    login(obj,func:LoginCallback) {
        tt.login({
            force: false,
            success(res) {
                console.log(`login调用成功${res.code} ${res.anonymousCode}`);
                tt.getUserInfo({
                    success(res) {
                        func(null,res)
                        console.log(`getUserInfo调用成功${res.userInfo}`);
                        // GameProxy.getInstance().sendMessage(Protocals.LOGIN, { account: LOGIN_ACCOUNT });
                    },
                    fail(res) {
                        console.log(`getUserInfo调用失败`);
                        func('getUserInfo fail',res)
                        // GameProxy.getInstance().sendMessage(Protocals.LOGIN, { account: LOGIN_ACCOUNT });
                    }
                });

            },
            fail(res) {
                func('login fail',res)
                // console.log(`login调用失败`);
                // GameProxy.getInstance().sendMessage(Protocals.LOGIN, { account: LOGIN_ACCOUNT });
            }
        });

    }


    logout() {

    }


}
