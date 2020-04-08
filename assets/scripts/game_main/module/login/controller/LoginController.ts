import BaseController from "../../../../game_framework/mvc/controller/BaseController";
import LayerManager from "../../../../game_framework/layer/LayerManager";
import App from "../../../../game_framework/App";
import LoginView from "../view/LoginView";
import LoginModel from "../model/LoginModel";
import LoginProxy from "../proxy/LoginProxy";
import Log from "../../../../game_framework/utils/Log";
import LoginConst from "../LoginConst";
import {ViewConst} from "../../../consts/ViewConst";

export default class LoginController extends BaseController {
    /** 本模块的数据存储 */
    private loginModel: LoginModel;

    /** 本模块的所有UI */
    private loginView: LoginView;

    /** 本模块的Proxy */
    private loginProxy: LoginProxy;

    public constructor() {
        super();

        this.loginModel = new LoginModel(this); // 初始化Model

        this.loginView = new LoginView(this, LayerManager.UI_Main); // 初始化UI
        App.ViewManager.register(ViewConst.Login, this.loginView);

        this.loginProxy = new LoginProxy(this); // 初始化Proxy

        // 注册模块间、模块内部事件监听
        this.registerFunc(LoginConst.LOGIN_ACCOUNT_C2S, this.login_controller, this); // 注册账号登录
        this.registerFunc(LoginConst.LOGIN_SDK_C2S, this.login_sdk_controller, this); // 注册SDK登录
        Log.info("LoginController初始化成功");
    }

    /**
     * 请求账号密码登陆
     * @param userName
     * @param pwd
     */
    private login_controller(userName: string, pwd: string): void {
        this.loginProxy.login_proxy(userName, pwd);
    }

    /**
     * 请求SDK登录
     */
    private async login_sdk_controller() {

    }
}
