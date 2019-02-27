
window.onload = function(){
	
	//登录
	document.getElementById("login_submit").addEventListener("click", function(e){
		var data = {};

		data.password = document.getElementById("login_password").value;
		data.name = document.getElementById("login_name").value;

		if(!data.password){
			alert('请输入密码')
			return;
		}

		if(!data.name){
			alert('请输入账户名');
			return;
		}

		server.post(common_data.headUrl + '/login', data, function(res){
			if(res.code == 1){
				alert(res.errmsg);
				return;
			}
			sessionStorage.setItem("token", res.data.token);
			sessionStorage.setItem("loginData", JSON.stringify(res.data));
			window.location = window.location.origin + '/html/user.html';
		})
	})

	//密码显示
	Array.prototype.forEach.call(document.getElementsByClassName("login_password_showBox"), function(item){
		item.getElementsByClassName("login-password-state")[0].addEventListener("click", function(e){
		if(this.className.split(" ").indexOf("active") >= 0){
			common_fn.removeClass(this, 'active');
			this.parentNode.getElementsByClassName("login-password")[0].setAttribute('type', 'password');
		}else{
			common_fn.addClass(this, 'active');
			this.parentNode.getElementsByClassName("login-password")[0].setAttribute('type', 'text');
		}
	})
	})

	//忘记密码
	document.getElementById("login_forgetPassword").addEventListener("click", function(e){

	})

	//注册
	document.getElementById("register_submit").addEventListener("click", function(e){
		var password1 = document.getElementById("register_password1").value,
			password2 = document.getElementById("register_password2").value,
			name = document.getElementById("register_name").value,
			data = {};

		if(password1 !== password2){
			alert("两次输入密码不一致！");
			return;
		}

		data = {
			name: name,
			password: password2,
		};

		server.post(common_data.headUrl + '/register', data, function(res){
			if(res.code == 1){
				alert(res.errmsg);
				return;
			}

			//注册成功
		})

	})

	//登录--注册切换
	Array.prototype.forEach.call(document.getElementsByClassName("login-title"), function(item){
		item.addEventListener("click", function(){
			Array.prototype.forEach.call(item.getElementsByTagName('span'), function(i, index){
				common_fn.toggleClass(i, "active-text");
				if(common_fn.hasClass(i, "active-text") && index == 0){
					common_fn.show(document.getElementById("login_box")).hide(document.getElementById("register_box"));
				}

				if(common_fn.hasClass(i, "active-text") && index == 1){
					common_fn.show(document.getElementById("register_box")).hide(document.getElementById("login_box"));
					
				}
			})
		})
	})
	
}