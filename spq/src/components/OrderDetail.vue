<template>
  <div>
    <van-popup
      v-model="show"
      position="right"
      :lock-scroll="false"
      @close="modelClose"
    >
      <div class="model-content">
        <div style="height: 100%;overflow:auto;">
          <van-cell-group class="van-hairline--bottom">
            <h3 class="title">票据详情</h3>
            <van-cell-group>
              <van-row class="detail-row">
                <van-col class="detail-row-left" span="6">承兑人</van-col>
                <van-col class="detail-row-right" span="18">{{initData.acceptor}}</van-col>
              </van-row>
              <van-row class="detail-row">
                <van-col class="detail-row-left" span="6">票据号码</van-col>
                <van-col class="detail-row-right" span="18">{{initData.cpNo}}</van-col>
              </van-row>
              <van-row class="detail-row">
                <van-col class="detail-row-left" span="6">票据金额</van-col>
                <van-col class="detail-row-right" span="18">{{initData.cpAmount &&
                  dealPrice(initData.cpAmount.toFixed(2)) }}元
                </van-col>
              </van-row>
              <van-row class="detail-row">
                <van-col class="detail-row-left" span="6">到期时间</van-col>
                <van-col class="detail-row-right" span="18">{{initData.dueDate}}</van-col>
              </van-row>
              <van-row class="detail-row">
                <van-col class="detail-row-left" span="6">票据状态</van-col>
                <van-col class="detail-row-right" span="18">
                  <van-tag round type="success" v-if="initData.cpStatus == 1">发布中</van-tag>
                  <van-tag round type="danger" v-else-if="initData.cpStatus == 2">已成交</van-tag>
                  <van-tag round v-else-if="initData.cpStatus == 3">已注销</van-tag>
                  <van-tag round color="#f2826a" v-else-if="initData.cpStatus == 4">报价中</van-tag>
                  <van-tag round v-if="initData.stringDate < 0">已过期</van-tag>
                </van-col>
              </van-row>
              <van-row class="detail-row">
                <van-col class="detail-row-left" span="6">成交信用</van-col>
                <van-col class="detail-row-left" span="18">
                  <van-tag mark type="success" v-if="initData.creditRating == 1">优秀</van-tag>
                  <van-tag mark type="primary" v-else-if="initData.creditRating == 2">良好</van-tag>
                  <van-tag mark type="danger" v-else-if="initData.creditRating == 3">一般</van-tag>
                </van-col>
              </van-row>
              <!-- <van-row class="detail-row">
                            <van-col class="detail-row-left" span="6">是否有瑕疵</van-col>
                            <van-col class="detail-row-left" span="18">
                                <van-tag mark type="danger" v-if="initData.isDefect == 1">有瑕疵</van-tag>
                                <van-tag mark type="success" v-else-if="initData.isDefect == 0">无瑕疵</van-tag>
                            </van-col>
                        </van-row> -->
              <van-row class="detail-row">
                <van-col class="detail-row-left" span="6">票据瑕疵</van-col>
                <van-col class="detail-row-left" span="18">
                  {{initData.cpDefect}}
                </van-col>
              </van-row>
              <van-row class="detail-row">
                <van-col class="detail-row-left" span="6">票据图片</van-col>
                <van-col class="detail-row-left" span="18">
                  <div
                    v-for="(item, index) in imgs"
                    :key="index"
                    class="picBox">
                    <img
                      :src="item"
                      @click="previewPic(index)"/>
                  </div>
                </van-col>
              </van-row>
            </van-cell-group>
          </van-cell-group>
          <van-cell-group class="van-hairline--bottom" style="padding-bottom: 60px;">
            <h3 class="title">报价信息</h3>
            <van-cell-group>
              <van-row class="detail-row">
                <van-col class="detail-row-left" span="6"> 我的报价</van-col>
                <van-col class="detail-row-right" span="18">
                  {{item.turnVolume && dealPrice(item.turnVolume.toFixed(2))}}元
                </van-col>
              </van-row>
              <van-row>
                <van-col span="24" @click="getbuyPrice">
							<span
                class="detail-row-special detail-row-left"
                style="padding-top: 5px;padding-bottom: 5px;"
              >
								买家最新报价
								<span
                  class="blue-font"
                  style="margin-left:3px;"
                  v-if="initData.cpStatus == '01' && initData.stringDate >= 0"
                  @click="getbuyPrice"
                >
									{{time}}秒后自动刷新
									<i class="iconfont icon-refresh"></i>
								</span>
								
							</span>
                  <!-- <van-icon name="replay" class="float:right;" /> -->
                </van-col>
              </van-row>
              <van-row style="background: #f5f5f5;">
                <van-col span="24" class="buy-price">
							<span v-if="hasBuyPrice">
								{{buyPrice && dealPrice(buyPrice.toFixed(2))}}元
							</span>
                  <span v-else>
			                	等待买家报价
			              	</span>
                  <span
                    v-if="hasBuyPrice"
                    class="blue-font"
                    style="font-size:12px;"
                    @click="showAllPrice">&nbsp查看所有</span>
                </van-col>
              </van-row>
              <van-row class="detail-row-special"
                       v-if="item.quoteStatus == '04' && (initData.cpStatus == '01' || initData.cpStatus == '04')">

                <van-col class="detail-row-left" span="12">年化利率</van-col>
                <van-col class="detail-row-left" span="12">每十万扣款</van-col>
                <van-col class="detail-row-left" span="24">
                  <van-field
                    style="width:35%;display:inline-block;vertical-align:middle;margin-left:0;margin-right:0;padding-left:0;padding-right:0;"
                    v-model="submit.yearRate"
                    placeholder="年化利率"
                    @input="changeData(1, submit.yearRate)"
                    type="number"/>
                  %
                  <van-field
                    style="width:35%;display:inline-block;vertical-align:middle;margin-left:0;margin-right:0;padding-left:0;padding-right:0;"
                    v-model="submit.reduceAmount"
                    @input="changeData(2, submit.reduceAmount)"
                    placeholder="每十万扣款"
                    type="number"/>
                  <span>元/十万</span>
                </van-col>
                <van-col span="24">
                  <span class="detail-row-left">成交金额（元）</span>
                  <van-field
                    style="display:inline-block;vertical-align:middle;margin-left:0;margin-right:0;padding-left:0;padding-right:0;"
                    v-model="submit.dealAmount"
                    @input="changeData(3, submit.dealAmount)"
                    placeholder="成交金额"
                    type="number"/>
                </van-col>
              </van-row>
            </van-cell-group>

          </van-cell-group>
          <van-row type="flex" justify="center" style="width: 100%;height: 44px;position: absolute;left: 0; bottom: 0;">
            <div
              style="width: 100%;"
              v-if="item.quoteStatus == '04' && (initData.cpStatus == '01' || initData.cpStatus == '04')">
              <van-col span="24">
                <van-button
                  type="primary"
                  style="width: 100%;"
                  @click="buyAgain(item)">再次报价
                </van-button>
              </van-col>
            </div>
            <div
              style="width: 100%;"
              v-else>
              <van-col span="12"
                       v-if="item.quoteStatus == 1 && initData.stringDate >= 0 && (initData.cpStatus == 1 || initData.cpStatus == '04')">
                <van-button
                  type="danger"
                  style="width: 100%;"
                  @click="deleteP">取消报价
                </van-button>
              </van-col>
              <van-col span="12"
                       v-if="item.quoteStatus == 1 && initData.stringDate >= 0 && (initData.cpStatus == 1 || initData.cpStatus == '04')">
                <van-button
                  type="info"
                  style="width: 100%;"
                  @click="ok">关闭
                </van-button>
              </van-col>
              <van-col span="24"
                       v-if="item.quoteStatus != 1 || initData.stringDate < 0 || (initData.cpStatus != 1 && initData.cpStatus != '04')">
                <van-button
                  type="info"
                  style="width: 100%;"
                  @click="ok">关闭
                </van-button>
              </van-col>
            </div>

          </van-row>


        </div>
      </div>
    </van-popup>
    <PriceList
      :show='priceListShow'
      :baseData='priceListBaseData'
      :type="priceType"
      @close='priceListClose'
      @optionSuccess='biddingSuccess'
    />
  </div>
</template>

<script>

  import PriceList from '@/components/PriceList';
  import {ImagePreview} from 'vant';
  import _server from '@/server/server';
  import _common from '@/server/index';

  export default {
    name: 'OrderDetail',
    props: ['showState', 'initData', 'item'],
    components: {PriceList},
    data() {
      return {
        finished: true,
        show: this.showState,
        initD: this.initData,
        timerOut: '',//计时器
        time: 60,
        imgs: [],
        img: '',
        submit: {
          yearRate: '',//年化利率
          reduceAmount: '',//每十万扣款
        },
        priceType: 0,//报价列表是否有可撮合按钮， 0，无， 1 有（暂定）
        priceListShow: false,
        priceListBaseData: '',
        refreshPriceState: false,
        hasBuyPrice: false,
        buyPrice: ''
      }
    },
    watch: {
      showState(newValue, oldValue) {
        this.show = newValue;
        if (newValue) {
          this.setTimeoutFn();
          this.getbuyPrice();
          this.submit.yearRate = '';//年化利率
          this.submit.reduceAmount = '';//每十万扣款
          this.submit.dealAmount = '';
        } else {
          clearInterval(this.timerOut);
          this.time = 60;
        }
        this.imgs = [_common.picUrl + this.initData.frontBillImg, _common.picUrl + this.initData.backBillImg];
      }
    },
    methods: {
      setTimeoutFn() {
        if (this.item.quoteStatus == '04' && (this.initData.cpStatus == '01' || this.initData.cpStatus == '04')) {

        } else {
          if ((this.initData.cpStatus != '01' && this.initData.cpStatus != '04') || this.initData.stringDate < 0) {
            return;
          }
        }

        this.timerOut = setInterval(() => {
          this.time--;
          if (this.time <= 0) {
            this.getbuyPrice();
          }
        }, 1000)
      },
      biddingSuccess() {
        //撮合成功
        this.$emit("refresh");
      },
      showAllPrice() {
        //查看所有报价信息
        this.priceListShow = true;
        this.priceListBaseData = this.initData;
      },
      dealPrice(price) {
        return _common.common_fn.dealPrice(price);
      },
      // 获取买家报价
      getbuyPrice() {
        if (this.refreshPriceState) {
          return;
        }
        let _this = this, _id = this.initData.cpId;
        this.time = 60;
        this.refreshPriceState = true;
        _server.getQuotedPrice({
          _id,
          success(res) {
            _this.refreshPriceState = false;
            if (res && res.length > 0) {
              _this.hasBuyPrice = true;
              _this.buyPrice = res[0].turnVolume;

            } else {
              _this.hasBuyPrice = false;
            }
          }
        })
      },
      priceListClose() {
        //查看所有报价--关闭
        this.priceListShow = false;
      },
      previewPic(index) {
        ImagePreview({
          images: [_common.picUrl + this.initData.frontBillImg, _common.picUrl + this.initData.backBillImg],
          startPosition: index,
          onClose() {
            // do something
          }
        });
      },
      modelClose() {

        //关闭的时候改变对应状态，继续观察
        this.$emit("close")
      },
      ok() {
        let currentPath = this.$router.history.current.fullPath;
        let _this = this;

        this.$emit("ok");
        this.modelClose();
      },
      deleteP() {
        //注销
        this.$dialog.confirm({
          title: '取消报价',
          message: '确认取消对此票据的报价么？'
        }).then(() => {
          let priceId = this.item.priceId, quoteStatus = this.item.quoteStatus;
          if (quoteStatus != 1 || quoteStatus != 4) {
            return;
          }
          _server.cancelQuotedPrice(priceId, (res) => {
            if (res.code == 0) {
              this.$toast('取消报价成功！');
              this.$emit("refresh");
              this.modelClose();
            } else {
              this.$toast(res.errMsg);
            }
          })
        }).catch(() => {
          // on cancel
        });

      },
      buyAgain(item) {
        let currentPath = this.$router.history.current.fullPath;
        let _this = this;
        //判断是否验证
        let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
        if (!(user.orgId || user._checked)) {

          this.$router.push({path: '/home/realName', query: {redirect: currentPath}});
          this.$toast('请先实名认证！');
          return;
        }
        if (this.initData.createBy == user.loginName) {
          this.$toast('不能对自己发布的票据进行竞价！');
          return;
        }
        if (!this.submit.dealAmount || !this.submit.yearRate || !this.submit.reduceAmount) {
          this.$toast('请先完整填写报价信息！');
          return;
        }
        if (parseFloat(this.submit.dealAmount) < 0) {
          this.$toast('成交金额不能小于0！');
          return;
        }
        let data = {
          approvalApr: this.submit.yearRate,
          channel: "02",
          cpId: this.item.cpId,
          cpNo: this.item.cpNo,
          deductAmount: this.submit.reduceAmount,
          endorseTimes: this.initData.endorseTimes,
          turnVolume: this.submit.dealAmount
        };

        _server.insertQuotedInfo(data, (response) => {
          if (response.code == 0) {
            this.$toast('操作成功');
            this.$emit("refresh");
            this.modelClose();
          } else {
            _this.$toast(response.errMsg);
          }
          // this.$emit("ok");
          // this.modelClose();
        })
      },
      change() {
        this.$router.push({path: '/home/ticketHolder/fbpj', query: {pjData: JSON.stringify(this.initData)}});
      },
      getLastTime() {
        //获取剩余时间
        let dueDate = this.initData.dueDate;// 到期时间

        let LastTime = new Date(dueDate).getTime() - new Date().getTime();

        LastTime = Math.ceil(LastTime / (24 * 60 * 60));
        return LastTime;
      },
      changeData(type, value) {
        let cpAmount = this.initData.cpAmount;//票据金额
        let calDay = this.getLastTime();//剩余时间
        let txje;

        if (!value) {
          this.submit.reduceAmount = '';
          this.submit.dealAmount = '';
          this.submit.yearRate = '';
          return;
        }

        if (type == 1) {
          txje = ((cpAmount * calDay * this.submit.yearRate / 100) / 3600) / 100000;
          // this.submit.yearRate = 0;//年利率
          this.submit.reduceAmount = txje.toFixed(2);//每十万扣款
          this.submit.dealAmount = (cpAmount - cpAmount / 100000 * txje).toFixed(2);//成交金额
        }
        if (type == 2) {
          this.submit.dealAmount = (cpAmount - (cpAmount / 100000) * this.submit.reduceAmount).toFixed(2);//成交金额

          this.submit.yearRate = ((cpAmount - this.submit.dealAmount) * 36000 / (calDay * cpAmount)).toFixed(8);//年利率
          // this.submit.reduceAmount = 0;//每十万扣款
        }
        if (type == 3) {
          this.submit.reduceAmount = ((cpAmount - this.submit.dealAmount) / 10).toFixed(2);//每十万扣款
          this.submit.yearRate = ((cpAmount - this.submit.dealAmount) * 36000 / (calDay * cpAmount)).toFixed(8);//年利率
          // this.submit.dealAmount = 0;//成交金额
        }
      }
    }
  }
</script>

<style scoped>

  .title {
    padding: 10px;
    text-align: left;
    color: #000;
    font-weight: normal;
  }

  .title::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #0079f3;
    vertical-align: 5px;
    margin-right: 7px;
  }

  .model-content {
    text-align: left;
    height: 100%;
    position: relative;
  }

  .van-popup {
    width: 80%;
    height: 100%;
  }

  .detail-row {
    padding: 10px 15px;
    color: #333;
  }

  .detail-row-special {
    padding: 10px 15px;
    color: #333;
  }

  .detail-row:nth-child(2n) {
    background-color: #f5f5f5;
  }

  .detail-row-left {
    font-size: 14px;
  }

  .buy-price {
    color: #000;
    padding: 10px 15px;
    display: inline-block;
    background: #f5f5f5;
  }

  .detail-row-right {
    word-break: break-all;
  }

  .picBox {
    display: inline-block;
    width: 80px;
    height: 80px;
    text-align: center;
    line-height: 80px;
    margin-right: 5px;
    background: #f5f5f5;
    position: relative;
    border: 1px solid #ccc;
  }

  .picBox img {
    width: 100%;
    max-height: 100%;
    vertical-align: middle;
  }
</style>
