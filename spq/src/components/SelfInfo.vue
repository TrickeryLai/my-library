<template>
	<div>
		<van-nav-bar
		fixed
		class="top-bg"
		>
		<span slot="title" class="top-bg-title">{{title}}</span>
	</van-nav-bar>
	<div class="selfInfo-top">
		<!-- <img :src="bgImg" style="position: absolute;left:0; top:0; width: 100%;height: 100%;"> -->
		<div style="position: absolute;left:0;top:0;width: 100%;height: 100%;">
			<div class="checked-icon" v-if="!baseInfo.authStatus" @click="goChecked">
				<span class="point"></span>未认证
			</div>
			<div class="checked-icon active-d" v-if="baseInfo.authStatus == 1" @click="goChecked" >
				<span class="point"></span>待审核
			</div>
			<div class="checked-icon active-n" v-if="baseInfo.authStatus == 2" @click="goChecked" >
				<span class="point"></span>审核未通过
			</div>
			<div class="checked-icon active-c" v-if="baseInfo.authStatus == 9" @click="goChecked" >
				<span class="point"></span>已认证
			</div>
			<div class="selfInfo-center">
				<van-row>
					<van-col span="6">
						<div class="selfInfo-header" @click="gotoBaseInfo"><i class="iconfont icon-mine"></i></div>
				<!-- <p class="baseInfo-row">{{this.baseInfo.loginName}}</p> -->
					</van-col>
					<van-col class="text-left" offset="1" span="17">
						<p v-if="baseInfo.createBy" class="baseInfo-row">{{baseInfo.createBy}}</p>
						<van-rate
							style="display: inline-block;vertical-align: -3px;"
							allow-half
							readonly
							color="#c00"
							void-icon="star"
							void-color="#eee"
							v-model="baseInfo.creditRating"
						></van-rate>
						<!-- <p style="text-align: center;font-size:18px;" class="baseInfo-row baseInfo-org van-ellipsis">{{overTxt("企业企业企业企业企业企业企业企业企业企业企业企业")}}</p> -->
						<p style="text-align: left;font-size:20px;" v-if="baseInfo.orgName || orgName" class="baseInfo-row baseInfo-org van-ellipsis" v-html="overTxt(baseInfo.orgName||orgName)"></p>
					</van-col>
					
					
				</van-row>
				<van-row>
					<van-col span="24">
						<!-- <p style="text-align: center;font-size:20px;" class="baseInfo-row baseInfo-org van-ellipsis">{{overTxt("企业企业企业企业企业企业企业企业企业企业企业企业")}}</p> -->
						<!-- <p style="text-align: center;font-size:20px;" v-if="baseInfo.orgName || orgName" class="baseInfo-row baseInfo-org van-ellipsis" v-html="overTxt(baseInfo.orgName||orgName)"></p> -->
					</van-col>
				</van-row>
				<!-- <p v-html="overTxt('企业企业企业企业企业企业企业企业企业企业')"></p> -->
			</div>
		</div>
		<div class="base-deal-info" style="display: none;">
			<div class="base-deal-info-box">
				<van-row>
					<van-col span="8" class="base-deal-info-inner">
						<p>0</p>
						<h3 class="selfInfo-box-title">交易中的票据</h3>
					</van-col>
					<van-col span="8" class="base-deal-info-inner">
						<p>0</p>
						<h3 class="selfInfo-box-title">我发布的票据</h3>
					</van-col>
					<van-col span="8" class="base-deal-info-inner">
						<p>0</p>
						<h3 class="selfInfo-box-title">完成的交易</h3>
					</van-col>
				</van-row>
			</div>
			
		</div>
	</div>
	<div style="padding: 250px 10px 50px;">
		<div style="padding-top: 0px;text-align: left;">
			<van-cell class="van-hairline--bottom" @click="safeFn">
				<span slot="title">
					<i class="iconfont icon-lock title-icon-sy"></i>
					安全设置
				</span>
				<i slot="right-icon" class="iconfont icon-next"></i>
			</van-cell>
		</div>
		<div style="padding-top: 0px;text-align: left;">
			<van-cell class="van-hairline--bottom" @click="bankFn">
				<span slot="title">
					<i class="iconfont icon-yinhangqia title-icon-sy"></i>
					银行账户设置
				</span>
				<i slot="right-icon" class="iconfont icon-next"></i>
			</van-cell>
		</div>
		<div style="padding-top: 0px;text-align: left;">
			<van-cell class="van-hairline--bottom" @click="gotoRealName">
				<span slot="title">
					<i class="iconfont icon-safety-certificate title-icon-sy"></i>
					实名认证
				</span>
				<i slot="right-icon" class="iconfont icon-next"></i>
			</van-cell>
		</div>
		<div style="padding-top: 0px;text-align: left;">
			<van-cell class="van-hairline--bottom" @click="xyFn">
				<span slot="title">
					<i class="iconfont icon-gongdan title-icon-sy"></i>
					平台规则与协议
				</span>
				<i slot="right-icon" class="iconfont icon-next"></i>
			</van-cell>
		</div>
		<div style="padding-top: 0px;text-align: left;margin-top: 10px;">
			<van-cell class="van-hairline--bottom" @click="gotoCaculate">
				<span slot="title">
					<i class="iconfont icon-caculater title-icon-sy"></i>
					计算器
				</span>
				<i slot="right-icon" class="iconfont icon-next"></i>
			</van-cell>
		</div>
		<!-- <van-row class="selfInfo-box">
			<van-col 
			span="12"
			>
				<div
				@click="safeFn">
					<van-col offset="2" span="2">
						<i class="iconfont icon-lock" style="color:#0079f3;vertical-align: -8px;"></i>
					</van-col>
					<van-col span="20">
						<h3 class="selfInfo-box-title">安全设置</h3>
						<p class="selfInfo-box-des">密码修改</p>
					</van-col>
				</div>

			</van-col>
			<van-col
			span="12"
			>
				<div
				@click="bankFn">
					<van-col offset="2" span="2">
						<i class="iconfont icon-yinhangqia" style="color:#0079f3;vertical-align: -8px;"></i>
					</van-col>
					<van-col span="20">
						<h3 class="selfInfo-box-title">银行账户设置</h3>
						<p class="selfInfo-box-des">提现银行账户，签收银行账户</p>
					</van-col>
				</div>

			</van-col>
		</van-row>
		<van-row class="selfInfo-box">
			<van-col span="12">
				<div @click="gotoRealName">
					<van-col offset="2" span="2">
						<i class="iconfont icon-safety-certificate" style="color:#0079f3;vertical-align: -8px;"></i>
					</van-col>
					<van-col span="20">
						<h3 class="selfInfo-box-title">实名认证</h3>
						<p class="selfInfo-box-des">实名认证，认证修改</p>
					</van-col>
				</div>
			</van-col>
			<van-col span="12">
				<div
				@click="xyFn">
					<van-col offset="2" span="2">
						<i class="iconfont icon-gongdan" style="color:#0079f3;vertical-align: -8px;"></i>
					</van-col>
					<van-col span="20">
						<h3 class="selfInfo-box-title">平台规则</h3>
						<p class="selfInfo-box-des">流程与协议</p>
					</van-col>
				</div>
			</van-col>
		</van-row>
		<van-row class="selfInfo-box">
			<van-col span="12">
				<div @click="gotoCaculate">
					<van-col offset="2" span="2">
						<i class="iconfont icon-caculater" style="color:#0079f3;vertical-align: -8px;"></i>
					</van-col>
					<van-col span="20">
						<h3 class="selfInfo-box-title">计算器</h3>
						<p class="selfInfo-box-des">票据收支计算</p>
					</van-col>
				</div>
			</van-col>
		</van-row> -->
	</div>
<van-dialog
v-model="show"
title="平台规则"
:close-on-click-overlay="true"
>
<div class="gz-model-content">
	<van-row 
	v-for="(item,index) in xyData"
	:key="index"
	>
	<div @click="previewPdfFn(item)" style="padding: 5px 0;font-size:16px;">
		<van-col span="24"><i class="iconfont icon-pdf1 blue-font"></i>《{{item.name}}》</van-col>
	</div>
</van-row>
</div>
</van-dialog>
</div>
</template>

<script>

import _server from '@/server/server';
import _common from '@/server/index';

import bgImg from '@/assets/self-bg2.png';

export default{
	name: 'Order',
	data(){
		return {
			title: '个人中心',
			show: false,
			bgImg: bgImg,
    			xyData: [],//协议数据
    			baseInfo:{},
    			orgName: '',
    		}
    	},
    	created(){
    		this.getBaseInfo();
    	},
    	methods: {
    		goChecked(){
    			let path = ''
    			if(!this.baseInfo.authStatus){
    				path = '/home/realName';
    			}else{
    				path = '/home/selfInfo/realNameChange';
    			}
    			this.$router.push({path})
    		},
    		initData(){
    			this.xyData = _common.xyData;
    			this.orgName = localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).companyName: '';
    			this.baseInfo = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')): {};
    		},
    		overTxt(str){
    			if(!str){
    				return str;
    			}
    			let strR, len = str.length;
    			if(len < 20){
    				return str;
    			}else{
    				str = str.substring(0, 30);
    				strR = str.substring(0, parseInt(str.length/2)) + '<br/>' + str.substring(parseInt(str.length/2), str.length);
    				if(len > 20){
    					strR += '...';
    				}
    				return strR
    			}
    		},
    		getBaseInfo(){
    			let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')): '',
    			_id = user ? user.orgId : '',
    			_this = this;

    			if(!_id){
    				this.initData();
    				return;
    			}
    			_server.getCompanyData({
    				_id,
    				success(res){
    					if(res){
    						_this.baseInfo = res;
    						_this.baseInfo.creditRating = 6 - _this.baseInfo.creditRating;
    						localStorage.setItem('user', JSON.stringify(res));
    						_this.initData();
    					}
    				}
    			})
    		},
    		safeFn(){
    			this.$router.push({path:'/home/selfInfo/safeSetting'})
    		},
    		bankFn(){
    			this.$router.push({path: '/home/selfInfo/matchBank'})
    		},
    		gotoCaculate(){
    			this.$router.push({path:'/home/selfInfo/caculate'})
    		},
    		gotoBaseInfo(){
    			this.$router.push({path:'/home/selfInfo/baseInfo'})
    		},
    		gotoRealName(){
    			let user = JSON.parse(localStorage.getItem('user'));
    			let authStatus = user ? user.authStatus : '';

    			//未认证进入实名认证页面， 有了认证操作进入修改页面
    			if(!authStatus){
			      // next({path: '/home/realName', query:{redirect: to.fullPath}});
			      	this.$router.push({path: '/home/realName'});
			      	return;
				  }else{
				  	this.$router.push({path: '/home/selfInfo/realNameChange'});
				  	return;
				  }
    		},
			// getBaseInfo(){
			// 	let baseInfo = localStorage.getItem('user');
			// 	if(baseInfo){
			// 		this.baseInfo = JSON.parse(baseInfo);
			// 	}else{
			// 		// this.$router.replace({path:'/login'});
			// 	}
			// },
			xyFn(){
				this.show = true;
			},
			previewPdfFn(item){
				//http://file.dakawengu.com/file/2018-05-29/20180527-tianfeng.pdf
				let pdfUrl = encodeURI('http://file.dakawengu.com/file/2018-05-29/20180527-tianfeng.pdf');
				
				this.$router.push({path: '/previewPdf', query: {pdfUrl: item.url, title: item.name}});
			}
		}
	}
	</script>

	<style scoped>
	.selfInfo-top{
		position: fixed;
		left: 0px;
		top: 45px;
		width: 100%;
		height: 200px;
		background: gray;
		z-index:99;
	}
	.checked-icon{
		position: absolute;
		left: 8px;
		top: 8px;
		padding: 8px;
		border-radius: 10px;
		color: #fff;
		font-size: 12px;
		background-color: rgba(0, 0, 0 , .3);
		transform: scale(.8);
		border-color: #c00;	
	}
	.checked-icon .point{
		display:inline-block;
		width: 10px;
		height: 10px;
		margin-right: 3px;
		border-radius: 50%;
		background-color: #fff;
	}
	.checked-icon.active-c, .checked-icon.active-d{
		color: #fff;
		border: 1px solid #fff;
	}
	.checked-icon.active-c{
		
	}
	.checked-icon.active-n .point{
		background-color: red;
	}
	.checked-icon.active-c .point{
		background-color: #c00;
	}
	.selfInfo-center{
		width: 70%;
		text-align: center;
		position: absolute;
		left: 50%;
		top: 50px;
		transform: translate(-50%);
	}
	.selfInfo-header{
		width: 70px;
		height:70px;
		line-height: 70px;
		text-align: center;
		margin-bottom: 10px;
		display: inline-block;
		background: #fff;
		border-radius: 50%;
	}
	.selfInfo-header i{
		font-size: 28px;
	}
	.selfInfo-center p{
		letter-spacing: 1px;
		color: #fff;
		text-shadow: 1px 1px 1px #000;
	}
	.selfInfo-box{
		background: #fff;
		padding: 10px;
		text-align: left;
		margin-bottom: 10px;
	}
	.selfInfo-box-title{
		font-weight: normal;
		color: #000;
		font-size: 14px;
		margin-bottom: 5px;
		padding-left: 10px;
	}
	.selfInfo-box-des{
		font-weight: normal;
		font-size: 12px;
		padding-left: 10px;
	}
	.baseInfo-row{
		padding-bottom: 5px;
	}
	.gz-model-content{
		font-size: 14px;
		color: #232333;
		padding-top: 10px;
	}
	.gz-model-content .van-row{
		padding-top:5px;
		padding-bottom: 5px;
	}
	p.baseInfo-org{
		font-size:26px;
		letter-spacing: 2px;
	}
	.title-txt{
		text-align: center;
		font-size:22px!important;
		-webkit-line-clamp:2;
		display: -webkit-box;
		-webkit-box-orient:vertical;
		overflow:hidden; 
		text-overflow: ellipsis;
	}
	.base-deal-info{
		position: absolute;
		left:0;
		bottom:0;
		width: 100%;
		transform: translateY(50%);

	}
	.base-deal-info-box{
		margin: 0 10px;
		background: #fff;
		padding: 20px 10px;
		border-radius: 10px 10px 0 0;
		border: 1px solid #eee;
	}
	.base-deal-info-inner{
		font-size: 18px;
		text-align: center;
		position: relative;
	}
	.base-deal-info-inner:not(:nth-last-child(1)):after{
		content: '';
		width: 2px;
		height: 50px;
		background:#c00;
		display: inline-block;
		position: absolute;
		right: -5px;
		opacity: .1;
		top:50%;
		transform: translate(50%,-50%);
	}
	.base-deal-info-inner p{
		color: #cc0000;
	}
	.title-icon-sy{
		color: #c00;
	}
	</style>
