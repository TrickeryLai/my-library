
var fs = require("fs");
var http = require("http");
var querystring = require("querystring");
var htmlCm = require('./index.html');
var postHTML =
    '<html><head><meta charset="utf-8"><title>Post node.js实例</title></title></head>' +
        '<body>' +
        '<form method = "post">' +
    '网站名：<input name="name" /><br />' +
    '网站地址：<input name="url" /><br />' +
    '<input type="submit" />' +
    '</form>' +
        '</body></html>';

http.createServer(function(req, res){
    var body = "";
   req.on('data', function(chunk){
       body += chunk;
   });
   req.on('end', function(){
       //解析参数
       body = querystring.parse(body);
       //设置响应头部信息及编码
       res.writeHead(200, {'Content-Type': 'text/html ;charset = utf8'});

       if(body.name && body.url){
           res.write("网站名："+body.name);
           res.write('<br />');
           res.write("网站地址："+body.url);
       }else{
           res.write(htmlCm);
       }
       res.end();
   });
}).listen(3000);
