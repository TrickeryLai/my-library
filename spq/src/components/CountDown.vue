<template>
	<span>{{this.currentTimeShow}}</span>
</template>

<script type="text/javascript">

	import _common from '@/server/index';

	export default{
		name: 'CountDown',
		props: ['time','format'],
		data(){
			return {
				intervals: '',
				formatType:this.format ? this.format : 'mm:ss',
				currentTime: Math.floor(this.time/1000),
				currentTimeShow: 0,
			}
		},
		created(){
			if(this.currentTime <= 0){
				this.currentTime = 0;
				this.currentTimeShow = this.timeFormat();
				this.$emit('timeEnd');
				return;
			}
			this.intervals = setInterval(() => {
				this.currentTime -= 1;
				this.currentTimeShow = this.timeFormat();
				if(this.currentTime == 0){
					this.currentTime = 0;
					this.currentTimeShow = this.timeFormat();
					clearInterval(this.intervals);
					this.$emit('timeEnd');
				}
			}, 1000)
		},
		destoryed(){
			clearInterval(this.intervals);
		},
		methods: {
			timeFormat(format){

				return _common.common_fn.formatLastTime(this.currentTime, this.formatType);
			}
		}
	}
</script>