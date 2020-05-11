import BaseClass from "../base/BaseClass";

export default class StageUtils extends BaseClass{
    /** UIStage单例 */
    private static _uiStage: cc.Node;

    private static _stage:cc.Node;

    /**
     * 构造函数
     */
    public constructor() {
        super();

        let canvas = cc.find("Canvas");

        if (StageUtils._stage == null) {
            StageUtils._stage = new cc.Node();
            StageUtils._stage.name = "Stage";
            canvas.addChild(StageUtils._stage);
        }

        if (StageUtils._uiStage == null) {
            StageUtils._uiStage = new cc.Node();
            StageUtils._uiStage.name = "UIStage";
            canvas.addChild(StageUtils._uiStage);
        }
    }

    public getStage():cc.Node
    {
         return StageUtils._stage;
    }

    public getCCUIStage():cc.Node
    {
        return StageUtils._uiStage;
    }

    public clear():void
    {
        StageUtils._uiStage.cleanup();
        StageUtils._uiStage = null;
        StageUtils._stage.cleanup();
        StageUtils._stage = null;
    }
}
