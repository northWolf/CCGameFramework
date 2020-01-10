import CSPacket from "../../game_framework/net/socket/packet/CSPacket";
import DefaultCSPacketHead from "./DefaultCSPacketHead";

export default class DefaultCSPacket extends CSPacket {

	public PacketHead: DefaultCSPacketHead;

	public constructor() {
		super();
		this.PacketHead = new DefaultCSPacketHead(0);
	}
}