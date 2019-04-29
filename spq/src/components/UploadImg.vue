<template>
	<div class="picAdd-box">
		<div v-show="yyzzPicUrl" style="width: 100%;height:100%;">
			<div class="pic-upload-progress" v-if="yyzzPicUState.isUpload == 1">
				{{yyzzPicUState.progress + '%'}}
			</div>
			<img :src="yyzzPicUrl" >
      <img ref="resultImage" style="display:none">
      <span class="pic-remove" @click="removePic">
        <i class="iconfont icon-icon_roundclose_fill" ></i>
      </span>
		</div>
		<div v-if="!yyzzPicUrl">
			<i class="iconfont icon-add"></i>
			<input
			class="picAdd-input" type="file"  accept="image/*" ref="yyzzPicInput" multiple="multiple" @change="yyzzPicChange"/>
		</div>
	</div>
</template>

<script>
  import MegaPixImage from '@/server/uploadImg'
  import _common from '@/server/index'
  function dataURLtoFile(dataurl, filename) {//将base64转换为文件
    var arr = dataurl.split(','), mime = arr[0].split(':;')[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type:mime});
  }

  //将base64转化为流
  function convertBase64UrlToBlob(urlData){  
      var bytes=window.atob(urlData.split(',')[1]);//去掉url的头，并转换为byte  
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
		props: ['uploadUrl', 'initPic'],
		data(){
			return {
				yyzzPic: '',
      	yyzzPicUrl: this.initPic?this.initPic: '',
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
    watch:{
      initPic(newV, oldV){
        let url = newV.indexOf('jpg') >= 0 || newV.indexOf('png') >= 0;
        
        if(!url){
          this.yyzzPicUrl = '';
        }else{
          this.yyzzPicUrl = newV;
        }
      }
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
          },
          preViewPic(file){
            //预览图片
            //创建读取文件的对象
            var reader = new FileReader();
            reader.readAsDataURL(file);             
            //为文件读取成功设置事件
            reader.onload=(e) => {
                //设置状态为开始上传
                this.uploadPic();
                this.yyzzPicUrl  = e.target.result;
                    //大于 1M 压缩图片
                if(file.size > 1024*1020){
                    this.ystu(file);
                }else{
                    //开始上传文件
                    this.uploadFile(file)
                }
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
                  var percentComplete = Math.floor(e.loaded * 100 / e.total);
                  _this.yyzzPicUState.progress = percentComplete;
              });
              xhr.addEventListener("load", function (e, data) {
                  // para.uploadComplete(xhr.responseText);
                  if(JSON.parse(this.responseText).code == 0){
                    _this.$emit('uploadPicProgress', {state: 3, imgData: JSON.parse(this.responseText)});
                    _this.yyzzPicUState.isUpload = 3;
                  }else{
                    // _this.yyzzPicUrl = '';
                    _this.$emit('uploadPicProgress', {state: 4, imgData: e});
                  }
                  
              });
              xhr.addEventListener("error", function (e) {
                  // para.uploadError(e);
                  // _this.yyzzPicUrl = '';
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
              this.uploadXhr = xhr;
          },
          ystu(img){
              if(!img){
                return;
              }
              var _this = this;
              var mpImg = new MegaPixImage(img);
              var resImg = this.$refs.resultImage;
              // var resImg = document.getElementById("resultImage");
              resImg.file = img;
              mpImg.render(resImg, { maxWidth: 500, maxHeight: 500, quality: 1 }, function() {
                  var base64 = getBase64Image(resImg);
                  var base641 = resImg.src;
                  base64 = dataURLtoFile(base64, _this.fileName);

                  // console.log("base64", base64.length, simpleSize(base64.length), base641.length, simpleSize(base641.length));
                  // base64 = convertBase64UrlToBlob(base64);
                  // _this.uploadBase64str(base64);

                  _this.uploadFile(base64);
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
                  _this.yyzzPicUState.progress = percentComplete >= 100 ? 99:percentComplete;
                  // para.onProgress(percentComplete.toString() + '%');
              });
              xhr.addEventListener("load", function (e, data) {
                  // para.uploadComplete(xhr.responseText);
                  if(JSON.parse(this.responseText).code == 0){
                    _this.$emit('uploadPicProgress', {state: 3, imgData: JSON.parse(this.responseText)});
                    _this.yyzzPicUState.isUpload = 3;
                  }else{
                    // _this.yyzzPicUrl = '';
                    _this.$emit('uploadPicProgress', {state: 4, imgData: e});
                  }
              });
              xhr.addEventListener("error", function (e) {
                  // para.uploadError(e);
                  // _this.yyzzPicUrl = '';
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
              if(this.uploadXhr){
                this.uploadXhr.abort();
              }
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
  color: #232333;
  background: #ddd;
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
  width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  color: #999;
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
