<template>
	<div class="picAdd-box">
		<div v-if="yyzzPicUrl">
			<div class="pic-upload-progress" v-if="yyzzPicUState.isUpload == 1">
				{{yyzzPicUState.progress + '%'}}
			</div>
			<img :src="yyzzPicUrl" >
			<i class="pic-remove" @click="removePic">x</i>
		</div>
		<div v-if="!yyzzPicUrl">
			+
			<input
			class="picAdd-input" type="file"  accept="image/*" ref="yyzzPicInput" multiple="multiple" @change="yyzzPicChange"/>
		</div>

	</div>
</template>

<script>
	export default{
		name: 'UploadImg',
		props: ['uploadUrl'],
		data(){
			return {
				yyzzPic: '',
              	yyzzPicUrl: '',
              	yyzzPicUState: {
                	isUpload: 0,//上传状态 0未上传， 1正在上传， 2上传成功
                	progress: 0
              	},
              	intervaler: '',//上传计时器
			}
		},
		methods:{
          uploadPic(url, state){
              //通知正在上传
              this.$emit('uploadPicProgress', {state: 1, imgData: {}})
              this.yyzzPicUState.isUpload = 1;
              this.intervaler = setInterval(()=>{
                this.yyzzPicUState.progress ++;
                if(this.yyzzPicUState.progress >= 100){
                    this.yyzzPicUState.isUpload = 3;
                    //通知上传完毕，传递上传图片信息
              		this.$emit('uploadPicProgress', {state: 3, imgData: {}})
                    clearInterval(this.intervaler);
                }
              },300)
          },
          getObjectURL(file){
            
            var file = file[file.length - 1];
            //创建读取文件的对象
            var reader = new FileReader();

            reader.readAsDataURL(file);         
            //创建文件读取相关的变量       
            //为文件读取成功设置事件
            reader.onload=(e) => {
                // alert('文件读取完成');
                this.yyzzPicUrl  = e.target.result;
                this.uploadPic()
              };
          },
          yyzzPicChange(e,pic){
              let yyzzPic = this.$refs.yyzzPicInput.files;
              this.yyzzPic = yyzzPic;
              this.getObjectURL(yyzzPic)
          },
          removePic(){
          		clearInterval(this.intervaler);
              	this.yyzzPicUrl = '';
              	this.yyzzPicUState ={
                	isUpload: 0,
                	progress: 0
              	};
              	this.$emit('removePic')
          }
		}
	}
</script>

<style scoped>
.picAdd-box{
  width: 80px;
  height: 80px;
  text-align: center;
  line-height: 80px;
  background: #f5f5f5;
  position: relative;
}
.picAdd-box img{
  width: 80px;
  max-height: 80px;
  vertical-align: middle;
}
.picAdd-box .pic-remove{
  position: absolute;
  right: -3px;
  top: -3px;
  width: 12px;
  height: 12px;
  line-height: 12px;
  border-radius: 50%;
  border: 1px solid #666;
  font-style: normal;
  text-align: center;
  z-index: 99
}
.pic-upload-progress{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  opacity: .5
}
.picAdd-input{
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
</style>