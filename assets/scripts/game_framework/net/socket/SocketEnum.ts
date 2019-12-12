/**
 * 网络类型
 */
export enum NetChannelType {
    HTTP,
    SOCKET,
}

/**
 * 消息格式类型
 */
export enum NetMsgType {
    ByteArrayMsgByProtobuf,
    UTFMsgByJson,
}