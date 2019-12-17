import BaseChannel from "./base/BaseChannel";
import ChannelID from "./ChannelID";
import Platform from "./PlatformCallJS";
import BaseClass from "../base/BaseClass";

export default class SDKManager extends BaseClass {

    private channel: BaseChannel;

    private channelMap = {};

    //这里只是为了加载而已。
    private platform: Platform = new Platform();

    public init(_channel: BaseChannel) {
        if (!this.isChannelInited(_channel.getID())) {
            this.channel = _channel;
            this.channelMap[_channel.getID()] = _channel;
        }

        if (this.channel) {
            this.channel.init();
        }
    }

    public isDev(): boolean {
        return this.channel.getID() == ChannelID.DEFAULT;
    }

    public getChannel(): BaseChannel {
        return this.channel;
    }

    public isChannelInited(id: number): boolean {
        return this.channelMap[id] != null;
    }
}
