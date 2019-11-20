import BaseClass from "../../base/BaseClass";
import BaseScene from "../base/BaseScene";
import Log from "../../utils/Log";

/**
 * 场景管理器
 */
export default class SceneManager extends BaseClass {

    private _scenes: any;
    private _currScene: number;

    /**
     * 构造函数
     */
    public constructor() {
        super();
        this._scenes = {};
    }

    /**
     * 清空处理
     */
    public clear(): void {
        var nowScene: BaseScene = this._scenes[this._currScene];
        if (nowScene) {
            nowScene.onExit();
            this._currScene = undefined;
        }
        this._scenes = {};
    }

    /**
     * 注册Scene
     * @param key Scene唯一标识
     * @param scene Scene对象
     */
    public register(key: number, scene: BaseScene): void {
        this._scenes[key] = scene;
    }

    /**
     * 切换场景
     * @param key 场景唯一标识
     */
    public runScene(key: number, ...param: any[]): void {
        var nowScene: BaseScene = this._scenes[key];
        if (nowScene == null) {
            Log.error("场景" + key + "不存在");
            return;
        }

        var oldScene: BaseScene = this._scenes[this._currScene];

        if (oldScene) {
            if (nowScene == oldScene) {
                return;
            }
            oldScene.onExit();
        }

        nowScene.onEnter.apply(nowScene, param);
        this._currScene = key;
    }

    /**
     * 获取当前Scene
     * @returns {number}
     */
    public getCurrScene(): number {
        return this._currScene;
    }
}