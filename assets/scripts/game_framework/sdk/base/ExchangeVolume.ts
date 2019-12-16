
export default interface ExchangeVolume {
    //初始化流量共享组件显示
    init(): void;

    // change(func: (param1: any, param2?: any) => void): void;

    jump(param?: any): void;


    isShowIcon():boolean;
    
    getAds(num: number, func: (result: any) => void): void;

}
