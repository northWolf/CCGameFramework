import ProcedureBase from "../../game_framework/fsm/ProcedureBase";
import Log from "../../game_framework/utils/Log";
import App from "../../game_framework/App";
import LoginScene from "../scene/LoginScene";
import {SceneConsts} from "../consts/SceneConsts";
import {ViewConst} from "../consts/ViewConst";
import GlobalInfo from "../../game_framework/consts/GlobalInfo";
import ResourceItem from "../../game_framework/resource/ResourceItem";
import {isNull} from "../../game_framework/utils/GlobalDefine";

export default class ProcedureLaunch extends ProcedureBase {
    constructor(owner: Object) {
        super(owner);
    }

    public onInit(...args: any[]): void {
        super.onInit(args);
    }

    public onEnter(obj: Object = null): void {
        super.onEnter(obj);
        App.UrlParameters = this.urlParse();
         App.ResManager.loadRes("config/build_info", cc.JsonAsset, this.onBuildInfoConfigLoadComplete.bind(this));
        // let url = cc.url.raw("resources/config/build_info");
        // App.ResManager.load("http://localhost//index.htm", this.onBuildInfoConfigLoadComplete.bind(this), "htm");
    }

    private onBuildInfoConfigLoadComplete(err: string, res: ResourceItem): void {
        if (isNull(err)) {
            App.BuildInfo = res.getRes().json;
            console.log("App.BuildInfo = ", App.BuildInfo);
            App.init();
            App.GlobalInfo = new GlobalInfo();
            App.GlobalInfo.GateServerIp = "121.40.165.18";
            App.GlobalInfo.GateServerPort = 8800;
            fgui.addLoadHandler();
            fgui.GRoot.create();
            this.initScene();
            App.SceneManager.runScene(SceneConsts.Login);
            App.ViewManager.open(ViewConst.Login);
        } else {
            console.log(err);
        }
    }

    public onUpdate(): void {
        super.onUpdate();
    }

    public onLeave(preKey: string): void {
        super.onLeave(preKey);
    }

    private urlParse(): Object {
        var params = {};
        if (window.location == null) {
            return params;
        }
        var name, value;
        var str = window.location.href; //取得整个地址栏
        var indexOfParamStart = str.indexOf("?");
        str = str.substr(indexOfParamStart + 1); //取得所有参数   stringvar.substr(start [, length ]

        var arr = str.split("&"); //各个参数放到数组里
        for (var i = 0; i < arr.length; i++) {
            indexOfParamStart = arr[i].indexOf("=");
            if (indexOfParamStart > 0) {
                name = arr[i].substring(0, indexOfParamStart);
                value = arr[i].substr(indexOfParamStart + 1);
                params[name] = value;
            }
        }
        return params;
    }

    /**
     * 初始化所有场景
     */
    private initScene(): void {
        App.SceneManager.register(SceneConsts.Login, new LoginScene());
    }
}