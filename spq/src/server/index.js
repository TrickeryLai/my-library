
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
  ]

};


export default commonUrl;
