<template>
	<div class="picAdd-box">
		<div v-if="yyzzPicUrl" style="width: 100%;height:100%;">
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
      <img id="resultImage" style="display: none;"/>
		</div>
	</div>
</template>

<script>
  import MegaPixImage from '@/server/uploadImg'
  import _common from '@/server/index'

  //将base64转化为流
  function convertBase64UrlToBlob(urlData){  
        
      var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte  
        
      //处理异常,将ascii码小于0的转换为大于0  
      var ab = new ArrayBuffer(bytes.length);  
      var ia = new Uint8Array(ab);  
      for (var i = 0; i < bytes.length; i++) {  
          ia[i] = bytes.charCodeAt(i);  
      }  
    
      return new Blob( [ab] , {type : 'image/png'});  
  } 

  function getBase64Image(img) {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);

      var dataURL = canvas.toDataURL("image/jpeg");
      return dataURL;

      // return dataURL.replace("data:image/png;base64,", "");
  }
  function simpleSize(size) {
      if (!size) return "0";
      if (size < 1024) {
          return size;
      }
      var kb = size / 1024;
      if (kb < 1024) {
          return kb.toFixed(2) + "K";
      }
      var mb = kb / 1024;
      if (mb < 1024) {
          return mb.toFixed(2) + "M";

      }
      var gb = mb / 1024;
      return gb.toFixed(2) + "G";
  };
  //Convert DataURL to Blob to send over Ajax
  function dataURItoBlob(dataUrl) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataUrl.split(',')[1]);

      // separate out the mime component
      var mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: 'image/jpeg' });
  }
//open-cp/v1/upload
	export default{
		name: 'UploadImg',
		props: ['uploadUrl'],
		data(){
			return {
				yyzzPic: '',
      	yyzzPicUrl: '',
      	yyzzPicUState: {
        	isUpload: 0,//上传状态 0未上传， 1正在上传， 3上传成功, 4 上传失败
        	progress: 0,//上传百分比
      	},
      	intervaler: '',//上传计时器
        uploadXhr: '',
        fileName: ''
			}
		},
    beforeDestoy(){
        clearInterval(this.intervaler);
    },
		methods:{
          uploadPic(){
            //通知正在上传
            this.$emit('uploadPicProgress', {state: 1, imgData: {}})
            this.yyzzPicUState.isUpload = 1;
          },
          getObjectURL(file){
            
            var file = file[file.length - 1];
            this.fileName = file.name;
            this.preViewPic(file);
            //大于 2M 压缩图片
            if(file.size){
                this.ystu(file);
            }else{
                //开始上传文件
                this.uploadFile(file)
            }
          },
          preViewPic(file){
            //预览图片
            //创建读取文件的对象
            var reader = new FileReader();
            reader.readAsDataURL(file);             
            //为文件读取成功设置事件
            reader.onload=(e) => {
                this.yyzzPicUrl  = e.target.result;
              };
          },
          uploadBase64str(base64Str) {
              //var blob = dataURItoBlob(base64Str);
              //console.log("压缩后的文件大小", blob.size);
              //core.uploadFile(blob);
              
              var token = localStorage.getItem('token') ? localStorage.getItem('token'): '';
              var _this = this;
              var formdata = new FormData();
              
              formdata.append("file", base64Str); 
              var xhr = new XMLHttpRequest();
              xhr.upload.addEventListener("progress", function (e) {
                  var percentComplete = Math.round(e.loaded * 100 / e.total);
                  _this.yyzzPicUState.progress = percentComplete;
              });
              xhr.addEventListener("load", function (e, data) {
                  // para.uploadComplete(xhr.responseText);
                  _this.$emit('uploadPicProgress', {state: 3, imgData: JSON.parse(this.responseText)});
                  _this.yyzzPicUState.isUpload = 3;
              });
              xhr.addEventListener("error", function (e) {
                  // para.uploadError(e);
                  _this.$emit('uploadPicProgress', {state: 4, imgData: e});
              });
              xhr.addEventListener('readystatechange', function(e){
                var res;
                if(e.target.status == 200 && e.target.readyState == 4){
                  res = JSON.parse(e.target.response);
                  if(res.code == '110025'){
                    _this.$toast(res.errMsg);
                    _this.$router.replace({name: 'Login'});
                    return;
                  }else if(res.code != 0){
                    _this.$toast(res.errMsg);
                  }
                }
                
              });
              xhr.open("post", _common.headUrl + this.uploadUrl, true);
              xhr.setRequestHeader('Authorization', 'Bearer ' + token);
              xhr.setRequestHeader('lang', 'zh_cn');
              // xhr.setRequestHeader('Content-Type', 'multipart/form-data');
              xhr.setRequestHeader('Content-Disposition', 'form-data; name="file";');
              xhr.send(formdata);
              //通知开始上传
              this.uploadPic();
              this.uploadXhr = xhr;
          },
          ystu(img){
              var _this = this;
              var mpImg = new MegaPixImage(img);
              var resImg = document.getElementById("resultImage");
              resImg.file = img;
              mpImg.render(img, { maxWidth: 500, maxHeight: 500, quality: 1 }, function() {
                  var base64 = getBase64Image(resImg);
                  var base641 = resImg.src;
                  // console.log("base64", base64.length, simpleSize(base64.length), base641.length, simpleSize(base641.length));
                  base64 = convertBase64UrlToBlob(base64);
                  _this.uploadBase64str(base64);
              });              
          },
          uploadFile(file) {
              var formdata = new FormData();
              var _this = this;
              var token = localStorage.getItem('token') ? localStorage.getItem('token'): '';
              formdata.append("file", file);
              var xhr = new XMLHttpRequest();
              xhr.upload.addEventListener("progress", function (e) {

                  var percentComplete = Math.round(e.loaded * 100 / e.total);
                  _this.yyzzPicUState.progress = percentComplete;
                  // para.onProgress(percentComplete.toString() + '%');
              });
              xhr.addEventListener("load", function (e, data) {
                  // para.uploadComplete(xhr.responseText);
                  _this.$emit('uploadPicProgress', {state: 3, imgData: JSON.parse(this.responseText)});
                  _this.yyzzPicUState.isUpload = 3;
              });
              xhr.addEventListener("error", function (e) {
                  // para.uploadError(e);
                  _this.$emit('uploadPicProgress', {state: 4, imgData: {}});
              });

              xhr.addEventListener('readystatechange', function(e){
                var res;
                if(e.target.status == 200 && e.target.readyState == 4){
                  res = JSON.parse(e.target.response);
                  if(res.code == '110025'){
                    _this.$router.replace({name: 'Login'});
                    _this.$toast(res.errMsg);
                    return;
                  }else if(res.code != 0){
                    _this.$toast(res.errMsg);
                  }
                }

              });

              xhr.open("post", _common.headUrl + this.uploadUrl, true);
              xhr.setRequestHeader('Authorization', 'Bearer ' + token);
              xhr.setRequestHeader('lang', 'zh_cn');
              // xhr.setRequestHeader('Content-Type', 'multipart/form-data');
              xhr.setRequestHeader('Content-Disposition', 'form-data; name="file"');
              xhr.send(formdata);
               //通知开始上传
              this.uploadPic();
              this.uploadXhr = xhr;
          },
          yyzzPicChange(e, pic){
              let yyzzPic = this.$refs.yyzzPicInput.files;

              this.yyzzPic = yyzzPic;
              this.getObjectURL(yyzzPic);
          },
          removePic(){
          		clearInterval(this.intervaler);
              //停止上传
              this.uploadXhr.abort();
            	this.yyzzPicUrl = '';
            	this.yyzzPicUState ={
              	isUpload: 0,
              	progress: 0
            	};
            	this.$emit('removePic')
          },
		}
	}
</script>

<style scoped>
.picAdd-box{
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  background: #f5f5f5;
  position: relative;
}
.picAdd-box img{
  width: 100%;
  max-height: 100%;
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
  border: 1px solid #232333;
  color: #232333;
  font-style: normal;
  font-size:12px;
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
