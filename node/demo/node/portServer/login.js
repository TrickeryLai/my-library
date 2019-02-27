var fs = require("fs");
var common = require("./../common.js");

function login(postData, callback){
	var url = "./portData/login" + common.fileType;

	if(!postData.name){
		callback({code: 1, errmsg:"账户名不能为空！"});
		return;
	}

	if(!postData.password){
		callback({code:1, errmsg:"密码不能为空！"});
		return;
	}

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
			var loginToken = Math.floor(Math.random()*10000) + '' + new Date().getTime() + '' + Math.floor(Math.random()*1000);

			if(data.data[postData.name] && data.data[postData.name].name == postData.name && data.data[postData.name].password == postData.password){

				if(!data.data[postData.name].isUsed){
					callback({code:1, errmsg:"账号不可用!"});
					return;
				}
				
				data.data[postData.name].isLogin = 1;
				data.data[postData.name].loginToken = loginToken.toString();
				data.data[postData.name].loginTime = new Date().getTime();

				data = JSON.stringify(data);
				fs.writeFile(url, data, function(err){
					if(err){
						callback(err);
						return;
					}

					callback({code:0,data:{token: loginToken,user: postData.name}});
				})
				return;
			}else{
				callback({code:1, errmsg:"账号或密码错误!"});
				return;
			}	

		})

		fs.close(fd, function(err){

		})
	})
}

module.exports = login;