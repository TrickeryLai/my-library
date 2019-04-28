<template>
	<div class="register-content">
		<van-nav-bar
		left-arrow
		fixed
		@click-left="onClickLeft"
		class="top-bg"
		>
			<span slot="title" class="top-bg-title">{{title}}</span>
			<i class="iconfont icon-previous_step top-bg-title" slot="left"></i>
		</van-nav-bar>
		<div :style="{backgroundImage:'url('+topImg+')'}"
  	style="height:80px;margin: 20px 0px 10px;background-position:center;background-size:cover;background-repeat: no-repeat;"></div>
		<van-row>
			<van-col span="1" class="red-font" style="padding-top: 12px;">*</van-col>
			<van-col span="2" style="background: #eee;height: 36px;line-height: 36px;">
				<i class="iconfont icon-mine"></i>
			</van-col>
			<van-col span="21">
				<van-field 
				class="van-hairline--surround register-input"
				style="display:inline-block;margin:0;padding:0;" 
				v-model.trim="register.loginName"
				placeholder="请输入用户名"
				:error="registerError.loginName"
				type="text" />
			</van-col>
		</van-row>
		<van-row >
			<van-col span="1" class="red-font" style="padding-top: 12px;">*</van-col>
			<van-col span="2" style="background: #eee;height: 36px;line-height: 36px;">
				<i class="iconfont icon-lock"></i>
			</van-col>
			<van-col span="21">
				<PasswordI
					autocomplete="new-password"
					v-model.trim="register.password"
					placeholder="请输入密码"
				/>
				<!-- <van-field 
				autocomplete="new-password"
				class="van-hairline--surround register-input"
				style="display:inline-block;margin:0;padding:0;" 
				v-model="register.password" placeholder="请输入密码"
				type="password" /> -->
			</van-col>
		</van-row>
		<van-row >
			<van-col span="1" class="red-font" style="padding-top: 12px;">*</van-col>
			<van-col span="2" style="background: #eee;height: 36px;line-height: 36px;">
				<i class="iconfont icon-lock"></i>
			</van-col>
			<van-col span="21">
				<PasswordI
					autocomplete="new-password"
					v-model.trim="register.password2"
					placeholder="请再次输入密码"
				/>
				<!-- <van-field 
				autocomplete="new-password"
				class="van-hairline--surround register-input"
				style="display:inline-block;margin:0;padding:0;" 
				v-model="register.password2" placeholder="请再次输入密码"
				type="password" /> -->
			</van-col>
		</van-row>
		<van-row >
			<van-col span="1" class="red-font" style="padding-top: 12px;">*</van-col>
			<van-col span="2" style="background: #eee;height: 36px;line-height: 36px;">
				<i class="iconfont icon-link"></i>
			</van-col>
			<van-col span="21">
				<van-field 
				class="van-hairline--surround register-input"
				style="display:inline-block;margin:0;padding:0;" 
				v-model.trim="register.email" placeholder="请输入邮箱"
				type="email" />
			</van-col>
		</van-row>
		<van-row >
			<van-col span="1" class="red-font" style="padding-top: 12px;">*</van-col>
			<van-col span="2" style="background: #eee;height: 36px;line-height: 36px;">
				<i class="iconfont icon-mobile-alt"></i>
			</van-col>
			<van-col span="21">
				<van-field 
				class="van-hairline--surround register-input"
				style="display:inline-block;margin:0;padding:0;" 
				v-model.trim="register.phone" placeholder="请输入手机号"
				type="number" />
			</van-col>
		</van-row>
		<van-row >
			<van-col span="1" class="red-font" style="padding-top: 12px;">*</van-col>
			<van-col span="2" style="background: #eee;height: 36px;line-height: 36px;">
				<i class="iconfont icon-safety-certificate"></i>
			</van-col>
			<van-col span="13">
				<van-field 
				class="van-hairline--surround register-input"
				style="display:inline-block;margin:0;padding:0;" 
				v-model.trim="register.smsCaptcha" placeholder="请输入短信验证码"
				type="number"
				
				/>
			</van-col>
			<van-col 
			span="8" 
			>
				<van-button
					size="small"
					style="font-size: 12px;width: 100%;height: 34px;background:#011629;border-color: #011629;color: #fff;"
					@click="getSmsCaptcha"
					:disabled="getSmsAgainTime != 61"
				>
						{{smsCaptchaTxt}}
				</van-button>
			</van-col>
		
		</van-row>
		<van-row >
			<van-col span="1" class="red-font" style="padding-top: 12px;">*</van-col>
			<van-col span="2" style="background: #eee;height: 36px;line-height: 36px;">
				<i class="iconfont icon-safety-certificate"></i>
			</van-col>
			<van-col span="13">
				<van-field 
				class="van-hairline--surround register-input"
				style="display:inline-block;margin:0;padding:0;" 
				v-model.trim="register.code" placeholder="请输入右侧验证码"
				type="text"
				
				/>
			</van-col>
			<van-col 
			span="8" 
			>
			<img style="height: 32px;width: 100%;" 
			:src="img"
			@click="changeCodePic"
			>
			</van-col>
		
		</van-row>
		<div class="login-bottom">
			<van-button 
			@click="registerFn"
			style="width: 100%;border-radius: 100px;background:#011629;border-color: #011629;color: #fff;"
			>确认</van-button>
			<p style="padding: 5px;">已有账号，<span class="blue-font" @click="gotoLogin">立即登录</span></p>
		</div>
</div>
</template>

<script>
import _server from '@/server/server';
import _common from '@/server/index';
import PasswordI from '@/components/PasswordI';
import topImg from '@/assets/top-bg.png';

export default{
	name: "Register",
	components:{
		PasswordI
	},
	data(){
		return {
			img: '',
			title: '注册',
			topImg: topImg,
			captchaKey: '', 
			smsCaptchaKey: '',
			getSmsAgainTime: 61,
			getCaptchaState: false,
			smsCaptchaTxt: '获取验证码',
			register: {
				password: ""
			},
			registerError:{
				loginName: false,
				password: false
			}
		}
	},
	created(){
		this.changeCodePic();
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
		checkLoginMessage(){
			if(!this.register.loginName){
				this.registerError.loginName = true;
				this.$toast('请输入用户名！');
				return false;
			}
			if(!this.register.password || !this.register.password2){
				this.registerError.password = true;
				this.$toast('请输入密码！');
				return false;
			}
			if(this.register.password !== this.register.password2){
				this.registerError.password = true;
				this.$toast('两次输入密码不一致！');
				return false;
			}
			if(!this.register.email){
				this.registerError.email = true;
				this.$toast('请输入邮箱！');
				return false;
			}
			
		    if (!_common.common_reg.email(this.register.email)) {
		     	this.$toast('邮箱格式不正确！');
				return false;
		    }
		    if(!this.register.smsCaptcha){
		    	this.$toast('请输入短信验证码！');
		    	return false;
		    } 
			if(!this.register.code){
				this.registerError.code = true;
				this.$toast('请输入图片验证码！');
				return false;
			}

			if(!this.register.phone || !_common.common_reg.phone(this.register.phone)){ 
				this.registerError.phone = true;
		        this.$toast('请输入正确的手机号！');
		        return false; 
		    } 
			return true;
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
			if(!this.register.phone || !_common.common_reg.phone(this.register.phone)){
				this.$toast('请先输入正确的手机号！');
				return;
			}
			//获取短信验证码
			_server.getSmsCaptcha(this.register.phone).then(res => {
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
		registerFn(){
			let _this = this, data;
			if(!this.checkLoginMessage()){
				return;
			}
			data = {
					loginName: this.register.loginName,
					password: this.register.password, 
					phoneNumber: this.register.phone, 
					email: this.register.email, 
					captchaCode: this.register.code, 
					smsCaptcha: this.register.smsCaptcha,//短信验证码
					smsCaptchaKey: this.smsCaptchaKey,//
					captchaKey: this.captchaKey,
				};
			_server.register(data, (response) =>{
				if(response.code == 0){
						_this.$toast('注册成功');
						_this.$router.replace({name: 'Login', params:{
							username: this.register.loginName,
							password: this.register.password 
						}});
		        //注册成功
		        }else if(response.code == 110008){
		          //验证码已失效
		          _this.$toast(response.errMsg);
		          //重新获取验证码
		          _this.changeCodePic();
		        }
			})	
		},
		gotoLogin(){
			this.$router.replace({path: 'login'});
		},
		changeCodePic(){
			if(this.getCaptchaState){
				return;
			}
			this.getCaptchaState = true;
			//更换验证码图片
			_server.getCaptchaPic().then((response) => {
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
	padding: 0px 0px 10px;
}
.register-content .top-title{
	font-weight: bold;
	font-size: 20px;
	color:#000;
	margin:30px 0 20px;
}
.register-content .title{
	font-weight: normal;
	font-size: 18px;
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
