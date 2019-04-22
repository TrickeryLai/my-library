<template>
	<van-dialog
	v-model="isShow"
	:title="title"
	@confirm="beforeClose"
	style="padding: 0 8px 0;"
	>
	<div style="max-height: 50vh;overflow-y:auto;padding: 0 5px;margin-top:5px;"
	 @touchmove.stop
	 >
		<table class="table" v-if="isTable">
			<tr>
				<th>公司名称</th>
				<th>竞价金额(元)</th>
				<th>竞价时间</th>
				<th width="70">状态</th>
				<th width="40" v-if="pageType == 1">操作</th>
			</tr>
			<tr
				v-for="(item, index) in list"
				:key = "index"
			>
				<td>{{item.companyName}}</td>
				<td>{{dealPrice(item.turnVolume.toFixed(2))}}</td>
				<td>{{item.quoteTime}}</td>
				<td>
					<van-tag 
					round
					v-if="item.quoteStatus == '01'" 
					type="primary">报价</van-tag>
					<van-tag 
					round
					v-if="item.quoteStatus == '02'" 
					type="success">撮合成交</van-tag>
					<van-tag 
					round
					v-if="item.quoteStatus == '03'"
					>撮合失败</van-tag>
					<van-tag 
					round
					color="#f2826a"
					v-if="item.quoteStatus == '04'"
					>取消</van-tag>
					<van-tag 
					round
					color="#f2826a"
					v-if="item.quoteStatus == '05'"
					>拒绝</van-tag>
				</td>
				<td 
				v-if="pageType == 1"
				>
					<van-button
						@click="biddingFn(item)"
						style="display:block;margin:3px;" 
						size="mini" 
						type="info"
						v-if="item.quoteStatus == '01'"
					>撮合</van-button>
					<van-button 
						@click="refuseFn(item)"
						style="display:block;margin:3px;" 
						size="mini" 
						type="danger"
						v-if="item.quoteStatus == '01'"
					>拒绝</van-button>
				</td>
			</tr>
		</table>
		<div 
			v-for="(item, index) in list"
			:key = "index"
			class="price-list-box"
			v-if="!isTable"
			>
			<van-row>
				<van-col span="8">公司名称</van-col>
				<van-col span="16">{{item.companyName}}</van-col>
			</van-row>
			<van-row>
				<van-col span="8">竞价金额(元)</van-col>
				<van-col span="16" class="blue-font" :class="{'red-font': item.quoteStatus == '02'}">{{dealPrice(item.turnVolume.toFixed(2))}}</van-col>
			</van-row>
			<van-row>
				<van-col span="8">竞价时间</van-col>
				<van-col span="16">{{item.quoteTime}}</van-col>
			</van-row>
			<van-row>
				<van-col span="8">竞价年利率</van-col>
				<van-col span="16">{{item.approvalApr}}</van-col>
			</van-row>
			<van-row>
				<van-col span="8">竞价每十万扣款</van-col>
				<van-col span="16">{{item.deductAmount}}</van-col>
			</van-row>
			<van-row>
				<van-col span="8">状态</van-col>
				<van-col span="16">
					<van-tag 
					round
					v-if="item.quoteStatus == '01'" 
					type="primary">报价</van-tag>
					<van-tag 
					round
					v-if="item.quoteStatus == '02'" 
					type="success">撮合成交</van-tag>
					<van-tag 
					round
					v-if="item.quoteStatus == '03'"
					>撮合失败</van-tag>
					<van-tag 
					round
					color="#f2826a"
					v-if="item.quoteStatus == '04'"
					>取消</van-tag>
					<van-tag 
					round
					color="#f2826a"
					v-if="item.quoteStatus == '05'"
					>拒绝</van-tag>
				</van-col>
			</van-row>
			<van-row v-if="pageType == 1 && item.quoteStatus == '01'">
				<van-col span="12">
					<van-button 
						@click="refuseFn(item)"
						size="mini" 
						type="danger"
					>拒绝</van-button>
				</van-col>
				<van-col span="12">
					<van-button
						@click="biddingFn(item)" 
						size="mini" 
						type="info"
					>撮合</van-button>
				</van-col>
			</van-row>
		</div>
	</div>
		<!--<van-pagination -->
			<!--v-model="pageData.pageNum" -->
			<!--:total-items="pageData.total" -->
			<!--:items-per-page="pageData.pageSize"-->
		 	<!--:show-page-size="3" -->
		 	<!--@change="pageChangeFn"-->
	  		<!--force-ellipses-->
		<!--/>-->
	</van-dialog>
</template>

<script>
	import _server from '@/server/server'
	import _common from '@/server/index'
	export default{
		name: 'PriceList',
		props: ['show', 'baseData', 'type'],
		data(){
			return {
				title: '报价信息',
				isShow: this.show,
				pageType: this.type,
				list:[],
				isTable: false,
				pageData:{
					pageSize: 5,
					pageNum: 1,
					total: 0
				}
			}
		},
		watch:{
			show(newV){
				this.isShow = newV;
				if(this.isShow){
		          this.getData(this.baseData.cpId);
		          this.pageType = this.type;
		        }
			}
		},
		methods:{
			beforeClose(){
				this.$emit('close');
			},
			dealPrice(price){
				return _common.common_fn.dealPrice(price);
			},
			getData(_id){
			  let _this = this;
	        	_server.getQuotedPrice({
		            _id,
		            success(res){
		               if(res){
		                 _this.list = res;
		               }
		            }
	          	})
			},
			biddingFn(item){
				//撮合
				let data = {
					cpId: item.cpId,
					priceId: item.priceId
				},
				_this = this;
				_server.biddingFn(data, (res) => {
					if(res.code == 0){
						_this.$toast('撮合成功！');
						_this.isShow = false;
						_this.$emit('optionSuccess')
					}else{

					}
				})
			},
			refuseFn(item){
				//拒绝
				_server.refuseQuotedPric(item.priceId).then(response => {
					if(response.code == 0){
						this.$toast('操作成功！');
						this.isShow = false;
						this.$emit('close');
					}
				}).catch( error => {

				})
			},
			pageChangeFn(){

			}
		}
	}
</script>

<style scoped>
.table{
 	border-collapse: collapse;
 	width: 100%;
 	margin: 10px 0;
 	color: #666;
 	font-size: 14px;
 	font-weight: normal;
}
.table th{
	color: #232333;
}
.table th, .table td{
	padding: 3px;
	border: 1px solid #ccc;
 	border-collapse: collapse;
}
.price-list-box{
	font-size: 14px;
	color: #232333;
	border: 1px solid #999;
	box-shadow: 1px 1px 2px #000;
	margin-bottom: 8px;
	border-radius: 10px;
}
.price-list-box .van-row{
	padding-top: 5px;
	padding-bottom: 5px;
}
.price-list-box .van-row:nth-child(2n){
	background:#eee;
}
</style>
