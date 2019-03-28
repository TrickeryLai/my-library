<template>
  <div>
    <van-nav-bar
      :title="title"
      left-arrow
      fixed
      @click-left="onClickLeft"
      class="top-bg"
    />
    <van-steps
      :active="active"
      active-color="#38f"
      class="text-left"
    >
      <van-step>填写企业信息</van-step>
      <van-step>绑定提现银行</van-step>
      <van-step>设置支付密码</van-step>
    </van-steps>
    <div class="realName-content">
      <van-cell-group>
        <h3 class="title van-hairline--bottom">营业执照</h3>
        <div class="realName-conten-inner">
          <div class="picAdd-box">
            +
            <img :src="yyzzPicUrl">
            <input class="picAdd-input" type="file"  accept="image/*" ref="yyzzPicInput" multiple="multiple" @change="yyzzPicChange"/>
          </div>

        </div>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
  export default{
      name: 'RealName',
      data(){
          return{
              title: '实名认证',
              active: 2,
              yyzzPic: '',
              yyzzPicUrl: '',
          }
      },
      methods: {
          onClickLeft(){
              window.history.go(-1);
          },
          getObjectURL(file){

            var uInt8Array = new Uint8Array(file[0]);
            var i = uInt8Array.length;
            var binaryString = new Array(i);
            while (i--) {
              binaryString[i] = String.fromCharCode(uInt8Array[i]);
            }
            var data = binaryString.join('');

              //读取成功后返回的一个参数e，整个的一个进度事件

             

              //选择所要显示图片的img，要赋值给img的src就是e中target下result里面

              //的base64编码格式的地址

              this.yyzzPicUrl = "base64," + data;
            
          },
          yyzzPicChange(e,pic){
              let yyzzPic = this.$refs.yyzzPicInput.files;
              this.yyzzPic = yyzzPic;
              this.getObjectURL(yyzzPic)
              // for (let i = 0; i < yyzzPic.length; i++) {
              //   let size = Math.floor(yyzzPic.size / 1024);
              //   if (size > 5 * 1024 * 1024) {
              //     alert('请选择5M以内的图片！');
              //     return false
              //   }
              // }
          }
      }
  }
</script>

<style scoped>
.text-left{
  text-align: left;
}
.title{
  text-align: left;
  color: #000;
  font-weight: normal;
  padding: 5px;
  font-size: 16px;
}
.title::before{
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #0079f3;
  vertical-align: 2px;
  margin-right: 7px;
}
.realName-conten-inner{
  padding: 5px;
  position: relative;
}
.picAdd-box{
  width: 80px;
  height: 80px;
  text-align: center;
  line-height: 80px;
  background: #f5f5f5;
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
