<template>
	<div class="orderPage">
		<van-nav-bar
		:title="title"
		fixed
		class="top-bg"
		/>
		<div class="ticket-search">
			<van-search 
			style="position:absolute;left: 0;top: 0;width: 100%;"
			placeholder="请输入搜索关键词" 
			v-model="searchValue" 
			@search="onSearch"
			>
				<i class="iconfont icon-search" slot="left-icon"></i>
			</van-search>
		</div>
	
		<van-collapse class="ticket-content-list" v-model="activeName" accordion>
			<van-collapse-item class="text-left" title="我的订单" name="1">
				<div style="max-height: 350px;overflow:auto">
					<van-pull-refresh v-model="matchState.isLoading" @refresh="matchOnRefresh">

						<van-list
						v-model="matchState.loading"
						:finished="matchState.finished"
						finished-text="没有了"
						@load="matchOnLoad"
						>
						<van-cell
						v-for="(item, index) in matchList"
						:key="index"
						:title="item.title"
						style="margin-bottom: 5px;"
						@click="matchShowDetail(item)"
						>
						<template slot="title">
							<van-row gutter="3" class="van-hairline--bottom">
								<van-col span="14" class="van-ellipsis text-left">承兑人：美的集团财务有限公司</van-col>
								<van-col span="6" style="text-align:right;" class="blue-font">(剩365天)</van-col>
								<van-col span="4">
									<van-tag type="success">优秀</van-tag>
									<van-tag mark type="success" v-if="item.type == 0">优秀</van-tag>
									<van-tag mark type="primary" v-else-if="item.type == 1">良好</van-tag>
									<van-tag mark type="danger" v-else-if="item.type == 2">一般</van-tag>
								</van-col>
								
							</van-row>
							<van-row>
								<van-col span="8" class="black-font">1.512845 <span class="small-font">万元</span></van-col>
								<van-col span="8" class="black-font">2019-03-27</van-col>
								<van-col span="8" class="black-font">2019-07-22 </van-col>
							</van-row>
						</template>
					</van-cell>

				</van-list>

			</van-pull-refresh>
				</div>
				
			</van-collapse-item>
			<!-- <van-collapse-item class="text-left" title="已完成" name="2">
				
			</van-collapse-item> -->
		</van-collapse>
		<OrderDetail 
		:showState = 'detailModelState'
		@ok= 'detailModelOk'
		@close= 'detailModelClose'
		:initData = 'detailItem'
		/>
	</div>
</template>

<script>
	import OrderDetail from '@/components/OrderDetail'
	export default{
		name: 'Order',
		components: {OrderDetail},
		data(){
			return {
				title: '订单',
				searchValue: '',
				activeName: '1',
				detailModelState: false,
				detailItem: '',
				matchState: {
					finished: false,//是否已经加载完成
					isLoading: false,
					loading: false
				},
				matchList: [
					{},{}
				]
			}
		},
		methods:{
			onClickRight(){
				      this.$router.push({path: '/home/ticketHolder/fbpj'})
			},
			onSearch(){

			},
			matchGetData(){

			},
			detailModelClose(){
				//详情关闭
				this.detailModelState = false;
			},
			detailModelOk(){
				//详情确认 关闭
				this.detailModelState = false;
			},
			matchShowDetail(item){
				this.detailItem = item;
				this.detailModelState = true;
			},
			matchOnRefresh(){
				//获取列表数据
				setTimeout(() => {
					this.matchState.isLoading = false;
				}, 500);
			},
			matchOnLoad(){
				this.matchState.loading = true;//处于加载状态，不触发onLoad
			      // 异步更新数据
			      setTimeout(() => {
			      	for (let i = 0; i < 10; i++) {
			      		this.matchList.push({});
			      	}
			        // 加载状态结束
			        this.matchState.loading = false;

			        // 数据全部加载完成
			        if (this.matchList.length >= 40) {
			        	this.matchState.finished = true;
			        }
			    }, 1000);
			}
		}
	}
</script>

<style>
.orderPage .van-collapse-item__content{
	background-color: #f5f5f5;
	padding-left: 0;
	padding-right: 0;
	padding-top: 0px;
}

.orderPage .ticket-search{
	position: fixed;
	left: 0;
	top: 45px;
	width: 100%;
	height: 50px;
	z-index: 5;
}	
.orderPage .ticket-content-list{
	margin-top: 60px;
	padding-bottom: 50px;
	background: #f5f5f5;
}
</style>
