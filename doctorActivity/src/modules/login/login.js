var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var AntdMobile = require('./../../antdMobile/antdMobile.js');
var History =ReactRouter.hashHistory;
var cordova = require('../initJSBridge');


module.exports=React.createClass({
    getInitialState:function(){
        cordova.funInCordova(
            function(){
                this.getOpenID()
            }.bind(this)
        );
        // this.getOpenID();
        return {
            router:this.props.params.page
        }

        // this.getParmesFun();
       
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
                    if(json.data.token){
                        localStorage.setItem('circleToken',json.data.token);
                    }
                    // this.getToken(userName);

                } else {
                    alert('获取openID失败')
                }

            }.bind(this))

        } catch (e) {
            alert(e)
        }

        this.getParmesFun();
    },
    getParmesFun:function(){   /*遍历url后面的参数存储本地*/
        /*http://192.168.1.61:8080/#/routerurl/welfare?token=743108578bdc4906ab767966c692b50d&liveId=5a65a54c9aec3368d9aacab1&type=1&url=http%3A%2F%2Ftest.mediportal.com.cn   743108578bdc4906ab767966c692b50d 400970595484925952 357883960677666817*/
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
        if(obj.token){
            localStorage.setItem('circleToken',(obj.token || '12464'));
        }

        if( !this.props.params.page){
            return;
        }

        if(this.props.params.page=='info'){
            var _result={id:obj.liveId};
            History.replaceState({result:_result,type:0},'/info/');  /*兼容老直播*/
        }else if(this.props.params.page === 'welfare'){
            var url = 'welfare';
            /*url += '/' + obj.token + '/' + obj.liveId + '/' + obj.url;*/
            url += '/' + obj.token + '/' + obj.liveId ;/*福利过渡页*/
            History.replaceState(null, '/' + url + '/');
        }else if(this.props.params.page === 'activity'){/*直播列表*/
            History.replaceState(null, '/activityLogin/');
        }
        else{
            this.getToIndex();
        }
        
    },
    getToIndex:function(){
        History.replaceState(null,'/'+this.props.params.page+'/');
    },
    render:function(){

        return (
            <div style={{textAlign:'center'}} onClick={this.getToIndex.bind(this)}>加载中...</div>
        )
    }
})