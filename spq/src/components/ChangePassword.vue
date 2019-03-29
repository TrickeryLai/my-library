<template>
	<div>
		<van-nav-bar
		:title="title"
		left-arrow
		fixed
		@click-left="onClickLeft"
		class="top-bg"
		/>
		<div>
			<van-cell-group>
				<van-field
				v-model="submitData.oldPassword"
				clearable
				label="原密码"
				placeholder="原密码"
				/>
				<van-field
				v-model="submitData.newPassword"
				clearable
				label="新密码"
				placeholder="新密码"
				/>
			</van-cell-group>

			<div style="padding: 5px;">
				<van-button 
				style="width: 100%;"
				type="info"
				@click="submitInfo"
				>确认修改</van-button>
			</div>
			
		</div>
	</div>
</template>

<script>
	export default {
		name: 'ChangePassword',
		data(){
			return {
				title: '修改密码',
				submitData: {

				}
			}
		},
		methods:{
			onClickLeft(){
				window.history.go(-1);
			},
			submitInfo(){

			}
		}
	}
</script>

<style scope>

</style>