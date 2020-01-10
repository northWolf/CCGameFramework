import SCPacket from "../../game_framework/net/socket/packet/SCPacket";
import DefaultSCPacketHead from "./DefaultSCPacketHead";

export default class DefaultSCPacket extends SCPacket {

	public PacketHead: DefaultSCPacketHead;

	public constructor() {
		super();
		this.PacketHead = new DefaultSCPacketHead(0);
	}
}