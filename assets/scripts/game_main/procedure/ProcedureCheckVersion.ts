import ProcedureBase from "../../game_framework/fsm/ProcedureBase";
import App from "../../game_framework/App";
import Log from "../../game_framework/utils/Log";
import ProcedureMain from "./ProcedureMain";

export default class ProcedureCheckVersion extends ProcedureBase {
    constructor(owner: Object) {
        super(owner);
    }

    public onEnter(obj: Object = null): void {
        super.onEnter(obj);
        Log.info("可在这个流程做资源版本检测");
        App.Procedure.changeState(cc.js.getClassName(ProcedureMain));
    }
}

