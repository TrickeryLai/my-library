
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
			callback(res.data);

		})
	}
}