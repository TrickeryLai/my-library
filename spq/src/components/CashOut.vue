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
		<van-cell-group>
		  	<van-cell class="van-hairline--bottom text-left clear" @click='choseBank()'>
				<span slot="title">
					{{defaultData.bankName}}({{defaultData.bankSubbranch}})
				</span>
				<i slot="right-icon" class="iconfont icon-next"></i>
			</van-cell>
			<van-row class="text-left">
				<van-col span="2" class="cashMoney-icon">￥</van-col>
				<van-col span="19">
					<input 
						class="cashOutInput" 
						v-model="cashOutValue" 
						:placeholder="cashOutPlaceholder"
						@input="cashInputFn($event)" 
						/>
				</van-col>
				<van-col span="3">
					<span class="cashOutTotal" @click="cashOut()">全部</span>
				</van-col>
			</van-row>
		</van-cell-group>
		<van-row style="margin-top: 20px;">
			<van-col span="24">
				<van-button type="danger" style="width: 100%;" :disabled="!cashOutValue" @click="cashOutBtnFn">确认提现</van-button>
			</van-col>
		</van-row>
		<van-popup v-model="bankListStatus" position="bottom" style="width: 100%;padding: 20px 0;max-height:350px;overflow-y: scroll;">
	      	<van-cell-group>
	      		<van-cell 
	      		class="van-hairline--bottom text-left clear"
	      		v-for="(item, index) in bankListData"
	      		v-if="item.status == 2"
	      		:key="index" 
	      		>
					<span slot="title" @click='choseBankItem(item)'>
						{{item.bankName}}({{item.bankSubbranch}})
					</span>
					<i v-show="defaultData.accountId == item.accountId" slot="right-icon" style="color: #c00;font-weight: bold;" class="iconfont icon-duigou"></i>
				</van-cell>
	      	</van-cell-group>
	    </van-popup>
	</div>
</template>

<script type="text/javascript">
	import _server from '@/server/server';
	import _common from '@/server/index';

	export default {
		name: 'CashOut',
		data(){
			return {
				title: '提现',
				bankListStatus: false,
				bankListChose: 2,
				bankListData: [],
				bankListChosedItem: {},
				defaultData: {},//默认账户信息
				cashOutValue: '',//提现金额
				balanceData: '',//账户金额数据
				cashOutPlaceholder: '可转出到卡 0.00 元',
			}
		},
		created(){
			this.getDefaultBank();
			this.getBalanceData();
		},
		methods:{
			onClickLeft(){
				this.$router.go(-1);
			},
			choseBank(){
				//选择设置默认账户
				this.getBankList().then(res => {
					if(res.code == 0){
						this.bankListChosedItem = Object.assign({}, this.defaultData);
						this.bankListStatus = true;
						this.bankListData = res.list;
					}else{
					 	this.$toast(res.errMsg);
					}
				})
			},
			choseBankItem(item){
				
				this.bankListChosedItem = item;
				_server.modifyDefaultAccount(item.accountId).then(res => {
					if(res.code == 0){
						this.getDefaultBank();
						this.bankListStatus = false;
					}else{
						this.$toast(res.errMsg)
					}
				})
			},	
			cashOutBtnFn(){

				let data = {
					amount: parseFloat(this.cashOutValue),
				};

				_server.withDraw(data).then(response => {
					if(response.code == 0){
						this.$toast('提现成功！');
						this.$router.go(-1);
					}else{
						this.$toast(response.errMsg);
					}
				}).catch( error => {

				})
			},
			getBankList(){
				//获取绑卡列表
				return new Promise( (resolve, reject) => {
					_server.getCompanyAccount({
						pageSize: 100000,
						pageNum: 1
					}).then(res => {
						return resolve(res);
					}).catch(error => {
						return reject(error);
					})
				})
				
			},

			modifyDefaultAccount(){
				//设置默认账户
				let accountId = '';
				_server.modifyDefaultAccount(accountId).then(res => {

				}).catch(error => {

				})
			},

			getBalanceData(){
				//获取账户金额信息
				_server.accountAndBalance().then((res) => {
					if(res.code == 0){
						let usableAmount = res.data.usableAmount ? res.data.usableAmount.toFixed(2) : 0;
						this.balanceData = res.data;
						this.cashOutPlaceholder = `可转出到卡${_common.common_fn.dealPrice(usableAmount)}元` ;
					}else{
						this.$toast(res.errMsg);
					}
				}).catch(error => {

				})
			},

			getDefaultBank(){
				//获取默认账户
				
				_server.queryAccountInfo().then((res) => {
					if(res.code == 0){
						this.defaultData = res.data;
					}else{
						this.$toast(res.errMsg);
					}
				}).catch(error => {

				})
			},

			cashOut(){
				if(!this.balanceData || !this.balanceData.usableAmount){
					this.$toast('获取账户信息失败！');
					return;
				}
				this.cashOutValue = this.balanceData.usableAmount;
			},

			format_input_num: function(val){
			    // 清除"数字"和"."以外的字符
			    val = val.replace(/[^\d.]/g,"");
			    // 验证第一个字符是数字
			    val = val.replace(/^\./g,"");
			    // 只保留第一个, 清除多余的
			    val = val.replace(/\.{2,}/g,".");
			    val = val.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
			    // 只能输入两个小数
			    val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
			    return val;
			 },

			cashInputFn(){
				if(this.balanceData.usableAmount && (parseFloat(this.cashOutValue) > parseFloat(this.balanceData.usableAmount))){
					this.cashOutValue = this.balanceData.usableAmount + '';
				}
				this.cashOutValue = this.format_input_num(this.cashOutValue);
			}
		}
	}
</script>

<style scoped>
.text-left{
	text-align: left;
}
.cashOutInput{
	background: #fff;
	border: none;
	padding: 15px 10px;
	font-size: 20px;
	color: #c00;
	width: 100%;
}
.cashMoney-icon{
	font-size: 34px;
	color: #000;
	padding: 3px 0 0 5px;
	box-sizing: border-box;
}
.cashOutTotal{
	color: #c00;
	cursor: pointer;
	padding: 14px 0 0 0;
	display: inline-block;
}
</style>