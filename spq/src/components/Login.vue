<template>
<div class="register-content">
	<van-nav-bar
		fixed
		class="top-bg"
  	>	
  		<span slot="title" class="top-bg-title">{{title}}</span>
    	<!-- <i class="iconfont icon-previous_step top-bg-title" slot="left"></i> -->
  	</van-nav-bar>
  	<!-- <div style="position: absolute;top:43%;left:50%;width:100%;transform:translate(-50%,-50%);"> -->
  		<div style="margin-top: 40px;">
  			<div style="height:110px;border-radius: 5px;width: 80%;margin:0 auto;background: #c00;color:#fff;font-family: '黑体'">
  				<p style="font-weight: bold;font-size:28px;letter-spacing: 5px;padding-top:25px;">商票之家</p>
  				<p style="margin-top:5px;letter-spacing: 3px;">您的票据融资首选</p>
  			</div>
  		  	<!-- <div :style="{backgroundImage:'url('+topImg+')'}"
  	style="height:110px;margin: 10px 40px 30px;background-position:center;background-size:cover;background-repeat: no-repeat;"> -->
		</div>
	  	<div style="margin: 10px 40px 0;">
	  		<div>
	  			<van-row>
	  				<van-col span="12">
	  					<div :class='{"loginTypeA": (loginType != "01")}' @click="loginTypeChangeFn('')">普通登录</div>
	  				</van-col>
	  				<van-col span="12" >
	  					<div @click="loginTypeChangeFn('01')" :class='{"loginTypeA": (loginType == "01")}' >手机号登录</div>
	  				</van-col>
	  			</van-row>
	  		</div>
	  		<div v-if="loginType !== '01'">
				<van-row >
					<van-col span="2" style="background: #eee;height: 36px;line-height: 36px;">
						<i class="iconfont icon-mine"></i>
					</van-col>
					<van-col span="22">
						<van-field 
							v-reset-page
							class="van-hairline--surround register-input"
							style="display:inline-block;margin:0;padding:0;" 
							v-model.trim="register.username" placeholder="请输入用户名或手机号"
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
							v-reset-page
							class="van-hairline--surround register-input"
							style="display:inline-block;margin:0;padding:0;" 
							v-model.trim="register.code" placeholder="请输入验证码"
							type="text"
							@blur="inputBlur"
							/>
					</van-col>
					<van-col span="8">
						<img style="height: 33px;width:100%" 
						:src="img"
						@click="changeCodePic"
						>
					</van-col>
				</van-row>
	  		</div>

	  		<div v-else>
				<van-row >
					<van-col span="2" style="background: #eee;height: 36px;line-height: 36px;">
						<i class="iconfont icon-mobile-alt"></i>
					</van-col>
					<van-col span="22">
						<van-field 
						pattern="[0-9]*"
						maxlength="11"
						v-reset-page
						class="van-hairline--surround register-input"
						style="display:inline-block;margin:0;padding:0;" 
						v-model.trim="phoneLogin.phone" placeholder="请输入手机号"
						type="number" />
					</van-col>
				</van-row>
				<van-row >
					<van-col span="2" style="background: #eee;height: 36px;line-height: 36px;">
						<i class="iconfont icon-safety-certificate"></i>
					</van-col>
					<van-col span="14">
						<van-field 
						v-reset-page
						class="van-hairline--surround register-input"
						style="display:inline-block;margin:0;padding:0;" 
						v-model.trim="phoneLogin.smsCaptcha" placeholder="请输入短信验证码"
						type="number"
						
						/>
					</van-col>
					<van-col 
					span="8" 
					>
						<van-button
							size="small"
							style="font-size: 12px;width: 100%;height: 34px;background:#c00;border-color: #c00;color: #fff;"
							@click="getSmsCaptcha"
							:disabled="getSmsAgainTime != 61"
						>
								{{smsCaptchaTxt}}
						</van-button>
					</van-col>
				</van-row>
				<van-row >
					<van-col span="2" style="background: #eee;height: 36px;line-height: 36px;">
						<i class="iconfont icon-safety-certificate"></i>
					</van-col>
					<van-col span="14">
						<van-field 
							v-reset-page
							class="van-hairline--surround register-input"
							style="display:inline-block;margin:0;padding:0;" 
							v-model.trim="phoneLogin.code" placeholder="请输入验证码"
							type="text"
							@blur="inputBlur"
							/>
					</van-col>
					<van-col span="8">
						<img style="height: 33px;width:100%" 
						:src="img"
						@click="changeCodePic"
						>
					</van-col>
				</van-row>
	  		</div>
			<p class="clear deep-blue-font" >
				<span @click="gotoFindUserName" class="fl">忘记用户名？</span><span @click="gotoFindWord" class="fr">忘记密码？</span>
			</p>
			<div class="login-bottom">
				<!-- <van-button 
					v-reset-page
					type="info"
					@click="loginFn"
					style="width: 100%;border-radius: 100px;background:#011629;border-color: #011629;"
				>登录</van-button> -->
				<van-button 
					v-reset-page
					type="info"
					@click="loginFn"
					style="width: 100%;border-radius: 100px;background:#c00;border-color: #c00;"
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

import _common from '@/server/index'

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
			loginType: '',
			register: {
				username: "",
				password: "",
				code: "",
			},
			phoneLogin: {
				phone: "",
				smsCaptcha: "",
				code: ""	
			},
			smsCaptchaKey: '',
			getSmsAgainTime: 61,
			getCaptchaState: false,
			smsCaptchaTxt: '获取验证码',
		}
	},
	created(){
		// window.location.href = '#';
		this.changeCodePic();
		this.initData();
		console.log(this)
	},
	watch:{
		'register.code'(newV){
			if(!newV){
				return ;
			}
			this.register.code = newV.replace(/[^\w\/]/ig,'');
		}
	},
	methods: {
		onClickLeft(){
			window.history.go(-1);
		},
		inputBlur(){
			window.scrollTo(0,0)
		},
		initData(){
			let params = this.$route.params;
			this.register = Object.assign({}, this.register, params)
		},
		loginTypeChangeFn(type){
			this.loginType = type;
		},
		loginInfoCheck(){

			if(this.loginType == '01'){
				if(!this.phoneLogin.phone || !_common.common_reg.phone(this.phoneLogin.phone)){
					this.$toast('请先输入正确的手机号！');
					return false;
				}
				if(!this.phoneLogin.smsCaptcha){
					this.$toast('请输入正确的短信验证码！');
					return false;
				}
				if(!this.phoneLogin.code){
					this.$toast('请输入图片验证码！');
					return false;
				}
			}else{
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
			}
			return true;
		},
		loginFn(){
			let _this = this, data;
			if(!this.loginInfoCheck()){
				return;
			}

			if(this.loginType != '01'){
				data = {
					loginName: this.register.username,
					password: this.register.password,  
					captchaCode: this.register.code, 
					captchaKey: this.captchaKey
				};
			}else{
				data = {
					type: '01',
					loginName: this.phoneLogin.phone,
					captchaCode: this.phoneLogin.code, 
					captchaKey: this.captchaKey,
					smsKey: this.smsCaptchaKey,
                  	smsCode: this.phoneLogin.smsCaptcha
				};
			}
			

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
					localStorage.setItem('loginData', JSON.stringify(response));

					localStorage.setItem('userId', JSON.stringify(response.user.userId));
					localStorage.setItem('phonenumber', JSON.stringify(response.user.phonenumber));

					if(response.companies){
						this.$router.replace({path: '/choseCompany'});
					}else{
						this.$router.replace({path});
					}
					
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
			this.$router.replace({path: 'register'});
		},
		gotoFindWord(){
			this.$router.replace({path: '/forgetPassword'});
		},
		gotoFindUserName(){
			this.$router.replace({path: '/forgetUserName'});
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
		},
		getSmsAgain(){
			let smsCaptchaTxt = '再次获取', intervaler;
			intervaler = setInterval( () =>{
				this.getSmsAgainTime -= 1;
				if(parseInt(this.getSmsAgainTime) <= 0){
					this.getSmsAgainTime = 61;
					clearInterval(intervaler);
					this.smsCaptchaTxt = '获取验证码';
					return;
				}
				
				this.smsCaptchaTxt = this.getSmsAgainTime + '秒再次获取';
			}, 1000)
		},
		getSmsCaptcha(){
			if(!this.phoneLogin.phone || !_common.common_reg.phone(this.phoneLogin.phone)){
				this.$toast('请先输入正确的手机号！');
				return;
			}
			//获取短信验证码
			_server.getSmsCaptcha(this.phoneLogin.phone,'','01').then(res => {
				if(res.errMsg){
					this.$toast(res.errMsg);
				}else{
					this.smsCaptchaKey = res.smsCaptchaKey;
					this.getSmsAgain();
					this.getSmsAgainTime -= 1;
				}
			}).catch(error => {

			})
		},
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
.loginTypeA{
	color: #f00;
	color: #c00;
	font-weight: bold;
}
</style>
