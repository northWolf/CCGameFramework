import BaseModel from "../../../../game_framework/mvc/model/BaseModel";
import BaseController from "../../../../game_framework/mvc/controller/BaseController";

export default class LoginModel extends BaseModel {


    /**
     * 构造函数
     * @param $controller 所属模块
     */
    public constructor($controller: BaseController) {
        super($controller);
    }
}
