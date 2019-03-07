<template>
<div class="model-box" v-show="isModelVialiable">
	<div class="model-bg"></div>
	<transition name="slide-fade">
		<div class="model-wrap" >
			<h1>
				<slot name="model-title">提示</slot>
			</h1>
			<div class="model-content">
				<slot name="model-content">Content</slot>
			</div>
			<div class="model-bottom" v-if="!okBtnHide || !closeBtnHide">
				<button type="button" @click="okFn" v-if="!okBtnHide">确定</button>
				<button type="button" @click="closeFn" v-if="!closeBtnHide" class="closeBtn">取消</button>
			</div>
		</div>
	</transition>
</div>

</template>

<script>
export default {
	name: 'Model',
	props:["isModelVialiable","isAutoHide", "okBtnHide", "closeBtnHide"],
	data(){
		return{
			timer: ""
		}
	},
	watch:{
		isModelVialiable(val){
			this.isModelStatus = val;
		}
	},
	methods: {
		okFn(){
			if(this.isAutoHide){
				clearTimeout(this.timer);
			}
			this.$emit('ok', ()=>{

			})
		},
		closeFn(){
			this.$emit('close')
		}
	},
	updated(){
		if(this.isAutoHide){
			if(this.isModelVialiable){
				this.timer = setTimeout(()=>{
					this.$emit('close');
				}, 3000)
			}
		}
	}

}
</script>

<style scope>
	.model-box{
		width: 100%;
		height: 100%;
		position: fixed;
		overflow: auto;
		left: 0;
		top: 0;
	}
	.model-bg{
		position: absolute;
		width: 100%;
		height: 100%;
		background: #000;
		opacity: .5
	}
	.model-wrap{
		position: fixed;
		top:50%;
		left:50%;
		transform: translate(-50%, -50%);
		width:50%;
		border: 1px solid #ccc;
		background: #fff;
		padding: 5px 0 10px;
		box-shadow:2px 2px 2px 0 #000;
		z-index: 999;
	}
	.model-wrap button{
		display: inline-block;
		width: 75%;
		max-width: 300px;
		padding: 8px 0;
		background: #3385ff;
		border:1px solid #3385ff;
		border-radius: 5px;
		color: #fff;
		cursor: pointer;
	}
	.model-wrap button.closeBtn{
		background: #fff;
		color: #3385ff;
	}
	.model-wrap h1{
		font-size: 20px;
		font-weight: normal;
		padding-bottom: 5px;
		text-align:center;
	}
	.model-content{
		margin: 10px 20px;
	}
	.model-bottom{
		padding: 10px 20px;
		text-align: right;
	}
	.model-wrap .model-bottom button{
		width: auto;
		padding: 5px 8px;
	}
	.slide-fade-enter-active {
	  transition: all .3s ease;
	}
	.slide-fade-leave-active {
	  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}
	.slide-fade-enter, .slide-fade-leave-to
	/* .slide-fade-leave-active for below version 2.1.8 */ {
	  transform: translateX(10px);
	  opacity: 0;
	}
</style>