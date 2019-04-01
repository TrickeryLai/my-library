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
      <img id="resultImage" style="display: none;"/>
		</div>
	</div>
</template>

<script>
  import MegaPixImage from '@/server/uploadImg'

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
                uploadXhr: '',
			}
		},
    beforeDestoy(){
        clearInterval(this.intervaler);
    },
		methods:{
           uploadPic(file){
              //通知正在上传
              this.$emit('uploadPicProgress', {state: 1, imgData: {}})
              this.yyzzPicUState.isUpload = 1;
              // this.upload1(file);
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
            //创建文件读取相关的变量       
            //为文件读取成功设置事件
            reader.onload=(e) => {
                // alert('文件读取完成');
                this.yyzzPicUrl  = e.target.result;

                this.uploadPic(file);//模拟效果
              };
          },
          uploadBase64str(base64Str) {

              //var blob = dataURItoBlob(base64Str);
              //console.log("压缩后的文件大小", blob.size);
              //core.uploadFile(blob);
              var _this = this;
              var formdata = new FormData();
              formdata.append("base64str", base64Str);
              var xhr = new XMLHttpRequest();
              xhr.upload.addEventListener("progress", function (e) {
                  var percentComplete = Math.round(e.loaded * 100 / e.total);
                  _this.yyzzPicUState.progress = percentComplete;
              });
              xhr.addEventListener("load", function (e) {
                  // para.uploadComplete(xhr.responseText);
              });
              xhr.addEventListener("error", function (e) {
                  // para.uploadError(e);
              });

              xhr.open("post", this.uploadUrl, true);
              xhr.send(formdata);
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
                  console.log("base64", base64.length, simpleSize(base64.length), base641.length, simpleSize(base641.length));
                  _this.uploadBase64str(base64);
              });              
          },
          uploadFile(file) {
              console.log("开始上传");
              var formdata = new FormData();
              var _this = this;

              // formdata.append(para.filebase, file);//这个名字要和mvc后台配合
              formdata.append('', file);//这个名字要和mvc后台配合

              var xhr = new XMLHttpRequest();
              xhr.upload.addEventListener("progress", function (e) {

                  var percentComplete = Math.round(e.loaded * 100 / e.total);
                  _this.yyzzPicUState.progress = percentComplete;
                  // para.onProgress(percentComplete.toString() + '%');
              });
              xhr.addEventListener("load", function (e) {
                  // para.uploadComplete(xhr.responseText);
              });
              xhr.addEventListener("error", function (e) {
                  // para.uploadError(e);
              });

              xhr.open("post", this.uploadUrl, true);
              xhr.send(formdata);
              this.uploadXhr = xhr;
          },
          yyzzPicChange(e,pic){
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

          upload1(file){
            let xhr = new XMLHttpRequest(),
                _this = this,
                param = new FormData(); //创建form对象
            param.append('file',file, file.name);//通过append向form对象添加数据
            // param.append('chunk','0');//添加form表单中其他数据
            console.log('1313',param.get('file'),'-----------------'); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
            // let config = {
            //   headers:{'Content-Type':'multipart/form-data'}
            // };  //添加请求头
            // this.$axios.post({url:'http://upload.qiniu.com/',data:param,headers:config,success(res){
              
            //   }})
            xhr.open('POST', this.uploadUrl);
            xhr.send(param);
            xhr.onprogress = (e) => {
              if (event.lengthComputable) {
                let percentComplete = event.loaded / event.total;
                _this.yyzzPicUState.progress = Math.floor(percentComplete);
              }
            };
            xhr.upload.onprogress = (e) => {
              // _this.yyzzPicUState.isUpload = 3;
              // _this.$emit('uploadPicProgress', {state: 3, imgData: {}})
              // clearInterval(_this.intervaler);
            };

          },
          upload(file){
            let reader = new FileReader();
            reader.readAsArrayBuffer(file);
            //安字节读取文件并存储至二进制缓存区
            reader.onload = function (e) {
              let result = e.target.result;
              let blob = new Blob([result]);//存储二进制数据
              let url = URL.createObjectURL(blob);//生成本地图片地址用于图片预览
              let request = new XMLHttpRequest();
              console.log(url, '-------------')
              request.onreadystatechange = function () {
                if (request.readyState === 4) {
                  if (request.status === 200) {

                  } else {

                  }
                } else {
                  console.log('others')
                }
              };
              request.open('PUT', '123124');//host是阿里云返回的图片存储地址，即你要请求的地址
              request.setRequestHeader('Content-Type', 'application/octet-stream');
              request.send(result);
            }
          },
          upload3(file){
            var formdata = new FormData(),
                xhr = new XMLHttpRequest(),
                _this = this;
            formdata.append("base64str", file);
            xhr.upload.addEventListener("progress", function (e) {

              var percentComplete = Math.round(e.loaded * 100 / e.total);
              // para.onProgress(percentComplete.toString() + '%');
              _this.yyzzPicUState.progress = Math.floor(percentComplete);
            });

            if(this.yyzzPicUState.progress >= 100){
                  this.yyzzPicUState.isUpload = 3;
                  //通知上传完毕，传递上传图片信息
                  this.$emit('uploadPicProgress', {state: 3, imgData: {}})
                    clearInterval(this.intervaler);
                }

            xhr.addEventListener("load", function (e) {
              _this.yyzzPicUState.isUpload = 3;
              _this.$emit('uploadPicProgress', {state: 3, imgData: {}})
              clearInterval(_this.intervaler);
              // para.uploadComplete(xhr.responseText);
            });
            xhr.addEventListener("error", function (e) {
              // para.uploadError(e);
              console.log(e)
            });

            xhr.open("post", this.uploadUrl, true);
            xhr.send(formdata);
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
