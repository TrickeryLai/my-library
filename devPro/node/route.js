
var fs = require("fs");
var common = require("./common.js");
var portServer = require("./portServer/main.js");

var route = {
	get: function(pathname, fn, req){

		if(pathname == '/getAllData'){
			portServer.getAllData(fn);
			return;
		}

		if(pathname == '/getUserData'){
			portServer.getUserData(fn, req);
			return;
		}
	},

	post: function(pathname, postData, fn, req){
		
		var data;
		var pathnameArr = pathname.split('/'),
			fileUrl = './portData';

		switch (pathname){
			case '/login':
			//登录
				portServer.login(postData, fn);
				break;
			case '/register':
			//注册
				portServer.register(postData, fn);
				break;
			case '/changeUserData':
			//更改用户信息
				portServer.changeUserData(postData, fn, req);
				break;
		}

	}
}

module.exports = route;