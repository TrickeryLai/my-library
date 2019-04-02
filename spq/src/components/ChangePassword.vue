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
		<div>
			<van-cell-group>
				<van-field
				v-model="submitData.oldPwd"
				clearable
        type="password"
				label="原密码"
				placeholder="原密码"
				/>
				<van-field
				v-model="submitData.newPwd"
				clearable
        type="password"
				label="新密码"
				placeholder="新密码"
				/>
        <van-field
          v-model="submitData.confirmPwd"
          clearable
          type="password"
          label="确认密码"
          placeholder="确认密码"
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

  import _server from '@/server/server';

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
			  if(!this.submitData.newPwd){
          this.$toast('请输入原密码！');
          return;
        }
			  if(this.submitData.newPwd !== this.submitData.confirmPwd){
          this.$toast('两次密码输入不一致！');
          return;
        }
			  let data = {
          oldPwd: this.submitData.oldPwd,
          newPwd:  this.submitData.newPwd,
          confirmPwd:  this.submitData.confirmPwd,
          type: "change"
        };
         _server.changePassword(data, (res) => {
              if(res.code == 0){
                this.$toast('修改成功！');
                localStorage.clear();
                this.$router.replace({path: '/login'});
              }else{
                this.$toast(res.errMsg);

              }
         });
			}
		}
	}
</script>

<style scope>

</style>
