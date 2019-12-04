import PacketHeadBase from "./PacketHeadBase";

export default class SCPacketHead extends PacketHeadBase {
	public constructor(packetId: number) {
		super(PacketType.ServerToClient, packetId);
	}
}