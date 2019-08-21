<template>
<div class="ticketHolder">
		<!-- <van-nav-bar
		fixed
		@click-right="onClickRight"
		class="top-bg"
		>
			<span slot="title" class="top-bg-title">{{title}}</span>
			<span slot="right" class="top-bg-title">发布</span>
		</van-nav-bar> -->
		<!-- <div class="ticket-search">
			<van-search
			style="position:absolute;left: 0;top: 0;width: 100%;"
			placeholder="请输入承兑人搜索"
			v-model="searchValue"
			@search="onSearch"
			>
				<i class="iconfont icon-search" slot="left-icon"></i>
			</van-search>
		</div> -->
	<van-collapse class="ticket-content-list" v-model="activeName" accordion>
		<van-collapse-item class="text-left" title="待处理" name="1" style="position: relative;overflow-y:scroll;" :style="activeName == 1? collapseStyleH:''" >
			<div style="border: 1px solid #ccc;">
				<van-pull-refresh 
				v-model="fbListState1.isLoading" 
				@refresh="fbOnRefresh"
				>
					<van-list
					v-model="fbListState1.loading"
					:finished="fbListState1.finished"
					finished-text="没有了"
					:error.sync="error1"
					error-text="请求失败，点击重新加载"
					:offset="30"
					@load="fbOnLoad"
					>
						<div v-if ="!fbList1 || fbList1.length <= 0" style="height: 250px;"></div>
						<van-cell
						v-for="(item, index) in fbList1"
						:key="index"
						:title="item.title"
						style="margin-bottom: 5px;box-shadow: 1px 1px 1px 1px #ccc;"
						@click.stop="toDeal(item)"
						>
							<template slot="title">
								<van-row v-if="item.seconds">
									<van-col span="24">
										<CountDown 
											:time="item.seconds"
											@timeEnd="timeEndFn(item)"
										/>
									</van-col>
								</van-row>
								<van-row>
									<van-col span="24">
										<span v-if="item.isAssignBuyer == 'Y'" style="color: #5974d9;font-size: 14px;float: left;margin-right: 5px;display: inline-block;">{{item.buyerCompanyName}}</span>
										<van-tag type="success" v-if="item.isAssignBuyer == 'Y'">指定买家</van-tag>
										<van-tag type="primary" v-else>非指定买家</van-tag>
									</van-col>
								</van-row>
								<van-row>
									<van-col span="18">
										<span class="text-left">票面金额：</span>
										<span v-if="item.cpAmt">
											<span v-if="item.cpAmt > 10000">
												<span class="price-txt">
													{{item.cpAmt&& (item.cpAmt/10000).toFixed(2)}} 
												</span>
												<span class="small-font">万元</span>
											</span>
											<span v-else>
												<span class="price-txt">
													{{item.cpAmt&& (item.cpAmt).toFixed(2)}} 
												</span>
												<span class="small-font">元</span>
											</span>
										</span>
									</van-col>
									<van-col span="6" class="blue-font">
                    					<van-button 
										size="small" 
										v-if="item.buyerOrdStatus == '01' && item.isAssignBuyer == 'Y'"
										style="background:#c00;color: #fff;"
										@click.stop="orderPrice(item)"
										>报价</van-button>

										<van-button 
										size="small"
										@click.stop="electronicContract(item)" 
										style="background:#c00;color: #fff;"
										v-if="item.buyerOrdStatus == '02'">签电子合同</van-button>

										<van-button 
										size="small" 
										style="background:#c00;color: #fff;"
										@click.stop="marginDeposit(item)"
										v-if="item.buyerOrdStatus == '03'">交保证金</van-button>

										<van-button 
										size="small" 
										v-else-if="item.buyerOrdStatus == '05'" 
										style="background:#c00;color: #fff;"
										@click.stop="pay(item)"
										>打款</van-button>

										<van-button 
										size="small" 
										style="background:#c00;color: #fff;"
										@click.stop="signFor(item)"
										v-if="item.buyerOrdStatus == '07'">签收</van-button>

									</van-col>
								</van-row>
								<van-row>
									<van-col span="18">
										<span class="text-left">转让金额：</span>
										<span v-if="item.turnVolume">
											<span v-if="item.turnVolume > 10000">
												<span class="price-txt">
													{{item.turnVolume&& (item.turnVolume/10000).toFixed(2)}} 
												</span>
												<span class="small-font">万元</span>
											</span>
											<span v-else>
												<span class="price-txt">
													{{item.turnVolume&& (item.turnVolume).toFixed(2)}} 
												</span>
												<span class="small-font">元</span>
											</span>
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
									<van-col span="18">
										<span class="text-left">每十万收益：</span>
										<span v-if="item.deductAmount">
											￥{{item.deductAmount && dealPrice((item.deductAmount).toFixed(2))}} 
										</span>
									</van-col>
									<van-col span="6" class="blue-font">
										调整{{item.adjustmentDays}}天
									</van-col>
								</van-row>
								<van-row>
									<van-col span="14">
										<span class="text-left">年化利率：</span>
										<span v-if="item.approvalApr">
											{{item.approvalApr && (item.approvalApr - 0).toFixed(4)}}% 
										</span>
									</van-col>
									<van-col span="10" style="text-align: right;">
										<van-tag type="primary" v-if="item.buyerOrdStatus == '00'">交易完成</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '01'">待买方报价</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '02'">待确认合同</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '03'">待交保证金</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '04'">待卖方交保证金</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '05'">待冻结对价</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '06'">待卖方背书</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '07'">待签收背书</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '08'">等待签凭证</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '09'">待退保证金</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '11'">待卖方确认</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '12'">待卖方签合同</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '44'">卖方已取消</van-tag>
									</van-col>
								</van-row>
								<van-row>
									<van-col span="18">竞价日期：{{formatterTime(item.priceDate)}}</van-col>
								</van-row>
								<van-row>
									<van-col span="18">到期日：{{formatterTime(item.dueDate, 'yyyy年MM月dd')}}</van-col>
									
								</van-row>
								<van-row>
									<van-col span="24">票据号码：{{item.cpNo}}</van-col>
								</van-row>

								<van-row>
									<van-col span="24">
										<van-button 
										v-if="item.buyerOrdStatus == '01' || item.buyerOrdStatus == '02' || item.buyerOrdStatus == '03' || item.buyerOrdStatus == '04' || item.buyerOrdStatus == '05' || item.buyerOrdStatus == '06' || item.buyerOrdStatus == '11' || item.buyerOrdStatus == '12'" 
										size="small"
										@click.stop="cancelOrder(item)" 
										style="width: 100%;background: #c00;color:#fff;"
										>终止订单</van-button>
									</van-col>
								</van-row>
							</template>
						</van-cell>
					</van-list>
				</van-pull-refresh>
			</div>
		</van-collapse-item>
		<van-collapse-item class="text-left" title="已完成" name="2" style="position: relative;overflow-y:scroll;" :style="activeName == 2? collapseStyleH:''" >
			<div style="border: 1px solid #ccc;">
				<van-pull-refresh 
				v-model="fbListState2.isLoading" 
				@refresh="fbOnRefresh"
				>
					<van-list
					v-model="fbListState2.loading"
					:finished="fbListState2.finished"
					finished-text="没有了"
					:error.sync="error2"
					error-text="请求失败，点击重新加载"
					:offset="30"
					@load="fbOnLoad"
					>
						<div v-if ="!fbList2 || fbList2.length <= 0" style="height: 250px;"></div>
						<van-cell
						v-for="(item, index) in fbList2"
						:key="index"
						:title="item.title"
						style="margin-bottom: 5px;box-shadow: 1px 1px 1px 1px #ccc;"
						@click.stop="toDeal(item)"
						>
							<template slot="title" style="position: relative;">
								<van-row>
									<van-col span="24" class="van-ellipsis text-left">买方：{{item.buyerCompanyName}}</van-col>
								</van-row>
								<van-row>
									<van-col span="24">
										<span class="text-left">票面金额：</span>
										<span v-if="item.cpAmt > 10000">
											<span class="price-txt">
												{{item.cpAmt && (item.cpAmt/10000).toFixed(2)}} 
											</span>
											<span class="small-font">万元</span>
										</span>
										<span v-else>
											<span class="price-txt">
												{{item.cpAmt&& (item.cpAmt).toFixed(2)}} 
											</span>
											<span class="small-font">元</span>
										</span>
										
									</van-col>
								</van-row>
								<van-row>
									<van-col span="18">时间：{{item.receiptTime && formatterTime(item.receiptTime)}}</van-col>
									<van-col span="6">
										<van-button 
										style="position: absolute;right: 20px;top: 40px;background:#c00;border-color:#c00;color:#fff;" 
										size="small"
										@click.stop="rateFn(item)"
										v-if="(item.scoredFlag == '1' || item.scoredFlag == '3') && item.buyerOrdStatus == '00'"
										>评价</van-button>
									</van-col>
								</van-row>
								<van-row>
									<van-col span="24">票据号：{{item.cpNo}}</van-col>
								</van-row>
								<van-row>
									<van-col span="18">
										状态：
										<van-tag type="primary" v-if="item.buyerOrdStatus == '00'">交易完成</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '01'">待买方报价</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '02'">待确认合同</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '03'">待交保证金</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '04'">待卖方交保证金</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '05'">待冻结对价</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '06'">待卖方背书</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '07'">待签收背书</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '08'">等待签凭证</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '09'">待退保证金</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '11'">待卖方确认</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '12'">待卖方签合同</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '40'">报价已取消</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '41'">报价已拒绝</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '43'">订单已取消</van-tag>
										<van-tag type="primary" v-else-if="item.buyerOrdStatus == '44'">卖方已取消</van-tag>
									</van-col>
								</van-row>
								<van-row>
									<van-col span="24">
										<van-button 
										v-if="(item.buyerOrdStatus == '40' || item.buyerOrdStatus == '41' || item.buyerOrdStatus == '43') && item.flowStatus != '43'"
										style="width:100%;background: #c00;color:#fff;"
										size="small"
										@click.stop="orderPrice(item)"
										>重新报价</van-button>
									</van-col>
								</van-row>
							</template>
						</van-cell>

					</van-list>

				</van-pull-refresh>
			</div>
		</van-collapse-item>
		</van-collapse>
		<PriceAgain 
		:showState = 'fbListState1.detailModelState'
		@ok= 'detailModelOk'
		@refresh='refreshFn'
		@close= 'detailModelClose'
		:initData = 'fbListState1.detailItem'
		:item = 'fbListState1.currentItem'
		/>
		<PriceAgain 
		:showState = 'fbListState2.detailModelState'
		@ok= 'detailModelOk'
		@refresh='refreshFn'
		@close= 'detailModelClose'
		:initData = 'fbListState2.detailItem'
		:item = 'fbListState2.currentItem'
		/>

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
import _server from '@/server/server';
import _common from '@/server/index';
import PriceAgain from '@/components/PriceAgain';
import PriceList from '@/components/PriceList';
import CountDown from '@/components/CountDown';

export default{
	name: 'Order',
	props:['modelState'],
	components:{PriceAgain, PriceList, CountDown},
	data(){
		return {
			title: '票方',
			searchValue: '',
			activeName: '1',
			priceListShow: false,
			priceListBaseData: [],
			priceType: '',
			error1: false,
			error2: false,
			error3: false,
			collapseStyleH: {
				height: '100%'
			},
			fbListState1:{
				finished: false,//是否已经加载完成
				isLoading: false,
				loading: false,
				currentItem: {},//当前查看详情项
				detailItem: {},//查询的具体信息
				detailModelState: false,//弹窗显示隐藏状态
			},
			fbList1:[],//已发布的票据列表	
			fbPageInfo1:{
				pageNum: 0,
				pageSize: 5,
				total: 0,
				type: '01'
			},
			fbListState2:{
				finished: false,//是否已经加载完成
				isLoading: false,
				loading: false,
				currentItem: {},//当前查看详情项
				detailItem: {},//查询的具体信息
				detailModelState: false,//弹窗显示隐藏状态
			},
			fbList2:[],//已发布的票据列表	
			fbPageInfo2:{
				pageNum: 0,
				pageSize: 5,
				total: 0,
				type: '02'
			},
			fbListState3:{
				finished: false,//是否已经加载完成
				isLoading: false,
				loading: false,
				currentItem: {},//当前查看详情项
				detailItem: {},//查询的具体信息
				detailModelState: false,//弹窗显示隐藏状态
			},
			fbList3:[],//已发布的票据列表	
			fbPageInfo3:{
				pageNum: 0,
				pageSize: 5,
				total: 0,
				type: ''
			},
			}
		},
		watch: {
			modelState(newValue, oldValue) {
				if(!newValue){
					this.detailModelClose();
				}
			},
			activeName(newValue){
				if(newValue){
					this.fbOnRefresh();
					this['fbPageInfo' + newValue].pageNum = 1;
				}
			}
		},
		mounted(){
			// this.fbOnLoad();
		},
		created(){
			this.collapseStyleH.height = parseFloat(window.screen.height) - 300 + 'px';
			console.log('created');
		},
		destoryed(){
			
		},
		beforeRouteEnter(){
			this.collapseStyleH.height = parseFloat(window.screen.height) - 300 + 'px';
			next();
			console.log('beforeRouteEnterTicketHolder');
		},
		beforeRouteLeave(to, from, next){
			if(to.name == 'Login' || to.name == 'RealName' || to.name == 'RealNameChange'){
				next();
				return;
			}
			if(to.name=='Fbpj'){
				next();
				return;
			}
			if(this['fbListState' + this.activeName].detailModelState){
				this['fbListState' + this.activeName].detailModelState = false;
				next(false);
				return;
			}	

			next();
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

			dealPrice(price){
				return _common.common_fn.dealPrice(price);
			},
			formatterTime(time, type = 'yyyy年MM月dd hh:mm:ss'){

				return _common.common_fn.formatterTime(time, type);
			},
			getLastTime(endTime){
				return _common.common_fn.getLastTime(endTime);
			},
			timeEndFn(item){
				item.seconds = 0;
			},
			signFor(item){
				this.$dialog.confirm({
					title:'确认签收',
					message: '<p>票据号码：'+item.cpNo+'</p><p>交易对手：'+item.sellerCompanyName+'</p><p style="color:#000;font-size:16px;">请在网银确认收到票据后，再确认签收票据</p>'
				}).then(() => {
					_server.signFor({ordNo: item.ordNo}).then(response => {
						if(response.code == 0){
	                        if(response.data && response.data.payUrl){
	                            var winRef = window.open('',"_blank");
	                            winRef.location = response.data.payUrl;
	                        }
	                        this.fbGetData();
	                    }else{
	                        this.$toast(response.errMsg)
	                    }
	                }).catch(error => {

					})
				}).catch(error => {

				})
				
			},
			orderPrice(item){
				// 报价
				this['fbListState'+this.activeName].detailModelState = true;
				this['fbListState'+this.activeName].detailItem = item;
				this['fbListState'+this.activeName].currentItem = item;
			},
			priceListClose(){
				//查看所有报价--关闭
				this.priceListShow = false;
			},
			biddingSuccess(){
				//撮合成功
				// this.$emit("refresh");
				this.fbOnRefresh();
				this.priceListClose();
			},

			buyerCoasts(ordNo){
				return new Promise((resolve, reject) => {
					_server.buyerCosts({ordNo: ordNo}).then(res => {
						return resolve(res);
					}).catch(error => {
						return reject(error);
					})
				})
			},

			pay(item){
				this.buyerCoasts(item.ordNo).then(res => {
					if(res.code == 0){
						let data = res.data;
						this.$dialog.confirm({
							title:'确认打款',
							message: '票面金额：'+_common.common_fn.dealPrice((data.cpAmt-0).toFixed(2))+'元<br/>收益：'+_common.common_fn.dealPrice(data.discountInterest)+'元'
						}).then(() => {
							_server.pay({ordNo: item.ordNo}).then(res => {
								if(res.code == 0){
									this.$toast('操作成功！');
									this.fbGetData();
								}else{
									this.$toast(res.errMsg);
								}
							})
						})
					}
				}).catch(error=>{

				})
			},
			electronicContract(item){

				item.$type = '00';
				this.$router.push({path: '/promisePre',query:{
					data: JSON.stringify(item)
				}})
				// this.$dialog.confirm({
				// 	title:'签电子合同',
				// 	message: `确认签电子合同吗？<br/>订单号：${item.ordNo}`,
				// }).then(() =>{
				// 	_server.signEc({ordNo: item.ordNO}).then(res => {
				// 		if(res.code == 0){
				// 			this.$toast('操作成功！');
				// 			this.fbGetData();
				// 		}else{
				// 			this.$toast(res.errMsg);
				// 		}
				// 	})
				// }).catch(()=>{

				// })
			},
			
			marginDeposit(item){
				this.$dialog.confirm({
					title: '交保证金',
					message: `确认交保证金吗？<br/>订单号：${item.ordNo}`
				}).then(()=>{
					_server.payDeposit({ordNo: item.ordNo}).then( res => {
						if(res.code == 0){
							this.$toast('操作成功！');
							this.fbGetData();
						}else{
							this.$toast(res.errMsg);
						}
					}).catch( error => {

					})
				}).catch(error => {

				})
			},

			cancelOrder(item){
				//终止订单
				this.$dialog.confirm({
					title: '确认终止订单',
					// message: '取消发布会影响信用评价,是否确认取消发布?'
					message: '确认取消么？'
				}).then(() => {
					_server.buyerCancel({ordNo: item.ordNo}).then(res => {
						if(res.code == 0){
							this.$toast('操作成功！');
							this.fbGetData();
						}else{
							this.$toast(res.errMsg);
						}
					})
				}).catch(error=>{

				})
				
			},
			publishAgain(item){
				this.$router.push({path: '/home/ticketHolder/fbpj', query: {pjData: JSON.stringify(item)}});
			},
			toDeal(item){
				this.$router.push({path: '/orderNewDetail', query: {data: JSON.stringify(item)}});
			},
			rateFn(item){
				this.$router.push({path: '/home/rate', query:{cpNo: item.ordNo}})
			},
			onSearch(){
				this['fbPageInfo'+this.activeName].pageNum = 1;
				this.fbGetData();
			},

			getDataType(data){
				if(false){
					return new Promise( (resolve, reject) => {
						_server.getCommercialPaperList(data).then(response => {
							return resolve(response);
						}).catch( error => {
							return reject(error);
						})
					})
				}else{
					return new Promise((resolve, reject) => {
						_server.cpOrder(data).then(response => {
							return resolve(response);
						}).catch( error => {
							return reject(error);
						})
					})
				}
			},

			fbGetData(data = {}){
				//获取已发布的票据列表
				this['fbListState'+this.activeName].loading = true;//处于加载状态，不触发onLoad
				let _this = this;
				let pageData = Object.assign({}, this['fbPageInfo'+this.activeName]);
				if(pageData.pageNum == 1){
					this['fbList'+this.activeName] = [];//不清空，在滚动至多页的时候，重新刷新会一直触发onload
				}
				//查询条件
				// data = Object.assign({}, pageData, {acceptor: this['searchValue' + this.activeName], createTimeSort: 0});
				data = Object.assign({}, pageData);
				delete data.total;
				//获取列表数据
				this.getDataType(data).then((response) =>{
					if(response.code == 0){
						this['error'+this.activeName] = false;
						response.list = response.list ? response.list: [];
						if(_this['fbPageInfo' + this.activeName].pageNum > 1){
							response.list.forEach((item) => {
								this['fbList'+this.activeName].push(item);
							});
						}else{
							this['fbList' + this.activeName] = response.list;
						}
				          //数据全部加载完成
				          if (this['fbList' + this.activeName].length >= parseFloat(response.pageInfo.total)) {
				          	this['fbListState' + this.activeName].finished = true;
				          }else{
				          	this['fbListState' + this.activeName].finished = false;
				          }
				      }else{
				      	this['error'+this.activeName] = true;
				      	this['fbPageInfo' + this.activeName].pageNum = 0;
				      	this.$toast(response.errMsg);
				      }
					this['fbListState' + this.activeName].loading = false;
					this['fbListState' + this.activeName].isLoading = false;	
				  })
				.catch((error) => {
					this['fbListState' + this.activeName].isLoading = false;
					this['fbListState' + this.activeName].loading = false;
					this['error' + this.activeName] = true;
					this['fbPageInfo' + this.activeName].pageNum = 0;
				})
			},
			fbOnRefresh(){
				//获取列表数据
				this['fbListState' + this.activeName].finished = false;
				this['fbPageInfo' + this.activeName].pageNum = 1;
				this.fbGetData();
			},
			fbOnLoad(){
				
				if(this['fbListState' + this.activeName].finished){
					return;
				}
				this['fbListState' + this.activeName].loading = true;//处于加载状态，不触发onLoad
				this['fbPageInfo' + this.activeName].pageNum += 1;
				this.fbGetData();
			},
			fbShowDetail(item){
				_server.cpOrderDetail(item.ordNo, '11').then(res => {
					if(res.code == 0){
						this['fbListState' + this.activeName].currentItem = item.data;
						this['fbListState' + this.activeName].detailItem = item;
						this['fbListState' + this.activeName].detailModelState = true;
						this.$noScroll();
						//通知外部窗口关闭
						this.$emit('modelChange', true);
					}else{
						this.$toast(res.errMsg);
					}
				}).catch(error => {

				})

				return;
				let _this = this;
				this['fbListState' + this.activeName].currentItem = item;
				_server.getSelfTicketDetail(
					item.cpId,	
				).then((res) =>{
						if(res.code == 0){
							// _this.fbListState.detailItem = res.data;
							_this['fbListState' + this.activeName].detailItem = item;
							_this['fbListState' + this.activeName].detailModelState = true;
							_this.$noScroll();
							//通知外部窗口关闭
							_this.$emit('modelChange', true);
							
						}
					}).catch(error => {

					})
			},
			detailModelOk(){
				this.detailModelClose();
				this['fbPageInfo' + this.activeName].pageNum = 1;
				this.fbGetData();
				this.$canScroll();
			},
			refreshFn(){
				this.detailModelClose();
				this['fbPageInfo' + this.activeName].pageNum = 1;
				this.fbGetData();
			},
			detailModelClose(){
				this['fbListState' + this.activeName].detailModelState = false;
				this.$canScroll();

				//通知外部窗口关闭
				this.$emit('modelChange', false);
			}

		}
	}
	</script>

	<style>
	.ticketHolder{
		position: absolute;
		left: 0;
		top: 0px;
		width: 100%;
		display: flex;
		flex-direction: column;
        height: 100%;
	}
	.ticketHolder .van-collapse-item__content{
		background-color: #f5f5f5;
		padding-left: 0;
		padding-right: 0;
		padding-top: 0px;
	}
	.ticketHolder .ticket-search{
		position: fixed;
		left: 0;
		top: 90px;
		width: 100%;
		height: 50px;
		z-index: 5;
	}	
	.ticketHolder .ticket-content-list{
		background: #f5f5f5;
		flex: 1;
		height: 100%;
		margin-top: 48px;
		box-sizing: border-box;
		overflow-y: scroll;
	}
	.ticketHolder .van-collapse-item__wrapper{
		position: absolute;
		left: 0;
		top: 0;
		padding-top:46px;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		overflow-y: scroll;
	}
	.ticketHolder .van-collapse-item__wrapper{
		
	}
	.ticketHolder .van-collapse-item__title{
		z-index: 999;
	}
	</style>
