import ResourceDownloader from "./ResourceDownloader";
import App from "../App";
import Log from "../utils/Log";
import HotUpdateConfig from "./HotUpdateConfig";
import Manifest from "./Manifest";
import HttpRequest from "./HttpRequest";
import LocalStorageUtils from "../utils/LocalStorageUtils";
import ResourceItem from "../resource/ResourceItem";

export class ResourceDownloadEvent {
    public static readonly NEW_VERSION: string = "asset_new_version";                           // 已是最新版本
    public static readonly NEW_VERSION_FOUND: string = "asset_new_version_found";                     // 找到新版本
    public static readonly SUCCESS: string = "asset_success";                               // 更新成功
    public static readonly FAILED: string = "asset_failed";                                // 更新失败
    public static readonly PROGRESS: string = "asset_progress";                              // 更新进度
    public static readonly LOCAL_PROJECT_MANIFEST_LOAD_FAIL: string = "asset_local_project_manifest_load_fail";      // 获取本地资源清单文件失败
    public static readonly REMOTE_VERSION_MANIFEST_LOAD_FAILD: string = "asset_remote_version_manifest_load_faild";    // 获取远程版本配置文件失败
    public static readonly REMOTE_PROJECT_MANIFEST_LOAD_FAILD: string = "asset_remote_project_manifest_load_faild";    // 获取远程更新单清文件失败
    public static readonly NO_NETWORK: string = "asset_no_network";                            // 断网
}

export default class ResourceDownloaderManager extends cc.EventTarget {
    public static readonly LOCAL_STORAGE_ASSET_FOLDER: string = "local-storage-asset-folder";       // 本地缓存资源目录
    public static readonly LOCAL_STORAGE_KEY_MODULE_PROJECT_MANIFEST: string = "update_project";          // 本地缓存清单数据
    public static readonly LOCAL_STORAGE_KEY_UPDATE_STATE: string = "update_state";            // 本地缓存更新状态数据（每完成一个资源下载会记录完成数据队列)
    public static readonly MODULE_PROJECT_MANIFEST_PATH: string = "version/{0}_project";     // 模块清单路径

    public name: string;
    private _progress: number;  // 更新进度
    private _isUpdating: boolean;   // 是否正在更新中

    private _appManifest: Manifest;  // 安装包内的清单数据（JSON对象)
    private _localManifest: Manifest; // 本地缓存里的清单数据（JSON对象)
    private _remoteManifest: Manifest; // 远程更新服务器的清单数据（JSON对象)

    private _moduleName;   // 模块名
    private _moduleManifestKey: string;
    private _moduleStateKey: string;

    private _resourceDownloader: ResourceDownloader;
    private _nocache: number;

    private _storagePath: string; //本地缓存里的版本资源目录路径

    public onCheckComplete;
    public onComplete;

    /**
     *  更新进度
     **/
    public getProgress(): number {
        return this._progress;
    }

    /**
     * 对比服务器版本信息
     * @param moduleName(string)       模块名称
     */
    public check(moduleName: string):void {
        if (this._isUpdating == true) {
            Log.info(App.StringUtils.Format("【更新】模块{0}正在更新中", moduleName));
            return;
        }

        if (App.DeviceUtils.IsNative) {
            this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + ResourceDownloaderManager.LOCAL_STORAGE_ASSET_FOLDER);

            if (jsb.fileUtils.isDirectoryExist(this._storagePath) == false) {
                jsb.fileUtils.createDirectory(this._storagePath);
            }

            Log.info(App.StringUtils.Format("【更新】版本本地存储路径 {0}", this._storagePath));
        } else {
            this._storagePath = "";
        }

        this._nocache = App.DateUtils.now();
        this._resourceDownloader = new ResourceDownloader();

        this._moduleName = moduleName;
        this._moduleManifestKey = ResourceDownloaderManager.LOCAL_STORAGE_KEY_MODULE_PROJECT_MANIFEST + "_" + moduleName;
        this._moduleStateKey = ResourceDownloaderManager.LOCAL_STORAGE_KEY_UPDATE_STATE + "_" + moduleName;

        this._progress = 0;
        this._isUpdating = true;

        this._loadLocalManifest(App.StringUtils.Format(ResourceDownloaderManager.MODULE_PROJECT_MANIFEST_PATH, moduleName));
    }

    /**
     * 加载本地项目中资源清单数据
     **/
    private _loadLocalManifest(moduleAppManifestPath) {
        App.ResManager.loadRes(moduleAppManifestPath, cc.JsonAsset, function (error, content:ResourceItem) {
            if (error) {
                Log.info(App.StringUtils.Format("【更新】获取游戏安装包中路径为 {0} 的资源清单文件失败:{1}", moduleAppManifestPath,error));
                this._dispatchEvent(ResourceDownloadEvent.LOCAL_PROJECT_MANIFEST_LOAD_FAIL);
                return;
            }

            // 安装包中版本清单数据解析
            try {
                this._appManifest = content.getRes().json;
            } catch (e) {
                Log.error("【更新】安装包中的版本清单数据解析错误");
                return;
            }

            // 获取本地存储中版本清单数据（上次更新成功后的远程清单数据）
            var data = LocalStorageUtils.getItem(this._moduleManifestKey);
            if (data) {
                try {
                    this._localManifest = JSON.parse(data);
                } catch (e) {
                    Log.error("【更新】本地版本清单数据解析错误");
                }

                // 安装包中的版本高于本地存储版本，则替换本地存储版本数据
                if (this._localManifest.version < this._appManifest.version) {
                    // 删除本地存储中的当前模块的旧的资源
                    for (var key in this._localManifest.assets) {
                        // @ts-ignore
                        var filePath = cc.path.join(this._storagePath, key);
                        if (jsb.fileUtils.isFileExist(filePath)) {
                            jsb.fileUtils.removeFile(filePath);
                        }
                    }

                    Log.info(App.StringUtils.Format("【更新】安装包的版本号为{0}，本地存储版本号为{1}，替换本地存储版本数据", this._appManifest.version, this._localManifest.version))
                    this._localManifest = this._appManifest;
                }
            } else {
                Log.info("【更新】第一次安装，获取安装包中的版本清单数据");
                this._localManifest = this._appManifest;
            }
            // 检查版本号
            this._checkVersion();
        }.bind(this));
    }

    /**
     *  检查版本号
     **/
    private _checkVersion() {
        var complete = function (content) {
            /** 远程版本数据解析 */
            try {
                var remoteVersion = JSON.parse(content);

                // 本地资源版本小于远程版本时，提示有更新
                if (HotUpdateConfig.debugVersion || this._localManifest.version < remoteVersion.version) {
                    Log.info(App.StringUtils.Format("【更新】当前版本号为 {0}，服务器版本号为 {1}, 有新版本可更新", this._localManifest.version, remoteVersion.version));
                    this._dispatchEvent(ResourceDownloadEvent.NEW_VERSION_FOUND);       // 触发有新版本事件
                } else {
                    Log.info("【更新】当前为最新版本");
                    this._isUpdating = false;
                    this._dispatchEvent(ResourceDownloadEvent.NEW_VERSION);             // 触发已是最新版本事件
                }
            } catch (e) {
                Log.error("【更新】远程路版本数据解析错误");
            }
        }.bind(this);

        var error = function (error) {
            Log.info(App.StringUtils.Format("【更新】获取远程路径为 {0} 的版本文件失败", this._localManifest.remoteVersion));
            this._isUpdating = false;
            this._dispatchEvent(ResourceDownloadEvent.REMOTE_VERSION_MANIFEST_LOAD_FAILD);
        }.bind(this);

        if (HotUpdateConfig.testUpdate)
            this._localManifest.server = HotUpdateConfig.testCdn;

        // 获取远程版本数据
        var url = this._localManifest.server + HotUpdateConfig.line + "/" + this._localManifest.remoteVersion;
        HttpRequest.getInstance().get(this._noCache(url), complete, error);
    }

    /**
     *  开始更新版本
     **/
    public update() {
        // 获取本地存储更新状态数据，如果有则继续上次的更新，无则下载远程服务器版本清单数据
        var tempManifest = LocalStorageUtils.getItem(this._moduleStateKey);
        if (tempManifest == null) {
            var complete = function (content) {
                // 解析远程资源清单数据
                try {
                    this._remoteManifest = JSON.parse(content);
                } catch (e) {
                    Log.error("【更新】远程路版本清单数据解析错误");
                }

                // 分析并下载资源
                this._downloadAssets();
            }.bind(this);

            var error = function (error) {
                Log.info(App.StringUtils.Format("【更新】获取远程路径为 {0} 的版本清单文件失败", this._remoteManifest.remoteManifest));

                this._isUpdating = false;

                this._dispatchEvent(ResourceDownloadEvent.REMOTE_PROJECT_MANIFEST_LOAD_FAILD);
            }.bind(this);

            if (HotUpdateConfig.testUpdate)
                this._localManifest.server = HotUpdateConfig.testCdn;

            var url = this._localManifest.server + HotUpdateConfig.line + "/" + this._localManifest.remoteManifest;
            HttpRequest.getInstance().get(this._noCache(url), complete, error);
        } else {
            Log.info("【更新】获取上次没更新完的版本清单更新状态");

            this._remoteManifest = JSON.parse(tempManifest);

            // 分析并下载资源
            this._downloadAssets();
        }
    }

    /** 开始下载资源 */
    private _downloadAssets() {
        // 触发热更进度事件
        this._resourceDownloader.onProgress = function (relativePath, percent) {
            this._progress = percent;

            // 记录当前更新状态，更新失败时做为恢复状态使用
            this._remoteManifest.assets[relativePath].state = true;
            LocalStorageUtils.setItem(this._moduleStateKey, JSON.stringify(this._remoteManifest));

            this._dispatchEvent(ResourceDownloadEvent.PROGRESS);
        }.bind(this);

        // 触发热更完成事件
        this._resourceDownloader.onComplete = function () {
            this._isUpdating = false;

            // 删除更新状态数据
            LocalStorageUtils.removeItem(this._moduleStateKey);

            // 更新本地版本清单数据，用于下次更新时做版本对比
            for (var key in this._remoteManifest.assets) {
                var asset = this._remoteManifest.assets[key];
                if (asset.state) delete asset.state;
            }
            LocalStorageUtils.setItem(this._moduleManifestKey, JSON.stringify(this._remoteManifest));

            // 触发热更完成事件
            this._dispatchEvent(ResourceDownloadEvent.SUCCESS);
        }.bind(this);

        // 触发热更失败事件
        this._resourceDownloader.onFail = function () {
            this._isUpdating = false;
            this._dispatchEvent(ResourceDownloadEvent.FAILED);
        }.bind(this);

        // 触发断网事件
        this._resourceDownloader.onNoNetwork = function () {
            this._isUpdating = false;
            this._dispatchEvent(ResourceDownloadEvent.NO_NETWORK);
        }.bind(this);

        this._resourceDownloader.download(this._storagePath, this._localManifest, this._remoteManifest);
    }

    /**
     *  断网后恢复状态
     **/
    public recovery() {
        this._resourceDownloader.recovery();
    }

    /**
     * 触发事件
     * @param type(string)      事件类型
     * @param args(object)      事件参数
     */
    private _dispatchEvent(type, ...args) {
        var event = new cc.Event.EventCustom(type, false);
        event.target = this;
        event.currentTarget = this;
        this.dispatchEvent(event);
    }

    /** 规避 HTTP 缓存问题 */
    private _noCache(url) {
        return url + "?t=" + this._nocache;
    }

    /**
     *  验证是否有覆盖安装，安装包中版本高于本地资源时，删除本地资源的模块资源
     **/
    public checkVersion(remoteVersion) {
        var moduleTotal = 0;
        var moduleCurrent = 0;

        // 加载安装包中的版本清单文件
        var loadAppManifest = function (moduleName, modules, versions, remoteVersionLoadComplete) {
            var appManifestPath = App.StringUtils.Format(ResourceDownloaderManager.MODULE_PROJECT_MANIFEST_PATH, moduleName);
            App.ResManager.loadRes(appManifestPath, cc.TextAsset, function (error, content) {
                if (error) {
                    Log.error(App.StringUtils.Format("【更新】验证是否有覆盖安装时，获取游戏安装包中路径为 {0} 的资源清单文件失败", appManifestPath));
                    return;
                }

                var storagePath: string;
                if (App.DeviceUtils.IsNative) {
                    storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + ResourceDownloaderManager.LOCAL_STORAGE_ASSET_FOLDER);
                } else {
                    storagePath = "";
                }

                var appManifest = JSON.parse(content.getRes());
                var appVersion = appManifest.version;

                // 获取本地版本清单信息
                var moduleManifest = ResourceDownloaderManager.LOCAL_STORAGE_KEY_MODULE_PROJECT_MANIFEST + "_" + moduleName;
                var manifest = LocalStorageUtils.getItem(moduleManifest);
                if (manifest) {
                    var localManifest = JSON.parse(manifest);
                    var localVersion = localManifest.version;

                    // 安装包中的版本高于本地存储版本，则替换本地存储版本数据
                    if (localVersion < appVersion) {
                        // 删除本地存储中的当前模块的旧的资源
                        for (var key in localManifest.assets) {
                            // @ts-ignore
                            var filePath = cc.path.join(storagePath, key);
                            if (jsb.fileUtils.isFileExist(filePath)) {
                                jsb.fileUtils.removeFile(filePath);
                            }
                        }

                        versions[moduleName] = appVersion;                             // 有本地清单数据时，当前版本号为安装包版本号
                        modules[moduleName] = modules[moduleName] > appVersion;       // 有本地清单数据时，安装包版本号小于远程版本号
                    } else {
                        versions[moduleName] = localVersion;                           // 有本地清单数据时，当前版本号为本地版本号
                        modules[moduleName] = modules[moduleName] > localVersion;     // 有本地清单数据时，本地清单版本号小于远程版本号
                    }
                } else {
                    versions[moduleName] = appVersion;                                 // 没有本地清单数据时，当前版本号为安装包版本号
                    modules[moduleName] = modules[moduleName] > appVersion;           // 没有本地清单数据时，安装包版本号小于远程版本号
                }

                moduleCurrent++;

                if (moduleCurrent == moduleTotal) {
                    if (remoteVersionLoadComplete)
                        remoteVersionLoadComplete(modules, versions);
                }
            });
        }

        // 游戏所有模块的配置文件
        var url = App.StringUtils.Format("https://{0}:3001/constinfo/version.json?t={1}", HotUpdateConfig.gateSocketIp, App.DateUtils.now().toString());

        if (HotUpdateConfig.testUpdate)
            url = App.StringUtils.Format("http://{0}:3001/constinfo/version.json?t={1}", HotUpdateConfig.testIp, App.DateUtils.now().toString());

        // 加载游戏模块最新版本数据
        HttpRequest.getInstance().get(url, function (version_json) {
            var json = JSON.parse(version_json);
            var modules = json.modules;
            var versions = {};
            HotUpdateConfig.line = json.line;

            // 计算游戏共有多少个模块
            for (var moduleName in modules) {
                moduleTotal++;
            }

            // 载入游戏所有安装包中的模块版本数据
            for (var moduleName in modules) {
                loadAppManifest(moduleName, modules, versions, remoteVersion);
            }
        }.bind(this));
    }

    /**
     * 删除模块
     * @param moduleName(string)    模块名
     */
    public delete(moduleName) {
        var storagePath: string;
        if (App.DeviceUtils.IsNative) {
            storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + ResourceDownloaderManager.LOCAL_STORAGE_ASSET_FOLDER);
        } else {
            storagePath = "";
        }
        var data = LocalStorageUtils.getItem(ResourceDownloaderManager.LOCAL_STORAGE_KEY_MODULE_PROJECT_MANIFEST + "_" + moduleName);
        if (data) {
            try {
                var localManifest = JSON.parse(data);

                for (var key in localManifest.assets) {
                    // @ts-ignore
                    var filePath = cc.path.join(storagePath, key);
                    if (jsb.fileUtils.isFileExist(filePath)) {
                        jsb.fileUtils.removeFile(filePath);
                    }
                }
            } catch (e) {
                cc.error("【更新】删除模块时,本地版本清单数据解析错误");
            }

            LocalStorageUtils.removeItem(ResourceDownloaderManager.LOCAL_STORAGE_KEY_MODULE_PROJECT_MANIFEST + "_" + moduleName);
            LocalStorageUtils.removeItem(ResourceDownloaderManager.LOCAL_STORAGE_KEY_UPDATE_STATE + "_" + moduleName);
        }
    }
}

