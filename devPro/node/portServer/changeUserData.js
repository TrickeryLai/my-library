
var fs = require("fs");
var common = require("./../common.js");
var URL = require("url");

function changeUserData(postData, callback, req){
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
			data = data ? JSON.parse(data): '';
			if(!data || !data.data[postData.username]){
				callback({code: 1, errmsg: '操作错误！'});
				return;
			}

			if(data.data[postData.username].loginToken != req.headers.token){
				callback({code: 1, errmsg: '操作错误！'});
				return;
			}else if(new Date().getTime() - data.data[postData.username].vailableStartTime > common.overtime){
				callback({code: 1, errmsg: '登录已过期！'});
				return;
			}else if( data.data[postData.username].isUsed == 0){
				callback({code: 1, errmsg: '账号不可用！'});
				return;
			}else{
				data.data[postData.changeid].isUsed = postData.isUsed;
			}

			data = JSON.stringify(data);
			fs.writeFile(url, data, function(err){
				if(err){
					callback(err);
					return;
				}
				callback({code: 0, data:'操作成功!'});
				
			})
			
		})

		fs.close(fd, function(err){

		})
	})
}

module.exports = changeUserData;