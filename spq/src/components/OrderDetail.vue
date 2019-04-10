<template>
	<van-popup  
	v-model="show"
	position="right"
	@close="modelClose"
	class="orderDetail"
	>
		<div class="model-content">
			<div>
				<van-cell-group class="van-hairline--bottom">
				<h3 class="title">票据详情</h3>
				<van-cell-group>
					<van-row class="detail-row">
						<van-col class="detail-row-left" span="6">承兑人</van-col>
						<van-col class="detail-row-right" span="18">{{initData.acceptor}}</van-col>
					</van-row>
					<van-row class="detail-row">
						<van-col class="detail-row-left" span="6">票据号码</van-col>
						<van-col class="detail-row-right" span="18">{{initData.cpNo}}</van-col>
					</van-row>
					<van-row class="detail-row">
						<van-col class="detail-row-left" span="6">票据金额</van-col>
						<van-col class="detail-row-right" span="18">{{initData.cpAmount}}</van-col>
					</van-row>
					<van-row class="detail-row">
						<van-col class="detail-row-left" span="6">到期时间</van-col>
						<van-col class="detail-row-right" span="18">{{initData.dueDate}}</van-col>
					</van-row>
					<van-row class="detail-row">
						<van-col class="detail-row-left" span="6">成交信用</van-col>
						<van-col class="detail-row-left" span="18">
							<van-tag mark type="success" v-if="initData.creditRating == 1">优秀</van-tag>
							<van-tag mark type="primary" v-else-if="initData.creditRating == 3">良好</van-tag>
							<van-tag mark type="danger" v-else-if="initData.creditRating == 3">一般</van-tag>
						</van-col>
					</van-row>
					<van-row class="detail-row">
						<van-col class="detail-row-left" span="6">票据瑕疵</van-col>
						<van-col class="detail-row-left" span="18">
							<van-tag mark type="success" v-if="initData.cpDefect == 1">有瑕疵</van-tag>
							<van-tag mark type="danger" v-else-if="initData.cpDefect == 0">无瑕疵</van-tag>
						</van-col>
					</van-row>
					<van-row class="detail-row">
						<van-col class="detail-row-left" span="6">票据图片</van-col>
						<van-col class="detail-row-left" span="18">
							<img style="width:20vw; "
								v-for = "(item, index) in initData._imgs"
								:key="index"
								:src="item"
								@click="previewPic(index)" />
						</van-col>
					</van-row>
				</van-cell-group>
			</van-cell-group>
			<van-cell-group class="van-hairline--bottom">
				<h3 class="title">报价信息</h3>
				<van-cell-group>
					<van-row>
						<van-col span="24" @click="getbuyPrice">
							<span 
							class="detail-row-special detail-row-left" 
							style="padding-top: 5px;padding-bottom: 5px;"
							
							>
								买家报价
								<!-- <i class="blue-font iconfont icon-refresh"></i> -->
							</span>
							<!-- <van-icon name="replay" class="float:right;" /> -->
						</van-col>
					</van-row>
					<van-row style="background: #f5f5f5;">
						<van-col span="24" class="buy-price">
							{{buyPrice}}
						</van-col>
					</van-row>
				</van-cell-group>
			</van-cell-group>
			<div style="text-align: center;width: 100%;">
				<van-button
					type="info"
					plain
					style="width: 50%; position: absolute; left: 0;bottom: 0;"
					@click="close"
					>关闭</van-button>
				<van-button
					type="info"
					style="width: 50%;position: absolute; right: 0; bottom: 0;"
					@click="okconfirm">确认完成</van-button>
			</div>	
			</div>
		</div>
	</van-popup>
</template>

<script>

	import testImg from '../assets/logo.png';
	import {ImagePreview} from 'vant';
	import _server from '@/server/server';
	import _common from '@/server/index';
	import {Dialog} from 'vant';

	export default{
		name: 'DetailList',
		props: ['showState', 'initData'],
		data(){
			return {
				finished:true,
				show: this.showState,
				img: testImg,
				submit: {
					yearRate:'',//年化利率
					reduceAmount:'',//每十万扣款
				},
				buyPrice: '等待买家报价'
			}
		},
		watch: {
			showState(newValue, oldValue){
				this.show = newValue;
			}
		},
		methods: {
			previewPic(index){
				ImagePreview({
					images: [this.showState.frontBillImg, this.showState.backBillImg],
					startPosition: index,
					onClose() {
				    // do something
				}
				});
			},
			// 获取买家报价
			getbuyPrice(){

			},
			modelClose(){
				//关闭的时候改变对应状态，继续观察
				this.$emit("close")
			},
			okconfirm(){
				//二次弹窗确认
				Dialog.confirm({
					title: '确认交易',
					message: '确认完成交易么？'
				}).then(() => {
  					// on confirm
  					this.ok();
				}).catch(() => {
  					// on cancel
				});
			},
			ok(){
				let currentPath = this.$router.history.current.fullPath;
				let _this = this;
				//判断是否验证
				let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
				if(!(user.orgId || user._checked)){

					this.$router.push({path: '/home/realName', query:{redirect: currentPath}});
					this.$toast('请先实名认证！');
					return;
				}

				_server.buyFn({}, (response) => {
					if(response.code == 0){

					}else{
						_this.$toast(response.errMsg);
					}
					// this.$emit("ok");
					// this.modelClose();
				})
				this.$emit("ok");
				this.modelClose();
			},
			close(){
				this.modelClose();
			},
			getLastTime(){
				//获取剩余时间
				let dueDate = this.initData.dueDate;// 到期时间

				let LastTime = new Date(dueDate).getTime() - new Date().getTime();

				LastTime = Math.ceil(LastTime / (24*60*60));
				return LastTime;
			},
			refreshPriceFn(){
				//刷新报价信息
				
			},
		}
	}
</script>

<style scoped>
.title{
	padding: 10px;
	text-align: left;
	color: #000;
	font-weight: normal;
}
.title::before{
	content: '';
	display: inline-block;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: #0079f3;
	vertical-align: 5px;
	margin-right: 7px;
}
.model-content{
	text-align: left;
  height: 100%;
  position: relative;
}
.van-popup{
	width: 80%;
  height: 100%
}
.detail-row{
	padding: 10px 15px;
	color: #333;
}
.detail-row-special{
	padding: 10px 15px;
	color: #333;
}
.detail-row:nth-child(2n){
	background-color:#f5f5f5;
}
.detail-row-left{
	font-size: 14px;
}
.buy-price{
	color: #000;
	padding: 10px 15px;
	display:inline-block;
	background: #f5f5f5;
}
</style>
