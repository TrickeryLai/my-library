<template>
<div>
	<van-popup  
	v-model="show"
	position="right"
	@close="modelClose"
	>
		<div class="model-content">
			<div style="height: 100%;overflow:auto;">
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
						<van-col class="detail-row-right" span="18">{{dealPrice(initData.cpAmount &&　initData.cpAmount.toFixed(2))}}元</van-col>
					</van-row>
					<van-row class="detail-row">
						<van-col class="detail-row-left" span="6">背书次数</van-col>
						<van-col class="detail-row-right" span="18">{{initData.endorseTimes}}次</van-col>
					</van-row>
					<van-row class="detail-row">
						<van-col class="detail-row-left" span="6">到期时间</van-col>
						<van-col class="detail-row-right" span="18">{{initData.dueDate}}</van-col>
					</van-row>
					<van-row class="detail-row" v-if="initData.actualTime">
						<van-col class="detail-row-left" span="6">成交日期</van-col>
						<van-col class="detail-row-right" span="18">{{initData.actualTime}}</van-col>
					</van-row>
					<van-row class="detail-row">
						<van-col class="detail-row-left" span="6">票据状态</van-col>
						<van-col class="detail-row-right" span="18">
							<van-tag type="success" v-if="initData.cpStatus == 1">审核中</van-tag>
							<van-tag type="danger" v-else-if="initData.cpStatus == 2">撮合成功</van-tag>
							<van-tag v-else-if="initData.cpStatus == 3">已注销</van-tag>
              				<van-tag type="primary" v-else-if="initData.cpStatus == 4">已发布</van-tag>
              				<van-tag v-else-if="initData.cpStatus == 5">审核失败</van-tag>
              				<van-tag color="#1989fa" v-else-if="initData.cpStatus == 6">已成交</van-tag>
              				<van-tag v-else-if="item.cpStatus == 7">买方违约</van-tag>
							<van-tag v-else-if="item.cpStatus == 8">卖方违约</van-tag>
							<van-tag v-if="initData.stringDate < 0">已过期</van-tag>
						</van-col>
					</van-row>
					<van-row class="detail-row" v-if="initData.cpStatus == 5">
						<van-col class="detail-row-left" span="6">原因</van-col>
						<van-col class="detail-row-right" span="18">{{initData.refusalCause}}</van-col>
					</van-row>
					<van-row class="detail-row">
						<van-col class="detail-row-left" span="6">成交信用</van-col>
						<van-col class="detail-row-left" span="18">
							<van-tag mark type="success" v-if="initData.creditRating == 1">优秀</van-tag>
							<van-tag mark type="primary" v-else-if="initData.creditRating == 2">良好</van-tag>
							<van-tag mark type="danger" v-else-if="initData.creditRating == 3">一般</van-tag>
						</van-col>
					</van-row>
					<!-- <van-row class="detail-row">
						<van-col class="detail-row-left" span="6">是否有瑕疵</van-col>
						<van-col class="detail-row-left" span="18">
							<van-tag mark type="danger" v-if="initData.isDefect == 1">有瑕疵</van-tag>
							<van-tag mark type="success" v-else-if="initData.isDefect == 0">无瑕疵</van-tag>
						</van-col>
					</van-row> -->
					<van-row class="detail-row">
						<van-col class="detail-row-left" span="6">票据瑕疵</van-col>
						<van-col class="detail-row-left" span="18">
							{{initData.cpDefect}}
						</van-col>
					</van-row>
					<van-row class="detail-row">
						<van-col class="detail-row-left" span="6">票据图片</van-col>
						<van-col class="detail-row-left" span="18">
							<div 
							v-for = "(item, index) in imgs"
							:key="index" 
							class="picBox">
								<img 
								:src="item"
								@click="previewPic(index)" />
							</div>
						</van-col>
					</van-row>
				</van-cell-group>
			</van-cell-group>
			<van-cell-group v-if="item.cpStatus == 2 || item.cpStatus == 3 || item.cpStatus == 4 || item.cpStatus == 6" class="van-hairline--bottom" style="padding-bottom: 60px;">
				<h3 class="title">报价信息</h3>
				<van-cell-group>
					<van-row>
						<van-col span="24" @click="getbuyPrice">
							<span 
							class="detail-row-special detail-row-left" 
							style="padding-top: 5px;padding-bottom: 5px;"
							>
								{{buyPriceText}}
								<span 
									class="blue-font" 
									style="margin-left:3px;"
									v-if="initData.cpStatus == '04' && initData.stringDate >= 0"
									@click="getbuyPrice"
								>
									{{time}}秒后自动刷新
									<i class="iconfont icon-refresh"></i>
								</span>
								
							</span>
							<!-- <van-icon name="replay" class="float:right;" /> -->
						</van-col>
					</van-row>
					<van-row style="background: #f5f5f5;">
						<van-col span="24" class="buy-price">
							<span v-if="hasBuyPrice">
								{{dealPrice(buyPrice && buyPrice.toFixed(2))}}元
							</span>
			              	<span v-else>
			                	等待买家报价
			              	</span>
							<span
							v-if="hasBuyPrice"
							class="blue-font"
							style="font-size:12px;" 
							@click="showAllPrice">&nbsp查看所有</span>
						</van-col>
					</van-row>
				</van-cell-group>
				
			</van-cell-group>
			<van-row type="flex" justify="center" style="width: 100%;height: 44px;position: absolute;left: 0; bottom: 0;">
					<van-col span="12" v-if="initData.cpStatus == 4 || initData.cpStatus == 1 || initData.cpStatus == 5">
						<van-button
						type="danger"
						style="width: 100%;"
						@click="deleteP">注销</van-button>
					</van-col>
					<van-col span="12" v-if="(initData.cpStatus == 1 || initData.cpStatus == 5) && initData.stringDate >= 0">
						<van-button
						type="primary"
						style="width: 100%;"
						@click="change">修改</van-button>
					</van-col>
					<van-col span="24">
						<van-button
						type="info"
						style="width: 100%;"
						@click="ok">关闭</van-button>
					</van-col>
					
				</van-row>
			</div>
		</div>
	</van-popup>
	<PriceList 
			:show='priceListShow'
			:baseData='priceListBaseData'
			:type = "priceType"
			@close='priceListClose'
			@optionSuccess='biddingSuccess'
		/>
</div>
</template>

<script>

	import PriceList from '@/components/PriceList';
	import {ImagePreview} from 'vant';
	import _server from '@/server/server';
	import _common from '@/server/index';

	export default{
		name: 'TicketHolderListDetail',
		props: ['showState', 'initData', 'item'],
		components: {PriceList},
		data(){
			return {
				finished:true,
				show: this.showState,
				initD: this.initData,
				timerOut: '',//计时器
				time: 60,
				imgs: [],
				img: '',
				submit: {
					yearRate:'',//年化利率
					reduceAmount:'',//每十万扣款
				},
				priceType: 0,//报价列表是否有可撮合按钮， 0，无， 1 有（暂定）
				priceListShow: false,
				priceListBaseData: '',
				refreshPriceState: false,
				hasBuyPrice: false,
				buyPrice: '',
				buyPriceText: '买家最新报价'
			}
		},
		watch: {
			showState(newValue, oldValue){
				this.show = newValue;
				if(newValue){
					this.setTimeoutFn();
					this.getbuyPrice();
					if(this.initData.cpStatus == 2){
						this.buyPriceText = '撮合成交价';
					}else{
						this.buyPriceText = '买家最新报价';
					}	
				}else{
					clearInterval(this.timerOut);
					this.time = 60;
				}
				this.imgs = [_common.picUrl + this.initData.frontBillImg, _common.picUrl + this.initData.backBillImg];
				// this.imgs = [_common.picUrl + this.initData.frontBillImg];
			}
		},
		methods: {
			setTimeoutFn(){
				if(this.initData.cpStatus != '04' || this.initData.stringDate < 0){
					return;
				}
				this.timerOut = setInterval(() => {
					this.time --;
					if(this.time <= 0){
						this.getbuyPrice();
					}
				}, 1000)
			},
			biddingSuccess(){
				//撮合成功
				this.$emit("refresh");
				this.priceListClose();
			},
			showAllPrice(){
				//查看所有报价信息
				this.priceListShow = true;
				this.priceListBaseData = this.initData;
				if(this.initData.cpStatus == '04'){
					this.priceType = 1;
				}else{
					this.priceType = 0;
				}
			},
			dealPrice(price){
				return _common.common_fn.dealPrice(price);
			},
			// 获取买家报价
			getbuyPrice(){
				if(this.refreshPriceState){
					return;
				}
		        let _this = this, _id = this.initData.cpId;
				this.time = 60;
				this.refreshPriceState = true;
		        _server.getQuotedPrice({
		          _id,
		          success(res){
		          	let result;
	            	_this.refreshPriceState = false;
		            if(res && res.length > 0){
	              		_this.hasBuyPrice = true;

              			if(_this.initData.cpStatus == 2){
	              			result = res.filter(item => {
	              				if(item.quoteStatus == 2){
	              					return item;
	              				}
	              			})
							_this.buyPrice = result[0].turnVolume;
						}else{
              				_this.buyPrice = res[0].turnVolume;	
						}
		            	
		            }else{
		              _this.hasBuyPrice = false;
		            }
		          }
		        })
			},
			priceListClose(){
				//查看所有报价--关闭
				this.priceListShow = false;
			},
			previewPic(index){
				let imageList = this.initData.imageList, 
					imageResult = [_common.picUrl + this.initData.frontBillImg, _common.picUrl + this.initData.backBillImg];
				if(imageList && imageList.length > 0){
					imageList.forEach( item => {
						if(item.imageName){
							imageResult.push(_common.picUrl + item.imageName);
						}
					})
				}

				ImagePreview({
					images: imageResult,
					startPosition: index,
					onClose() {
				    // do something
				}
				});
			},
			modelClose(){
				
				//关闭的时候改变对应状态，继续观察
				this.$emit("close")
			},
			ok(){
				let currentPath = this.$router.history.current.fullPath;
				let _this = this;
				
				this.$emit("ok");
				this.modelClose();
			},
			deleteP(){
				//注销
			 	this.$dialog.confirm({
					title: '确认注销',
					message: '确认注销此票据么？'
				}).then(() => {
					let cpId = this.initData.cpId, cpStatus = this.initData.cpStatus;
					if(cpStatus != 4){
						return;
					}
					_server.deleteCommercialPaper(cpId, (res) =>{
						if(res.code == 0){
							this.$toast('注销成功！');
							this.$emit("refresh");
							this.modelClose();
						}else{
							this.$toast(res.errMsg);
						}
					})
				}).catch(() => {
				  // on cancel
				});
				
			},
			change(){
				this.$router.push({path: '/home/ticketHolder/fbpj', query: {pjData: JSON.stringify(this.initData)}});
			},
			getLastTime(){
				//获取剩余时间
				let dueDate = this.initData.dueDate;// 到期时间

				let LastTime = new Date(dueDate).getTime() - new Date().getTime();

				LastTime = Math.ceil(LastTime / (24*60*60));
				return LastTime;
			},
			changeData(type){
				let cpAmount = this.initData.cpAmount;//票据金额
				let calDay = this.getLastTime();//剩余时间
				let txje;
				if(type == 1){
					txje = ((cpAmount*calDay*this.submit.yearRate/100)/3600)/100000;
					// this.submit.yearRate = 0;//年利率
					this.submit.reduceAmount = txje.toFixed(4);//每十万扣款
					this.submit.dealAmount = (cpAmount - cpAmount/100000*txje).toFixed(4);//成交金额
				}
				if(type == 2){
					this.submit.dealAmount = (cpAmount - (cpAmount/100000)*this.submit.reduceAmount).toFixed(4);//成交金额

					this.submit.yearRate =((cpAmount -this.submit.dealAmount)*36000/(calDay*cpAmount)).toFixed(8);//年利率
					// this.submit.reduceAmount = 0;//每十万扣款
				}
				if(type == 3){
					this.submit.reduceAmount = ((cpAmount-this.submit.dealAmount)/10).toFixed(4);//每十万扣款
					this.submit.yearRate =((cpAmount -this.submit.dealAmount)*36000/(calDay*cpAmount)).toFixed(8);//年利率
					// this.submit.dealAmount = 0;//成交金额
				}
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
	height: 8px;
	border-radius: 50%;
	background: #0079f3;
	vertical-align: 1px;
	margin-right: 7px;
}
.model-content{
	text-align: left;
  	height: 100%;
  	position: relative;
}
.van-popup{
	width: 80%;
  	height: 100%;
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
</style>
