import Dictionary from "../utils/Dictionary";
import Log from "../utils/Log";
import CSPacket from "./socket/packet/CSPacket";
import BaseClass from "../base/BaseClass";
import Socket from "./socket/Socket";

export default class NetManager extends BaseClass {

	private m_NetChannels: Dictionary;

	public constructor() {
		super();
		this.m_NetChannels = new Dictionary();
	}

	/**
	 * 获取网络频道数量。
	 */
	public get NetChannelCount(): number {
		return this.m_NetChannels.count;
	}

	/**
	 * 检查是否存在网络频道。
	 * @param netChannelName 网络频道名称。
	 * @returns {boolean} 是否存在网络频道。
	 */
	public hasNetChannel(netChannelName: string): boolean {
		return this.m_NetChannels.has(netChannelName);
	}

	/**
	 * 获取网络频道。
	 * @param netChannelName 网络频道名称。
	 * @returns {Socket} 要获取的网络频道。
	 */
	public getNetChannel(netChannelName: string): Socket {
		return this.m_NetChannels.get(netChannelName);
	}

	/**
	 * 获取所有网络频道。
	 * @returns {Array<Socket>} 所有网络频道。
	 */
	public getAllNetChannels(): Array<Socket> {
		return this.m_NetChannels.datas;
	}

	/**
	 * 创建网络频道。
	 * @param netChannelName 网络频道名称。
	 * @param type 网络频道类型。
	 * @returns {Socket} 要创建的网络频道。
	 */
	public createNetChannel(netChannelName: string, type: NetChannelType): Socket {
		if (this.hasNetChannel(netChannelName)) return;
		var netChannel: Socket = new Socket(netChannelName, type);
		this.m_NetChannels.add(netChannelName, netChannel);
		return netChannel;
	}

	/**
	 * 创建网络频道。
	 * @param netChannelName 网络频道名称。
	 * @param type 网络频道类型。
	 * @param ipstring  网络频道IP地址
	 * @param port  网络频道端口
	 * @returns {Socket} 要创建的网络频道。
	 */
	public createNetChannelWithIpPort(netChannelName: string, type: NetChannelType, ipstring: string, port: number, msgFormatInstance: BaseMsg): Socket {
		if (this.hasNetChannel(netChannelName)) return;
		var netChannel: Socket = new Socket(netChannelName, type);
		netChannel.initServer(ipstring, port, msgFormatInstance);
		this.m_NetChannels.add(netChannelName, netChannel);
		return netChannel;
	}

	/**
	 * 设置网络频道的连接参数。
	 * @param netChannelName 网络频道名称。
	 * @param ipstring  网络频道IP地址
	 * @param port  网络频道端口
	 */
	public setNetChannelConnection(netChannelName: string, ipstring: string, port: number, msgFormatInstance: BaseMsg): void {
		if (netChannelName == null || netChannelName == "") return;
		var netChannel: Socket = this.getNetChannel(netChannelName);
		if (netChannel) {
			netChannel.initServer(ipstring, port, msgFormatInstance);
		} else {
			Log.info("网络通道 " + netChannelName + " 不存在!");
		}
	}

	/**
	 * 设置网络频道的是否需要重连的标志以及最大重连次数
	 * @param netChannelName 网络频道名称。
	 * @param _needReconnect  断开连接后是否需要自动重新连接
	 * @param _maxReconnectCount  最大重连次数
	 */
	public setNetChannelReconnectFlagAndMaxCount(netChannelName: string, _needReconnect: boolean, _maxReconnectCount: number = 10) {
		if (netChannelName == null || netChannelName == "") return;
		var netChannel: Socket = this.getNetChannel(netChannelName);
		if (netChannel) {
			netChannel.setReconnectFlagAndMaxCount(_needReconnect, _maxReconnectCount);
		} else {
			Log.info("网络通道 " + netChannelName + " 不存在!");
		}
	}

	/**
	 * 连接网络频道。
	 * @param netChannelName 网络频道名称。
	 * @param userData 用户自定义数据。
	 */
	public connectNetChannel(netChannelName: string, userData?: any): void {
		if (netChannelName == null || netChannelName == "") return;
		var netChannel: Socket = this.getNetChannel(netChannelName);
		if (netChannel) {
			netChannel.connect();
		} else {
			Log.info("网络通道 " + netChannelName + " 不存在!");
		}
	}

	/**
	 * 发送数据包。
	 * @param netChannelName 网络频道名称。
	 * @param msg 数据包。
	 */
	public send(netChannelName: string, msg: CSPacket): void {
		var netChannel: Socket = this.getNetChannel(netChannelName);
		if (netChannel) {
			netChannel.send(msg);
		} else {
			Log.info("网络通道 " + netChannelName + " 不存在!");
		}
	}

	/**
	 * 关闭网络频道。
	 * @param netChannelName 网络频道名称。
	 * @returns {boolean} 是否关闭网络频道成功。
	 */
	public closeNetChannel(netChannelName: string): boolean {
		var netChannel: Socket = this.getNetChannel(netChannelName);
		if (netChannel) {
			netChannel.close();
			return true;
		}
		return false;
	}

	/**
	 * 销毁网络频道。
	 * @param netChannelName 网络频道名称。
	 * @returns {boolean} 是否销毁网络频道成功。
	 */
	public destroyNetChannel(netChannelName: string): boolean {
		var netChannel: Socket = this.getNetChannel(netChannelName);
		if (netChannel) {
			netChannel.close();
			this.m_NetChannels.del(netChannelName);
			netChannel = null;
			return true;
		} else {
			Log.info("网络通道 " + netChannelName + " 不存在!");
		}
		return false;
	}

	/**
     * 关闭并清理网络管理器。
     */
	public shutdown(): void {
		this.m_NetChannels.forEach((key: string, data: Socket) => {
			data.close();
		})
		this.m_NetChannels.clear();
	}

	/**
     * 释放网络频道的发送消息队列中的消息
	 * @param netChannelName 网络频道名称。
     */
	public releaseSendMsgQueue(netChannelName: string): void {
		var netChannel: Socket = this.getNetChannel(netChannelName);
		if (netChannel) {
			netChannel.releaseSendMsgQueue();
		} else {
			Log.info("网络通道 " + netChannelName + " 不存在!");
		}
	}

	/** 
     * 锁住接收消息队列
	 * @param netChannelName 网络频道名称。
     * @param _allMsg @是否锁住所有消息
     * @param _expectMsgProtocolIdList @期望锁住的消息的协议号集合
     */
	public lockReceivedMsgQueue(netChannelName: string, _allMsgLock: boolean = false, _expectMsgProtocolIdList: Array<number> = null, _afterSomeProtocolId: string = ""): void {
		var netChannel: Socket = this.getNetChannel(netChannelName);
		if (netChannel) {
			netChannel.lockReceivedMsgQueue(_allMsgLock, _expectMsgProtocolIdList, _afterSomeProtocolId);
		} else {
			Log.info("网络通道 " + netChannelName + " 不存在!");
		}
	}

	/** 
     * 释放接收消息队列中的消息
	 * @param netChannelName 网络频道名称。
     * @param _allMsgRelease 是否释放返回消息队列中的所有消息
     */
	public releaseReceivedMsgQueue(netChannelName: string, _allMsgRelease: boolean = false): void {
		var netChannel: Socket = this.getNetChannel(netChannelName);
		if (netChannel) {
			netChannel.releaseReceivedMsgQueue(_allMsgRelease);
		} else {
			Log.info("网络通道 " + netChannelName + " 不存在!");
		}
	}
}