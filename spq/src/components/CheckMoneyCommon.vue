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
		<div class="checkMoney-page" v-show="!nextStepStatus">
			<p class="checkMoney-page-topTitle">剩余填写金额时间 <span style="color:#c00;" id="lastTime">{{lastTime}}</span></p>
			<p style="color: #999;">已向您的银行转入一笔资金，请注意查收</p>
			<p class="checkMoney-page-black">付款方：<span style="color:#c00;">中金支付有限公司客户备付金</span></p>
			<p style="font-size:14px;padding-bottom:20px;font-weight: normal;">预计10分钟内到账</p>
			<div style="display: inline-block;margin-top: 20px;margin-bottom: 5px;">
				<input type="text" class="checkMoney-input" id="checkMoneyInput" v-model.trim="submitData.checkMoneyInput" name="" placeholder="请输入您的银行收到的资金的数目(元)">
				<!-- <van-field
		          v-model.trim="submitData.checkMoneyInput"
		          clearable
		          style="background: #fff;"
		          placeholder="请输入您的银行收到的资金的数目(元)"
		        /> -->
			</div>
			<p class="checkMoney-page-tip">提示：<span style="color:#c00;">您只有三次机会，请仔细填写哦</span></p>
			<div style="margin-top: 30px;">
				<button type="button" class="btn btn-default checkMoney-btn" @click="checkMoney">下一步</button>
			</div>
		</div>
		<div class="checkMoney-page" v-show="nextStepStatus">
			<p class="checkMoney-page-topTitle" style="font-size: 18px;width: 70%;display:inline-block;">您在银行开立的交易账户正在审核中，请耐心等待短信通知；当前发布票据不受影响，票据报价和报价撮合功能暂时不允许交易，需账户激活后才能完成</p>
			<p class="checkMoney-page-tip">提示：<span style="color:#c00;">如未进行激活操作，请先点击激活按钮进行激活</span></p>
			<div style="margin-top: 30px;">
				<button v-show="!isOpenAgain" type="button" class="btn btn-default checkMoney-btn" id="active" @click="gotoActivePage">激活</button>
				<button v-show="isOpenAgain" type="button" class="btn btn-default checkMoney-btn" id="openAgain" @click="gotoOpenAmountAgain">重新开户</button>
			</div>
		</div>

	</div>
</template>


<script type="text/javascript">

	import _server from '@/server/server';
	import _common from '@/server/index';
	export default{
		name: 'CheckMoneyCommon',
		data(){
			return {
				title: '绑卡验证金额',
				nextStepStatus: false,
				isOpenAgain: false,
				lastTime: 0,
				urlAccountId: '',
				initPageDatas: '',
				currentStatus: '',
				submitData: {
					checkMoneyInput: ''
				}
			}
		},
		created(){
			this.getInitBankData(() =>{
				this.initPageData();
			});
		},
		methods:{
			onClickLeft(){
				this.$router.go(-1);
			},

			initPageData(){
			//通过绑卡的信息状态去判断
				let currentStatus = this.currentStatus || this.initPageDatas.status;
				clearInterval(this.intervals);

				switch (currentStatus){
					case '0':
						//未认证--信息已提交但是未小额验证
						// $("#checkMoneyCommon_page_wrap").html(template("checkMoneyCommon_page", {}));
	     //        		$("#openAgain").hide().siblings('button').show();
	            		this.nextStepStatus = false;
						this.isOpenAgain = false;
						return false;
					case '1':
						//账户认证失败--信息可以修改， 重新提交
						// window.location.hash = '/addBankAmountCommon';
						this.$router.replace({path:'addBankCardCommon', query:{accountId: this.urlAccountId}})
						// window.location.replace(window.location.href.split('#')[0] +'#/checkMoneyCommon?accountId=' + globalData.initData.urlParamsData.accountId);
						return false;
					case '2':
						//账户认证成功
						// $("#checkMoneyCommon_page_wrap").html(template("checkMoneyCommon_page_next", {}));
	     				//$("#openAgain").show().siblings('button').hide();
	            		this.nextStepStatus = true;
						this.isOpenAgain = true;
						return false;
					case '3':
			            //账户--解绑
			            
			            return;
	            	case '4':
			            //账户未激活-- 小额验证成功， 未激活
			           	// $("#checkMoneyCommon_page_wrap").html(template("checkMoneyCommon_page_next", {}));
	            		// $("#openAgain").hide().siblings('button').show();
	            		this.nextStepStatus = true;
						this.isOpenAgain = false;
						this.intervals = setInterval(()=>{
			            	this.intervalsN -= 1;
			            	if(this.intervalsN == 0){
			            		this.getInitBankData(()=>{
			            			this.intervalsN = 10;
									this.initPageData();
								});
			            	}
	            			
	            		}, 1000)
			            return;	
	            	default:
	            		//还没开始小额打款
		            	// window.location.hash = '/addBankAmountCommon';
		            	this.$router.replace({path:'addBankCardCommon', query:{accountId: this.urlAccountId}})
			           	return;
				}
				
			},

			gotoActivePage(){
				//去激活页面
				let data = {
					accountId: this.urlAccountId
				};
				_server.queryOpenAccountUrl(data).then(res => {
					var winRef = window.open('',"_blank");
					winRef.location = res.acActiveUrl;
				})
			},

			gotoOpenAmountAgain(){
				_server.openEAccount().then(res =>{
					if(res.code == 0){
							this.getInitBankData((res)=>{
								this.initPageData(res);
							});
						}else{
							this.$toast(res.errMsg);
						}
				})
			},

			checkMoney(){
				if(!this.submitData.checkMoneyInput){
					this.$toast('请先输入金额！');
					return;
				}
				let data = {
						money: this.submitData.checkMoneyInput,
						bankCardNo: this.initPageDatas.accountNo
					};
				_server.verifyBindCardAccount(data).then(res => {
					if(res.code == 0){
							if(res.data && res.data.availableVeriCount == 0){
								this.$toast('请点击下一步重新提交，查看最新金额并输入！');
							}else{
								if(res.data && res.data.remoteErrorMsg){
									this.$toast(res.data.remoteErrorMsg);
								}
							}
							
							if( res.data && res.data.openStatus){
								this.currentStatus = res.data.openStatus
								this.initPageData();
							}

							if(res.data && res.data.acActiveUrl){
								window.open(res.data.acActiveUrl,'width=600,height=400,top=100px,left=0px');
								// window.location.hash = 'comAuthNew';
								return;
							}

						}else{
							this.$toast(res.errMsg);
						}
				})
				
			},
			getAcountTime(bankCardNo){
				_server.queryEndTime({bankCardNo}).then(res => {
					if(res.code == 0){
						if(res.data && res.data.createDate){
							this.intervals = setInterval(()=>{
								var data = res.data.createDate;
								var lastTime = data + 72*60*60*1000 - new Date().getTime();
								if(lastTime <= 0){
									lastTime = 0;
								}
								var hours = Math.floor(lastTime/60/60/1000);
								var m = Math.floor(lastTime%(60*60*1000)/(60*1000));
								this.lastTime = hours+'小时'+m+'分';
							}, 1000)
						}
					}else{
						this.$toast(res.errMsg);
					}
				})	
			},
			getUrlParams(){
				if(this.$route.query.accountId){
					this.urlAccountId = this.$route.query.accountId;
				}
			},

			getInitBankData(callback){
				//绑卡信息
				this.getUrlParams();

				_server.getBankData(this.urlAccountId).then(res => {
					this.initPageDatas = res;
					this.getAcountTime(res.accountNo);
					callback && callback();
				})
			},
		}
	}
</script>

<style scoped>

	.checkMoney-page{
		text-align: center;
		font-size: 16px;
	}
	.checkMoney-page-topTitle{
		font-size: 22px;
		font-weight: bold;
		margin-top: 20px;
		padding: 20px;
	}
	.checkMoney-page-black{
		color:#000;
		font-size: 16px;
		font-weight: bold;
		padding: 20px 20px 5px;
	}
	.checkMoney-page-tip{
		font-size: 14px;
		font-weight: bold;
	}
	.checkMoney-input{
		border: 1px solid #ccc;
		padding: 8px;
	}
	.checkMoney-btn{
		padding: 5px 8px;
	}
</style>