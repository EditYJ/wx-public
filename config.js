/*
 * 配置文件
 * 
 */
'use strict'

var path = require('path');
var util = require("./util/file");

var wechat_file = path.join(__dirname,'./config/wechat.txt');

var config = {
	wechat:{
		appID:'wx3273d274aa0dcd09',
		appSecret:'3e8855d5520c039393219f922808daa2',
		token:'158392613',
		getAccessToken:function(){
			return util.readFileAsync(wechat_file);
		},
		saveAccessToken:function(data){
			return util.writeFileAsync(wechat_file,data);
		},
	}
};

module.exports = config;