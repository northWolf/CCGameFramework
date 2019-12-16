

import LoginInterface from "../base/LoginInterface";
import { LoginCallback } from "../ChannelID";
export default class WXLogin implements LoginInterface {
    
    constructor() {
      
      
    }

    login(account,func:LoginCallback) {
        func(null,account)
    }

    logout() {

    }


}
