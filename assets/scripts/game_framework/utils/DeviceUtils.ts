import BaseClass from "../base/BaseClass";

export default class DeviceUtils extends BaseClass {

    /**
     * 构造函数
     */
    public constructor() {
        super();
    }

    /**
     * 当前是否Html5版本
     * @returns {boolean}
     * @constructor
     */
    public get IsHtml5(): boolean {
        return cc.sys.isBrowser;
    }

    /**
     * 当前是否是Native版本
     * @returns {boolean}
     * @constructor
     */
    public get IsNative(): boolean {
        return cc.sys.isNative;
    }

    /**
     * 当前是否是微信小游戏版本
     * @returns {boolean}
     * @constructor
     */
    public get IsWxGame(): boolean {
        return cc.sys.platform == cc.sys.WECHAT_GAME;
    }

    /**
     * 当前是否是微端版本
     */
    public get IsMicroClient(): boolean {
        return true;
    }

    /**
     * 当前是否是微端WebView
     */
    public get IsMicroClientWebView(): boolean {
        return this.IsMicroClient && this.IsHtml5;
    }

    /**
     * 当前是否是微端Runtime
     */
    public get IsMicroClientRuntime(): boolean {
        return this.IsMicroClient && !this.IsHtml5;
    }

    /**
     * 是否是在手机上
     * @returns {boolean}
     * @constructor
     */
    public get IsMobile(): boolean {
        return cc.sys.isMobile;
    }

    /**
     * 是否是在PC上
     * @returns {boolean}
     * @constructor
     */
    public get IsPC(): boolean {
        return !cc.sys.isMobile;
    }

    /**
     * 是否是QQ浏览器
     * @returns {boolean}
     * @constructor
     */
    public get IsQQBrowser(): boolean {
        return this.IsHtml5 && navigator.userAgent.indexOf('MQQBrowser') != -1;
    }

    /**
     * 是否是IE浏览器
     * @returns {boolean}
     * @constructor
     */
    public get IsIEBrowser(): boolean {
        return this.IsHtml5 && navigator.userAgent.indexOf("MSIE") != -1;
    }

    /**
     * 是否是Firefox浏览器
     * @returns {boolean}
     * @constructor
     */
    public get IsFirefoxBrowser(): boolean {
        return this.IsHtml5 && navigator.userAgent.indexOf("Firefox") != -1;
    }

    /**
     * 是否是Chrome浏览器
     * @returns {boolean}
     * @constructor
     */
    public get IsChromeBrowser(): boolean {
        return this.IsHtml5 && navigator.userAgent.indexOf("Chrome") != -1;
    }

    /**
     * 是否是Safari浏览器
     * @returns {boolean}
     * @constructor
     */
    public get IsSafariBrowser(): boolean {
        return this.IsHtml5 && navigator.userAgent.indexOf("Safari") != -1;
    }

    /**
     * 是否是Opera浏览器
     * @returns {boolean}
     * @constructor
     */
    public get IsOperaBrowser(): boolean {
        return this.IsHtml5 && navigator.userAgent.indexOf("Opera") != -1;
    }
}