import Log from "../utils/Log";
import Manifest from "./Manifest";
import HotUpdateConfig from "./HotUpdateConfig";
import App from "../App";
import HttpRequest from "./HttpRequest";

export default class AssetsDownload {
    private _storagePath: string;
    private _localManifest: Manifest;
    private _remoteManifest: Manifest;

    private _nocache: number;

    private _downloadUnits: string[]; // 下载文件对象集合
    private _completeUnits: string[]; // 已下载完成对象集合
    private _failedUnits: string[]; // 下载失败文件对象集合
    private _deleteUnits: string[]; // 需要删除文件对象集合

    private _downloadCompleteNum: number;// 下载完成的文件数量
    private _downloadFailedNum: number; // 下载失败的文件数量
    private _failedCount: number;// 下载失败的次数
    private _concurrentCurrent: number;  // 并发数量当前值

    private _totalUnits: number; // 当前总更新单位数量 = 更新完成文件数量 + 待更新文件数量
    private _items: string[];


    public onComplete;
    public onProgress;
    public onFail;
    public onNoNetwork;

    /**
     *  分析并获取需要更新的资源
     *  */
    public download(storagePath, localManifest, remoteManifest): void {
        this._storagePath = storagePath;
        this._localManifest = localManifest;
        this._remoteManifest = remoteManifest;

        this._nocache = App.DateUtils.now();

        this._downloadUnits = [];
        this._completeUnits = [];
        this._failedUnits = [];
        this._deleteUnits = [];

        this._downloadCompleteNum = 0;
        this._downloadFailedNum = 0;
        this._failedCount = 0;
        this._concurrentCurrent = 0;

        this._analysisDownloadUnits();
        this._analysisDeleteUnits();


        this._totalUnits = this._downloadCompleteNum + this._downloadUnits.length;

        Log.info(App.StringUtils.Format("【更新】共有{0}个文件需要更新", this._downloadUnits.length.toString()));
        Log.info(App.StringUtils.Format("【更新】共有{0}个文件需要删除", this._deleteUnits.length.toString()));

        this._items = this._downloadUnits.slice(0);

        if (this._items.length > 0) {
            this._downloadAsset();
        } else {
            Log.info("【更新】无更新文件，更新完成");
            if (this.onComplete)
                this.onComplete();
        }
    }

    /**
     *  对比本地项目清单数据和服务器清单数据，找出本地缺少的以及和服务器不一样的资源
     **/
    private _analysisDownloadUnits(): void {
        for (var key in this._remoteManifest.assets) {
            if (this._localManifest.assets.hasOwnProperty(key)) {
                // 远程版本的文件 MD5 值和本地不同时文件需要下载
                if (HotUpdateConfig.debugRes || this._remoteManifest.assets[key]["md5"] != this._localManifest.assets[key]["md5"]) {
                    Log.info("【更新】准备下载更新的资源 ", key);
                    this._addDownloadUnits(key);
                }
            } else {
                Log.info("【更新】准备下载本是不存在的资源 ", key);
                this._addDownloadUnits(key);
            }
        }
    }

    /**
     *  对比本地项目清单数据和服务器清单数据，找出本地多出的资源
     **/
    private _analysisDeleteUnits(): void {
        for (var key in this._localManifest.assets) {
            if (this._remoteManifest.assets.hasOwnProperty(key) == false) {
                Log.info("【更新】准备删除的资源 ", key);
                this._deleteUnits.push(key);
            }
        }
    }

    /**
     *  添加下载单位
     **/
    private _addDownloadUnits(key: string): void {
        if (this._remoteManifest.assets[key]["state"] != true) {
            this._downloadUnits.push(key);
        } else {
            this._downloadCompleteNum++;
        }
    }

    /** 断网后恢复更新状态 */
    public recovery(): void {
        this._downloadAsset();
    }

    /** 下载资源 */
    private _downloadAsset(): void {
        if (HotUpdateConfig.testUpdate)
            this._remoteManifest.server = HotUpdateConfig.testCdn;

        var relativePath: string = this._items.shift();
        // @ts-ignore
        var url: string = cc.path.join(this._remoteManifest.server, HotUpdateConfig.line, relativePath);

        // 下载成功
        var complete = function (asset) {
            // 文件保存到本地
            this._saveAsset(relativePath, asset);

            // 记录更新完成的文件
            this._completeUnits.push(relativePath);

            // 下载完成的文件数量加 1
            this._downloadCompleteNum++;

            if (HotUpdateConfig.debugProgress)
                Log.info(App.StringUtils.Format("【更新】进度 {0}/{1}，当前有 {2} 个资源并行下载", this._downloadCompleteNum, this._totalUnits, this._concurrentCurrent));

            // 还原并发数量
            this._concurrentCurrent--;

            // 更新进度事件
            if (this.onProgress) {
                this.onProgress(relativePath, this._downloadCompleteNum / this._totalUnits);
            }

            // 判断是否下载完成
            this._isUpdateCompleted();
        }.bind(this);

        // 下载失败
        var error = function (error) {
            this._failedUnits.push(relativePath);
            this._concurrentCurrent--;
            this._downloadFailedNum++;


            Log.info(App.StringUtils.Format("【更新】下载远程路径为 {0} 的文件失败，错误码为 {1}", url, error));
            Log.info(App.StringUtils.Format("【更新】进度 {0}/{1}, 总处理文件数据为 {2}", this._downloadCompleteNum, this._totalUnits, this._downloadCompleteNum + this._downloadFailedNum));

            this._isUpdateCompleted();

        }.bind(this);

        HttpRequest.getInstance().getByArraybuffer(this._noCache(url), complete, error);

        // 开启一个并行下载队列
        this._concurrentCurrent++;
        if (this._concurrentCurrent < HotUpdateConfig.concurrent) {
            this._downloadAsset();
        }
    }

    /** 下载失败的资源 */
    private _downloadFailedAssets() {
        // 下载失败的文件数量重置
        this._downloadFailedNum = 0;
        this._downloadUnits = this._failedUnits;
        this._failedUnits = [];
        this._items = this._downloadUnits.slice(0);

        if (this._items.length > 0) {
            this._downloadAsset();
        }
    }

    /** 判断是否全部更新完成 */
    private _isUpdateCompleted() {
        var handleCount = this._downloadCompleteNum + this._downloadFailedNum;                    // 处理完成数量

        if (this._totalUnits == this._downloadCompleteNum) {                                   // 全下载完成
            Log.info("【更新】更新完成");

            // 触发热更完成事件
            if (this.onComplete) this.onComplete();

            // 删除本地比服务器多出的文件
            this._deleteAssets();
        } else if (this._totalUnits == handleCount) {                                         // 全处理完成，有下载失败的文件，需要重试
            Log.info("【更新】下载文件总数量　　：", this._totalUnits);
            Log.info("【更新】下载成功的文件数量：", this._downloadCompleteNum);
            Log.info("【更新】下载失败的文件数量：", this._downloadFailedNum);

            // 更新失败的次数加 1
            this._failedCount++;

            if (this._failedCount < 3) {
                Log.info(App.StringUtils.Format("【更新】更新重试第 {0} 次", this._failedCount.toString()));

                this._downloadFailedAssets();
            } else {
                Log.info("【更新】更新失败");

                // 触发热更失败事件
                if (this.onFail) this.onFail();
            }
        } else if (this._items.length > 0 && this._concurrentCurrent < HotUpdateConfig.concurrent) {      // 队列下载
            this._downloadAsset();
        }
    }

    /**
     *  删除本地比服务器多出的文件
     **/
    private _deleteAssets() {
        for (var i = 0; i < this._deleteUnits.length; i++) {
            var relativePath = this._deleteUnits[i];
            // @ts-ignore
            var filePath = cc.path.join(this._storagePath, relativePath);
            if (jsb.fileUtils.removeFile(filePath)) {
                Log.info(App.StringUtils.Format("【更新】版本多余资源 {0} 删除成功", filePath));
            } else {
                Log.info(App.StringUtils.Format("【更新】版本多余资源 {0} 删除失败", filePath));
            }
            ;
        }
    }

    /**
     *  文件保存到本地
     **/
    private _saveAsset(relativePath, asset) {
        if (cc.sys.isNative) {
            // @ts-ignore
            var storeDirectory = cc.path.join(this._storagePath, relativePath.substr(0, relativePath.lastIndexOf("/")));
            // @ts-ignore
            var storePath = cc.path.join(this._storagePath, relativePath);

            // 存储目录
            if (jsb.fileUtils.isDirectoryExist(storeDirectory) == false) {
                jsb.fileUtils.createDirectory(storeDirectory);
            }

            // 存储文件
            jsb.fileUtils.writeDataToFile(new Uint8Array(asset), storePath);
        }
    }

    /**
     *  规避 HTTP 缓存问题
     **/
    private _noCache(url: string): string {
        return url + "?t=" + this._nocache;
    }
}
