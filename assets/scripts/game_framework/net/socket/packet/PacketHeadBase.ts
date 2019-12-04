import PacketBase from "./PacketBase";

export default class PacketHeadBase extends PacketBase {
	public constructor(packetType: PacketType, packetId: number) {
		super();
		this.PacketType = packetType;
		this.PacketId = packetId;
	}
}