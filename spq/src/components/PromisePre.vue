
<template>
	<div style="position: absolute;width: 100%;">
		<van-nav-bar
		    left-arrow
		    fixed
		    @click-left="onClickLeft"
		    class="top-bg"
		  >
		  	<span slot="title" class="top-bg-title">{{title}}</span>
		    <i class="iconfont icon-previous_step top-bg-title" slot="left"></i>
		  </van-nav-bar>

	  	<!-- <iframe :src="promiseData.url" style="height: 80%;width: 100%;overflow: scroll;"></iframe> -->
	  	<pdf
	      :src="promiseData.url"
	      :page="currentPage"
		  @num-pages="pageCount=$event"
	      @page-loaded="currentPage=$event"
	      @loaded="loadPdfHandler"
	      style="height:500px;;
	      overflow: scroll;"
		>
		</pdf>
		<van-cell>
			<van-row style="margin-bottom: 10px">
				<van-col span="12" style="text-align: center;">
					<span @click="changePdfPage(-1)" class="turn">上一页</span>
				</van-col>
				<van-col span="12" style="text-align: center;">
		    		<span @click="changePdfPage(1)" class="turn">下一页</span>
				</van-col>
			</van-row>

			<van-row>
				<van-col span="12">
					<van-button style="width: 100%;font-size:14px;" @click="cancelRedicModel">取消</van-button>
				</van-col>
				<van-col span="12">
					<van-button style="width: 100%;font-size:14px;" @click="confirmPromiseModel()">确认</van-button>
				</van-col>
			</van-row>
		</van-cell>

		<van-dialog
		  v-model="promiseMdState"
		  title="验证手机"
		  style="padding: 0 10px;"
		  :show-cancel-button = 'false'
		  :show-confirm-button = 'false'
		>
		  	<van-cell>
		  		<van-row>请输入短信验证码完成意愿认证</van-row>
                <van-row>
			  		<van-col span="16">
						<van-field 
						v-reset-page
						class="van-hairline--surround register-input"
						style="display:inline-block;margin:0;padding:0;" 
						v-model.trim="smsValue"
						 placeholder="请输入短信验证码"
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
								{{getSmsAgainTime == 61 ? smsCaptchaTxt : (getSmsAgainTime + '秒')}}
						</van-button>
					</van-col>
			  	</van-row>
		  	</van-cell>

		  	<van-cell>
		  		<van-col span="12" style="text-align: center;">
		  			<van-button 
		  			style="width: 100%;"
		  			@click="cancel"
		  			>取消</van-button>
		  		</van-col>
		  		<van-col span="12" style="text-align: center;">
		  			<van-button 
		  			style="width: 100%;"
		  			@click="checkPhoneSubmit"
		  			>确认</van-button>
		  		</van-col>
		  	</van-cell>
		</van-dialog>

		</div>
  
</template>

<script type="text/javascript">

	import _server from '@/server/server';
	import _common from '@/server/index';
	import pdf from 'vue-pdf';

	export default{
		name: 'PromisePre',
		components: {pdf},
		data(){
			return{
				title:'合同预览',
				currentPage: 1,
				pageCount: '',
				promiseMdState: false,
				getSmsAgainTime: 61,
				smsValue: '',
				smsKey: '',
				smsCaptchaTxt: '获取验证码',
				promiseData: {
					url: ''
				},
				intervals: ''
			}
		},
		created(){
			this.initData();
		},
		methods:{
			onClickLeft(){
				this.$router.go(-1);
			},
			loadPdfHandler(){
				this.currentPage = 1;
			},
			changePdfPage(size){
				if(size > 0 && this.currentPage >= this.pageCount){
					return;
				}
				if(size < 0 && this.currentPage <= 1){
					return;
				}
				this.currentPage += size;
			},
			initData(){
				let item = JSON.parse(this.$route.query.data);
				_server.contract({ordNo: item.ordNo, type: item.$type}).then(res => {
					if(res.code == 0){
						this.promiseData.url = res.data;
					}else{
						this.$toast(res.errMsg);
					}
				})
			},
			cancelRedicModel(){
				this.$router.go(-1);
			},
			getSmsCaptcha(){
				let item = JSON.parse(this.$route.query.data);
				_server.contractSms({ordNo: item.ordNo, type: item.$type}).then(res => {
					if(res.code == 0 && res.data.smsCaptchaKey){
						this.smsKey = res.data.smsCaptchaKey;
						this.intervals = setInterval(() => {
							this.getSmsAgainTime -= 1;
							if(this.getSmsAgainTime <= 0){
								this.getSmsAgainTime = 61;
								clearInterval(this.intervals)
							}
						}, 1000) 
					}else{
						this.$toast(res.errMsg);
					}
				})
			},
			confirmPromiseModel(){
				this.promiseMdState = true;
				this.getSmsAgainTime = 61;
				this.smsKey = '';
				this.smsValue = '';
				
				clearInterval(this.intervals)
			},

			cancel(){
				this.getSmsAgainTime = 61;
				this.smsKey = '';
				this.smsValue = '';
				clearInterval(this.intervals)
				this.promiseMdState = false;
			},
			checkPhoneSubmit(){
				if(!this.smsKey){
					this.$toast('请先获取验证码！');
					return;
				}

				if(!this.smsValue){
					this.$toast('请先输入验证码！');
					return;
				}
				let item = JSON.parse(this.$route.query.data);

				let data = {
                        ordNo: item.ordNo,
                        type: item.$type,
                        smsCaptchaVaule: this.smsValue,
                        smsCaptchaKey: this.smsKey
                };

                _server.contractConfirm(data).then(res => {
                	if(res.code == 0){
                		this.$toast('操作成功！');
                		this.promiseMdState = false;
                		this.$router.go(-1);
                	}else{
                		this.$toast(res.errMsg);
                	}
                }) 
			}
		}
	}
</script>

<style scoped>
.turn{
	background: #ccc;
	border: 1px solid #ccc;
	padding: 8px 10px;
}
</style>
