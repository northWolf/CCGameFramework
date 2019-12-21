/**
 * 背景音乐类
 */
import App from "../App";
import BaseSound from "./BaseSound";

export default class SoundBg extends BaseSound {

    private m_Name: string;
    private m_CurSound: cc.AudioClip;
    private m_CurSoundChannel: number;
    private m_Volume: number;

    /**
     * 构造函数
     */
    public constructor() {
        super();
        this.m_Name = "";
    }

    /**
     * 停止当前音乐
     */
    public stop(): void {
        cc.audioEngine.stop(this.m_CurSoundChannel);
        this.m_CurSoundChannel = null;
        this.m_CurSound = null;
        this.m_Name = "";
    }

    /**
     * 播放某个音乐
     * @param effectName
     */
    public play(effectName: string): void {
        if (this.m_Name == effectName)
            return;
        this.stop();
        this.m_Name = effectName;
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
        this.m_CurSound = sound;
        this.m_CurSoundChannel = cc.audioEngine.play(this.m_CurSound, false, this.m_Volume);
    }

    /**
     * 设置音量
     * @param volume
     */
    public setVolume(volume: number): void {
        this.m_Volume = volume;
        cc.audioEngine.setMusicVolume(this.m_Volume);
    }

    /**
     * 资源加载完成后处理播放
     * @param key
     */
    public loadedPlay(key: string): void {
        if (this.m_Name == key) {
            this.playSound(App.ResManager.getRes(key, cc.AudioClip));
        }
    }

    /**
     * 检测一个文件是否要清除
     * @param key
     * @returns {boolean}
     */
    public checkCanClear(key: string): boolean {
        return this.m_Name != key;
    }
}