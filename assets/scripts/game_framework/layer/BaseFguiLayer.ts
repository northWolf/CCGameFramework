const {ccclass,property} = cc._decorator;

@ccclass
export default class BaseFguiLayer extends fgui.GComponent implements IBaseLayer {
	public constructor() {
		super();
	}
}