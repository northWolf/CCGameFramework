import Log from "../../game_framework/utils/Log";
import LayerManager from "../../game_framework/layer/LayerManager";

export default class FairyGUIUtil {
    /** 记录所有的提示框 */
    private static _list_prompts: any[] = [];

    public static packageFileExtension: string = "lh";

     /**
     * 获取UI包
     * @param resKey ui包名
     */
    public static GetUIPackageByName(pkgName: string):fgui.UIPackage
    {
        return fgui.UIPackage.getByName(pkgName);
    }

    /**
     * 添加UI包
     * @param resKey ui包名
     * @param descData ui包的描述文件内容
     */
    public static addPackage(pkgName: string): void {
        if(!FairyGUIUtil.GetUIPackageByName(pkgName))
        {
            fgui.UIPackage.addPackage(pkgName);
            Log.info("解析UI包:",pkgName,"完成");
        }
    }

    /**
     * 设置组件全屏显示
     */
    public static makeFullScreen(com: fgui.GComponent) {
        com.setSize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
    }

    /**
     * 根据字符串路劲返回类型为FGUI的子对象
     * @param _com 自对象 
     * @param _path 以正斜杠/分割的路径
     * @return fgui.GObject对象
     */
    public static GFindChild(_com, _path: string): fgui.GObject {
        if(_com != null)
        {
            var _p_arr = _path.split("/");
            var _temp_com = _com;

            for (var i: number = 0; i < _p_arr.length; i++) {
                _temp_com = _temp_com.getChild(_p_arr[i]);
                if (_temp_com == null) {
                    Log.trace("解析组件路径时返回了nil，路径" + _path + "组件=" + _p_arr[i]);
                    return null;
                }
            }
            return _temp_com;
        }
        else
        {
            Log.trace("父组件是空的，子对象路径" + _path);
            return null;
        }
    }

    /**
     * 显示普通提示框
     */
    public static show_common_prompt(_content, _confirmCallback?: Function, _cancelCallback?: Function) {
        var commonPromptPanel: fgui.GComponent = fgui.UIPackage.createObject("ui_pkg_base", "common_dialog").asCom;
        commonPromptPanel.name = "common_dialog";
        commonPromptPanel.getChild("lb_content").text = _content;

        function cancelCallBack() {
            if (_cancelCallback) {
                _cancelCallback();
            }
            LayerManager.UI_Tips.removeChild(commonPromptPanel);
            commonPromptPanel.dispose();
        }
        commonPromptPanel.getChild("btn_cancle").onClick(() => { cancelCallBack(); },this);

        function confirmCallBack() {
            if (_confirmCallback) {
                _confirmCallback();
            }
            commonPromptPanel.dispose();
            LayerManager.UI_Tips.removeChild(commonPromptPanel);
        }
        commonPromptPanel.getChild("btn_confirm").onClick(() => { confirmCallBack(); },this);
        commonPromptPanel.center();
        LayerManager.UI_Tips.addChild(commonPromptPanel);
        commonPromptPanel.getTransition("start").play();
    }

    /**
     * 显示只有确定按钮的提示框
     */
    public static show_confirm_prompt_dialog(_content, _confirmCallback?: Function) {
        var commonPromptPanel: fgui.GComponent = fgui.UIPackage.createObject("ui_pkg_base", "common_confirm_dialog").asCom;
        commonPromptPanel.name = "common_confirm_dialog";
        commonPromptPanel.getChild("lb_content").text = _content;

        function confirmCallBack() {
            if (_confirmCallback) {
                _confirmCallback();
            }
            commonPromptPanel.dispose();
            LayerManager.UI_Tips.removeChild(commonPromptPanel);
        }
        commonPromptPanel.getChild("btn_confirm").onClick(() => { confirmCallBack(); },this);
        commonPromptPanel.center();
        LayerManager.UI_Tips.addChild(commonPromptPanel);
        commonPromptPanel.getTransition("start").play();
    }

    /**
     * 显示文字提示
     * @param _content 提示内容
     */
    public static show_tips_by_msg(_content: string): void {
        let com_tips: fgui.GComponent = fgui.UIPackage.createObject("ui_pkg_base", "com_tips").asCom;
        com_tips.center();
        let txt_content: fgui.GTextField = com_tips.getChild("txt_content").asTextField;
        txt_content.text = _content;

        LayerManager.UI_Tips.addChild(com_tips);

        com_tips.getTransitionAt(0).play(() => {
            com_tips.removeFromParent();
        });
    }

    /**
     * 显示文字提示
     * @param _errorId 提示内容id
     */
    public static show_tips_by_errorId(_errorId: number): void {
        let com_tips: fgui.GComponent = fgui.UIPackage.createObject("ui_pkg_base", "com_tips").asCom;
        com_tips.center();
        let txt_content: fgui.GTextField = com_tips.getChild("txt_content").asTextField;
        // txt_content.text = overall_tips_info_data.getOverallTipsStrByTipId(_errorId);
        //
        // LayerManager.UI_Tips.addChild(com_tips);

        com_tips.getTransitionAt(0).play(() => {
            com_tips.removeFromParent();
        });
    }

    private static m_isShowingBlockLayer: boolean;
    private static m_blockLayerTimersCallback: Function;
    private static m_blockLayerPanel: fgui.GComponent;

    /**
     * 显示等待菊花
     */
    public static show_block_layer(_intervalSeconds: number = 15, _hideCallback = null) {
        _intervalSeconds *= 1000;
        FairyGUIUtil.m_blockLayerTimersCallback = function (_isToHide) {
            if (_hideCallback != null) {
                _hideCallback();
            }
            if (_isToHide) {
                FairyGUIUtil.hide_block_layer();
            }
        };

        if (FairyGUIUtil.m_isShowingBlockLayer) {
            if (FairyGUIUtil.m_blockLayerTimersCallback != null) {
                // fgui.GTimers.inst.remove(FairyGUIUtil.m_blockLayerTimersCallback, this);
                FairyGUIUtil.m_blockLayerTimersCallback(false);
                // fgui.GTimers.inst.add(_intervalSeconds, 1, FairyGUIUtil.m_blockLayerTimersCallback, this, true);
            }
        } else {
            FairyGUIUtil.m_isShowingBlockLayer = true;
            if (FairyGUIUtil.m_blockLayerPanel == null) {
                FairyGUIUtil.m_blockLayerPanel = fgui.UIPackage.createObject("ui_pkg_base", "block_layer").asCom;
                FairyGUIUtil.m_blockLayerPanel.name = "blockLayerPanel";
                LayerManager.UI_Tips.addChild(FairyGUIUtil.m_blockLayerPanel);
                FairyGUIUtil.makeFullScreen(FairyGUIUtil.m_blockLayerPanel);
            }
            FairyGUIUtil.m_blockLayerPanel.visible = true;
            FairyGUIUtil.m_blockLayerPanel.getTransition("t0").play();
            // fgui.GTimers.inst.add(_intervalSeconds, 1, FairyGUIUtil.m_blockLayerTimersCallback, null, true);
        }
    }

    /**
     * 隐藏等待菊花
     */
    public static hide_block_layer() {
        if (FairyGUIUtil.m_blockLayerPanel != null) {
            FairyGUIUtil.m_blockLayerPanel.getTransition("t0").stop();
            FairyGUIUtil.m_blockLayerPanel.visible = false;
            // fgui.GTimers.inst.remove(FairyGUIUtil.m_blockLayerTimersCallback, this);
        }
        FairyGUIUtil.m_isShowingBlockLayer = false;
    }

    /**
     * 截屏
     * @param com 要截屏的fairygui显示组件
     * @param isSaveToPhotoAlbum 是否同时保存到手机相册
     */
    public static async capture_screen(title: string, com: fgui.GComponent, isSaveToPhotoAlbum: boolean = false) {

    }
}