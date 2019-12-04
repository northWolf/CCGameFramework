import App from "../../App";
import SCPacket from "./packet/SCPacket";
import CSPacket from "./packet/CSPacket";
import Log from "../../utils/Log";
import PacketBase from "./packet/PacketBase";

export default class ByteArrayMsg implements BaseMsg {

    protected _msgBuffer: egret.ByteArray;

    /**
     * 构造函数
     */
    public constructor() {
        this._msgBuffer = new egret.ByteArray();
    }

    /**
     * 接收消息处理
     * @param msg
     */
    public receive(netChannelName: string, packet: SCPacket): void {
        var obj: any = this.decode(packet);
        if (obj) {
            App.MessageCenter.dispatch(obj.key, obj.body);
        }

        //TODO double bytearray clear
        if (this._msgBuffer.bytesAvailable == 0) {
            this._msgBuffer.clear();
        }
    }

    /**
     * 发送消息处理
     * @param msg
     */
    public send(netChannelName: string, msg: CSPacket): void {
        var socket: WebSocket = App.Net.getNetChannel(netChannelName).getSocket();
        var obj: any = this.encode(msg);
        if (obj) {
            obj.position = 0;
            socket.writeBytes(obj, 0, obj.bytesAvailable);
            socket.flush();
        }
    }

    /**
     * 消息解析
     * @param msg
     */
    public decode(msg: any): any {
        Log.info("decode需要子类重写，根据项目的协议结构解析");
        return null;
    }

    /**
     * 消息封装
     * @param msg
     */
    public encode(msg: any): any {
        Log.info("encode需要子类重写，根据项目的协议结构解析");
        return null;
    }

    /** 获取数据包中的协议Id
   * @param msg 数据包
  */
    public getProtocolId(msg: PacketBase): string {
        Log.info("getProtocolId需要子类重写，根据项目的协议结构解析");
        return null;
    }
}