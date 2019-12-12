import PacketHeadBase from "./PacketHeadBase";
import {PacketType} from "./PacketType";

export default class SCPacketHead extends PacketHeadBase {
	public constructor(packetId: number) {
		super(PacketType.ServerToClient, packetId);
	}
}