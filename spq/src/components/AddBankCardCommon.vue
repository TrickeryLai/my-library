<template>
<div>
  <van-nav-bar
    left-arrow
    fixed
    @click-left="onClickLeft"
    class="top-bg"
  >
    <span slot="title" class="top-bg-title">{{title}}</span>
    <i class="iconfont icon-previous_step top-bg-title" slot="left"></i>
  </van-nav-bar>
  <div style="padding-bottom: 50px;">
    <van-row class="realName-box-row">
      <van-col span="7" class="realName-content-box-left"><i class="required">*</i>户名</van-col>
      <van-col span="17" class="realName-content-box-right">
        <van-field
          v-model.trim="submitData.accountName"
          clearable
          :readonly="true"
          placeholder="请输入户名"
        />
      </van-col>
    </van-row>
    <van-row class="realName-box-row">
      <van-col span="7" class="realName-content-box-left"><i class="required">*</i>对公账号</van-col>
      <van-col span="17" class="realName-content-box-right">
        <van-field
          v-model.trim="submitData.accountNo"
          clearable
          :readonly="isCanChange"
          placeholder="请输入对公账号"
        />
      </van-col>
    </van-row>
    <van-row class="realName-box-row">
      <van-col span="7" class="realName-content-box-left"><i class="required">*</i>开户行全称</van-col>
      <van-col span="17" class="realName-content-box-right">
        <van-field
          v-model="submitData.suppBank"
          clearable
          placeholder="请选择开户行全称"
          readonly
          @click="openVanpopou('suppBank')"
        /> 
      </van-col>
    </van-row>
    <van-row class="realName-box-row">
      <van-col span="7" class="realName-content-box-left"><i class="required">*</i>开户行所在省</van-col>
      <van-col span="17" class="realName-content-box-right">
        <van-field
          v-model="submitData.bankProvince"
          clearable
          readonly
          placeholder="请选择开户行所在省"
          @click="openVanpopou('province')"
        />
        
      </van-col>
    </van-row>
    <van-row class="realName-box-row">
      <van-col span="7" class="realName-content-box-left"><i class="required">*</i>开户行所在市</van-col>
      <van-col span="17" class="realName-content-box-right">
        <van-field
          v-model="submitData.bankCity"
          clearable
          readonly
          placeholder="请选择开户行所在市"
          @click="openVanpopou('city')"
          
        />
        
      </van-col>
    </van-row>
    <van-row class="realName-box-row">
      <van-col span="7" class="realName-content-box-left"><i class="required">*</i>开户行支行</van-col>
      <van-col span="17" class="realName-content-box-right">
        <van-field
          v-model.trim="submitData.bankBranch"
          clearable
          placeholder="请选择开户行支行"
          readonly
          @click="openVanpopou('bankBranch')"
          
        />
      </van-col>
    </van-row>
    <!-- <van-row class="realName-box-row">
      <van-col span="7" class="realName-content-box-left"><i class="required">*</i>大额行号</van-col>
      <van-col span="17" class="realName-content-box-right">
        <van-field
          v-model.trim="submitData.largeAccountNo"
          clearable
          :readonly="isCanChange"
          placeholder="请输入大额行号"
        />
      </van-col>
    </van-row> -->
    <van-button 
      v-if="btnTxt"
      type="info" 
      class="baseBtn"
      style="width: 100%;margin-top: 10px;"
      @click="addFn">{{btnTxt}}</van-button>
  </div>

    <van-popup v-if="suppBank.choseState" v-model="suppBank.choseState" position="bottom" @close="closeVanpopou('suppBank')">
      <van-picker
        show-toolbar
        :default-index="suppBank.defaultIndex"
        :columns="suppBank.listData"
        value-key="bankName"
        @confirm="confirmSuppBankPicker"
        @cancel="closeVanpopou('suppBank')"
      />
    </van-popup>

    <van-popup v-if="province.choseState" v-model="province.choseState" position="bottom" @close="closeVanpopou('province')">
      <van-picker
        show-toolbar
        :default-index="province.defaultIndex"
        :columns="province.listData"
        value-key="provName"
        @confirm="confirmProvincePicker"
        @cancel="closeVanpopou('province')"
      />
    </van-popup>

    <van-popup v-if="city.choseState" v-model="city.choseState" position="bottom" @close="closeVanpopou('city')">
      <van-picker
        show-toolbar
        :default-index="city.defaultIndex"
        :columns="city.listData"
        value-key="cityName"
        @confirm="confirmCityPicker"
        @cancel="closeVanpopou('city')"
      />
    </van-popup>

    <van-popup v-if="bankBranch.choseState" v-model="bankBranch.choseState" position="bottom" @close="closeVanpopou('bankBranch')">
      <van-picker
        show-toolbar
        :default-index="bankBranch.defaultIndex"
        :columns="bankBranch.listData"
        value-key="fkhmc1"
        @confirm="confirmBankBranchPicker"
        @cancel="closeVanpopou('bankBranch')"
      />
    </van-popup>

    <van-dialog
      v-model="inputWrap"
      title="金额验证"
      @beforeClose="inputWrapBeforeClose"
      @confirm="inputWrapConfirm"
      show-cancel-button
    >
      <van-field
          v-model.trim="inputWrapValue"
          clearable
          placeholder="请输入金额（元）"
        />
    </van-dialog>

</div>
</template>

<script>
  // import areaData from '@/server/areaData';
  import _server from '@/server/server';
  export default{
    name: 'AddBankCardCommon',
    data(){
      return {
        title: '添加银行账户',
        btnTxt: '下一步',
        initPageData: {},
        isCanChange: false,//输入框是否能修改 true 不能， false 能
        inputWrap: false,//输入金额弹窗,显示状态
        inputWrapValue: '',
        accountId: '',//accountId 通过id 查询当前绑卡的信息及状态
        suppBank: {
          choseState: false,
          listData: [],
          choseItem: {},
          defaultIndex: 0
        },
        province: {
          choseState: false,
          listData: [],
          choseItem: {},
          defaultIndex: 0
        },
        city: {
          choseState: false,
          listData: [],
          choseItem: {},
          defaultIndex: 0
        },
        bankBranch: {
          choseState: false,
          listData: [],
          choseItem: {},
          defaultIndex: 0
        },
        submitData: {
          suppBank: '',
          bankProvince:　'',
          bankCity: '',
          bankBranch: '',
          accountName: '',
          accountNo: ''
        }
      }
    },
    created(){
      console.log(123);
      this.getQueryData().then(() => {
        if(this.accountId){
          this.getCompanyData().then( () => {
            this.getSuppBanks();
            this.getAllProvince();
          })
        }else{
          this.submitData.accountName = JSON.parse(localStorage.getItem('user')).companyName ? JSON.parse(localStorage.getItem('user')).companyName : '';
          this.getSuppBanks();
          this.getAllProvince();
        }
      });
    },
    watch: {
    　　'$route' (to, from) {
          this.getQueryData().then(() => {
            if(this.accountId){
              this.getCompanyData().then( () => {
                this.getSuppBanks();
                this.getAllProvince();
              })
            }else{
              this.submitData.accountName = JSON.parse(localStorage.getItem('user')).companyName ? JSON.parse(localStorage.getItem('user')).companyName : '';
              this.getSuppBanks();
              this.getAllProvince();
            }
          });
    　　}
    },
    methods:{
      onClickLeft(){
        window.history.go(-1);
      },

      getQueryData(){
        //获取地址携带的accountId
        return new Promise((resolve, reject) => {
          if(this.$route.query.accountId){
            this.accountId = this.$route.query.accountId;
          }
          return resolve();
        })
      },

      getCompanyData(callback){
        return new Promise((resolve, reject) => {
          //通过accountId 查询数据
          const accountId = this.accountId;
           _server.getBankData(accountId).then((res)=>{
              this.initPageData = res;
              this.submitData.accountName = res.accountName;//户名
              this.submitData.accountNo = res.accountNo;//对公账号
              return resolve();
          })
        })
      },

      initPageType(){
        let authStatus = this.initPageData.status;
        switch (authStatus - 0){

          case 0:
            //未认证--信息已提交但是未小额验证 - 不可修改
            this.$router.replace({path: 'checkMoneyCommon', query:{accountId: this.accountId}});
            this.isCanChange = true;
            this.btnTxt='验证金额';
            return false;
          case 1:
            //账户认证失败--信息可以修改， 重新提交
            
            this.isCanChange = false;
            this.btnTxt='下一步';
            return false;
          case 2:
            //账户认证成功
            this.$router.replace({path: 'checkMoneyCommon', query:{accountId: this.accountId}});
            this.isCanChange = true;
            this.btnTxt = '';
            return false;
          case 3:
            //账户--解绑
            this.isCanChange = true;
            this.btnTxt = '';
            return;
          case 4:
            //账户未激活-- 小额验证成功， 未激活
            this.$router.replace({path: 'checkMoneyCommon', query:{accountId: this.accountId}});
            this.isCanChange = true;
            this.btnTxt = '激活';
            return;   
          default:
            //还没开始小额打款
  
            this.isCanChange = false;
            this.btnTxt = '下一步';
            return;
        }
      },
      inputWrapConfirm(action, done){
        if(!this.inputWrapValue){
          this.$toast('请先输入收到的金额!');
          return;
        }
        _server.verifyBindCardAccount({
          money:this.inputWrapValue,
          bankCardNo: this.initPageData.accountNo
        }).then(res=>{
          if(res.code == 0){
            if(res.data && res.data.availableVeriCount == 0){
              this.$toast('请点击下一步重新提交，查看最新金额并输入！')
            }else{
              if(res.data && res.data.remoteErrorMsg){
                this.$toast(res.data.remoteErrorMsg);
              }
            }
            
            if(res.data && res.data.acActiveUrl){
              window.open(res.data.acActiveUrl);
              return;
            }

            if( res.data && res.data.openStatus){
              this.initPageData.status = res.data.openStatus;
              this.initPageType();
            }
           
          }
          
        }).catch(error => {

        })
      },
      inputWrapBeforeClose(){
        this.inputWrap = false;
      },
      closeVanpopou(itemName){
        this[itemName].choseState = false;
      },
      openVanpopou(itemName){
        //如果不能修改，不弹窗时间
        if(this.isCanChange){
          return;
        }

        if(itemName == 'city' && !this.submitData.bankProvince){
          this.$toast('请先选择开户行所在省！');
          return;
        }
        if(itemName == 'bankBranch' && !this.submitData.suppBank){
          this.$toast('请先选择开户行支行！');
          return;
        }
        if(itemName == 'bankBranch' && (!this.submitData.bankCity)){
          this.$toast('请先选择开户所在城市！');
          return;
        }
        
        this[itemName].choseState = true;
      },
      confirmSuppBankPicker(v, i){
        this.confirmPicker(v, i, 'suppBank')
        this.submitData.suppBank = v.bankName;
        if(this.suppBank.defaultIndex != i){
          this.submitData.bankBranch = '';
        }
      },
      confirmProvincePicker(v, i){
        this.confirmPicker(v, i, 'province');
        this.getAllCity();

        if(this.province.defaultIndex != i){
          this.submitData.bankCity = '';
          this.submitData.bankBranch = '';
        }

        this.submitData.bankProvince = v.provName;
      },
      confirmCityPicker(v, i){
        this.confirmPicker(v, i, 'city');
        this.getBanks();
        this.submitData.bankCity = v.cityName;

        if(this.city.defaultIndex != i){
          this.submitData.bankBranch = '';
        }
      },

      confirmBankBranchPicker(v, i){
        console.log(v,i)
        this.confirmPicker(v, i, 'bankBranch');
        this.submitData.bankBranch = v.fkhmc1;
      },

      confirmPicker(v, i, itemName){
        this[itemName].choseItem = v;
        this[itemName].defaultIndex = i;
        this[itemName].choseState = false;
      },

      getSuppBanks(){
        //获取开户行全称
        _server.getSuppBanks().then(response => {
          this.suppBank.listData = response;

          if(this.initPageData.bankId){
            response.forEach((item, index) => {
              if(this.initPageData.bankId == item.ubankId){
                this.suppBank.choseItem = item;
                this.suppBank.defaultIndex = index;
                this.submitData.suppBank = item.bankName;
                this.initPageType();
              }
            })
          }
          
        }).catch(error => {

        })
      },

      getAllProvince(){
        //获取省
        _server.getAllProvince().then(response => {
          this.province.listData = response;

          if(this.initPageData.bankProvince){
            response.forEach((item, index) => {
              if(this.initPageData.bankProvince == item.provCode){
                this.province.choseItem = item;
                this.province.defaultIndex = index;
                this.submitData.bankProvince = item.provName;
                this.submitData.provId = item.provCode;
              }
            });
            this.getAllCity(true);
          }
          
        }).catch(error => {

        })
      },

      getAllCity(init){
        //获取市
        let provId = this.province.choseItem.provId;
        _server.getAllCity(provId).then(response => {
          this.city.listData = response;
          if(this.initPageData.bankCity && init){

            response.forEach((item, index) => {
              if(this.initPageData.bankCity == item.cityCode){
                this.city.choseItem = item;
                this.city.defaultIndex = index;
                this.submitData.bankCity = item.cityName;
              }
            });
            this.getBanks(true);
          }
        }).catch(error => {

        })
      },

      getBanks(init){
        //获取支行
        let cityCode = this.city.choseItem.cityCode,
            bankId = this.suppBank.choseItem.bankId;
        _server.getBanks(cityCode, bankId).then(response => {
          this.bankBranch.listData = response;
          if(this.initPageData.bankSubbranchNo && init){
            response.forEach((item, index) => {
              if(this.initPageData.bankSubbranchNo == item.fqhho2){
                this.bankBranch.choseItem = item;
                this.bankBranch.defaultIndex = index;
                this.submitData.bankBranch = item.fkhmc1;
              }
            });
          }
        }).catch(error => {

        })
      },

      openInputAmount(){

      },
      checkedInfo(){
        if(!this.submitData.accountNo){
          this.$toast('请填写对公账号！');
          return false;
        }
        if(!this.submitData.bankBranch){
          this.$toast('请选择开户行支行！');
          return false;
        }
        return true;
      },
      gotoActive(){
        _server.queryOpenAccountUrl().then(response =>{
          window.open(response.acActiveUrl);
        }).catch(error =>{

        })
      },
      gotoOpenAccount(){
        _server.openEAccount().then(resposne => {
          this.getCompanyData(()=>{
              this.initPageType();
          });
        }).catch(error => {

        })
      },
      addFn(){

        if(!this.checkedInfo()){
          return;
        }

        //如果是激活
        if(this.btnTxt == '激活'){
          this.gotoActive();
          return;
        }

        //如果是激活
        if(this.btnTxt == '重新开户'){
          this.gotoOpenAccount();
          return;
        }

        //如果是只读状态，提交，则直接弹窗验证金额
        if(this.isCanChange){
          this.inputWrap = true;
          return;
        }

        
        //如果不显示按钮
        if(!this.btnTxt){
          return;
        }

        let data = {
          accountName: this.submitData.accountName, //户名
          accountNo: this.submitData.accountNo,//对公账号
          bankName: this.suppBank.choseItem.bankName,//开户行全称
          bankId: this.suppBank.choseItem.ubankId,//开户行支行id
          bankProvince: this.province.choseItem.provCode,//开户行所在省
          bankCity: this.city.choseItem.cityCode,//开户行所在市
          bankSubbranch: this.bankBranch.choseItem.fkhmc1,//开户行支行
          bankSubbranchNo: this.bankBranch.choseItem.fqhho2,//开户行支行id
          largeAccountNo: null//大额行号
        };

        if(this.initPageData && this.initPageData.accountId){
          data.accountId = this.initPageData.accountId;
        }

        _server.bindCard(data).then( response => {
            if(response.code == 0){

              if(this.initPageData.accountId){
                //当前有 accoutId ，提交的时候则重新根据accountId 查询
                this.initPageData.status = response.data.status;
                this.initPageType();
              }else{
                this.initPageData.accountId = response.data.accountId;
                this.initPageData.status = response.data.status;
                // this.initPageType();
                setTimeout(()=>{
                  this.$router.replace({path: '/home/selfInfo/addBankCardCommon', query:{ accountId: response.data.accountId}});
                })

              }

            }else{
              this.$toast(response.errMsg);
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

