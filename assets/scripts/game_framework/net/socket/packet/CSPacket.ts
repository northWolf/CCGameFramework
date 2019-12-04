import PacketBase from "./PacketBase";
import CSPacketHead from "./CSPacketHead";

export default class CSPacket extends PacketBase {
	public PacketHead: CSPacketHead;
	public PacketBody: any;

	public constructor() {
		super();
	}
}