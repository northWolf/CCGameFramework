import BaseClass from "../base/BaseClass";

export default class StageUtils extends BaseClass{
    /** UIStage单例 */
    private static _uiStage: cc.Node;

    /**
     * 构造函数
     */
    public constructor() {
        super();

        if (StageUtils._uiStage == null) {
            StageUtils._uiStage = new cc.Node();
            StageUtils._uiStage.name = "Stage";
            this.getStage().addChild(StageUtils._uiStage);
        }
    }

    public getStage():cc.Node
    {
        return cc.find("CCGameFramework/Inbuilts/UI");
    }

    public getUIStage():cc.Node
    {
        return StageUtils._uiStage;
    }
}