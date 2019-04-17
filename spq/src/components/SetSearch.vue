<template>
	<van-popup
	style="height: 100%;overflow: hidden;"
	v-model="show"
	position="right"
	@close="modelClose"
	>
    <div style="height: 100%;">
      <div class="model-content setSearch-model" @touchmove.stop >
        <div style="padding-bottom: 60px;">
          <van-cell-group class="van-hairline--bottom">
            <h3 class="title">承兑人</h3>
            <van-field 
            	v-model="searchData.acceptor"
            	clearable 
            	placeholder="请输入承兑人" 
            />
          </van-cell-group>
          <van-cell-group class="van-hairline--bottom">
            <h3 class="title">票据号码</h3>
            <van-field 
            	v-model="searchData.cpNo" 
            	placeholder="请输入票据号码"
            	clearable
            	type="number"

            	/>
          </van-cell-group>
          <van-cell-group class="van-hairline--bottom">
            <h3 class="title">发布时间</h3>
            <van-row>
        		<van-field 
        			class="my-input"
	            	v-model="beginData.val" 
	            	placeholder="请选择起始时间"
	            	readonly
	            	@click="choseBeginData"
	            />
	            <span>-</span>
        		<van-field 
        			class="my-input"
	            	v-model="endData.val" 
	            	placeholder="请选择终止时间"
	            	readonly
	            	@click="choseEndData"
	            />
            </van-row>
           
          </van-cell-group>
          <van-cell-group class="van-hairline--bottom">
            <h3 class="title">票面金额</h3>
            <van-tag
              style="margin:10px 0px 0 15px;padding: 5px;"
              v-for="(item, index) in amountType"
              clearable
              :key="index"
              :type="searchData.amountChosed.val == item.val ? 'primary': ''"
              @click="choseAmount(item)"
            >{{item.name}}
            </van-tag>
            <div>
              <van-field
                class="my-input"
                clearable
                v-model="searchData.amountChosed.min"
                placeholder="最低金额(万)"
                type="number" />
              <span >-</span>
              <van-field
              	class="my-input"
              	clearable
                v-model="searchData.amountChosed.max"
                placeholder="最高金额(万)"
                type="number" />
            </div>
          </van-cell-group>
          <van-cell-group class="van-hairline--bottom">
            <h3 class="title">剩余天数</h3>
            <van-tag
              style="margin:10px 0px 0 15px;padding: 5px;"
              v-for="(item, index) in dayType"
              :type="searchData.dayChoose.val == item.val ? 'primary': ''"
              :key="index"
              @click="choseLastDay(item)"
            >{{item.name}}</van-tag>
            <div>
              <van-field
              	clearable
              	class="my-input"
                v-model="searchData.dayChoose.min" placeholder="最少天数"
                type="number" />
              <span >-</span>
              <van-field
              	clearable
              	class="my-input"
                v-model="searchData.dayChoose.max"
                clearable
                placeholder="最多天数"
                type="number" />
            </div>
          </van-cell-group>
          <van-cell-group class="van-hairline--bottom">
            <h3 class="title">瑕疵</h3>
            <van-tag
              class="my-tag"
              v-for="(item, index) in perfectType"
              :key="index"
              :type="searchData.isPerfect.val === item.val ? 'primary': ''"
              @click="chosePerfect(item)"
            >{{item.name}}</van-tag>
          </van-cell-group>
          <van-cell-group>
            <h3 class="title">成交信用</h3>
            <van-tag
              class="my-tag"
              v-for="(item, index) in dealType"
              :key="index"
              :type="searchData.dealChoose.val == item.val ? 'primary': ''"
              @click="choseDeal(item)"
            >{{item.name}}</van-tag>
          </van-cell-group>
          <van-cell-group>
            <h3 class="title">票据状态</h3>
            <van-tag
              class="my-tag"
              v-for="(item, index) in cpStatus"
              :key="index"
              :type="searchData.cpStatus.val == item.val ? 'primary': ''"
              @click="choseCpStatus(item)"
            >{{item.name}}</van-tag>
          </van-cell-group>
          <!-- <van-checkbox v-model="searchData.onlyShow" name="onlyShow" style="margin-top: 10px;">
            <i
              class="iconfont"
              slot="icon"
              slot-scope="props"
              :class="{'icon-active icon-gouxuan': props.checked,'icon-mygou': !props.checked}" 
              ></i>
            只显示我的白名单票据
          </van-checkbox> -->
        </div>


      </div>
    </div>
    </div>
    
	<div v-show="beginData.state">
		<div  @click="bTimeChoseCancel" class="my-model-bg"></div>
		<transition name="van-slide-left">
			<div v-show="beginData.state" class="my-model-content">
		    	<van-datetime-picker
					v-model="beginData.currentDate"
					type="date"
					:formatter="formatter"
					title="起始时间"
					:max-date="beginData.maxDate"
					:min-date = "beginData.minDate"
					@confirm="bTimeChoseConfirm"
					@cancel="bTimeChoseCancel"	
				/>
	    	</div>
		</transition>	
	</div>
	<div v-show="endData.state">
		<div @click="eTimeChoseCancel" class="my-model-bg"></div>
		<transition name="van-slide-left">
			<div v-show="endData.state" class="my-model-content">
		    	<van-datetime-picker
					v-model="endData.currentDate"
					type="date"
					:formatter="formatter"
					:max-date="endData.maxDate"
					:min-date = "endData.minDate"
					title="结束时间"
					@confirm="eTimeChoseConfirm"
					@cancel="eTimeChoseCancel"	
				/>
	    	</div>
		</transition>	
	</div>
    	
    <div class="my-button-box">
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
	</van-popup>
</template>

<script>
	
	import _common from '@/server/index';
	export default{
		name: 'SetSearch',
		props: ['showState'],
		data(){
			return {
				show: this.showState,
				currentDate: '',
				beginData: {
					val: '',
					state: false,
					currentDate: '',
					maxDate: new Date(),
					minDate: new Date('2019-01-01')
				},
				endData: {
					val: '',
					state: false,
					currentDate: '',
					maxDate: new Date(),
					minDate: new Date('2019-01-01')
				},
				searchData:{
					user: '',
					acceptor: '',//承兑人
					cpNo: '',//票据号码
					amountChosed: {},//面额选择
					dayChoose: {},//剩余天数选择
					isPerfect: {},//瑕疵
					dealChoose: {},//成交信用
					onlyShow: false,//只显示我的白名单票据
          			cpStatus: {},//票据状态
				},
		        cpStatus:[
        			{
		            val: '',
		            name:'全部'
		          },
		          {
		            val: '01',
		            name:'发布中'
		          },
		          {
		            val: '02',
		            name: '已成交'
		          },
		          {
		            val: '03',
		            name: '已注销'
		          },
		          {
		            val: '04',
		            name: '报价中'
		          }
		        ],
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
						name: '全部',
						val: ''
					},
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
						name: '全部',
						val: ''
					},
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
			getTime(t = new Date(), type){
				//时间格式过滤
				return _common.common_fn.formatterTime(t, type);
			},
			formatter(type, value){
				return _common.common_fn.formatter(type, value);
			},
			choseBeginData(){
				this.beginData.state = true;
			},
			choseEndData(){
				this.endData.state = true;
			},
			bTimeChoseConfirm(v){
				if(!v){
					return;
				}
				this.endData.minDate = v;
				this.beginData.state = false;
				this.beginData.currentDate = v;
				this.beginData.val = this.getTime(v, 'yyyy-MM-dd');
			},
			bTimeChoseCancel(){
				this.beginData.state = false;
			},
			eTimeChoseConfirm(v){
				if(!v){
					return;
				}
				this.beginData.maxDate = v;
				this.endData.state = false;
				this.endData.currentDate = v;
				this.endData.val = this.getTime(v, 'yyyy-MM-dd');
			},
			eTimeChoseCancel(){
				this.endData.state = false;
			},
	      	choseCpStatus(item){
			  	//票据状态修改
			  	this.searchData.cpStatus = item;
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
					if(i == 'user' || i == 'acceptor' || i == 'cpNo'){
						this.searchData[i] = '';
						
					}else if(i == 'onlyShow'){
						this.searchData[i] = false;
						
					}else{
						this.searchData[i] = {};
					}

				}
				//初始化起始时间、结束时间
				this.beginData.val = "";
				this.beginData.currentDate = "";
				this.endData.val = "";
				this.endData.currentDate = "";

				this.searchData.startDate = this.beginData.val;
				this.searchData.endDate = this.endData.val;

				this.$emit("ok", this.searchData);
				this.modelClose();
			},
			ok(){
				this.searchData.startDate = this.beginData.val;
				this.searchData.endDate = this.endData.val;
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
  height: 100%;
  overflow:auto;
  text-align: left;
}
.van-popup{
	width: 80%;
}
.icon-mygou{
	border: 1px solid #ccc;
	border-radius: 50%;
	width: 14px;
	height: 14px;
	display:inline-block;
}
.icon-active{
	color: #0079f3;
}
.my-model-bg{
	width: 100%;
	height:100%;
	background: #000;
	opacity: .3;
	position: absolute;
	left:0;
	top:0;
	z-index: 5;
}
.my-model-content{
	position: absolute;
	width: 100%;
	text-align: center;
	left:0; 
	bottom:0;
	z-index: 6;
}
.my-button-box{
	text-align: center;
	width: 100%;
	position: absolute;
	left:0; 
	bottom:0;
}
.my-tag{
	margin:10px 0px 5px 15px;
	padding: 5px;
}
.my-input{
	width:45%;
	display:inline-block;
	vertical-align:middle;
}
</style>
