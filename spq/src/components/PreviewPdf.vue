<template>
	<div style="height: 100%;">
	    <van-nav-bar
	      :title="title"
	      left-arrow
	      fixed
	      @click-left="onClickLeft"
	      class="top-bg"
	    >
	      <i class="iconfont icon-previous_step" slot="left"></i>
	    </van-nav-bar>
	    <pdf
	      :src="pdfUrl"
		>
	    </pdf>
	</div>
</template>

<script>

	import pdf from 'vue-pdf';

	export default{
		name: 'PreviewPdf',
		components: {pdf},
		data(){
			return {
				pdfUrl: '',
				title: '平台协议'
			}
		},
		created(){
			if(!this.$route.params.pdfUrl){
				this.$router.replace({path: '/home/selfInfo'});
				return;
			}
			if(this.$route.params.title){
				this.title =  this.$route.params.title
			}
			this.pdfUrl = decodeURI(this.$route.params.pdfUrl);
		},
		methods:{
			onClickLeft(){
				window.history.go(-1);
			}
		}
	}
</script>