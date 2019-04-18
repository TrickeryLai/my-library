<template>
  <div style="padding: 10px 10px 70px;">
    <div
    v-for="(item, index) in data"
    @key="index"
    @click="gotoDetail(item)"
    >
    <div class="card-box">
      <van-row class="card-box-line">
        <van-col span="18" style="font-size:18px;">
          {{item.bankName}}
          <span style="font-size: 12px;">{{getAdress(item.bankProvince, item.bankCity)}}</span>
        </van-col>
        <van-col span="6">
          <span class="init-item" v-if="item.status == 1">默认账户</span>
        </van-col>
      </van-row>
      <van-row class="card-box-line">
        <van-col span="24">
          {{item.bankSubbranch}}
        </van-col>
            <!-- <van-col span="12">
              户名
            </van-col> -->
          </van-row>
          <van-row class="card-box-line" >
            <van-col span="24" style="font-size: 18px;padding-top:10px;">
              {{dealNumber(item.accountNo)}}
            </van-col>
            <!-- <van-col span="8" style="text-align: center;">
              <van-button
                style="width: 100%;max-width: 100px;font-size: 12px;color: #1989fa;"
                type="default"
                size="small"
                @click.stop="setBasical(item)"
              >设置为默认</van-button>
            </van-col> -->
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
    props:['listData'],
    data(){
      return {
        data: this.listData
      }
    },
    watch:{
      listData(newV){
        this.data = newV;
      }
    },
    methods:{
      setBasical(item){
        //设置为默认
        
      },
      getAdress(pCode, cCode){
        let result =  _common.common_fn.getAddress(pCode, cCode);

        if(pCode == cCode){
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
        this.$router.push({path:'/home/selfInfo/bankDetailInfo',query: {item: JSON.stringify(item)}})
      }
    }
  }
  </script>
  <style scoped>
  .card-box{
    background: #1989fa;
    border-radius: 10px;
    padding: 20px 10px;
    color: #fff;
    font-size: 14px;
    margin-bottom: 10px;
    box-shadow: 1px 1px 1px 1px #1989fa;
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
