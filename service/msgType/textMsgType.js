"use strict";
/// 处理Event消息类型
exports.handerTextMsgType = function*(next) {
  var content = this.weixinRequest.Content;
  var reply = '你说的话：“' + content + '”，我听不懂呀';
  if(content === '1'){
      reply = '刘德华';
  }
  else if(content === '2'){
      reply = {
          type:'image',
          mediaId:'http://tu.23juqing.com/d/file/html/gndy/dyzz/2017-04-09/da9c7a64ab7df196d08b4b327ef248f2.jpg'
      }
  }
  else if(content === '刘德华'){
      reply = [{
          title:'刘德华',
          description:'中国香港男演员、歌手、作词人、制片人。',
          picUrl:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1563867831&di=8dfaf3c60343191136af9b42d90e3f7a&imgtype=jpg&er=1&src=http%3A%2F%2Fwww.zhuyin.com%2Ffpic%2F516.jpg',
          url:'https://baike.baidu.com/item/%E5%88%98%E5%BE%B7%E5%8D%8E/114923?fr=aladdin'
      }];
  }
  this.body = reply
  yield next;
};
