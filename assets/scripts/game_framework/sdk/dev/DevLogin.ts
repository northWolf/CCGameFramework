

import LoginInterface from "../base/LoginInterface";
import { LoginCallback } from "../ChannelID";
export default class DevLogin implements LoginInterface {

    login(account,func:LoginCallback){
        func(null,'');
    }
    logout(){

    }

}
