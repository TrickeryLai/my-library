
var fs = require("fs");
var common = require("../common.js");
//获取所有data 返回
function baseInfo(postData, callback){
	var url = "./portData/baseInfo" + common.fileType;

	if(!postData.name || !postData.tel || !postData.sex){
		callback({code:1,msg:'参数不能为空'});
		return;
	}
	fs.open(url, "a+", function(err, fd){
		if(err){
			return console.error(err);
		}

		fs.readFile(url, "utf8", function(err, data){
			if(err){
				return console.error(err);
			}

			if(!data){
				data = {
					code: 0,
					msg: "请求成功",
					data: []
				}
			}else{
				data = data.toString();
				data = JSON.parse(data);
			}
			postData.id = Math.floor(Math.random()*100000) + '' + new Date().getTime();
			data.data.push(postData);
			data = JSON.stringify(data);
			fs.writeFile(url, data, function(err){

				callback({code: 0, data: '保存成功'});
			})
		})

		fs.close(fd, function(err){
			if(err){
				return console.error(err);
			}
		})
	})
}


module.exports = baseInfo;