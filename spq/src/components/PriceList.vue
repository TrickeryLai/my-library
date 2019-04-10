<template>
	<van-dialog
	v-model="isShow"
	:title="title"
	@confirm="beforeClose"
	style="padding: 0 10px 0;"
	>
		<table class="table">
			<tr>
				<th>公司名称</th><th>报价金额</th><th>报价时间</th>
			</tr>
			<tr
				v-for="(item, index) in list"
				:key = "index"
			>
				<td>{{item.name}}</td><td>{{dealPrice(item.price)}}</td><td>{{item.time}}</td>
			</tr>
		</table>
		<van-pagination 
			v-model="pageData.pageNum" 
			:total-items="pageData.total" 
			:items-per-page="pageData.pageSize"
		 	:show-page-size="3" 
		 	@change="pageChangeFn"
	  		force-ellipses
		/>
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
				list:[
					{
						name:'公司名称111',
						price: '123456782213139',
						time: '2019-04-10'
					},
					{
						name:'公司名称112',
						price: '1234567999',
						time: '2019-04-11'
					},
					{
						name:'公司名称113',
						price: 123456789.123,
						time: '2019-04-11'
					}
				],
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
			}
		},
		
		methods:{
			beforeClose(){
				this.$emit('close');
			},
			dealPrice(price){
				return _common.common_fn.dealPrice(price);
			},
			getData(){

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