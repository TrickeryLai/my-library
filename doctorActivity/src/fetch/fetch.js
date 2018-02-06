'use strict';
/*hack 华为荣耀6 fetch Promise is not defined*/
require('es6-promise');
require('whatwg-fetch');
var AntdMobile =require('./../antdMobile/antdMobile.js');
var Toast = AntdMobile.Toast;
var Modal = AntdMobile.Modal;
var Alert = Modal.alert;

function _objToParamUrl(obj) {
    /*obj 转成 参数url*/
    var bodyStr = null;
    for (var key in obj) {
        if (bodyStr) {
            bodyStr += '&';
        }else{
            bodyStr = '';
            bodyStr += '?'
        }
        bodyStr += key + '=' + encodeURIComponent(obj[key]);
    }

    return bodyStr;
};
function _loginOut(){
/*    try {
        $cordova.call({
            name: 'setReturnButton',
            params: {
                'color': 'white'
            }
        }, function (json) {}.bind(this))
    } catch (error) {
        
    }*/
};
function _fetch(config, loading) {

    if (!config.url) {
        return console.warn('缺少请求地址url');
    }

    var headers = config.header || {};
    var bodyStr='';
    if(config.isJson){
        bodyStr = JSON.stringify(config.data);
        headers['Content-Type']= 'application/json;charset=utf-8';
    }else{
        bodyStr = _objToParamUrl(config.data);
        headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    }
   
    var data = {
        method: config.type || 'POST',
        headers: headers,
        mode: "cors",
        body: bodyStr
    }
    /*判断config.data是否有值*/
    var flag = false;
    for (var key in config.data) {
        flag = true;
        break;
    }
    if ((config.type+'').toUpperCase()!='POST') {
        if(bodyStr){
            config.url += bodyStr;
        }
        delete data.body;
    }

    
    Toast.loading('加载中....',10);
    var _fetch = fetch(config.url, data)
        .then(function(_response) {

            return _response.json();

        }).then(function(_rps) {
            Toast.hide();
            if (config.noDeal) {
                return _rps;
            }
            if (_rps && _rps.resultCode == 1) {
                return _rps.data || true
            }
            if(_rps && _rps.resultCode ==1030103){
                Alert('提示',_rps.resultMsg, [
                    {text: '确定', onPress: function(){
                    }.bind(this)
                    },
                ]);
                _loginOut();
            }
            if (_rps && _rps.resultMsg) {
                Alert('提示',_rps.resultMsg, [
                    {text: '确定', onPress: function(){
                    }.bind(this)
                    },
                ]);

                return null;
            }

        }).catch(function(ex) {
            Toast.hide();
            console.log('接口出错', ex)
        });

    return _fetch;

};

module.exports = _fetch;
