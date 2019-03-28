<template>
	<div class="passwords">
		<MyInput :type="type" :placeholder="placeholder" :ref = "refs" @input="inputV" v-model="password"/>
		<i :class="{active: isShow}"
			@click="passwordShow"
		>👁</i>
	</div>
</template>

<script>

export default {
	name: 'PasswordInput',
	props: ["placeholder", "value", "refs"],
	data(){
		return {
			type: "password",
			password: "",
			isShow: false
		}
	},
	methods: {
		passwordShow(){
			this.isShow = !this.isShow;
			this.type = !this.isShow ? "password":"text";
		},
		inputV(v){
			this.$emit("input", v);
		}
	}
}
</script>
<style scoped>
.passwords{
	position: relative;
	display:inline-block;
}
.passwords i{
	position: absolute;
	right: 0;
	top: 50%;
	transform: translate(-50%, -50%);
	font-size: 20px;
}

.passwords i.active{
	color: #3385ff;
}

</style>