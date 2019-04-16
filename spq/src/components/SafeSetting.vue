<template>
	<div>
		<van-nav-bar
		:title="title"
		left-arrow
		fixed
		@click-left="onClickLeft"
		class="top-bg"
		>
			<i class="iconfont icon-previous_step" slot="left"></i>
		</van-nav-bar>
		<div style="padding-top: 0px;text-align: left;">
			<van-cell class="van-hairline--bottom" @click="gotoChange(1)" title="修改登录密码">
				<i slot="right-icon" class="iconfont icon-next"></i>
			</van-cell>
		</div>
		<div style="padding-top: 0px;text-align: left;">
			<van-cell class="van-hairline--bottom" @click="gotoChange(2)" title="修改支付密码">
				<i slot="right-icon" class="iconfont icon-next"></i>
			</van-cell>
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
			gotoChange(type){
				this.$router.push({path:'/home/selfInfo/changePassword', query:{type}})
			}
		}
	}
</script>