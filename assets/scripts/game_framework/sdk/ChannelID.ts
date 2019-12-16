export default class ChannelID {
    static DEFAULT: number = 0;
    static WX: number = 1;//微信
    static GoogleApp: number = 2;
    static GooglePay: number = 3;
    static YingYongBao: number = 4;
    static VIVO: number = 5;//vivo
    static TT: number = 6;//头条
}

export type LoginCallback = (err: string, data: any) => void;

export type ShareCallback = (result: boolean) => void ;