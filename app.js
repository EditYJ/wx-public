'use strict'

var Koa = require('koa');
var path = require('path');
var wechat = require('./wechat/generator');
var util = require('./util/file');

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

var app = new Koa();

app.use(wechat(config.wechat));

app.listen(8080);

console.log('Listening 8080...')