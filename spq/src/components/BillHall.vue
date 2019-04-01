<template>
	<div>
		<van-nav-bar
		:title="title"
		right-text="筛选"
		fixed
		@click-right="onClickRight"
		class="top-bg"
		/>
		
		<div class="list-wrap">
			<van-row class="nav-top">
				<div style="position:absolute;left:0;top:0;width: 100%;background:#fff;padding: 10px 0;">
					<van-col span="8">
						<div @click="sortAmount">
								票面金额
							<span class="rant-arrow" >
								<i class="iconfont icon-arrowup" :class="{'rant-active': sortState.amount === 0}" name="arrow-up" />
								<i class="iconfont icon-arrowdownb" :class="{'rant-active': (sortState.amount === 1)}" name="arrow-down" />
							</span>
						</div>
					</van-col>
					<van-col span="8" >
						<div @click="sortPublish">
							发布时间
							<span class="rant-arrow">
								<i class="iconfont icon-arrowup" :class="{'rant-active': sortState.publish === 0}" name="arrow-up" />
								<i class="iconfont icon-arrowdownb" :class="{'rant-active': sortState.publish === 1}" name="arrow-down" />
							</span>
						</div>
					</van-col>
					<van-col span="8">
						<div @click="sortEndTime">
							到期日
							<span class="rant-arrow" >
								<i class="iconfont icon-arrowup" :class="{'rant-active': sortState.endTime === 0}" name="arrow-up" />
								<i class="iconfont icon-arrowdownb" :class="{'rant-active': sortState.endTime === 1}" name="arrow-down" />
							</span>
						</div>
					</van-col>
				</div>
			</van-row>
			<div style="margin-top: 5px;padding-bottom:50px;">
				<van-pull-refresh v-model="isLoading" @refresh="onRefresh">

					<van-list
					v-model="loading"
					:finished="finished"
					finished-text="没有更多了"
					:error.sync="error"
				 	error-text="请求失败，点击重新加载"
					@load="onLoad"
					>
					<van-cell
					v-for="item in list"
					:key="item"
					:title="item"
					style="margin-bottom: 5px;"
					@click="showDetail(item)"
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
		</div>
		<DetailList 
			:showState = 'detailModelState'
			@ok= 'detailModelOk'
			@close= 'detailModelClose'
			:initData = 'detailItem'
		 />	
		 <SetSearch 
			:showState = 'searchModelState'
			@ok= 'modelOk'
			@close= 'modelClose'
		 />	
	</div>
</template>

<script>
	import SetSearch from '@/components/SetSearch'
	import DetailList from '@/components/DetailList'
	import _server from '@/server/server'

	export default {
		name: 'BillHall',
		components: {
			'SetSearch': SetSearch,
			'DetailList': DetailList,
		},
		data() {
			return {
				title: '票据大厅',
				finished: false,//是否已经加载完成
				error: false,
				isLoading: false,
				loading: false,
				detailModelState: false,//详情框状态
				detailItem: {},//详情项
				searchModelState: false,//筛选弹出框状态
				searchData: '',//搜索条件
				sortState: {
					endTime: 999,//到期时间排序
					amount: 999,//金额排序
					publish: 999,//发布时间排序
				},
				pageData: {
					num: 1,
					size: 10
				},
				list: [
					1,2,3,4,5,6,7
				]
			}
		},
		computed:{
		},
		created(){
			this.getData();
		},
		methods: {
			onClickRight(){
				this.searchModelState = true;
			},
			searchModelClose(data){
				this.searchModelState = false;
			},
			detailModelClose(){
				this.detailModelState = false;
			},
			getData(data){

				let initData = {
					faceValue_id: '',//票据金额 underThound 10万以下  thoundToOneMillion 10-100万  moreOneMillion  100万以上   moreFiveMillion  500万以上 
					faceValueMin: '',
					faceValueMax: '',
					remainingDays_id: '',//剩余天数 lessThanNinety 90天内   ninetyToHundredEighty 90-180天   hundredEightyToThreeHundredsixty 180-360天
					daysMin:'',
					daysMax: '',
					flaw_id:'',//瑕疵  Y 有   N 无
					credit_id: '',//excellent 优秀   well 良好 ordinary 一般
					pageSize: this.pageData.size,
					pageNum:this.pageData.num,
				};

				data = Object.assign({}, initData, data);
				//获取列表数据
				_server.getBusinessTickets(data, (response) =>{

				})
			},
			onRefresh(){
				//获取列表数据
				setTimeout(() => {
					this.isLoading = false;
				}, 500);
				this.getData();
				
			},
			onLoad() {
					this.loading = true;//处于加载状态，不触发onLoad
			      // 异步更新数据
			      setTimeout(() => {
			      	for (let i = 0; i < 10; i++) {
			      		this.list.push(this.list.length + 1);
			      	}
			        // 加载状态结束
			        this.loading = false;

			        // 数据全部加载完成
			        if (this.list.length >= 40) {
			        	this.finished = true;
			        }
			    }, 1000);
			},

			triggleValue(value){
				if(value === 0){
					return 1;
				}
				return 0;
			},
			sortAmount(){
				let amount = this.sortState.amount;
				if(amount == 999){
					this.sortState.amount = 0;
				}else{
					this.sortState.amount = this.triggleValue(amount);
				}

				this.getData(this.searchData);
			},
			sortPublish(){
				let publish = this.sortState.publish;
				if(publish == 999){
					this.sortState.publish = 0;
				}else{
					this.sortState.publish = this.triggleValue(publish);
				}

				this.getData(this.searchData);
			},
			sortEndTime(){
				let endTime = this.sortState.endTime;
				if(endTime == 999){
					this.sortState.endTime = 0
				}else{
					this.sortState.endTime = this.triggleValue(endTime);
				}

				this.getData(this.searchData);
			},
			//点击列表详情
			showDetail(item){
				let test = Object.create({});
				item = Object.assign(test, {
					user: '美的集团美的集团美的集',
					number: '14514784544148521447112',
					amount: '10万元',
					endTime: '2019-03-21(剩余117天)',
					item: item,
					type: 1,
					isPerfect: 0,
					imgs: ['https://img.yzcdn.cn/1.jpg', 'https://img.yzcdn.cn/1.jpg']
				})
				this.detailItem = item;
				this.detailModelState = true;
			},
			detailModelOk(){
				//详情框确认，从新请求数据
			},
			modelOk(data){
				let searchData = {
					faceValue_id: data.amountChosed.val?data.amountChosed.val: '',
					faceValueMin: data.amountChosed.min ? parseFloat(data.amountChosed.min) : '',
					faceValueMax: data.amountChosed.max ? parseFloat(data.amountChosed.max) : '',
					remainingDays_id: data.dayChoose.val?data.dayChoose.val: '',
					daysMax: data.dayChoose.max ? parseFloat(data.dayChoose.max) : '',
					daysMin: data.dayChoose.min ? parseFloat(data.dayChoose.min) : '',
					flaw_id: data.isPerfect.val,
					credit_id: data.dealChoose.val
				};
				this.searchData = searchData;
				//重新获取数据，清除状态
				this.getData(searchData);
			},
			modelClose(){
				this.searchModelState = false;
			}
		}
	}
</script>

<style scoped>
.icon-arrowdownb:before {
  content: "\E6CE";
  position: absolute;
  top: -2px;
  left: 0;
}
.icon-arrowup:before {
  content: "\E6B4";
  position: absolute;
  top: -12px;
  left: 0;
}
.relative{
	position: relative;
}
.list-wrap{
	padding-top: 30px;
	background: #f5f5f5;
}
.nav-top{
	position: fixed;
	left: 0;
	top: 45px;
	padding: 10px 0;
	background: #fff;
	width: 100%;
	z-index: 2;
}
.rant-arrow{
	text-align: left;
	display:inline-block;
	width: 10px;
	vertical-align: middle;
  position:relative;
}
.rant-arrow i{
	font-size: 10px;
	font-weight: bolder;
	transform: scale(0.8);
	float:left;
	width: 100%;
}
.rant-active{
	color: #f44;
}
</style>
