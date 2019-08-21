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
		<div style="padding: 10px;background: #fff;">
			<van-cell-group>
				<van-row style="margin-bottom: 5px;">
					<van-col span="8" style="padding: 5px 0;">
						手机号
					</van-col>
					<van-col span="16">
						<van-field 
						v-reset-page
						class="van-hairline--surround register-input"
						style="display:inline-block;margin:0;padding:0;" 
						v-model="oldPhone"
						placeholder="请输入要修改的手机号"
						type="number"
						
						/>
					</van-col>
				</van-row>
				<van-row >
					<van-col span="8" style="padding: 5px 0;">
						短信验证码
					</van-col>
					<van-col span="10">
						<van-field 
						v-reset-page
						class="van-hairline--surround register-input"
						style="display:inline-block;margin:0;padding:0;" 
						v-model.trim="smsCaptcha" placeholder="请输入短信验证码"
						type="number"
						
						/>
					</van-col>
					<van-col 
					span="6" 
					>
						<van-button
							size="small"
							type="info"
							style="font-size: 12px;width: 100%;height: 34px;color: #fff;"
							class="baseBtn"
							@click="getSmsCaptcha"
							:disabled="getSmsAgainTime != 61"
						>
								{{smsCaptchaTxt}}
						</van-button>
					</van-col>
				</van-row>
			</van-cell-group>

			<div style="padding: 5px;">
				<van-button 
				style="width: 100%;"
				type="info"
				class="baseBtn"
				@click="updateMobileNumber()"
				>确认</van-button>
			</div>
			
		</div>
	</div>
</template>

<script>

  	import _server from '@/server/server';
	export default {
		name: 'ChangePhone',
		data(){
			return {
				title: '修改登录手机号',
				oldPhone: '',
				smsCaptchaTxt: '获取验证码',
				smsCaptchaKey: '',
				getSmsAgainTime: 61,
				smsCaptcha: '',
				submitData: {

				}
			}
		},
		created(){

		},
		methods:{
			onClickLeft(){
				window.history.go(-1);
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
					
					this.smsCaptchaTxt = this.getSmsAgainTime + '秒';
				}, 1000)
			},
			getSmsCaptcha(){
				//获取短信验证码
				_server.getSmsCaptcha1({
					phoneNumber: this.oldPhone,
					type: '06'
				}).then(res => {
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

			updateMobileNumber(){
				//验证新手机号
				let data = {
					newPhoneNumber: this.oldPhone,
                	smsCaptchaKey: this.smsCaptchaKey,
                	smsCaptcha: this.smsCaptcha
				};
				_server.updateMobileNumber(data).then(res => {
					if(res.code == 0){
						this.$toast('修改登录手机号成功，请重新登录!');
						this.$router.replace({path: '/login'});
					}else{
						this.$toast(res.errMsg);
					}
				}).catch(error => {

				})
			}
			
		}
	}
</script>

<style scope>

</style>
