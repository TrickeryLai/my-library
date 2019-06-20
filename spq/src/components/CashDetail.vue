<template>
	<div>
		<van-nav-bar
		fixed
		@click-left="onClickLeft"
		class="top-bg"
		style="background: #fff;"
		>	
			<span slot="title" class="top-bg-title">{{title}}</span>
			<i class="iconfont icon-previous_step top-bg-title" slot="left"></i>
		</van-nav-bar>
		<div class="list-wrap">
		<div style="overflow-y: hidden;" :style="scrollH">
			<div style="height: 100%;overflow-y:scroll;">
				<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
				<van-list
					ref="bscroll"
					v-model="loading"
					:finished="finished"
					finished-text="没有更多了"
					:error.sync="error"
					error-text="请求失败，点击重新加载"
					:offset=20
					@load="onLoad"
					style="padding-bottom:50px;margin-top: 5px;"
					>
						<van-cell

						v-for="(item,index) in list"
						:key="index"
						:title="index"
						style="margin-bottom: 5px;box-shadow: 1px 1px 0px 1px #ccc;"
						>
							<template slot="title">
								<van-row>
									<p class="cashDetail-type">
										<span v-if="item.bizType == '00'">购买</span>
										<span v-else-if="item.bizType == '00A'">卖出</span>
										<span v-if="item.bizType == '01'">充值</span>
										<span v-if="item.bizType == '02'">提现</span>
										<span v-if="item.bizType == '03'">扣除保证金</span>
										<span v-if="item.bizType == '05'">违约金</span>
									</p>
									<p class="cashDetail-time">{{commonFn.formatterTime(item.txTime)}}</p>
									<p class="cashDetail-amount">
										<span v-if="item.bizType == '00'">-</span>
										<span v-else-if="item.bizType == '00A'">+</span>
										<span v-if="item.bizType == '01'">+</span>
										<span v-if="item.bizType == '02'">-</span>
										<span v-if="item.bizType == '03'">-</span>
										<span v-if="item.bizType == '05'">-</span>
										{{item.payAmt && dealPrice(item.payAmt.toFixed(2))}}
										<span style="font-size: 14px;">	元</span>
									</p>

								</van-row>
								<van-row>
									<p class="cashDetail-line"><span class="cashDetail-line-l">对方户名：</span><span class="cashDetail-line-c">{{item.rptAcName}}</span></p>
									<p class="cashDetail-line"><span class="cashDetail-line-l">对方账号：</span><span class="cashDetail-line-c">{{item.rptAcNo}}</span></p>
									<p class="cashDetail-line"><span class="cashDetail-line-l">手续费：</span><span class="cashDetail-line-c">{{item.fee && dealPrice(item.fee.toFixed(2))}}元</span></p>
									<p class="cashDetail-line"><span class="cashDetail-line-l">流水号：</span><span class="cashDetail-line-c">{{item.requestNo}}</span></p>
								</van-row>
							</template>
						</van-cell>
					</van-list>
				</van-pull-refresh>
			</div>
			
	</div>
</div>
</div>
</template>

<script>
import _server from '@/server/server'
import _common from '@/server/index'

  export default {
  	name: 'CashDetail',
  	data() {
  		return {
  			scrollH:{
  				height: '400px'
  			},
  			title: '收支明细',
	        finished: false,//是否已经加载完成
	        error: false,
	        isLoading: false,
	        loading: false,
	        isGetData: false,
	        detailModelState: false,//详情框状态
	        detailItem: {},//详情项
	        currentItemInfo: '',//当前点击项
	        searchModelState: false,//筛选弹出框状态
	        isGetingData: false,//是否正在请求数据
	        searchData: '',//搜索条件
	        aBScroll: '',
	        // 0是asc   1是desc
	        sortState: {
	          	dueDateSort: '',//到期时间排序
	          	amountSort: '',//金额排序
	          	createTimeSort: 0,//发布时间排序
	      	},
	      	pageData: {
	      		pageNum: 0,
		      	pageSize: 10,
		      	total: 0,
	      	},
	      	commonFn:_common.common_fn,
      		list: []
  		}
	},
	mounted(){
		
	},
	created(){
		this.$canScroll();
	 	window.addEventListener('resize', this.getHeight);
      	this.getHeight()
	},
	beforeRouteLeave(to, from, next){
		if(to.name == 'Login' || to.name == 'RealName' || to.name == 'RealNameChange'){
			next();
			return;
		}
		if(this.detailModelState ){
			this.detailModelState = false;
			this.isGetingData = false;
			this.loading = false;
			next(false);
			return;
		}	

		if(this.searchModelState){
			this.searchModelState = false;
			this.isGetingData = false;
			this.loading = false;
			next(false);
			return;
		}
		this.$canScroll();
		next();
	},
	methods: {
		onClickLeft() {
			this.$router.go(-1);
		},
      	getHeight(){
        	var scrollH = window.screen.height;

        	this.scrollH.height = scrollH - 170 + 'px';
      	},
		transformRate(rate){
			this.list.forEach((item) => {
				item.creditRating = 6 - item.creditRating;
			});
		},
		serachClick() {
			this.$noScroll();
			this.searchModelState = true;
			this.loading = true;
		},
		dealPrice(price){
			return _common.common_fn.dealPrice(price);
		},
		spliceTime(item) {
			if (!item) {
				return;
			}
			return item.substr(0, 10);
		},
		getLastTime(endTime) {
			return _common.common_fn.getLastTime(endTime);
		},
		searchModelClose(data) {
			this.$canScroll();
			this.searchModelState = false;
			this.isGetingData = false;
			this.loading = false;
		},
		detailModelClose() {
			this.$canScroll();
			this.detailModelState = false;
			this.loading = false;
		},
		getData(data, callback) {
			if (this.isGetData) {
				return;
			}
			this.isGetData = true;
	        this.loading = true;//处于加载状态，不触发onLoad
	        let _this = this;
	        let pageData = Object.assign({}, this.pageData);
	      	if (this.pageData.pageNum == 1) {
	      		this.list = [];//不清空，在滚动至多页的时候，重新刷新会一直触发onload
	      	}
	        //查询条件
	        data = Object.assign({}, pageData, data);
	        //获取列表数据
	        _server.transactionData(data).then((response) => {
	        	this.isGetData = false;
	        	this.loading = false;
	        	this.isLoading = false;
	        	this.error = false;
	        	if (response.code == 0) {
	        		if (this.pageData.pageNum > 1) {
	        			response.list.forEach((item) => {
	        				this.list.push(item);
	        			});
	        		} else {
	        			this.list = response.list;

	        		}
		            //数据全部加载完成
		            if (this.list.length >= response.pageInfo.total) {
		            	this.finished = true;
		            } else {
		            	this.finished = false;
		            }
		        }
		        this.transformRate();
	    	}).catch((error) => {
		    	this.error = true;
		    	this.isGetData = false;
		    	this.loading = false;
		    	this.isLoading = false;
	    	})
	},
	onRefresh() {
        //获取列表
        this.pageData.pageNum = 1;
        this.getData(this.searchData);
    },
    onLoad() {
    	this.pageData.pageNum = this.pageData.pageNum + 1;
    	this.getData(this.searchData)
    },
}
}
</script>

<style scoped>
.cashDetail-type{
	font-size: 14px;
	color: #000;
	padding: 2px 0;
	text-align: left;
}
.cashDetail-time{
	font-size: 12px;
	color: #999;
	padding: 2px 0;
	text-align: left;
}
.cashDetail-amount{
	font-size: 24px;
	color: #000;
	padding: 10px 0;
}
.cashDetail-line{
	text-align:left;
}
.cashDetail-line-l{
	font-size: 14px;
	color: #000;
	text-align:left;
}
.cashDetail-line-c{
	font-size: 14px;
	color: #999;
	text-align:left;
}

</style>
