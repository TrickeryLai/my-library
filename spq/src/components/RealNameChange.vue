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
    <div class="realName-content">
      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">营业执照</h3>
        <div class="realName-conten-inner">
         <UploadImg
            :initPic='common.picUrl + yyzzPic'
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
             <van-field
              v-model="submitData.jbrIdCard"
              clearable
              label="身份证号："
              placeholder="经办人身份证号"
            />
        </div>
      </van-cell-group>

      <div style="padding: 5px 5px;">
          <van-button 
          style="width: 100%;"
          type="info"
          @click="submitInfo"
        >确认</van-button>
      </div>
    </div>
  </div>
</template>

<script>
  import _server from '@/server/server'
  import _common from '@/server/index'

  export default{
      name: 'RealNameInfo',
      data(){
          return{
              title: '修改认证信息',
              zIndex: 999,
              common: _common,
              submitData:{
                orgName: '',
                email: '',
                organizationCode: '',
                registerAddress: '',
                leader: '',
                phone: '',
                frIdCard:'',
                jbrName:'',
                jbrIdCard: '',
                jbrPhone: ''
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
        this.init();
      },
      methods: {
          onClickLeft(){
              window.history.go(-1);
          },
          init(){
              let data = this.$route.query.data, initData = {};
              this.baseInfo = Object.assign({}, JSON.parse(data));
              initData = Object.assign({}, this.baseInfo);
              this.yyzzPic = initData.businessLicenseImgPath;
              this.yyzzPicUState.state = 3;

              this.submitData.orgName = initData.companyName;
              this.submitData.email = initData.contactEmail;
              this.submitData.organizationCode = initData.organizationCode;
              this.submitData.registerAddress = initData.registerAddress;
              this.submitData.leader = initData.legalPerson;
              this.submitData.phone = initData.legalPersonPhone;
              this.submitData.frIdCard = initData.legalPersonIdNo;
              this.submitData.jbrName = initData.transactor;
              this.submitData.jbrIdCard = initData.transactorIdNo;
              this.submitData.jbrPhone = initData.transactorPhone;
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
              this.sfzzPicUState.state = data.state;
              if(data.state == 3){
                  this.sfzzPic = data.imgData.data
              }
          },
          //身份证反面
          sfzfRemovePic(){
              this.sfzfPicUState.state = 0;
              this.sfzfPic = '';
          },
          sfzfUploadPicFn(data){
              this.sfzfPicUState.state = data.state;
              if(data.state == 3){
                  this.sfzfPic = data.imgData.data;
              }
          },
          submitDataCheck(){
            let emailReg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
            let phone = new RegExp("^[1][3,4,5,7,8,9][0-9]{9}$");
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
            if(!this.submitDataCheck()){
                return;
            }
            let data = {
              businessLicenseImgPath: this.yyzzPic,
              companyName: this.submitData.orgName,
              contactEmail: this.submitData.email,
              organizationCode: this.submitData.organizationCode,
              registerAddress: this.submitData.registerAddress,
              legalPerson: this.submitData.leader,
              legalPersonPhone: this.submitData.phone,
              legalPersonIdNo: this.submitData.frIdCard,
              transactor: this.submitData.jbrName,
              transactorIdNo: this.submitData.jbrIdCard,
              transactorPhone: this.submitData.jbrPhone
            };

            data = Object.assign({}, this.baseInfo, data);
            
            delete data.code;
            delete data.errMsg;

            _server.editSave(data, (res) =>{
                this.$toast(res.errMsg);
                if(res.code == 0){
                  window.history.go(-1);
                    //登录之后跳转的路由， 默认大厅， 通过redirect 设置
                  // let path = this.$route.query.redirect? decodeURIComponent(this.$route.query.redirect) : '/home/selfInfo';
                  //认证之后重新登录更新个人信息 或者 能够刷新本地缓存？？
                  
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
  margin-bottom:5px;
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
