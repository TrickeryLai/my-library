<template>
<div class="register-content">
	<van-nav-bar
		:title="title"
		left-arrow
		fixed
		@click-left="onClickLeft"
		class="top-bg"
  >
    <i class="iconfont icon-previous_step" slot="left"></i>
  </van-nav-bar>
	<h1 class="top-title">票据融资，多、块、好、省</h1>
	<h1 class="title">欢迎登录</h1>
	<van-row >
		<van-col span="2" style="background: #eee;height: 36px;line-height: 36px;">
			<i class="iconfont icon-nickname"></i>
		</van-col>
		<van-col span="22">
			<van-field 
				class="van-hairline--surround register-input"
				style="display:inline-block;margin:0;padding:0;" 
				v-model="register.username" placeholder="请输入用户名"
				type="text" />

		</van-col>
	</van-row>
	<van-row >
		<van-col span="2" style="background: #eee;height: 36px;line-height: 36px;">
			<i class="iconfont icon-lock"></i>
		</van-col>
		<van-col span="22">
			<van-field 
				class="van-hairline--surround register-input"
				style="display:inline-block;margin:0;padding:0;" 
				v-model="register.password" placeholder="请输入密码"
				type="password" />
		</van-col>
	</van-row>
	<van-row >
		<van-col span="2" style="background: #eee;height: 36px;line-height: 36px;">
			<i class="iconfont icon-safety-certificate"></i>
		</van-col>
		<van-col span="14">
			<van-field 
				class="van-hairline--surround register-input"
				style="display:inline-block;margin:0;padding:0;" 
				v-model="register.code" placeholder="请输入验证码"
				type="text"
				/>
		</van-col>
		<van-col span="8">
			<img style="height: 33px;width:100%" 
			:src="img"
			v-if="img"
			@click="changeCodePic"
			>
		</van-col>
		
	</van-row>
	<div class="login-bottom">
		<van-button 
			type="info"
			@click="loginFn"
			style="width: 100%;border-radius: 100px;"
		>登录</van-button>
		<p style="padding: 5px;">没有已有账号，<span class="blue-font" @click="gotoRegister">立即注册</span></p>
	</div>
</div>
</template>

<script>
import _server from '@/server/server'

export default{
	name: "Login",
	data(){
		return {
			img: '',
			title: '登录',
			isLogining: false,
			register: {
				password: ""
			}
		}
	},
	created(){
		this.changeCodePic();
	},
	methods: {
		onClickLeft(){
			window.history.go(-1);
		},
		loginInfoCheck(){
			if(!this.register.username){
				this.$toast('请输入用户名!');
				return false;
			}

			if(!this.register.password){
				this.$toast('请输入密码!');
				return false;
			}

			if(!this.register.code){
				this.$toast('请输入验证码!');
				return false;
			}

			return true;
		},
		loginFn(){
			let _this = this, data;
			if(!this.loginInfoCheck()){
				return;
			}
			data = {
					loginName: this.register.username,
					password: this.register.password,  
					captchaCode: this.register.code, 
					captchaKey: this.captchaKey
			};

			_server.login(data, (response) =>{
				if(response.code == 0){
					// _this.$toast('登录成功');
					let loginData = {
						loginName: _this.register.username,
						password: _this.register.password
					};
					//登录之后跳转的路由， 默认大厅， 通过redirect 设置
					let path = this.$route.query.redirect? decodeURIComponent(this.$route.query.redirect) : '/home/billHall';

					localStorage.setItem('loginData', JSON.stringify(loginData));
					localStorage.setItem('token', response.token);
					localStorage.setItem('user', JSON.stringify(response.user));
					_this.$router.replace({path});
            	//注册成功
                }else if(response.code == 110008){
                	//验证码已失效
                	_this.$toast(response.errMsg);
                	//重新获取验证码
                	_this.changeCodePic();
                }
			})

		},
		gotoRegister(){
			this.$router.push({path: 'register'})
		},
		changeCodePic(){
			let _this = this;
			//更换验证码图片
			_server.getCaptchaPic((response)=>{
				_this.captchaKey = response.captchaKey;
        		_this.img = "data:image/jpg;base64," + response.captchaImage;
			})		
		}
	}
}
</script>

<style scoped>
.register-content{
	background: #f5f5f5;
	border-radius: 5px;
	margin: 10px 40px 0;
}
.register-content .van-row{
	margin: 10px 0;
}
.register-content .get-code{
	background: #1989fa;
	color: #fff;
}
.register-content .get-code input{
	color: #fff!important;
}
.login-bottom{
	padding: 10px 0px 10px;
}
.register-content .top-title{
	font-weight: bold;
	font-size: 20px;
	color:#000;
	margin-bottom: 20px;
}
.register-content .title{
	font-weight: normal;
	font-size: 20px;
	text-align: left;
	color: #000;
	margin: 5px 0;
}
.input-box-wrap{
	position: relative
}
.my-input-icon{
	position:relative;
	left: 0;
	top: 0;
}
</style>
