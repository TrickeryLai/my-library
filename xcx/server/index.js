let protocol = 'http';
// let protocol = 'http:';
let common = {
  // ip: '117.71.57.247',
  ip: '47.113.2.4',
  // port: '3580', //接口端口号
  // xyPort: '3580',//协议端口号
  port: '5080',
  xyPort: '5080',
};
let xyHeadUrl = protocol + '//' + common.ip + ':' + common.xyPort + '/open-cp/v1/protocol/pdf/';

let commonUrl = {
  headUrl: protocol + '//' + common.ip + ':' + common.port + '/',
  picUrl: protocol + '//' + common.ip + ':' + common.xyPort + '/open-cp/v1/images/',
  mosPicUrl: protocol + '//' + common.ip + ':' + common.xyPort + '/open-cp/v1/images/mos/',
  xyData: [
    {
      name: '平台撮合规则',
      url: xyHeadUrl + 'matching_rules.pdf'
    },
    {
      name: '成交信用规则',
      url: xyHeadUrl + 'credit_rules.pdf'
    },
    {
      name: '平台服务协议',
      url: xyHeadUrl + 'service_agreement.pdf'
    },
  ],
  common_reg: {
    email(v) {
      let emailReg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
      return emailReg.test(v);
    },
    phone(v) {
      let phoneReg = new RegExp("^[1][3,4,5,7,8,9][0-9]{9}$");
      return phoneReg.test(v);
    },
    idCard(code) {
      var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
      var pass = true;
      var tip;

      if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
        // tip = "身份证号格式错误";
        pass = false;
      } else if (!city[code.substr(0, 2)]) {
        // tip = "地址编码错误";
        pass = false;
      } else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
          code = code.split('');
          //∑(ai×Wi)(mod 11)
          //加权因子
          var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
          //校验位
          var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
          var sum = 0;
          var ai = 0;
          var wi = 0;
          for (var i = 0; i < 17; i++) {
            ai = code[i];
            wi = factor[i];
            sum += ai * wi;
          }
          var last = parity[sum % 11];
          if (parity[sum % 11] != code[17]) {
            tip = "校验位错误";
            pass = false;
          }
        }
      }

      return pass;
    }
  },
  common_fn: {
    formateUlr(url) {
      if (!url) {
        return url;
      }

      url = url.indexOf('/images/') > -1 ? (url.split('images/')[1]) : url;
      return url;
    },
    /**
     * [dealPrice 处理数字格式，小数点后部分不做处理]
     * @param  {[type]} price [description]
     * @param  {Number} n     [以n个字符分割]
     * @param  {String} tp    [连接方式]
     * @return {[type]}       [返回处理结果]
     */
    dealPrice(price, n = 3, tp = ',') {
      if (!price) {
        return price;
      }

      let value,
        result = [], isr = false;

      price = price.toString().split(".");
      value = price[0];

      if (value.substr(0, 1) == '-') {
        isr = true;
        value = value.split('-')[1];
      }

      for (let i = value.length; i > 0; i -= n) {
        result.push(value.substr((i - n) < 0 ? 0 : (i - n), i < n ? i : n));
      }

      price[0] = result.reverse().join(tp);
      price = price.join('.');

      if (isr) {
        price = '-' + price;
      }
      return price;
    },
    getLastTime(endTime) {
      // 获取到期时间至今的剩余天数
      let startT = new Date().getTime(),
        endT = new Date(endTime).getTime(),
        last;
      last = Math.ceil((endT - startT) / (24 * 60 * 60 * 1000));
      return last;
    },
    /**
     * [formatterTime 时间格式转换]
     * @param  {Date}   t    [时间]
     * @param  {String} type [转换格式，yyyy 年，MM月，dd 日]
     * @return {[type]}      [description]
     */
    formatterTime(t = new Date(), type = 'yyyy年MM月dd日') {
      let date = '', time = new Date(t), yyyy, MM, dd;
      yyyy = time.getFullYear();
      MM = this.addZero((time.getMonth() + 1));
      dd = this.addZero(time.getDate());
      type = type.replace('yyyy', yyyy);
      type = type.replace('MM', MM);
      type = type.replace('dd', dd);
      return type;
    },
    /**
     * [addZero 补0, ]
     * @param {[type]} v [description]
     * @param {Number} n [保留的位数，默认 2位 （0v）]
     */
    addZero(v, n = 2) {
      let value = '0000' + v;
      if (v.toString().length > n) {
        n = v.toString().length;
      }
      return value.substr(value.length - n, n);
    },
    changeNumToTex(n) {
      //数字转换为大小写
      if (!n) {
        return '';
      }
      if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) {
        return "无效的金额";
      }
      var unit = "千百拾万千百拾亿千百拾万千百拾元角分", str = "";
      n += "00";
      var p = n.indexOf('.');
      if (p >= 0) {
        n = n.substring(0, p) + n.substr(p + 1, 2);
      }
      unit = unit.substr(unit.length - n.length);
      for (var i = 0; i < n.length; i++) {
        str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
      }
      return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
    },
    formatter(type, value) {
      //插件过滤显示
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`
      }
      return value;
    },
  }

};

module.exports = {
  commonUrl
}