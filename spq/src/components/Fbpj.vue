<template>
  <div>
    <van-nav-bar
      :title="title"
      left-arrow
      fixed
      @click-left="onClickLeft"
      class="top-bg"
      :z-index = "zIndex"
    />
    <div class="realName-content">
      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">上传票面</h3>
        <div class="realName-conten-inner">
          <div style="display:inline-block;margin-right: 5px;">
            <UploadImg
            uploadUrl = "test"
            @removePic='sfzzRemovePic'
            @uploadPicProgress='sfzzUploadPicFn' />
            <p class="picTitle" @click="showPjPic(1)"><span style="color: red;">*</span>票据正面<span class="blue-font">示例</span></p>
          </div>
          <div style="display:inline-block;margin-right: 10px;">
            <UploadImg
            uploadUrl = "test"
            @removePic='sfzzRemovePic'
            @uploadPicProgress='sfzzUploadPicFn' /> 
            <p class="picTitle" @click="showPjPic(2)"><span style="color: red;">*</span>票据背面<span class="blue-font">示例</span></p>
          </div>
        </div>
      </van-cell-group>

      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">票面信息</h3>
        <div class="realName-conten-inner">
          <van-cell-group>
            <van-field
            v-model="submitData.companyName"
            required
            clearable
            label="票据号码"
            placeholder="可从网银复制（30位数字）"
            />
            <van-field
            v-model="submitData.companyEmail"
            required
            clearable
            label="票面金额(元)"
            placeholder="请输入金额"
            />
            
            <van-row>
              <van-col span="18">
                <van-field 
                label="到期日期"
                required
                @click="choseTimeFn2" 
                v-model="endTimeChoseValue" 
                readonly 
                style="padding-top:3px;padding-bottom:3px
                "/>
              </van-col>
              <van-col span="6">
                <span style="vertical-align: -12px;" class="blue-font">剩余天数 {{lastDay}}</span>
              </van-col>
              
            </van-row>
            
            <van-field
            v-model="submitData.address"
            required
            label="承兑人全称"
            placeholder="请输入承兑人全称"
            />

            <van-row>
              <van-col span="6">
                <span style="color: red;">*</span>票据瑕疵
              </van-col>
              <van-col span="18" @click="choseXc">
                无
              </van-col>
            </van-row>
          </van-cell-group>
        </div>
      </van-cell-group>

      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">卖出价格</h3>
        <div class="realName-conten-inner">
          <van-cell-group>
            <van-field
            v-model="submitData.frName"
            required
            clearable
            label="姓名："
            placeholder="法人姓名"
            />
            <van-field
            v-model="submitData.frIdCard"
            required
            clearable
            label="身份证号："
            placeholder="法人身份证号"
            />
             <van-field
            v-model="submitData.frPhone"
            type="phone"
            required
            clearable
            label="手机号："
            placeholder="法人手机号"
            />
          </van-cell-group>
        </div>
      </van-cell-group>
    </div>
    <van-popup v-model="picShowModel" position="center" @close="picShowModelClose">
        <img :src="showImg" style="width: 100%;">
    </van-popup>
    <van-popup v-model="timeChoseValue" position="bottom" @close="timeModelClose">
      <van-datetime-picker
      v-model="currentDate"
      type="date"
      :min-date="minDate"
      :formatter="formatter"
      @confirm="timeChoseConfirm"
      @cancel="timeChoseCancel"
      />
    </van-popup>
  </div>
</template>

<script>
import  img from '@/assets/logo.png'
import  img1 from '@/assets/logo.png'
import  img2 from '@/assets/logo.png'

  export default{
      name: 'Fbpj',
      data(){
          return{
              title: '票据发布',
              zIndex: 99,
              endTimeChoseValue: '',
              timeChoseValue: false,//时间选择弹窗
              picShowModel: false,//图片查看弹窗
              currentDate: '',
              lastDay: 0,//剩余天数
              minDate: new Date(),
              submitData:{

              },
              showImg: '',//图片查看当前展示的图片
              sfzzPic: '',
              sfzzPicUState: {
                state: 0,//上传状态 0未上传， 1正在上传， 2上传成功
                
              },
              sfzfPic: '',
              sfzfPicUState: {
                state: 0,//上传状态 0未上传， 1正在上传， 2上传成功
                
              },
              xc:[
                {
                  name: ''
                }
              ]
          }
      },
      methods: {
          onClickLeft(){
              window.history.go(-1);
          },
          getTime(t = new Date()){
            let date ='', time = new Date(t);
            date += time.getFullYear() + '年';
            date += (time.getMonth() + 1) + '月';
            date += time.getDate() + '日';
            return date;
          },
          getLastDay(t){
            let nowT = new Date(), toT = new Date(t), lastT = 0;
            lastT = Math.ceil((toT - nowT)/(24*60*60*1000));
            return lastT
          },
          showPjPic(type){
              this.picShowModel = true;
              if(type == 1){
                this.showImg = img;
              }
              if(type == 2){
                this.showImg = img1;
              }
              if(type == 3){
                this.showImg = img2;
              }
          },
          picShowModelClose(){
            this.picShowModel = false;
          },
          choseTimeFn2(type){
            this.timeChoseValue = true;
          },
          timeModelClose(){
              this.timeChoseValue = false;
          },
          timeChoseConfirm(v){
            this.endTimeChoseValue = this.getTime(v);
            this.lastDay = this.getLastDay(v);
            this.timeModelClose();
          },
          timeChoseCancel(){
            this.timeModelClose();
          },
          formatter(type, value) {
            if (type === 'year') {
              return `${value}年`;
            } else if (type === 'month') {
              return `${value}月`
            }
            return value;
          },
          choseXc(){
            //瑕疵
          },
          //身份证正面
          sfzzRemovePic(){
              this.frPicUState.state = 0;
              this.frPic = '';
          },
          sfzzUploadPicFn(data){
              //营业执照上传
              this.frPicUState.state = data.state;
              console.log('fr正在上传')
              if(data.state == 3){
                  console.log('fryyzz上传成功')
                  this.frPic = data.imgData
              }
          },
          //身份证反面
          sfzfRemovePic(){
              this.frPicUState.state = 0;
              this.frPic = '';
          },
          sfzfUploadPicFn(data){
              //营业执照上传
              this.frPicUState.state = data.state;
              console.log('fr正在上传')
              if(data.state == 3){
                  console.log('fryyzz上传成功')
                  this.frPic = data.imgData
              }
          },
          submitInfo(){
            //提交信息
          }
      },
  }
</script>

<style scoped>
.text-left{
  text-align: left;
}
.title{
  text-align: left;
  color: #000;
  font-weight: normal;
  padding: 5px;
  font-size: 16px;
}
.title::before{
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #0079f3;
  vertical-align: 2px;
  margin-right: 7px;
}
.realName-conten-inner{
  padding: 5px;
  position: relative;
  text-align: left;
}
.picTitle{
  font-size: 12px;
  color:#000;
  padding: 5px;
  text-align: center;
}
.realName-content{
  padding-bottom: 50px;
}
.realName-content-box{
  margin-top:5px;
}
</style>
