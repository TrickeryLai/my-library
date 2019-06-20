<template>
  <div style="padding: 10px 10px 70px;">
    <div
    v-for="(item, index) in data"
    @key="index"
    @click="gotoDetail(item)"
    v-if="item.status != 3 && item.status != 1"
    >
    <div class="card-box">
      <van-row class="card-box-line">
        <van-col span="18" style="font-size:18px;">
          {{item.bankName}}
          <span style="font-size: 12px;">{{getAdress(item.bankProvince, item.bankCity)}}</span>
        </van-col>
        <van-col span="6">
          <span class="init-item" v-if="item.isDefaultSign === 'Y'">默认账户</span>
        </van-col>
      </van-row>
      <van-row class="card-box-line" style="height: 30px;">
        <van-col span="18">
          {{item.bankSubbranch}}
        </van-col>
        <van-col span="6" style="text-align: center;" >
              <van-button
                style="width: 100%;max-width: 100px;font-size: 12px;"
                type="default"
                size="small"
                v-if="item.isDefaultSign !== 'Y' && item.status == 2"
                @click.stop="changeType(item)"
              >
                设为默认
              </van-button>

               <van-button
                style="width: 100%;max-width: 100px;font-size: 12px;"
                type="default"
                size="small"
                v-if="item.status == 0 || item.status == 4"
                @click.stop="gotoDetail(item)"
              >
                激活
              </van-button>
        </van-col>
            <!-- <van-col span="12">
              户名
            </van-col> -->
      </van-row>
      <van-row class="card-box-line" >
          <van-col span="24" style="font-size: 18px;padding-top:10px;">
            {{dealNumber(item.accountNo)}}
          </van-col>
      </van-row>
    </div>
  </div>
  </div>
  </template>

  <script>
  import _common from '@/server/index';
  import _server from '@/server/server';
  export default{
    name: 'BankList',
    props:['listData', 'type'],
    data(){
      return {
        data: this.listData,
        listType: this.type,
        btnTxt: ''
      }
    },
    watch:{
      listData(newV){
        this.data = newV; 
      },
      type(newV){
        this.listType = newV;
      }
    },
    methods:{
      changeType(item){
        //修改默认账户
        _server.modifyDefaultAccount(item.accountId).then(response => {
          if(response.code == 0){
            this.$toast('操作成功！');
            this.$emit('refresh');
          }
        }).catch(error => {

        })
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
      dealNumber(n){
        return _common.common_fn.dealPrice(n, 4, ' ');
      },
      gotoDetail(item){
        
        switch(item.status - 0){

          case 0:
          //未认证--信息已提交但是未小额验证
          this.$router.push({path:'/home/selfInfo/addBankCardCommon',query: {accountId: item.accountId}});
          return;
          case 1:
          //账户认证失败--信息可以修改， 重新提交
          this.$router.push({path:'/home/selfInfo/addBankCardCommon',query: {accountId: item.accountId}});
          return;

          case 2:
          //账户认证成功
          this.$router.push({path:'/home/selfInfo/bankDetailInfo',query: {item: JSON.stringify(item)}});
          return;

          case 3:
          //账户--解绑
          this.$router.push({path:'/home/selfInfo/addBankCardCommon',query: {accountId: item.accountId}});
          return;

          case 4:
          //账户未激活-- 小额验证成功， 未激活
          this.$router.push({path:'/home/selfInfo/addBankCardCommon',query: {accountId: item.accountId}});
          return;
        }
      }
    }
  }
  </script>
  <style scoped>
  .card-box{
    background: -webkit-linear-gradient(left, #400 , #f00); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #400 , #f00); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #400 , #f00); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #400 , #f00); /* 标准的语法 */
    border-radius: 10px;
    padding: 20px 10px;
    color: #fff;
    font-size: 14px;
    margin-bottom: 10px;
    box-shadow: 1px 1px 1px 1px #000;
    position: relative;
  }
  .card-box-line{
    padding: 3px;
  }
  .init-item{
    float: right;
    transform: scale(.8);
  }
  .init-item::before{
    content: '';
    width:8px;
    height: 8px;
    margin-right:4px;
    border-radius: 50%;
    vertical-align: middle;
    background: #fff;
    display:inline-block;

  }
  </style>
