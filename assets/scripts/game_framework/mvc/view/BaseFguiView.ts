const {ccclass,property} = cc._decorator;
import BaseController from "../controller/BaseController";
import BaseFguiLayer from "../../layer/BaseFguiLayer";
import FairyGUIUtil from "../../../game_main/misc/FairyGUIUtil";

@ccclass
export default class BaseFguiView extends cc.Node
{
    protected _view: fgui.GComponent;
    private _controller: BaseController;
    private _myParent: BaseFguiLayer;
    private _isInit: boolean;
    private _resources: string[] = null;

    /**
     * 构造函数
     * @param $controller 所属模块
     * @param $parent 父级
     */
    public constructor($controller: BaseController, $parent: BaseFguiLayer) {
        super();
        this._controller = $controller;
        this._myParent = $parent;
        this._isInit = false;
    }

    /**
     * 设置初始加载资源
     * @param resources
     */
    public setResources(resources: string[]): void {
        this._resources = resources;
    }

    /**
     * 获取我的父级
     * @returns {BaseFguiLayer}
     */
    public get myParent(): BaseFguiLayer {
        return this._myParent;
    }

    /**
     * 是否已经初始化
     * @returns {boolean}
     */
    public isInit(): boolean {
        return this._isInit;
    }

    /**
     * 触发本模块消息
     * @param key 唯一标识
     * @param param 参数
     */
    public applyFunc(key: any, ...param: any[]): any {
        return this._controller.applyFunc.apply(this._controller, arguments);
    }

    /**
     * 触发其他模块消息
     * @param controllerKey 模块标识
     * @param key 唯一标识
     * @param param 所需参数
     */
    public applyControllerFunc(controllerKey: number, key: any, ...param: any[]): any {
        return this._controller.applyControllerFunc.apply(this._controller, arguments);
    }

    /**
     * 面板是否显示
     * @return
     */
    public isShow(): boolean {
        return true;//this.stage != null && this.visible;
    }

    /**
     * 添加到父级
     */
    public addToParent(): void {
        if (this._view != null)
            this._myParent.addChild(this._view);
    }

    /**
     * 从父级移除
     */
    public removeFromParent(): void {
        if (this._view != null && this._myParent)
            this._myParent.removeChild(this._view);
    }

    /**
     * 对面板进行显示初始化，用于子类继承
     */
    public initUI(): void {
        if (this._resources && this._resources.length > 0) {
            this._resources.forEach(element => {
                FairyGUIUtil.addPackage(element);
            });
        }
        this._isInit = true;
    }

    /**
     * 对面板数据的初始化，用于子类继承
     */
    public initData(): void {

    }

    /**
     * 面板开启执行函数，用于子类继承
     * @param param 参数
     */
    public open(...param: any[]): void {

    }

    /**
     * 面板关闭执行函数，用于子类继承
     * @param param 参数
     */
    public close(...param: any[]): void {
        this.removeFromParent();
        this._view = null;
    }

    /**
     * 销毁
     */
    public destroyView(): void {
        this._controller = null;
        this._myParent = null;
        this._resources = null;
    }

    /**
     * 屏幕尺寸变化时调用
     */
    protected onResize(): void {

    }

    /**
     * 加载面板所需资源
     * @param loadComplete
     * @param initComplete
     */
    public loadResource(loadComplete: Function, initComplete: Function): void {
        // if (this._resources && this._resources.length > 0) {
        //     var needLoadCount: number = 0;
        //     this._resources.forEach(element => {
        //         if (!FairyGUIUtil.GetUIPackageByName(element)) {
        //             needLoadCount++;
        //         }
        //     });
        //     if (needLoadCount > 0) {
        //         App.ResourceUtils.loadResource(this._resources, [], function (): void {
        //             loadComplete();
        //             initComplete();
        //         }, null, this);
        //     }
        //     else {
        //         loadComplete();
        //         initComplete();
        //     }
        // } else {
        //     loadComplete();
        //     initComplete();
        // }
    }

    /**
     * 设置是否隐藏
     * @param value
     */
    public setVisible(value: boolean): void {
        if (this._view != null)
            this._view.visible = value;
    }
}