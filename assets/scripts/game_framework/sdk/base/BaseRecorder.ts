import SDKDataEvent from "../SDKDataEvent";
import BaseModel from "../../mvc/model/BaseModel";
import App from "../../App";

export enum ItemState {
    NOT_GET,
    GOT
}

export default abstract class BaseRecorder extends BaseModel {
    protected recorder: any;

    protected videoPath: string = null;

    protected state: ItemState = ItemState.NOT_GET

    start(obj: any) {
    }

    pause() {
    }

    resume() {
    }

    stop(isSave: boolean = true) {
    }

    //记录精彩的视频片段
    recordClip(object) {
    }

    changeState(s) {
        this.state = s;
        App.MessageCenter.dispatch(SDKDataEvent.CHANGE_RECORDER_STATE, s);
    }

    getVideoPath() {
        return this.videoPath;
    }

    isOpen() {
        return this.state == ItemState.GOT;
    }

    isClose() {
        return this.state == ItemState.NOT_GET;
    }

    getState() {
        return this.state;
    }

}
