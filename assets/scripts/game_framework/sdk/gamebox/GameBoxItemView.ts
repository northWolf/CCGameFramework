
import GameBoxController from "./GameBoxController";
import GameBoxItemModel from "./GameBoxItemModel";
import BaseItemView from "../../base/view/BaseItemView";
import ResItem from "../../res/ResItem";



const { ccclass, property } = cc._decorator;

@ccclass
export default class GameBoxItemView extends BaseItemView {

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    protected controller: GameBoxController;
    protected model: GameBoxItemModel;
    start() {
        let icon = this.model.getIcon();
        if (icon.indexOf('http') >= 0) {
            this.getLoader().loadRemote(icon, (err, item: ResItem) => {
                if (err || !this.node) {
                    return;
                }
                this.icon.spriteFrame = new cc.SpriteFrame(item.getRes())
            })
        } else {
            this.getLoader().loadRes(icon, cc.SpriteFrame, (err, item: ResItem) => {
                if (err || !this.node) {
                    return;
                }
                this.icon.spriteFrame = item.getRes()
            })
        }

        this.label.string = this.model.getName();

    }

    onButtonClick() {
       this.model.jump();
    }

    // update (dt) {}
}
