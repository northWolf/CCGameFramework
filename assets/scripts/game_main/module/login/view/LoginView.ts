import BaseFguiView from "../../../../game_framework/mvc/view/BaseFguiView";
import BaseFguiLayer from "../../../../game_framework/layer/BaseFguiLayer";
import BaseController from "../../../../game_framework/mvc/controller/BaseController";
import Log from "../../../../game_framework/utils/Log";
import FairyGUIUtil from "../../../misc/FairyGUIUtil";
import App from "../../../../game_framework/App";
import ByteArrayMsgByProtobuf from "../../../net/ByteArrayMsgByProtobuf";
import {DefaultNetChannel} from "../../../net/DefaultNetChannel";
import {NetChannelType} from "../../../../game_framework/net/socket/SocketEnum";
import ChannelID from "../../../../game_framework/sdk/ChannelID";
import DefaultChannel from "../../../sdk/default/DefaultChannel";
import LoginConst from "../LoginConst";
import ResourceItem from "../../../../game_framework/resource/ResourceItem";
import LocalStorageUtils from "../../../../game_framework/utils/LocalStorageUtils";

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
        App.ResManager.loadResDir(LoginConst.LOGIN_UI_PKG.path, this.onUILoaded.bind(this));
    }

    private onUILoaded(err: string, res: ResourceItem) {
        fgui.UIPackage.addPackage(App.PathUtil.getCombinePath(LoginConst.LOGIN_UI_PKG.path, LoginConst.LOGIN_UI_PKG.name));
        this._view = fgui.UIPackage.createObject(LoginConst.LOGIN_UI_PKG.name, "Framework").asCom;
        this._view.makeFullScreen();
        this.addToParent();

        FairyGUIUtil.GFindChild(this._view, "btn_log").onClick(function () {
            this.logToView("准备演示框架功能");
        }, this);

        FairyGUIUtil.GFindChild(this._view, "btn_http_request").onClick(function () {
            let _data = new Object();
            _data["packageName"] = "com.cz.game";
            _data["channelTag"] = "unknown";
            _data["gameVersion"] = "1.0";
            _data["platform"] = "android";
            App.Http.httpGET("https://ares.hbwyzg.com/api/get_global_info", _data, function (response) {
                this.logToView(response);
            }.bind(this));
        }, this);

        FairyGUIUtil.GFindChild(this._view, "btn_web_socket").onClick(function () {
            this.logToView("准备连接服务器");
            App.Net.createNetChannelWithIpPort(DefaultNetChannel.NetChannel_Hall.toString(),
                NetChannelType.SOCKET, App.GlobalInfo.GateServerIp, App.GlobalInfo.GateServerPort, new ByteArrayMsgByProtobuf());
            App.Net.setNetChannelReconnectFlagAndMaxCount(DefaultNetChannel.NetChannel_Hall.toString(), true, 3);
            App.Net.connectNetChannel(DefaultNetChannel.NetChannel_Hall.toString());
        }, this);

        FairyGUIUtil.GFindChild(this._view, "btn_login").onClick(function () {
            this.logToView("准备渠道登录");
            App.SDK.init(new DefaultChannel(ChannelID.DEFAULT));
            App.SDK.getChannel().login(null, function () {
                this.logToView("登录成功");
            }.bind(this));

        }, this);

        FairyGUIUtil.GFindChild(this._view, "btn_unload_res").onClick(function () {
            this.logToView("卸载MainMenu UI包资源");
            fgui.UIPackage.removePackage(LoginConst.LOGIN_UI_PKG.name);
            App.ResManager.releaseDir(LoginConst.LOGIN_UI_PKG.path);
        }, this);

        FairyGUIUtil.GFindChild(this._view, "btn_play_bgm").onClick(function () {
            this.logToView("播放背景音乐");
            App.SoundManager.playBg("sound/bgm_lobby");
        }, this);

        FairyGUIUtil.GFindChild(this._view, "btn_stop_bgm").onClick(function () {
            this.logToView("停止背景音乐");
            App.SoundManager.stopBg();
        }, this);

        FairyGUIUtil.GFindChild(this._view, "btn_play_sound").onClick(function () {
            this.logToView("播放金币音效");
            App.SoundManager.playEffect("sound/sfx_coins");
        }, this);

        FairyGUIUtil.GFindChild(this._view, "btn_load_effect").onClick(function () {
            this.logToView("加载龙骨特效");
            App.ResManager.loadRes("animations/hall_act_xlch", cc.Asset, function () {
                this.logToView("加载完成");
            }.bind(this));
        }, this);

        FairyGUIUtil.GFindChild(this._view, "btn_play_effect").onClick(function () {
            this.logToView("插入龙骨特效到UI");
            var asset = App.ResManager.getRes("animations/hall_act_xlch", cc.Asset);
            if (asset) {
                var actorNode = cc.instantiate(asset);
                actorNode.parent = FairyGUIUtil.GFindChild(this._view, "btn_play_effect").node;
            } else {
                this.logToView("未加载 animations/hall_act_xlch 资源");
            }

        }, this);

        FairyGUIUtil.GFindChild(this._view, "btn_hotupdate").onClick(function () {
            this.logToView("使用热更新管理器");
            var moduleName = "inbuilt";
            App.HotUpdateManager.init(moduleName, function () {
                this.logToView("检查资源版本完毕");
            }, function () {
                this.logToView("更新资源完毕");
            }, function () {
                this.logToView("正在更新资源，进度为：" + App.HotUpdateManager.getProgress(moduleName));
            }, function () {
                this.logToView("已是新版本");
            });
            App.HotUpdateManager.check(moduleName);
        }, this);

        FairyGUIUtil.GFindChild(this._view, "btn_hotupdate_result").onClick(function () {
            this.logToView("热更新的结果：1");
        }, this);

        FairyGUIUtil.GFindChild(this._view, "btn_restart_game").onClick(function () {
            this.logToView("重启游戏");
            cc.game.restart();
        }, this);

        FairyGUIUtil.GFindChild(this._view, "btn_clear_local_storage").onClick(function () {
            this.logToView("清理本地缓存");
            LocalStorageUtils.clearAll();
        }, this);

        FairyGUIUtil.GFindChild(this._view, "btn_start_timer").onClick(function () {
            this.logToView("开始计时器");
            let count = 1;
            App.TimerManager.doTimer(1000,0,function(){
                this.logToView(count ++ );
            }.bind(this),this);
        }, this);

        FairyGUIUtil.GFindChild(this._view, "btn_stop_timer").onClick(function () {
            this.logToView("停止计时器");
            App.TimerManager.removeAll(this);
        }, this);


        this.logToView("LoginView 创建成功");
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

    private logToView(content:string):void
    {
        FairyGUIUtil.GFindChild(this._view,"tf_log").text = content;
        Log.info(content);
    }
}
