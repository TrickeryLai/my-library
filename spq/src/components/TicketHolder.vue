<template>
	<div class="ticketHolder">
		<van-nav-bar
		:title="title"
		right-text="发布"
		fixed
		@click-right="onClickRight"
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
			<van-collapse-item class="text-left" title="已发布" name="1">
				<div style="max-height: 350px;overflow:auto">
					<van-pull-refresh 
					v-model="fbListState.isLoading" 
					@refresh="fbOnRefresh">
						<van-list
						v-model="fbListState.loading"
						:finished="fbListState.finished"
						finished-text="没有了"
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
								<van-tag round  type="success" v-if="item.cpStatus == 1">发布中</van-tag>
								<van-tag round type="danger" v-else-if="item.cpStatus == 2">已成交</van-tag>
								<van-tag round v-else-if="item.cpStatus == 3">已注销</van-tag>
							</van-col>
						</van-row>
						<van-row>
							<van-col span="18"><span class="text-left">票面金额：</span>{{item.cpAmount/10000}} <span class="small-font">万元</span></van-col>
							<van-col span="6" class="blue-font">(剩{{getLastTime(item.dueDate)}}天)</van-col>
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
			<!-- <van-collapse-item class="text-left" title="暂存中" name="2">
				
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
				console.log('搜索')
			},
			fbGetData(data = {}){
				//获取已发布的票据列表
				this.fbListState.loading = true;//处于加载状态，不触发onLoad
				let _this = this;
				let pageData = Object.assign({}, this.fbPageInfo);
				let initData = {
					faceValue_id: '',//票据金额 underThound 10万以下  thoundToOneMillion 10-100万  moreOneMillion  100万以上   moreFiveMillion  500万以上 
					faceValueMin: '',
					faceValueMax: '',
					remainingDays_id: '',//剩余天数 lessThanNinety 90天内   ninetyToHundredEighty 90-180天   hundredEightyToThreeHundredsixty 180-360天
					daysMin:'',
					daysMax: '',
					flaw_id:'',//瑕疵  Y 有   N 无
					credit_id: '',//excellent 优秀   well 良好 ordinary 一般
					pageSize: pageData.pageSize,
					pageNum: pageData.pageNum,
					dueDateSort: '',
					createTimeSort: '',
					amountSort: ''
				};
				if(pageData.pageNum == 1){
					this.fbList = [];//不清空，在滚动至多页的时候，重新刷新会一直触发onload
				}
				//查询条件
				// data = Object.assign({}, initData);
				data = pageData;
				//获取列表数据
				_server.getCommercialPaperList({
					data, 
					success(response){
						if(response.code === 0){
							if(_this.fbPageInfo.pageNum > 1){
								response.list.forEach((item) => {
									_this.fbList.push(item);
								});
							}else{
								_this.fbList = response.list;
							}
				          //数据全部加载完成
				          if (_this.fbList.length >= response.pageInfo.total) {
				          	_this.fbListState.finished = true;
				          }else{
				          	_this.fbListState.finished = false;
				          }
				      	
					      _this.fbListState.loading = false;
					      _this.fbListState.isLoading = false;	
						}
					}		
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
