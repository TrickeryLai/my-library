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
            uploadUrl = "open-cp/v1/upload"
            @removePic='pjzRemovePic'
            @uploadPicProgress='pjzUploadPicFn' />
            <p class="picTitle" @click="showPjPic(1)"><span style="color: red;">*</span>票据正面<span class="blue-font">示例</span></p>
          </div>
          <div style="display:inline-block;margin-right: 10px;">
            <UploadImg
            uploadUrl = "open-cp/v1/upload"
            @removePic='pjfRemovePic'
            @uploadPicProgress='pjfUploadPicFn' /> 
            <p class="picTitle" @click="showPjPic(2)"><span style="color: red;">*</span>票据背面<span class="blue-font">示例</span></p>
          </div>
        </div>
      </van-cell-group>

      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">票面信息</h3>
        <div class="realName-conten-inner">
          <van-cell-group>
            <van-field
            v-model="submitData.cpNo"
            required
            clearable
            label="票据号码"
            placeholder="可从网银复制（30位数字）"
            />
            <van-field
            v-model="submitData.cpAmount"
            required
            clearable
            label="票面金额(元)"
            placeholder="请输入金额"
            />
            <van-row>
              <van-col span="23" offset="1" style="font-size: 12px;color :#232333;">{{changeNumToTex(submitData.companyEmail)}}</van-col>
            </van-row>
            
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
                <span style="vertical-align: -12px;font-size:12px;" class="blue-font">剩余天数 {{lastDay}}</span>
              </van-col>
              
            </van-row>
            
            <van-field
            v-model="submitData.acceptor"
            required
            label="承兑人全称"
            placeholder="请输入承兑人全称"
            />

            <van-row class="van-hairline--bottom" style="padding-bottom:5px;padding-top:5px;overflow:hidden;">
              <van-col span="7" style="font-size:14px;padding-left:5px;">
                <span style="color: red;margin-right:4px;">*</span>票据瑕疵
              </van-col>
              <van-col span="17">
                <div @click="choseXc">
                  <span v-if="xcChoseList.length <= 0">无</span>
                  <div v-if="xcChoseList.length > 0">
                    <van-tag type="primary" style="margin: 5px;" v-for="(item, index) in xcChoseList" >{{item.name}}</van-tag>

                  </div>
                </div>
              </van-col>
            </van-row>
            
            <van-row>
              <van-col span="7" style="font-size:14px;padding-left:5px;">
                背书次数
              </van-col>
              <van-col span="17">
                <van-stepper v-model="bsValue" />
              </van-col>
            </van-row>
          </van-cell-group>
        </div>
      </van-cell-group>
      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">可指定买家</h3>
        <div class="realName-conten-inner">
          <van-cell-group>

            <van-field
              v-model="submitData.sellId"
              clearable
              placeholder="可输入买家id"
            />
          </van-cell-group>
        </div>
      </van-cell-group>
      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">卖出价格</h3>
        <div class="realName-conten-inner">

          <van-cell-group>
            <van-row style="font-size: 14px;text-align: center;">
              <van-col span="8">
                每十万扣款(元)
              </van-col>
              <van-col span="8">
                年化利率(%)
              </van-col>
              <van-col span="8">
                成交金额(元)
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8">
                <van-field
                  v-model="sell.deductAmount"
                  clearable
                  placeholder="每十万扣款(元)"
                />
              </van-col>

              <van-col span="8">
                <van-field
                  v-model="sell.approvalApr"
                  clearable
                  placeholder="年化利率(%)"
                />
              </van-col>
              <van-col span="8">
                <van-field
                  v-model="sell.turnVolume"
                  clearable
                  placeholder="成交金额(元)"
                />
              </van-col>
            </van-row>
          </van-cell-group>
          <div>
            <van-row>
              <van-col span="24">
                <van-button @click="submit" type="info" style="width:100%;">立即发布</van-button>
              </van-col>
            </van-row>

          </div>
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
    <van-popup v-model="xcModelState" position="bottom" @close="xcModelClose" style="padding:10px;">
      <van-tag :plain="xcChoseList.length>0" type="primary" style="padding:5px;margin: 5px;" @click="choseNoXc">无</van-tag>
      <van-tag style="padding:5px;margin: 5px;" :plain="isXcItemChosed(item)" type="primary" v-for="(item, index) in xcList" @click="choseXcItem(item)">{{item.name}}</van-tag>
    </van-popup>

  </div>
</template>

<script>
import  img from '@/assets/logo.png'
import  img1 from '@/assets/logo.png'
import  img2 from '@/assets/logo.png'

import _server from '@/server/server'

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
              minDate: new Date(new Date().getTime() + 24*60*60*1000),
              bsValue: 0,//背书次数
              sell:{
                
              },
              submitData:{

              },
              showImg: '',//图片查看当前展示的图片
              pjzPic: '',
              pjzPicUState: {
                state: 0,//上传状态 0未上传， 1正在上传， 3上传成功
                
              },
              pjfPic: '',
              pjfPicUState: {
                state: 0,//上传状态 0未上传， 1正在上传， 3上传成功
                
              },
              xcModelState: false,//瑕疵弹窗状态
              xcChoseList: [],
              xcList:[
                {
                  name: '同名',
                  value: 'tm'
                },
                {
                  name: '回头',
                  value: 'ht'
                },
                {
                  name: '保理',
                  value: 'bl'
                },
                {
                  name: '质押',
                  value: 'zy'
                },
                {
                  name: '担保',
                  value: 'db',
                },
                {
                  name: '租赁',
                  value:'zl'
                },
                {
                  name: '小贷',
                  value: 'xd'
                },
                {
                  name: '供应链',
                  value: 'gyl'
                },
                {
                  name: '投资',
                  value: 'tz'
                },
                {
                  name:'金融',
                  value:'jr'
                },
                {
                  name: '上下不一致',
                  value: 'sxbyz'
                },
                {
                  name: '不可转让',
                  value: 'bkzr'
                }
              ]
          }
      },
      methods: {
          onClickLeft(){
              window.history.go(-1);
          },
          changeNumToTex(n) {
            if(!n){
              return '';
            }
            if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)){
              return "无效的金额";
            }
            var unit = "千百拾万千百拾亿千百拾万千百拾元角分", str = "";
            n += "00";
            var p = n.indexOf('.');
            if (p >= 0){
              n = n.substring(0, p) + n.substr(p+1, 2);
            }
            unit = unit.substr(unit.length - n.length);
            for (var i=0; i < n.length; i++){
              str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
            }
            return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
          },
          isXcItemChosed(item){
              let len = this.xcChoseList.length, i = 0;
              for(; i < len; i++){
                if(this.xcChoseList[i].value === item.value){
                  return false;
                }
              }
              return true;
          },
          xcModelClose(){
              this.xcModelState = false;
          },
          choseXc(){
            //瑕疵
            this.xcModelState = true;
          },
          choseNoXc(){
            this.xcChoseList = [];
          },
          choseXcItem(item){
              let len = this.xcChoseList.length, i = 0, isHave = false, newArr= [];
              for(; i < len; i++){
                if(this.xcChoseList[i].value === item.value){
                    isHave = true;
                }else{
                    newArr.push(this.xcChoseList[i]);
                }
              }
              if(!isHave){
                newArr.push(item);
              }

              this.xcChoseList = newArr;

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
          pjzRemovePic(){
              //移除图片操作,票据正面
              this.pjzPicUState.state = 0;
              this.pjzPic = '';
          },
          pjfRemovePic(){
              //移除图片操作，票据反面
              this.pjfPicUState.state = 0;
              this.pjfPic = '';
          },
          pjzUploadPicFn(data){
              //营业执照上传
              this.pjzPicUState.state = data.state;
              console.log('fr正在上传')
              if(data.state == 3){
                  console.log('fryyzz上传成功')
                  this.pjzPic = data.imgData.data
              }
          },
          pjfUploadPicFn(data){
              //营业执照上传
              this.pjfPicUState.state = data.state;
              console.log('fr正在上传')
              if(data.state == 3){
                  console.log('fryyzz上传成功')
                  this.pjfPic = data.imgData.data
              }
          },
          choseSell(){

          },
          submit(){
            //立即发布
            //
            //商票录入 {channel (string): 渠道：01-WEB；02-公众号
          // cpCommercialPaperInfos (Array[商票信息表]): 商票列表
          // }
          // 商票信息表 {acceptor (string): 承兑人
          //  ,
          // approvalApr (number, optional): 年利率
          //  ,
          // backBillImg (string): 反面票据
          //  ,
          // buyerId (string, optional): 买家id
          //  ,
          // cpAmount (number): 票面金额
          //  ,
          // cpDefect (string, optional): 票据瑕疵
          //  ,
          // cpNo (string): 票据号码
          //  ,
          // deductAmount (number, optional): 每十万扣款
          //  ,
          // dueDate (string): 到期日
          //  ,
          // endorseTimes (integer): 背书次数
          //  ,
          // frontBillImg (string): 正面票据
          //  ,
          // isDefect (string, optional): 有无瑕疵
          //  ,
          // turnVolume (number): 成交金额（发布金额）
          // }
            //
            let data = {
              channel: 2,
              acceptor: this.submitData.acceptor,
              approvalApr: this.sell.approvalApr, 
              buyerId: '',
              cpAmount: this.submitData.cpAmount,
              cpDefect: this.xcChoseList.join(','),
              cpNo: this.submitData.cpNo,
              dueDate: this.endTimeChoseValue,
              endorseTimes: this.bsValue,
              deductAmount: this.sell.deductAmount,
              frontBillImg: this.pjzPic,
              backBillImg: this.pjfPic,
              isDefect: this.isDefect,
              turnVolume: this.sell.turnVolume

            };
            _server.getCommercialPaper(data, () =>{

            })
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
