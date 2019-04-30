<template>
	<div class="order-page">
		<van-nav-bar
		fixed
		class="top-bg"
		@click-right="rightClick"
		>
			<span slot="title" class="top-bg-title">{{title}}</span>
			<span slot="right" class="top-bg-title">{{rightText}}</span>
		</van-nav-bar>
		<div class="">
			<!-- <van-search
			style="position:absolute;left: 0;top: 0;width: 100%;"
			placeholder="请输入承兑人搜索"
			v-model="searchValue"
			@search="onSearch"
			>
				<i class="iconfont icon-search" slot="left-icon"></i>
			</van-search> -->

		</div>

		<van-collapse class="ticket-content-list" v-model="activeName" accordion>
			<transition name="van-slide-left">
				<van-row v-show="showSearch">
					<van-col span="24">

						<van-field
						style="vertical-align:middle;"
						label="起始时间："
						@click="choseTimeFn(1)"
						v-model="beginTimeData.value"
						readonly
						placeholder="请选择起始时间"
						/>
					</van-col>
					<van-col span="24">
						<van-field
						label="终止时间："
						@click="choseTimeFn(2)"
						v-model="endTimeData.value"
						readonly
						placeholder="请选择终止时间"
						/>
					</van-col>
				</van-row>
			</transition>
			<van-collapse-item class="text-left" name="1" style="height: 100%;position: relative;overflow-y:scroll;">
				<p slot="title">
					我的买入
					<span class="blue-font" style="font-size: 12px;" @click.stop="rightClick">({{beginTimeData.value}}&nbsp-&nbsp{{endTimeData.value}})</span>
				</p>
				<div style="border: 1px solid #ccc;">
					<van-pull-refresh 
					v-model="fbListState.isLoading" 
					@refresh="fbOnRefresh">
					<van-list
					v-model="fbListState.loading"
					:finished="fbListState.finished"
					finished-text="没有了"
					:error.sync="error"
					error-text="请求失败，点击重新加载"
					:offset="30"
					@load="fbOnLoad"
					>
					<van-cell
					v-for="(item, index) in fbList"
					:key="index"
					:title="item.title"
					style="margin-bottom: 5px;box-shadow: 1px 1px 1px 1px #ccc;"
					@click="fbShowDetail(item)"
					>
					<template slot="title">
						<van-row>
							<van-col span="24" class="van-ellipsis text-left">票据号：<span style="font-size:16px;">{{item.cpNo}}</span></van-col>
						</van-row>
						<van-row>
							<van-col span="18">
								<span class="text-left">我的竞价金额：</span>
								<!-- <span v-if="item.turnVolume > 10000">
									<span class="price-txt">{{item.turnVolume && (item.turnVolume/10000).toFixed(2)}}</span> 
									<span class="small-font">万元</span>
								</span> -->
								<span>
									<span class="price-txt">{{item.turnVolume && dealPrice((item.turnVolume).toFixed(2))}}</span> 
									<span class="small-font">元</span>	
								</span>
								
							</van-col>
							<van-col span="6">
								<div style="text-align: right;">
									<van-tag round  type="primary" v-if="item.quoteStatus == 1">
										报价中
									</van-tag>
									<van-tag round type="success" v-else-if="item.quoteStatus == 2">撮合成功</van-tag>
									<van-tag round v-else-if="item.quoteStatus == 3">撮合失败</van-tag>
									<van-tag round v-else-if="item.quoteStatus == 4">取消报价</van-tag>
									<van-tag round v-else-if="item.quoteStatus == 5">报价被拒</van-tag>
								</div>
							</van-col>
						</van-row>
						<van-row>
							<van-col span="24">我的竞价时间：{{item.quoteTime}}</van-col>
							<van-col span="24" v-if="item.quoteStatus == 2">撮合时间：{{item.matchTime}}</van-col>
						</van-row>
					</template>
				</van-cell>

			</van-list>

		</van-pull-refresh>
	</div>

	</van-collapse-item>
			<!-- <van-collapse-item class="text-left" title="暂存中" name="2">
				
			</van-collapse-item> -->
		</van-collapse>
		<OrderDetail 
		:showState = 'fbListState.detailModelState'
		@ok= 'detailModelOk'
		@refresh='refreshFn'
		@close= 'detailModelClose'
		:initData = 'fbListState.detailItem'
		:item = 'fbListState.currentItem'
		/>

		<van-popup v-model="beginTimeData.show" position="bottom" @close="timeModelClose">
			<van-datetime-picker
			v-model="beginTimeData.currentDate"
			type="date"
			:min-date="beginTimeData.minDate"
			:max-date="endTimeData.currentDate"
			:formatter="formatter"
			@confirm="timeChoseConfirm(1, beginTimeData.currentDate)"
			@cancel="timeChoseCancel(1)"
			/>
		</van-popup>
		<van-popup v-model="endTimeData.show" position="bottom" @close="timeModelClose">
			<van-datetime-picker
			v-model="endTimeData.currentDate"
			type="date"
			:min-date="beginTimeData.currentDate"
			:max-date="new Date(new Date().getTime() + 24*60*60*1000)"
			:formatter="formatter"
			@confirm="timeChoseConfirm(2, endTimeData.currentDate)"
			@cancel="timeChoseCancel(2)"
			/>
		</van-popup>
	</div>
</template>

<script>
import _server from '@/server/server'
import _common from '@/server/index'
import OrderDetail from '@/components/OrderDetail'
export default{
	name: 'Order',
	components:{OrderDetail},
	data(){
		return {
			title: '资方',
			searchValue: '',
			activeName: '1',
			error: false,
			showSearch: false,
			rightText: '选择',
			endTimeData: {
				show:　false,
				minDate: new Date('2019-01-01'),
				currentDate: new Date(),
				value: this.getTime(new Date()),
			},
			beginTimeData: {
				value: this.getTime(new Date(new Date().getTime() - 24*60*60*1000*7)),
				show: false,
				minDate: new Date('2019-01-01'),
				currentDate: new Date(new Date().getTime() - 24*60*60*1000*7)
			},
			fbListState:{
					finished: false,//是否已经加载完成
					isLoading: false,
					loading: false,
					currentItem: {},//当前查看详情项
					detailItem: {},//查询的具体信息
					detailModelState: false,//弹窗显示隐藏状态
				},
				fbList:[],//已发布的票据列表	
				fbPageInfo:{
					pageNum: 0,
					pageSize: 5,
					total: 0
				}
			}
		},
		created(){
			this.fbOnLoad();

		},
		beforeRouteLeave(to, from, next){
			if(to.name == 'Login' || to.name == 'RealName' || to.name == 'RealNameChange'){
				next();
				return;
			}
	      	if(this.fbListState.detailModelState){
		        this.detailModelClose();
		        next(false);
		        return;
	      	} 

	      	next();
	    },
		methods:{
			spliceTime(item){
				if(!item){
					return;
				}
				return item.substr(0,10);
			},
			rightClick(){
				this.showSearch = !this.showSearch;
				if(this.showSearch){
					this.rightText = '收起';
				}else{
					this.rightText = '选择';
				}
			},
			dealPrice(price){
				return _common.common_fn.dealPrice(price);
			},
			getLastTime(endTime){
				return _common.common_fn.getLastTime(endTime);
			},
			getTime(t = new Date(), type){
				return _common.common_fn.formatterTime(t, type);
			},
			choseTimeFn(type, state = true){
				if(type == 1){
					this.beginTimeData.show = state;
				}else{
					this.endTimeData.show = state;
				}
			},
			timeChoseConfirm(type, value){
				this.timeChoseCancel(type);

				if(type == 1){
					this.beginTimeData.value = this.getTime(value);
				}else{
					this.endTimeData.value = this.getTime(value);
				}
				this.fbPageInfo.pageNum = 1;
				this.fbGetData();
			},
			timeChoseCancel(type){
				this.choseTimeFn(type, false);
			},
			timeModelClose(){

			},
			onSearch(){
				this.fbPageInfo.pageNum = 1;
				this.fbGetData();
			},
			fbGetData(data = {}){
				//获取订单列表
				this.fbListState.loading = true;//处于加载状态，不触发onLoad
				let _this = this;
				let pageData = Object.assign({}, this.fbPageInfo);
				if(pageData.pageNum == 1){
					this.fbList = [];//不清空，在滚动至多页的时候，重新刷新会一直触发onload
				}
				//查询条件
				data = Object.assign({}, pageData, {
					endTime: this.getTime(this.endTimeData.currentDate, 'yyyy-MM-dd'),
					startTime: this.getTime(this.beginTimeData.currentDate, 'yyyy-MM-dd')
				});
				delete data.total;
				//获取列表数据
				_server.getQuotedPri({
					data, 	
				}).then((response) =>{
					this.error = false;
					this.fbListState.loading = false;
					this.fbListState.isLoading = false;	
					if(response.code == 0){
						if(_this.fbPageInfo.pageNum > 1){
							response.list.forEach((item) => {
								this.fbList.push(item);
							});
						}else{
							this.fbList = response.list;
						}
				          //数据全部加载完成
				          if (this.fbList.length >= response.pageInfo.total) {
				          	this.fbListState.finished = true;
				          }else{
				          	this.fbListState.finished = false;
				          }
				      }
				  })
				.catch((error) => {
					this.fbListState.isLoading = false;
					this.fbListState.loading = false;
					this.error = true;
					this.fbPageInfo.pageNum -=1;
				})
			},
			fbOnRefresh(){
				//获取列表数据
				this.fbListState.finished = false;
				this.fbPageInfo.pageNum = 1;
				this.fbGetData();
			},
			fbOnLoad(){
				this.fbListState.loading = true;//处于加载状态，不触发onLoad
				this.fbPageInfo.pageNum += 1;
				this.fbGetData();
			},
			fbShowDetail(item){
				let _this = this;
				this.fbListState.currentItem = item;
				_server.getBusinessTicketDetail({
					_id: item.cpId,
					success(res){
						if(res.code == 0){
							_this.fbListState.detailItem = res.data;
							_this.fbListState.detailModelState = true;
						}
					}
				});
			},
			detailModelOk(){
				this.detailModelClose();
			},
			refreshFn(){
				this.detailModelClose();
				this.fbPageInfo.pageNum = 1;
				this.fbGetData();
			},
			detailModelClose(){
				this.$canScroll();
				this.fbListState.detailModelState = false;
			},
			formatter(type, value) {
				return _common.common_fn.formatter(type, value);
			},

		}
	}
	</script>

	<style>
	.order-page{
		position: absolute;
		left: 0;
		top: -46px;
		width: 100%;
		display: flex;
		flex-direction: column;
        height: 100%;
	}
	.order-page .van-collapse-item__content{
		background-color: #f5f5f5;
		padding-left: 0;
		padding-right: 0;
		padding-top: 0px;
	}
	.order-page .ticket-search{
		position: fixed;
		left: 0;
		top: 45px;
		width: 100%;
		height: 0px;
		z-index: 5;
	}	
	.order-page .ticket-content-list{
		background: #f5f5f5;
		flex: 1;
		height: 100%;
		margin-top: 90px;
		box-sizing: border-box;
		overflow-y: scroll;
	}
	.order-page .van-collapse-item__wrapper{
		position: absolute;
		left: 0;
		top: 0;
		padding-top:50px;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		overflow-y: scroll;
	}
	.order-page .van-collapse-item__title{
		z-index: 999;
	}
	</style>
