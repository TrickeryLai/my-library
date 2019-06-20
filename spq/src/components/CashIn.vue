
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
		  	<p class="top-tips">&nbsp支持任意银行转账至以下监管银行账户</p>
		  	<van-cell-group>
		  		<van-row class="text-line">
		  			<van-col span="6">开户行：</van-col>
		  			<van-col span="14">{{pageData.bankName}}</van-col>
		  			<van-col span="4" class="copyBtn" >
			  			<copy-btn :copy-value="pageData.bankName"></copy-btn>
		  			</van-col>
		  		</van-row>
		  		<van-row class="text-line">
		  			<van-col span="6">行号；</van-col>
		  			<van-col span="14">{{pageData.bankNo}}</van-col>
		  			<van-col span="4" class="copyBtn" >
			  			<copy-btn :copy-value="pageData.bankNo"></copy-btn>
		  			</van-col>
		  		</van-row>
		  		<van-row class="text-line">
		  			<van-col span="6">户名：</van-col>
		  			<van-col span="14">{{pageData.accountName}}</van-col>
		  			<van-col span="4" class="copyBtn" >
			  			<copy-btn :copy-value="pageData.accountName"></copy-btn>
		  			</van-col>
		  		</van-row>
		  		<van-row class="text-line">
		  			<van-col span="6">交易账号：</van-col>
		  			<van-col span="14">{{pageData.subAcNo}}</van-col>
		  			<van-col span="4" class="copyBtn" >
			  			<copy-btn :copy-value="pageData.subAcNo"></copy-btn>
		  			</van-col>
		  		</van-row>
		  	</van-cell-group>
		  	<!-- <div class="cashIn-tips-txt">
		  		<p>提示：</p>
		  		<p>1.<span style="color: #c00;">5万以上实时到账，5万及以下请在网银行上选择“实时到账”</span></p>
				<p>2.<span>平安银行请选择“对外账户”</span></p>
				<p>3.<span>暂未开通华夏银行充值</span></p>
		  	</div> -->
		  </div>
	</div>
</template>

<script type="text/javascript">

	import _common from '@/server/index';
	import _server from '@/server/server';
	import CopyBtn from '@/components/CopyBtn';
	export default {
		name: 'CashIn',
		components:{CopyBtn},
		data(){
			return {
				title: '充值',
				pageData: {

				}
			}
		},
		created(){
			this.getData();
		},
		methods: {
			onClickLeft(){
				this.$router.go(-1);
			},
			getData(){
				_server.rechargeInfo().then( res => {
					if(res.code == 0){
						this.pageData = res.data;
					}
				})
			},
			copy(val){
				console.log(val)
			}
		}
	}
</script>

<style scoped>

	.top-tips{
		padding: 10px 0 10px 5px;
		font-size: 14px;
		color: #c00;
		text-align: left;
	}
	.text-line{
		padding: 10px 0;
		border-bottom: 1px solid #eee;
	}
	.copyBtn{
		font-size: 14px;
		color: #c00;
	}
	.cashIn-tips-txt{
		text-align: left;
		font-size: 14px;
		color: #000;
		padding: 20px;
	}

</style>