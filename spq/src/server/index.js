//通用配置 && 通用方法
//

import AreaData from '@/server/areaData';

let protocol = location.protocol || 'http';
// let protocol = 'http:';
let common = {
	// ip: '117.71.57.247',
 
	// port: '3580', //接口端口号
  // xyPort: '3580',//协议端口号
  //  // ip: '47.113.2.4',//生产
  // port: '5080',
  // xyPort: '5080',

  ip: '117.71.57.247',//测试
  port: '3580',
  xyPort: '3580',

  // ip: '192.168.98.10',//测试
  // port: '8890',
  // xyPort: '8890'
};
let xyHeadUrl = protocol + '//' + common.ip + ':' + common.xyPort +'/open-cp/v1/protocol/pdf/';

let commonUrl = {
	headUrl: protocol + '//' + common.ip + ':' + common.port +'/',
  pdfUrl: protocol + '//' + common.ip + ':' + common.port +
'/open-cp/v1/esign/pdf/',
  picUrl: protocol + '//' + common.ip + ':' + common.xyPort +'/open-cp/v1/images/',
  mosPicUrl: protocol + '//' + common.ip + ':' + common.xyPort +'/open-cp/v1/images/mos/',
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
      checkSocialCreditCode(Code){ 
  　　　　let patrn = /^[0-9A-Z]+$/;
   　　//18位校验及大写校验
  　　    if ((Code.length != 18) || (patrn.test(Code) == false)){ 
            //alert("不是有效的统一社会信用编码！"); 
            return false;
  　　　　 } 
  　　　　else { 
  　　　　 var Ancode;//统一社会信用代码的每一个值
   　　　　var Ancodevalue;//统一社会信用代码每一个值的权重 
  　　　　 var total = 0; 
  　　　　 var weightedfactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];//加权因子 
  　　　　 var str = '0123456789ABCDEFGHJKLMNPQRTUWXY';
  　　　　//不用I、O、S、V、Z 
  　　　　for (var i = 0; i < Code.length - 1; i++) 
  　　　　{
   　　　　Ancode = Code.substring(i, i + 1); 
  　　　　 Ancodevalue = str.indexOf(Ancode); 
  　　　　 total = total + Ancodevalue * weightedfactors[i];
  　　　　//权重与加权因子相乘之和 
  　　　　}
   　　　　var logiccheckcode = 31 - total % 31;
  　　　　if (logiccheckcode == 31)
  　　　　{
  　　　　　　logiccheckcode = 0;
  　　　　}
  　　　　var Str = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y";
  　　　　var Array_Str = Str.split(',');
  　　　　logiccheckcode = Array_Str[logiccheckcode];


  　　　　 var checkcode = Code.substring(17, 18);
  　　　　 if (logiccheckcode != checkcode){ 
              //alert("不是有效的统一社会信用编码！");
              return false;
   　　　　}
   　　}
      return true; 
  　},
    loginName(v){
      let loginNameReg = /^[\dA-Za-z_]{6,20}$/i;
      return loginNameReg.test(v);
    },
    password(v){
      let password = /^[\dA-Za-z_]{6,15}$/i;
      return password.test(v);
    },
    email(v){
      let emailReg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
      return emailReg.test(v);
    },
    phone(v){
      let phoneReg = new RegExp("^[1][3,4,5,7,8,9][0-9]{9}$");
      return phoneReg.test(v);
    },
    idCard(idcode){
      // var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
      //   var pass= true;
      //   var tip;
            
      //   if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
      //       // tip = "身份证号格式错误";
      //       pass = false;
      //   }else if(!city[code.substr(0,2)]){
      //       // tip = "地址编码错误";
      //       pass = false;
      //   }else{
      //           //18位身份证需要验证最后一位校验位
      //         if(code.length == 18){
      //             code = code.split('');
      //             //∑(ai×Wi)(mod 11)
      //             //加权因子
      //             var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
      //             //校验位
      //             var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
      //             var sum = 0;
      //             var ai = 0;
      //             var wi = 0;
      //             for (var i = 0; i < 17; i++)
      //             {
      //                 ai = code[i];
      //                 wi = factor[i];
      //                 sum += ai * wi;
      //             }
      //             var last = parity[sum % 11];
      //             if(parity[sum % 11] != code[17]){
      //                 tip = "校验位错误";
      //                 pass =false;
      //             }
      //         }
      //     }

      //   return pass;
      
     // 加权因子
      var weight_factor = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
     // 校验码
      var check_code = ['1', '0', 'X' , '9', '8', '7', '6', '5', '4', '3', '2'];
  
      var code = idcode + "";
      var last = idcode[17];//最后一个

     var seventeen = code.substring(0,17);
 
     // ISO 7064:1983.MOD 11-2
     // 判断最后一位校验码是否正确
     var arr = seventeen.split("");
     var len = arr.length;
     var num = 0;
     for(var i = 0; i < len; i++){
         num = num + arr[i] * weight_factor[i];
     }
     
     // 获取余数
     var resisue = num%11;
     var last_no = check_code[resisue];
 
     // 格式的正则
     // 正则思路
     /*
     第一位不可能是0
     第二位到第六位可以是0-9
     第七位到第十位是年份，所以七八位为19或者20
     十一位和十二位是月份，这两位是01-12之间的数值
     十三位和十四位是日期，是从01-31之间的数值
    十五，十六，十七都是数字0-9
     十八位可能是数字0-9，也可能是X
     */
     var idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
 
     // 判断格式是否正确
     var format = idcard_patter.test(idcode);
 
     // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
     return last === last_no && format ? true : false;
    }
  },
  common_fn:{
    getAddress(provinceCode, cityCode){
      let result = {
       
      };
      if(provinceCode){
        for(let i in AreaData.province_list){
          if(i == provinceCode){
            result[i] = AreaData.province_list[i];
            break;
          }
        }
      }
      if(cityCode){
        for(let i in AreaData.city_list){
          if(i == cityCode){
            result[i] = AreaData.city_list[i];
            break;
          }
        }
      }
      return result;
      
    },
    formateUlr(url){
      if(!url){
        return url;
      }

      url = url.indexOf('/images/') > -1? (url.split('images/')[1]): url;
      return url;
    },
    /**
     * [dealPrice 处理数字格式，小数点后部分不做处理]
     * @param  {[type]} price [description]
     * @param  {Number} n     [以n个字符分割]
     * @param  {String} tp    [连接方式]
     * @return {[type]}       [返回处理结果]
     */
    dealPrice(price, n = 3, tp=','){
      if(!price){
        return price;
      }

      let value, 
        result = [], isr = false;

      price = price.toString().split(".");
      value = price[0];

      if(value.substr(0,1) == '-'){
        isr = true;
        value = value.split('-')[1];
      }
      
      for(let i = value.length; i > 0; i -= n){
        result.push(value.substr((i-n) < 0 ? 0:(i-n), i < n? i : n));
      }

      price[0] = result.reverse().join(tp);
      price = price.join('.');

      if(isr){
        price = '-' + price;
      }
      return price;
    },
    getLastTime(endTime){
      // 获取到期时间至今的剩余天数
        let startT = new Date().getTime(),
          endT = new Date(endTime).getTime(),
          last;
        last = Math.ceil((endT - startT)/(24*60*60*1000));
        return last;
    },
    /**
     * [formatterTime 时间格式转换]
     * @param  {Date}   t    [时间]
     * @param  {String} type [转换格式，yyyy 年，MM月，dd 日]
     * @return {[type]}      [description]
     */
    formatterTime(t = new Date(), type = 'yyyy年MM月dd日'){
        let date ='', time = new Date(t), yyyy, MM, dd, hh, mm, ss;
        yyyy = time.getFullYear();
        MM = this.addZero((time.getMonth() + 1));
        dd = this.addZero(time.getDate());

        hh = this.addZero(time.getHours());
        mm = this.addZero(time.getMinutes());
        ss = this.addZero(time.getSeconds());
        type = type.replace('yyyy', yyyy);
        type = type.replace('MM', MM);
        type = type.replace('dd', dd);
        type = type.replace('hh', hh);
        type = type.replace('mm', mm);
        type = type.replace('ss', ss);
        return type;
    },

    /**
     * [addZero 补0, ]
     * @param {[type]} v [description]
     * @param {Number} n [保留的位数，默认 2位 （0v）]
     */
    addZero(v, n = 2){
      let value = '0000' + v;
      if(v.toString().length > n){
        n = v.toString().length;
      }
      return value.substr(value.length - n, n);
    },

    formatLastTime(t, format = 'mm:ss'){
      if(t <= 0){
        t = 0;
      }
      let date = '', lsT = t, y, M, d, h, m, s;

      y = Math.floor(lsT/(365*24*60*60));
      lsT = lsT % (365*24*60*60);
      M = Math.floor(lsT/(30*24*60*60));
      lsT = lsT % (30*24*60*60);
      d = Math.floor(lsT/(24*60*60));
      lsT = lsT % (24*60*60);
      h = Math.floor(lsT/(60*60));
      lsT = lsT % (60*60);
      m = Math.floor(lsT/(60));
      lsT = lsT % (60);
      s = lsT;

      if(format.indexOf('yyyy') < 0){
        M += (y * 365);
      }
      if(format.indexOf('MM') < 0){
        d += (M * 30);
      }
      if(format.indexOf('dd') < 0){
        h += (d * 24);
      }
      if(format.indexOf('hh') < 0){
        m += (h * 60);
      }
      if(format.indexOf('mm') < 0){
        s += (m * 60);
      }

      format = format.replace('yyyy', y);
      format = format.replace('MM', M);
      format = format.replace('dd', d);
      format = format.replace('hh', h);
      format = format.replace('mm', m);
      format = format.replace('ss', s);
      return format;
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
