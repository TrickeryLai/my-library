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
      <van-cell-group class="">
        <h3 class="title van-hairline--bottom">上传票面</h3>
        <div class="realName-conten-inner">
          <div style="display:inline-block;margin-right: 5px;">
            <UploadImg
            uploadUrl = "open-cp/v1/upload"
            :initPic = "pjzPic"
            @removePic='pjzRemovePic'
            @uploadPicProgress='pjzUploadPicFn' />
            <p class="picTitle" @click="showPjPic(1)"><span style="color: red;">*</span>票据正面<span class="blue-font">示例</span></p>
          </div>
          <div style="display:inline-block;margin-right: 10px;">
            <UploadImg
            uploadUrl = "open-cp/v1/upload"
            :initPic = "pjfPic"
            @removePic='pjfRemovePic'
            @uploadPicProgress='pjfUploadPicFn' /> 
            <p class="picTitle" @click="showPjPic(2)"><span style="color: red;">*</span>票据背面<span class="blue-font">示例</span></p>
          </div>
        </div>
      </van-cell-group>

      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">票面信息</h3>
        <div class="realName-conten-inner">
            <van-row class="realName-box-row">
              <van-col span="7" class="realName-content-box-left"><i class="required">*</i>票据号码&nbsp{{submitData.cpNo && submitData.cpNo.toString().length}}</van-col>
              <van-col span="17" class="realName-content-box-right">
                 <van-field
                 v-model="submitData.cpNo"
                 clearable
                 placeholder="可从网银复制（30位数字）"
                 />
              </van-col>
            </van-row>
            <van-row class="realName-box-row">
              <van-col span="7" class="realName-content-box-left"><i class="required">*</i>票面金额(元)</van-col>
              <van-col span="17" class="realName-content-box-right">
                 <van-field
                 v-model="submitData.cpAmount"
                 clearable
                 placeholder="请输入金额(元)"
                 />
              </van-col>
            </van-row>
            <van-row>
              <van-col span="24" style="font-size: 12px;color :#232333;text-align:center;">{{changeNumToTex(submitData.cpAmount)}}</van-col>
            </van-row>
            
            <van-row class="realName-box-row">
              <van-col span="7" class="realName-content-box-left"><i class="required">*</i>到期日期</van-col>
              <van-col span="11" class="realName-content-box-right">
                <van-field @click="choseTimeFn2" 
                  v-model="endTimeChoseValue" 
                  readonly 
                  style="padding-top:3px;padding-bottom:3px"
                  />
                <!--  <van-field
                 v-model="endTimeChoseValue"
                 clearable
                 placeholder="请输入金额(元)"
                 /> -->
              </van-col>
              <van-col span="6">
                <span class="blue-font" style="font-size:12px;">剩余天数 {{lastDay}}</span>
              </van-col>
            </van-row>
            
             <van-row class="realName-box-row">
              <van-col span="7" class="realName-content-box-left"><i class="required">*</i>承兑人全称</van-col>
              <van-col span="17" class="realName-content-box-right">
                 <van-field
                 v-model="submitData.acceptor"
                 clearable
                 placeholder="请输入承兑人全称"
                 />
              </van-col>
            </van-row>
            <van-row class="realName-box-row">
              <van-col span="7" class="realName-content-box-left">
                背书次数
              </van-col>
              <van-col span="17">
                <van-stepper 
                v-model="bsValue"
                min="0"
                 />
              </van-col>
            </van-row>
            <van-row class="realName-box-row" style="padding-top: 8px;padding-bottom: 5px;">
              <van-col span="7" class="realName-content-box-left">
                票据瑕疵
              </van-col>
              <van-col span="17">
                <div @click="choseXc">
                  <span v-if="xcChoseList.length <= 0">无</span>
                  <div v-if="xcChoseList.length > 0">
                    <van-tag 
                    type="primary" 
                    style="margin: 5px;padding:6px;" 
                    v-for="(item, index) in xcChoseList"
                    :key="index" 
                    >{{item.name}}</van-tag>

                  </div>
                </div>
              </van-col>
            </van-row>
        </div>
      </van-cell-group>

      <van-cell-group class="realName-content-box" v-if="pageType == 0">
        <h3 class="title van-hairline--bottom">可指定用户买家</h3>
        <div class="realName-conten-inner">
          <van-field
            v-model="submitData.buyerId"
            clearable
            placeholder="可输入买家id"
          /> 
        </div>
      </van-cell-group>
      <van-cell-group class="realName-content-box">
        <h3 class="title van-hairline--bottom">卖出价格<span style="font-size:12px;">(可设置其中一项)</span></h3>
        <div class="realName-conten-inner">
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
                  @input="typeChange(1)"
                  clearable
                  placeholder="每十万扣款(元)"
                />
              </van-col>

              <van-col span="8">
                <van-field
                  v-model="sell.approvalApr"
                  @input="typeChange(2)"
                  clearable
                  placeholder="年化利率(%)"
                />
              </van-col>
              <van-col span="8">
                <van-field
                  v-model="sell.turnVolume"
                  @input="typeChange(3)"
                  clearable
                  placeholder="成交金额(元)"
                />
              </van-col>
            </van-row>
        </div>
      </van-cell-group>
      <div>
        <van-row>
          <van-col span="24">
            <van-button v-if="pageType == 0" @click="submit" type="info" style="width:100%;">立即发布</van-button>
            <van-button v-if="pageType == 1" @click="change" type="info" style="width:100%;">修改</van-button>
          </van-col>
        </van-row>
      </div>
    </div>
    <van-popup v-model="picShowModel" position="center" @close="picShowModelClose" style="width: 100%;">
      <div style="width: 100%;">
        <img :src="showImg" style="width: 100%;">
      </div>
    </van-popup>
    <van-popup v-model="timeChoseValue" position="bottom" @close="timeModelClose">
      <van-datetime-picker
      v-model="currentDate"
      type="date"
      :min-date="minDate"
      :max-date="new Date(new Date().getTime() + 366*24*60*60*1000)"
      :formatter="formatter"
      @confirm="timeChoseConfirm"
      @cancel="timeChoseCancel"
      />
    </van-popup>
    <van-popup v-model="xcModelState" position="bottom" @close="xcModelClose" style="padding:10px;">
      <van-tag :plain="xcChoseList.length>0" type="primary" style="padding:10px;margin: 5px;" @click="choseNoXc">无</van-tag>
      <van-tag 
      style="padding:10px;margin: 5px;" 
      :plain="isXcItemChosed(item)" 
      type="primary" 
      v-for="(item, index) in xcList"
      :key="index" 
      @click="choseXcItem(item)"
      >{{item.name}}</van-tag>
    </van-popup>
  </div>
</template>

<script>
import  img from '@/assets/timg.jpg'
import  img1 from '@/assets/pjb.jpg'
import  img2 from '@/assets/timg.jpg'

import _server from '@/server/server'
import _common from '@/server/index'

  export default{
      name: 'Fbpj',
      data(){
          return{
              pageType: 0, //0 发布票据， 1 修改票据
              title: '票据发布',
              zIndex: 999,
              endTimeChoseValue: '',
              timeChoseValue: false,//时间选择弹窗
              picShowModel: false,//图片查看弹窗
              currentDate: '',
              lastDay: 0,//剩余天数
              minDate: new Date(new Date().getTime() + 24*60*60*1000),
              bsValue: 0,//背书次数
              sell:{
                deductAmount: '',
                approvalApr: '',
                turnVolume: ''
              },
              submitData:{
                acceptor: '',//承兑人
                cpAmount: '',//票据金额
                cpNo: ''//票据号码
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
                },
                {
                  name: '其他',
                  value: 'qt'
                }
              ]
          }
      },
      created(){
          this.initType()
      },
      methods: {
          onClickLeft(){
              window.history.go(-1);
          },
          initType(){
              let inData;
              if(this.$route.query.pjData){
                this.pageType = 1;//修改票据
                inData = JSON.parse(this.$route.query.pjData);
                this.initData(inData);
                this.title = '票据修改';
              }else{
                this.pageType = 0;
                this.title = '票据发布';
              }
          },
          initData(data){
              if(!data){
                return;
              }

              this.submitData.acceptor = data.acceptor;
              this.submitData.cpAmount = data.cpAmount;
              this.submitData.cpNo = data.cpNo;
              this.bsValue = data.endorseTimes;
              this.sell.approvalApr = data.approvalApr;
              this.sell.deductAmount = data.deductAmount;
              this.sell.turnVolume = data.turnVolume;
              this.pjzPic = _common.picUrl + data.frontBillImg;
              this.pjfPic = _common.picUrl + data.backBillImg;
              this.currentDate = new Date(data.dueDate);
              this.endTimeChoseValue = this.getTime(data.dueDate);
              this.xcChoseList = this.initXcList(data.cpDefect)

              this.lastDay = this.getLastDay(this.currentDate);
              
              if(data.frontBillImg){
                this.pjzPicUState.state = 3;
              }

              if(data.backBillImg){
                this.pjfPicUState.state = 3;
              }
              
          },
          typeChange(type){
            // this.sell.deductAmount = '';
            // this.sell.approvalApr = '';//年化利率
            // this.sell.turnVolume = '';//成交金额
            let cpAmount = parseFloat(this.submitData.cpAmount),
                calDay = this.lastDay, txje;
                
            if(type == 1){
              this.sell.turnVolume = (cpAmount - (cpAmount/100000)*this.sell.deductAmount).toFixed(2);//成交金额
              this.sell.approvalApr = ((cpAmount -this.sell.turnVolume)*36000/(calDay*cpAmount)).toFixed(8);
            }else if(type == 2){

              txje = ((cpAmount*calDay*(this.sell.approvalApr/100))/360/(cpAmount/100000));
              this.sell.deductAmount =  txje.toFixed(2);//每十万扣款
              this.sell.turnVolume = (cpAmount - cpAmount/100000*txje).toFixed(2);//成交金额
            }else if(type == 3){
              this.sell.deductAmount = ((cpAmount-this.sell.turnVolume)/(cpAmount/100000)).toFixed(2);//每十万扣款
              this.sell.approvalApr = ((cpAmount -this.sell.turnVolume)*36000/(calDay*cpAmount)).toFixed(8);//年华利率
            }
          },
          changeNumToTex(n) {
            return _common.common_fn.changeNumToTex(n);
          },
          initXcList(data){
            let result = [];
            if(!data){
              return result;
            }
            data = data.split(',');

            result = this.xcList.filter((item) => {
                return data.indexOf(item.name) > -1;
            })
            return result;
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
          getTime(t){
            return _common.common_fn.formatterTime(t);
          },
          getLastDay(t){
            return _common.common_fn.getLastTime(t);
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
            this.endTimeTrue = v; 
            this.endTimeChoseValue = this.getTime(v);
            this.lastDay = this.getLastDay(v);
            this.timeModelClose();
          },
          timeChoseCancel(){
            this.timeModelClose();
          },
          formatter(type, value) {
            return _common.common_fn.formatter(type, value);
          },
          formatterTime(v){
            return _common.common_fn.formatterTime(v, 'yyyy-MM-dd');
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
              if(data.state == 3){
                  this.pjzPic = data.imgData.data
              }
          },
          pjfUploadPicFn(data){
              //营业执照上传
              this.pjfPicUState.state = data.state;
              if(data.state == 3){
                  this.pjfPic = data.imgData.data
              }
          },
          choseSell(){

          },
          getXcList(){
            let result = '';
            this.xcChoseList.forEach((item) => {
              result += item.name + ',';
            })
            return result;
          },
          checkSubmitData(){
            if(!this.pjzPic || this.pjzPicUState.state == 0 || this.pjzPicUState.state == 4){
              this.$toast('请上传票据正面图片！')
              return false;
            }
            if(this.pjzPicUState.state == 1){
              this.$toast('票据正面图片正在上传！')
              return false;
            }
            if(!this.pjfPic || this.pjfPicUState.state == 0 || this.pjfPicUState.state == 4){
              this.$toast('请上传票据反面图片！')
              return false;
            }
            if(this.pjfPicUState.state == 1){
              this.$toast('票据反面图片正在上传！')
              return false;
            }
            if(!this.submitData.cpNo || this.submitData.cpNo.toString().length != 30){
              this.$toast('请填写正确的30位票据号！')
              return false;
            }
            if(!this.submitData.cpAmount || !/^(0|[1-9]\d*)(\.\d+)?$/.test(this.submitData.cpAmount)){
              this.$toast('请输入正确的票据金额！')
              return false;
            }
            if(this.submitData.cpAmount < 50000 || this.submitData.cpAmount > 50000000){
              this.$toast('票据金额应在 5万 - 5000万之间！');
              return false;
            }
            if(!this.endTimeChoseValue){
              this.$toast('请选择到期日期！')
              return false;
            }
            if(!this.submitData.acceptor){
              this.$toast('请输入承兑人！')
              return false;
            }
            if(!this.sell.approvalApr || !this.sell.turnVolume || !this.sell.deductAmount){
              this.$toast('请填写报价信息！');
              return false;
            }
            return true;
          },
          change(){
            //修改
            if(!this.checkSubmitData()){
              return;
            }
            let initData = JSON.parse(this.$route.query.pjData);
            let data = {
              acceptor: this.submitData.acceptor,
              approvalApr: this.sell.approvalApr ? parseFloat(this.sell.approvalApr): '', 
              cpAmount: this.submitData.cpAmount,
              cpDefect: this.getXcList(),
              cpNo: this.submitData.cpNo,
              dueDate: this.formatterTime(this.endTimeTrue),
              endorseTimes: this.bsValue,
              deductAmount: this.sell.deductAmount?parseFloat(this.sell.deductAmount): '',
              frontBillImg: _common.common_fn.formateUlr(this.pjzPic),
              backBillImg: _common.common_fn.formateUlr(this.pjfPic),
              turnVolume: this.sell.turnVolume ? parseFloat(this.sell.turnVolume): '',
              cpId: initData.cpId,
            }

            _server.changeCommercialPaper(data, (res) =>{
              if(res.code == 0){
                this.$toast('修改成功！');
                this.$router.go(-1);
              }else{
                this.$toast(res.errMsg);
              }
            })
          },
          submitDataFn(){
            let data = {
              channel: '02',
              buyerId: this.submitData.buyerId,
              cpCommercialPaperInfos: [
                {
                  acceptor: this.submitData.acceptor,
                  approvalApr: this.sell.approvalApr ? parseFloat(this.sell.approvalApr): '', 
                  cpAmount: this.submitData.cpAmount,
                  cpDefect: this.getXcList(),
                  cpNo: this.submitData.cpNo,
                  dueDate: this.formatterTime(this.endTimeTrue),
                  endorseTimes: this.bsValue,
                  deductAmount: this.sell.deductAmount?parseFloat(this.sell.deductAmount): '',
                  frontBillImg: this.pjzPic,
                  backBillImg: this.pjfPic,
                  turnVolume: this.sell.turnVolume ? parseFloat(this.sell.turnVolume): ''
                }
              ]
            };

            _server.getCommercialPaper(data, (res) =>{
                if(res.code == 0){
                  this.$toast('发布成功!');
                  this.$router.go(-1);
                }
            })
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
            
            if(!this.checkSubmitData()){
              return;
            }
            //如果输入了买家id， 则需要先验证买家id是否正确
            if(this.submitData.buyerId){
                _server.checkCommercialPaper({
                  _id: this.submitData.buyerId,
                  success(res){
                      if(res.code == 0){
                        //验证成功，提交
                        this.submitDataFn();
                      }
                  }
                })
            }else{
              this.submitDataFn();
            }  
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
  padding: 7px;
  text-align: center;
}
.realName-content{
  padding-bottom: 50px;
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
}
</style>
