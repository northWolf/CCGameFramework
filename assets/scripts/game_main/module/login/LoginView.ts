import BaseFguiView from "../../../game_framework/mvc/view/BaseFguiView";
import BaseFguiLayer from "../../../game_framework/layer/BaseFguiLayer";
import BaseController from "../../../game_framework/mvc/controller/BaseController";
import Log from "../../../game_framework/utils/Log";
import FairyGUIUtil from "../../misc/FairyGUIUtil";
import App from "../../../game_framework/App";
import ByteArrayMsgByProtobuf from "../../net/ByteArrayMsgByProtobuf";
import {BruceNetChannel} from "../../net/BruceNetChannel";
import {NetChannelType} from "../../../game_framework/net/socket/SocketEnum";
import ChannelID from "../../../game_framework/sdk/ChannelID";
import DefaultChannel from "../../sdk/default/DefaultChannel";
import LoginConst from "./LoginConst";
import ResourceItem from "../../../game_framework/resource/ResourceItem";

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
         App.ResManager.loadDir(LoginConst.LOGIN_UI_PKG.path, this.onUILoaded.bind(this));
         //fgui.UIPackage.loadPackage(App.PathUtil.getCombinePath(LoginConst.LOGIN_UI_PKG.path,LoginConst.LOGIN_UI_PKG.name), this.onUILoaded.bind(this));
    }

    private onUILoaded(err: string, res: ResourceItem) {
        fgui.UIPackage.addPackage(App.PathUtil.getCombinePath(LoginConst.LOGIN_UI_PKG.path,LoginConst.LOGIN_UI_PKG.name));
        this._view = fgui.UIPackage.createObject(LoginConst.LOGIN_UI_PKG.name, "Main").asCom;
        this._view.makeFullScreen();
        this.addToParent();

        FairyGUIUtil.GFindChild(this._view, "n1").onClick(function () {
            Log.info("准备打开Basic");
        }, this);

        FairyGUIUtil.GFindChild(this._view, "n2").onClick(function () {
            let _data = new Object();
            _data["packageName"] = "com.cz.game";
            _data["channelTag"] = "unknown";
            _data["gameVersion"] = "1.0";
            _data["platform"] = "android";
            App.Http.httpGET("https://ares.hbwyzg.com/api/get_global_info", _data, function (response) {
                Log.info(response);
            });
        }, this);

        FairyGUIUtil.GFindChild(this._view, "n3").onClick(function () {
            Log.info("准备连接服务器");
            App.Net.createNetChannelWithIpPort(BruceNetChannel.NetChannel_Hall.toString(),
                NetChannelType.SOCKET, App.GlobalInfo.GateServerIp, App.GlobalInfo.GateServerPort, new ByteArrayMsgByProtobuf());
            App.Net.setNetChannelReconnectFlagAndMaxCount(BruceNetChannel.NetChannel_Hall.toString(), true, 3);
            App.Net.connectNetChannel(BruceNetChannel.NetChannel_Hall.toString());
        }, this);

        FairyGUIUtil.GFindChild(this._view, "n4").onClick(function () {
            Log.info("准备渠道登录");
            App.SDK.init(new DefaultChannel(ChannelID.DEFAULT));
            App.SDK.getChannel().login(null, function () {
                Log.info("登录成功");
            });

        }, this);

        FairyGUIUtil.GFindChild(this._view, "n5").onClick(function () {
            Log.info("卸载MainMenu UI包资源");
            fgui.UIPackage.removePackage(LoginConst.LOGIN_UI_PKG.name);
            App.ResManager.releaseDir(LoginConst.LOGIN_UI_PKG.path);
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