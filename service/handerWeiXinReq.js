/*
 * 处理weixin的业务逻辑
 * replay、支付、错误信息的通知等
 */
"use strict";
var eventMsgType = require("./msgType/eventMsgType");
var textMsgType = require("./msgType/textMsgType");

exports.reply = function*(next) {
  console.log("收到消息：", this.weixinRequest);
  if (this.weixinRequest.MsgType === "event") {
    yield eventMsgType.handerEventMsgType.call(this, next)
  }
  else if(this.weixinRequest.MsgType === "text"){
    yield textMsgType.handerTextMsgType.call(this, next)
  }
  else {
    this.body = "无法识别的消息类型";
  }
  yield next;
};
