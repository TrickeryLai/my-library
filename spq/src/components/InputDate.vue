<template>
	<div>
		<van-field 
		v-model="value" 
		:placeholder="placeh"
		readonly
		@click="inputClick"
		 />
		<van-popup 
		v-model="show" 
		position="bottom"
		>
			<van-datetime-picker
		 	 	v-model="currentDate"
			  	type="date"
   				:formatter="formatter"
   				:max-date="maxD"
   				:min-date="minD"
			  	@open="poupOpen"
			  	@close="poupClose"
			  	@confirm="confirm"
			  	@cancel="cancel"
			/>

		</van-popup>
	</div>
	
</template>

<script>

import _common from '@/server/index';
export default {
	name: 'InputDate',
	props: ['placeholder', 'formatterTime', 'vModel', 'initV','maxDate', 'minDate'],
	data(){
		return {
			placeh: this.placeholder,
			formatterT: this.formatterTime || 'yyyy-MM-dd',
			show: false,
			value: this.initV ?_common.common_fn.formatterTime(new Date(this.initV), 'yyyy-MM-dd') : (this.vModel ?_common.common_fn.formatterTime(new Date(this.vModel), 'yyyy-MM-dd') : _common.common_fn.formatterTime(new Date(), 'yyyy-MM-dd')),
			currentDate: this.initV?new Date(this.initV):new Date(),
			maxD: this.maxDate?new Date(this.maxDate): new Date(new Date().getTime() + 30*365*24*60*60*1000),
			minD: this.minDate? new Date(this.minDate):new Date(new Date().getTime() - 30*365*24*60*60*1000)
		}
	},
	watch:{
      'vModel'(newV, old){
      	this.currentDate = new Date(newV);
      	this.value = _common.common_fn.formatterTime(new Date(newV), 'yyyy-MM-dd');
      },
      initV(newV, oldV){
      	newV  = newV || '';
      	this.value = _common.common_fn.formatterTime(new Date(newV), 'yyyy-MM-dd');
      	this.currentDate = new Date(newV);
      },
      deep:true
    },
    mounted(){
    	console.log(this.vModel)
    },
	methods: {
		inputClick(){
			this.show = true;
		},
		confirm(value){
			this.value =  _common.common_fn.formatterTime(value, this.formatterT);
			this.show = false;
			this.$emit('input', this.value);
		},
		cancel(){
			this.show = false;
		},
		poupOpen(){
			
		},
		poupClose(){
			
		},
	 	formatter(type, value) {
	      if (type === 'year') {
	        return `${value}年`;
	      } else if (type === 'month') {
	        return `${value}月`
	      }
	      return value;
	    }
	}
}	
</script>
