import SCPacketHead from "../../game_framework/net/socket/packet/SCPacketHead";

export default class BruceSCPacketHead extends SCPacketHead {

	public m_PacketHeadSize:number;
	public m_PacketSize: number;
	public m_ProtocolID: number;
	public m_ErrorCode: number;

	public constructor(_packetId: number) {
		super(_packetId);
		this.m_PacketHeadSize = 12;
	}
}