import BaseModel from "../../framework/base/model/BaseModel";
import DataEvent from "../DataEvent";
import { ItemState } from "../../framework/tools/Define";


export default class BaseRecorder extends BaseModel {


    protected recorder: any;

    protected videoPath:string = null;

    protected state:ItemState = ItemState.NOT_GET
    start(obj: any) { }
    pause() { }
    resume(){}
    stop(isSave:boolean = true) {}
    //记录精彩的视频片段
    recordClip( object){}

    changeState(s){
        this.state = s;
        this.publish(DataEvent.CHANGE_RECORDER_STATE,s)
    }

    getVideoPath(){
        return this.videoPath;
    }

    isOpen(){
        return this.state == ItemState.GOT;
    }

    isClose(){
        return this.state == ItemState.NOT_GET;
    }

    getState(){
        return this.state;
    }
    
}
