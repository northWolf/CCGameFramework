import SCPacket from "../../game_framework/net/socket/packet/SCPacket";
import BruceSCPacketHead from "./BruceSCPacketHead";

export default class BruceSCPacket extends SCPacket {

	public PacketHead: BruceSCPacketHead;

	public constructor() {
		super();
		this.PacketHead = new BruceSCPacketHead(0);
	}
}