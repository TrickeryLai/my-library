<template>
  <div class="realName-page">
    <van-nav-bar
      :title="title"
      left-arrow
      fixed
      @click-left="onClickLeft"
      class="top-bg"
      :z-index = "zIndex"
    >
      <i class="iconfont icon-previous_step" slot="left"></i>
    </van-nav-bar>
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
            uploadUrl = "open-cp/v1/upload"
            @removePic='yyzzRemovePic'
            @uploadPicProgress='yyzzUploadPicFn' /> 
        </div>
      </van-cell-group>
      <van-cell-group class="realName-content-box" style="display:none;">
        <h3 class="title van-hairline--bottom">法人身份证</h3>
        <div class="realName-conten-inner">
          <div style="display:inline-block;margin-right: 10px;">
            <UploadImg
            uploadUrl = "open-cp/v1/upload"
            @removePic='sfzzRemovePic'
            @uploadPicProgress='sfzzUploadPicFn' />
            <p class="picTitle">身份证正面 </p>
          </div>
          <div style="display:inline-block;margin-right: 10px;">
            <UploadImg
            uploadUrl = "open-cp/v1/upload"
            @removePic='sfzzRemovePic'
            @uploadPicProgress='sfzzUploadPicFn' /> 
            <p class="picTitle">身份证正面 </p>
          </div>
        </div>
      </van-cell-group>

      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">企业信息</h3>
        <div class="realName-conten-inner">
            <van-field
            v-model="submitData.orgName"
            required
            clearable
            label="企业名称："
            placeholder="企业名称"
            />
            <van-field
            v-model="submitData.email"
            required
            clearable
            label="企业邮箱："
            placeholder="企业邮箱"
            />
             <van-field
            v-model="submitData.organizationCode"
            required
            clearable
            label="社会信用代码："
            placeholder="社会信用代码"
            />
            <van-field
            size="large"
            v-model="submitData.registerAddress"
            required
            label="企业注册地址："
            type="textarea"
            placeholder="企业注册地址"
            rows="1"
            autosize
            />
        </div>
      </van-cell-group>

      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">法人信息</h3>
        <div class="realName-conten-inner">
            <van-field
            v-model="submitData.leader"
            required
            clearable
            label="姓名："
            placeholder="法人姓名"
            />
             <van-field
            v-model="submitData.phone"
            type="phone"
            required
            clearable
            label="手机号："
            placeholder="法人手机号"
            />
            <van-field
              v-model="submitData.frIdCard"
              clearable
              label="身份证号："
              placeholder="法人身份证号"
            />
        </div>
      </van-cell-group>

      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">经办人信息</h3>
        <div class="realName-conten-inner">
            <van-field
            v-model="submitData.jbrName"
            clearable
            label="姓名："
            placeholder="经办人姓名"
            />
             <van-field
            v-model="submitData.jbrPhone"
            type="phone"
            clearable
            label="手机号："
            placeholder="经办人手机号"
            />
        </div>
      </van-cell-group>

      <div style="padding: 5px 5px;">
          <van-button 
          style="width: 100%;"
          type="info"
          @click="submitInfo"
        >认证</van-button>
      </div>
    </div>
  </div>
</template>

<script>
  import _server from '@/server/server'

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
      created(){
        // this.init();
      },
      methods: {
          onClickLeft(){
              window.history.go(-1);
          },
          init(){
            let path = this.$route.query.redirect? decodeURIComponent(this.$route.query.redirect) : '';
            if(path){
              this.$toast('请先实名认证！');
            }
          },
          yyzzRemovePic(){
              this.yyzzPicUState.state = 0;
              this.yyzzPic = '';
          },
          yyzzUploadPicFn(data){
              //营业执照上传
              this.yyzzPicUState.state = data.state;
              if(data.state == 3){
                  this.yyzzPic = data.imgData.data
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
                  this.sfzzPic = data.imgData.data
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
              console.log('fr正在上传');
              if(data.state == 3){
                  console.log('fryyzz上传成功');
                  this.sfzfPic = data.imgData.data;

              }
          },
          submitDataCheck(){
            let emailReg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
            let phone = new RegExp("^[1][3,4,5,7,8][0-9]{9}$");
            if(this.yyzzPicUState.state == 0 || this.yyzzPicUState.state == 4){
              this.$toast('请上传营业执照');
              return false;
            }
            if(this.yyzzPicUState.state == 1){
              this.$toast('营业执照正在上传');
              return false;
            }
            if(!this.submitData.orgName){
              this.$toast('请输入企业名称');
              return false;
            }
            if(!this.submitData.registerAddress){
              this.$toast('请输入企业注册地址！');
              return false;
            }
            if(!this.submitData.organizationCode){
              this.$toast('请输入社会信用代码！');
              return false;
            }

            if(!this.submitData.email || !emailReg.test(this.submitData.email)){
              this.$toast('请输入正确的企业邮箱！');
              return false;
            }
            if(!this.submitData.leader){
              this.$toast('请输入法人姓名！');
              return false;
            }
            if(!this.submitData.phone || !phone.test(this.submitData.phone)){
              this.$toast('请输入法人正确手机号！');
              return false;
            }

            return true;
          },
          submitInfo(){
            //提交信息

            // {"orgName":"公司1",
            //   "organizationCode":"",
            //   "leader":"",
            //   "phone":"",
            //   "email":"",
            //   "registerCapital":"",
            //   "registerDate":"",
            //   "personnelScale":"",
            //   "enterpriseTypeChn":"",
            //   "enterpriseTypeBank":"",
            //   "industry":"",
            //   "registerProvince":"",
            //   "registerCity":"",
            //   "registerRegion":"",
            //   "registerAddress":"",
            //   "businessScope":"",
            //   "incomeSource":"",
            //   "otherMemo":"",
            //   "BusinessLicenseImgPath":""}

            // 机构名称： orgName
            // 组织机构代码：organizationCode
            // 负责人： leader
            // 联系电话：phone
            // 邮箱：email
            // 注册资本/万元： registerCapital
            // 注册日期： registerDate
            // 人员规模： personnelScale
            // 企业类型/国标：enterpriseTypeChn
            // 企业类型/银监： enterpriseTypeBank
            // 行业： industry
            // 注册省： registerProvince
            // 注册市： registerRegion
            // 注册区： registerAddress
            // 注册地址：registerAddress
            // 经营范围：businessScope
            // 收入来源： incomeSource
            // 其他情况: otherMemo
              // 营业执照保存文件名称: businessLicenseImgPath首字母小写

            if(!this.submitDataCheck()){
                return;
            }
            let data = {
              businessLicenseImgPath: this.yyzzPic,
              orgName: this.submitData.orgName,
              email: this.submitData.email,
              organizationCode: this.submitData.organizationCode,
              registerAddress: this.submitData.registerAddress,
              leader: this.submitData.leader,
              phone: this.submitData.phone
            };

            _server.getAuthentication(data, (res) =>{
                this.$toast(res.errMsg);
                if(res.code == 0){
                    //登录之后跳转的路由， 默认大厅， 通过redirect 设置
                  let path = this.$route.query.redirect? decodeURIComponent(this.$route.query.redirect) : '/home/selfInfo';

                  //手动更改缓存的认证判定？
                  let user = JSON.parse(localStorage.getItem('user'));

                  user._checked = true;

                  localStorage.setItem('user', JSON.stringify(user));

                  this.$router.replace({path});
                } 
            })
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
.van-field{
  display: flex;
  justify-content:center;
  align-items:center;
}
</style>
