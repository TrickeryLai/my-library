<template>
	<div style="height: 100%;">
	    <van-nav-bar
	      left-arrow
	      fixed
	      @click-left="onClickLeft"
	      class="top-bg"
	    >
	    	<span slot="title" class="top-bg-title">{{title}}</span>
	      	<i class="iconfont icon-previous_step top-bg-title" slot="left"></i>
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
			if(!this.$route.query.pdfUrl){
				this.$router.replace({path: '/home/selfInfo'});
				return;
			}
			if(this.$route.query.title){
				this.title =  this.$route.query.title;
			}
			this.pdfUrl = pdf.createLoadingTask(decodeURI(this.$route.query.pdfUrl));
		},
		methods:{
			onClickLeft(){
				window.history.go(-1);
			}
		}
	}
</script>