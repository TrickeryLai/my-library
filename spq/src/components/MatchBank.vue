<template>
  <div>
    <van-nav-bar
      left-arrow
      fixed
      @click-left="onClickLeft"
      @click-right="onClickRight"
      class="top-bg"
    >
      <span slot="title" class="top-bg-title">{{title}}</span>
      <i class="iconfont icon-previous_step top-bg-title" slot="left"></i>
      <i class="iconfont icon-add top-bg-title" slot="right"></i>
    </van-nav-bar>
    <div style="padding-top: 0px;text-align: left;">
      <van-tabs
        v-model="active"
        sticky
        :offset-top="46"
        swipeable
        lazy-render
        color="#1989fa"
      >
        <van-tab title="提现银行账户">
          <BankList
            :listData="ListData"
            :type="active"
          />
        </van-tab>
        <van-tab title="签收银行账户">
          <BankList
            :listData="ListData"
            :type="active"
          />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
  import  BankList from '@/components/BankList.vue';

  import _common from '@/server/index';
  import _server from '@/server/server';
  export default{
    name: 'MatchBank',
    components:{BankList},
    data(){
      return{
        title: '银行账户设置',
        active: '0',// 0 ，提现账户，1，签收账户
        ListData: [
        ]
      }
    },
    created(){
        // this.onChangeTabs(this.active);
    },
    watch: {
      active(newV){    
        this.onChangeTabs(newV);   
      }
    },
    methods: {
      onClickLeft(){
        window.history.go(-1);
      },
      onClickRight(){
        this.$router.push({path:'/home/selfInfo/addBankCard'});
      },
      onChangeTabs(active){
        if(active == 0){
          //提现银行账户
          this.getListData(1);
        }else{
          //签收银行账户
          this.getListData(2);
        }
      },
      getListData(type = 1){
        let data = {
          pageSize: 10000,
          pageNum: 1,
          accountType: type
        }
        _server.getCompanyAccount(data).then(response => {
          if(response.code == 0){
            this.ListData = response.list;
          }else{
            this.$toast(response.errMsg);
          }
        }).catch(error => {

        })
      },
      gotoChange(){
        this.$router.push({path:'/home/selfInfo/changePassword'});
      }
    }
  }
</script>
