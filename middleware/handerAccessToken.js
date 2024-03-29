/*
 * 处理access_token
 */
"use strict";

var xmlUtil = require("../util/xmlFormate");

var Promise = require("bluebird");
var request = Promise.promisify(require("request"));

//获取access_token接口
var prefix = "https://api.weixin.qq.com/cgi-bin/";
var api = {
  accessToken: prefix + "token?grant_type=client_credential"
};

//获取当前时间
var now = new Date().getTime();

/// 构造函数，用以生成实例，完成[access_token]的获取和保存
///
/// 因为[access_token]是共用的，基本上后续的所有请求都需要[access_token]
/// 所以这里将[access_token]保存在了`@/config/wechat.text`路径中
function handerAccessToken(opts) {
  this.appID = opts.appID;
  this.appSecret = opts.appSecret;
  this.getAccessToken = opts.getAccessToken;	// 获取access_token函数
  this.saveAccessToken = opts.saveAccessToken;	// 保存access_token函数
}

handerAccessToken.prototype.requestAccessToken = function() {
  this.getAccessToken()	// 首先从文件读取access_token
    .then(data => {
			// 如果反序列化没有问题，进入判断；否则调用[updateAccessToken]更新
      try {	
				data = JSON.parse(data);
      } catch (e) {
        return this.updateAccessToken();
			}
			// [isvalidAccessToken]判断是否是有效的access_token，如果不是则调用[updateAccessToken]更新
      if (this.isvalidAccessToken(data)) {
				return data
      } else {
				return this.updateAccessToken();
      }
    })
    .then(data => {
      this.access_token = data.access_token;
      this.expires_in = data.expires_in;
			this.saveAccessToken(JSON.stringify(data)).then(val=>{
				console.info('保存AccessToken完成...')
			});
		});
}

/// 判断[access_token]是否有效
/// 
/// [access_token]和[expires_in](有效时间)都不为空的情况下，
/// 判断[expires_in]是否超时，如果不超时则返回true
handerAccessToken.prototype.isvalidAccessToken = function(data) {
  if (!data || !data.access_token || !data.expires_in) return false;
  let expires_in = data.expires_in;
  return now < expires_in ? true : false;
};

/// 更新[access_token]
///
/// 将请求得到的[expires_in]时间提前了20s,防止网络延迟等特殊情况的出现
/// 返回一个[Promise]对象，返回得到的[access_token]
handerAccessToken.prototype.updateAccessToken = function() {
  let appID = this.appID;
  let appSecret = this.appSecret;
  let url = api.accessToken + "&appid=" + appID + "&secret=" + appSecret;

  return new Promise(function(resolve, reject) {
    request({ url: url, json: true }).then(response => {
      let data = response.body;
      let expires_in = now + (data.expires_in - 20) * 1000; //考虑到网络延迟、服务器计算时间,故提前20秒发起请求
      data.expires_in = expires_in;
      console.info("更新access_token完成...")
      resolve(data);
    }).catch(err=>{
      console.info("更新access_token出错：", err)
			reject(err)
		});
  });
};
module.exports = handerAccessToken
