export default class ResourceItem {
    // 全局资源使用计数器。
    protected static resCountMap: {} = {};
    private loadCount: number = 0;
    protected resources: {} = {};
    protected useCount: number = 0;
    private url: string;
    private type: typeof cc.Asset;
    protected loadFinish: boolean  = false;
    private res:any;
    constructor(url: string, type?: typeof cc.Asset) {
        this.url = url;
        this.type = type;
    }
    isDone(){
        return this.loadFinish;
    }
    getUrl() {
        return this.url;
    }
    getType() {
        return this.type;
    }
    getRes() {
        this.useCount++;
        this.addCount();
        return this.res;
    }
    setLoadingFlag(flag){
        this.loadFinish = flag;
    }
    /**
     * 由于引擎加载机制，加载完成就已经使用，
     */
    cacheRes(res) {
        this.res = res;
        for (let key of cc.loader.getDependsRecursively(res)) {
            this.resources[key] = true;
            if (ResourceItem.resCountMap[key] == undefined || ResourceItem.resCountMap[key] == null) {
                ResourceItem.resCountMap[key] = 0;
            }
        }
    }
    getLoadCount() {
        return this.loadCount;
    }
    updateLoadCount() {
        this.loadCount++;
    }
    getUseCount() {
        return this.useCount;
    }
    releaseAll() {
        while (this.useCount > 0) {
            this.release();
        }
    }
    release() {
        if (this.useCount > 0) {
            this.useCount--;
            this.subCount();
            if (this.useCount == 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }

    }
    /**
     * 添加之后再删除，用于处理加载完成之前已经调用删除的情况。
     */
    releaseAlreadyDeleteRes() {
        let resources: string[] = Object.keys(this.resources);
        for (let index = 0; index < resources.length; index++) {
            const key = resources[index];
            if (ResourceItem.resCountMap[key] == 0) {
                cc.loader.release(key);
                delete this.resources[key];
                delete ResourceItem.resCountMap[key];
            }
        }
    }

    protected subCount() {
        let resources: string[] = Object.keys(this.resources);
        for (let index = 0; index < resources.length; index++) {
            const key = resources[index];
            if (ResourceItem.resCountMap[key] > 0) {
                ResourceItem.resCountMap[key]--;
                // Log.info("delete uuid  " + key + "  count  " + ResourceItem.resCountMap[key])
                if (ResourceItem.resCountMap[key] == 0) {
                    cc.loader.release(key);
                    delete this.resources[key];
                    delete ResourceItem.resCountMap[key];
                }
            }
        }
    }

    protected addCount() {
        let resources: string[] = Object.keys(this.resources);
        for (let index = 0; index < resources.length; index++) {
            const key = resources[index];
            ResourceItem.resCountMap[key]++;
            // Log.info("cacheRes uuid  " + key + "  count  " + ResourceItem.resCountMap[key])
        }
    }

    /**
     * 删除没有使用的资源
     */
    static removeUnUsedRes() {
        let resources: string[] = Object.keys(this.resCountMap);
        for (let index = 0; index < resources.length; index++) {
            const key = resources[index];
            const count = this.resCountMap[key];
            if (count === 0) {
                // Log.info("removeUnUsedRes uuid  " + key + "  count  " + ResourceItem.resCountMap[key])
                cc.loader.release(key);
                delete this.resCountMap[key];
            }    
        }
    }

}
