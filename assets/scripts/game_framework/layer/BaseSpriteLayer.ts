const {ccclass,property} = cc._decorator;

@ccclass
export default class BaseSpriteLayer extends cc.Component implements IBaseLayer {
    public constructor() {
        super();
    }
}