import BaseClass from "../base/BaseClass";
import Log from "../utils/Log";
import State from "./State";
import Dictionary from "../utils/Dictionary";

export default class StateMachine extends BaseClass {

	public static InvalidState: string = "Invalid";

	protected _stateDic: Dictionary;
	protected _currentState: State = null;
	protected _lastState: State = null;
	protected _globalState: State = null;
	protected _owner: Object;

	constructor(owner: Object) {
		super();
		this._stateDic = new Dictionary();
		this._owner = owner;
	}

	public isExist(stateKey: string): boolean {
		return this._stateDic.has(stateKey);
	}

	public getStateByKey(stateKey: string): State {
		return this._stateDic.get(stateKey);
	}

	public setOwner(owner: Object): void {
		this._owner = owner;
	}

	public getOwner():Object
	{
		return this._owner;
	}

	/**
	 * 注册状态 
	 * @param key
	 * @param state
	 * 
	 */
	public registerState(state: State): void {
		if (this._owner != state.owner) {
			Log.trace("statemachine 与 state 所有者不一致");
			return;
		}
		var key: string = cc.js.getClassName(state);
		Log.info(key);
		this._stateDic.add(key, state);
	}

	public setGlobalState(state: State, obj: Object = null): void {
		this._globalState = state;
		this._globalState.onEnter(obj);
	}

	/**
	 * 移除状态 
	 * @param key
	 */
	public removeState(key: string): void {
		this._stateDic.del(key);
	}

	/**
	 * 改变状态 
	 * @param key
	 * @param obj
	 */
	public changeState(key: string, obj: Object = null): void {
		var newState: State = this._stateDic.get(key);
		if (newState == null) {
			Log.error("unregister state type: " + key);
			return;
		}

		if (this._currentState != null && this._lastState != null && this._currentState.getStateKey() == this._lastState.getStateKey())
			return;

		if (this._currentState != null) {
			this._currentState.onLeave(newState.getStateKey());
		}

		this._lastState = this._currentState;
		this._currentState = newState;
		if (!this._currentState.inited)
			this._currentState.onInit(obj);
		this._currentState.onEnter(obj);
	}

	public reEnterState(obj: Object = null): void {
		if (this._currentState)
			this._currentState.onReEnter(obj);
	}

	/**
	 * 更新
	 */
	public update(): void {
		if (this._globalState != null)
			this._globalState.onUpdate();
		if (this._currentState != null)
			this._currentState.onUpdate();
	}

	/**
	 * 当前状态类型  
	 * @return
	 */
	public getCurrentState(): string {
		if (this._currentState != null) {
			return this._currentState.getStateKey();
		}
		return StateMachine.InvalidState;
	}

	/**
	 * 清除
	 */
	public clear(): void {
		if (this._currentState != null)
			this._currentState.onLeave(StateMachine.InvalidState);
		this._stateDic.clear();
		this._currentState = null;
		this._lastState = null;
	}
}