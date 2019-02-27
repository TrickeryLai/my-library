var fs = require("fs");

var common = require("./../common.js");
var URL = require("url");

function getUserData(callback, req){
	var url = "./portData/login" + common.fileType;
	var args = URL.parse(req.url, true).query;
	fs.open(url, "a+", function(err, fd){
		if(err){
			callback(err);
			return;
		}

		fs.readFile(url, "utf8", function(err, data){
			var hasState = '0';
			if(err){
				callback(err);
				return;
			}

			if(!data){
				data = {code:0,data:{}};
			}else{
				data = data.toString();
				data = JSON.parse(data);
			}
			if(data.data[args.user]){
				if(data.data[args.user].loginToken.toString()+"" != (req.headers.token.toString() +"")){
					callback({code: 8888, data: "请先登录！"})
					return;
				}
				
				if(new Date().getTime() - data.data[args.user].loginTime > common.overtime){
					callback({code: 8888, data: "登录已过期！"})
					return;
				}

				data.data[args.user].loginTime = new Date().getTime();
				data = JSON.stringify(data);
				fs.writeFile(url, data, function(err){
					if(err){
						callback(err);
						return;
					}
					var newD = [];
					data = JSON.parse(data);
					for(var i in data.data){
						newD.push({
							isLogin: data.data[i].isLogin,
							loginTime: data.data[i].loginTime,
							name: data.data[i].name,
							isUsed: data.data[i].isUsed
						});
					}
					callback({code:0,data: newD});
					return;
				})
			}
			

		})

		fs.close(fd, function(err){

		})
	})
}


module.exports = getUserData;