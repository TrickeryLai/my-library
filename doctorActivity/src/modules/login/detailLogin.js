
/*详情公共入口*/

var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var History =ReactRouter.hashHistory;
var Link = ReactRouter.Link;
var Api = require('../../cmp/ApiFactory.js');
var Device = require('../../device/device.js');
var Fetch = require('../../fetch/fetch.js');
var AntdMobile = require('../../antdMobile/antdMobile.js');
var Toast = AntdMobile.Toast;

module.exports = React.createClass({
    getInitialState:function(){
        this.getData();
        Toast.loading('加载中……', 0);
        return {}
    },
    componentWillUnmount:function(){
        Toast.hide();
    },
    getData: function(){
        var href = window.location.href,obj={};
        var query = href.split('?')[1];
        var params = query.split('&');
        for(var i in params){
            var arr = params[i].split('=');
            obj[arr[0]] = arr[1];
        }

        var localhost = '';

        switch(window.location.hostname){
            case 'localhost':
            case '127.0.0.1':
            case '192.168.2.185':
            case '192.168.1.187':
            case '192.168.1.195':
            case '192.168.1.77':
                localhost = (window.location.protocol + '//' + window.location.hostname + ':' + (window.location.port|| 80) + '/vpn');
                break;
            default:
                localhost = (window.location.protocol + '//' + window.location.hostname);
        }

        obj.host = obj.host ? window.decodeURIComponent(obj.host) : localhost;
        localStorage.setItem('liveJson',JSON.stringify(obj)); /*所有 url 数据*/
        localStorage.setItem('circleHost',obj.host);

        this.getHostUrl();
    },
    getHostUrl:function(){
        this.linkTo('123');
    },
    getUrl: function(type, id){
        var url = '';
        switch(type - 0){
                //直播
            case 1:
                url = 'liveinfoWrap/' + type + '/';
                break;
                //录播
            case 2:
                url = 'liveinfoWrap/' + type + '/';
                break;
                //微学堂
            case 3:
                url = 'activitylist/class/';
                break;
                //病例讨论
            case 4:
                url = 'caseWrap/';
                break;
                //网络推广
            case 8:
                url = '';
                break;
                //广告文章
            case 7:
                url = 'articalWrap/';
                break;
                //帖子
            case 6:
                url = 'articalWrap/';
                break;
                //诊疗路径
            case 5:
                url = '';
                break;
            }

            return url + id;
    },
    linkTo:function(_openId){
        var liveJson = JSON.parse(localStorage.getItem('liveJson')),//直播数据
            id = liveJson.id,//邀请人id
            type = (liveJson.type || 1) - 0 ,//活动类型
            url='';//跳转地址页面
        //通过邀请人获取type类型
       url = this.getUrl(type, id);

       History.replaceState(null, url);

    },
    render: function() {
        return (
            <div style={{textAlign:'center'}} onClick={this.linkTo.bind(this,'')}>加载中...</div>
        );
    }
});
