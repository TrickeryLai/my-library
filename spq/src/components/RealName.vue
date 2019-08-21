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
<!--     <van-steps
      :active="active"
      active-color="#38f"
      class="text-left"
    >
      <van-step>提交信息</van-step>
      <van-step>绑卡</van-step>
      <van-step>认证成功</van-step>

    </van-steps> -->
    <div class="realName-content">
      <van-cell-group class="">
        <h3 class="title van-hairline--bottom">营业执照</h3>
        <div class="realName-conten-inner">
          <div style="display:inline-block;margin-right: 10px;vertical-align: top;">
            <UploadImg
            :initPic = "getPicUrl(yyzzPic)"
            uploadUrl = "open-cp/v1/upload"
            @removePic='yyzzRemovePic'
            @uploadPicProgress='yyzzUploadPicFn' /> 
            <p class="picTitle"><span class="red-font" style="padding-top: 2px;margin-right: 2px;">*</span>营业执照正面 </p>
          </div>
          <div style="display:inline-block;margin-right: 10px;vertical-align: top;">
            <UploadImg
            :initPic = "getPicUrl(yyzzGgzPic)"
            uploadUrl = "open-cp/v1/upload"
            @removePic='yyzzGgzRemovePic'
            @uploadPicProgress='yyzzGgzUploadPicFn' /> 
            <p class="picTitle"><span class="red-font" style="padding-top: 2px;margin-right: 2px;">*</span>营业执照正面复印件盖公章</p>
          </div>
        </div>
      </van-cell-group>
      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">法定代表人身份证</h3>
        <div class="realName-conten-inner">
          <div style="display:inline-block;margin-right: 5px;vertical-align: top;">
            <UploadImg
            uploadUrl = "open-cp/v1/upload"
            :initPic = "getPicUrl(sfzzPic)"
            @removePic='sfzzRemovePic'
            @uploadPicProgress='sfzzUploadPicFn' />
            <p class="picTitle"><span class="red-font" style="padding-top: 2px;margin-right: 2px;">*</span>身份证正面 </p>
          </div>
          <div style="display:inline-block;margin-right: 5px;vertical-align: top;">
            <UploadImg
            :initPic = "getPicUrl(sfzfPic)"
            uploadUrl = "open-cp/v1/upload"
            @removePic='sfzfRemovePic'
            @uploadPicProgress='sfzfUploadPicFn' /> 
            <p class="picTitle"><span class="red-font" style="padding-top: 2px;margin-right: 2px;">*</span>身份证反面 </p>
          </div>
           <div style="display:inline-block;vertical-align: top;">
            <UploadImg
            :initPic = "getPicUrl(sfzGgzPic)"
            uploadUrl = "open-cp/v1/upload"
            @removePic='sfzGgzRemovePic'
            @uploadPicProgress='sfzGgzUploadPicFn' /> 
            <p class="picTitle" @click="showImgFn"><span class="red-font" style="padding-top: 2px;margin-right: 2px;">*</span>身份证正、反面复印件盖公章 <span style="color: #c00;">示例</span></p>
          </div>
        </div>
      </van-cell-group>
      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">经办人身份证</h3>
        <div class="realName-conten-inner">
          <div style="display:inline-block;margin-right: 10px;vertical-align: top;">
            <UploadImg
            :initPic = "getPicUrl(jbrGgzPic)"
            uploadUrl = "open-cp/v1/upload"
            @removePic='jbrGgzRemovePic'
            @uploadPicProgress='jbrGgzUploadPicFn' /> 
            <p class="picTitle" @click="showImgFn"><span class="red-font" style="padding-top: 2px;margin-right: 2px;" >*</span>经办人身份证正、反面复印件盖公章<span style="color: #c00;">示例</span></p>
          </div>
        </div>
      </van-cell-group>
      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">企业信息</h3>
        <div class="realName-conten-inner">
            <van-field
            v-model.trim="submitData.orgName"
            v-reset-page
            type="text"
            required
            clearable
            label="公司名称："
            placeholder="公司名称"
            />
            <van-field
              v-model.trim="submitData.organizationCode"
              v-reset-page
              required
              clearable
              label="统一社会信用代码："
              placeholder="统一社会信用代码"
            />
            <van-row style="border-bottom: 1px solid #f5f5f5;display:flex;align-items:center;">
              <van-col span="6" style="font-size:12px;color:#232333;padding-left:13px;display:flex;align-items:center;">
                <i style="color:#f00;margin-left:-6px;margin-right:3px;">*</i>
                <span style="line-height: 24px;">营业执照到期日：</span>
              </van-col>
              <van-col span="14">
                <InputDate
                  placeholder="请选择营业执照到期日"
                  v-model="submitData.yyzzdqsj"
                  :initV="submitData.yyzzdqsj"
                  max-date="2999-12-31 23:59:59"
                  />
              </van-col>
              <van-col span="4">
                <label for="longTime" @click="choseLongTime('yyzzdqsj')"><input v-model="yyzzdqsj.longTime" type="checkbox" name="" id="longTime" style="margin-top:2px;">长期</label>
              </van-col>
            </van-row>
            <van-field
            size="large"
            v-model.trim="submitData.registerAddress"
            v-reset-page
            required
            label="企业注册地址："
            type="textarea"
            placeholder="企业注册地址"
            rows="2"
            autosize
            />
        </div>
      </van-cell-group>

      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">法定代表人信息</h3>
        <div class="realName-conten-inner">
            <van-field
            v-model.trim="submitData.leader"
            v-reset-page
            required
            clearable
            label="姓名："
            placeholder="法定代表人姓名"
            />
             <van-field
            v-model.trim="submitData.phone"
            v-reset-page
            type="phone"
            clearable
            required
            label="手机号："
            placeholder="法定代表人手机号"
            />
            <van-field
              v-model.trim="submitData.frIdCard"
              v-reset-page
              required
              clearable
              label="身份证号："
              placeholder="法定代表人身份证号"
            />
            <van-row style="border-bottom: 1px solid #f5f5f5;display:flex;align-items:center;">
              <van-col span="6" style="font-size:12px;color:#232333;padding-left:13px;display:flex;align-items:center;">
                <i style="color:#f00;margin-left:-6px;margin-right:3px;">*</i>
                <span style="line-height: 24px;">法定代表人身份证签发时间：</span>
              </van-col>
              <van-col span="18">
                <InputDate
                  placeholder="请选择法定代表人身份证签发时间"
                  v-model="submitData.frsfqfrq"
                  :max-date="new Date().getTime() - 24*60*60*1000"
                  
                  />
              </van-col>
            </van-row>
            <van-row style="border-bottom: 1px solid #f5f5f5;display:flex;align-items:center;">
              <van-col span="6" style="font-size:12px;color:#232333;padding-left:13px;display:flex;align-items:center;">
                <i style="color:#f00;margin-left:-6px;margin-right:3px;">*</i>
                <span style="line-height: 24px;">法定代表人身份证到期时间：</span>
              </van-col>
              <van-col span="14">
                <InputDate
                  placeholder="请选择法定代表人身份证到期时间"
                  v-model="submitData.frsfdqrq"
                  :initV="submitData.frsfdqrq"
                  :min-date="new Date() + 24*60*60*1000"
                  />
              </van-col>
              <van-col span="4">
                <label for="longTime" @click="choseLongTime('frsfdqrq')"><input v-model="frsfdqrq.longTime" type="checkbox" name="" id="longTime" style="margin-top:2px;">长期</label>
              </van-col>
            </van-row>
        </div>
      </van-cell-group>

      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">经办人信息</h3>
        <div class="realName-conten-inner">
            <van-field
            v-model.trim="submitData.jbrName"
            v-reset-page
            clearable
            required
            type="text"
            label="姓名："
            placeholder="经办人姓名"
            />
            <van-field
            v-model.trim="submitData.jbrPhone"
            v-reset-page
            type="phone"
            required
            clearable
            label="手机号："
            placeholder="经办人手机号"
            />
            <van-field
              v-model.trim="submitData.jbrIdCard"
              v-reset-page
              clearable
              required
              label="身份证号："
              placeholder="经办人身份证号"
            />
        </div>
      </van-cell-group>
      <div style="padding: 5px 5px;">
          <van-button 
          class="baseBtn"
          style="width: 100%;"
          type="info"
          @click="submitInfo"
        >下一步</van-button>
      </div>
    </div>
    <van-popup v-model="picShowModel" position="center" @close="picShowModelClose" style="width: 100%;">
      <div style="width: 100%;">
        <img :src="showImg" style="width: 100%;">
      </div>
    </van-popup>

    <van-dialog
    v-model="phoneCheckState"
    title="经办人手机号校验"
    :show-confirm-button="false"
    style="padding: 0 10px;"
    >
      <van-cell-group>
        <van-row style="margin-bottom: 5px;">
          <van-col span="8" style="padding: 5px 0;">
            手机号
          </van-col>
          <van-col span="16">
            <van-field 
            v-reset-page
            class="van-hairline--surround register-input"
            style="display:inline-block;margin:0;padding:0;" 
            v-model="submitData.jbrPhone"
            readonly
            type="number"
            
            />
          </van-col>
        </van-row>
        <van-row >
          <van-col span="8" style="padding: 5px 0;">
            短信验证码
          </van-col>
          <van-col span="10">
            <van-field 
            v-reset-page
            class="van-hairline--surround register-input"
            style="display:inline-block;margin:0;padding:0;" 
            v-model.trim="smsCaptcha" placeholder="请输入短信验证码"
            type="number"
            
            />
          </van-col>
          <van-col 
          span="6" 
          >
            <van-button
              size="small"
              type="info"
              class="baseBtn"
              style="font-size: 12px;width: 100%;height: 34px;color: #fff;"
              @click="getSmsCaptcha"
              :disabled="getSmsAgainTime != 61"
            >
                {{getSmsAgainTime != '61'?getSmsAgainTime + '秒': smsCaptchaTxt}}
            </van-button>
          </van-col>
        </van-row>
        <van-row>
            <van-col span="12">
              <van-button style="width: 100%;font-size:14px;" @click="cancelCheckPhone">取消</van-button>
            </van-col>
            <van-col span="12">
              <van-button style="width: 100%;font-size:14px;" @click="confirmCheckPhone">确认</van-button>
            </van-col>
          </van-row>
      </van-cell-group>
    </van-dialog>

  </div>
</template>

<script>
  import _server from '@/server/server'
  import _common from '@/server/index'
  import InputDate from '@/components/InputDate'

  import id_pic_gongzhang from '@/assets/id-pic-gongzhang.jpeg';

  export default{
      name: 'RealName',
      components:{InputDate},
      data(){
          return{
              title: '实名认证',
              active: 0,
              zIndex: 999,
              picShowModel: false,
              showImg: '',
              loginphone: '',
              smsCaptchaKey:'',
              smsCaptcha: '',
              getSmsAgainTime: 61,
              phoneCheckState: false,
              smsCaptchaTxt: '获取验证码',
              intervals: '',
              yyzzdqsj: {
                longTime: true,
              },
              frsfdqrq:{
                longTime: false
              },
              submitData:{
                orgName: '',
                organizationCode: '',
                yyzzdqsj: '9999-12-31',
                frsfdqrq: new Date().getTime() + 24*60*60*1000,
                frsfqfrq: new Date().getTime() - 24*60*60*1000
              },
              yyzzPic: '',
              yyzzPicUState: {
                state: 0,//上传状态 0未上传， 1正在上传， 2上传成功
                
              },
              yyzzGgzPic: '',
              yyzzGgzPicUState: {
                state: 0,//上传状态 0未上传， 1正在上传， 2上传成功
                
              },
              sfzzPic: '',
              sfzzPicUState: {
                state: 0,//上传状态 0未上传， 1正在上传， 2上传成功
                
              },
              sfzfPic: '',
              sfzfPicUState: {
                state: 0,//上传状态 0未上传， 1正在上传， 2上传成功
                
              },
              sfzGgzPic: '',
              sfzGgzPicUState: {
                state: 0,//上传状态 0未上传， 1正在上传， 2上传成功
                
              },
              jbrGgzPic: '',
              jbrGgzPicUState: {
                state: 0,//上传状态 0未上传， 1正在上传， 2上传成功
                
              },

          }
      },
      created(){
        // this.init();
        this.$canScroll();
      }, 
      beforeRouteLeave(to, from, next){
        if(to.name == 'Login'){
          next();
          return;
        }
        if(this.picShowModel){
          this.picShowModel = false;
          next(false);
          return;
        }
        clearInterval(this.intervals);
        next();
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
          showImgFn(){
            this.showImg = id_pic_gongzhang;
            this.picShowModel = true;
          },
          cancelCheckPhone(){
            this.phoneCheckState = false;
          },
          confirmCheckPhone(){
            if(!this.smsCaptchaKey){
              this.$toast('请先获取验证码！');
              return;
            }

            if(!this.smsCaptcha){
              this.$toast('请先输入验证码');
              return;
            }
            this.checkedData.smsCaptchaKey = this.smsCaptchaKey;
            this.checkedData.smsCaptcha = this.smsCaptcha;
            this.submitInfoFinal(this.checkedData);
          },
          getSmsCaptcha(){
            //获取短信验证码
            _server.getSmsCaptchaCheck({
              phoneNumber: this.loginphone,
              type: '07'
            }).then(res => {
              if(res.errMsg){
                this.$toast(res.errMsg);
              }else{
                this.smsCaptchaKey = res.smsCaptchaKey;
                this.intervals = setInterval(() =>{
                  this.getSmsAgainTime -= 1;
                  
                  if(this.getSmsAgainTime <= 0){
                    this.getSmsAgainTime = 61;
                    
                    clearInterval(this.intervals);
                  }
                }, 1000)
              }
            }).catch(error => {

            })
          },
          picShowModelClose(){
            this.picShowModel = false;
          },
          getPicUrl(url){
            if(!url){
              return '';
            }
            return _common.picUrl + url;
          },
          choseLongTime(type){
            if(!this[type].longTime){
              this.submitData[type] = '9999-12-31';
            }else{
              this.submitData[type] = new Date();
            }
          },
          yyzzGgzRemovePic(){
              this.yyzzGgzPicUState.state = 0;
              this.yyzzGgzPic = '';
          },
          yyzzGgzUploadPicFn(data){
              //营业执照复印件盖公章上传
              this.yyzzGgzPicUState.state = data.state;
              if(data.state == 3){
                  this.yyzzGgzPic = data.imgData.data;
              }
          },
          sfzGgzRemovePic(){
              this.sfzGgzPicUState.state = 0;
              this.sfzGgzPic = '';
          },
          sfzGgzUploadPicFn(data){
              //营业执照复印件盖公章上传
              this.sfzGgzPicUState.state = data.state;
              if(data.state == 3){
                  this.sfzGgzPic = data.imgData.data;
              }
          },
          jbrGgzRemovePic(){
              this.jbrGgzPicUState.state = 0;
              this.jbrGgzPic = '';
          },
          jbrGgzUploadPicFn(data){
              //营业执照复印件盖公章上传
              this.jbrGgzPicUState.state = data.state;
              if(data.state == 3){
                  this.jbrGgzPic = data.imgData.data;
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
                  this.yyzzPic = data.imgData.data;
                  this.getBusinessLicenesOcrData({imageName: data.imgData.data});
              }
          },
          getBusinessLicenesOcrData(data){
              _server.getOcrBusinesslicenseData(data).then(response => {
                if(response.code == 0){
                    if(!response.data.name && !response.data.creditCode){
                        this.yyzzPic = '';
                        this.$toast('请上传更清晰的营业执照图片以供系统识别！');
                        return;
                    }

                    if(response.data.name){
                      this.submitData.orgName = response.data.name;
                    }

                    if(response.data.creditCode){
                      this.submitData.organizationCode = response.data.creditCode;
                    }
                }
              })
          },
          //身份证正面
          sfzzRemovePic(){
              this.sfzzPicUState.state = 0;
              this.sfzzPic = '';
          },
          sfzzUploadPicFn(data){
              this.sfzzPicUState.state = data.state;
              if(data.state == 3){
                  this.sfzzPic = data.imgData.data;
                  this.getIdCardOcrData({imageName: data.imgData.data});
              }
          },

          getIdCardOcrData(data){
              _server.getOcrIdCardData(data).then(response => {
                if(response.code == 0){
                    if(!response.data.name && !response.data.idNo){
                        this.sfzzPic = '';
                        this.$toast('请上传更清晰的身份证正面图片以供系统识别！');
                        return;
                    }

                    if(response.data.name){
                      this.submitData.leader = response.data.name;
                    }

                    if(response.data.idNo){
                      this.submitData.frIdCard = response.data.idNo;
                    }
                }
              })
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
                  this.getIdCardBackOcrData({imageName: data.imgData.data});
              }
          },

          getIdCardBackOcrData(data){
              _server.getOcrIdBackCardData(data).then(response => {
                if(response.code == 0){
                    if(!response.data.name && !response.data.idNo && !response.data.effectiveDate && !response.data.errorMessage && !response.data.expiredDate && !response.data.organ){
                        this.sfzfPic = '';
                        this.$toast('请上传更清晰的身份证反面图片以供系统识别！');
                        return;
                    }

                }
              })
          },
          submitDataCheck(){
            let reg;
            if(this.yyzzPicUState.state == 0 || this.yyzzPicUState.state == 4){
              this.$toast('请上传营业执照');
              return false;
            }
            if(this.yyzzPicUState.state == 1){
              this.$toast('营业执照正在上传');
              return false;
            }
            if(this.yyzzGgzPicUState.state == 0 || this.yyzzGgzPicUState.state == 4){
              this.$toast('请上传营业执照复印件盖公章图');
              return false;
            }
            if(this.yyzzGgzPicUState.state == 1){
              this.$toast('营业执照复印件盖公章图正在上传');
              return false;
            }
            if(this.sfzzPicUState.state == 0 || this.sfzzPicUState.state == 4){
              this.$toast('请上传法定代表人身份证正面');
              return false;
            }
            if(this.sfzzPicUState.state == 1){
              this.$toast('法定代表人身份证正面正在上传');
              return false;
            }
            if(this.sfzfPicUState.state == 0 || this.sfzfPicUState.state == 4){
              this.$toast('请上传法定代表人身份证反面');
              return false;
            }
            if(this.sfzfPicUState.state == 1){
              this.$toast('法定代表人身份证反面正在上传');
              return false;
            }
            if(this.sfzGgzPicUState.state == 0 || this.sfzGgzPicUState.state == 4){
              this.$toast('请上传法定代表人身份证正、反面盖公章图');
              return false;
            }
            if(this.sfzGgzPicUState.state == 1){
              this.$toast('法定代表人身份证正、反面盖公章图正在上传');
              return false;
            }
            if(this.jbrGgzPicUState.state == 0 || this.jbrGgzPicUState.state == 4){
              this.$toast('请上传经办人身份证正、反面盖公章图');
              return false;
            }
            if(this.jbrGgzPicUState.state == 1){
              this.$toast('经办人身份证正、反面盖公章图正在上传');
              return false;
            }
            if(!this.submitData.orgName){
              this.$toast('请输入公司名称');
              return false;
            }

            if(!this.submitData.organizationCode || !_common.common_reg.checkSocialCreditCode(this.submitData.organizationCode)){
              this.$toast('请输入正确的统一社会信用代码！');
              return false;
            }
            if(!this.submitData.yyzzdqsj){
              this.$toast('请选择营业执照到期日！');
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
              this.$toast('请输入法定代表人姓名！');
              return false;
            }
            if(!this.submitData.phone || !_common.common_reg.phone(this.submitData.phone)){
              this.$toast('请输入法定代表人正确手机号！');
              return false;
            }
            if(!this.submitData.frIdCard || !_common.common_reg.idCard(this.submitData.frIdCard)){
              this.$toast('请输入法定代表人正确身份证号！');
              return false;
            }
            if(!this.submitData.frsfqfrq){
              this.$toast('请选择法定代表人身份证签发时间！');
              return false;
            }
            if(!this.submitData.frsfdqrq){
              this.$toast('请选择法定代表人身份证到期时间');
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
            if(!this.submitData.jbrIdCard || !_common.common_reg.idCard(this.submitData.jbrIdCard)){
              this.$toast('请输入经办人正确身份证号！');
              return false;
            }

            return true;
          },
          getCompanyDataInfo(id){
            //获取认证信息
            id = localStorage.getItem('userId')?JSON.parse(localStorage.getItem('userId')): '';
            _server.getCompanyDataInfo(id).then((res) => {
                if(res.code == 0){
                  this.baseInfo = res;
                  localStorage.setItem('user', JSON.stringify(res));
                  // let path = this.$route.query.redirect? decodeURIComponent(this.$route.query.redirect) : '/home/billHall';
                  // // let path = '/login';
                  // this.$toast('信息已提交，请等待审核！');
                  // this.$router.replace({path});
                }else{
                  this.$toast(res.errMsg);
                }
            }).catch(error =>{

            })
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
              idNoFrontImgPath: this.sfzzPic,
              idNoBackImgPath: this.sfzfPic,
              companyName: this.submitData.orgName,
              organizationCode: this.submitData.organizationCode,
              registerAddress: this.submitData.registerAddress,
              legalPerson: this.submitData.leader,
              legalPersonPhone: this.submitData.phone,
              legalPersonIdNo: this.submitData.frIdCard,
              transactor: this.submitData.jbrName,
              transactorIdNo: this.submitData.jbrIdCard,
              transactorPhone: this.submitData.jbrPhone,
              businessLicenseCopyImg: this.yyzzGgzPic,
              legalPersonCopyImg: this.sfzGgzPic,
              transactorCopyImg: this.jbrGgzPic,
              businessLicenseDueDate: this.submitData.yyzzdqsj,
              legalPersonCardIssueDate: this.submitData.frsfqfrq,
              legalPersonCardDueDate: this.submitData.frsfdqrq
            };

            this.checkedData = data;
            this.loginphone = JSON.parse(localStorage.getItem('phonenumber'));
            if(data.transactorPhone != this.loginphone){
              this.phoneCheckState = true;
              return;
            }
            this.submitInfoFinal(data);
          },

          submitInfoFinal(data){
            _server.getAuthentication(data, (res) =>{
                if(res.code == 0){
                  this.phoneCheckState = false;
                  if(res.data.code == '000000'){
                    this.$toast('验证成功！');
                  }else{
                    this.$toast(res.data.msg);
                  }
                  this.$router.replace({path: '/home/selfInfo/realNameChange'});
                }else{
                    this.$toast(res.errMsg);
                }
            })
          },
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
.picTitle{
  width: 100px;
  text-align: center;
}
</style>
