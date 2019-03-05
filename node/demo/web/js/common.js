
var common_data = {
	headUrl: "http://localhost:8890",
	webFileHeadUrl: window.location.protocol + '//' + window.location.host + "/",
}


var server = {
	getRource: function(url, callback){
		var ajax = new XMLHttpRequest(),
			token = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : "";

		ajax.open("get", url);
		if(token){
			ajax.setRequestHeader("token", token);// open 之后 ，send 之前
		}
		
		ajax.send();

		ajax.onreadystatechange = function(){
			if(ajax.readyState == 4 && ajax.status == 200){
				var resData = ajax.responseText;
				callback(resData);
			}
		}
	},

	post: function(url, data, callback){
		var ajax = new XMLHttpRequest(),
			token = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : "";

		ajax.open("post", url);
		if(token){
			ajax.setRequestHeader("token", token);
		}
		if(data && typeof data == 'object'){
			data = JSON.stringify(data);
			ajax.send(data);
		}else{
			ajax.send();
		}
		ajax.onreadystatechange = function(){
			if(ajax.readyState == 4 && ajax.status == 200){
				var data = JSON.parse(ajax.responseText);
				callback(data);
			}
		}
	},

	get: function(url, callback){
		this.getRource(url, function(resData){
			resData = JSON.parse(resData);
			callback(resData);
		})
	},

	getPage: function(url, callback){
		this.getRource(url, function(resData){
			callback(resData);
		})
	}
}

var common_fn = {
	getRadioValue: function(name){
		var total = document.getElementsByName(name),
			len = total.length;

		for(var i = 0 ; i < len; i++){
			if(total[i].checked == true){
				return total[i].value;
			}
		}
	},

	addClass: function(ele, cs){
		var classA = ele.className.split(" ");

		if(classA.indexOf(cs) < 0){
			classA.push(cs);
		}
		ele.className = classA.join(" ")
		return this;
	},

	removeClass: function(ele, cs){
		var classA = ele.className.split(" "),
			newA = [];

		classA.forEach(function(item){
			if(item != cs){
				newA.push(item);
			}
		})
		ele.className = newA.join(" ")
		return this;
	},

	toggleClass: function(ele, cs){
		if(ele.className.split(" ").indexOf(cs) >=0){
			this.removeClass(ele, cs);
		}else{
			this.addClass(ele, cs);
		}
	},

	hasClass: function(ele, cs){
		if(ele.className.split(" ").indexOf(cs) >=0){
			return 1;
		}else{
			return 0;
		}
	},

	show: function(ele){
		ele.style.display = "block";
		return this;
	},

	hide: function(ele){
		ele.style.display = "none";
		return this;
	},

	formatterTime: function(time, formatter){
		formatter = formatter || "yyyy-MM-dd: hh:mm:ss";

		var times = new Date(time);
		var yyyy, MM, dd, hh, mm, ss;
		yyyy = times.getFullYear();
		MM = times.getMonth() + 1;
		dd = times.getDay();
		hh = times.getHours();
		mm = times.getMinutes();
		ss = times.getSeconds();

		formatter.replace('yyyy', yyyy);

		
	}
}