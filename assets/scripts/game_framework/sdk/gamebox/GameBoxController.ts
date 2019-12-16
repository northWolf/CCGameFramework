
import GameBoxManager from "./GameBoxManager";
import GameBoxItemModel from "./GameBoxItemModel";
import SDKManager from "../SDKManager";
import BaseController from "../../base/controller/BaseController";


export default class GameBoxController extends BaseController {
    private static ins:GameBoxController;

    static instance():GameBoxController{
        if(!this.ins){
            this.ins = new GameBoxController();
        }
        return this.ins;
    }

    intoLayer(){
        this.pushView('prefabs/battle/GameBoxView',GameBoxManager.instance())
    }

    jump(item:GameBoxItemModel){
        if(item.getImage()){
            SDKManager.getChannel().showImage(item.getImage())
        }else{
            SDKManager.getChannel().jumpToApp(item.getAppID())
        }
    }
}
