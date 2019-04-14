<template>
  <div style="padding-bottom: 50px;">
    <van-nav-bar
      :title="title"
      left-arrow
      fixed
      right-text="修改"
      @click-left="onClickLeft"
      @click-right="onClickRight"
      class="top-bg"
    >
      <i class="iconfont icon-previous_step" slot="left"></i>
    </van-nav-bar>
    <van-cell-group class="baseInfo-box">
      <van-row class="baseInfo-box-row">
            <van-col span="8" class="baseInfo-box-left">企业名称:</van-col>
            <van-col span="16" class="baseInfo-box-right">{{baseInfo.companyName || '-'}}</van-col>
        </van-row>
        <van-row class="baseInfo-box-row">
            <van-col span="8" class="baseInfo-box-left">统一社会信息代码:</van-col>
            <van-col span="16" class="baseInfo-box-right">{{baseInfo.organizationCode || '-'}}</van-col>
        </van-row>
        <van-row class="baseInfo-box-row">
          <van-col span="8" class="baseInfo-box-left">联系人邮箱:</van-col>
          <van-col span="16" class="baseInfo-box-right">{{baseInfo.contactEmail || '-'}}</van-col>
        </van-row>
        <van-row class="baseInfo-box-row">
          <van-col span="8" class="baseInfo-box-left">联系人手机:</van-col>
          <van-col span="16" class="baseInfo-box-right">{{baseInfo.contactPhone || '-'}}</van-col>
        </van-row>
        <van-row class="baseInfo-box-row">
          <van-col span="8" class="baseInfo-box-left">注册地址:</van-col>
          <van-col span="16" class="baseInfo-box-right">{{baseInfo.registerAddress || '-'}}</van-col>
        </van-row>
    </van-cell-group>
    <van-cell-group class="baseInfo-box">
      <van-row class="baseInfo-box-row">
        <van-col span="8" class="baseInfo-box-left">法人姓名:</van-col>
        <van-col span="16" class="baseInfo-box-right">{{baseInfo.legalPerson || '-'}}</van-col>
      </van-row>
      <van-row class="baseInfo-box-row">
        <van-col span="8" class="baseInfo-box-left">法人手机号:</van-col>
        <van-col span="16" class="baseInfo-box-right">{{baseInfo.legalPersonPhone || '-'}}</van-col>
      </van-row>
      <van-row class="baseInfo-box-row">
        <van-col span="8" class="baseInfo-box-left">法人身份证号码:</van-col>
        <van-col span="16" class="baseInfo-box-right">{{baseInfo.legalPersonIdNo || '-'}}</van-col>
      </van-row>
      
    </van-cell-group>
    <van-cell-group class="baseInfo-box">
      <van-row class="baseInfo-box-row">
        <van-col span="8" class="baseInfo-box-left">经办人姓名:</van-col>
        <van-col span="16" class="baseInfo-box-right">{{baseInfo.transactor || '-'}}</van-col>
      </van-row>
      <van-row class="baseInfo-box-row">
        <van-col span="8" class="baseInfo-box-left">经办人手机号:</van-col>
        <van-col span="16" class="baseInfo-box-right">{{baseInfo.transactorPhone || '-'}}</van-col>
      </van-row>
      <van-row class="baseInfo-box-row">
        <van-col span="8" class="baseInfo-box-left">经办人身份证号:</van-col>
        <van-col span="16" class="baseInfo-box-right">{{baseInfo.transactorIdNo || '-'}}</van-col>
      </van-row>
    </van-cell-group>
    <van-cell-group class="baseInfo-box">
      <van-row class="baseInfo-box-row">
        <van-col span="8" class="baseInfo-box-left">图片信息:</van-col>
        <van-col span="16" class="baseInfo-box-right">
          <div v-if="baseInfo.businessLicenseImgPath" style="width: 100px;height: 100px;line-height:100px;border: 1px solid #ccc;display: inline-block;;">
            <img :src="picUrl + baseInfo.businessLicenseImgPath" style="width:100px;max-height: 100px;vertical-align: middle;">
          </div> 
        </van-col>
      </van-row>
    </van-cell-group>
    <van-cell-group class="baseInfo-box">
      <van-button @click="loginOut" type="info" style="width:100%;"> 退出登录 </van-button>
    </van-cell-group>
  </div>
</template>

<script>
   import _server from '@/server/server';
   import _common from '@/server/index';

  export default{
    name: 'BaseInfo',
    data(){
      return{
        title:'基本信息',
        picUrl: _common.picUrl,
        baseInfo: {

        }
      }
    },
    created(){
      this.getBaseInfo();
    },
    methods:{
      onClickLeft(){
        window.history.go(-1);
      },
      onClickRight(){
        this.$router.push({path:'/home/selfInfo/realNameChange',query: {data: JSON.stringify(this.baseInfo)}})
      },
      loginOut(){
        _server.logout({}, (res) => {
          if(res.code == 0){
            localStorage.clear();
            // localStorage.setItem('token', '');
            // localStorage.setItem('user', '');
            this.$router.replace({path:'/login'})
          }
        });
      },
      getBaseInfo(){
        let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')): '',
            _id = user ? user.orgId : '',
            _this = this;

        if(!_id){
          return;
        }
       
        _server.getCompanyData({
          _id,
          success(res){
            if(res){
              _this.baseInfo = res;
              localStorage.setItem('baseInfo', JSON.stringify(res));
            }
          }
        })
      }
    }
  }
</script>

<style scoped>
  .baseInfo-box{
    margin-bottom: 10px;
    font-size: 14px;
  }
  .baseInfo-box-row{
    padding: 5px 0;
  }
  .baseInfo-box-left{
    text-align: right;
  }
  .baseInfo-box-right{
    text-align: left;
    padding-left: 5px;
  }
</style>
