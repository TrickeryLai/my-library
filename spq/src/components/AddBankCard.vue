<template>
<div>
  <van-nav-bar
    :title="title"
    left-arrow
    fixed
    @click-left="onClickLeft"
    class="top-bg"
  >
    <i class="iconfont icon-previous_step" slot="left"></i>
  </van-nav-bar>
  <div style="padding-bottom: 50px;">
    <van-row class="realName-box-row">
      <van-col span="7" class="realName-content-box-left"><i class="required">*</i>户名</van-col>
      <van-col span="17" class="realName-content-box-right">
        <van-field
          v-model="submitData.hm"
          clearable
          placeholder="户名"
        />
      </van-col>
    </van-row>
    <van-row class="realName-box-row">
      <van-col span="7" class="realName-content-box-left"><i class="required">*</i>账户</van-col>
      <van-col span="17" class="realName-content-box-right">
        <van-field
          v-model="submitData.zh"
          clearable
          placeholder="账户"
        />
      </van-col>
    </van-row>
    <van-row class="realName-box-row">
      <van-col span="7" class="realName-content-box-left"><i class="required">*</i>开户行全称</van-col>
      <van-col span="17" class="realName-content-box-right">
        <van-field
          v-model="submitData.khqc"
          clearable
          placeholder="开户行全称"
        />
      </van-col>
    </van-row>
    <van-row class="realName-box-row">
      <van-col span="7" class="realName-content-box-left"><i class="required">*</i>开户行所在地</van-col>
      <van-col span="17" class="realName-content-box-right">
        <van-field
          v-model="submitData.address"
          clearable
          readonly
          placeholder="请选择开户行所在地"
          @click="choseAddress"
        />
        
      </van-col>
    </van-row>
    <van-row class="realName-box-row">
      <van-col span="7" class="realName-content-box-left"><i class="required">*</i>开户行支行</van-col>
      <van-col span="17" class="realName-content-box-right">
        <van-field
          v-model="submitData.khhzh"
          clearable
          placeholder="开户行支行"
        />
      </van-col>
    </van-row>
    <van-row class="realName-box-row">
      <van-col span="7" class="realName-content-box-left"><i class="required">*</i>大额行号</van-col>
      <van-col span="17" class="realName-content-box-right">
        <van-field
          v-model="submitData.dehh"
          clearable
          placeholder="大额行号"
        />
      </van-col>
    </van-row>
    <van-row class="realName-box-row">
      <van-col span="7" class="realName-content-box-left"><i class="required">*</i>添加类型</van-col>
      <van-col span="17" class="realName-content-box-right">
        <van-radio-group v-model="type" class="text-left">
          <van-radio name="1" class="type-choose">提现银行账户</van-radio>
          <van-radio name="2" class="type-choose">签收银行账户</van-radio>
        </van-radio-group>
      </van-col>
    </van-row>
    <van-button 
      type="info" 
      style="width: 100%;margin-top: 10px;"
      @click="addFn">添加</van-button>
  </div>
  <van-popup v-model="addressChoseState" position="bottom" @close="addressChoseClose">
      <van-area
        :area-list="areaData"
        :value="chosedCode"
        :columns-num="2" 
        title="开户行所在地"
        @confirm="addressConfirm"
        @cancel="addressChoseClose" />
    </van-popup>
</div>
</template>

<script>
  import areaData from '@/server/areaData';
  export default{
    name: 'AddBankCard',
    data(){
      return {
        title: '添加银行账户',
        areaData: areaData,
        type: '1',
        chosedCode: '440300',
        addressChoseState: false,
        submitData: {
          
        }
      }
    },
    created(){
    },
    methods:{
      onClickLeft(){
        window.history.go(-1);
      },
      choseAddress(){
        //选择地址
        this.addressChoseState = true;
      },
      addressChoseClose(){
        this.addressChoseState = false;
      },
      addressConfirm(item){
        this.addressChoseState = false;
        this.chosedCode = item[item.length - 1].code;
        this.submitData.address = this.getAddressStr(item);
      },
      getAddressStr(item){
        if(!item){
          return;
        }
        let result = '';
        item.forEach(i => {
          if(result != i.name){
            result += i.name;
          }
        })
        return result;
      },
      checkedInfo(){
        if(!this.submitData.hm){
          this.$toast('请填写户名！');
          return false;
        }
        if(!this.submitData.zh){
          this.$toast('请填写账户！');
          return false;
        }
        if(!this.submitData.khqc){
          this.$toast('请填写开户行全称！');
          return false;
        }
        if(!this.submitData.address){
          this.$toast('请选择开户行所在地！');
          return false;
        }
        if(!this.submitData.khhzh){
          this.$toast('请填写开户行支行！');
          return false;
        }
        if(!this.submitData.dehh){
          this.$toast('请填写大额行号！');
          return false;
        }
        return true;
      },
      addFn(){
        if(!this.checkedInfo()){
          return;
        }
        if(this.type == 1){
          //提现银行账户
        }else{
          //签收银行账户
        }
      }
    }
  }
</script>
<style scoped>
  .card-box{
    background: dodgerblue;
    border-radius: 10px;
    padding: 10px;
    color: #fff;
    font-size: 14px;
  }
  .realName-content-box{
    margin-top:5px;
  }
  .realName-content-box-left{
    display: inline-block;
    font-size: 14px;
    color: #232333;
    padding-left: 8px;
  }
  .realName-content-box-left .required{
    color: red;
    margin-right: 3px;
  }
  .realName-content-box-right .van-field{
    padding-left: 0;
  }
  .realName-box-row{
    display: flex;
    justify-content:center;
    align-items:Center;
    background: #fff;
  }
  .type-choose{
    display:inline-block;
    font-size: 14px;
    margin: 0 5px;
  }
</style>

