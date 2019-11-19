import ProcedureLaunch from "./game_main/procedure/ProcedureLaunch";

const {ccclass, property} = cc._decorator;
import App from "./game_framework/App";
import Log from "./game_framework/utils/Log";
@ccclass
export default class Main extends cc.Component {

    start() {
        App.Init();
        App.Procedure.setOwner(this);
        App.Procedure.registerState(new ProcedureLaunch(this));
        Log.info(cc.js.getClassName(ProcedureLaunch));
        App.Procedure.changeState(cc.js.getClassName(ProcedureLaunch));
    }
}
