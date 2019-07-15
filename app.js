/*
* 入口文件
*
*/
"use strict";

var Koa = require("koa");
var wechat = require("./wechat/generator");
var config = require('./config');
var weixin = require('./weixin');

var app = new Koa();

app.use(wechat(config.wechat,weixin.reply));

app.listen(8987);

console.log("Listening 8987...");
