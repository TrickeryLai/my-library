<template>
	<div>
		<van-nav-bar
		left-arrow
		fixed
		@click-left="onClickLeft"
		class="top-bg"
		>
			<span slot="title" class="top-bg-title">{{title}}</span>
			<i class="iconfont icon-previous_step top-bg-title" slot="left"></i>
		</van-nav-bar>
		<div>
			<van-cell-group>
				<van-field
				v-model.trim="submitData.oldPwd"
				clearable
        		type="password"
				label="原密码"
				autocomplete="new-password"
				placeholder="原密码"
				/>
				<van-field
				v-model.trim="submitData.newPwd"
				clearable
        		type="password"
        		autocomplete="new-password"
				label="新密码"
				placeholder="新密码"
				/>
		        <van-field
		          v-model.trim="submitData.confirmPwd"
		          clearable
		          type="password"
		          autocomplete="new-password"
		          label="确认密码"
		          placeholder="确认密码"
		        />
			</van-cell-group>

			<div style="padding: 5px;">
				<van-button
				class="baseBtn" 
				style="width: 100%;"
				type="info"
				@click="submitInfo"
				>确认修改</van-button>
			</div>
			
		</div>
	</div>
</template>

<script>

  	import _server from '@/server/server';
	export default {
		name: 'ChangePassword',
		data(){
			return {
				title: '修改密码',
				pageType: '', // 1，登录密码 ，2 支付密码
				submitData: {

				}
			}
		},
		created(){
			this.pageType = this.$route.query.type;

			if(this.pageType == 1){
				this.title = '修改登录密码';
			}else if(this.pageType == 2){
				this.title = '修改支付密码';
			}
		},
		methods:{
			onClickLeft(){
				window.history.go(-1);
			},
			checkedInfo(){
				if(!this.submitData.newPwd){
					this.$toast('请输入原密码！');
					return false;
				}
				
				if(this.submitData.newPwd !== this.submitData.confirmPwd){
					this.$toast('两次密码输入不一致！');
					return false;
				}

				if(!_common.common_reg.password(this.submitData.newPwd)){
					this.$toast('密码应为6-20位的字母、数字！');
					return false;
				}
				return true;
			},
			loginChangeFn(){
				// 登录密码修改
				let data = {
					oldPwd: this.submitData.oldPwd,
					newPwd:  this.submitData.newPwd,
					confirmPwd:  this.submitData.confirmPwd,
					type: "change"
				};
				_server.changePassword(data, (res) => {
					if(res.code == 0){
						this.$toast('修改成功，请重新登录！');
						localStorage.clear();
						this.$router.replace({path: '/login'});
					}else{
						this.$toast(res.errMsg);
					}
				});
			},
			payChangeFn(){
				//支付密码修改
				let use = JSON.parse(localStorage.getItem('user'));
				let data = {
					companyName: use.orgName,
					companyId: use.orgId,
					oldPaymentPassword: this.submitData.oldPwd,
					paymentPassword: this.submitData.newPwd,
					paymentPassword2: this.submitData.confirmPwd,
				};
				_server.resetPassword(data).then(response => {
					if(response.code == 0){
						this.$toast('修改支付密码成功!');
						this.$router.go(-1);

					}
				}).catch(error => {

				})
			},
			submitInfo(){
				
				if(!this.checkedInfo()){
					return;
				}

				if(this.pageType == 1){
					this.loginChangeFn();
				}else if(this.pageType == 2){
					this.payChangeFn();
				}
				
			}
		}
	}
</script>

<style scope>

</style>
