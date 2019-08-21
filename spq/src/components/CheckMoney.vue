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
			<p style="color: #999;">已向您绑定的结算账户转入一笔资金，请注意查收</p>
			<p class="checkMoney-page-black">付款方：<span style="color:#c00;">中金支付有限公司客户备付金</span></p>
			<p style="font-size:14px;padding-bottom:20px;font-weight: normal;">预计10分钟内到账</p>
			<div style="display: inline-block;margin-top: 20px;margin-bottom: 5px;">
				<input type="number" class="checkMoney-input" id="checkMoneyInput" v-model.trim="submitData.checkMoneyInput" name="" placeholder="请输入您收到的资金数目（元）">
				<!-- <van-field
		          v-model.trim="submitData.checkMoneyInput"
		          clearable
		          style="background: #fff;"
		          placeholder="请输入您的银行收到的资金的数目(元)"
		        /> -->
			</div>
			<p class="checkMoney-page-tip">提示：<span style="color:#c00;">您只有三次机会，请仔细填写哦</span></p>
			<div style="margin-top: 30px;">
				<van-button 
					style="background: #c00;color: #fff;"
					@click="checkMoney"
					>下一步</van-button>
				<!-- <button type="button" class="btn btn-default checkMoney-btn" @click="checkMoney">下一步</button> -->
			</div>
		</div>
		<div class="checkMoney-page" v-show="nextStepStatus">
			<p class="checkMoney-page-topTitle" style="font-size: 18px;width: 70%;display:inline-block;">您在银行开立的交易账户正在审核中，请耐心等待短信通知；当前发布票据不受影响，票据报价和报价撮合功能暂时不允许交易，需账户激活后才能完成</p>
			<p class="checkMoney-page-tip">提示：<span style="color:#c00;">如未进行激活操作，请先点击激活按钮进行激活</span></p>
			<div style="margin-top: 30px;">
				<van-button 
					v-show="!isOpenAgain"
					style="background: #c00;color: #fff;"
					@click="gotoActivePage"
					>激活</van-button>
				<van-button 
					style="background: #c00;color: #fff;"
					v-show="isOpenAgain"
					@click="gotoOpenAmountAgain"
					>重新开户</van-button>
				<!-- <button v-show="!isOpenAgain" type="button" class="btn btn-default checkMoney-btn" id="active" @click="gotoActivePage">激活</button>
				<button v-show="isOpenAgain" type="button" class="btn btn-default checkMoney-btn" id="openAgain" @click="gotoOpenAmountAgain">重新开户</button> -->
			</div>
		</div>

	</div>
</template>

<script type="text/javascript">

	import _server from '@/server/server';
	import _common from '@/server/index';
	export default {
		name: 'CheckMoney',
		data(){
			return {
				title: '金额验证',
				nextStepStatus: false,
				currentAuthStatus: '',
				intervals: null,
				isOpenAgain: false,
				intervalsN: 10,
				lastTime: 0,
				initPageDatas: '',
				submitData:{
					checkMoneyInput: ''
				}
			}
		},
		created(){
			this.getCompanyInfo(()=>{
				this.initPageData();
			});
		},
		beforeRouteLeave(to, from, next){
			clearInterval(this.intervals);
			next();
		},
		methods: {
			onClickLeft(){
				this.$router.go(-1);
			},
			getCompanyInfo(callback){
		    	//进入页面初始查询认证状态，缓存处理后续
		        let userId = JSON.parse(localStorage.getItem('userId'));

		        _server.getCompanyDataInfo(userId).then(res => {
		            if(res.code == 0){
		                this.currentAuthStatus = res['authStatus'];
		                callback && callback(res);
		            }else{
		                this.$toast(res.errMsg);
		            }
		          }) 
		          
		    },

		    initPageData(){
		    	this.getInitBankData();
				let authStatus = this.currentAuthStatus;
				clearInterval(this.intervals);
				let _this = this;
				switch (authStatus){
					case '00':
						// 已经完成第一步认证，还没开始第二步
						// 
						this.$router.replace({path: '/home/selfInfo/addBankCard'});
						return true;
					case '01':
						//在第一步认证
						// $("input, select").attr('disabled', 'disabled');
						// window.location.hash = '/comAuth';
						this.$router.replace({path: '/home/selfInfo/realNameChange'});
						return false;
					case '02':
						//在第一步认证
						// $("input, select").attr('disabled', 'disabled');
						// window.location.hash = '/comAuth';
						this.$router.replace({path: '/home/selfInfo/realNameChange'});
						return false;
					case '10':
						//账户认证成功--小额打款成功
						this.nextStepStatus = true;
						this.isOpenAgain = false;
						return false;
					case '11':
						//账户认证失败--小额打款失败--直接弹出小额打款弹窗
						// $("#checkMoney_page_wrap").html(template("checkMoney_page", {}));
						this.nextStepStatus = false
						return false;
					case '12':
						this.$router.replace({path: '/home/selfInfo/addBankCard'});
						//账户认证申请中 -- 提交了信息 -- 轮询信息
						// $("#checkMoney_page_wrap").html(template("checkMoney_page_next", {}));

						// $("#openAgain").hide().siblings('button').hide();
						this.nextStepStatus = true;
						this.isOpenAgain = false;
						
						// this.intervals = setInterval(()=>{
			   //          	this.intervalsN -= 1;
			   //          	// $(".tips-txt").text('账户认证申请中，请等待认证申请成功！('+globalData.initData.intervalsN+'秒刷新)');
			   //          	if(this.intervalsN == 0){

			   //          		this.getCompanyInfo((res)=>{
			   //          			this.intervalsN = 10;
						// 			this.initPageData(res);

						// 		});
			   //          	}
	            			
	     //        		}, 1000)
						return false;
					case '13':
			            //账户认证中--还没开始小额打款--不能修改
			            // $("#checkMoney_page_wrap").html(template("checkMoney_page", {}))
			            this.nextStepStatus = false;
			            return;
	            	case '14':
			            //账户认证申请失败 -- 提交了信息，信息错误--可以修改信息
			           	// window.location.hash="/addBankAmount"
			           	this.$router.replace({path: '/home/selfInfo/addBankCard'});
			            return;	
		            case '20':
		            	//开户成功 -- 不能修改
		            	// $("#checkMoney_page_wrap").html(template("checkMoney_page_next", {}));

		            	// $("#openAgain").hide().siblings('button').show();
		            	this.nextStepStatus = true;
						this.isOpenAgain = false;
		            	return;
	            	case '21':
	            		//开户失败 -- 需要重新填写信息开户
	            		// $("#checkMoney_page_wrap").html(template("checkMoney_page_next", {}))
	            		// $("#openAgain").show().siblings('button').hide();
	            		this.nextStepStatus = true;
						this.isOpenAgain = true;
	            		this.$toast('开户失败，请重新开户');
		            	return;
		            case '22':
		            	//开户绑卡中--显示激活按钮
		            	// $("#checkMoney_page_wrap").html(template("checkMoney_page_next", {}));

		            	// $("#openAgain").hide().siblings('button').show();
		            	this.nextStepStatus = true;
		            	this.isOpenAgain = false;
		            	let _this = this;
	            		this.intervals = setInterval(()=>{
			            	this.intervalsN -= 1;
			          
			            	if(this.intervalsN == 0){
			            		this.getCompanyInfo((res)=>{
			            			this.intervalsN = 10;
									this.initPageData(res);
								});
			            	}	
	            		}, 1000)
		            	return;
		            case '23':
			            //认证失败--电子账户开户失败--重新发起
	            		this.nextStepStatus = true;
		            	this.isOpenAgain = true;
	            		this.$toast('开户失败，请重新开户');
			            return;
		            case '9':
		            	// window.location.hash = '/comAuth';
		            	this.$router.replace({path: '/home/selfInfo/realNameChange'});
		            	return;	

		            default:

		            	return;
				}
			
			},
			getInitBankData(data){
				//查询开户--绑卡信息
				_server.queryAccountInfo().then(res => {
					if(res.code == 0){
						res.data = res.data ? res.data:{};
						this.initPageDatas = res.data;
						this.getAcountTime(res.data.accountNo)
					}
				})
			},

			getAcountTime(bankCardNo){
				_server.queryEndTime({bankCardNo}).then(res => {
					if(res.code == 0){
						if(res.data && res.data.createDate){
							this.intervals = setInterval(() => {
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

			gotoActivePage(){
				//去激活页面
				let data = {
					accountId: this.initPageDatas.accountId
				};
				_server.queryOpenAccountUrl(data).then(res => {
					var winRef = window.open('',"_blank");
					winRef.location = res.acActiveUrl;
				})
			},

			gotoOpenAmountAgain(){
				_server.openEAccount().then(res =>{
					if(res.code == 0){
							this.getCompanyInfo((res)=>{
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
				_server.verifyAccount(data).then(res => {
					if(res.code == 0){
							if(res.data && res.data.availableVeriCount == 0){
								this.$toast('请点击下一步重新提交，查看最新金额并输入！');
							}else{
								if(res.data && res.data.remoteErrorMsg){
									this.$toast(res.data.remoteErrorMsg);
								}
							}
							
							if( res.data && res.data.openStatus){
								this.currentAuthStatus = res.data.openStatus
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
		width: 100%;
	}
	.checkMoney-btn{
		padding: 5px 8px;
	}
</style>