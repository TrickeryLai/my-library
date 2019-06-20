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
      <van-cell-group class="" style="display: none;">
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
      <van-cell-group class="realName-content-box" v-if="companyData.authStatus == 9">
        <h3 style="color: #c00;text-align: center;font-size: 20px;padding: 10px 0;">认证成功！</h3>
      </van-cell-group>
      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">营业执照</h3>
        <div class="realName-conten-inner">
          <div style="display:inline-block;margin-right: 10px;vertical-align: top;">
            <div v-if="!isInputread">
              <UploadImg
              :initPic='getPicUrl(yyzzPic)'
              uploadUrl = "open-cp/v1/upload"
              @removePic='yyzzRemovePic'
              @uploadPicProgress='yyzzUploadPicFn' /> 
              <p class="picTitle"><span class="red-font" style="padding-top: 2px;margin-right: 2px;">*</span>营业执照</p>
            </div>
            <div v-else class="picAdd-box">
              <img :src="getPicUrl(yyzzPic)">
            </div>
          </div>
          <div style="display:inline-block;margin-right: 10px;vertical-align: top;">
            <div v-if="!isInputread">
              <UploadImg
              :initPic = "getPicUrl(yyzzGgzPic)"
              uploadUrl = "open-cp/v1/upload"
              @removePic='yyzzGgzRemovePic'
              @uploadPicProgress='yyzzGgzUploadPicFn' /> 
              <p class="picTitle"><span class="red-font" style="padding-top: 2px;margin-right: 2px;">*</span>营业执照正面复印件盖公章</p>
            </div>
            <div v-else class="picAdd-box">
              <img :src="getPicUrl(yyzzGgzPic)">
            </div>
          </div>
        </div>
      </van-cell-group>
      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">法定代表人身份证</h3>
        <div class="realName-conten-inner">
          <div style="display:inline-block;margin-right: 5px;">
            <UploadImg
            v-if="!isInputread"
            :initPic='getPicUrl(sfzzPic)'
            uploadUrl = "open-cp/v1/upload"
            @removePic='sfzzRemovePic'
            @uploadPicProgress='sfzzUploadPicFn' />
            <div v-else class="picAdd-box">
              <img :src="getPicUrl(sfzzPic)">
            </div>
            <p class="picTitle"><span class="red-font" style="padding-top: 2px;margin-right: 2px;">*</span>身份证正面 </p>
          </div>
          <div style="display:inline-block;margin-right: 5px;">
            <UploadImg
            v-if="!isInputread"
            :initPic='getPicUrl(sfzfPic)'
            uploadUrl = "open-cp/v1/upload"
            @removePic='sfzfRemovePic'
            @uploadPicProgress='sfzfUploadPicFn' /> 
            <div v-else class="picAdd-box">
              <img :src="getPicUrl(sfzfPic)">
            </div>
           <p class="picTitle"><span class="red-font" style="padding-top: 2px;margin-right: 2px;">*</span>身份证反面 </p>
          </div>
          <div style="display:inline-block;vertical-align: top;">
            <div style="display:inline-block;vertical-align: top;">
              <div v-if="companyData.authStatus != 9">
                <UploadImg
                :initPic = "getPicUrl(sfzGgzPic)"
                uploadUrl = "open-cp/v1/upload"
                @removePic='sfzGgzRemovePic'
                @uploadPicProgress='sfzGgzUploadPicFn' /> 
                <p class="picTitle" @click="showImgFn"><span class="red-font" style="padding-top: 2px;margin-right: 2px;">*</span>身份证正、反面复印件盖公章 <span style="color: #c00;">示例</span></p>
              </div>
              <div v-else class="picAdd-box">
                <img :src="getPicUrl(sfzGgzPic)">
              </div>
            </div>
          </div>
        </div>
      </van-cell-group>
      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">经办人身份证</h3>
        <div class="realName-conten-inner">
          <div style="display:inline-block;margin-right: 10px;vertical-align: top;">
            <div v-if="!isInputread">
              <UploadImg
              :initPic = "getPicUrl(jbrGgzPic)"
              uploadUrl = "open-cp/v1/upload"
              @removePic='jbrGgzRemovePic'
              @uploadPicProgress='jbrGgzUploadPicFn' /> 
              <p class="picTitle" @click="showImgFn"><span class="red-font" style="padding-top: 2px;margin-right: 2px;">*</span>经办人身份证正、反面复印件盖公章 <span style="color: #c00;">示例</span></p>
            </div>
            <div v-else class="picAdd-box">
              <img :src="getPicUrl(jbrGgzPic)">
            </div>
          </div>
        </div>
      </van-cell-group>
      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">企业信息</h3>
        <div class="realName-conten-inner">
            <van-field
            v-reset-page
            v-model.trim="submitData.orgName"
            :readonly="isInputread"
            required
            clearable
            label="公司名称："
            placeholder="公司名称"
            />
            <van-field
              v-reset-page
              v-model.trim="submitData.organizationCode"
              :readonly="isInputread"
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
                <p v-if="isInputread" class="timeTxtShow">
                  {{submitData.yyzzdqsj}}
                </p>
                <div v-else>
                  <template>
                    <InputDate
                      placeholder="请选择营业执照到期日"
                      v-model="submitData.yyzzdqsj"
                      :initV="submitData.yyzzdqsj"
                      max-date="2999-12-31 23:59:59"
                    />
                  </template>
                </div>
                
              </van-col>
              <van-col span="4" v-if="!isInputread">
                <label for="longTime" @click="choseLongTime('yyzzdqsj')"><input v-model="yyzzdqsj.longTime" type="checkbox" name="" id="longTime" style="margin-top:2px;">长期</label>
              </van-col>
            </van-row>
            <van-field
              v-reset-page
              size="large"
              required
              v-model="submitData.registerAddress"
              :readonly="isInputread"
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
            v-reset-page
            v-model.trim="submitData.leader"
            :readonly="isInputread"
            type="text"
            required
            clearable
            label="姓名："
            placeholder="法定代表人姓名"
            />
             <van-field
            v-reset-page
            v-model.trim="submitData.phone"
            :readonly="isInputread"
            type="phone"
            clearable
            required
            label="手机号："
            placeholder="法定代表人手机号"
            />
            <van-field
              v-reset-page
              v-model.trim="submitData.frIdCard"
              :readonly="isInputread"
              clearable
              required
              label="身份证号："
              placeholder="法定代表人身份证号"
            />
            <van-row style="border-bottom: 1px solid #f5f5f5;display:flex;align-items:center;">
              <van-col span="6" style="font-size:12px;color:#232333;padding-left:13px;display:flex;align-items:center;">
                <i style="color:#f00;margin-left:-6px;margin-right:3px;">*</i>
                <span style="line-height: 24px;">法定代表人身份证签发时间：</span>
              </van-col>
              <van-col span="18">
                <p v-if="isInputread" class="timeTxtShow">
                  {{submitData.frsfqfrq}}
                </p>
                <div v-else>
                  <template>
                    <InputDate
                    placeholder="请选择法定代表人身份证签发时间"
                    v-model="submitData.frsfqfrq"
                    :initV="submitData.frsfqfrq"
                    :max-date="new Date().getTime() - 24*60*60*1000"
                    />
                  </template>
                  
                </div>
                
              </van-col>
            </van-row>
            <van-row style="border-bottom: 1px solid #f5f5f5;display:flex;align-items:center;">
              <van-col span="6" style="font-size:12px;color:#232333;padding-left:13px;display:flex;align-items:center;">
                <i style="color:#f00;margin-left:-6px;margin-right:3px;">*</i>
                <span style="line-height: 24px;">法定代表人身份证到期时间：</span>
              </van-col>
              <van-col span="14">
                <p v-if="isInputread" class="timeTxtShow">
                  {{submitData.frsfdqrq}}
                </p>
                <div v-else>
                  <template>
                    <InputDate
                      placeholder="请选择法定代表人身份证到期时间"
                      v-model="submitData.frsfdqrq"
                      :initV="submitData.frsfdqrq"
                      :min-date="new Date() + 24*60*60*1000"
                    />
                  </template>
                </div>
                
              </van-col>
              <van-col span="4" v-if="!isInputread">
                <label for="longTime" @click="choseLongTime('frsfdqrq')"><input v-model="frsfdqrq.longTime" type="checkbox" name="" id="longTime" style="margin-top:2px;">长期</label>
              </van-col>
            </van-row>
        </div>
      </van-cell-group>

      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">经办人信息</h3>
        <div class="realName-conten-inner">
            <van-field
            v-reset-page
            v-model.trim="submitData.jbrName"
            :readonly="isInputread"
            required
            clearable
            label="姓名："
            placeholder="经办人姓名"
            />
             <van-field
            v-reset-page
            v-model.trim="submitData.jbrPhone"
            type="phone"
            :readonly="isInputread"
            required
            clearable
            label="手机号："
            placeholder="经办人手机号"
            />
             <van-field
              v-reset-page
              v-model.trim="submitData.jbrIdCard"
              clearable
              :readonly="isInputread"
              required
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
          v-if="companyData.authStatus != 9"
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
      name: 'RealNameInfo',
      components:{InputDate},
      data(){
          return{
              title: '实名认证',
              isInputread: false,
              zIndex: 999,
              common: _common,
              companyData: '',
              companyStepActive: 1,
              picShowModel: false,//图片展示
              showImg:'',//显示的图片
              loginphone: '',
              smsCaptchaKey:'',
              smsCaptcha: '',
              getSmsAgainTime: 61,
              phoneCheckState: false,
              smsCaptchaTxt: '获取验证码',
              intervals: '',
              checkedData: {},
              yyzzdqsj: {
                longTime: false,
              },
              frsfdqrq:{
                longTime: false
              },
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
        this.init();
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
          getPicUrl(url){
            if(!url){
              return ''
            }
            return _common.picUrl + url;
          },
          showImgFn(){

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
            _server.getSmsCaptcha1({
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
            this.showImg = id_pic_gongzhang;
            this.picShowModel = false;
          },
          choseLongTime(type){
            if(!this[type].longTime){
              this.submitData[type] = '9999-12-31';
            }else{
              this.submitData[type] = new Date();
            }
          },
          inputIsReadOnly(){
            // return true 则处理为不能修改
            let authStatus = this.companyData.authStatus;

            switch (authStatus){
              case '00':
              //实名认证成功 --不能修改
              
              this.$router.replace({path: '/home/selfInfo/addBankCard'});
              return true;
              case '01':
              //实名认证失败 -- 可以修
              
              return false;
              case '02':
              //实名认证处理中 -- 不可以修改
              
              return true;
              case '10':
              //账户认证成功
              this.$router.replace({path: '/home/selfInfo/checkMoney'});
              
              return true;
              case '11':
              //账户认证失败
              this.$router.replace({path: '/home/selfInfo/checkMoney'});
              return true;
              case '12':
              //账户认证申请中
              this.$router.replace({path: '/home/selfInfo/addBankCard'});
              return true;
              case '13':
              //账户认证中
              this.$router.replace({path: '/home/selfInfo/checkMoney'});
              return true;
              case '14':
              //账户认证申请失败
              this.$router.replace({path: '/home/selfInfo/addBankCard'});
              return true;
              case '20':
              //开户成功
              this.$router.replace({path: '/home/selfInfo/checkMoney'});
              return true;

              case '21':
              //开户失败
              this.$router.replace({path: '/home/selfInfo/addBankCard'});
              return true;
              case '22':
              //开户绑卡中
              this.$router.replace({path: '/home/selfInfo/checkMoney'});
              return true;
              case '23':
              //电子账户开户失败
              this.$router.replace({path: '/home/selfInfo/checkMoney'});
              return true;
              case '9':
              //已认证

              return true; 

              default:
              //如果没有实名认证
              // this.$router.replace({path: '/home/realName'});
              return;
          
            }
          },
          getCompanyData(){
              let _id = localStorage.getItem('userId') ? JSON.parse(localStorage.getItem('userId')): '';
             _server.getCompanyDataInfo(_id).then((res)=>{
                    if(res.code == 0){
                      localStorage.setItem('user', JSON.stringify(res));
                      this.isInputread = this.inputIsReadOnly();
                      this.init();
                    }else{
                      this.$toast(res.errMsg)
                    }
                  })
          },
          init(){
              let data = this.$route.query.data, initData = {};
             let _id = localStorage.getItem('userId') ? JSON.parse(localStorage.getItem('userId')): '',
                _this = this;

              // if(!_id){
              //   return;
              // }
              if(true){
                _server.getCompanyDataInfo(_id).then((res) =>{
                    if(res.code == 0){
                      _this.initData(res);
                      localStorage.setItem('user', JSON.stringify(res));
                      //authStatus(认证状态：1-待审核；2-审核不通过；9-已认证)
                      _this.isInputread = _this.inputIsReadOnly();
                      // if(res.authStatus == 1){
                      //   _this.$toast('认证信息正在审核！');
                      //   _this.companyStepActive = 1;
                      // }else if(res.authStatus == 2 || res.authStatus == 9){
                      //    _this.companyStepActive = 2;
                      //    if(res.authStatus == 2){
                      //       _this.$toast('审核未通过，请修改之后再提交！');
                      //    }else if(res.authStatus == 9){
                      //       //如果通过了认证，并且带了重定向地址，重定向
                      //       if(_this.$route.query && _this.$route.query.redirect){
                      //           _this.$router.replace({path: _this.$route.query.redirect});
                      //           _this.$toast('已通过认证！');
                      //           return;
                      //       }
                            
                      //    }
                      // }
                    }else{
                      this.$toast(res.errMsg)
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

              if(!data.authStatus){
                return;
              }

              this.yyzzPic = initData.businessLicenseImgPath;
              this.yyzzPicUState.state = 3;
              this.sfzzPic = initData.idNoFrontImgPath ? initData.idNoFrontImgPath:'';
              this.sfzzPicUState.state = initData.idNoFrontImgPath ? 3 : 0;
              this.sfzfPic = initData.idNoBackImgPath?initData.idNoBackImgPath:'';
              this.sfzfPicUState.state = initData.idNoBackImgPath ? 3: 0;

              this.yyzzGgzPic = initData.businessLicenseCopyImg?initData.businessLicenseCopyImg:'';
              this.yyzzGgzPicUState.state = initData.businessLicenseCopyImg ? 3: 0;
              this.sfzGgzPic = initData.legalPersonCopyImg?initData.legalPersonCopyImg:'';
              this.sfzGgzPicUState.state = initData.legalPersonCopyImg ? 3: 0;
              this.jbrGgzPic = initData.transactorCopyImg?initData.transactorCopyImg:'';
              this.jbrGgzPicUState.state = initData.transactorCopyImg ? 3: 0;

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

              this.submitData.yyzzdqsj = initData.businessLicenseDueDate;
              this.submitData.frsfqfrq = initData.legalPersonCardIssueDate;
              this.submitData.frsfdqrq = initData.legalPersonCardDueDate;

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
            if(this.yyzzPicUState.state == 0 || this.yyzzPicUState.state == 4){
              this.$toast('请上传营业执照');
              return false;
            }
            if(this.yyzzPicUState.state == 1){
              this.$toast('营业执照正在上传');
              return false;
            }
            if(this.sfzzPicUState.state == 0 || this.sfzzPicUState.state == 4){
              this.$toast('请上传身份证正面');
              return false;
            }
            if(this.sfzzPicUState.state == 1){
              this.$toast('身份证正面正在上传');
              return false;
            }
            if(this.sfzfPicUState.state == 0 || this.sfzfPicUState.state == 4){
              this.$toast('请上传身份证反面');
              return false;
            }
            if(this.sfzfPicUState.state == 1){
              this.$toast('身份证反面正在上传');
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
            // if(!this.submitData.organizationCode){
            //   this.$toast('请输入统一社会信用代码！');
            //   return false;
            // }
            if(!this.submitData.organizationCode || !_common.common_reg.checkSocialCreditCode(this.submitData.organizationCode)){
              this.$toast('请输入正确的统一社会信用代码！');
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
            if(!this.submitData.jbrIdCard || !_common.common_reg.idCard(this.submitData.jbrIdCard)){
              this.$toast('请输入经办人正确身份证号！');
              return false;
            }
            if(!this.submitData.frIdCard || !_common.common_reg.idCard(this.submitData.frIdCard)){
              this.$toast('请输入法定代表人正确身份证号！');
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
            this.getSmsAgainTime = 61;
            clearInterval(this.intervals);
            this.smsCaptchaKey = '';
            this.smsCaptcha = '';
            //如果当前是只读页面，出现按钮，下一步直接跳转
            if(this.isInputread){
              this.$router.replace({path: 'addBankCard'});
              return;
            }

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

            data = Object.assign({}, this.baseInfo, data);
            
            delete data.code;
            delete data.errMsg;

            this.checkedData = data;
            this.loginphone = JSON.parse(localStorage.getItem('phonenumber'));
            if(data.transactorPhone != this.loginphone){
              this.phoneCheckState = true;
              return;
            }
            this.submitInfoFinal(data);
            
          },

          submitInfoFinal(data){
            let authStatus = JSON.parse(localStorage.getItem('user')).authStatus;

            if(!authStatus){
              _server.getAuthentication(data, (res) =>{
                if(res.code == 0){
                  this.phoneCheckState = false;
                  if(res.data.code == '000000'){
                    this.$toast('验证成功！');
                  }else{
                    this.$toast(res.data.msg);
                  }
                }else{
                    this.$toast(res.errMsg);
                }
                this.getCompanyData();
              })
            }else{
              _server.editSave(data, (res) =>{
                if(res.code == 0){
                  if(res.data.code == '000000'){
                    this.$toast('验证成功！');
                  }else{
                    this.$toast(res.data.msg);
                  }
                  this.getCompanyData();
                  this.phoneCheckState = false;
                }else{
                    this.$toast(res.errMsg);
                }
              })
            }
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
.picTitle{
  width: 100px;
  text-align: center;
}
.timeTxtShow{
  font-size: 14px;
  color: #232333;
  padding: 0 20px;
}
</style>
