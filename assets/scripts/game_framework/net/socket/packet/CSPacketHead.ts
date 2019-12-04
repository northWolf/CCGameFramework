import PacketHeadBase from "./PacketHeadBase";

export default class CSPacketHead extends PacketHeadBase {
	public constructor(packetId: number) {
		super(PacketType.ClientToServer, packetId);
	}
}