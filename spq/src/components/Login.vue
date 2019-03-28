<template>
<div class="register-content">
	<van-nav-bar
		:title="title"
		left-arrow
		fixed
		@click-left="onClickLeft"
		class="top-bg"
		/>
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
				@click="changeCodePic"
				/>
		</van-col>
		<van-col span="8">
			<img style="height: 32px;" 
					:src="img">
		</van-col>
		
	</van-row>
	<div class="login-bottom">
		<van-button 
			type="info"
			@click="loginFn"
			style="width: 100%;border-radius: 100px;"
		>确认</van-button>
		<p style="padding: 5px;">没有已有账号，<span class="blue-font" @click="gotoRegister">立即注册</span></p>
	</div>
</div>
</template>

<script>
import img from '@/assets/logo.png'

export default{
	name: "Login",
	data(){
		return {
			img: img,
			title: '登录',
			register: {
				password: ""
			}
		}
	},
	methods: {
		onClickLeft(){
			window.history.go(-1);
		},
		loginFn(){

		},
		gotoRegister(){
			this.$router.push({path: 'register'})
		},
		changeCodePic(){
			//更换验证码图片
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