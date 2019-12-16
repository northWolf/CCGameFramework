
import SDKManager from "../SDKManager";
import BaseItemModel from "../../base/model/BaseItemModel";



export default class GameBoxItemModel extends BaseItemModel {


    private appID:string = null;

    private icon:string = null;

    private image:string = null;

    private name:string = null;

    private desc: string = null;
    
    isActive(){
        return true;
    }
    setDesc(desc:string){
        this.desc = desc;
    }

    getDesc(){
        return this.desc;
    }

    setName(name:string){
        this.name = name;
    }

    getName(){
        return this.name;
    }

    setAppID(appID:string){
        this.appID = appID;
    }

    getAppID():string{
        return this.appID;
    }

    setIcon(icon:string){
        this.icon = icon;
    }

    getIcon():string{
        return this.icon;

    }

    setImage(img:string){
        this.image = img;
    }

    getImage():string{
        return this.image;
    }

    jump(){
        if(this.getImage()){
            SDKManager.getChannel().showImage(this.getImage())
        }else{
            SDKManager.getChannel().jumpToApp(this.getAppID())
        }  
    }
}
