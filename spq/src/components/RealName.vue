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
              v-model="submitData.organizationCode"
              required
              clearable
              label="社会信用代码："
              placeholder="社会信用代码"
            />
            <van-field
            v-model="submitData.email"
            required
            clearable
            label="联系人邮箱："
            placeholder="联系人邮箱"
            />
            <van-field
            v-model="submitData.contactPhone"
            required
            clearable
            label="联系人手机："
            type="number"
            placeholder="联系人手机"
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
              required
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

      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">支付信息</h3>
        <div class="realName-conten-inner">
          <van-field
            v-model="submitData.paymentPassword"
            clearable
            type="password"
            required
            autocomplete="new-password"
            label="支付密码："
            placeholder="支付密码"
          />
          <van-field
            v-model="submitData.paymentPassword2"
            type="password"
            required
            clearable
            autocomplete="new-password"
            label="确认支付密码："
            placeholder="确认支付密码"
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
  import _common from '@/server/index'

  export default{
      name: 'RealName',
      data(){
          return{
              title: '实名认证',
              active: 0,
              zIndex: 999,
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

            if(!this.submitData.email || !_common.common_reg.email(this.submitData.email)){
              this.$toast('请输入正确的联系人邮箱！');
              return false;
            }
            if(!this.submitData.contactPhone || !_common.common_reg.phone(this.submitData.contactPhone)){
              this.$toast('请输入联系人正确手机号！');
              return false;
            }
            if(!this.submitData.leader){
              this.$toast('请输入法人姓名！');
              return false;
            }
            if(!this.submitData.phone || !_common.common_reg.phone(this.submitData.phone)){
              this.$toast('请输入法人正确手机号！');
              return false;
            }
            if(!this.submitData.frIdCard || !_common.common_reg.idCard(this.submitData.frIdCard)){
              this.$toast('请输入法人正确身份证号！');
              return false;
            }
            if(!this.submitData.paymentPassword){
              this.$toast('请设置支付密码!');
              return false;
            }
            if(this.submitData.paymentPassword != this.submitData.paymentPassword2){
              this.$toast('两次支付密码不一致！');
              return false;
            }

            return true;
          },
          submitInfo(){
            //提交信息

        //type: "POST", url: "http://127.0.0.1:8890/open-cp/v1/company/authentication", dataType: "json",
        // data:
        // businessLicenseImgPath: "ee711a75-50a7-4a3e-9c18-781b3eec5c32.jpg"
        // businessScope: "aa"
        // companyName: "t5的公司"
        // contactEmail: "klflds@163.com"
        // contactPhone: "15007145555"
        // enterpriseTypeBank: "100044"
        // enterpriseTypeCHN: "100035"
        // incomeSource: "bb"
        // industry: "100016"
        // legalPerson: "张三"
        // legalPersonIdNo: "420124198809235555"
        // legalPersonPhone: "15007145555"
        // organizationCode: "98345083240134123"
        // otherMemo: "cc"
        // personnelScale: "100050"
        // registerAddress: "南路一路7号"
        // registerCapital: "1777"
        // registerCity: "350300"
        // registerDate: "2019-04-16"
        // registerProvince: "350000"
        // registerRegion: "350303"
        // transactor: "张三"
        // transactorIdNo: "420124198809235555"
        // transactorPhone: "15007145555"

        // 字段含义：
        // companyId '序号',
        // companyName '公司名称',
        // organizationCode '组织机构代码/营业执照号',
        // legalPerson '公司法人',
        // legalPersonIdNo '法人身份证号',
        // legalPersonPhone '法人手机号',
        // transactor '经办人',
        // transactorIdNo '经办人身份证号',
        // transactorPhone '经办人手机号',
        // registerProvince  '注册省',
        // registerCity '注册市',
        // registerRegion '注册区',
        // registerAddress '注册地址',
        // registerCapital '公司注册资本',
        // registerDate '注册日期',
        // industry '所属行业',
        // enterpriseTypeCHN '企业类型（国标）',
        // enterpriseTypeBank '企业类型（银监标准）',
        // personnelScale '人员规模',
        // businessScope '主要经营范围',
        // incomeSource '主要收入来源',
        // otherMemo '其它情况',
        // contactPhone '联系人手机',
        // contactEmail '联系人邮箱',
        // businessLicenseImgPath '营业执照保存文件名称',
            let _this = this;
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
              transactorPhone: this.submitData.jbrPhone,
              contactPhone: this.submitData.contactPhone,
              paymentPassword: this.submitData.paymentPassword,
              paymentPassword2: this.submitData.paymentPassword2
            };

            _server.getAuthentication(data, (res) =>{
                if(res.code == 0){
                    //登录之后跳转的路由， 默认大厅， 通过redirect 设置
                  // let path = this.$route.query.redirect? decodeURIComponent(this.$route.query.redirect) : '/home/selfInfo';
                  //认证之后重新登录更新个人信息 或者 能够刷新本地缓存？？
                  let path = '/login';

                  //手动更改缓存的认证判定？
                  let user = JSON.parse(localStorage.getItem('user'));

                  user._checked = true;

                  localStorage.setItem('user', JSON.stringify(user));
                  this.$toast('认证成功，请重新登录！');
                  _this.$router.replace({path});
                }else{
                  this.$toast(res.errMsg);
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
