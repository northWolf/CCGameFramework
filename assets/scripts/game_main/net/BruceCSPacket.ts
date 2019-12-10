import CSPacket from "../../game_framework/net/socket/packet/CSPacket";
import BruceCSPacketHead from "./BruceCSPacketHead";

export default class BruceCSPacket extends CSPacket {

	public PacketHead: BruceCSPacketHead;

	public constructor() {
		super();
		this.PacketHead = new BruceCSPacketHead(0);
	}
}