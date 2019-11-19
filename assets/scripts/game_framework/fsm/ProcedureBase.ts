import State from "./State";
export default class ProcedureBase extends State {

	public onInit(...args: any[]): void {
		super.onInit(args);
	}

	public onEnter(obj: Object = null): void {
		super.onEnter(obj);
	}

	public onUpdate(): void {
		super.onUpdate();
	}

	public onLeave(preKey: string): void {
		super.onLeave(preKey);
	}

	public getStateKey(): string {
		return cc.js.getClassName(this)
	}
}