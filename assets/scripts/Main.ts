const {ccclass, property} = cc._decorator;

import ProcedureLaunch from "./game_main/procedure/ProcedureLaunch";
import App from "./game_framework/App";
import Log from "./game_framework/utils/Log";
@ccclass
export default class Main extends cc.Component {

    start() {
        App.Procedure.setOwner(this);
        App.Procedure.registerState(new ProcedureLaunch(this));
        App.Procedure.changeState(cc.js.getClassName(ProcedureLaunch));
    }
}
