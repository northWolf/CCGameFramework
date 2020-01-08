import BaseController from "../../../game_framework/mvc/controller/BaseController";
import App from "../../../game_framework/App";
import BaseCCUIView from "../../../game_framework/mvc/view/BaseCCUIView";
import BaseCCUILayer from "../../../game_framework/layer/BaseCCUILayer";

export default class CCLoginView extends BaseCCUIView {

    public constructor($controller: BaseController, $parent: BaseCCUILayer) {
        super($controller, $parent);
    }

    /**
     * 面板开启执行函数，用于子类继承
     * @param param 参数
     */
    public open(...param: any[]): void {
        super.open(param);
        App.ResManager.loadRes("prefabs/CCUI",cc.Prefab,function(err, res){
            var asset = App.ResManager.getRes("prefabs/CCUI", cc.Prefab);
            var ccuiNode = cc.instantiate(asset);
            this.displayObject.addChild(ccuiNode);
        }.bind(this));
    }

    /**
     * 面板关闭执行函数，用于子类继承
     * @param param 参数
     */
    public close(...param: any[]): void {

    }

}