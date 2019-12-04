import PacketBase from "./PacketBase";
import SCPacketHead from "./SCPacketHead";

export default class SCPacket extends PacketBase {

	public PacketHead: SCPacketHead;
	public PacketBody: any;

	public constructor() {
		super();
	}
}