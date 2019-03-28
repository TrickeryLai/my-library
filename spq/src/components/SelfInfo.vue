<template>
	<div>
		<van-nav-bar
		:title="title"
		fixed
		/>
	</div>
</template>

<script>
	export default{
		name: 'Order',
		data(){
			return {
				title: '个人中心'
			}
		}
	}
</script>