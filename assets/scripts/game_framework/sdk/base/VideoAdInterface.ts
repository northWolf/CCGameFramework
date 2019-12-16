
export default interface VideoAdInterface {

    createVideoAd(id:string,callback:Function):void;

    show(callback: (isFinish: boolean) => void):void;

    callback(num:number);

    isLoad():boolean;

}
