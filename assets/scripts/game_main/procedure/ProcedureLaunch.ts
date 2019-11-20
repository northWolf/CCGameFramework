import ProcedureBase from "../../game_framework/fsm/ProcedureBase";
import Log from "../../game_framework/utils/Log";
import App from "../../game_framework/App";
import LoginScene from "../scene/LoginScene";
import {SceneConsts} from "../consts/SceneConsts";
import {ViewConst} from "../consts/ViewConst";

export default class ProcedureLaunch extends ProcedureBase
{
    constructor(owner: Object) {
        super(owner);
    }

    public onInit(...args: any[]): void {
        super.onInit(args);
    }

    public onEnter(obj: Object = null): void {
        super.onEnter(obj);
        App.Init();
        fgui.addLoadHandler();
        fgui.GRoot.create();
        this.initScene();
        App.SceneManager.runScene(SceneConsts.Login);
        App.ViewManager.open(ViewConst.Login);
    }

    public onUpdate(): void {
        super.onUpdate();
    }

    public onLeave(preKey: string): void {
        super.onLeave(preKey);
    }

    /**
     * 初始化所有场景
     */
    private initScene(): void {
        App.SceneManager.register(SceneConsts.Login, new LoginScene());
    }
}