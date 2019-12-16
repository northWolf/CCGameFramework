
import GameBoxItemModel from "./GameBoxItemModel";
import SarsGameBox from "../wx/SarsGameBox";
import LayaExchangeVolume from "../wx/LayaExchangeVolume";
import BaseModel from "../../base/model/BaseModel";




// let gameList:{appID:string,icon:string,name:string}[] =[
//     {appID:'wx868235558c0d3aa9',icon:'pic/icon/shotgame',name:'球球杀手'},
//     {appID:'wx2a02f21858074353',icon:'pic/icon/xingjizhan',name:'星际战'},
//     {appID:'wxafe2a6cc8c9031ee',icon:'pic/icon/xiaoxiaodamaoxian',name:'消消大冒险'},  
// ]

export default class GameBoxManager extends BaseModel {


    private static ins:GameBoxManager;


    static instance():GameBoxManager{
        if(!this.ins){
            this.ins = new GameBoxManager();
        }
        return this.ins;
    }

    init(config:any){
        let gameList = config.gameList;
        let sarsgame = new SarsGameBox();
        if (sarsgame.isActive()) {
            this.addItem(sarsgame)
        }        
        for (let index = 0; index < gameList.length; index++) {
            const element = gameList[index];
            let box = new GameBoxItemModel()
            box.setName(element.name)
            box.setAppID(element.appID)
            box.setIcon(element.icon)
            this.addItem(box)
            
        }
        let laya = new LayaExchangeVolume()
        if(laya.isActive()){
            this.addItem(laya)
        }
       
    }

    private list:GameBoxItemModel[] = []

    addItem(item:GameBoxItemModel){
        this.list.push(item)
    }

    getList():GameBoxItemModel[]{
        return this.list;
    }

    

}
