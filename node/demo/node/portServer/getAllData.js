
var fs = require("fs");
var common = require("../common.js");
//获取所有data 返回
function getAllData(callback){
	var url = "./portData/common" + common.fileType;
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


			// data = JSON.stringify(data);

			callback(data);
		})
	})
}


module.exports = getAllData;