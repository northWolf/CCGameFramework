import App from "../App";
import ResourceItem from "../resource/ResourceItem";
import SoundManager from "./SoundManager";

/**
 * Sound基类
 */
export default class BaseSound {

    public _cache: any;
    public _loadingCache: Array<string>;

    /**
     * 构造函数
     */
    public constructor() {
        this._cache = {};
        this._loadingCache = new Array<string>();

        (App.Procedure.getOwner() as cc.Component).schedule(function() {
            this.dealSoundTimer();
        }, 0, 0, SoundManager.CLEAR_TIME);
    }

    /**
     * 处理音乐文件的清理
     */
    private dealSoundTimer(): void {
            var currTime: number = App.DateUtils.now();
            var keys = Object.keys(this._cache);
            for (var i: number = 0, len = keys.length; i < len; i++) {
                var key = keys[i];
                if (!this.checkCanClear(key))
                    continue;
                if (currTime - this._cache[key] >= SoundManager.CLEAR_TIME) {
                    delete this._cache[key];
                    App.ResManager.releaseRes(key,cc.AudioClip);
                }
            }
        }

    /**
     * 获取Sound
     * @param key
     * @returns {egret.Sound}
     */
    public getSound(key: string): cc.AudioClip {
        var sound: cc.AudioClip = App.ResManager.getRes(key,cc.AudioClip);
        if (sound) {
            if (this._cache[key]) {
                this._cache[key] = App.DateUtils.now();
            }
        } else {
            if (this._loadingCache.indexOf(key) != -1) {
                return null;
            }

            this._loadingCache.push(key);
            App.ResManager.loadRes(key,cc.AudioClip, this.onResourceLoadComplete.bind(this));
        }
        return sound;
    }

    /**
     * 资源加载完成
     * @param event
     */
    private onResourceLoadComplete(err: string, res: ResourceItem): void {
        var key:string = res.getUrl();
        var index: number = this._loadingCache.indexOf(key);
        if (index != -1) {
            this._loadingCache.splice(index, 1);
            this._cache[key] = App.DateUtils.now();
            this.loadedPlay(key);
        }
    }

    /**
     * 资源加载完成后处理播放，子类重写
     * @param key
     */
    public loadedPlay(key: string): void {

    }

    /**
     * 检测一个文件是否要清除，子类重写
     * @param key
     * @returns {boolean}
     */
    public checkCanClear(key: string): boolean {
        return true;
    }
}