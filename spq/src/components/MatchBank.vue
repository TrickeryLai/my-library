<template>
  <div>
    <van-nav-bar
      :title="title"
      left-arrow
      fixed
      @click-left="onClickLeft"
      @click-right="onClickRight"
      class="top-bg"
    >
      <i class="iconfont icon-previous_step" slot="left"></i>
      <i class="iconfont icon-add" slot="right"></i>
    </van-nav-bar>
    <div style="padding-top: 0px;text-align: left;">
      <van-tabs
        v-model="active"
        @click="onChangeTabs"
        sticky
        :offset-top="46"
        swipeable
        color="#1989fa"
      >
        <van-tab title="提现银行账户">
          <BankList
            :listData="ListData"
          />
        </van-tab>
        <van-tab title="签收银行账户">
          <BankList
            :listData="ListData"
          />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
  import  BankList from '@/components/BankList.vue'
  export default{
    name: 'MatchBank',
    components:{BankList},
    data(){
      return{
        title: '银行账户设置',
        active: '0',
        ListData: [
          {}, {}
        ]
      }
    },
    created(){
        this.onChangeTabs(this.active);
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
           this.ListData = [{}]
         }else{
           //签收银行账户
           this.ListData = [{},{}]
         }
      },
      gotoChange(){
        this.$router.push({path:'/home/selfInfo/changePassword'})
      }
    }
  }
</script>
