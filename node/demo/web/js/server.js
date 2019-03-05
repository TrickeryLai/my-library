
var server_ajax = {
	getUserData: function(callback){
		var sessionData = JSON.parse(sessionStorage.getItem('loginData'));
		console.log(sessionData.user)
		var url = common_data.headUrl + '/getUserData?user=' + sessionData.user;

		server.get(url, function(res){
			if(res.code == 1){
				alert(res.errmsg);
				return;
			}
			//登录过期
			if(res.code == 8888){
				alert(res.data);
				return;
			}
			callback(res.data);
		})
	}
}