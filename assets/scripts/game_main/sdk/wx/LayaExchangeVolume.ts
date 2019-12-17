//
// import SDKManager from "../../../game_framework/sdk/SDKManager";
// import GameBoxItemModel from "./gamebox/GameBoxItemModel";
// import ToastController from "../../toast/ToastController";
//
//
// require("../../lib/AdvOTImage.js");//下载的附件放到相应的位置
// export default class LayaExchangeVolume extends  GameBoxItemModel  {
//
//
//     private showFlag:boolean = false;
//
//     isShowIcon(){
//         return this.showFlag;
//     }
//     isActive(){
//         return  cc.sys.os != cc.sys.OS_IOS;
//     }
//     constructor(){
//         super();
//         this.setAppID('wx24c7a0688503db70')
//         this.setIcon('pic/icon/layabox')
//         this.setName('游戏盒子')
//         this.init();
//     }
//
//     //初始化流量共享组件显示
//     init(): void {
//         AdvOTImage.start((isShowIcon) => {
//             this.showFlag = isShowIcon;
//             ToastController.instance().show(' isshowIcom '+isShowIcon)
//             this.publish(SDKManager.START_GAME_ICON,isShowIcon)
//         });
//         // this.getAds(10,(result)=>{
//
//         // })
//     }
//
//     /* 流量共享组件注册icon监听方法,
//     ** gameIcon 为一个远端的图片路径，需要把路径赋值给挂接的显示对象即可
//     */
//     change(): void {
//         AdvOTImage.change((isShowIcon, gameIcon) => {
//             this.publish(SDKManager.UPDATE_GAME_ICON,isShowIcon,gameIcon)
//             //这里控制组件挂接的精灵对象的显示控制，isShowIcon true 显示；false 隐藏
//         });
//     }
//
//     jump(param?: any): void {
//         AdvOTImage.navigateToMiniProgram();
//     }
// }
