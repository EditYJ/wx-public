/*
 * 中间件
 * 对请求类型进行判断，实现逻辑分离
 */
"use strict";

var sha1 = require("sha1");
var rawBody = require("raw-body");
var Wechat = require("./wechat");
var xmlUtil = require("../util/xmlFormate");

///	处理微信服务器发来的消息
///
///	一、验证消息的确来自微信服务器(GET请求)
/// 	开发者提交信息后，微信服务器将发送GET请求到填写的服务器地址URL上，处理分为三个步骤
/// 		(1)将[token]、[timestamp]、[nonce]三个参数进行字典序排序
/// 		(2)将三个参数字符串拼接成一个字符串进行sha1加密
/// 		(3)开发者获得加密后的字符串可与[signature]对比，标识该请求来源于微信
module.exports = function(opts, hander) {
  var wechat = new Wechat(opts); // 获取access_token保存至文件中
  return function*(next) {
    var that = this;
    var token = opts.token;
    var signature = this.query.signature;
    var nonce = this.query.nonce;
    var timestamp = this.query.timestamp;
    var echostr = this.query.echostr;
    // 字典排序
    var str = [token, timestamp, nonce].sort().join("");
    // sha1加密
    var sha = sha1(str);

    // 判断请求类型
    if (this.method === "GET") {
      this.body = sha === signature ? echostr + "" : "failed";
      console.info("收到GET请求");
    } else if (this.method === "POST") {
      if (sha !== signature) {
        this.body = "failed";
        return false;
      }
      var data = yield rawBody(this.req, {
        length: this.length,
        limit: "1mb",
        encoding: this.charset
      });
      // xml数据解析成xml对象
      var content = yield xmlUtil.parseXMLAsync(data);
      // 对于[content]进行扁平化处理
      var message = xmlUtil.formatMessage(content.xml);
      console.info("收到微信服务器请求消息: ", message.MsgType);

      // 挂载微信请求消息
      this.weixinRequest = message;
      // 通过weixin.js处理请求消息,生成回复消息体
      yield hander.call(this, next);
      // 回复消息
      wechat.replay.call(this);
    }
  };
};
