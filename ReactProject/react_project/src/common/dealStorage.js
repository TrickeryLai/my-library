
/*jshint esversion:6*/

function setItem(name, str){
    "use strict";

    if(typeof str === 'undefined'){
        let data = window.localStorage.getItem(name);
        return data;
    }

    if(!str && str !== 0){
        window.localStorage.removeItem(name);
        return;
    }

    if( str && typeof str !== 'string'){
        str = JSON.stringify(str);
    }
    window.localStorage.setItem(name, str);
}

//识别设备
function _discernDevice() {
    let agent = navigator.userAgent.toLowerCase(),
         device = {};
    if (agent.match(/MicroMessenger/i) === "micromessenger") {
        device.app = 'weixin'; //在微信中打开
    } else if (agent.match(/QQ\//i) === "qq/") {
        device.app = 'qq'; //在QQ打开
    } else if (agent.match(/WeiBo/i) === "weibo") {
        device.app = 'weibo'; //在新浪微博客户端打开
    }

    if (agent.indexOf('android') !== -1) {
        device.platform = 'Android';
    } else if (agent.indexOf('iphone') !== -1) {
        device.platform = 'iOS';
    }

    return device;
}

const clientHeight = document.body.clientHeight,
    clientWidth = document.body.clientWidth;

export {clientHeight, clientWidth};

export default {
    setItem,
    device: _discernDevice(),
    clientHeight: document.body.clientHeight,
    clientWidth: document.body.clientWidth
};