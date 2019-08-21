<template>
	<div>
		 <van-nav-bar
		    left-arrow
		    fixed
		    @click-left="onClickLeft"
		    @click-right="onClickRight"
		    class="top-bg"
		  >
		    <span slot="title" class="top-bg-title">{{title}}</span>
		    <span slot="right" class="top-bg-title">明细</span>
		    <i class="iconfont icon-previous_step top-bg-title" slot="left"></i>
		  </van-nav-bar>
		  <div style="width: 100%;height: 100%;overflow-y:scroll;overflow-x:hidden;">
		  	<van-cell-group style="padding-bottom: 20px;">
		  		<van-row style="">
		  			<van-col span="10" style="font-size: 20px;padding: 30px 0;color:#000;">账户总资金</van-col>
		  			<van-col span="14" style="font-size: 24px;color:#c00;text-align: left;padding: 25px 0;">￥{{dealPrice(pageData.balance) || '0.00'}}</van-col>
		  		</van-row>
		  		<van-row style="margin-bottom: 10px;">
			  		<van-col span="8" style="border-right:1px solid #eee;">
			  			<p class="money-txt">冻结资金</p>
			  			<p class="money-num">￥{{dealPrice(pageData.frozenAmount) || '0.00'}}</p>
			  		</van-col>
			  		<van-col span="8" style="border-right:1px solid #eee;">
			  			<p class="money-txt">保证金</p>
			  			<p class="money-num">￥{{dealPrice(pageData.marginMoney) || '0.00'}}</p>
			  		</van-col>
			  		<van-col span="8">
			  			<p class="money-txt">可用资金</p>
			  			<p class="money-num">￥{{dealPrice(pageData.usableAmount) || '0.00'}}</p>
			  		</van-col>
			  	</van-row>
		  	</van-cell-group>
		  	<van-cell-group class='txt-box'>
		  		<van-row class="txt-box-line">
			  		<van-col span="9"><span style="letter-spacing: 16px;">户名</span>：</van-col>
			  		<van-col span="15" class="txt-box-line-right">{{pageData.accountName || '-'}}</van-col>
			  	</van-row>
			  	<van-row class="txt-box-line">
			  		<van-col span="9"><span>交易账号</span>：</van-col>
			  		<van-col span="15" class="txt-box-line-right">{{pageData.subAcNo || '-'}}</van-col>
			  	</van-row>
			  	<van-row class="txt-box-line">
			  		<van-col span="9"><span style="letter-spacing: 5px;">开户行</span>：</van-col>
			  		<van-col span="15" class="txt-box-line-right">{{pageData.bankName || '-'}}</van-col>
			  	</van-row>
			  	<van-row class="txt-box-line">
			  		<van-col span="9"><span>大额行号</span>：</van-col>
			  		<van-col span="15" class="txt-box-line-right">{{pageData.bankNo || '-'}}</van-col>
			  	</van-row>
		  	</van-cell-group>
		  </div>
		  <div class="button-box">
		  		<van-row>
		  			<van-col span="12">
		  				<van-button style="width: 100%;background: #c00;color:#fff;" size="large" @click="gotoCashOut()">提现</van-button>
		  			</van-col>
		  			<van-col span="12">
		  				<van-button style="width: 100%;" size="large" @click="gotoCashIn()">充值</van-button>
		  			</van-col>
		  		</van-row>	
		  		
		  		
		  	</div>
	</div>
</template>

<script type="text/javascript">

	import _server from '@/server/server';
	import _common from '@/server/index';
	
	export default {
		name: 'Wallet',
	 	data(){
		 	return {
		 		title: '我的钱包',
		 		pageData: {
		 			balance: 0,//账户总资金
		 			usableAmount: 0,//可用资金
		 			marginMoney: 0,//保证金
		 			frozenAmount: 0,//冻结金
		 			accountName: '',//户名
		 			subAcNo: '',//账号
		 			bankName: '',//开户行
		 			bankNo: '',//大额行号
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
	 		onClickRight(){
	 			this.$router.push({path: '/cashDetail'});
	 		},
	 		dealPrice(val){
	 			if(!val){
	 				return 0;
	 			}

	 			val = val.toFixed(2);
	 			return  _common.common_fn.dealPrice(val);
	 		},
	 		getData(){
	 			_server.accountAndBalance().then( response => {
	 				if(response.code == 0){
	 					this.pageData = response.data;
	 				}else{
	 					this.$toast(response.errMsg);
	 				}
	 			}).catch( error => {

	 			})
	 		},
	 		gotoCashIn(){
	 			this.$router.push({path: '/cashIn'});
	 		},
	 		gotoCashOut(){
	 			this.$router.push({path: '/cashOut'});
	 		}
	 	}
	}
</script>

<style scoped>
	.money-txt{
		font-size: 12px;
		color: #000;
		margin-bottom: 5px;
	}
	.money-num{
		font-size: 12px;
		color: #c00;
		font-weight: bolder;
	}
	.txt-box{
		padding: 0px 10px;
		margin: 20px 10px;
		border: 1px solid #eee;
		border-radius: 5px;
	}
	.txt-box-line{
		border-bottom: 1px solid #eee;
		padding: 10px 0;
		text-align: left;
	}
	.txt-box-line-right{
		color: #000;
	}
	.button-box{
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 10px;
		border-top: 1px solid #eee;
		background: #fff;
		box-sizing: border-box;
	}
</style>