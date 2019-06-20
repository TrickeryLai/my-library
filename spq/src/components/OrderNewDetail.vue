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
	    <div @touchmove.stop class="model-content">
			<van-cell-group v-if="detailData.cpCommercialPaperInfo">
				<h3 class="title">基本信息</h3>
				<van-row class="detail-row">
					<van-col class="detail-row-left" span="6">承兑人</van-col>
					<van-col class="detail-row-right" span="18">{{detailData.cpCommercialPaperInfo.acceptor}}</van-col>
				</van-row>
				<van-row class="detail-row">
					<van-col class="detail-row-left" span="6">票据号码</van-col>
					<van-col class="detail-row-right" span="18">{{detailData.cpCommercialPaperInfo.cpNo}}</van-col>
				</van-row>
				<van-row class="detail-row">
					<van-col class="detail-row-left" span="6">到期日</van-col>
					<van-col class="detail-row-right" span="18">{{detailData.cpCommercialPaperInfo.dueDate}}</van-col>
				</van-row>
				<van-row class="detail-row">
					<van-col class="detail-row-left" span="6">票面金额</van-col>
					<van-col class="detail-row-right" span="18">￥{{detailData.cpCommercialPaperInfo.cpAmount && dealPrice(detailData.cpCommercialPaperInfo.cpAmount.toFixed(2))}}</van-col>
				</van-row>
				<van-row class="detail-row">
					<van-col class="detail-row-left" span="6">背书次数</van-col>
					<van-col class="detail-row-right" span="18">{{detailData.cpCommercialPaperInfo.endorseTimes}}</van-col>
				</van-row>
				<van-row class="detail-row">
					<van-col class="detail-row-left" span="6">持票人全称</van-col>
					<van-col class="detail-row-right" span="18">{{detailData.cpCommercialPaperInfo.owner}}</van-col>
				</van-row>
				
				<!-- <van-row class="detail-row">
					<van-col class="detail-row-left" span="6">票据瑕疵</van-col>
					<van-col class="detail-row-right" span="18">{{detailData.cpCommercialPaperInfo.cpDefect}}</van-col>
				</van-row> -->
				<van-row class="detail-row">
					<van-col class="detail-row-left" span="6">剩余天数</van-col>
					<van-col class="detail-row-right" span="18">{{detailData.cpCommercialPaperInfo.stringDate}}</van-col>
				</van-row>
				<van-row class="detail-row">
					<van-col class="detail-row-left" span="6">调整天数</van-col>
					<van-col class="detail-row-right" span="18"></van-col>
				</van-row>
				<van-row class="detail-row">
					<van-col class="detail-row-left" span="6">年化利率</van-col>
					<van-col class="detail-row-right" span="18">{{detailData.cpCommercialPaperInfo.approvalApr && detailData.cpCommercialPaperInfo.approvalApr.toFixed(4)}}%</van-col>
				</van-row>
				<van-row class="detail-row">
					<van-col class="detail-row-left" span="6">每十万收益</van-col>
					<van-col class="detail-row-right" span="18">￥{{detailData.cpCommercialPaperInfo.deductAmount && dealPrice(detailData.cpCommercialPaperInfo.deductAmount.toFixed(2))}}</van-col>
				</van-row>
				<van-row class="detail-row">
					<van-col class="detail-row-left" span="6">转让金额</van-col>
					<van-col class="detail-row-right" span="18">￥{{detailData.cpCommercialPaperInfo.turnVolume && dealPrice(detailData.cpCommercialPaperInfo.turnVolume.toFixed(2))}}</van-col>
				</van-row>
				<van-row class="detail-row">
					<van-col class="detail-row-left" span="6">订单号</van-col>
					<van-col class="detail-row-right" span="18">{{detailData.ordNo}}</van-col>
				</van-row>
				<van-row class="detail-row">
					<van-col class="detail-row-left" span="6">状态</van-col>
					<van-col class="detail-row-right" span="18" v-if="detailData.cpOrder">
						<van-tag color="#c00" v-if="detailData.cpOrder.buyerOrdStatus == '00'">交易完成</van-tag>
						<van-tag color="#c00" v-else-if="detailData.cpOrder.buyerOrdStatus == '01'">待买方报价</van-tag>
						<van-tag color="#c00" v-else-if="detailData.cpOrder.buyerOrdStatus == '02'">等待签电子合同</van-tag>
						<van-tag color="#c00" v-else-if="detailData.cpOrder.buyerOrdStatus == '03'">等待交保证金</van-tag>
						<van-tag color="#c00" v-else-if="detailData.cpOrder.buyerOrdStatus == '04'">等待买家交保证金</van-tag>
						<van-tag color="#c00" v-else-if="detailData.cpOrder.buyerOrdStatus == '05'">待买方支付</van-tag>
						<van-tag color="#c00" v-else-if="detailData.cpOrder.buyerOrdStatus == '06'">等转让背书</van-tag>
						<van-tag color="#c00" v-else-if="detailData.cpOrder.buyerOrdStatus == '07'">待买家签收</van-tag>
						<van-tag color="#c00" v-else-if="detailData.cpOrder.buyerOrdStatus == '08'">等待签凭证</van-tag>
						<van-tag color="#c00" v-else-if="detailData.cpOrder.buyerOrdStatus == '09'">待退保证金</van-tag>
						<van-tag color="#c00" v-else-if="detailData.cpOrder.buyerOrdStatus == '11'">待确认报价</van-tag>
						<van-tag v-else-if="detailData.cpOrder.buyerOrdStatus == '40'">报价已取消</van-tag>
						<van-tag v-else-if="detailData.cpOrder.buyerOrdStatus == '41'">报价被拒绝</van-tag>
						<van-tag v-else-if="detailData.cpOrder.buyerOrdStatus == '43'">订单已取消</van-tag>
						<van-tag color="#c00" v-else-if="detailData.cpOrder.buyerOrdStatus == '44'">违约</van-tag>
					</van-col>
				</van-row>
			</van-cell-group>
			<van-cell-group v-if="detailData.cpQuotedPriceInfo">
				<h3 class="title">报价信息</h3>
				<van-row class="detail-row">
					<van-col class="detail-row-left" span="6">报价人</van-col>
					<van-col class="detail-row-right" span="18">{{detailData.cpQuotedPriceInfo.companyName}}</van-col>
				</van-row>
				<van-row class="detail-row">
					<van-col class="detail-row-left" span="6">报价年化利率</van-col>
					<van-col class="detail-row-right" span="18">{{detailData.cpQuotedPriceInfo.approvalApr && detailData.cpQuotedPriceInfo.approvalApr.toFixed(4)}}%</van-col>
				</van-row>
				<van-row class="detail-row">
					<van-col class="detail-row-left" span="6">报价每十万收益</van-col>
					<van-col class="detail-row-right" span="18">￥{{detailData.cpQuotedPriceInfo.deductAmount && dealPrice(detailData.cpQuotedPriceInfo.deductAmount.toFixed(2))}}</van-col>
				</van-row>
				<van-row class="detail-row">
					<van-col class="detail-row-left" span="6">报价金额</van-col>
					<van-col class="detail-row-right" span="18">￥{{detailData.cpQuotedPriceInfo.turnVolume && dealPrice(detailData.cpQuotedPriceInfo.turnVolume.toFixed(2))}}</van-col>
				</van-row>
				<van-row class="detail-row">
					<van-col class="detail-row-left" span="6">竞价时间</van-col>
					<van-col class="detail-row-right" span="18">{{detailData.cpQuotedPriceInfo.quoteTime}}</van-col>
				</van-row>
				<van-row class="detail-row">
					<van-col class="detail-row-left" span="6">撮合时间</van-col>
					<van-col class="detail-row-right" span="18">{{detailData.cpQuotedPriceInfo.matchTime}}</van-col>
				</van-row>
			</van-cell-group>
			<van-cell-group>
				<h3 class="title">票据图片</h3>
				<div>
					<img 
					class="ticketPic" 
					:src="detailData.cpCommercialPaperInfo && dealPic(detailData.cpCommercialPaperInfo.frontBillImg, detailData.cpOrder.buyerOrdStatus)"
					@click="previewPic(0, detailData.cpOrder.buyerOrdStatus)"
					>
					<img 
					v-if="detailData.cpOrder && detailData.cpOrder.buyerOrdStatus == '00'"
					class="ticketPic" 
					:src="detailData.cpCommercialPaperInfo && dealPic(detailData.cpCommercialPaperInfo.backBillImg, detailData.cpOrder.buyerOrdStatus)"
					@click="previewPic(1, detailData.cpOrder.buyerOrdStatus)"
					>
				</div>
			</van-cell-group>
			<van-cell-group v-if="detailData.esignDocList && detailData.esignDocList.length > 0">
				<h3 class="title">电子合同</h3>
				<van-row 
				class="detail-row" 
				v-for="(item, index) in detailData.esignDocList"
				:key="index"
				>
					<van-col class="detail-row-left" span="18">{{item.name}}</van-col>
					<van-col class="detail-row-right" span="6"><a href="javascript:;" @click="uploadFile(item)" style="font-size:14px;">下载</a></van-col>
				</van-row>
			</van-cell-group>
			<van-cell-group v-if="detailData.cpComent">
				<h3 class="title">评价</h3>
				<van-row 
				class="detail-row" 
				>
					<van-col class="detail-row-left" span="6">评星</van-col>
					<van-col class="detail-row-right" span="18">
						<van-rate
							style="display: inline-block;vertical-align: -3px;"
							allow-half
							readonly
							color="#f44"
							void-icon="star"
							void-color="#eee"
							v-model="detailData.cpComent.score"
						></van-rate>
					</van-col>
				</van-row>
				<van-row 
				class="detail-row" 
				>
					<van-col class="detail-row-left" span="6">内容</van-col>
					<van-col class="detail-row-right" span="18">{{detailData.cpComent.remark}}</van-col>
				</van-row>
			</van-cell-group>
		</div>
	</div>
</template>

<script type="text/javascript">

	import _server from '@/server/server';
	import _common from '@/server/index';
	import {ImagePreview} from 'vant';

	export default {
		name: 'OrderNewDetail',
		data(){
			return {
				title: '详情',
				queryData: {},
				detailData: {},
			}
		},
		created(){
			this.getData();
		},
		methods:{
			onClickLeft(){
				// this.$router.go(-1);
				this.$router.back(-1);
				// this.$router.replace({path: '/home/odPage'})
				// window.history.go(-1)
				// window.location.go(-1);
			},
			dealPrice(price){
				if(!price){
					return price;
				}
				return _common.common_fn.dealPrice(price);
			},
			getData(){
				this.queryData = JSON.parse(this.$route.query.data);
				
				_server.cpOrderDetail(this.queryData.ordNo, '00').then(res => {
					if(res.code == 0){
						this.detailData = res.data;
					}else{
						this.$toast(res.errMsg);
					}
				}).catch(error => {

				})
			},
			dealPic(url, status){
				if(status != '00'){
					return _common.mosPicUrl + url;
				}else{
					return _common.picUrl + url;
				}
			},
			previewPic(index, status){
				let imageResult = [_common.picUrl + this.detailData.cpCommercialPaperInfo.frontBillImg];
				
				if(status != '0'){
					imageResult = [_common.mosPicUrl + this.detailData.cpCommercialPaperInfo.frontBillImg]
				}else{
					imageResult = [_common.picUrl + this.detailData.cpCommercialPaperInfo.frontBillImg, _common.picUrl + this.detailData.cpCommercialPaperInfo.backBillImg]
				}
				ImagePreview({
					images: imageResult,
					startPosition: index,
					onClose() {
				    // do something
				}
				});
			},
			uploadFile(item){
				
				_server.uploadFile({
					ordNo: this.detailData.ordNo,
					flowId: item.flowId,
					fileName: item.url
				}).then(data => {
			       	data = new Blob([data]);
                    var reader = new FileReader();
                    reader.readAsDataURL(data);
                    reader.onload = function (e) {
                        var a = document.createElement('a');
                        a.download = item.name;
                        a.href = e.target.result;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    }
				})
			},
			deleteP(){

			},

			change(){

			},
			checkedDeal(){

			}


		}

	}
</script>

<style scoped>
.title{
	padding: 10px;
	text-align: left;
	color: #000;
	font-weight: normal;
	font-size: 16px;
}
.title::before{
	content: '';
	display: inline-block;
	width: 8px;
	height: 20px;
	border-radius: 20px;
	background: #c00;
	vertical-align: -4px;
	margin-right: 7px;
}
.model-content{
	text-align: left;
	padding-bottom: 20px;
}
.van-popup{
	width: 80%;
  	height: 100%;
  	position: fixed;
}
.detail-row{
	padding: 10px 15px;
	color: #333;
	display: flex;
    align-items: center;
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
.detail-row-right{
	word-break: break-all;
}
.picBox{
	display:inline-block;
 	width: 80px;
  	height: 80px;
  	text-align: center;
  	line-height: 80px;
  	margin-right: 5px;
  	background: #f5f5f5;
  	position: relative;
  	border:1px solid #ccc;
}
.picBox img{
 	width: 100%;
  	max-height: 100%;
  	vertical-align: middle;
}
.ticketPic{
	width: 100px;
	max-height: 100px;
	display: inline-block;
	margin: 10px;
	vertical-align: middle;
}
</style>