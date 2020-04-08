import BaseSpriteView from "../../../../game_framework/mvc/view/BaseSpriteView";
import BaseController from "../../../../game_framework/mvc/controller/BaseController";
import BaseSpriteLayer from "../../../../game_framework/layer/BaseSpriteLayer";
import App from "../../../../game_framework/App";

export default class LoginBgView extends BaseSpriteView {

    public constructor($controller: BaseController, $parent: BaseSpriteLayer) {
        super($controller, $parent);
    }

    /**
     * 面板开启执行函数，用于子类继承
     * @param param 参数
     */
    public open(...param: any[]): void {
        super.open(param);
       App.ResManager.loadRes("prefabs/Bg",cc.Prefab,function(err, res){
           var asset = App.ResManager.getRes("prefabs/Bg", cc.Prefab);
           var bgNode = cc.instantiate(asset);
           this.displayObject.addChild(bgNode);
       }.bind(this));
    }

    /**
     * 面板关闭执行函数，用于子类继承
     * @param param 参数
     */
    public close(...param: any[]): void {

    }

}
