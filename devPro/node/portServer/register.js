var fs = require("fs");
var common = require("./../common.js");

function register(postData, callback){
	var url = "./portData/login" + common.fileType;
	console.log(postData)
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
			if(!postData.username || !postData.password){
				callback({code: 1, errmsg: "账户或密码不能为空!"});
				return;
			}
			if(data.data[postData.username]){
				callback({code: 1, errmsg: "用户名已存在！"});
				return;
			}else{
				postData.username = postData.username;
				postData.password = postData.password;
				postData.isLogin = 0;//未登录
				postData.loginToken = null;// 登录 token
				postData.isUsed = 1;//是否可用
				postData.loginTime = 0;
				postData.createTime = new Date().getTime();
				postData.vailableStartTime = 0;
				data.data[postData.username] = postData;
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