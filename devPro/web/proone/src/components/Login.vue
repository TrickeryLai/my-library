<template>
<div>
	<h1>{{title}}</h1>
	<label>
		<span>用户名：</span>
		<MyInput type="text" placeholder="请输入用户名" v-model = "user.username"></MyInput>
	</label>
	<label class="login-password">
		<span>密码：</span>
		<PasswordInput 
			placeholder = "请输入密码"
			v-model = "user.password"
		/>
	</label>
	<button type="button" @click="submit">{{buttonText}}</button>
	<div class="login-bottom">
		<span>忘记密码？</span>
		<span @click="registerFn">注册</span>
	</div>
	<Model :isModelVialiable = 'modelState' @ok="modelOk" isAutoHide = true closeBtnHide=true>
		<template v-slot:model-content>{{errTip}}</template>
	</Model>
</div>
</template>

<script>

export default{
	name: 'Login',
	data(){
		return {
			title: '登录',
			buttonText: '确定',
			passwordType: 'password',
			isShow: false,
			password: '',
			modelState: false,
			errTip: '',
			user: {
				username: "",
				password: ""
			},
		}
	},
	methods: {
		submit(){
			let url = '/login';
			let _this = this;
			this.$axios.post({
				url, 
				data: this.user,
				success(res){
					if(res.data.code == 0){
						sessionStorage.setItem('userData', JSON.stringify(res.data.data));
						_this.$router.push('user/list');
					}else{
						_this.modelState = true;
						_this.errTip = res.data.errmsg;
					}
				}})
		},
		registerFn(){
			this.$router.push('register');
		},
		modelOk(){
			this.modelState = false;
		}
	}
}
</script>