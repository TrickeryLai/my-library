<template>
	<van-popup  
	v-model="show"
	position="right"
	@close="modelClose"

	>
		<div class="model-content">
			<div>
				<van-cell-group class="van-hairline--bottom">
				<h3 class="title">票据详情</h3>
				<van-cell-group>
					<van-row class="detail-row">
						<van-col class="detail-row-left" span="6">承兑人</van-col>
						<van-col class="detail-row-right" span="18">{{initData.user}}</van-col>
					</van-row>
					<van-row class="detail-row">
						<van-col class="detail-row-left" span="6">票据号码</van-col>
						<van-col class="detail-row-right" span="18">{{initData.number}}</van-col>
					</van-row>
					<van-row class="detail-row">
						<van-col class="detail-row-left" span="6">票据金额</van-col>
						<van-col class="detail-row-right" span="18">{{initData.amount}}</van-col>
					</van-row>
					<van-row class="detail-row">
						<van-col class="detail-row-left" span="6">到期时间</van-col>
						<van-col class="detail-row-right" span="18">{{initData.endTime}}</van-col>
					</van-row>
					<van-row class="detail-row">
						<van-col class="detail-row-left" span="6">成交信用</van-col>
						<van-col class="detail-row-left" span="18">
							<van-tag mark type="success" v-if="initData.type == 0">优秀</van-tag>
							<van-tag mark type="primary" v-else-if="initData.type == 1">良好</van-tag>
							<van-tag mark type="danger" v-else-if="initData.type == 2">一般</van-tag>
						</van-col>
					</van-row>
					<van-row class="detail-row">
						<van-col class="detail-row-left" span="6">票据瑕疵</van-col>
						<van-col class="detail-row-left" span="18">
							<van-tag mark type="success" v-if="initData.isPerfect == 0">有瑕疵</van-tag>
							<van-tag mark type="danger" v-else-if="initData.isPerfect == 1">无瑕疵</van-tag>
						</van-col>
					</van-row>
					<van-row class="detail-row">
						<van-col class="detail-row-left" span="6">票据图片</van-col>
						<van-col class="detail-row-left" span="18">
							<img style="width:20vw; " 
								v-for = "(item, index) in initData.imgs" 
								:src="img"
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
							<span class="detail-row-special detail-row-left" style="padding-top: 5px;padding-bottom: 5px;">
								买家报价
							</span>
							<!-- <van-icon name="replay" class="float:right;" /> -->
						</van-col>
					</van-row>
					<van-row style="background: #f5f5f5;">
						<van-col span="24" class="buy-price">
							{{buyPrice}}
						</van-col>
					</van-row>
					<van-row class="detail-row-special">

						<van-col class="detail-row-left" span="12">年化利率</van-col>
						<van-col class="detail-row-left" span="12">每十万扣款</van-col>
						<van-col class="detail-row-left" span="24">
							<van-field 
							style="width:35%;display:inline-block;vertical-align:middle;margin-left:0;margin-right:0;padding-left:0;padding-right:0;" 
							v-model="submit.yearRate" placeholder="年化利率"
							type="number" />
						%
							<van-field 
							style="width:35%;display:inline-block;vertical-align:middle;margin-left:0;margin-right:0;padding-left:0;padding-right:0;" 
							v-model="submit.reduceAmount" 
							placeholder="每十万扣款"
							type="number" />
							<span>元/十万</span>
						</van-col>
						<van-col span="24">
							<span class="detail-row-left">成交金额（元）</span>
							<van-field 
							style="display:inline-block;vertical-align:middle;margin-left:0;margin-right:0;padding-left:0;padding-right:0;" 
							v-model="submit.reduceAmount" 
							placeholder="成交金额"
							type="number" />
						</van-col>
					</van-row>
				</van-cell-group>
			</van-cell-group>
			<div style="text-align: center;width: 100%;">
				<van-button
					type="info"
					style="width: 100%;"
					@click="ok">我要买</van-button>
			</div>	
			</div>
		</div>
	</van-popup>
</template>

<script>

	import testImg from '../assets/logo.png'
	import {ImagePreview} from 'vant';

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
					images: this.initData.imgs,
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
				console.log(this.detailData)
				//关闭的时候改变对应状态，继续观察
				this.$emit("close")
			},
			ok(){
				this.$emit("ok");
				this.modelClose();
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
}
.van-popup{
	width: 80%;
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