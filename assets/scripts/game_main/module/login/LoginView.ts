import BaseFguiView from "../../../game_framework/mvc/view/BaseFguiView";
import BaseFguiLayer from "../../../game_framework/layer/BaseFguiLayer";
import BaseController from "../../../game_framework/mvc/controller/BaseController";
import Log from "../../../game_framework/utils/Log";
import FairyGUIUtil from "../../misc/FairyGUIUtil";

export default class LoginView extends BaseFguiView {

    private m_LoginBgClickStatus: number;

    public constructor($controller: BaseController, $parent: BaseFguiLayer) {
        super($controller, $parent);
    }

    public getRenderView(): fgui.GComponent {
        return this._view;
    }

    /**
     * 面板开启执行函数，用于子类继承
     * @param param 参数
     */
    public open(...param: any[]): void {
        super.open(param);

        fgui.UIPackage.loadPackage("UI/MainMenu", this.onUILoaded.bind(this));
    }

    private onUILoaded()
    {
        fgui.UIPackage.addPackage("UI/MainMenu");
        this._view = fgui.UIPackage.createObject("MainMenu", "Main").asCom;
        this._view.makeFullScreen();
        this.addToParent();

        FairyGUIUtil.GFindChild(this._view,"n1").onClick(function () {
            Log.info("准备打开Basic");
        }, this);
        Log.info("LoginView 创建成功");
    }

    /**
     * 面板关闭执行函数，用于子类继承
     * @param param 参数
     */
    public close(...param: any[]): void {
        super.close(param);
    }

    /**
     * 设置登录界面背景可点击状态
     */
    public setLoginBgClickStatus(_status: number) {
        this.m_LoginBgClickStatus = _status;
    }

    /**
     * 请求登陆处理
     * @param userName
     * @param pwd
     */
    private login(): void {

    }

    /**
     * 登陆成功处理
     */
    public loginSuccess(): void {
        // TODO登陆成功处理

    }
}