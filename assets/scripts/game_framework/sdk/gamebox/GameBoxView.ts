
import GameBoxManager from "./GameBoxManager";

import GameBoxController from "./GameBoxController";
import SDKManager from "../SDKManager";
import BaseView from "../../base/view/BaseView";
import ResItem from "../../res/ResItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameBoxView extends BaseView {

    @property(cc.Label)
    label_title: cc.Label = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.JsonAsset)
    config: cc.JsonAsset = null;


    protected model: GameBoxManager;
    protected controller: GameBoxController;

    start() {
        this.model.init(this.config)
        let localList = this.model.getList();
        if (localList.length > 0) {
            this.getLoader().loadRes('prefabs/battle/GameBoxItemView', cc.Prefab, (err, resItem: ResItem) => {
                if (err || !this.node) {
                    return;
                }
                for (let index = 0; index < localList.length; index++) {
                    const element = localList[index];
                    let node = cc.instantiate(resItem.getRes())
                    if (node) {
                        this.content.addChild(node)
                        this.controller.initView(node, 'GameBoxItemView', element)
                    }
                }

            })
        }
        // SDKManager.getChannel().getAds(10,(list:GameBoxItemModel[])=>{
        //     if(list.length > 0){
        //         this.getLoader().loadRes('prefabs/battle/GameBoxItemView',cc.Prefab,(err,resItem:ResItem)=>{
        //             if(err || !this.node){
        //                 return;
        //             }
        //             for (let index = 0; index < list.length; index++) {
        //                 const element = list[index];
        //                 let node = cc.instantiate(resItem.getRes())
        //                 if(node){
        //                     this.content.addChild(node)
        //                     this.controller.initView(node,'GameBoxItemView',element)
        //                 }
        //             }                

        //         })
        //     }
        // })

        SDKManager.getChannel().showInterstitialAd(() => {

        })

    }



}
