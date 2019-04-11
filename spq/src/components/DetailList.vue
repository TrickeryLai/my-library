<template>
	<div>
	<van-popup  
	v-model="show"
	position="right"
	@close="modelClose"
	@touchmove.stop
	>
		<div class="model-content" @touchmove.stop>
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
						<van-col class="detail-row-right" span="18">{{dealPrice(initData.cpAmount)}}元</van-col>
					</van-row>
					<van-row class="detail-row">
						<van-col class="detail-row-left" span="6">到期时间</van-col>
						<van-col class="detail-row-right" span="18">{{initData.dueDate}}</van-col>
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
			<van-cell-group class="">
				<h3 class="title">报价信息</h3>
				<van-cell-group>
					<van-row>
						<van-col span="24" @click="getbuyPrice">
							<span 
							class="detail-row-special detail-row-left" 
							style="padding-top: 10px;padding-bottom: 10px;display:inline-block;"
							>
								买家最新报价
								<span class="blue-font" style="margin-left:3px;"
									@click="getbuyPrice"
								>
									{{time}}秒后自动刷新
									<i class="iconfont icon-refresh"></i>
								</span>
								
							</span>
						</van-col>
					</van-row>
					<van-row style="background: #f5f5f5;">
						<van-col span="24" class="buy-price">
							<span v-if="hasBuyPrice">
								{{dealPrice(buyPrice)}}元
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
					<van-row class="detail-row-special">

						<van-col class="detail-row-left" span="12">年化利率</van-col>
						<van-col class="detail-row-left" span="12">每十万扣款</van-col>
						<van-col class="detail-row-left" span="24">
							<van-field 
							style="width:35%;display:inline-block;vertical-align:middle;margin-left:0;margin-right:0;padding-left:0;padding-right:0;" 
							v-model="submit.yearRate"
							placeholder="年化利率"
							@input="changeData(1)"
							type="number" />
						%
							<van-field 
							style="width:35%;display:inline-block;vertical-align:middle;margin-left:0;margin-right:0;padding-left:0;padding-right:0;" 
							v-model="submit.reduceAmount"
							@input="changeData(2)" 
							placeholder="每十万扣款"
							type="number" />
							<span>元/十万</span>
						</van-col>
						<van-col span="24">
							<span class="detail-row-left">成交金额（元）</span>
							<van-field 
							style="display:inline-block;vertical-align:middle;margin-left:0;margin-right:0;padding-left:0;padding-right:0;" 
							v-model="submit.dealAmount" 
							@input="changeData(3)"
							placeholder="成交金额"
							type="number" />
						</van-col>
					</van-row>
				</van-cell-group>
				
			</van-cell-group>
			<div style="text-align: center;width: 100%;height: 50px;">
				<van-button
					type="info"
					style="width: 100%;position: absolute; left: 0; bottom: 0;"
					@click="ok">我要买</van-button>
			</div>
				
			</div>
		</div>	
	</van-popup>
	<PriceList 
			:show='priceListShow'
			:baseData='priceListBaseData'
			@close='priceListClose'
		/>
	</div>
</template>

<script>
	import PriceList from '@/components/PriceList'
	import {ImagePreview} from 'vant';
	import _server from '@/server/server';
	import _common from '@/server/index';

	export default{
		name: 'DetailList',
		props: ['showState', 'initData', 'item'],
		components:{PriceList},
		data(){
			return {
				finished:true,
				show: this.showState,
				initD: this.initData,
				priceListShow: false,
				priceListBaseData: '',
				timerOut: '',//计时器
				time: 60,
				imgs: [],
				submit: {
					yearRate:'',//年化利率
					reduceAmount:'',//每十万扣款
				},
				refreshPriceState: false,//刷新价格开关
				buyPrice: '',
        		hasBuyPrice: false
			}
		},
		watch: {
			showState(newValue, oldValue){
				this.show = newValue;
				if(newValue){
					this.setTimeoutFn();
					this.getbuyPrice();
					this.submit.yearRate = '';
					this.submit.reduceAmount = '';
					this.submit.dealAmount = '';
					this.imgs = [_common.picUrl + this.initData.frontBillImg, _common.picUrl + this.initData.backBillImg];
				}else{
					clearInterval(this.timerOut);
					this.time = 60;
					this.buyPrice = '';
        			this.hasBuyPrice = false;
				}
			}
		},
		methods: {
			touchmove(e){
				// e.stopPropagation();
				//阻止 touchmove事件触发组件的touchmove事件，防止拖动报错
			},
			setTimeoutFn(){
				this.timerOut = setInterval(() => {
					this.time --;
					if(this.time <= 0){
						this.getbuyPrice();
					}
				}, 1000)
			},
			dealPrice(price){
				return _common.common_fn.dealPrice(price);
			},
			showAllPrice(){
				//查看所有报价信息
				this.priceListShow = true;
				this.priceListBaseData = this.initData;
			},
			priceListClose(){
				//查看所有报价--关闭
				this.priceListShow = false;
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
	            	_this.refreshPriceState = false;
		            if(res && res.length > 0){
	              		_this.hasBuyPrice = true;
              			_this.buyPrice = res[0].turnVolume;	
		            	
		            }else{
		              _this.hasBuyPrice = false;
		            }
		          }
		        })
			},
			previewPic(index){
				ImagePreview({
					images: [_common.picUrl + this.initData.frontBillImg, _common.picUrl + this.initData.backBillImg],
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
				//判断是否验证
				let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
				if(!(user.orgId || user._checked)){

					this.$router.push({path: '/home/realName', query:{redirect: currentPath}});
					this.$toast('请先实名认证！');
					return;
				}
				if(!this.submit.dealAmount || !this.submit.yearRate || !this.submit.reduceAmount){
					this.$toast('请先完整填写报价信息！');
					return;
				}
				if(parseFloat(this.submit.dealAmount) < 0){
					this.$toast('成交金额不能小于0！');
					return;
				}

				let data = {
					approvalApr: this.submit.yearRate,
					channel: "02",
					cpId: this.item.cpId,
					cpNo: this.item.cpNo,
					deductAmount: this.submit.reduceAmount,
					endorseTimes: this.item.endorseTimes,
					turnVolume: this.submit.dealAmount
				};

				_server.insertQuotedInfo(data, (response) => {
					if(response.code == 0){
						this.$toast('操作成功');
						this.$emit("ok");
						this.modelClose();
					}else{
						_this.$toast(response.errMsg);
					}
					// this.$emit("ok");
					// this.modelClose();
				})
			},
			getLastTime(){
				//获取剩余时间
				let dueDate = this.initData.dueDate;// 到期时间
				return _common.common_fn.getLastTime(dueDate);
			},
			changeData(type){
				let cpAmount = this.initData.cpAmount;//票据金额
				let calDay = this.getLastTime();//剩余时间
				let txje;
				if(type == 1){
					txje = ((cpAmount*calDay*(this.submit.yearRate/100))/360/(cpAmount/100000));
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
					this.submit.reduceAmount = ((cpAmount-this.submit.dealAmount)/(cpAmount/100000)).toFixed(4);//每十万扣款
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
  	-webkit-overflow-scrolling: touch;
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
