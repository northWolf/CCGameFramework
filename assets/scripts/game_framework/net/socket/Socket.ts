/**
 * Socket类
 */
import App from "../../App";
import SCPacket from "./packet/SCPacket";
import CSPacket from "./packet/CSPacket";
import Log from "../../utils/Log";
import BaseClass from "../../base/BaseClass";
import SocketConst from "./SocketConst";
import EgretWebSocket from "../../egret/extension/socket/EgretWebSocket";
import ByteArrayMsg from "./ByteArrayMsg";
import {NetChannelType} from "./SocketEnum";
import ByteArray from "../../egret/core/utils/ByteArray";

export default class Socket extends BaseClass {

    private m_netChannelName: string;
    private m_netChannelType: NetChannelType;

    private m_needReconnect: boolean = false;
    private m_maxReconnectCount = 10;

    private m_reconnectCount: number = 0;
    private m_connectFlag: boolean;
    private m_host: string;
    private m_port: number;
    private m_socket: EgretWebSocket;
    private m_msg: BaseMsg;
    private m_isConnecting: boolean;

    /**
     * 发送消息队列
     */
    private m_sendMsgQueue: Array<CSPacket>;

    /**
     * 返回消息队列
     */
    private m_receivedMsgQueue: Array<SCPacket>;

    /**
     * 返回消息队列是否已锁住
     */
    private m_isReceivedMsgQueueLocked: boolean;

    /**
     * 是否所有返回消息都锁住
     */
    private m_isAllReceivedMsgLock: boolean;

    /**
     * 期望锁住的返回消息的协议号列表
     */
    private m_expectReceivedMsgProtocolIdListLock: Array<number>;

    /**
     * 期望在某个消息协议号之后开始锁住
     */
    private m_expectAfterProtocolIdLock: string;

    /**
     * 是否手动断开连接
     */
    private m_isManualDisconnection: boolean;

    /**
     * 构造函数
     */
    public constructor(name: string, type: NetChannelType) {
        super();
        this.m_netChannelName = name;
        this.m_netChannelType = type;
    }

    /**
     * 添加事件监听
     */
    private addEvents() {
        App.MessageCenter.addListener(SocketConst.SOCKET_CONNECT,this.onSocketOpen,this);
        App.MessageCenter.addListener(SocketConst.SOCKET_DATA,this.onReceiveMessage,this);
        App.MessageCenter.addListener(SocketConst.SOCKET_NOCONNECT,this.onSocketError,this);
        App.MessageCenter.addListener(SocketConst.SOCKET_CLOSE,this.onSocketClose,this);
    }

    /**
     * 移除事件监听
     */
    private removeEvents(): void {
        App.MessageCenter.removeListener(SocketConst.SOCKET_CONNECT,this.onSocketOpen,this);
        App.MessageCenter.removeListener(SocketConst.SOCKET_DATA,this.onReceiveMessage,this);
        App.MessageCenter.removeListener(SocketConst.SOCKET_NOCONNECT,this.onSocketError,this);
        App.MessageCenter.removeListener(SocketConst.SOCKET_CLOSE,this.onSocketClose,this);
    }

    /**
     * 服务器连接成功
     */
    private onSocketOpen(): void {
        this.m_reconnectCount = 0;
        this.m_isConnecting = true;
        this.m_isManualDisconnection = false;
        if (this.m_connectFlag && this.m_needReconnect) {
            App.MessageCenter.dispatch(this.m_netChannelName + SocketConst.SOCKET_RECONNECT);
            Log.info("与 " + this.m_netChannelName + " 服务器重新连接成功。");
        } else {
            App.MessageCenter.dispatch(this.m_netChannelName + SocketConst.SOCKET_CONNECT);
            Log.info("与 " + this.m_netChannelName + " 服务器连接成功。");
        }

        this.m_connectFlag = true;
        this.releaseSendMsgQueue();
    }

    /**
     * 服务器断开连接
     */
    private onSocketClose(): void {
        this.m_isConnecting = false;

        if (this.m_isManualDisconnection) {
            Log.info("手动断开 " + this.m_netChannelName + " 服务器连接");
        } else {
            if (this.m_needReconnect) {
                App.MessageCenter.dispatch(this.m_netChannelName + SocketConst.SOCKET_START_RECONNECT);
                Log.info("开始与 " + this.m_netChannelName + " 服务器重新连接");
                this.reconnect();
            } else {
                App.MessageCenter.dispatch(this.m_netChannelName + SocketConst.SOCKET_CLOSE);
                Log.info("与 " + this.m_netChannelName + " 服务器断开连接");
            }
        }
    }

    /**
     * 服务器连接错误
     */
    private onSocketError(): void {
        if (this.m_needReconnect) {
            this.reconnect();
        } else {
            App.MessageCenter.dispatch(this.m_netChannelName + SocketConst.SOCKET_NOCONNECT);
            Log.info(this.m_netChannelName + " 服务器连接不上");
        }
        this.m_isConnecting = false;
    }

    /**
     * 收到服务器消息
     * @param
     */
    private onReceiveMessage(e: MessageEvent): void {
        if (this.m_socket != null) {
            var msgBuffer: ByteArray = new ByteArray();
            this.m_socket.readBytes(msgBuffer);
            var packet: SCPacket = this.m_msg.decode(msgBuffer);
            if (packet != null) {
                var protocolId: string = this.m_msg.getProtocolId(packet);
                if (this.m_isReceivedMsgQueueLocked) {
                    if (this.m_isAllReceivedMsgLock) {
                        if (this.m_receivedMsgQueue == null) {
                            this.m_receivedMsgQueue = new Array<SCPacket>();
                        }
                        this.m_receivedMsgQueue.push(packet);
                        Log.info("缓存接收消息.." + this.m_netChannelName + "  " + protocolId);
                    } else if (this.m_expectReceivedMsgProtocolIdListLock != null && App.ArrayUtils.searchByKey(this.m_receivedMsgQueue, protocolId) != null) {
                        if (this.m_receivedMsgQueue == null) {
                            this.m_receivedMsgQueue = new Array<SCPacket>();
                        }
                        this.m_receivedMsgQueue.push(packet);
                        Log.info("缓存接收消息.." + this.m_netChannelName + "  " + protocolId);
                    } else {
                        this.m_msg.receive(this.m_netChannelName, packet);
                    }
                } else {
                    this.m_msg.receive(this.m_netChannelName, packet);
                }

                if (this.m_expectAfterProtocolIdLock && this.m_expectAfterProtocolIdLock != "" && this.m_expectAfterProtocolIdLock == protocolId) {
                    this.m_isReceivedMsgQueueLocked = true;
                }
            }
        }
    }

    /**
     * 初始化服务器地址
     * @param host IP
     * @param port 端口
     * @param msg 消息发送接受处理类
     */
    public initServer(host: string, port: number, msg: BaseMsg): void {
        this.m_host = host;
        this.m_port = port;
        this.m_msg = msg;
    }

    /**
     * 开始Socket连接
     */
    public connect(): void {
        if (this.m_isConnecting) return;
        if (App.DeviceUtils.IsHtml5) {
            if (!window["WebSocket"]) {
                Log.error("不支持WebSocket");
                return;
            }
        }
        let url = "ws://" + this.m_host + ":" + this.m_port;
        Log.info(url);

        this.m_socket = new EgretWebSocket(this.m_host,this.m_port);
        if (this.m_msg instanceof ByteArrayMsg) {
            this.m_socket.type = EgretWebSocket.TYPE_BINARY;
        }
        this.addEvents();
        if (this.m_host.indexOf("ws://") != -1 || this.m_host.indexOf("wss://") != -1) {
            this.m_socket.connectByUrl(this.m_host + ":" + this.m_port);
        } else {
            this.m_socket.connect(this.m_host, this.m_port);
        }
    }

    /**
     * 设置是否需要重连标志以及最大重连次数
     * */
    public setReconnectFlagAndMaxCount(_needReconnect: boolean, _reconnectMaxCount: number = 10) {
        this.m_needReconnect = _needReconnect;
        this.m_maxReconnectCount = _reconnectMaxCount;
    }

    /**
     * 重新连接
     */
    private reconnect(): void {
        this.closeCurrentSocket();
        this.m_reconnectCount++;
        if (this.m_reconnectCount < this.m_maxReconnectCount) {
            this.connect();
        } else {
            this.m_reconnectCount = 0;
            if (this.m_connectFlag) {
                App.MessageCenter.dispatch(this.m_netChannelName + SocketConst.SOCKET_CLOSE);
                Log.info("与 " + this.m_netChannelName + " 服务器断开连接");
            } else {
                App.MessageCenter.dispatch(this.m_netChannelName + SocketConst.SOCKET_NOCONNECT);
                Log.info(this.m_netChannelName + " 服务器连接不上");
            }
        }
    }

    /**
     * 发送消息到服务器
     * @param msg
     */
    public send(msg: CSPacket): void {
        if (!this.m_isConnecting) {
            Log.info(this.m_netChannelName + "连接是断开的，把消息压入发送队列，并尝试连接.");
            if (this.m_sendMsgQueue == null) {
                this.m_sendMsgQueue = new Array<CSPacket>();
            }
            this.m_sendMsgQueue.push(msg);
            this.connect();
        } else {
            this.m_msg.send(this.m_netChannelName, msg);
        }
    }

    /**
     * 释放发送消息队列中的消息
     */
    public releaseSendMsgQueue(): void {
        if (this.m_sendMsgQueue != null && this.m_sendMsgQueue.length > 0) {
            var msgPacket: CSPacket = this.m_sendMsgQueue.pop();
            this.send(msgPacket);
        }
    }

    /** 
     * 锁住接收消息队列
     * @param _allMsg @是否锁住所有消息
     * @param _expectMsgProtocolIdList @期望锁住的消息的协议号集合
     */
    public lockReceivedMsgQueue(_allMsgLock: boolean = false, _expectMsgProtocolIdList: Array<number> = null, _afterSomeProtocolId: string = ""): void {
        if (_afterSomeProtocolId == "") {
            this.m_isReceivedMsgQueueLocked = true;
            this.m_isAllReceivedMsgLock = _allMsgLock;
            this.m_expectAfterProtocolIdLock = _afterSomeProtocolId;
            this.m_expectReceivedMsgProtocolIdListLock = _expectMsgProtocolIdList;
        } else {
            this.m_isAllReceivedMsgLock = _allMsgLock;
            this.m_expectAfterProtocolIdLock = _afterSomeProtocolId;
            this.m_expectReceivedMsgProtocolIdListLock = _expectMsgProtocolIdList;
        }
    }

    /** 
     * 释放接收消息队列中的消息
     * @param _allMsgRelease 是否释放返回消息队列中的所有消息
     */
    public releaseReceivedMsgQueue(_allMsgRelease: boolean = false, _expectReleaseProtocolId = ""): void {
        this.m_isReceivedMsgQueueLocked = false;
        this.m_expectAfterProtocolIdLock = "";
        if (_allMsgRelease) {
            while (this.m_receivedMsgQueue != null && this.m_receivedMsgQueue.length > 0) {
                var packet: SCPacket = this.m_receivedMsgQueue.pop();
                this.m_msg.receive(this.m_netChannelName, packet);
            }
        } else {
            if (this.m_receivedMsgQueue != null && this.m_receivedMsgQueue.length > 0) {
                if (_expectReleaseProtocolId == "") {
                    this.m_receivedMsgQueue.forEach(element => {
                        var protocolId: string = this.m_msg.getProtocolId(element);
                        if (protocolId == _expectReleaseProtocolId) {
                            var packet: SCPacket = element;
                            var index: number = this.m_receivedMsgQueue.indexOf(element, 0);
                            this.m_receivedMsgQueue.splice(index, 1);
                            this.m_msg.receive(this.m_netChannelName, element);
                            return;
                        }
                    });
                } else {
                    var packet: SCPacket = this.m_receivedMsgQueue.pop();
                    this.m_msg.receive(this.m_netChannelName, packet);
                }
            }
        }
    }

    /**
     * 关闭Socket连接
     */
    public close(): void {
        this.m_connectFlag = false;
        this.m_isManualDisconnection = true;
        this.closeCurrentSocket();
    }

    /**
     * 清理当前的Socket连接
     */
    private closeCurrentSocket() {
        Log.info("关闭连接 " + this.m_netChannelName);
        this.removeEvents();
        this.m_socket.close();
        this.m_socket = null;
        this.m_isConnecting = false;
    }

    /**
     * Socket是否在连接中
     * @returns {boolean}
     */
    public isConnecting(): boolean {
        return this.m_isConnecting;
    }

    /**
     * 返回socket代理
     * @returns {WebSocket}
     */
    public getSocket(): EgretWebSocket {
        return this.m_socket;
    }

    /**
     * 获取主机名
     */
    public getHost(): string {
        return this.m_host;
    }

    /**
     * 获取端口
     */
    public getPort(): number {
        return this.m_port;
    }

    /**
     * Debug信息
     * @param str
     */
    private debugInfo(str: String): void {
        App.MessageCenter.dispatch(SocketConst.SOCKET_DEBUG_INFO, str);
    }
}