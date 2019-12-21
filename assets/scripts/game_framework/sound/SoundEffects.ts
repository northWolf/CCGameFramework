import BaseSound from "./BaseSound";
import App from "../App";

/**
 * 音效类
 */
export default class SoundEffects extends BaseSound {

    private _volume: number;

    /**
     * 构造函数
     */
    public constructor() {
        super();
    }

    /**
     * 播放一个音效
     * @param effectName
     */
    public play(effectName: string): void {
        var sound: cc.AudioClip = this.getSound(effectName);
        if (sound) {
            this.playSound(sound);
        }
    }

    /**
     * 播放
     * @param sound
     */
    private playSound(sound: cc.AudioClip): void {
       cc.audioEngine.play(sound, false, this._volume);
    }

    /**
     * 设置音量
     * @param volume
     */
    public setVolume(volume: number): void {
        this._volume = volume;
        cc.audioEngine.setEffectsVolume(volume);
    }

    /**
     * 资源加载完成后处理播放
     * @param key
     */
    public loadedPlay(key: string): void {
        this.playSound(App.ResManager.getRes(key, cc.AudioClip));
    }
}