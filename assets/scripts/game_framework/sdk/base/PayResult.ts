export default class PayResult {

    private selfOrderID;

    private sdkOrderID;

    private success: boolean = true;


    isSuccess() {
        return this.success;
    }

    setSelfOrderID(id) {
        this.selfOrderID = id;
    }

    setSDKOrderID(id) {
        this.sdkOrderID = id;
    }

    getSelfOrderID() {
        return this.selfOrderID;
    }

    getSDKOrderID() {
        return this.sdkOrderID;
    }


}
