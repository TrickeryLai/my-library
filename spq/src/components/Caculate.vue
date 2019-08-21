<template>
	<div>
		<van-nav-bar
		left-arrow
		fixed
		@click-left="onClickLeft"
		class="top-bg"
		>	<span slot="title" class="top-bg-title">{{title}}</span>
			<i class="iconfont icon-previous_step top-bg-title" slot="left"></i>
		</van-nav-bar>
		<div>
			<div class="caculate-top"></div>
			<div class="caculate-content">
				<van-row>
					<van-col span="8" ><span style="vertical-align:-12px;">票面金额(万元)</span></van-col>
					<van-col span="16" >
						<van-field 
						v-model.trim="value" 
						type="number"
						clearable
						placeholder="票面金额(万元)" 
						style="padding-top:3px;padding-bottom:3px" />
					</van-col>
				</van-row>
				<van-row>
					<van-col span="8"><span style="vertical-align:-12px;">贴现日期</span></van-col>
					<van-col span="16">
						<van-field 
						@click="choseTimeFn" 
						v-model="timeChoseValue" 
						readonly 
						style="padding-top:3px;padding-bottom:3px"/>
					</van-col>
				</van-row>
				<van-row>
					<van-col span="8" ><span style="vertical-align:-12px;">到期日期</span></van-col>
					<van-col span="16" >
						<van-field 
							@click="choseTimeFn2" 
							v-model="endTimeChoseValue" 
							readonly 
							style="padding-top:3px;padding-bottom:3px"
						/>
					</van-col>
				</van-row>
				<van-row>
					<van-col span="8" ><span style="vertical-align:-12px;">调整天数</span></van-col>
					<van-col span="16" >
						<van-field 
						v-model.trim="changeDay" 
						placeholder="调整天数"
						clearable 
						type="number" 
						style="padding-top:3px;padding-bottom:3px"/>
					</van-col>
				</van-row>
        <van-row>
          <van-col offset="1" span="23" class="blue-font text-left" style="padding: 10px 0;"><span style="font-size: 12px;">* 填写月利率，年利率，每十万手续费中的一个即可</span></van-col>
        </van-row>
				<van-row>
					<van-col span="8" ><span style="vertical-align:-12px;">月利率（%）</span></van-col>
					<van-col span="16" >
						<van-field 
						v-model.trim="monthRate" 
						clearable
						type="number"
						placeholder="月利率（%）"  
						style="padding-top:3px;padding-bottom:3px"
						@input="rateChange(1)"/>
					</van-col>
				</van-row>
				<van-row>
					<van-col span="8" ><span style="vertical-align:-12px;">年利率（%）</span></van-col>
					<van-col span="16" >
						<van-field 
						v-model.trim="yearRate" 
						clearable
						type="number"
						placeholder="年利率（%）" 
						style="padding-top:3px;padding-bottom:3px"
						@input="rateChange(2)" />
					</van-col>
				</van-row>
				<van-row>
					<van-col span="8" ><span style="vertical-align:-12px;">每十万手续费</span></van-col>
					<van-col span="16" >
						<van-field 
							v-model.trim="shouxufei" 
							clearable
							type="number"
							placeholder="每十万手续费（元）" 
							style="padding-top:3px;padding-bottom:3px"
							@input="rateChange(3)" 
						/>
					</van-col>
				</van-row>
				<van-row style="margin: 5px;">
					<van-col span="12">
						<van-button plain type="info" style="width:100%;" @click="reset">清空</van-button>
					</van-col>
					<van-col span="12">
						<van-button class="baseBtn" type="info" style="width:100%;" @click="caculateResultFn">计算</van-button>
					</van-col>
				</van-row>
			</div>

			<div class="result">
				<van-row>
					<van-col span="8" class="text-right">
						计算天数：
					</van-col>
					<van-col span="16" class="text-left">
						{{caculateResult.day}}天
					</van-col>
				</van-row>
				<van-row>
					<van-col span="8" class="text-right">
						每十万贴息：
					</van-col>
					<van-col span="16" class="text-left">
						{{dealPrice(caculateResult.tx)}}元
					</van-col>
				</van-row>
				<van-row>
					<van-col span="8" class="text-right">
						贴现利息：
					</van-col>
					<van-col span="16" class="text-left">
						{{dealPrice(caculateResult.txlx)}}元
					</van-col>
				</van-row>
				<van-row>
					<van-col span="8" class="text-right">
						贴现金额：
					</van-col>
					<van-col span="16" class="text-left">
						{{dealPrice(caculateResult.txje)}}元
					</van-col>
				</van-row>
			</div>
		</div>

		<van-popup v-model="timeChoseShow" position="bottom" @close="timeModelClose">
			<van-datetime-picker
			v-model="currentDate"
			type="date"
			:min-date="minDate"
			:formatter="formatter"
			@confirm="timeChoseConfirm"
			@cancel="timeChoseCancel"
			/>
		</van-popup>
		<van-popup v-model="endTimeChoseShow" position="bottom" @close="timeModelClose">
			<van-datetime-picker
			v-model="endCurrentDate"
			type="date"
			:min-date="new Date(currentDate.getTime() + 24*60*60*1000)"
			:formatter="formatter"
			@confirm="endTimeChoseConfirm"
			@cancel="endTimeChoseCancel"
			/>
		</van-popup>
	</div>
</template>

<script>
	import _common from '@/server/index';
	export default{
		name: 'Caculate',
		data(){
			return{
				title: '计算器',
				timeChoseShow: false, 
				endTimeChoseShow: false,
				timeChoseValue: this.getTime(),
				currentDate: new Date(),
				endCurrentDate: '',
				minDate: new Date(),
				type: 1,//当前时间选择是属于贴现日期 1，到期日期 2
				value: '',
				endTimeChoseValue: '',//到期日期
				changeDay: '', //调整天数
				monthRate: '',//月利率
				yearRate: '',//年利率
				shouxufei: '',//手续费
				caculateResult: {
					day: 0,
					tx: 0,
					txje: 0,
					txlx: 0
				}
			}
		},
		methods:{
			onClickLeft(){
				window.history.go(-1);
			},
			dealPrice(v){
				return _common.common_fn.dealPrice(v);
			},
			reset(){
				this.value = '';
				this.currentDate = new Date();
				this.timeChoseValue = this.getTime(this.currentDate);
				this.endCurrentDate = '';
				this.endTimeChoseValue = '';
				this.changeDay = ''; //调整天数
				this.monthRate = '';//月利率
				this.yearRate = '';//年利率
				this.shouxufei = '';//手续费
			},
			getTime(t = new Date()){
				return _common.common_fn.formatterTime(t);
			},
			choseTimeFn(type){
				this.timeChoseShow = true;
			},
			choseTimeFn2(type){
				this.endTimeChoseShow = true;
			},
			formatter(type, value) {
				return _common.common_fn.formatter(type, value);
			},
			timeModelClose(){
				this.timeChoseShow = false;
			},
			timeChoseConfirm(){
				//贴票时间--确认
				this.timeChoseValue = this.getTime(this.currentDate);

				//如果到期日小于贴现日，重置到期日
				if(this.endCurrentDate && this.currentDate.getTime() > this.endCurrentDate.getTime()){
					this.endCurrentDate = '';
					this.endTimeChoseValue = '';
				}

				this.timeModelClose();
			},
			timeChoseCancel(){
				this.timeModelClose();
			},
			endTimeModelClose(){
				this.endTimeChoseShow = false;
			},
			endTimeChoseConfirm(v){
				//到期时间--确认
				this.endCurrentDate = v;
				this.endTimeChoseValue = this.getTime(v);
				this.endTimeModelClose();
			},
			endTimeChoseCancel(){
				this.endTimeModelClose();
			},
			rateChange(type){
				if(type == 1){
					// this.monthRate = '';//月利率
					this.yearRate = '';//年利率
					this.shouxufei = '';//手续费
				}

				if(type == 2){
					this.monthRate = '';//月利率
					// this.yearRate = '';//年利率
					this.shouxufei = '';//手续费
				}

				if(type == 3){
					this.monthRate = '';//月利率
					this.yearRate = '';//年利率
					// this.shouxufei = '';//手续费
				}
				return;
			},
			getLastTime(){
				//计算剩余时间
				if(!this.endCurrentDate || !this.currentDate){
					return;
				}

				let lastTime = new Date(this.endCurrentDate).getTime() - new Date(this.currentDate).getTime();
				lastTime = Math.ceil(lastTime/(24*60*60*1000));
				return lastTime;
			},
			checkedData(){
				if(!this.value){
					this.$toast('请输入票面金额');
					return false;
				}
				if(!this.endCurrentDate){
					this.$toast('请选择到期时间');
					return false;
				}
				if(!this.monthRate & !this.yearRate & !this.shouxufei){
					this.$toast('请输入利率');
					return false;
				}
				return true;
			},
			caculateResultFn(){
				let value, startTime, endTime, changeDay, lastDay, monthRate, yearRate, sxf, calDay, txlx, txje;
				value = this.value;
				startTime = this.currentDate;
				endTime = this.endCurrentDate;
				lastDay = this.getLastTime();//获取到期时间至贴现时间
				changeDay = this.changeDay ? this.changeDay : 0; //调整天数
				monthRate = this.monthRate;//月利率
				yearRate = this.yearRate;//年利率
				sxf = this.shouxufei;//手续费

				if(!this.checkedData()){
					return;
				}
				calDay = Math.floor(lastDay) + Math.floor(changeDay);//计算天数
				if(this.monthRate){
					txlx = (value*10000*(monthRate/100*12*calDay/360));
					this.yearRate = (this.monthRate*12);
					this.shouxufei = (txlx*10/value);
				}else if(this.yearRate){
					txlx = ((value*10000*calDay*yearRate/100)/360);
					this.monthRate = (this.yearRate/12);
					this.shouxufei = (txlx*10/value);
				}else{
					txlx = (sxf*(value/10)).toFixed(2);
					this.yearRate = (txlx*36000/(calDay*value*10000));
					this.monthRate = (this.yearRate/12);
				}
				
				this.caculateResult = {
					day: Math.floor(lastDay) + Math.floor(changeDay),
					txlx: txlx.toFixed(2),
					txje: (value*10000 - txlx).toFixed(2)
				};
				this.caculateResult.tx = parseFloat(this.shouxufei).toFixed(2);
			}

		}
	}
</script>

<style scope>
.caculate-top{
	width: 100%;
	height: 150px;
	background: -moz-linear-gradient(top, #0079f3 0%, #f5f5f5 100%);
	background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#0079f3), color-stop(100%,#f5f5f5));
	background: -webkit-linear-gradient(top, #0079f3 0%,#f5f5f5 100%);
	background: -o-linear-gradient(top, #0079f3 0%,#f5f5f5 100%);
	background: -ms-linear-gradient(top, #0079f3 0%,#f5f5f5 100%);
	background: linear-gradient(to bottom, #0079f3 0%,#f5f5f5 100%);
}
.caculate-content{
	background: #fff;
	border-radius: 10px;
	border: 1px solid #ccc;
	padding: 5px;
	width: 80%;
	position:relative;
	top: -90px;
	left: 50%;
	transform: translateX(-50%);
	z-index:9;
	font-size: 14px;
}
.result{
	position: relative;
	top: -70px;
}
.result-show-right{
	text-align: left;
}
</style>
