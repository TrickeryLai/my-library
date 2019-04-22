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
      <van-col span="7" class="realName-content-box-left"><i class="required">*</i>对公账号</van-col>
      <van-col span="17" class="realName-content-box-right">
        <van-field
          v-model="submitData.accountNo"
          clearable
          placeholder="对公账号"
        />
      </van-col>
    </van-row>
    <van-row class="realName-box-row">
      <van-col span="7" class="realName-content-box-left"><i class="required">*</i>开户行全称</van-col>
      <van-col span="17" class="realName-content-box-right">
        <van-field
          v-model="submitData.bankName"
          clearable
          placeholder="开户行全称"
          readonly
          @click="choseBankName"
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
          v-model="submitData.bankSubbranch"
          clearable
          placeholder="开户行支行"
          
        />
      </van-col>
    </van-row>
    <van-row class="realName-box-row">
      <van-col span="7" class="realName-content-box-left"><i class="required">*</i>大额行号</van-col>
      <van-col span="17" class="realName-content-box-right">
        <van-field
          v-model="submitData.largeAccountNo"
          clearable
          placeholder="大额行号"
        />
      </van-col>
    </van-row>
    </van-row>
    <van-row class="realName-box-row" style="padding-top:10px;padding-bottom: 10px;">
      <van-col span="7" class="realName-content-box-left"><i class="required">*</i>状态</van-col>
      <van-col span="17" class="realName-content-box-right">
        <van-radio-group v-model="submitData.status" class="text-left">
          <van-radio name="1" class="type-choose">
            默认
            <i
              class="iconfont"
              slot="icon"
              slot-scope="props"
              :class="{'icon-active icon-gouxuan': props.checked,'icon-mygou': !props.checked}" ></i>
          </van-radio>
          <van-radio name="0" class="type-choose">
            非默认
            <i
              class="iconfont"
              slot="icon"
              slot-scope="props"
              :class="{'icon-active icon-gouxuan': props.checked,'icon-mygou': !props.checked}" 
              ></i>
          </van-radio>
        </van-radio-group>
      </van-col>
    </van-row>
    <van-button 
      type="info" 
      style="width: 100%;margin-top: 10px;"
      @click="addFn">修改</van-button>
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

    <van-popup v-model="choseBankNameState" position="bottom" @close="choseBankNameClose">
      <van-picker
        show-toolbar
        :default-index="defaultIndex"
        :columns="bankList"
        value-key="bankName"
        @confirm="choseBankNameConfirm"
        @cancel="choseBankNameClose"
      />
    </van-popup>
</div>
</template>

<script>
  import areaData from '@/server/areaData';
  import _common from '@/server/index';
  import _server from '@/server/server';


  export default{
    name: 'AddBankCard',
    data(){
      return {
        title: '添加银行账户',
        areaData: areaData,
        type: '1',
        chosedCode: '440300',
        addressChoseState: false,
        choseBankNameState: false,
        bankList: [],
        defaultIndex: 1,
        submitData: {
          accountNo: '',
          bankName: '',
          bankSubbranch: '',
          largeAccountNo: '',
          accountType: "1",
          status: "1",
          bankName: '',
          addressItem: {},
          bankNameItem: {}
        }
      }
    },
    created(){
      this.initDataFn();
      this.getBankList();
    },
    methods:{
      onClickLeft(){
        window.history.go(-1);
      },
      initDataFn(){
        let addressR;
        this.submitData = JSON.parse(this.$route.query.item);
        this.submitData.address = this.getAdress(this.submitData.bankProvince, this.submitData.bankCity);
        this.chosedCode = this.submitData.bankCity;
        addressR = _common.common_fn.getAddress(this.submitData.bankProvince, this.submitData.bankCity)
        this.submitData.addressItem = [{
            code: this.submitData.bankProvince,
            name: addressR[this.submitData.bankProvince]
          },
          {
            code: this.submitData.bankCity,
            name: addressR[this.submitData.bankCity]
            }]; 
      },
      choseBankNameClose(){
        this.choseBankNameState = false;
      },
      choseBankName(){
        this.choseBankNameState = true;
      },
      choseBankNameConfirm(v){
        this.submitData.bankNameItem = v;
        this.submitData.bankName = v.bankName;
        this.choseBankNameClose()
      },
      getAdress(pCode, cCode){
            let result =  _common.common_fn.getAddress(pCode, cCode);

            if(result[pCode] == result[cCode]){
              result = result[pCode];
            }else{
              result = result[pCode] + result[cCode];
            }
            return result;
      },
      getBankList(){
        _server.getBankList().then(response => {

            this.bankList = response;
            this.bankList.forEach((item, index) => {
              if(item.bankId == this.submitData.bankId){
                this.submitData.bankNameItem = item;
                this.defaultIndex = index;
                return;
              }
              })
          }).then( error =>{

          })
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
        this.submitData.addressItem = item;
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
        if(!this.submitData.accountNo){
          this.$toast('请填写对公账号！');
          return false;
        }
        if(!this.submitData.bankName){
          this.$toast('请填写开户行全称！');
          return false;
        }
        if(!this.submitData.address){
          this.$toast('请选择开户行所在地！');
          return false;
        }
        if(!this.submitData.bankSubbranch){
          this.$toast('请填写开户行支行！');
          return false;
        }
        if(!this.submitData.largeAccountNo){
          this.$toast('请填写大额行号！');
          return false;
        }
        return true;
      },
      addFn(){
        if(!this.checkedInfo()){
          return;
        }
        let id = this.submitData.accountId;
        
        let data = {
          accountType: this.submitData.accountType, //账户类型：1-提现账户；2-签收账户
          accountNo: this.submitData.accountNo, //对公账号
          bankName: this.submitData.accountNo,//开户行全称
          bankProvince: this.submitData.addressItem[0].code,//开户行所在省
          bankCity: this.submitData.addressItem[1].code,//开户行所在市
          bankSubbranch: this.submitData.bankSubbranch,//开户行支行
          largeAccountNo: this.submitData.largeAccountNo,//大额行号
          status: this.submitData.status,//状态：0-非默认；1-默认
          bankId: this.submitData.bankNameItem.bankId,
          pageSize: 1,
          pageNum: 1000
        };

        _server.changeCompanyAccount(id, data).then( response => {
            if(response.code == 0){
                this.$toast('账户修改成功！');
                window.history.go(-1);
                return;
            }
        }).catch(error => {

        })
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
  .icon-mygou{
    border: 1px solid #ccc;
    border-radius: 50%;
    width: 14px;
    height: 14px;
    display:inline-block;
  }
  .icon-active{
    color: #0079f3;
  }
</style>

