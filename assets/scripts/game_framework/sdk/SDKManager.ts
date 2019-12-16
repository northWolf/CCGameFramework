import BaseChannel from "./base/BaseChannel";
import WXChannel from "./wx/WXChannel";
import DevChannel from "./dev/DevChannel";
import ChannelID from "./ChannelID";
import GoogleAppChannel from "./google_app/GoogleAppChannel";
import Platform from "./PlatformCallJS";
import GooglePayChannel from "./google_pay/GooglePayChannel";
import YingYongBao from "./yingyongbao/YingYongBao";
import VivoChannel from "./vivo/VivoChannel";
import TTChannel from "./tt/TTChannel";


export default class SDKManager {

    static UPDATE_GAME_ICON: string = 'sdk_update_game_icon'
    static START_GAME_ICON: string = 'start_update_game_icon'

    private static channel: BaseChannel;

    private static channelMap = {};

    //这里只是为了加载而已。
    private static platform: Platform = new Platform();

    static init(channelID, bannerID: string, rewardAdID: string, insertAdID: string, shareTitle: string) {
        this.channel = this.builder(channelID, bannerID, rewardAdID, insertAdID, shareTitle);
        if (this.channel) {
            this.channel.init();
        }
    }

    static isDev(): boolean {
        return this.channel.getID() == ChannelID.DEFAULT;
    }

    static builder(id: number, bannerID: string, rewardAdID: string, insertAdID: string, shareTitle: string): BaseChannel {
        let channelManager = this.channelMap[id];
        if (!channelManager) {
            cc.log(' channelID ' + id);
            switch (id) {
                case ChannelID.WX:
                    channelManager = new WXChannel(id, bannerID, rewardAdID, insertAdID, shareTitle);
                    break;
                case ChannelID.DEFAULT:
                    channelManager = new DevChannel(id);
                    break;
                case ChannelID.GoogleApp:
                    channelManager = new GoogleAppChannel(id);
                    break;
                case ChannelID.GooglePay:
                    channelManager = new GooglePayChannel(id);
                    break;
                case ChannelID.YingYongBao:
                    channelManager = new YingYongBao(id);
                    break;
                case ChannelID.VIVO:
                    channelManager = new VivoChannel(id, bannerID, rewardAdID, insertAdID)
                    break;
                case ChannelID.TT:
                    channelManager = new TTChannel(id, bannerID, rewardAdID, shareTitle)
                    break;

            }
            this.channelMap[id] = channelManager;
        }

        return channelManager;
    }

    static getChannel() {
        return this.channel;
    }


}
