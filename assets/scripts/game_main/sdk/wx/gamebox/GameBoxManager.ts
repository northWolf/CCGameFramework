import GameBoxItemModel from "./GameBoxItemModel";
import SarsGameBox from "../SarsGameBox";
import LayaExchangeVolume from "../LayaExchangeVolume";
import BaseClass from "../../../../game_framework/base/BaseClass";

export default class GameBoxManager extends BaseClass {
    init(config: any) {
        let gameList = config.gameList;
        let sarsgame = new SarsGameBox();
        if (sarsgame.isActive()) {
            this.addItem(sarsgame)
        }
        for (let index = 0; index < gameList.length; index++) {
            const element = gameList[index];
            let box = new GameBoxItemModel()
            box.setName(element.name)
            box.setAppID(element.appID)
            box.setIcon(element.icon)
            this.addItem(box)

        }
        let laya = new LayaExchangeVolume()
        if (laya.isActive()) {
            this.addItem(laya)
        }

    }

    private list: GameBoxItemModel[] = []

    addItem(item: GameBoxItemModel) {
        this.list.push(item)
    }

    getList(): GameBoxItemModel[] {
        return this.list;
    }
}
