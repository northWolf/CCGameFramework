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
    public static Game_Bg: BaseSpriteLayer = new BaseSpriteLayer();

    /**
     * 主游戏层
     * @type {BaseSpriteLayer}
     */
    public static Game_Main: BaseSpriteLayer = new BaseSpriteLayer();

    /**
     * UI主界面
     * @type {BaseFguiLayer}
     */
    public static UI_Main: BaseFguiLayer = new BaseFguiLayer();

    /**
     * UI弹出框层
     * @type {BaseFguiLayer}
     */
    public static UI_Popup: BaseFguiLayer = new BaseFguiLayer();

    /**
     * UI警告消息层
     * @type {BaseFguiLayer}
     */
    public static UI_Message: BaseFguiLayer = new BaseFguiLayer();

    /**
     * UITips层
     * @type {BaseFguiLayer}
     */
    public static UI_Tips: BaseFguiLayer = new BaseFguiLayer();

    /**
     * 启动Loading专用层
     * @type {BaseCCUILayer}
     */
    public static UI_Loading: BaseCCUILayer = new BaseCCUILayer();
}