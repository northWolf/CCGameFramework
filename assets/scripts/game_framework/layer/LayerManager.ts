import BaseSpriteLayer from "./BaseSpriteLayer";
import BaseFguiLayer from "./BaseFguiLayer";
import BaseCCUILayer from "./BaseCCUILayer";

/**
 * 游戏层级类
 */
export default class LayerManager {

    /**
     * 游戏背景层
     * @type {BaseSpriteLayer}
     */
    public static Game_Bg: BaseSpriteLayer;

    /**
     * 主游戏层
     * @type {BaseSpriteLayer}
     */
    public static Game_Main: BaseSpriteLayer;

    /**
     * UI主界面
     * @type {BaseFguiLayer}
     */
    public static UI_Main: BaseFguiLayer;

    /**
     * UI弹出框层
     * @type {BaseFguiLayer}
     */
    public static UI_Popup: BaseFguiLayer;

    /**
     * UI警告消息层
     * @type {BaseFguiLayer}
     */
    public static UI_Message: BaseFguiLayer;

    /**
     * UITips层
     * @type {BaseFguiLayer}
     */
    public static UI_Tips: BaseFguiLayer;

    /**
     * 启动Loading专用层
     * @type {BaseCCUILayer}
     */
    public static UI_Loading: BaseCCUILayer;

    public static init():void
    {
        this.Game_Bg = new BaseSpriteLayer();
        this.Game_Main = new BaseSpriteLayer();
        this.UI_Main = new BaseFguiLayer();
        this.UI_Popup = new BaseFguiLayer();
        this.UI_Message = new BaseFguiLayer();
        this.UI_Tips = new BaseFguiLayer();
        this.UI_Loading = new BaseCCUILayer();
    }
}