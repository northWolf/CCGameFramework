export enum PacketType {

    /**
     * 未定义。
     */
	Undefined = 0,

	/**
	 * 客户端发往服务器的包。
	 */
	ClientToServer,

	/**
	 * 服务器发往客户端的包。
	 */
	ServerToClient,
}