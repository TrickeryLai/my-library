var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var History =ReactRouter.hashHistory;
var Link = ReactRouter.Link;
var Api = require('../../cmp/ApiFactory.js');
var Device = require('../../device/device.js');
var Fetch = require('../../fetch/fetch.js');
var AntdMobile = require('../../antdMobile/antdMobile.js');
var cordova = require('../initJSBridge.js');
var Toast = AntdMobile.Toast;

module.exports = React.createClass({
    getInitialState:function(){
        this.getHostUrl();
        //this.getToken('aaa')
        Toast.loading('加载中……', 0);
        return {}
    },
    componentWillUnmount:function(){
        Toast.hide();
    },
    getHostUrl:function(){
        // var hosts = (this.props.params.url)? decodeURIComponent(this.props.params.url) : (window.location.protocol + '//' + window.location.hostname + ':' + (window.location.port|| 80) + '/vpn');

        // localStorage.setItem('circleHost',hosts);
        localStorage.setItem('circleToken',this.props.params.token);
        localStorage.setItem('livePId',this.props.params.liveId);
        // this.getToken('aaa');
        this.linkTo('123');
        cordova.funInCordova(this.getOpenID);
        
    },
    getOpenID:function(){
        try {
        
            $cordova.call({
                name: 'getIdentity', // 必传，插件名称
                params: { //  可为空，传参
                    'array': [1, 2, 3, 4]
                }
            }, function(json) { //可为空，回调函数和回调参数，回调参数已经从json转为Object

                if (json && json.data) {
                    var userName = json.data.userName ? json.data.userName : 'Timr';
                    localStorage.setItem('appVersion', json.data.appVersion);
                    localStorage.setItem('liveName',userName);
                    // this.getToken(userName);
                    this.linkTo(userName);
                     
                } else {
                    alert('获取openID失败')
                }

            }.bind(this))

        } catch (e) {
            alert(e)
        }
        this.setTitleColor();
    },
    setTitleColor: function () {
        
        try {

            $cordova.call({
                    name: 'setNavigationBar', // 必传，插件名称
                    params: { //  可为空，传参
                        'color': '#4BA6F7'
                    }
                }, function (json) {}.bind(this))

        } catch (e) {
            //alert(e)
        }
        this.setTitle();
    },
    setTitle:function(){
        try {
            
            $cordova.call({
                    name: 'setTitle', // 必传，插件名称
                    params: { //  可为空，传参
                        'title':'加载中',
                        'color':'white'
                    }
                }, function (json) {}.bind(this))

        } catch (e) {
            //alert(e)
        }
            this.setReturnButton();
    },        
    setReturnButton: function () {
        try {

            $cordova.call({
                    name: 'setReturnButton', // 必传，插件名称
                    params: { //  可为空，传参
                        'color': 'white'
                    }
                }, function (json) {}.bind(this))

        } catch (e) {
            //alert(e)
        }
       
    },
    getToken:function(_openId){
        if(_openId){
            if(localStorage.getItem('livePId')){
                var _result={
                    id:localStorage.getItem('livePId')
                };
                History.replaceState({result:_result,type:0},'/welfareinfo/');
            }else{
                this.getHostUrl();
            }
        }else{
            cordova.funInCordova(this.getOpenID);
        }
        
    },

    linkTo:function(_openId){
        var liveJson = JSON.parse(localStorage.getItem('liveJson')),//直播数据
            liveId = liveJson.liveId,//邀请人id
            liveType = (liveJson.type || 1) - 0 ,//活动类型
            url='';//跳转地址页面
        //通过邀请人获取type类型
        var pathUrl =localStorage.getItem('circleHost') +  '/activity/invitation/businessDetail/' + liveId +'?access_token='+localStorage.getItem('circleToken');
        Fetch({
            url:pathUrl,
            data:{},
            noDeal: true,
            type:'GET'
        }).then(function(rpn){
            if(rpn.resultCode===1){
                rpn = rpn.data;
                var type = rpn.type;

                if(_openId){
                    if(liveId){
                        switch(type){
                            //直播
                            case 1:
                                url = '/welfareinfo/';
                                break;
                            //录播
                            case 2:
                                url = '/welfareRecord/';
                                break;
                            //微学堂
                            case 3:
                                url = '/welfareClass/';
                                break;
                            //病例讨论
                            case 4:
                                url = '/welfareCase/';
                                break;
                            //网络推广
                            case 8:
                                url = '/welfareNet';
                                break;
                            //广告文章
                            case 7:
                                url = '/welfareArtical';
                                break;
                            //帖子
                            case 6:
                                url = '/welfarePost';
                                break;
                            //诊疗路径
                            case 5:
                                url = '';
                                break;

                        }

                        var _result={
                            liveId: liveId,
                            type: liveType
                        };
                        History.replaceState({result:_result}, url);
                        return;
                    }else{
                        this.getHostUrl();
                    }
                }else{
                    cordova.funInCordova(this.getOpenID);
                }

            }else{
                alert(rpn.resultMsg);
            }

        }.bind(this));

    },
    render: function() {
        return (
            <div style={{textAlign:'center'}} onClick={this.linkTo.bind(this,'')}>加载中...</div>
        );
    }
});
