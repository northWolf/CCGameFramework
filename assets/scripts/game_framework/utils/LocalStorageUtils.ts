export default class LocalStorageUtils {

    private static hashID: string;

    public static setHashID(openid: string): void {
        LocalStorageUtils.hashID = openid;
        LocalStorageUtils.setItem('hashID', openid, true);
    }

    public static getHashID(): string {
        return LocalStorageUtils.getItem('hashID', true);
    }

    public static setItem(key: string, value: string, isGlobal: boolean = false): void {
        if (isGlobal) {
            cc.sys.localStorage.setItem(key, value);
        } else {
            cc.sys.localStorage.setItem(`${LocalStorageUtils.hashID}_${key}`, value);
        }
    }

    public static getItem(key: string, isGlobal: boolean = false): string {
        if (isGlobal) {
            return cc.sys.localStorage.getItem(key);
        } else {
            return cc.sys.localStorage.getItem(`${LocalStorageUtils.hashID}_${key}`);
        }
    }

    public static removeItem(key: string, isGlobal: boolean = false): void {
        if (isGlobal) {
            cc.sys.localStorage.removeItem(key);
        } else {
            cc.sys.localStorage.removeItem(`${LocalStorageUtils.hashID}_${key}`);
        }
    }

    public static clearAll(): void {
        cc.sys.localStorage.clear();
    }
}