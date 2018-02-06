
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

function getOffset(curEle){
    let totalLeft = null,totalTop = null,par = curEle.offsetParent;
    //首先加自己本身的左偏移和上偏移
    totalLeft += curEle.offsetLeft;
    totalTop += curEle.offsetTop;
    //只要没有找到body，我们就把父级参照物的边框和偏移也进行累加
    while(par){
        if(navigator.userAgent.indexOf("MSIE 8.0")===-1){
            //累加父级参照物的边框
            totalLeft += par.clientLeft;
            totalTop += par.clientTop;
        }

        //累加父级参照物本身的偏移
        totalLeft += par.offsetLeft;
        totalTop += par.offsetTop;
        par = par.offsetParent;
    }

    return{
        left:totalLeft,
        top:totalTop
    };
}

function getStyle(obj,property){
    if(obj.currentStyle){
        return obj.currentStyle[property];
    }else if(window.getComputedStyle){
         return document.defaultView.getComputedStyle(obj,null)[property];//或者也可以通过window.getComputedStyle来获取样式
    }
    return null;
}

const clientHeight = document.body.clientHeight,
    clientWidth = document.body.clientWidth;

export {clientHeight, clientWidth, getOffset, getStyle};

export default {
    setItem,
    device: _discernDevice(),
    clientHeight: document.body.clientHeight,
    clientWidth: document.body.clientWidth
};