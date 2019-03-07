<template>
<div class="input-wrap">
	<input class="input-common" :ref="refs" :type="type" :placeholder="placeholder" :value="value" v-on:input="$emit('input', $event.target.value)" v-on:change="$emit('change', $event.target.value)" :disabled="disabled" :name="name"/>
</div>
</template>

<script>
export default{
	name: 'MyInput',
	props:["type", "placeholder", "value", "refs", "errTipsStatus", "disabled", "name"],
	data(){
		return {
		
		}
	}
}
</script>

<style>
	.input-wrap{
		position: relative;
		display:inline-block;
	}
	.input-common{
		border: 1px solid #ccc;
		padding: 5px 8px;
		width:	auto;
		display: inline-block;
		margin: 3px;
	}
	.input-errTip{
		position: absolute;
		right:0;
		top: -50px;
		background: #f5f5f5;
		border: 1px solid #999;
	}
</style>