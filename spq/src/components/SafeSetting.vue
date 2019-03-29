<template>
	<div>
		<van-nav-bar
		:title="title"
		left-arrow
		fixed
		@click-left="onClickLeft"
		class="top-bg"
		/>
		<div style="padding-top: 0px;text-align: left;">
			<van-cell @click="gotoChange" title="修改登录密码" value=">" />
		</div>
	</div>
</template>

<script>
	export default{
		name: 'SafeSetting',
		data(){
			return{
				title: '安全设置'
			}
		},
		methods: {
			onClickLeft(){
				window.history.go(-1);
			},
			gotoChange(){
				this.$router.push({path:'/home/selfInfo/changePassword'})
			}
		}
	}
</script>