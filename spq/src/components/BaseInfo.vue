<template>
  <div>
    <van-nav-bar
      :title="title"
      left-arrow
      fixed
      @click-left="onClickLeft"
      class="top-bg"
    />
    <van-cell-group class="baseInfo-box">
        <van-row class="baseInfo-box-row">
            <van-col span="8">统一社会信息代码:</van-col>
            <van-col span="16"></van-col>
        </van-row>
        <van-row class="baseInfo-box-row">
          <van-col span="8">企业邮箱:</van-col>
          <van-col span="16"></van-col>
        </van-row>
        <van-row class="baseInfo-box-row">
          <van-col span="8">注册地址:</van-col>
          <van-col span="16"></van-col>
        </van-row>
    </van-cell-group>
    <van-cell-group class="baseInfo-box">
      <van-row class="baseInfo-box-row">
        <van-col span="8">法人姓名:</van-col>
        <van-col span="16"></van-col>
      </van-row>
      <van-row class="baseInfo-box-row">
        <van-col span="8">法人身份证号码:</van-col>
        <van-col span="16"></van-col>
      </van-row>
    </van-cell-group>
    <van-cell-group class="baseInfo-box">
      <van-row class="baseInfo-box-row">
        <van-col span="8">经办人姓名:</van-col>
        <van-col span="16"></van-col>
      </van-row>
      <van-row class="baseInfo-box-row">
        <van-col span="8">经办人手机号:</van-col>
        <van-col span="16"></van-col>
      </van-row>
    </van-cell-group>
    <van-cell-group class="baseInfo-box">
      <van-row class="baseInfo-box-row">
        <van-col span="8">图片信息:</van-col>
        <van-col span="16"></van-col>
      </van-row>
    </van-cell-group>
    <van-cell-group class="baseInfo-box">
      <van-button @click="loginOut" type="info" style="width:100%;"> 退出登录 </van-button>
    </van-cell-group>
  </div>
</template>

<script>
  export default{
    name: 'BaseInfo',
    data(){
      return{
        title:'基本信息'
      }
    },
    methods:{
      onClickLeft(){
        window.history.go(-1);
      },
      loginOut(){
        localStorage.clear();
        // localStorage.setItem('token', '');
        // localStorage.setItem('user', '');
        this.$router.replace({path:'/login'})
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
</style>
