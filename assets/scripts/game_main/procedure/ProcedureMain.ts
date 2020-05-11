import ProcedureBase from "../../game_framework/fsm/ProcedureBase";
import App from "../../game_framework/App";
import {SceneConsts} from "../consts/SceneConsts";
import {ViewConst} from "../consts/ViewConst";

export default class ProcedureMain extends ProcedureBase {
    constructor(owner: Object) {
        super(owner);
    }

    public onEnter(obj: Object = null): void {
        super.onEnter(obj);

        App.SceneManager.runScene(SceneConsts.Login);
        App.ViewManager.open(ViewConst.Login);
    }
}

