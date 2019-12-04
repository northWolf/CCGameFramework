/**
 * 服务端消息解析
 */
interface BaseMsg {

    /**
     * 接收消息处理
     * @param msg
     */
    receive(netChannelName: string, msg: any): void;

    /**
     * 发送消息处理
     * @param msg
     */
    send(netChannelName: string, msg: any): void;

    /**
     * 消息解析
     * @param msg
     */
    decode(msg: any): any;

    /**
     * 消息封装
     * @param msg
     */
    encode(msg: any): any;

    /** 获取数据包中的协议Id
     * @param msg 数据包
     */
    getProtocolId(msg: any): string
}
