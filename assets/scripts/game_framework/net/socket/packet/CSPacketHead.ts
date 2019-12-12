import PacketHeadBase from "./PacketHeadBase";
import {PacketType} from "./PacketType";

export default class CSPacketHead extends PacketHeadBase {
	public constructor(packetId: number) {
		super(PacketType.ClientToServer, packetId);
	}
}