
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
        this.getHostUrl();
        Toast.loading('加载中……', 0);
        return {}
    },
    componentWillUnmount:function(){
        Toast.hide();
    },
    getHostUrl:function(){
        this.linkTo('123');
    },
    getUrl: function(type, id){
        var url = '';
        switch(type - 0){
                //直播
            case 1:
                url = 'activitylist/liveinfo/' + type + '/';
                break;
                //录播
            case 2:
                url = 'activitylist/liveinfo/' + type + '/';
                break;
                //微学堂
            case 3:
                url = 'activitylist/class/';
                break;
                //病例讨论
            case 4:
                url = 'activitylist/case/';
                break;
                //网络推广
            case 8:
                url = '';
                break;
                //广告文章
            case 7:
                url = 'activitylist/artical/';
                break;
                //帖子
            case 6:
                url = 'activitylist/artical/';
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

        var _result={id:id};
        History.replaceState({result:_result,type:type},'/info/');

    },
    render: function() {
        return (
            <div style={{textAlign:'center'}} onClick={this.linkTo.bind(this,'')}>加载中...</div>
        );
    }
});
