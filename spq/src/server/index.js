
let protocol = location.protocol || 'http';
// let protocol = 'http:';
let common = {
	ip: '114.55.255.160',
	port: '8891', //接口端口号
  xyPort: '8891',//协议端口号
};
let xyHeadUrl = protocol + '//' + common.ip + ':' + common.xyPort +'/open-cp/v1/protocol/pdf/';

let commonUrl = {
	headUrl: protocol + '//' + common.ip + ':' + common.port +'/',
  picUrl: protocol + '//' + common.ip + ':' + common.xyPort +'/open-cp/v1/images/',
  xyData: [
    {
       name: '平台撮合规则',
       url:  xyHeadUrl + 'matching_rules.pdf'
    },
    {
      name: '成交信用规则',
      url:  xyHeadUrl + 'credit_rules.pdf'
    },
    {
      name: '平台服务协议',
      url:  xyHeadUrl + 'service_agreement.pdf'
    },
  ],
  common_reg:{
    email(v){
      let emailReg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
      return emailReg.test(v);
    },
    phone(v){
      let phoneReg = new RegExp("^[1][3,4,5,7,8,9][0-9]{9}$");
      return phoneReg.test(v);
    }
  },
  common_fn:{
    dealPrice(price, n = 3){
      if(!price){
        return price;
      }

      let value, 
        result = [];

      price = price.toString().split(".");
      value = price[0];
      
      for(let i = value.length; i > 0; i -= n){
        result.push(value.substr((i-n) < 0 ? 0:(i-n), i < n? i : n));
      }

      price[0] = result.reverse().join(',');
      return price.join('.');
    },
    getLastTime(endTime){
      // 获取到期时间至今的剩余天数
        let startT = new Date().getTime(),
          endT = new Date(endTime).getTime(),
          last;
        last = Math.ceil((endT - startT)/(24*60*60*1000));
        return last;
    },
    formatterTime(t = new Date(), type = 'yyyy年MM月dd日'){
        let date ='', time = new Date(t), yyyy, MM, dd;
        yyyy = time.getFullYear();
        MM = this.addZero((time.getMonth() + 1));
        dd = this.addZero(time.getDate());
        type = type.replace('yyyy', yyyy);
        type = type.replace('MM', MM);
        type = type.replace('dd', dd);
        return type;
    },
    addZero(v, n = 2){
      let value = '0000' + v;
      return value.substr(value.length - n, n);
    },
    changeNumToTex(n) {
      //数字转换为大小写
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


export default commonUrl;
