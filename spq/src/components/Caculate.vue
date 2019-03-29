<template>
	<div>
		<van-nav-bar
		:title="title"
		left-arrow
		fixed
		@click-left="onClickLeft"
		class="top-bg"
		/>
		<div>
			<div class="caculate-top"></div>
			<div class="caculate-content">
				<van-row>
					<van-col span="8" ><span style="vertical-align:-12px;">票面金额(万元)</span></van-col>
					<van-col span="16" >
						<van-field v-model="value" placeholder="票面金额(万元)" style="padding-top:3px;padding-bottom:3px" />
					</van-col>
				</van-row>
				<van-row>
					<van-col span="8" ><span style="vertical-align:-12px;">贴现日期</span></van-col>
					<van-col span="16" >
						<van-field @click="choseTimeFn" v-model="timeChoseValue" readonly style="padding-top:3px;padding-bottom:3px"/>
					</van-col>
				</van-row>
				<van-row>
					<van-col span="8" ><span style="vertical-align:-12px;">到期日期</span></van-col>
					<van-col span="16" >
						<van-field @click="choseTimeFn2" v-model="endTimeChoseValue" readonly style="padding-top:3px;padding-bottom:3px"/>
					</van-col>
				</van-row>
				<van-row>
					<van-col span="8" ><span style="vertical-align:-12px;">调整天数</span></van-col>
					<van-col span="16" >
						<van-field v-model="changeDay" placeholder="调整天数" type="number" style="padding-top:3px;padding-bottom:3px"/>
					</van-col>
				</van-row>
				<van-row>
					<van-col span="8" ><span style="vertical-align:-12px;">月利率（%）</span></van-col>
					<van-col span="16" >
						<van-field v-model="monthRate" placeholder="月利率（%）"  style="padding-top:3px;padding-bottom:3px"/>
					</van-col>
				</van-row>
				<van-row>
					<van-col span="8" ><span style="vertical-align:-12px;">年利率（%）</span></van-col>
					<van-col span="16" >
						<van-field v-model="yearRate" placeholder="年利率（%）" style="padding-top:3px;padding-bottom:3px" />
					</van-col>
				</van-row>
				<van-row>
					<van-col span="8" ><span style="vertical-align:-12px;">每十万手续费</span></van-col>
					<van-col span="16" >
						<van-field v-model="shouxufei" placeholder="每十万手续费" style="padding-top:3px;padding-bottom:3px" />
					</van-col>
				</van-row>
				<van-row style="margin: 5px;">
					<van-col span="12">
						<van-button plain type="info" style="width:100%;">清空</van-button>
					</van-col>
					<van-col span="12">
						<van-button type="info" style="width:100%;">计算</van-button>
					</van-col>
				</van-row>
			</div>

			<div class="result">
				<van-row>
					<van-col span="12">
						计算天数：
					</van-col>
					<van-col span="12">
						
					</van-col>
				</van-row>
				<van-row>
					<van-col span="12">
						每十万贴息：
					</van-col>
					<van-col span="12">
						
					</van-col>
				</van-row>
				<van-row>
					<van-col span="12">
						贴现利息：
					</van-col>
					<van-col span="12">
						
					</van-col>
				</van-row>
				<van-row>
					<van-col span="12">
						贴现金额：
					</van-col>
					<van-col span="12">
						
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
			:min-date="currentDate"
			:formatter="formatter"
			@confirm="endTimeChoseConfirm"
			@cancel="endTimeChoseCancel"
			/>
		</van-popup>
	</div>
</template>

<script>
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
			}
		},
		methods:{
			onClickLeft(){
				window.history.go(-1);
			},
			getTime(t = new Date()){
				let date ='', time = new Date(t);
				date += time.getFullYear() + '年';
				date += (time.getMonth() + 1) + '月';
				date += time.getDate() + '日';
				return date;
			},
			choseTimeFn(type){
				this.timeChoseShow = true;
			},
			choseTimeFn2(type){
				this.endTimeChoseShow = true;
			},
			formatter(type, value) {
				if (type === 'year') {
					return `${value}年`;
				} else if (type === 'month') {
					return `${value}月`
				}
				return value;
			},
			timeModelClose(){
				this.timeChoseShow = false;
			},
			timeChoseConfirm(){
				this.timeChoseValue = this.getTime(this.currentDate);
				this.timeModelClose();
			},
			timeChoseCancel(){
				this.timeModelClose();
			},
			endTimeModelClose(){
				this.endTimeChoseShow = false;
			},
			endTimeChoseConfirm(){
				this.endTimeChoseValue = this.getTime(this.endCurrentDate);
				this.endTimeModelClose();
			},
			endTimeChoseCancel(){
				this.endTimeModelClose();
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
</style>