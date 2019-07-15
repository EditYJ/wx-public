"use strict";
/// 处理Event消息类型
exports.handerEventMsgType = function*(next) {
  // 用户订阅操作
  if (this.weixinRequest.Event === "subscribe") {
    if (this.weixinRequest.EventKey)
      console.log(
        "扫描二维码关注：" +
          this.weixinRequest.EventKey +
          " " +
          this.weixinRequest.ticket
      );
    this.body = "Hello World!";
    // 用户取消订阅操作
  } else if (this.weixinRequest.Event === "unsubscribe") {
    this.body = "";
    console.log(this.weixinRequest.FromUserName + " 悄悄地走了...");
  }
  yield next;
};
