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
		<h1 class="title">欢迎注册</h1>
		<van-row >
			<van-col span="2" style="background: #eee;height: 36px;line-height: 36px;">
				<i class="iconfont icon-nickname"></i>
			</van-col>
			<van-col span="22">
				<van-field 
				class="van-hairline--surround register-input"
				style="display:inline-block;margin:0;padding:0;" 
				v-model="register.loginName" placeholder="请输入用户名"
				:error="registerError.loginName"
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
				<i class="iconfont icon-lock"></i>
			</van-col>
			<van-col span="22">
				<van-field 
				class="van-hairline--surround register-input"
				style="display:inline-block;margin:0;padding:0;" 
				v-model="register.password2" placeholder="请再次输入密码"
				type="password" />
			</van-col>
		</van-row>
		<van-row >
			<van-col span="2" style="background: #eee;height: 36px;line-height: 36px;">
				<i class="iconfont icon-link"></i>
			</van-col>
			<van-col span="22">
				<van-field 
				class="van-hairline--surround register-input"
				style="display:inline-block;margin:0;padding:0;" 
				v-model="register.email" placeholder="请输入邮箱"
				type="email" />
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
			<van-col 
			span="8" 
			>
			<img style="height: 32px;width: 100%;" 
			:src="img"
			@click="changeCodePic"
			>
		</van-col>
		
	</van-row>
	<van-row >
		<van-col span="2" style="background: #eee;height: 36px;line-height: 36px;">
			<i class="iconfont icon-mobile-alt"></i>
		</van-col>
		<van-col span="22">
			<van-field 
			class="van-hairline--surround register-input"
			style="display:inline-block;margin:0;padding:0;" 
			v-model="register.phone" placeholder="请输入手机号"
			type="phone" />
		</van-col>
	</van-row>
	<div class="login-bottom">
		<van-button 
		type="info"
		@click="registerFn"
		style="width: 100%;border-radius: 100px;"
		>确认</van-button>
		<p style="padding: 5px;">已有账号，<span class="blue-font" @click="gotoLogin">立即登录</span></p>
	</div>
</div>
</template>

<script>
import _server from '@/server/server';

export default{
	name: "Register",
	data(){
		return {
			img: '',
			title: '注册',
			captchaKey: '', 
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
	methods: {
		onClickLeft(){
			window.history.go(-1);
		},
		checkLoginMessage(){
			let re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/; 
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
			
		    if (!re.test(this.register.email)) {
		     	this.$toast('邮箱格式不正确！');
				return false;
		    } 
			if(!this.register.code){
				this.registerError.code = true;
				this.$toast('请输入验证码！');
				return false;
			}

			if(this.register.phone && !(/^1[345789]\d{9}$/.test(this.register.phone))){ 
				this.registerError.phone = true;
		        this.$toast('请输入正确的手机号！');
		        return false; 
		    } 
			return true;
		},
		registerFn(){
			let _this = this, data;
			if(!this.checkLoginMessage()){
				return;
			}
			data = {
					loginName: this.register.loginName,
					password: this.register.password, 
					phoneNumber: this.register.phoneNumber, 
					email: this.register.email, 
					captchaCode: this.register.code, 
					captchaKey: this.captchaKey
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
			this.$router.push({path: 'login'});
		},
		changeCodePic(){
			let _this = this;
			// let data = {captchaKey: "13f65279-42bb-418b-9569-8537f2438ac2", captchaImage: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAoCAIAAAC6iKlyAAAE9UlEQVR42u3ab2hXVRgH8JsoKm6GlgzLGhqiCA5ERGQuWwglCv115tQlvvhtoqLMdKkh+CIb4Yi2MsiVIhgZKjZhw3ey5dThSkQUER2bMHX6RmcWodNHnvF0POfcc59z7rn393vh4ev22/23nx8fn3vO3YLHz0cyY+i8IvHLAP701dQ/d0naOsBPaVq3rz0MiXOFFXfuY6Tt79fOwqTwt8iUV4qJtA5oU8p1jdwovvOTI5Exi0v0JJ4C+jfju1V3kR6tA/GclK3burokcRpfLGqFxCl2FT1R61G7F+Lr7r4FYsg6cLv0sZNveHmLP9W+TFHFkZvEy+a03sr0QXKwHYM1lrY0SDxwvrQva04TF8WJG1PxdYF45IdXtsHHj9a8lC1uKm1pBHGuC9Zh3CUDOyFhJ9aMdaxKqcC16LlpHcS/tKG0kVuLDtbO3NIYPWw3ZnJ9Pgas4WNy1pM6N1K2Ha0zxw/04h86MU3lm6VEotO58HrTvAwn2vfw18UxnEhnTVyyxS1mkGtVZRBNRZfsLfYCjV7iUOlR/5ff94C1eCKUNhO68tVONTkFHcb9tKJ9WbudBe5MZW1FM5U9QtdOq8BYcScLXZe3ISx0FrwmR0DH0BV6t35l/u6q4+GHn0vRnmhVodpB4mZ05A683Bxsi1o63tyCzdYEfaG9jyIesGV+I8Y7tNUIhR459yBE3FLdMZcSCb16dSElJrTZOqwzqIPEMbkC7bGiRXR0t4U2WPOhwyparPdVLQMYLyzFLR2eoTndo/TMAYyDcvxyNkB33DsHkfaS+MkF6yDxrdODVo9E96xAf3vjvNQ6kFsVxxGHG639Q0NaM1f5824JWp3Snf61i2KGjpzScW6GIveSmvFi3LhZ0P2VgzO/g3UPwqItarDWcquFz5xBd+Q/nUuI6BC3GTRn1qGtbsn99ea/+dYWFV3wxx5MnO7hDI3W46bUQxA9zmpFhIY2AoEteUUzbKsVrJncLq2DxCV0w3I8sm+I3WNMWzlEe8CyRz0Q5I6kTGJl6Mb946I2bz06sqhfrP/ZXM7S8WQdNjNh9mK/0O8WfhYWM3fi0EP2/avd2zy7ITLautZ+X6zxyGd7CVU0p7qTgpasl/fujWws5mE7Cxz5cbW5qJ1Xhr/lVUGyszLkdA/aDuhSkoMuXdgMIWj8EhNzCW7LrYc+f7YEkhA0NGtpFwc9dypa5eaImyoauR3EVes4TSOhlbrfh0rIvbnqLUgo9NszIt69rTgfms+nHslff3uEnrmyRYp6DHJLGazoSGurliLe94benGC4DZqhp2yfhMkdaA796BdapfzfOjLdbzKtHYpaRMdw5tHafw9E9zuPTuFhNFinCk17SRxiBe3w9C4XoJ+paH4DsZ1Qm++E5h+/Wv1klrlUySa0NArHDg+LszWnYG1/o4P5XOlUf4UBOub68J+tH8RdsExd/5o24jHDjy6NDx1pzbzXGZ7bgTUlPvSIgotqpHc1/9KnYqJXhqX779r+N7k2sREiQeNGCpPbYbLMnI34qmhmXQ9CX/7vOqaht8GLdY6ME++chjic+GfTdxjt3tvf9ztC0yDxNKF3HX8vBW43dBKX0MFa4jZbh7YOKG2xuhOyfuVQEUXl3lXdA8kK+pcTlkMiryZx9+wrlmL99C6d7gHWSVe3Fl2uvrJlYWls30HBgwem56udRB1PAEIWrUUZIpNEAAAAAElFTkSuQmCC"}

			// this.img = "data:image/jpg;base64," + data.captchaImage;
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
