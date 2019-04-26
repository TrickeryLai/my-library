<template>
<div class="register-content">
	<van-nav-bar
		fixed
		class="top-bg"
  	>	
  		<span slot="title" class="top-bg-title">{{title}}</span>
    	<!-- <i class="iconfont icon-previous_step top-bg-title" slot="left"></i> -->
  	</van-nav-bar>
  	<div style="position: absolute;top:43%;left:50%;width:100%;transform:translate(-50%,-50%);">
  		  	<div :style="{backgroundImage:'url('+topImg+')'}"
  	style="height:110px;margin: 10px 40px 30px;background-position:center;background-size:cover;background-repeat: no-repeat;">
		</div>
	  	<div style="margin: 10px 40px 0;">
			<van-row >
				<van-col span="2" style="background: #eee;height: 36px;line-height: 36px;">
					<i class="iconfont icon-mine"></i>
				</van-col>
				<van-col span="22">
					<van-field 
						class="van-hairline--surround register-input"
						style="display:inline-block;margin:0;padding:0;" 
						v-model.trim="register.username" placeholder="请输入用户名"
						type="text" />

				</van-col>
			</van-row>
			<van-row >
				<van-col span="2" style="background: #eee;height: 36px;line-height: 36px;">
					<i class="iconfont icon-lock"></i>
				</van-col>
				<van-col span="22">
					<PasswordI v-model.trim="register.password"/>
					<!-- <van-field 
						class="van-hairline--surround register-input"
						style="display:inline-block;margin:0;padding:0;" 
						v-model="register.password" placeholder="请输入密码"
						type="password" /> -->
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
						v-model.trim="register.code" placeholder="请输入验证码"
						type="text"
						/>
				</van-col>
				<van-col span="8">
					<img style="height: 33px;width:100%" 
					:src="img"
					@click="changeCodePic"
					>
				</van-col>
			</van-row>
			<p class="text-right deep-blue-font" >
				<span @click="gotoFindWord">忘记密码？</span>
			</p>
			<div class="login-bottom">
				<van-button 
					type="info"
					@click="loginFn"
					style="width: 100%;border-radius: 100px;background:#011629;border-color: #011629;"
				>登录</van-button>
				<p style="padding: 5px;">没有已有账号，<span class="blue-font" @click="gotoRegister">立即注册</span></p>
			</div>
	  	</div>
  	</div>
</div>
</template>

<script>
import _server from '@/server/server';
import PasswordI from '@/components/PasswordI';
import topImg from '@/assets/top-bg.png';

export default{
	name: "Login",
	components:{
		PasswordI
	},
	data(){
		return {
			img: '',
			title: '登录',
			isLogining: false,
			getCaptchaState: false,
			isShowWord: false,
			topImg: topImg,
			register: {
				username: "",
				password: ""
			}
		}
	},
	created(){
		// window.location.href = '#';
		this.changeCodePic();
		this.initData()
	},
	methods: {
		onClickLeft(){
			window.history.go(-1);
		},
		initData(){
			let params = this.$route.params;
			this.register = Object.assign({}, this.register, params)
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

			_server.login(data).then((response) =>{
				if(response.code == 0){
					// _this.$toast('登录成功');
					let loginData = {
						loginName: _this.register.username,
						password: _this.register.password
					};
					//登录之后跳转的路由， 默认大厅， 通过redirect 设置
					let path = this.$route.query.redirect? decodeURIComponent(this.$route.query.redirect) : '/home/billHall';

					// localStorage.setItem('loginData', JSON.stringify(loginData));
					localStorage.setItem('token', response.token);
					localStorage.setItem('user', JSON.stringify(response.user));
					localStorage.setItem('userId', JSON.stringify(response.user.userId));
					this.$router.replace({path});
            	//注册成功
                }else if(response.code == 110008){
                	//验证码已失效
                	this.$toast(response.errMsg);
                	//重新获取验证码
                	this.changeCodePic();
                }
			}).catch(error => {

			});

		},
		gotoRegister(){
			this.$router.replace({path: 'register'})
		},
		gotoFindWord(){
			this.$router.replace({path: '/forgetPassword'})
		},
		changeCodePic(){
			if(this.getCaptchaState){
				return;
			}
			this.getCaptchaState = true;
			//更换验证码图片
			_server.getCaptchaPic().then((response)=>{
				this.getCaptchaState = false;
				this.captchaKey = response.captchaKey;
        		this.img = "data:image/jpg;base64," + response.captchaImage;
			}).catch(error => {
				this.getCaptchaState = false;
			})		
		}
	}
}
</script>

<style scoped>
.register-content{
	background: #f5f5f5;
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
	font-size: 24px;
	color:#232333;
	margin: 30px 0 25px;
	text-shadow: 2px 2px 2px #fff;
}
.register-content .title{
	font-weight: normal;
	font-size: 20px;
	text-align: left;
	color: #232333;
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
