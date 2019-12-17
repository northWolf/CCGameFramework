export default class LoginConst {
    public static LOGIN_ACCOUNT_C2S: number = 10001;
    public static LOGIN_SDK_C2S: number = 10002;
    public static LOGIN_RES_S2C: number = 10003;
    public static REFRESH_PLAY_COUNT: number = 10004;

    public static LOGIN_UI_PKG = {
        "name":"MainMenu",
        "path":"ui/MainMenu"
    }
}

enum LoginBgClickStatus {
    /**不可触摸*/
    UNTOUCHABLE = 0,

    /**请求GlobalInfo信息*/
    REQUEST_GLOBAL_INFO,

    /**请求资源版本信息*/
    REQUEST_RESOURCE_VERSION,

    /**请求SDK登录*/
    REQUEST_SDK_LOGIN,
}