import ResourceItem from "./ResourceItem";

export default class ResourceDirectory extends ResourceItem {
    private result: cc.Asset [];

    constructor(path: string) {
        super(path, cc.Asset)
    }

    cacheRes(results: cc.Asset[]) {
        this.result = results;
        for (let index = 0; index < results.length; index++) {
            const res = results[index];
            super.cacheRes(res);
        }
    }

    getRes(): cc.Asset[] {
        this.useCount++;
        this.addCount();
        return this.result;
    }
}
