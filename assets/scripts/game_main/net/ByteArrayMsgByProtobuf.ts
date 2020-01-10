import App from "../../game_framework/App";
import SCPacket from "../../game_framework/net/socket/packet/SCPacket";
import Log from "../../game_framework/utils/Log";
import ByteArrayMsg from "../../game_framework/net/socket/ByteArrayMsg";
import DefaultSCPacket from "./DefaultSCPacket";
import DefaultCSPacket from "./DefaultCSPacket";
import ByteArray from "../../game_framework/egret/core/utils/ByteArray";

export default class ByteArrayMsgByProtobuf extends ByteArrayMsg {

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
        var obj: DefaultSCPacket = packet as DefaultSCPacket;
        if (obj) {
            var eventMsg: string = netChannelName + obj.PacketHead.m_ProtocolID;
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
    public decode(msg: ByteArray): DefaultSCPacket {
        var packet: DefaultSCPacket = new DefaultSCPacket();
        msg.endian = "littleEndian";
        var packetLength = 0;
        packet.PacketHead.m_PacketSize = msg.readUnsignedInt();
        packetLength = packet.PacketHead.m_PacketSize;
        packet.PacketHead.m_ProtocolID = msg.readInt();
        packet.PacketHead.m_ErrorCode = msg.readInt();

        if (packetLength >= packet.PacketHead.m_PacketHeadSize && (msg.bytesAvailable >= (packetLength - msg.position))) {
            if (msg.bytesAvailable <= 0) {
                Log.info("收到数据：", "[" + packet.PacketHead.m_ProtocolID + "]", "无数据体");
                return packet;
            } else {
                var bodyBytes: ByteArray = new ByteArray();
                bodyBytes.endian = "littleEndian";
                msg.readBytes(bodyBytes, 0, msg.length - msg.position);
                packet.PacketBody = bodyBytes;
                Log.info("收到数据：", "[" + packet.PacketHead.m_ProtocolID + "]", this.dumpBytes(bodyBytes.bytes));
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
    public encode(msg: DefaultCSPacket): ByteArray {
        let sendMsg: ByteArray = new ByteArray();
        if (msg.PacketBody) {
            App.DebugUtils.start("Protobuf Encode start");
            let bodyBytes: ByteArray = new ByteArray(msg.PacketBody);
            bodyBytes.endian = "littleEndian";
            App.DebugUtils.stop("Protobuf Encode stop");
            Log.info("发送数据：", "[" + msg.PacketHead.m_ProtocolID + "]", this.dumpBytes(bodyBytes.bytes));

            sendMsg.endian = "littleEndian";
            sendMsg.writeUnsignedInt(msg.PacketHead.m_PacketHeadSize + bodyBytes.length);
            sendMsg.writeInt(msg.PacketHead.m_ProtocolID);
            sendMsg.writeInt(msg.PacketHead.m_ErrorCode);
            sendMsg.writeBytes(bodyBytes);
        } else {
            Log.info("发送数据：", "[" + msg.PacketHead.m_ProtocolID + "]", "无数据体");
            sendMsg.endian = "littleEndian";
            sendMsg.writeUnsignedInt(msg.PacketHead.m_PacketHeadSize);
            sendMsg.writeShort(msg.PacketHead.m_ProtocolID);
            sendMsg.writeShort(msg.PacketHead.m_ErrorCode);
        }
        return sendMsg;
    }

    /** 获取数据包中的协议Id
     * @param packet 数据包
     */
    public getProtocolId(packet: DefaultCSPacket): string {
        return packet.PacketHead.m_ProtocolID.toString();
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