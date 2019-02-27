
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
		var pathnameArr = pathname.split('/'),
			fileUrl = './portData',
			data;

		if(pathnameArr.length <= 0){
			fileUrl = './portData/index' + common.fileType;
		}else{
			pathnameArr.forEach(function(item){
				if(item){
					fileUrl += item;
				}else{
					fileUrl += '/';
				}
			})
		}
		fs.open(fileUrl + common.fileType, 'w+', function(err, fd){
			if(err){
				data = err;
				return;
			}


			fs.close(fd, function(err){
				if(err){
					data = err;
					return;
				}
			})
		})

		fs.writeFile(fileUrl + common.fileType, '', function(err){
			if(err){
				return console.error(err);
			}
			
			fn({data: "保存成功"})
			return;
		})

		return data;
	},

	post: function(pathname, postData, fn, req){
		
		var data;
		var pathnameArr = pathname.split('/'),
			fileUrl = './portData';

		//登录
		if(pathname == '/login'){
			portServer.login(postData, fn);
			return;
		}

		//注册
		if(pathname == '/register'){
			portServer.register(postData, fn);
			return;
		}

		if(pathnameArr.length <= 0){
			fileUrl = './portData/index' + common.fileType;
		}else{
			pathnameArr.forEach(function(item){
				if(item){
					fileUrl += item;
				}else{
					fileUrl += '/';
				}
			})
		}

		fs.open(fileUrl + common.fileType, 'a+', function(err, fd){
			if(err){
				data = err;
				return;
			}

			fs.readFile(fileUrl + common.fileType, 'utf8', function(err, d){
				if(err){
					data = err;
					return;
				}
				var finalD = {};
				d = d.toString();

				if(!d){
					d = {code: 0, msg: "操作成功", data: []};
					d = JSON.stringify(d);
				}
				d = JSON.parse(d);

				if(!d.data){
					d.data = [];
				}



				d.data.push(postData);

				d = JSON.stringify(d);



				fs.writeFile(fileUrl + common.fileType, d, function(err){
					if(err){
						return console.error(err);
					}
					
					fn({data: "保存成功"})
					return;
				})

			})
			fs.close(fd, function(err){
				if(err){
					data = err;
					return;
				}
			})
		})

		return data;
	}
}

module.exports = route;