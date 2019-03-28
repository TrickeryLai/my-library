<template>
<div>
	
	<h1>{{title}}</h1>
	<label>
		<span>用户名：</span>
		<MyInput type="text" placeholder="请输入用户名" v-model="user.username" />
	</label>
	<label class="login-password">
		<span>密码：</span>
		<PasswordInput 
			placeholder = "请输入密码"
			ref = "password1"
		/>
	</label>
	<label class="login-password">
		<span>再次输入密码：</span>
		<PasswordInput 
			placeholder = "请再次输入密码"
			ref = "password2"
		/>
	</label>
	<button type="button" @click="submit">{{buttonText}}</button>
	<div class="login-bottom">
		<span v-show="isLogin">{{tips}}&nbsp</span><span @click="loginFn">去登录</span>
	</div>
	<Model :isModelVialiable = 'modelState' @close="modelOk" isAutoHide = true >
		<template v-slot:model-content>{{tips}}</template>
	</Model>
</div>
</template>

<script>
import common from "@/commons/common.js";

export default{
	name: "Register",
	data(){
		return {
			title: '注册',
			buttonText: '确定',
			passwordType: 'password',
			isShow: false,
			password: '',
			isLogin: false,
			tips: "注册成功",
			modelState: false,
			user: {
				username: "",
				password: ""
			},
			register: {
				password: ""
			}
		}
	},
	methods: {
		submit(){

			let url = '/register';
			let _this = this;
			if(!this.user.username){
				this.tips = '账户不能为空';
				return;
			}
			if(this.$refs.password1.password !== this.$refs.password2.password){
				this.tips = '两次密码不一致';
				return;
			}
			this.user.password = this.$refs.password1.password

			this.$axios.post({
				url,
				data: this.user,
				success(res){
					_this.isLogin = true;
					if(res.data.code == 0){
						
					}else{
						_this.tips = res.data.errmsg || res.data.data;
						_this.modelState = true;
					}
				}
			})
		},
		loginFn(){
			this.$router.push('login');
		},
		modelOk(){
			this.modelState = false;
		}
	}
}
</script>