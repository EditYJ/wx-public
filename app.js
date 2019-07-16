/*
* 入口文件
*
*/
"use strict";

var Koa = require("koa");
var wechat = require("./middleware/generator");
var config = require('./config');
var handerWeiXinReq = require('./service/handerWeiXinReq');

var app = new Koa();

app.use(wechat(config.wechat,handerWeiXinReq.reply));

app.listen(8987);

console.log("Listening 8987...");
