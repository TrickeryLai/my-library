<template>
	<div>
	    <van-nav-bar
		  left-arrow
		  fixed
		  @click-left="onClickLeft"
		  class="top-bg"
		  :z-index = "zIndex"
		>
			<span slot="title" class="top-bg-title">{{title}}</span>
      		<i class="iconfont icon-previous_step top-bg-title" slot="left"></i>
		</van-nav-bar>
		<van-row>
			<van-col span="24">
				<van-field
				    v-model.trim="message"
				    type="textarea"
				    placeholder="写点什么吧！"
				    rows="6"
				    autosize
				  />
			</van-col>
		</van-row>
		<van-row style="background-color:#fff;padding:5px 0 10px;">
			<van-col span="4" offset="1">
				评分：
			</van-col>
			<van-col span="19" style="text-align: left;">
				<van-rate
					style="display: inline-block;vertical-align: -3px;"
					allow-half
					color="#c00"
					void-icon="star"
					void-color="#eee"
					v-model="rate"
				></van-rate>
			</van-col>
		</van-row>
		<div style="padding: 5px;margin: 10px 0;">
			<van-button 
	          style="width: 100%;"
	          type="info"
	          class="baseBtn"
	          @click="submitInfo"
	        >提交</van-button>
		</div>
		
	</div>
</template>

<script type="text/javascript">

	import _server from '@/server/server';
	
	export default {
		name: 'Rate',
		data(){
			return {
				rate: 0,
				title: '评价',
				zIndex: 999,
				message: '',
				cpNo: ''
			}
		},
		created(){
			//获取评价的相关信息
			let data = this.$route.query.cpNo;

			this.cpNo = data;
		},

		methods: {
			onClickLeft(){
				this.$router.go(-1);
			},
			submitInfo(){
				let data = {
					cpOrdNo: this.cpNo,
				 	score: this.rate,
                    remark: this.message,
				};
				_server.submitComment(data).then(res => {
					if(res.code == 0){
						this.$toast('评价成功！');
						this.$router.go(-1);
					}else{
						this.$toast(errMsg);
					}
				})
			},
		}
	}
</script>