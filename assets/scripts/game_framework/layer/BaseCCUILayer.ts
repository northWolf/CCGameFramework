import BaseCCUIView from "../mvc/view/BaseCCUIView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseCCUILayer implements IBaseLayer {
    _container: cc.Node;

    public constructor() {
        this._container = new cc.Node();
        this._container.name = cc.js.getClassName(this);
    }

    public get container():cc.Node
    {
        return this._container;
    }

    public getChild(child:BaseCCUIView):void
    {
        this._container.getChildByUuid(child.displayObject.uuid);
    }

    public addChild(child:BaseCCUIView):void
    {
        this._container.addChild(child.displayObject);
    }

    public removeChild(child:BaseCCUIView):void
    {
        this._container.removeChild(child.displayObject);
    }
}