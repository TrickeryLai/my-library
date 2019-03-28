var http = require('http'),
	request = require('request'),
	cheerio = require('cheerio');
	getData('http://www.baidu.com');
	function getData (url, method, requestData){
		request({
			url: url,
			method: method || 'GET',
			json: true,
			headers: {

			},
			body: JSON.stringify(requestData)
		}, function(err, response, body){
			console.log(err)
			if(!err && response.statuscode == 200){
				console.log(body)
			}
		})
	}