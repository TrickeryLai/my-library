var fs = require("fs");
var common = require("./../common.js");

function register(postData, callback){
	var url = "./portData/login" + common.fileType;
	fs.open(url, "a+", function(err, fd){
		if(err){
			callback(err);
			return;
		}

		fs.readFile(url, "utf8", function(err, data){
			if(err){
				callback(err);
				return;
			}
			var isHave = false;

			if(!data){
				data = {
					data: {}
				};
			}else{
				data = data.toString();
				data = JSON.parse(data);
			}

			if(data.data[postData.name]){
				callback({code: 1, data: "用户名已存在！"});
				return;

			}else{
				postData.isLogin = 0;//未登录
				postData.loginToken = null;// 登录 token
				postData.isUsed = 1;//是否可用
				postData.loginTime = 0;
				postData.vailableStartTime = 0;
				data.data[postData.name] = postData;
			}

			data = JSON.stringify(data);
			fs.writeFile(url, data, function(err){
				if(err){
					callback(err);
					return;
				}

				callback({code:0, data: "注册成功!"});
			})

			fs.close(fd, function(err){
				if(err){
					callback(err);
					return;
				}
			})
		})
	})
}

module.exports = register;