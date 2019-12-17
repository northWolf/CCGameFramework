import ResourceItem from "./ResourceItem";
import ResourceDirectory from "./ResourceDirectory";
import BaseClass from "../base/BaseClass";
import Log from "../utils/Log";

export default class ResourceManager extends BaseClass {
    private resCache = {}
    private dirCache = {};

    /**
     * 清理单个资源
     * @param url
     * @param type
     */
    releaseRes(url: string, type: typeof cc.Asset) {
        let ts = this.getKey(url, type);
        let item = this.resCache[ts];
        if (item) {
            if (item.release()) {
                this.resCache[ts] = null;
            }
        }
    }

    releaseDir(path: string) {
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
    release() {
        let resources: string[] = Object.keys(this.resCache);
        for (let index = 0; index < resources.length; index++) {
            const key = resources[index];
            const element: ResourceItem = this.resCache[key];
            if (element) {
                element.releaseAll();
                this.resCache[key] = null;
            } else {
                // Log.warn("ResLoader release url  =  is error  ",key)
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

    getKey(url: string, type: typeof cc.Asset) {
        let key = url;
        return key;
    }

    /**
     * 并行加载多个资源。
     * @param list 需要加载的资源列表
     * @param type 需要加载的资源类型，要求所有资源统一类型
     * @param func 加载后的回调
     * @param loader 资源加载管理器，默认是全局管理器。
     */
    loadArray(list: Array<string>, type: typeof cc.Asset, func: (err: string) => void) {
        let resCount = 0;
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            // Log.info(" start load ============ ",element);
            this.loadRes(element, type, (err) => {
                // 不论是否都加载成功都返回。
                if (err) {
                    Log.info(err);
                    func(err);
                    return;
                }
                resCount++;
                if (resCount >= list.length) {
                    if (func) {
                        func(null);
                    }
                }
            });
        }
    }

    /**
     * 加载单个文件
     * @param url
     * @param type
     * @param callback
     */
    loadRes(url: string, type: typeof cc.Asset, callback: (err: string, res: ResourceItem) => void) {
        let ts = this.getKey(url, type);
        let item: ResourceItem = this.resCache[ts]
        // Log.info(" loadRes url ",url,' ts ',ts);
        if (item && item.isDone()) {
            callback(null, item);
            return;
        } else {
            item = new ResourceItem(url, type);
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
                    callback(err, null);
                }
            } else {
                item.cacheRes(res);
                if (this.resCache[ts]) {
                    item.setLoadingFlag(true)
                    callback(err, item);
                } else {
                    item.releaseAlreadyDeleteRes();
                }


            }
        }
        cc.loader.loadRes(url, type, func);
    }

    loadDir(path: string, callback: (err: string, res: ResourceItem) => void) {
        let item: ResourceDirectory = this.dirCache[path]
        if (item && item.isDone()) {
            callback(null, item);
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
                    callback(err, null);
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
    getRes(url: string, type: typeof cc.Asset) {
        let ts = this.getKey(url, type)
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


    preloadScene(url: string, callback: (err: string, res: ResourceItem) => void) {
        let type = cc.SceneAsset
        let ts = this.getKey(url, type)
        let item: ResourceItem = this.resCache[ts]
        if (item) {
            callback(null, item);
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
                    callback(err, null);
                }
            } else {
                item.cacheRes(res);
                if (this.resCache[ts]) {
                    callback(err, item);
                } else {
                    item.releaseAlreadyDeleteRes();
                }

            }
        }
        cc.director.preloadScene(url, func);
    }

    loadRemote(url: string, callback: (err, resItem: ResourceItem) => void) {
        let type = cc.Texture2D
        let ts = this.getKey(url, type)
        let item: ResourceItem = this.resCache[ts]
        if (item) {
            callback(null, item);
            return;
        }
        item = new ResourceItem(url, type);
        this.resCache[ts] = item;
        let func = (err, res: cc.Texture2D) => {
            item.updateLoadCount();
            if (err) {
                if (item.getLoadCount() <= 3) {
                    cc.loader.load(url, func);
                } else {
                    Log.error(" res load fail, resName is " + url);
                    this.resCache[ts] = null;
                    callback(err, null);
                }
            } else {
                item.cacheRes(res);
                if (this.resCache[ts]) {
                    callback(err, item);
                } else {
                    item.releaseAlreadyDeleteRes();
                }

            }
        }
        cc.loader.load(url, func);
    }
}
