<template>
    <div style="padding: 10px;">
      <div
        v-for="(item, index) in data"
        @key="index"
      >
        <div class="card-box">
          <van-row class="card-box-line">
            <van-col span="18">
              开户行全称
            </van-col>
            <van-col span="6">
                  默认账户
            </van-col>
          </van-row>
          <van-row class="card-box-line">
            <van-col span="12">
              开户行支行
            </van-col>
            <van-col span="12">
              户名
            </van-col>
          </van-row>
          <van-row class="card-box-line">
            <van-col span="16">
              **** **** **** 7145
            </van-col>
            <van-col span="8">
              <van-button
                style="width: 100%;max-width: 100px;font-size: 12px;color: #1989fa;"
                type="default"
                size="small"
                @click="setBasical(item)"
              >设置为默认</van-button>
            </van-col>
          </van-row>
        </div>
      </div>
    </div>
</template>

<script>
  export default{
    name: 'BankList',
    props:['listData'],
    data(){
      return {
          data: this.listData
      }
    },
    methods:{
      setBasical(item){
        //设置为默认
        
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
</style>
