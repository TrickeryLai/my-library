var fs = require("fs");

var http = require("http");

var url = require("url");

var common = require("./common.js");

var route = require("./route.js");


function server(){
	http.createServer( function(req, res){
		var pathname = url.parse(req.url).pathname;
		var postData = "",
			data;
		if(req.method == 'POST'){
			req.on("data", function(chunk){
				postData += chunk;
			})

		 	req.on('end', function(){
			 	//获取 post 传递过来的数据
			    postData = JSON.parse(postData);
				route.post(pathname, postData, function(data){
					res.writeHead('200', {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS", "Content-Type": "application/json;charset=utf-8","Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept, token"});
					data = JSON.stringify(data);
					res.end(data);
				}, req);
		    })
			
		}
		if(req.method == 'GET'){
			route.get(pathname, function(data){
				res.writeHead('200', {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS", "Content-Type": "application/json;charset=utf-8","Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept, token"});
				data = JSON.stringify(data);
				res.end(data);
			}, req);
			
		}
		if(req.method == 'OPTIONS'){
			res.writeHead('200', {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS", "Content-Type": "application/json;charset=utf-8","Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept, token"});
			res.end('');
		}

		
	}).listen(common.port)
}

server()