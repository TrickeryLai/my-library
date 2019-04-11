<template>
	<van-dialog
	v-model="isShow"
	:title="title"
	@confirm="beforeClose"
	style="padding: 0 10px 0;"
	>
	<div style="max-height: 50vh;overflow:auto;" @touchmove.stop>
		<table class="table">
			<tr>
				<th>公司名称</th><th>报价金额</th><th>报价时间</th>
			</tr>
			<tr
				v-for="(item, index) in list"
				:key = "index"
			>
				<td>{{item.companyName}}</td><td>{{dealPrice(item.turnVolume)}}元</td><td>{{item.quoteTime}}</td>
			</tr>
		</table>
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
		props:['show', 'baseData'],
		data(){
			return {
				title: '报价信息',
				isShow: this.show,
				list:[],
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
        }
			}
		},
		mounted(){

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
</style>
