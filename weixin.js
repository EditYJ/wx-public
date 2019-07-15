/*
 * 处理weixin的业务逻辑
 * replay、支付、错误信息的通知等
 */
"use strict";

exports.reply = function*(next) {
  var message = this.weixinRequest;
  console.log("挂载的：", message);
  if (message.MsgType === "event") {
    if (message.Event === "subscribe") {
      if (message.EventKey)
        console.log(
          "扫描二维码关注：" + message.EventKey + " " + message.ticket
        );
      this.body = "终于等到你，还好我没放弃";
    } else if (message.Event === "unsubscribe") {
      this.body = "";
      console.log(message.FromUserName + " 悄悄地走了...");
    }
  } else {
    this.body = "无法识别的消息类型";
  }
  yield next;
};
