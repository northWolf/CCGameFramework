import { ShareCallback } from "../ChannelID";


export default abstract class BaseShare {

    protected shareFlag: boolean = false;

    protected callback:Function = null

    constructor() {
        
    }


    abstract share(title: string, func?: ShareCallback,isShowRecorder?:boolean);


    abstract getShareInfo(shareTicket: string, func: (result: number) => void);
}
