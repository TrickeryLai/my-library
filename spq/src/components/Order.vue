<template>
	<div>
		<van-nav-bar
		:title="title"
		fixed
		@click-right="onClickRight"
		class="top-bg"
		>
			<i class="iconfont icon-search" slot="right"></i>
		</van-nav-bar>		
	</div>
</template>

<script>
	export default{
		name: 'Order',
		data(){
			return {
				title: '订单'
			}
		},
		methods: {
			onClickRight(){

			}
		}
	}
</script>