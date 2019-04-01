<template>
	<van-popup  
	style="height: 100%;"
	v-model="show"
	position="right"
	@close="modelClose"
	>
		<div class="model-content setSearch-model">
			<!-- <van-cell-group class="van-hairline--bottom">
				<h3 class="title">承兑人</h3>
				<van-field v-model="searchData.user" placeholder="请输入承兑人" />
			</van-cell-group> -->
			<van-cell-group class="van-hairline--bottom">
				<h3 class="title">票面金额</h3>
				<van-tag 
					style="margin:10px 0px 0 15px;padding: 5px;"
					v-for="item in amountType" 
					:type="searchData.amountChosed.val == item.val ? 'primary': ''"
					@click="choseAmount(item)"
				>{{item.name}}</van-tag>
				<div>
					<van-field 
					style="width:45%;display:inline-block;vertical-align:middle;"
					v-model="searchData.amountChosed.min"
					placeholder="最低金额(万)"
					type="number" />
						<span >-</span>
					<van-field 
					style="width:45%;display:inline-block;vertical-align:middle;" 
					v-model="searchData.amountChosed.max" 
					placeholder="最高金额(万)"
					type="number" />
				</div>
			</van-cell-group>
			<van-cell-group class="van-hairline--bottom">
				<h3 class="title">剩余天数</h3>
				<van-tag 
					style="margin:10px 0px 0 15px;padding: 5px;"
					v-for="item in dayType" 
					:type="searchData.dayChoose.val == item.val ? 'primary': ''"
					@click="choseLastDay(item)"
				>{{item.name}}</van-tag>
				<div>
					<van-field 
					style="width:45%;display:inline-block;vertical-align:middle;" 
					v-model="searchData.dayChoose.min" placeholder="最少天数"
					type="number" />
						<span >-</span>
					<van-field 
					style="width:45%;display:inline-block;vertical-align:middle;" 
					v-model="searchData.dayChoose.max" 
					placeholder="最多天数"
					type="number" />
				</div>
			</van-cell-group>
			<van-cell-group class="van-hairline--bottom">
				<h3 class="title">瑕疵</h3>
				<van-tag 
					style="margin:10px 0px 5px 15px;padding: 5px;"
					v-for="item in perfectType" 
					:type="searchData.isPerfect.val == item.val ? 'primary': ''"
					@click="chosePerfect(item)"
				>{{item.name}}</van-tag>
			</van-cell-group>
			<van-cell-group class="van-hairline--bottom">
				<h3 class="title">成交信用</h3>
				<van-tag 
					style="margin:10px 0px 5px 15px;padding: 5px;"
					v-for="item in dealType" 
					:type="searchData.dealChoose.val == item.val ? 'primary': ''"
					@click="choseDeal(item)"
				>{{item.name}}</van-tag>
			</van-cell-group>
			<!-- <van-checkbox v-model="searchData.onlyShow" name="onlyShow" style="margin-top: 10px;">
				<i
				class="iconfont icon-selection"
				style="font-size: 24px;"
				slot="icon"
				slot-scope="props"
				:class="{'icon-active': props.checked}"></i>
        		只显示我的白名单票据
      		</van-checkbox>
 -->
			<div style="text-align: center;position: absolute;left:0;bottom:0;width: 100%;">
				<van-row>
					<van-col span="12">
						<van-button 
						type="default"
						@click="reset"
						style="width:100%;"
						>重置</van-button>
					</van-col>
					<van-col span="12">
						<van-button
						type="info"
						style="width:100%;"
						@click="ok">确认</van-button>
					</van-col>
				</van-row>
				
				
			</div>
		</div>
	</van-popup>
</template>

<script>
	export default{
		name: 'SetSearch',
		props: ['showState'],
		data(){
			return {
				show: this.showState,
				searchData:{
					user: '',
					amountChosed: {},//面额选择
					dayChoose: {},//剩余天数选择
					isPerfect: {},//瑕疵
					dealChoose: {},//成交信用
					// onlyShow: false,//只显示我的白名单票据
				},
				amountType:[
					{
						val: 'underThound',
						name: '10万以下',
						max: 10,
						min: ''
					},
					{
						val: 'thoundToOneMillion',
						name: '10-100万',
						max: 100,
						min: 10
					},
					{
						val: 'moreOneMillion',
						name: '100万以上',
						max: '',
						min: 100
					},
					{
						val: 'moreFiveMillion',
						name: '500万以上',
						max: '',
						min: 500
					}
				],
				dayType:[
					{
						val: 'lessThanNinety',
						name: '90天以内',
						max: 90,
						min: ''
					},
					{
						val: 'ninetyToHundredEighty',
						name: '91-180天',
						max: 91,
						min: 180
					},
					{
						val: 'hundredEightyToThreeHundredsixty',
						name: '181-360天',
						max: 360,
						min: 181
					}
				],
				perfectType:[
					{
						name: '有瑕疵',
						val: 1
					},
					{
						name: '没瑕疵',
						val: 0
					}
				],
				dealType:[
					{
						name: '优秀',
						val: 1
					},
					{
						name: '良好',
						val: 2
					},
					{
						name: '一般',
						val: 3
					}
				]
			}
		},
		watch: {
			showState(newValue, oldValue){
				this.show = newValue;
			}
		},
		methods: {
			modelClose(){
				//关闭的时候改变对应状态，继续观察
				this.$emit("close")
			},
			choseAmount(item){
				this.searchData.amountChosed = item;
			},
			choseLastDay(item){
				this.searchData.dayChoose = item;
			},
			chosePerfect(item){
				this.searchData.isPerfect = item;
			},
			choseDeal(item){
				this.searchData.dealChoose = item;
			},
			reset(){
				for(let i in this.searchData){
					if(i == 'user'){
						this.searchData[i] = '';
						
					}else if(i == 'onlyShow'){
						this.searchData[i] = false;
						
					}else{
						this.searchData[i] = {};
					}

					

				}
			},
			ok(){
				this.$emit("ok", this.searchData);
				this.modelClose();
			},
		}
	}
</script>

<style scoped>

.setSearch-model .title{
	text-align: left;
	color: #000;
	font-weight: normal;
}
.setSearch-model .title::before{
	content: '';
	display: inline-block;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: #0079f3;
	vertical-align: 5px;
	margin-right: 7px;
}
.setSearch-model.model-content{
	padding: 10px;
	text-align: left;
	overflow-scrolling: touch;
	touch-action: none;
}
.van-popup{
	width: 80%;
}
.my-checked-icon{
	font-weight: bold;
	font-style: normal;
	border: 1px solid #ccc;
	border-radius: 50%;
	width: 10px;
	height: 10px;
	text-align: center;
	line-height: 10px;
}
.icon-active{
	color: #0079f3;
}

</style>
