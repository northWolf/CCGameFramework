/**
 * 网络类型
 */
enum NetChannelType {
    HTTP,
    SOCKET,
}

/**
 * 消息格式类型
 */
enum NetMsgType {
    ByteArrayMsgByProtobuf,
    UTFMsgByJson,
}