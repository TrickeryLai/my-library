
let protocol = location.protocol || 'http';
// let protocol = 'http:';
let common = {
	ip: '114.55.255.160',
	port: '8891', //接口端口号
  xyPort: '9180',//协议端口号
};
let xyHeadUrl = protocol + '//' + common.ip + ':' + common.xyPort +'/';

let commonUrl = {
	headUrl: protocol + '//' + common.ip + ':' + common.port +'/',
  picUrl: protocol + '//' + common.ip + ':' + common.xyPort +'/images/',
  xyData: [
    {
       name: '平台撮合规则',
       url:  xyHeadUrl + 'images/matching_rules.pdf'
    },
    {
      name: '成交信用规则',
      url:  xyHeadUrl + 'images/credit_rules.pdf'
    },
    {
      name: '平台服务协议',
      url:  xyHeadUrl + 'images/service_agreement.pdf'
    },
  ]

};


export default commonUrl;
