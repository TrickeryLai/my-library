<template>
	<div class="copy-btn" @click="copy()">
		复制
	</div>
</template>

<script type="text/javascript">
	export default {
		name: 'CopyBtn',
		props:['copyValue'],
		data(){
			return {

			}
		},
		methods: {
			copy(){
				let input = document.createElement('input');
			 	input.setAttribute('readonly', 'readonly');
			 	document.body.appendChild(input);
			 	input.value = this.copyValue;
			    input.select();
			    if (document.execCommand('copy')) {
			        document.execCommand('copy');
			        this.$emit('success');
			        this.$toast('复制成功！')
			    }
			 	document.body.removeChild(input);
			}
		}
	}
</script>

<style scoped>
	.copy-btn{
		font-size: 14px;
		color: #c00
	}
</style>