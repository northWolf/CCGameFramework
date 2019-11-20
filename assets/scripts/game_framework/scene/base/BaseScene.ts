import BaseSpriteLayer from "../../layer/BaseSpriteLayer";
import BaseUILayer from "../../layer/BaseUILayer";
import BaseFguiLayer from "../../layer/BaseFguiLayer";

import App from "../../App";
/**
 * Scene基类
 */
export default class BaseScene {

    /** 当前所有Layer */
    private _layers: Array<IBaseLayer>;

    /**
     * 构造函数
     */
    public constructor() {
        this._layers = new Array<IBaseLayer>();
    }

    /**
     * 进入Scene调用
     */
    public onEnter(): void {

    }

    /**
     * 退出Scene调用
     */
    public onExit(): void {
        App.ViewManager.closeAll();
        this.removeAllLayer();
    }

    /**
     * 添加一个Layer到舞台
     * @param layer
     */
    public addLayer(layer: IBaseLayer): void {
        if (layer instanceof BaseSpriteLayer) {
            App.StageUtils.getStage().addChild(layer.node);
            this._layers.push(layer);
        } else if (layer instanceof BaseUILayer) {
            App.StageUtils.getUIStage().addChild(layer.node);
            this._layers.push(layer);
        } else if (layer instanceof BaseFguiLayer) {
            fgui.GRoot.inst.addChild(layer);
            this._layers.push(layer);
        }
    }

    /**
     * 添加一个Layer到舞台
     * @param layer
     */
    public addLayerAt(layer: IBaseLayer, index: number): void {
        if (layer instanceof BaseSpriteLayer) {
            App.StageUtils.getStage().addChild(layer.node, index);
            this._layers.push(layer);
        } else if (layer instanceof BaseUILayer) {
            App.StageUtils.getUIStage().addChild(layer.node, index);
            this._layers.push(layer);
        } else if (layer instanceof BaseFguiLayer) {
            fgui.GRoot.inst.addChildAt(layer, index);
            this._layers.push(layer);
        }
    }

    /**
     * 在舞台移除一个Layer
     * @param layer
     */
    public removeLayer(layer: IBaseLayer): void {
        if (layer instanceof BaseSpriteLayer) {
            App.StageUtils.getStage().removeChild(layer.node);
            this._layers.splice(this._layers.indexOf(layer), 1);
        } else if (layer instanceof BaseUILayer) {
            App.StageUtils.getUIStage().removeChild(layer.node);
            this._layers.splice(this._layers.indexOf(layer), 1);
        } else if (layer instanceof BaseFguiLayer) {
            fgui.GRoot.inst.removeChild(layer);
            this._layers.splice(this._layers.indexOf(layer.node), 1);
        }
    }

    /**
     * Layer中移除所有显示对象
     * @param layer
     */
    public layerRemoveAllChild(layer: IBaseLayer): void {
        if (layer instanceof BaseSpriteLayer) {
            layer.node.removeAllChildren();
        } else if (layer instanceof BaseUILayer) {
            (<BaseUILayer>layer).node.removeAllChildren();
        } else if (layer instanceof BaseFguiLayer) {
            layer.removeChildren();
        }
    }

    /**
     * 移除所有Layer
     */
    public removeAllLayer(): void {
        while (this._layers.length) {
            var layer: IBaseLayer = this._layers[0];
            this.layerRemoveAllChild(layer);
            this.removeLayer(layer);
        }
    }
}