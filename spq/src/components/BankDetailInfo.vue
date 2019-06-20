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
	  		<van-cell-group class="baseInfo-box">
	  			<van-row class="baseInfo-box-row">
	  				<van-col span="8" class="baseInfo-box-left">对公账号:</van-col>
	  				<van-col span="16" class="baseInfo-box-right">{{initItem.accountNo || '-'}}</van-col>
	  			</van-row>
	  			<van-row class="baseInfo-box-row">
	  				<van-col span="8" class="baseInfo-box-left">开户行全称:</van-col>
	  				<van-col span="16" class="baseInfo-box-right">{{initItem.bankName || '-'}}</van-col>
	  			</van-row>
	  			<van-row class="baseInfo-box-row">
	  				<van-col span="8" class="baseInfo-box-left">开户行所在地:</van-col>
	  				<van-col span="16" class="baseInfo-box-right">{{getAdress(initItem.bankProvince, initItem.bankCity)}}</van-col>
	  			</van-row>
	  			<van-row class="baseInfo-box-row">
	  				<van-col span="8" class="baseInfo-box-left">开户行支行:</van-col>
	  				<van-col span="16" class="baseInfo-box-right">{{initItem.bankSubbranch}}</van-col>
	  			</van-row>
	  			<van-row class="baseInfo-box-row">
	  				<van-col span="8" class="baseInfo-box-left">大额行号:</van-col>
	  				<van-col span="16" class="baseInfo-box-right">{{initItem.largeAccountNo || '-'}}</van-col>
	  			</van-row>
	  		</van-cell-group>
	  		<van-button 
		      type="danger" 
		      style="width: 100%;"
		      v-if="initItem.status == 2"
		      @click="deleteFn">解绑</van-button>
	  	</div>
	</div>
</template>

<script>
	import _common from '@/server/index';
  	import _server from '@/server/server';
  	import {Dialog} from 'vant';
	export default{
		name: 'BankDetailInfo',
		components:{
			Dialog
		},
		data(){
			return {
				title:'银行账户信息',
				initItem: {},
			}
		},
		created(){
			this.initData();
		},
		methods:{
			onClickLeft(){
				window.history.go(-1);
			},
			initData(){
				this.initItem = JSON.parse(this.$route.query.item);
			},
		 	getAdress(pCode, cCode){
		        let result =  _common.common_fn.getAddress(pCode, cCode);

		        if(result[pCode] == result[cCode]){
		          result = result[pCode];
		        }else{
		          result = result[pCode] + result[cCode];
		        }
		        return result;
	      	},
			dealNumber(n){
		        return _common.common_fn.dealPrice(n, 4, ' ');
	      	},
	      	deleteFn(){
	      		let id = this.initItem.accountId;
	      		Dialog.alert({
	      			title: '确认解绑',
	      			message: '确认解绑该账户么？'
	      		}).then(() => {
  					// on close
  					_server.unBindCard(id).then(response => {
  						if(response.code == 0){
  							let winf = window.open("", "_blank");
  							winf.location = response.data.acActiveUrl;
  						}else{
  							this.$toast(response.errMsg);
  						}
	      			}).catch( error => {

	      			})
				});
	      		
	      	}
		}
	}
</script>

<style scoped>
  .baseInfo-box{
    margin-bottom: 10px;
    font-size: 14px;
  }
  .baseInfo-box-row{
    padding: 8px 0;
    border-bottom: 1px solid #eee;
  }
  .baseInfo-box-left{
    text-align: right;
  }
  .baseInfo-box-right{
    text-align: left;
    padding-left: 5px;
  }
</style>