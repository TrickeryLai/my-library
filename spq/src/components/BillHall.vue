<template>
	<div>
		<van-nav-bar
		fixed
		@click-right="onClickRight"
		class="top-bg"
		style="background: #fff;"
		>	
			<img :src="logoImg" slot="left" style="width:70px;height: 45px;vertical-align:-30px;">
			<span slot="title" class="top-bg-title">{{title}}</span>
			<span slot="right" class="top-bg-title">我要发布</span>
		</van-nav-bar>
		<div class="list-wrap">
			<van-row class="nav-top">
				<div class="top-search-box">
				<van-col span="7">
					<div @click="sortPublish">
							发布时间
						<span class="rant-arrow">
							<i 
							class="iconfont icon-arrowup" :class="{'rant-active': sortState.createTimeSort === 0}"
							name="arrow-up"/>
							<i class="iconfont icon-arrowdownb" :class="{'rant-active': sortState.createTimeSort === 1}"
							name="arrow-down"/>
						</span>
					</div>
				</van-col>
				<van-col span="7">
					<div @click="sortEndTime">
							到期日
						<span class="rant-arrow">
							<i class="iconfont icon-arrowup" :class="{'rant-active': sortState.dueDateSort === 0}" name="arrow-up"/>
							<i class="iconfont icon-arrowdownb" :class="{'rant-active': sortState.dueDateSort === 1}"
							name="arrow-down"/>
						</span>
					</div>
				</van-col>
				<van-col span="7">
					<div @click="sortAmount">
						票面金额
						<span class="rant-arrow">
							<i 
							class="iconfont icon-arrowup" 
							:class="{'rant-active': sortState.amountSort === 0}" 
							name="arrow-up"/>
							<i 
							class="iconfont icon-arrowdownb" 
							:class="{'rant-active': (sortState.amountSort === 1)}"
							name="arrow-down"/>
						</span>
					</div>
				</van-col>
				<van-col span="3">
					<div @click="serachClick" style="margin-left: -13px;font-weight:bold;" class="base-font-color">
							筛选
					</div>
				</van-col>
			</div>
		</van-row>
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

								<div @click="showDetail(item)" style="position: absolute;right:15px;top: 40px;z-index: 10;">
									<van-button class="baseBtn" size="small">我要买</van-button>
								</div>
										
								<van-row class="van-hairline--bottom text-left">
									<van-col span="24" class="van-ellipsis">
										承兑人：{{item.acceptor}}
									</van-col>
								</van-row>
								<van-row class="van-hairline--bottom text-left">
									<van-col span="24">
										票面金额：
										<span v-if="item.cpAmount > 10000" class="black-font text-left">
											<span class="price-txt">
												{{item.cpAmount && dealPrice((item.cpAmount/10000).toFixed(2))}}
											</span>
											<span class="small-font">万元</span>
										</span>
										<span v-else class="black-font text-left">
											<span  class="price-txt">{{item.cpAmount && dealPrice((item.cpAmount).toFixed(2))}}
											</span>
											<span class="small-font">元</span>
										</span>
									</van-col>
								</van-row>
								<van-row class="van-hairline--bottom text-left">
									<van-col span="24">
										年化利率：
										<span class="black-font">
											{{item.approvalApr && (item.approvalApr-0).toFixed(4)}}%
										</span>
									</van-col>
								</van-row>
								<van-row class="van-hairline--bottom text-left">
									<van-col span="24">
										每十万收益：
										<span class="black-font">
											{{item.deductAmount && dealPrice((item.deductAmount).toFixed(2))}}元
										</span>
									</van-col>
								</van-row>
								<van-row class="van-hairline--bottom text-left">
									<van-col span="24">
										转让金额：
										<span v-if="item.turnVolume > 10000" class="black-font text-left">
											<span class="price-txt">
												{{item.turnVolume && dealPrice((item.turnVolume/10000).toFixed(2))}}
											</span>
											<span class="small-font">万元</span>
										</span>
										<span v-else class="black-font text-left">
											<span  class="price-txt">{{item.turnVolume && dealPrice((item.turnVolume).toFixed(2))}}
											</span>
											<span class="small-font">元</span>
										</span>
									</van-col>
								</van-row>
								<van-row class="van-hairline--bottom text-left">
									<van-col span="24">
										发布时间：
										<span class="black-font">{{commonFn.formatterTime(new Date(item.createTime.replace(/-/g, "/")), 'yyyy年MM月dd日')}}</span>
									</van-col>
								</van-row>
								<van-row class="van-hairline--bottom text-left">
									<van-col span="24">
										到期时间：
										<span>
											<span class="black-font">
												{{commonFn.formatterTime(new Date(item.dueDate.replace(/-/g, "/")), 'yyyy年MM月dd日')}}
											</span>
											<span style="text-align:right;" class="blue-font">(剩{{getLastTime(item.dueDate)}}天)
											</span>
										</span>
									</van-col>
								</van-row>
								<van-row class="van-hairline--bottom text-left">
									<van-col span="24">
										评级：
										<span>
											<van-rate
												style="display: inline-block;vertical-align: -3px;"
												allow-half
												readonly
												color="#f44"
												void-icon="star"
												void-color="#eee"
												v-model="item.creditRating"
											></van-rate>
										</span>
									</van-col>
								</van-row>
						</template>
					</van-cell>
				</van-list>
			</van-pull-refresh>
			</div>
			
	</div>
</div>
<DetailList
:showState='detailModelState'
@ok='detailModelOk'
@close='detailModelClose'
:initData='detailItem'
:item='currentItemInfo'
/>
<SetSearch
:showState='searchModelState'
@ok='modelOk'
@close='modelClose'
/>
</div>
</template>

<script>
import SetSearch from '@/components/SetSearch'
import DetailList from '@/components/DetailList'
import _server from '@/server/server'
import _common from '@/server/index'

import logoImg from '@/assets/logo.jpg'


//01-待发布；02-成交中；03-注销;04-发布中;05-审核失败;06-已成交;
//待发布-----审核>发布中-----撮合>成交中------收取费用>已成交

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
  			scrollH:{
  				height: '400px'
  			},
  			logoImg: logoImg,
  			title: '票据库',
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
		onClickRight() {
			this.$router.push({path: '/home/ticketHolder/fbpj'});
		},
      	getHeight(){
        	var scrollH = window.screen.height;

        	this.scrollH.height = scrollH - 200 + 'px';
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
	        let initData = {
	          faceValue_id: '',//票据金额 underThound 10万以下  thoundToOneMillion 10-100万  moreOneMillion  100万以上   moreFiveMillion  500万以上
	          faceValueMin: '',
	          faceValueMax: '',
	          remainingDays_id: '',//剩余天数 lessThanNinety 90天内   ninetyToHundredEighty 90-180天   hundredEightyToThreeHundredsixty 180-360天
	          daysMin: '',
	          daysMax: '',
	          flaw_id: '',//瑕疵  Y 有   N 无
	          credit_id: '',//excellent 优秀   well 良好 ordinary 一般
	          pageSize: pageData.pageSize,
	          pageNum: pageData.pageNum,
	          dueDateSort: this.sortState.dueDateSort,
	          createTimeSort: this.sortState.createTimeSort,
	          amountSort: this.sortState.amountSort,
	          onlyShow: '' ,
	          cpStatus: '',//票据状态
	 	 	};
	      	if (this.pageData.pageNum == 1) {
	      		this.list = [];//不清空，在滚动至多页的时候，重新刷新会一直触发onload
	      	}
	      	
	        //查询条件
	        data = Object.assign({}, initData, data);
	        let url;
	        if(localStorage.getItem('loginData')){
	        	url = '/businessTickets/queryBussinessTickets';
	        }else{
	        	url = false;
	        }

	        //获取列表数据
	        _server.getBusinessTickets(data, url).then((response) => {
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
    sortTotal(type) {
    	let value,
    	obj = Object.assign({}, this.sortState);
    	let searchData = Object.assign({}, this.searchData);
    	switch (type) {
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
      if (obj[value]) {
      	this.sortState[value] = 0;
      } else {
      	this.sortState[value] = 1;
      }

      this.pageData.pageNum = 1;
      this.getData(searchData);
  	},
  	sortAmount() {
  		this.sortTotal(1);
  	},
  	sortPublish() {
  		this.sortTotal(2);
  	},
  	sortEndTime() {
  		this.sortTotal(3);
  	},
      //点击列表详情
  	showDetail(item) {
      	this.loading = true;
      	let _this = this;
      	this.currentItemInfo = item;
      	_server.getBusinessTicketDetail({
      		_id: item.cpId,
      		success(res) {
      			if (res.code == 0) {
      				//强制修改状态为发布中
      				res.data.cpStatus = '04';
      				_this.detailItem = res.data;
      				_this.detailModelState = true;
      				_this.$noScroll();
      			}
      		}
      	});
      },
  	detailModelOk() {
        //详情框--我要买，确认之后，从新请求数据
        this.pageData.pageNum = 1;//重新从第一页开始
        this.getData(this.searchData);
    },
    modelOk(data) {
    	this.$canScroll();
    	this.isGetingData = false;
    	let searchData = {
    		faceValue_id: data.amountChosed.val ? data.amountChosed.val : '',
    		faceValueMin: data.amountChosed.min ? ((data.amountChosed.min == 100 || data.amountChosed.min == 500) ? parseFloat(data.amountChosed.min * 10000) + 0.00001 : parseFloat(data.amountChosed.min * 10000)) : '',
    		faceValueMax: data.amountChosed.max ? parseFloat(data.amountChosed.max * 10000) : '',
    		remainingDays_id: data.dayChoose.val ? data.dayChoose.val : '',
    		daysMax: data.dayChoose.max ? parseFloat(data.dayChoose.max) : '',
    		daysMin: data.dayChoose.min ? parseFloat(data.dayChoose.min) : '',
    		flaw_id: data.isPerfect.val,
    		credit_id: data.dealChoose.val,
    		cpStatus: data.cpStatus.val ?  data.cpStatus.val: '',
    		acceptor: data.acceptor ? data.acceptor : '' ,
    		startDate: data.startDate ? data.startDate : '', 
    		endDate: data.endDate ? data.endDate : '',
    		cpNo: data.cpNo ? data.cpNo : '' ,
    		whiteListFlag: data.whiteListFlag ? data.whiteListFlag : '',
          // onlyShow: data.onlyShow
      	};
      	this.searchData = searchData;
        //重新获取数据，清除状态
        this.pageData.pageNum = 1;
        this.getData(searchData);
    },
    modelClose() {
    	this.$canScroll();
    	this.searchModelState = false;
    	this.loading = false;
    }
}
}
</script>

<style scoped>
.top-search-box{
	position:absolute;
	left:0;
	top:0;
	width: 100%;
	background:#fff;
	padding: 10px 0;
	border-bottom: 1px solid #ccc;
}
.icon-arrowdownb:before {
	content: "\E6CE";
	position: absolute;
	top: -4px;
	left: 0;
}

.icon-arrowup:before {
	content: "\E6B4";
	position: absolute;
	top: -12px;
	left: 0;
}
.list-wrap {
	padding-top: 38px;
	background: #f5f5f5;
	overflow: hidden;
}

.nav-top {
	position: fixed;
	left: 0;
	top: 45px;
	padding: 10px 0;
	background: #fff;
	width: 100%;
	z-index: 2;
}

.rant-arrow {
	text-align: left;
	display: inline-block;
	width: 10px;
	vertical-align: middle;
	position: relative;
}

.rant-arrow i {
	font-size: 10px;
	font-weight: bolder;
	transform: scale(0.8);
	float: left;
	width: 100%;
}

</style>
