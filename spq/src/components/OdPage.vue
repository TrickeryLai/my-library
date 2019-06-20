<template>
  <div class="odPage">
    <van-nav-bar
      fixed
      class="top-bg"
    >
      <span slot="title" class="top-bg-title">{{title}}</span>
    </van-nav-bar>
    <div class="tabs">
      <van-tabs
        v-model="active"
        sticky
        :offset-top="46"
        swipeable
        lazy-render
        color="#c00"
      >
        <van-tab title="买入">
          <div class="tab" :style="tabsH">
            <Order 
              @modelChange="OrderModelChange"
              :modelState = 'orderModelState'
            />
          </div>
        </van-tab>
        <van-tab title="卖出">
          <div class="tab" :style="tabsH">
            <TicketHolder 
              @modelChange="TicketModelChange"
              :modelState = 'ticketModelState'
            />
          </div>
          
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
  import Order from '@/components/Order.vue';
  import TicketHolder from '@/components/TicketHolder';

  import _common from '@/server/index';
  import _server from '@/server/server';
  export default{
    name: 'odPage',
    components:{Order, TicketHolder},
    data(){
      return{
        title: '订单',
        active: '0',
        tabsH: {
          height: '400px'
        },
        ticketModelState: false,
        orderModelState: false,
        ListData: [
        ]
      }
    },
    activated(to, from){

    },
    created(){
      if(localStorage.getItem('odActiveTabs')){
        this.active = localStorage.getItem('odActiveTabs');
      }
      
      this.$canScroll();
        // this.onChangeTabs(this.active);
      window.addEventListener('resize', this.getHeight);
      this.getHeight();
      


    },
    mounted(){
      
        
    },
    watch: {
      active(newV){    
        this.onChangeTabs(newV);  
        localStorage.setItem('odActiveTabs', newV); 
      }
    },
    beforeRouteEnter(to, from, next){
      // console.log(to, from, next);
      console.log('beforeRouteEnter');
      next();
    },
    beforeRouteLeave(to, from, next){
      if(to.name == 'Login' || to.name == 'RealName' || to.name == 'RealNameChange' || to.name == 'Rate'){
        next();
        return;
      }
      if(to.name=='Fbpj'){
        next();
        return;
      }
      if(this.ticketModelState){
        this.ticketModelState = false;
        next(false);
        return;
      } 

      if(this.orderModelState){
        this.orderModelState = false;
        next(false);
        return;
      }

      next();
    },
    methods: {
      onChangeTabs(active){
        if(active == 0){
          //全部
          
        }else if(active == 1){
          //买入
          
        }else{
          //卖出
          
        }
      },
      getHeight(){
        var scrollH = window.screen.height;
        this.tabsH.height = scrollH - 195 + 'px';
      },
      TicketModelChange(state){
        this.ticketModelState = state;
      },
      OrderModelChange(state){
        this.orderModelState = state;
      },
      gotoChange(){
        
      }
    }
  }
</script>

<style>
.odPage{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.odPage .tabs{
}
.odPage .tabs .tab{

}

</style>
