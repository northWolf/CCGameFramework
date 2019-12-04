import App from "../../App";
import SCPacket from "./packet/SCPacket";
import Log from "../../utils/Log";
import ByteArrayMsg from "./ByteArrayMsg";

class ByteArrayMsgByProtobuf extends ByteArrayMsg {

    /**
     * 构造函数
     */
    public constructor() {
        super();
    }

    /**
     * 接收消息处理
     * @param msg
     */
    public receive(netChannelName: string, packet: SCPacket): void {
        var obj: MahjongSCPacket = packet as MahjongSCPacket;
        if (obj) {
            var eventMsg: string = netChannelName + obj.PacketHead.MainCmdId + obj.PacketHead.SubCmdId;
            if (obj.PacketBody) {
                App.MessageCenter.dispatch(eventMsg, obj.PacketBody.bytes);
            } else {
                App.MessageCenter.dispatch(eventMsg);
            }
        }

        //TODO double bytearray clear
        if (this._msgBuffer.bytesAvailable == 0) {
            this._msgBuffer.clear();
        }
    }

    /**
     * 消息解析
     * @param msg
     */
    public decode(msg: egret.ByteArray): MahjongSCPacket {
        var packet: MahjongSCPacket = new MahjongSCPacket();
        msg.endian = "littleEndian";
        var packetLength = 0;
        if (msg.bytesAvailable >= packet.PacketHead.HeadSize) {
            packetLength = msg.readUnsignedInt();
            packet.PacketHead.MainCmdId = msg.readShort();
            packet.PacketHead.SubCmdId = msg.readShort();
            packet.PacketHead.PacketId = msg.readUnsignedInt();
        }

        if (packetLength >= packet.PacketHead.HeadSize && (msg.bytesAvailable >= (packetLength - msg.position))) {
            if (msg.bytesAvailable <= 0) {
                Log.info("收到数据：", "[" + packet.PacketHead.MainCmdId + " " + packet.PacketHead.SubCmdId + "]", "无数据体");
                return packet;
            } else {
                var bodyBytes: egret.ByteArray = new egret.ByteArray();
                bodyBytes.endian = "littleEndian";
                msg.readBytes(bodyBytes, 0, msg.length - msg.position);
                packet.PacketBody = bodyBytes;
                Log.info("收到数据：", "[" + packet.PacketHead.MainCmdId + " " + packet.PacketHead.SubCmdId + "]", this.dumpBytes(bodyBytes.bytes));
                return packet;
            }
        }
        Log.info("收到一个非法包，已抛弃。", this.dumpBytes(msg.bytes));
        return null;
    }

    /**
     * 消息封装
     * @param msg
     */
    public encode(msg: MahjongCSPacket): egret.ByteArray {
        let sendMsg: egret.ByteArray = new egret.ByteArray();
        if (msg.PacketBody) {
            App.DebugUtils.start("Protobuf Encode start");
            let bodyBytes: egret.ByteArray = new egret.ByteArray(msg.PacketBody);
            bodyBytes.endian = "littleEndian";
            App.DebugUtils.stop("Protobuf Encode stop");
            Log.info("发送数据：", "[" + msg.PacketHead.MainCmdId + " " + msg.PacketHead.SubCmdId + "]", this.dumpBytes(bodyBytes.bytes));

            sendMsg.endian = "littleEndian";
            sendMsg.writeUnsignedInt(msg.PacketHead.HeadSize + bodyBytes.length);
            sendMsg.writeShort(msg.PacketHead.MainCmdId);
            sendMsg.writeShort(msg.PacketHead.SubCmdId);
            sendMsg.writeUnsignedInt(msg.PacketHead.PacketId);
            sendMsg.writeBytes(bodyBytes);
        } else {
            Log.info("发送数据：", "[" + msg.PacketHead.MainCmdId + " " + msg.PacketHead.SubCmdId + "]", "无数据体");
            sendMsg.endian = "littleEndian";
            sendMsg.writeUnsignedInt(msg.PacketHead.HeadSize);
            sendMsg.writeShort(msg.PacketHead.MainCmdId);
            sendMsg.writeShort(msg.PacketHead.SubCmdId);
            sendMsg.writeUnsignedInt(msg.PacketHead.PacketId);
        }
        return sendMsg;
    }

    /** 获取数据包中的协议Id
     * @param packet 数据包
     */
    public getProtocolId(packet: MahjongCSPacket): string {
        return packet.PacketHead.MainCmdId + "" + packet.PacketHead.SubCmdId;
    }

    /**
     * 把二进制流Dump成字符串
     */
    private dumpBytes(bytes: Uint8Array): string {
        let result: string;
        if (App.DeviceUtils.IsMicroClientWebView) {
            result = bytes.toString();
        } else {
            result = bytes.join(",");
        }
        return result;
    }
}