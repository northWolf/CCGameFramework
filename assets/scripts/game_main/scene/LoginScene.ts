import BaseScene from "../../game_framework/scene/base/BaseScene";
import LayerManager from "../../game_framework/layer/LayerManager";
import App from "../../game_framework/App";
import LoginController from "../module/login/LoginController";
import {ControllerConst} from "../consts/ControllerConst";
import Log from "../../game_framework/utils/Log";

export default class LoginScene extends BaseScene {

    /**
     * 构造函数
     */
    public constructor() {
        super();
    }

    /**
     * 进入Scene调用
     */
    public onEnter(): void {
        super.onEnter();

        // 添加该Scene使用的层级
        this.addLayer(LayerManager.UI_Main);
        this.addLayer(LayerManager.UI_Popup);
        this.addLayer(LayerManager.UI_Message);
        this.addLayer(LayerManager.UI_Tips);
        this.addLayer(LayerManager.UI_Loading);
        // 初始化该scene的所有视图控制器
        this.initViewController();
    }

    /**
     * 退出Scene调用
     */
    public onExit(): void {
        super.onExit();
    }

    private initViewController(): void {
        App.ControllerManager.register(ControllerConst.Login, LoginController);
    }
}