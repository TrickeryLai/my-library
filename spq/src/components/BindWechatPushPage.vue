<template>
	
</template>
<script>
	export default{
		name: 'PushPage',
		data(){
			return {
				code: ''
			}
		},
		created(){
			// let n = Math.random()*1000;
			//https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfd6546b6d6b4cc40&redirect_uri=http%3A%2F%2F127.0.0.1%3A8089%2Fbanking-microservice-commoncode%2Fv1%2FwechatCallBack&response_type=code&scope=snsapi_base&state=123
			//http://localhost:1111/#/bindWechat
			window.location.href='http://localhost:1111/#/bindWechat';
			if(this.$route.query.code){
				this.code = this.$route.query.code;
			}
			this.$router.push({path: '/bindWechat',query:{code: this.code}});
		}
	}
</script>