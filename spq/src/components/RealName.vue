<template>
  <div class="realName-page">
    <van-nav-bar
      :title="title"
      left-arrow
      fixed
      @click-left="onClickLeft"
      class="top-bg"
      :z-index = "zIndex"
    />
    <van-steps
      :active="active"
      active-color="#38f"
      class="text-left"
    >
      <van-step>上传相关图片</van-step>
      <van-step>填写企业信息</van-step>
      <van-step>认证</van-step>

    </van-steps>
    <div class="realName-content">
      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">营业执照</h3>
        <div class="realName-conten-inner">
         <UploadImg
            uploadUrl = "test"
            @removePic='yyzzRemovePic'
            @uploadPicProgress='yyzzUploadPicFn' /> 
        </div>
      </van-cell-group>
      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">法人身份证</h3>
        <div class="realName-conten-inner">
          <div style="display:inline-block;margin-right: 10px;">
            <UploadImg
            uploadUrl = "test"
            @removePic='sfzzRemovePic'
            @uploadPicProgress='sfzzUploadPicFn' />
            <p class="picTitle">身份证正面 </p>
          </div>
          <div style="display:inline-block;margin-right: 10px;">
            <UploadImg
            uploadUrl = "test"
            @removePic='sfzzRemovePic'
            @uploadPicProgress='sfzzUploadPicFn' /> 
            <p class="picTitle">身份证正面 </p>
          </div>
        </div>
      </van-cell-group>

      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">企业信息</h3>
        <div class="realName-conten-inner">
          <van-cell-group>
            <van-field
            v-model="submitData.companyName"
            required
            clearable
            label="企业名称："
            placeholder="企业名称"
            />
            <van-field
            v-model="submitData.companyEmail"
            required
            clearable
            label="企业邮箱："
            placeholder="企业邮箱"
            />
             <van-field
            v-model="submitData.socialCode"
            required
            clearable
            label="社会信用代码："
            placeholder="社会信用代码"
            />
            <van-field
            size="large"
            v-model="submitData.address"
            required
            label="企业注册地址："
            type="textarea"
            placeholder="企业注册地址"
            rows="1"
            autosize
            />
          </van-cell-group>
        </div>
      </van-cell-group>

      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">法人信息</h3>
        <div class="realName-conten-inner">
          <van-cell-group>
            <van-field
            v-model="submitData.frName"
            required
            clearable
            label="姓名："
            placeholder="法人姓名"
            />
            <van-field
            v-model="submitData.frIdCard"
            required
            clearable
            label="身份证号："
            placeholder="法人身份证号"
            />
             <van-field
            v-model="submitData.frPhone"
            type="phone"
            required
            clearable
            label="手机号："
            placeholder="法人手机号"
            />
          </van-cell-group>
        </div>
      </van-cell-group>

      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">经办人信息</h3>
        <div class="realName-conten-inner">
          <van-cell-group>
            <van-field
            v-model="submitData.jbrName"
            required
            clearable
            label="姓名："
            placeholder="经办人姓名"
            />
             <van-field
            v-model="submitData.jbrPhone"
            type="phone"
            required
            clearable
            label="手机号："
            placeholder="经办人手机号"
            />
          </van-cell-group>

          <div style="padding: 15px 5px;">
              <van-button 
              style="width: 100%;"
              type="info"
              @click="submitInfo"
            >认证</van-button>
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
              active: 0,
              zIndex: 99,
              submitData:{

              },
              yyzzPic: '',
              yyzzPicUState: {
                state: 0,//上传状态 0未上传， 1正在上传， 2上传成功
                
              },
              sfzzPic: '',
              sfzzPicUState: {
                state: 0,//上传状态 0未上传， 1正在上传， 2上传成功
                
              },
              sfzfPic: '',
              sfzfPicUState: {
                state: 0,//上传状态 0未上传， 1正在上传， 2上传成功
                
              }

          }
      },
      methods: {
          onClickLeft(){
              window.history.go(-1);
          },
          yyzzRemovePic(){
              this.yyzzPicUState.state = 0;
              this.yyzzPic = '';
          },
          yyzzUploadPicFn(data){
              //营业执照上传
              this.yyzzPicUState.state = data.state;
              console.log('yyzz正在上传')
              if(data.state == 3){
                  console.log('yyzz上传成功')
                  this.yyzzPic = data.imgData
              }
          },
          //身份证正面
          sfzzRemovePic(){
              this.sfzzPicUState.state = 0;
              this.sfzzPic = '';
          },
          sfzzUploadPicFn(data){
            console.log(data)
              this.sfzzPicUState.state = data.state;
              console.log('fr正在上传')
              if(data.state == 3){
                  console.log('fryyzz上传成功')
                  this.sfzzPic = data.imgData
              }
          },
          //身份证反面
          sfzfRemovePic(){
              this.sfzfPicUState.state = 0;
              this.sfzfPic = '';
          },
          sfzfUploadPicFn(data){
              //营业执照上传
              this.sfzfPicUState.state = data.state;
              console.log('fr正在上传')
              if(data.state == 3){
                  console.log('fryyzz上传成功')
                  this.sfzfPic = data.imgData
              }
          },
          submitInfo(){
            //提交信息
          }
      }
  }
</script>

<style>
.realName-page .text-left{
  text-align: left;
}
.realName-page .title{
  text-align: left;
  color: #000;
  font-weight: normal;
  padding: 5px;
  font-size: 16px;
}
.realName-page .title::before{
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #0079f3;
  vertical-align: 2px;
  margin-right: 7px;
}
.realName-page .realName-conten-inner{
  padding: 5px;
  position: relative;
  text-align: left;
}
.realName-page .picTitle{
  font-size: 12px;
  color:#000;
  padding: 5px;
  text-align: center;
}
.realName-page .realName-content{
  padding-bottom: 50px;
}
.realName-page .realName-content-box{
  margin-top:5px;
}
.realName-page .van-cell__title span{
  font-size: 12px;
}
</style>
