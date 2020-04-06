import AssetsManager, {AssetEvent} from "./AssetsManager";
import HotUpdateConfig from "./HotUpdateConfig";
import App from "../App";
import LocalStorageUtils from "../utils/LocalStorageUtils";
import BaseClass from "../base/BaseClass";

export default class HotUpdateManager extends BaseClass{
    public static readonly ASSET_UPDATE_NO_COMPLETE = "update_no_complete";

    private _updates = {};            // 模块更新管理器集合
    private _queue = [];            // 更新队列
    private _isUpdating: boolean = false;         // 是否正在更新中
    private _current:AssetsManager = null;          // 当前正在更新的模块
    private _noComplete = {};            // 上次未完成的热更项

    private assetManager: AssetsManager;

    constructor() {
        super();

        this._updates = {};
        this._queue = [];
        this._isUpdating = false;
        this._current = null;
        this._noComplete = {};

        this.assetManager = new AssetsManager();
    }

    /**
     * 获取模块版本信息
     * @param localVersionLoadComplete(function)    本地版本信息加载完成
     * @param remoteVersionLoadComplete(function)   远程版本信息加载完成
     *
     */
    public getModules(remoteVersionLoadComplete) {
        if (!App.DeviceUtils.IsNative) {
            if (remoteVersionLoadComplete)
                remoteVersionLoadComplete();
            return;
        }

        this.assetManager.checkVersion(function (modules, versions) {
            this.modules = modules;
            this.versions = versions;
            if (remoteVersionLoadComplete)
                remoteVersionLoadComplete();
        }.bind(this));
    }

    /**
     * 载入未更新完的热更项
     * */
    public load() {
        if (!App.DeviceUtils.IsNative)
            return;

        var data = LocalStorageUtils.getItem(HotUpdateManager.ASSET_UPDATE_NO_COMPLETE);
        if (data) {
            var json = JSON.parse(data);
            for (var i = 0; i < json.length; i++) {
                this._noComplete[json[i]] = json[i];
            }
            LocalStorageUtils.removeItem(HotUpdateManager.ASSET_UPDATE_NO_COMPLETE);
        }
    }

    public getProgress(name: string): number {
        var am = this._updates[name];
        return am.getProgress();
    }

    /**
     * 初始化更新模块名
     * @param name(string)                 模块名
     * @param onCheckComplete(function)    检查版本完成回调
     * @param onComplete(function)         更新完成回调
     * @param onProgress(function)         更新进度回调
     * @param onNewVersion(function)       已是最新版本回调
     */
    public init(name, onCheckComplete, onComplete, onProgress, onNewVersion) {
        HotUpdateConfig.concurrent = 2;

        var am = new AssetsManager();
        am.name = name;
        am.onCheckComplete = onCheckComplete;
        am.onComplete = onComplete;
        am.on(AssetEvent.NEW_VERSION, onNewVersion);
        am.on(AssetEvent.PROGRESS, onProgress);
        am.on(AssetEvent.FAILED, this._onFailed.bind(this));
        am.on(AssetEvent.NEW_VERSION_FOUND, this._onCheckComplete.bind(this));
        am.on(AssetEvent.SUCCESS, this._onUpdateComplete.bind(this));
        am.on(AssetEvent.REMOTE_VERSION_MANIFEST_LOAD_FAILD, this._onNetError.bind(this));
        am.on(AssetEvent.REMOTE_PROJECT_MANIFEST_LOAD_FAILD, this._onNetError.bind(this));
        am.on(AssetEvent.NO_NETWORK, this._onNetError.bind(this));

        this._updates[name] = am;
    }

    /**
     *  是否没完成
     **/
    public isNoComplete(name) {
        if (this._noComplete[name] == null)
            return false;

        return true;
    }

    /**
     * 检查版本是否需要更新
     */
    public check(name): void {
        var am: AssetsManager = this._updates[name];
        am.check(name);
    }

    /**
     *  断网后恢复状态
     **/
    public recovery(name): void {
        if (this._current && this._isUpdating == false) {
            this._isUpdating = true;
            this._current.recovery();
        }
    }

    private _onFailed(event): void {
        this._isUpdating = false;
        var am: AssetsManager = event.target;
        am.check(am.name);
    }

    private _onNetError(event): void {
        this._isUpdating = false;
    }

    /**
     *  检查版本完成
     **/
    private _onCheckComplete(event) {
        this._queue.push(event.target);

        // 保存下在下载的模块状态
        this._saveNoCompleteModule();

        var am: AssetsManager = event.target;

        if (am.onCheckComplete)
            am.onCheckComplete();

        if (this._isUpdating == false) {
            this._isUpdating = true;
            this._current = event.target;
            this._current.update();
        }
    }

    private _onUpdateComplete(event) {
        var am: AssetsManager = event.target;
        if (am.onComplete)
            am.onComplete();

        // 删除当前完成的更新对象
        this._queue.shift();
        this._isUpdating = false;

        // 保存下在下载的模块状态
        this._saveNoCompleteModule();

        // 更新对列中下一个更新对象
        if (this._queue.length > 0) {
            this._isUpdating = true;
            this._current = this._queue[0];
            this._current.update();
        }
    }

    /**
     *  保存下在下载的模块状态
     **/
    private _saveNoCompleteModule() {
        var names = [];
        for (var i = 0; i < this._queue.length; i++) {
            names.push(this._queue[i].name);
        }
        LocalStorageUtils.setItem(HotUpdateManager.ASSET_UPDATE_NO_COMPLETE, JSON.stringify(names));
    }
}
