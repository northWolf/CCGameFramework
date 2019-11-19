import ProcedureBase from "../../game_framework/fsm/ProcedureBase";
import Log from "../../game_framework/utils/Log";

export default class ProcedureLaunch extends ProcedureBase
{
    constructor(owner: Object) {
        super(owner);
    }

    public onInit(...args: any[]): void {
        super.onInit(args);
        Log.info("init in ProcedureLaunch");
    }

    public onEnter(obj: Object = null): void {
        super.onEnter(obj);
        Log.info("enter in ProcedureLaunch");
    }

    public onUpdate(): void {
        super.onUpdate();
        Log.info("update in ProcedureLaunch");
    }

    public onLeave(preKey: string): void {
        super.onLeave(preKey);
        Log.info("Leave in ProcedureLaunch");
    }
}