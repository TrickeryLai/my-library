
var common_router = [
	{
		hash: "",
		path: "./login.html",
		title: "登录"
	},

	{
		hash: "/user",
		path: "html/user.html",
		title: "用户管理"
	}
]

function Router(params){
	this.params = params ? params : {};
	this.routerData = {};
}

Router.prototype = {
	init: function(){
		this.change();
		window.addEventListener('hashchange', this.change.bind(this));
	},

	getCurrentUrlData: function(hash){
		for(var i = 0 ;i < common_router.length; i++){
			if(common_router[i].hash == hash){
				return common_router[i];
			}
		}
	},

	//处理页面的js部分代码
	//
	dealPageJs: function(data){
		var jsReg = /^[<script][.\n]*[</script>]$/;

		data = data.replace(jsReg, 'jsCode');
		console.log(data.replace(jsReg, 'jsCode'))
		return data;
	},

	change: function(){data.replace(jsReg, 'jsCode')
		var hash = window.location.hash.split(/[#?]/)[1];
		hash = hash ? hash : "";
		var currentUrlData = this.getCurrentUrlData(hash);
		server.getPage(common_data.webFileHeadUrl + currentUrlData.path, function(data){
			this.dealPageJs(data);
			document.getElementsByTagName("title")[0].innerText = currentUrlData.title;
			document.getElementsByTagName("body")[0].innerHTML = data;
		}.bind(this))
	}
}

;(function(){
	var router = new Router();

	router.init();
})();