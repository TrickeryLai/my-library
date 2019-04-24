<template>
	<div class="ticketHolder">
		<van-nav-bar
		fixed
		@click-right="onClickRight"
		class="top-bg"
		>
			<span slot="title" class="top-bg-title">{{title}}</span>
			<span slot="right" class="top-bg-title">发布</span>
		</van-nav-bar>
		<div class="ticket-search">
			<van-search
			style="position:absolute;left: 0;top: 0;width: 100%;"
			placeholder="请输入承兑人搜索"
			v-model="searchValue"
			@search="onSearch"
			>
			<i class="iconfont icon-search" slot="left-icon"></i>
		</van-search>
	</div>
	
	<van-collapse class="ticket-content-list" v-model="activeName" accordion>
		<van-collapse-item class="text-left" title="已发布" name="1">
			<div style="max-height: 350px;overflow:auto;border: 1px solid #ccc;">
				<van-pull-refresh 
				v-model="fbListState.isLoading" 
				@refresh="fbOnRefresh">
				<van-list
				v-model="fbListState.loading"
				:finished="fbListState.finished"
				finished-text="没有了"
				:error.sync="error"
				error-text="请求失败，点击重新加载"
				:offset="10"
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
						<van-col span="18" class="van-ellipsis text-left">承兑人：{{item.acceptor}}</van-col>
						<van-col span="6">
							<div>
								<div v-if="item.cpStatus == 1 || item.cpStatus == 4">
									<van-tag round v-if="getLastTime(item.dueDate) < 0">
										已过期
									</van-tag>
									<van-tag round type="success" v-else-if="item.cpStatus == 1">
										审核中
									</van-tag>
									<van-tag round color="#f2826a" v-else-if="item.cpStatus == 4">
										报价中
									</van-tag>
									<van-tag round v-else-if="item.cpStatus == 5">
										审核失败
									</van-tag>
								</div>
								<van-tag round type="danger" v-else-if="item.cpStatus == 2">成交中</van-tag>
								<van-tag round color="#1989fa" v-else-if="item.cpStatus == 6">已成交</van-tag>
								<van-tag round v-else-if="item.cpStatus == 3">已注销</van-tag>
							</div>
						</van-col>
					</van-row>
					<van-row>
						<van-col span="18">
							<span class="text-left">票面金额：</span>
							<span v-if="item.cpAmount > 10000">
								{{item.cpAmount　&& (item.cpAmount/10000).toFixed(2)}} 
								<span class="small-font">万元</span>
							</span>
							<span v-else>
								{{item.cpAmount　&& (item.cpAmount).toFixed(2)}} 
								<span class="small-font">元</span>
							</span>
							
						</van-col>
						<van-col span="6" class="blue-font">
							<span v-if="getLastTime(item.dueDate) < 0">(已过期)</span>
							<span v-else>
								(剩{{getLastTime(item.dueDate)}}天)
							</span>
						</van-col>
					</van-row>
					<van-row>
						<van-col span="12">发布日期：{{spliceTime(item.createTime)}}</van-col>
						<van-col span="12">到期日：{{item.dueDate}}</van-col>
					</van-row>
				</template>
			</van-cell>

		</van-list>

	</van-pull-refresh>
</div>

</van-collapse-item>
			<!-- <van-collapse-item class="text-left" title="已发布" name="2">
				
			</van-collapse-item> -->
		</van-collapse>
		<TicketHolderListDetail 
		:showState = 'fbListState.detailModelState'
		@ok= 'detailModelOk'
		@refresh='refreshFn'
		@close= 'detailModelClose'
		:initData = 'fbListState.detailItem'
		:item = 'fbListState.currentItem'
		/>
	</div>
</template>

<script>
import _server from '@/server/server'
import _common from '@/server/index'
import TicketHolderListDetail from '@/components/TicketHolderListDetail'
export default{
	name: 'TicketHolder',
	components:{TicketHolderListDetail},
	data(){
		return {
			title: '票方',
			searchValue: '',
			activeName: '1',
			error: false,
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
		methods:{
			onClickRight(){
				this.$router.push({path: '/home/ticketHolder/fbpj'});
			},
			spliceTime(item){
				if(!item){
					return;
				}
				return item.substr(0,10);
			},
			getLastTime(endTime){
				return _common.common_fn.getLastTime(endTime);
			},
			onSearch(){
				this.fbPageInfo.pageNum = 1;
				this.fbGetData();
			},
			fbGetData(data = {}){
				//获取已发布的票据列表
				this.fbListState.loading = true;//处于加载状态，不触发onLoad
				let _this = this;
				let pageData = Object.assign({}, this.fbPageInfo);
				if(pageData.pageNum == 1){
					this.fbList = [];//不清空，在滚动至多页的时候，重新刷新会一直触发onload
				}
				//查询条件
				data = Object.assign({}, pageData, {acceptor: this.searchValue, createTimeSort: 0});
				delete data.total;
				//获取列表数据
				_server.getCommercialPaperList({
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
				})
			},
			fbOnRefresh(){
				//获取列表数据
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
				this.fbListState.detailModelState = false;
			}

		}
	}
	</script>

	<style>
	.ticketHolder .van-collapse-item__content{
		background-color: #f5f5f5;
		padding-left: 0;
		padding-right: 0;
		padding-top: 0px;
	}
	.ticketHolder .ticket-search{
		position: fixed;
		left: 0;
		top: 45px;
		width: 100%;
		height: 50px;
		z-index: 5;
	}	
	.ticketHolder .ticket-content-list{
		margin-top: 60px;
		padding-bottom: 50px;
		background: #f5f5f5;
	}
	</style>
