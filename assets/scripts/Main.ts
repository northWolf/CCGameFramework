import App from "./game_framework/App";
import ProcedureLaunch from "./game_main/procedure/ProcedureLaunch";
import ProcedureMain from "./game_main/procedure/ProcedureMain";
import ProcedureCheckVersion from "./game_main/procedure/ProcedureCheckVersion";

const {ccclass, property} = cc._decorator;


@ccclass
export default class Main extends cc.Component {

    start() {
        App.Procedure.setOwner(this);
        App.Procedure.registerState(new ProcedureLaunch(this));
        App.Procedure.registerState(new ProcedureMain(this));
        App.Procedure.registerState(new ProcedureCheckVersion(this));
        App.Procedure.changeState(cc.js.getClassName(ProcedureLaunch));
    }
}
