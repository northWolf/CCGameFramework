import ControllerManager from "./mvc/ControllerManager";
import DebugUtils from "./utils/DebugUtils";
import MathUtils from "./utils/MathUtils";
import DateUtils from "./utils/DateUtils";
import Log from "./utils/Log";
import StateMachine from "./fsm/StateMachine";

export default class App {

    /**
     * 游戏框架名称
     */
    public static CCGameFrameworkName: string = "CCGameFramework";

    /**
     * 游戏框架版本
    */
    public static CCGameFrameworkVersion:string = "1.0";

    /**
     * 打包配置数据
     * @type {null}
     */
    public static BuildInfo: BuildInfo = null;

    /**
     * 全局配置数据
     * @type {null}
     */
    public static GlobalInfo: GlobalInfo = null;

    /**
     * 流程管理器
     * @type {null}
     */
    public static get Procedure(): StateMachine {
        return StateMachine.getInstance();
    }

    // /**
    //  * 简单Http请求
    //  * @type {HttpAPI}
    //  */
    // public static get Http(): HttpAPI {
    //     return HttpAPI.getInstance();
    // }

    // /**
    //  * 网络管理类
    //  * @type {null}
    //  */
    // public static get Net(): NetManager {
    //     return NetManager.getInstance();
    // }

    /**
     * 模块管理类
     * @type {ControllerManager}
     */
    public static get ControllerManager(): ControllerManager {
        return ControllerManager.getInstance();
    }

    // /**
    //  * View管理类
    //  * @type {ViewManager}
    //  */
    // public static get ViewManager(): ViewManager {
    //     return ViewManager.getInstance();
    // }

    // /**
    //  * 场景管理类
    //  * @type {SceneManager}
    //  */
    // public static get SceneManager(): SceneManager {
    //     return SceneManager.getInstance();
    // }



    /**
     * 日期工具类
     * @type {DateUtils}
     */
    public static get DateUtils(): DateUtils {
        return DateUtils.getInstance();
    }

    /**
     * 数学计算工具类
     * @type {MathUtils}
     */
    public static get MathUtils(): MathUtils {
        return MathUtils.getInstance();
    }

    /**
     * 调试工具
     * @type {DebugUtils}
     */
    public static get DebugUtils(): DebugUtils {
        return DebugUtils.getInstance();
    }


    /**
     * 初始化函数
     * @constructor
     */
    public static Init(): void {
        App.DebugUtils.isOpen(true);
        Log.info(App.CCGameFrameworkName,App.CCGameFrameworkVersion);
        Log.info("当前引擎版本: ", cc.ENGINE_VERSION);
        App.DebugUtils.setThreshold(5);
    }
}