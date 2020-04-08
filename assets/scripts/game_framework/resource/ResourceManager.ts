import ResourceItem from "./ResourceItem";
import ResourceDirectory from "./ResourceDirectory";
import BaseClass from "../base/BaseClass";
import Log from "../utils/Log";
import App from "../App";
import {isNull} from "../utils/GlobalDefine";

export default class ResourceManager extends BaseClass {
    private resCache = {}
    private dirCache = {};

    public getKey(url: string) {
        let key = App.PathUtil.getFileNameWithoutExtension(url);
        return key;
    }

    /**
     * 根据绝对路径 加载单个文件
     * @param url 绝对路径，可以是本地路径 也可以是远程路径
     * @param _type
     * @param callback
     */
    public load(url: string, _type?: string, callback?: (err: string, res: ResourceItem) => void) {
        let ts = this.getKey(url);
        let item: ResourceItem = this.resCache[ts];
        if (item && item.isDone()) {
            if (callback) callback(null, item);
            return;
        } else {
            item = new ResourceItem(ts);
            this.resCache[ts] = item;
        }

        let func = (err, res: cc.Asset) => {
            item.updateLoadCount();
            if (err) {
                if (item.getLoadCount() <= 3) {
                    Log.warn(" item.getLoadCount()  =========== ", item.getLoadCount())
                    cc.loader.load(url, func);
                } else {
                    Log.warn(" res load fail url is " + url);
                    this.resCache[ts] = null;
                    if (callback) callback(err, null);
                }
            } else {
                item.cacheRes(res);
                if (this.resCache[ts]) {
                    item.setLoadingFlag(true)
                    if (callback) callback(err, item);
                } else {
                    item.releaseAlreadyDeleteRes();
                }
            }
        }

        let extension = App.PathUtil.getExtensionByFilePath(url);
        if (isNull(extension)) {
            if (isNull(_type)) {
                Log.error("res load fail,url need extension or param _type");
                return;
            } else {
                cc.loader.load(url + "." + _type, func);
            }
        } else {
            cc.loader.load(url, func);
        }
    }

    /**
     * 根据相对resources目录的路径加载单个文件
     * @param url
     * @param type
     * @param callback
     */
    public loadRes(url: string, type: typeof cc.Asset, callback?: (err: string, res: ResourceItem) => void) {
        let ts = this.getKey(url);
        let item: ResourceItem = this.resCache[ts]
        // Log.info(" loadRes url ",url,' ts ',ts);
        if (item && item.isDone()) {
            if (callback) callback(null, item);
            return;
        } else {
            item = new ResourceItem(ts, type);
            this.resCache[ts] = item;
        }

        let func = (err, res: cc.Asset) => {
            item.updateLoadCount();
            if (err) {
                if (item.getLoadCount() <= 3) {
                    Log.warn(" item.getLoadCount()  =========== ", item.getLoadCount())
                    cc.loader.loadRes(url, type, func);
                } else {
                    Log.warn(" res load fail url is " + url);
                    this.resCache[ts] = null;
                    if (callback) callback(err, null);
                }
            } else {
                item.cacheRes(res);
                if (this.resCache[ts]) {
                    item.setLoadingFlag(true)
                    if (callback) callback(err, item);
                } else {
                    item.releaseAlreadyDeleteRes();
                }
            }
        }
        cc.loader.loadRes(url, type, func);
    }

    /**
     * 并行加载多个资源。
     * @param list 需要加载的资源列表
     * @param type 需要加载的资源类型，要求所有资源统一类型
     * @param callback 加载后的回调
     * @param loader 资源加载管理器，默认是全局管理器。
     */
    public loadResArray(list: Array<string>, type: typeof cc.Asset, callback?: (err: string) => void) {
        let resCount = 0;
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            // Log.info(" start load ============ ",element);
            this.loadRes(element, type, (err) => {
                // 不论是否都加载成功都返回。
                if (err) {
                    Log.info(err);
                    if (callback) callback(err);
                    return;
                }
                resCount++;
                if (resCount >= list.length) {
                    if (callback) callback(null);
                }
            });
        }
    }

    public loadResDir(path: string, callback?: (err: string, res: ResourceItem) => void) {
        let item: ResourceDirectory = this.dirCache[path]
        if (item && item.isDone()) {
            if (callback) callback(null, item);
            return;
        } else {
            item = new ResourceDirectory(path);
            this.dirCache[path] = item;
        }

        let func = (err, res: cc.Asset[]) => {
            item.updateLoadCount();
            if (err) {
                if (item.getLoadCount() <= 3) {
                    Log.warn(" item.getLoadCount()  =========== ", item.getLoadCount())
                    cc.loader.loadResDir(path, func)
                } else {
                    Log.warn(" res load fail url is " + path);
                    this.dirCache[path] = null;
                    if (callback) callback(err, null);
                }
            } else {
                item.cacheRes(res);
                if (this.dirCache[path]) {
                    item.setLoadingFlag(true)
                    callback(err, item);
                } else {
                    item.releaseAlreadyDeleteRes();
                }
            }
        }
        cc.loader.loadResDir(path, func)
    }

    /**
     * 获取资源的唯一方式
     * @param url
     * @param type
     */
    public getRes(url: string, type: typeof cc.Asset) {
        let ts = this.getKey(url)
        let item = this.resCache[ts];
        if (item) {
            return item.getRes();
        } else {
            let res = cc.loader.getRes(url, type);
            if (res) { // 如果其他管理器已经加载了资源，直接使用。
                Log.info(' 其他加载器已经加载了次资源 ', url)
                let item = new ResourceItem(url, type);
                item.cacheRes(item)
                this.resCache[ts] = item
                return item.getRes();
            } else {
                Log.warn('getRes url ', url, ' ts ', ts)
            }

        }
        return null;
    }

    public preloadScene(url: string, callback?: (err: string, res: ResourceItem) => void) {
        let type = cc.SceneAsset
        let ts = this.getKey(url)
        let item: ResourceItem = this.resCache[ts]
        if (item) {
            if (callback) callback(null, item);
            return;
        }
        item = new ResourceItem(url, cc.SceneAsset);
        this.resCache[ts] = item;
        let func = (err, res) => {
            item.updateLoadCount();
            if (err) {
                if (item.getLoadCount() <= 3) {
                    cc.director.preloadScene(url, func);
                } else {
                    Log.error(" res load fail sceneName is " + url);
                    this.resCache[ts] = null;
                    if (callback) callback(err, null);
                }
            } else {
                item.cacheRes(res);
                if (this.resCache[ts]) {
                    if (callback) callback(err, item);
                } else {
                    item.releaseAlreadyDeleteRes();
                }

            }
        }
        cc.director.preloadScene(url, func);
    }

    /**
     * 清理单个资源
     * @param url
     * @param type
     */
    public releaseRes(url: string, type: typeof cc.Asset) {
        let ts = this.getKey(url);
        let item = this.resCache[ts];
        if (item) {
            if (item.release()) {
                this.resCache[ts] = null;
            }
        }
    }

    public releaseDir(path: string) {
        let dir: ResourceDirectory = this.dirCache[path];
        if (dir) {
            if (dir.release()) {
                this.dirCache[path] = null;
            }
        }
    }

    /**
     * 删除所有资源
     */
    public release() {
        let resources: string[] = Object.keys(this.resCache);
        for (let index = 0; index < resources.length; index++) {
            const key = resources[index];
            const element: ResourceItem = this.resCache[key];
            if (element) {
                element.releaseAll();
                this.resCache[key] = null;
            } else {
                Log.warn("ResourceManager.release.url is error = ", key)
            }
        }
        let dirs: string[] = Object.keys(this.dirCache)
        for (let index = 0; index < dirs.length; index++) {
            const key = dirs[index];
            const dir: ResourceDirectory = this.dirCache[key];
            if (dir) {
                dir.releaseAll();
                this.dirCache[key] = null;
            }

        }
        // ResourceItem.removeUnUsedRes();
    }
}
