<template>
	<div>
		<van-nav-bar
		:title="title"
		fixed
		class="top-bg"
		/>
		<div class="selfInfo-top">
			<div style="position: absolute;left:0;top:0;width: 100%;height: 100%;">
				<div class="checked-icon" v-if="(!this.baseInfo.orgId && !this.baseInfo._checked)" @click="goChecked">
					<span class="point"></span>未认证
				</div>
				<div class="checked-icon active-c" v-if="(this.baseInfo.orgId || this.baseInfo._checked)" >
					<span class="point"></span>已认证
				</div>
				<div class="selfInfo-center">
					<div class="selfInfo-header" @click="gotoBaseInfo"><i class="iconfont icon-mine"></i></div>
					<p class="baseInfo-row">{{this.baseInfo.loginName}}</p>
					<!-- <p v-if="baseInfo.phonenumber" class="baseInfo-row"><i class="iconfont icon-mobile-alt"></i>{{this.baseInfo.phonenumber}}</p> -->
					<p v-if="baseInfo.orgName || orgName" class="baseInfo-row baseInfo-org">{{orgName || this.baseInfo.orgName}}</p>
				</div>
			</div>
		</div>
		<div style="padding: 220px 10px 50px;">
			<van-row class="selfInfo-box">
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
							<p class="selfInfo-box-des">密码修改，信息修改</p>
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
			</van-row>
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
					<div @click="previewPdfFn(item)">
						<van-col span="24"><i class="iconfont icon-pdf1 blue-font"></i>《{{item.name}}》</van-col>
					</div>
				</van-row>
			</div>
		</van-dialog>
	</div>
</template>

<script>

  import _server from '@/server/index';

	export default{
		name: 'Order',
		data(){
			return {
				title: '个人中心',
				show: false,
    			xyData: [],//协议数据
				baseInfo:{},
				orgName: '',
			}
		},
		created(){
		  	this.initData();
			this.getBaseInfo();
		},
		methods: {
			goChecked(){
				this.$router.push({path:'/home/realName'})
			},
	      	initData(){
			  	this.xyData = _server.xyData;
			  	this.orgName = localStorage.getItem('baseInfo')?JSON.parse(localStorage.getItem('baseInfo')).companyName: '';
	      	},
			safeFn(){
				this.$router.push({path:'/home/selfInfo/safeSetting'})
			},
			gotoCaculate(){
				this.$router.push({path:'/home/selfInfo/caculate'})
			},
			gotoBaseInfo(){
				this.$router.push({path:'/home/selfInfo/baseInfo'})
			},
			getBaseInfo(){
				let baseInfo = localStorage.getItem('user');
				if(baseInfo){
					this.baseInfo = JSON.parse(baseInfo);
				}else{
					// this.$router.replace({path:'/login'});
				}
			},
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
	background: -moz-linear-gradient(top, #0079f3 0%, #f5f5f5 100%);
	background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#0079f3), color-stop(100%,#f5f5f5));
	background: -webkit-linear-gradient(top, #0079f3 0%,#f5f5f5 100%);
	background: -o-linear-gradient(top, #0079f3 0%,#f5f5f5 100%);
	background: -ms-linear-gradient(top, #0079f3 0%,#f5f5f5 100%);
	background: linear-gradient(to bottom, #0079f3 0%,#f5f5f5 100%);
}
.checked-icon{
	position: absolute;
	left: 8px;
	top: 8px;
	padding: 8px;
	border-radius: 10px;
	border: 1px solid #fff;
	color: #fff;
	font-size: 12px;
	background-color: rgba(0, 0, 0 , .3);
	transform: scale(.8);	
}
.checked-icon .point{
	display:inline-block;
	width: 10px;
	height: 10px;
	margin-right: 3px;
	border-radius: 50%;
	background-color: rgba(255, 255, 255);
}
.checked-icon.active-c{
	color: #fff;
	border-color: #1989fa;
}
.checked-icon.active-c .point{
	background-color: #1989fa;
}
.selfInfo-center{
	width: 80%;
	text-align: center;
	position: absolute;
	left: 50%;
	top: 30px;
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
</style>
