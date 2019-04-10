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
								<i class="iconfont icon-arrowup" :class="{'rant-active': sortState.amountSort === 0}" name="arrow-up" />
								<i class="iconfont icon-arrowdownb" :class="{'rant-active': (sortState.amountSort === 1)}" name="arrow-down" />
							</span>
						</div>
					</van-col>
					<van-col span="8" >
						<div @click="sortPublish">
							发布时间
							<span class="rant-arrow">
								<i class="iconfont icon-arrowup" :class="{'rant-active': sortState.createTimeSort === 0}" name="arrow-up" />
								<i class="iconfont icon-arrowdownb" :class="{'rant-active': sortState.createTimeSort === 1}" name="arrow-down" />
							</span>
						</div>
					</van-col>
					<van-col span="8">
						<div @click="sortEndTime">
							到期日
							<span class="rant-arrow" >
								<i class="iconfont icon-arrowup" :class="{'rant-active': sortState.dueDateSort === 0}" name="arrow-up" />
								<i class="iconfont icon-arrowdownb" :class="{'rant-active': sortState.dueDateSort === 1}" name="arrow-down" />
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
          			:offset=20
					@load="onLoad"
					>
					<van-cell
					v-for="(item,index) in list"
					:key="index"
					:title="index"
					style="margin-bottom: 5px;"
					@click="showDetail(item)"
					>
					<template slot="title">
						<van-row gutter="3" class="van-hairline--bottom">
							<van-col span="14" class="van-ellipsis text-left">承兑人：{{item.acceptor}}</van-col>
							<van-col span="6" style="text-align:right;" class="blue-font">(剩{{getLastTime(item.dueDate)}}天)</van-col>
							<van-col span="4">
								<van-tag mark type="success" v-if="item.creditRating == 1">优秀</van-tag>
								<van-tag mark type="primary" v-else-if="item.creditRating == 2">良好</van-tag>
								<van-tag mark type="danger" v-else-if="item.creditRating == 3">一般</van-tag>
							</van-col>

						</van-row>
						<van-row>
							<van-col span="8" class="black-font">{{item.cpAmount/10000}} <span class="small-font">万元</span></van-col>
							<van-col span="8" class="black-font">{{spliceTime(item.createTime)}}</van-col>
							<van-col span="8" class="black-font">{{item.dueDate}}</van-col>
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
:item = 'currentItemInfo'
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
import _common from '@/server/index'

 //  Field Type Comment
 //  cp_id bigint(20) NOT NULL 序号
 //  cp_no varchar(30) NOT NULL 票据号码
 //  acceptor varchar(20) NOT NULL 承兑人
 //  cp_amount decimal(18,2) NOT NULL 票面金额
 //  endorse_times int(11) NOT NULL 背书次数
 //  due_date date NOT NULL 到期日
 //  is_defect char(1) NULL 有无瑕疵:0-无瑕疵,1-有瑕疵
 //  cp_defect varchar(255) NOT NULL 票据瑕疵
 //  approval_apr decimal(18,8) NULL 年利率
 //  deduct_amount decimal(18,2) NULL 每十万扣款
 //  turn_volume decimal(18,2) NOT NULL 成交金额（发布金额）
 // cp_status char(2) NOT NULL 票据状态：01-发布；02-成交；03-注销
 //  actual_company_id bigint(20) NULL 实际成交企业信息表序号
 //  actual_amount decimal(18,2) NULL 实际成交金额
 //  actual_time datetime NULL 实际成交时间
 //  front_bill_img varchar(60) NULL 正面票据
 //  back_bill_img varchar(60) NULL 反面票据
 //  create_time datetime NULL 创建时间
 //  create_by varchar(64) NULL 创建人员
 //  update_time datetime NOT NULL 最后更新时间
 //  update_by varchar(64) NULL 最后更新人员
 //  update_platform char(2) NULL 最后更新平台：01-管理台；02-企业端
 export default {
 	name: 'BillHall',
 	components: {
 		SetSearch,
 		DetailList,
 	},
 	data() {
 		return {
 			title: '票据大厅',
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
      // 0是asc   1是desc
      sortState: {
          dueDateSort: '',//到期时间排序
          amountSort: '',//金额排序
          createTimeSort: '',//发布时间排序
      },
      pageData: {
      pageNum: 0,
        pageSize: 10,
        total: 0,
      },
      list: []
		}
	},
	methods: {
		onClickRight(){
			this.searchModelState = true;
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
		searchModelClose(data){
			this.searchModelState = false;
		},
		detailModelClose(){
			this.detailModelState = false;
		},
		getData(data, callback){
		  if(this.isGetData){
		    return;
      }
      this.isGetData = true;
			this.loading = true;//处于加载状态，不触发onLoad
			let _this = this;
			let pageData = Object.assign({}, this.pageData);
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
				dueDateSort: this.sortState.dueDateSort,
				createTimeSort: this.sortState.createTimeSort,
				amountSort: this.sortState.amountSort
			};
			if(this.pageData.pageNum == 1){
				this.list = [];//不清空，在滚动至多页的时候，重新刷新会一直触发onload
			}
			//查询条件
			data = Object.assign({}, initData, data);
			//获取列表数据
			_server.getBusinessTickets(data, (response) =>{
        this.isGetData = false;
        this.loading = false;
        this.isLoading = false;
				if(response.code == 0){
		          if(this.pageData.pageNum > 1){
		            response.list.forEach((item) => {
		              this.list.push(item);
		            });
		          }else{
		            this.list = response.list;
		            
		          }
		          //数据全部加载完成
		          if (this.list.length >= response.pageInfo.total) {
		            this.finished = true;
		          }else{
		            this.finished = false;
		          }
				}
			})
		},
		onRefresh(){
			//获取列表
			this.pageData.pageNum = 1;
			this.getData(this.searchData);	
		},
		onLoad() {
      this.pageData.pageNum = this.pageData.pageNum + 1;
      this.getData(this.searchData)
		},
		sortTotal(type){
			let value,
				obj = Object.assign({}, this.sortState);
			let searchData = Object.assign({}, this.searchData);
			switch(type){
				case 1:
				value = 'amountSort';
				break;
				case 2:
				value = 'createTimeSort';
				break;
				case 3:
				value = 'dueDateSort';
				break;
			}
			this.sortState = {
		      dueDateSort: '',//到期时间排序
		      amountSort: '',//金额排序
		      createTimeSort: '',//发布时间排序
			};
			if(obj[value]){
				this.sortState[value] = 0;
			}else{
				this.sortState[value] = 1;
			}

	      	this.pageData.pageNum = 1;
      		this.getData(searchData);
		},
		sortAmount(){
			this.sortTotal(1);
		},
	  	sortPublish(){
	  		this.sortTotal(2);
		  },
		sortEndTime(){
			this.sortTotal(3);
		},
		//点击列表详情
		showDetail(item){
			let _this = this;
			this.currentItemInfo = item;
			_server.getBusinessTicketDetail({
				_id: item.cpId,
				success(res){
				  if(res.code == 0){
		            _this.detailItem = res.data;
		            _this.detailModelState = true;
		          }
				}
			});
		},
		detailModelOk(){
			//详情框--我要买，确认之后，从新请求数据
			this.pageData.pageNum = 1;//重新从第一页开始
			this.getData(this.searchData);
		},
		modelOk(data){
			let searchData = {
				faceValue_id: data.amountChosed.val?data.amountChosed.val: '',
				faceValueMin: data.amountChosed.min ? parseFloat(data.amountChosed.min*10000) : '',
				faceValueMax: data.amountChosed.max ? parseFloat(data.amountChosed.max*10000) : '',
				remainingDays_id: data.dayChoose.val?data.dayChoose.val: '',
				daysMax: data.dayChoose.max ? parseFloat(data.dayChoose.max) : '',
				daysMin: data.dayChoose.min ? parseFloat(data.dayChoose.min) : '',
				flaw_id: data.isPerfect.val,
				credit_id: data.dealChoose.val
			};
			this.searchData = searchData;
			//重新获取数据，清除状态
			this.pageData.pageNum = 1;
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
		color: #1989fa;
	}
	</style>
