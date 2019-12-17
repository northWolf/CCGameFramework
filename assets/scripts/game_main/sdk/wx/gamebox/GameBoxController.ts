import GameBoxItemModel from "./GameBoxItemModel";
import SDKManager from "../../../../game_framework/sdk/SDKManager";
import BaseController from "../../../../game_framework/mvc/controller/BaseController";

export default class GameBoxController extends BaseController {

    intoLayer() {

    }

    jump(item: GameBoxItemModel) {
        if (item.getImage()) {
            SDKManager.getChannel().showImage(item.getImage())
        } else {
            SDKManager.getChannel().jumpToApp(item.getAppID())
        }
    }
}
