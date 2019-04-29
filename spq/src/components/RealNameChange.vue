<template>
  <div class="realName-page">
    <van-nav-bar
      left-arrow
      fixed
      @click-left="onClickLeft"
      class="top-bg"
      :z-index = "zIndex"
    >
      <span slot="title" class="top-bg-title">{{title}}</span>
      <i class="iconfont icon-previous_step top-bg-title" slot="left"></i>
    </van-nav-bar>
    <div class="realName-content">
      <van-cell-group class="">
        <van-steps 
        :active="companyStepActive" 
        class="text-left"
        :active-icon="companyData.authStatus == 2 ? 'cross': 'checked'"
        :active-color="companyData.authStatus == 2 ? 'red': '#38f'"
        >
          <!-- <i slot="icon" class="icon icon-icon_roundclose"></i> -->
          <van-step>提交信息</van-step>
          <van-step>待审核</van-step>
          <van-step v-if="companyData.authStatus == 2">
          审核不通过
          </van-step>
          <van-step v-else>已认证</van-step>
        </van-steps>
        <p v-if="companyData.authStatus == 2" style="padding: 5px; color: red;">{{companyData.authNoPassCause}}</p>
        <!-- <h3 class="title van-hairline--bottom">认证状态</h3>
        <div class="realName-conten-inner">
          <van-row>
            <van-col span="6">认证状态</van-col>
            <van-col span="18">
              <span v-if="companyData.authStatus == 1">待审核</span>
              <span v-else-if="companyData.authStatus == 2">审核不通过</span>
              <span v-else-if="companyData.authStatus == 9">已认证</span>
            </van-col>
          </van-row>
          <van-row v-if="companyData.authStatus == 2">
            <van-col span="6">原因</van-col>
            <van-col span="18">{{companyData.authNoPassCause}}</van-col>
          </van-row> -->
        <!-- </div> -->
      </van-cell-group>
      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">营业执照</h3>
        <div class="realName-conten-inner">
         <UploadImg
            v-if="companyData.authStatus != 9"
            :initPic='common.picUrl + yyzzPic'
            uploadUrl = "open-cp/v1/upload"
            @removePic='yyzzRemovePic'
            @uploadPicProgress='yyzzUploadPicFn' /> 
          <div v-else class="picAdd-box">
            <img :src="common.picUrl + yyzzPic">
          </div>
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
            v-reset-page
            v-model.trim="submitData.orgName"
            :readonly="companyData.authStatus == 9"
            required
            clearable
            label="公司名称："
            placeholder="公司名称"
            />
            <van-field
              v-reset-page
              v-model.trim="submitData.organizationCode"
              :readonly="companyData.authStatus == 9"
              required
              clearable
              label="组织机构代码："
              placeholder="组织机构代码"
            />
            <van-field
            v-reset-page
            v-model.trim="submitData.email"
            type="email"
            clearable
            label="联系人邮箱："
            placeholder="联系人邮箱"
            />
            <van-field
            v-reset-page
            v-model.trim="submitData.contactPhone"
            type="phone"
            clearable
            label="联系人手机："
            placeholder="联系人手机"
            />
            <van-field
            v-reset-page
            size="large"
            v-model="submitData.registerAddress"
            label="企业注册地址："
            type="textarea"
            placeholder="企业注册地址"
            rows="2"
            autosize
            />
        </div>
      </van-cell-group>

      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">法人信息</h3>
        <div class="realName-conten-inner">
            <van-field
            v-reset-page
            v-model.trim="submitData.leader"
            :readonly="companyData.authStatus == 9"
            type="text"
            required
            clearable
            label="姓名："
            placeholder="法人姓名"
            />
             <van-field
            v-reset-page
            v-model.trim="submitData.phone"
            type="phone"
            clearable
            label="手机号："
            placeholder="法人手机号"
            />
            <van-field
              v-reset-page
              v-model.trim="submitData.frIdCard"
              :readonly="companyData.authStatus == 9"
              clearable
              required
              label="身份证号："
              placeholder="法人身份证号"
            />
        </div>
      </van-cell-group>

      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">经办人信息</h3>
        <div class="realName-conten-inner">
            <van-field
            v-reset-page
            v-model.trim="submitData.jbrName"
            :readonly="companyData.authStatus == 9"
            required
            clearable
            label="姓名："
            placeholder="经办人姓名"
            />
             <van-field
            v-reset-page
            v-model.trim="submitData.jbrPhone"
            type="phone"
            :readonly="companyData.authStatus == 9"
            required
            clearable
            label="手机号："
            placeholder="经办人手机号"
            />
             <van-field
              v-reset-page
              v-model.trim="submitData.jbrIdCard"
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
        >提交</van-button>
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
              companyData: '',
              companyStepActive: 1,
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
                jbrPhone: '',
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
        this.$canScroll();
      },
      methods: {
          onClickLeft(){
              window.history.go(-1);
          },
          init(){
              let data = this.$route.query.data, initData = {};
              let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')): '',
                _id = user ? user.orgId : '',
                _this = this;

              if(!_id){
                return;
              }
              if(!data){
                _server.getCompanyData({
                  _id,
                  success(res){
                    if(res){
                      _this.initData(res);
                      localStorage.setItem('user', JSON.stringify(res));
                      //authStatus(认证状态：1-待审核；2-审核不通过；9-已认证)
                      if(res.authStatus == 1){
                        _this.$toast('认证信息正在审核！');
                        _this.companyStepActive = 1;
                      }else if(res.authStatus == 2 || res.authStatus == 9){
                         _this.companyStepActive = 2;
                         if(res.authStatus == 2){
                            _this.$toast('审核未通过，请修改之后再提交！');
                         }else if(res.authStatus == 9){
                            //如果通过了认证，并且带了重定向地址，重定向
                            if(_this.$route.query && _this.$route.query.redirect){
                                _this.$router.replace({path: _this.$route.query.redirect});
                                _this.$toast('已通过认证！');
                                return;
                            }
                            
                         }
                      }
                    }
                  }
                })
              }else{
                data = JSON.parse(data);
                this.initData(data);
              }

          },
          initData(data){
              let initData = {};
              this.companyData = data;
              this.baseInfo = Object.assign({}, data);
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
              this.submitData.contactPhone = initData.contactPhone;
          },
          yyzzRemovePic(){
              this.yyzzPicUState.state = 0;
              this.yyzzPic = '';
          },
          yyzzUploadPicFn(data){
              //营业执照上传
              this.yyzzPicUState.state = data.state;
              if(data.state == 3){
                  this.yyzzPic = data.imgData.data;
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
            if(this.yyzzPicUState.state == 0 || this.yyzzPicUState.state == 4){
              this.$toast('请上传营业执照');
              return false;
            }
            if(this.yyzzPicUState.state == 1){
              this.$toast('营业执照正在上传');
              return false;
            }
            if(!this.submitData.orgName){
              this.$toast('请输入公司名称');
              return false;
            }
            // if(!this.submitData.registerAddress){
            //   this.$toast('请输入企业注册地址！');
            //   return false;
            // }
            if(!this.submitData.organizationCode){
              this.$toast('请输入组织机构代码！');
              return false;
            }

            // if(!this.submitData.email || !_common.common_reg.email(this.submitData.email)){
            //   this.$toast('请输入正确的联系人邮箱！');
            //   return false;
            // }
            // if(!this.submitData.contactPhone || !_common.common_reg.phone(this.submitData.contactPhone)){
            //   this.$toast('请输入联系人正确手机号！');
            //   return false;
            // }
            if(!this.submitData.leader){
              this.$toast('请输入法人姓名！');
              return false;
            }
            // if(!this.submitData.phone || !_common.common_reg.phone(this.submitData.phone)){
            //   this.$toast('请输入法人正确手机号！');
            //   return false;
            // }
            if(!this.submitData.frIdCard || !_common.common_reg.idCard(this.submitData.frIdCard)){
              this.$toast('请输入法人正确身份证号！');
              return false;
            }
            if(!this.submitData.jbrName){
              this.$toast('请输入经办人姓名！');
              return false;
            }
            if(!this.submitData.jbrPhone || !_common.common_reg.phone(this.submitData.jbrPhone)){
              this.$toast('请输入经办人正确手机号！');
              return false;
            }
            return true;
          },
          submitInfo(){
            if(!this.submitDataCheck()){
                return;
            }
            let data = {
              businessLicenseImgPath: _common.common_fn.formateUlr(this.yyzzPic),
              companyName: this.submitData.orgName,
              contactEmail: this.submitData.email,
              organizationCode: this.submitData.organizationCode,
              registerAddress: this.submitData.registerAddress,
              legalPerson: this.submitData.leader,
              legalPersonPhone: this.submitData.phone,
              legalPersonIdNo: this.submitData.frIdCard,
              transactor: this.submitData.jbrName,
              transactorIdNo: this.submitData.jbrIdCard,
              transactorPhone: this.submitData.jbrPhone,
              contactPhone: this.submitData.contactPhone
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
  padding: 0 5px 5px;
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
.realName-page .picAdd-box{
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #232333;
  background: #ddd;
  position: relative;
}
.realName-page .picAdd-box img{
  width: 100%;
  max-height: 100%;
  vertical-align: middle;
}
.realName-page input[readonly]{
  background: #fff;
}
</style>
