
/*jshint esversion: 6*/
var fs = require('fs');
var http = require('http');

var url = require('url');


function start(router){
	function onRequest(request, response){
		var pathname = url.parse(request.url).pathname;
		console.log(url.parse(request.url))

		router(pathname);
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.end('{"A":11,"b":22}');
		// response.end();
	}

	http.createServer(onRequest).listen(8800);
	console.log(__filename)
	console.log('server has started!')
}


//post 请求
//
function post(){
	http.createServer(function(req, res){
		var post = '';

		//通过 req 的 data 事件监听函数。每当接收到请求体的数据，累加至 post
		req.on('data', function(chunk){
			post += chunk;
		})

		req.on('end', function(){

			post = querystring.parse(post);
			res.end(util.inspect(post));

		})
	}).listen(3000);
}


function router(pathname){
	console.log('about a request from pathname:' + pathname);
	var sourceData = [{"data1": "11","data2": "22"}];

	sourceData = JSON.stringify(sourceData);
	var data = Buffer.from(sourceData);

	//创建目录  recursive 无论是否存在，直接创建
	fs.mkdir("./tmp/a/test/test.text", {recursive: true},  function(err){
		if(err){
			return console.error(err)
		}
	})

	//删除目录
	fs.rmdir("./tmp/a/test/test.text", function(err){
		if(err){
			return console.error(err);
		}
	})

	//打开文件
	fs.open('./data/main.text', 'r+', function(err, fd){
		if(err){
			return console.error(err);
		};

		console.log("文件打开成功！");

		//关闭文件
		fs.close(fd, function(err){
			console.log("文件关闭")
		})
	})



	// data.write('[{"data1": 11,"data2": 22}]');

	//写入文件
	fs.writeFile('./data/main.text', data, function(err){
		if(err){
			return console.error(err);
		}
		console.log('数据写入成功');

		fs.readFile('./data/main.text', 'utf8', function(err, data){
			if(err){
				return console.error(err);
			}

			console.log(data.toString());
		})
	})
}

router();
start(router);

// http.createServer( function ( request, response){
//     'use strict';
//     response.writeHead(200, {'Content-Type': 'text/plain'});
//     response.end( '<h1>Hello, world\n</h1>' );
// }).listen(8000);

// console.log('server running at http://127.0.0.1:8000/');