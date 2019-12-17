export default interface PayInterface {
    /**
     * 创建订单后调用sdk的付费功能进行付费。
     * @param model 购买项的模型
     * @param msg 服务器返回的信息。
     */
    pay(model, msg, callback);

    /**
     * 消耗商品
     * @param orderID
     */
    consume(orderID);

    /**
     * 查询漏单情况 native会用到。
     */
    query(callback: Function);

    /**
     * 显示商城 如果没有不重写
     */
    showStore();
}
