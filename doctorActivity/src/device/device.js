
var AntdMobile = require('../antdMobile/antdMobile.js');
var Modal = AntdMobile.Modal;
var Alert = Modal.alert;
/*识别设备*/
function _discernDevice() {
    var agent = navigator.userAgent.toLowerCase();
    var device = {};
    if (agent.match(/MicroMessenger/i) == "micromessenger") {
        device.app = 'weixin'; /*在微信中打开*/
    } else if (agent.match(/QQ\//i) == "qq/") {
        device.app = 'qq'; /*在QQ打开*/
    } else if (agent.match(/WeiBo/i) == "weibo") {
        device.app = 'weibo'; /*在新浪微博客户端打开*/
    } else if(agent.match(/x10/i)=='x10'){
        device.app = 'x10';  /*特定的平板*/
    }

    if (agent.indexOf('android') != -1) {
        device.platform = 'Android';
    } else if (agent.indexOf('iphone') != -1) {
        device.platform = 'iOS';
    } else if(agent.indexOf('x10') != -1){
        device.platform ='x10';
    }

    return device;
}
function _funsetTime(start,end){
    
    var start = new Date(Number(start));
    var end = new Date(Number(end));
    var year = start.getFullYear();
    var month =start.getMonth()+1;
    var endMonth = end.getMonth()+1;
    var day = start.getDate();
    var endDay = end.getDate();
    var startHour = start.getHours();
    var startMinutes = _checkNum(start.getMinutes());
    var endHour = end.getHours();
    var endMinutes = _checkNum(end.getMinutes());
    return month + '.' + day + ' ' +startHour +':'+startMinutes+' -'+endMonth+ '.' + endDay + ' ' +endHour+':'+endMinutes;
}
function _funAllTime(start,end){
    var start = new Date(Number(start));
    var end = new Date(Number(end));
    var startyear = start.getFullYear();
    var startmonth =start.getMonth()+1;
    var startday = start.getDate();
    var startHour = start.getHours();
    var endyear = end.getFullYear();
    var endmonth = end.getMonth()+1;
    var endday = end.getDate();
    var startMinutes = _checkNum(start.getMinutes());
    var endHour = end.getHours();
    var endMinutes = _checkNum(end.getMinutes());
    return startyear + '.' + startmonth + '.' + startday + ' ' +startHour +':'+startMinutes+' - '+endyear+'.'+endmonth+'.'+endday+' '+endHour+':'+endMinutes;
}
function _funsetStartTime(start){
    var start = new Date(Number(start));
   
    var startyear = start.getFullYear();
    var startmonth =start.getMonth()+1;
    var startday = start.getDate();
    var startHour = start.getHours();
    var startMinutes = _checkNum(start.getMinutes());
    return startyear + '.' + startmonth + '.' + startday + ' ' +startHour +':'+startMinutes;
}
function _maxTimeorminTime(start,end){
    var t,s = (Number(end) - Number(start))/1000;
    if(s > -1){
        hour = Math.floor(s/3600);
        min = Math.floor(s/60) % 60;
        sec = s % 60;
        day = parseInt(hour / 24);
        if (day > 0) {
            hour = hour - 24 * day;
            t = day + "day " + hour + ":";
            }
        else t = hour + ":";   
        if(min < 10){t += "0";}
            t += min + ":";
        if(sec < 10){t += "0";}
            t += sec;
    }
    return t;
}
function _Transformation(_str){
    var re = /\n/ig;
    if(_str){
        return _str.replace(re,'<br>')
    }
    
}
function _getVersion(){
    var mete = document.getElementsByTagName('meta'),text='';
    for(var i =0 ; i<=mete.length;i++){
        if(mete[i].getAttribute('name')=='dachen-version'){
            return text= mete[i].getAttribute('content')
        }
    }
}
function _checkNum(i){
    if(i < 10){
        i= '0'+i;
    }
    return i;
}
/*获取月日，星期 时分*/
function _liveSetTime(_start,_end){

    var newDate = Date.parse(new Date());
    var start = new Date(Number(_start));
    var year =start.getFullYear();
    var stytemYear = new Date().getFullYear();
    var month =start.getMonth()+1;
    var day = start.getDate();
    var startHour = start.getHours();
    var startMinutes = _checkNum(start.getMinutes());
    var startDay = start.getDay();
    var week='';
    switch(startDay){
        case 0:
            week="日";
            break;
        case 1:
            week="一";
            break;
        case 2:
            week="二";
            break;
        case 3:
            week="三";
            break;
        case 4:
            week="四";
            break;
        case 5:
            week="五";
            break;
        case 6:
            week="六";
            break;
    }
    var minDate = ((start.getTime()-newDate)/1000);
    if(minDate >1 && minDate <=3600){
        return  _liveSetupDate(minDate);
    }
    var parmes={
        key:1,
        values:month + '.' + day + ' 星期'+ week +' '+startHour +':'+ startMinutes
    }
    if(year!=stytemYear){
        parmes.values = year + '.' + month + '.' + day + ' 星期'+ week +' '+startHour +':'+ startMinutes
    }

    return parmes
}
/*多久开始*/
function _liveSetupDate(_start,_end){
    var parmes={
        key:0,
        values:'距离开播'+Math.floor(_start/60)+'分钟'
    }
    return parmes

}
/*已开播时间 距结束*/
function _liveSetDonwDate(_start,_end){
    var lastTime,indentTime;
    var newDate = Date.parse(new Date()); /*系统时间*/
    var start = new Date(Number(_start));  /*开始时间*/
    var end =new Date(Number(_end));   /*结束时间*/
    var startTime = (start-newDate)/1000;
    var endTime = (end-newDate)/1000; /*直播剩余时间*/
    if(newDate>start){
        startTime = (newDate-start)/1000;   /*直播已开始时间*/
    }
    if(end > newDate){

        endTime = (end-newDate)/1000;
    }


    var aaa = startTime/3600;

    lastTime=Math.floor(startTime/3600);
    indentTime=Math.floor(endTime/3600);
    var lastTime_mm = Math.floor((startTime % 3600)/60);
    if(aaa > 1){

        return ' 已开播 '+lastTime+'小时'+lastTime_mm+'分';
        /*return ' 已开播 '+lastTime+'小时'+lastTime_mm+'分 距结束 '+indentTime+'小时 ';*/
    }else{
        return ' 已开播 '+lastTime_mm+'分钟';
    }

}
/*转换剩余时间格式 ms  y年MM月dd日hh时mm分ss秒*/
function formatLastTime(time, format){
    if(!time){
        return;
    }
    format = format || 'y年MM月dd日hh时mm分ss秒';

    var lastTime = time / 1000;

    /*年*/
    if(format.match('y')){
        var yy = Math.floor(lastTime / (3600*24*30*365));
        lastTime = lastTime % (3600*24*30*365);
        format = setFormat('y', yy, format);
    }

    /*月*/
    if(format.match('M')){
        var MM = Math.floor(lastTime / (3600*24*30));
        lastTime = lastTime % (3600*24*30);
        format = setFormat('M', MM, format);
    }
    /*天*/
    if(format.match('d')){
        var dd = Math.floor(lastTime / (3600*24));
        lastTime = lastTime % (3600*24);

        format = setFormat('d', dd, format);
    }

    /*时*/
    if(format.match('h')){
        var hh = Math.floor(lastTime / 3600);
        lastTime = lastTime % 3600;
        format = setFormat('h', hh, format);
    }

    /*分*/
    if(format.match('m')){
        var mm = Math.floor(lastTime / 60);
        lastTime = lastTime % 60;

        format = setFormat('m', mm, format);
    }
    /*秒*/
    if(format.match('s')){
        format = setFormat('s', lastTime, format);
    }

    return format;

}

/*转换时间格式 ms  yyyy-MM-dd hh:mm:ss*/
function formatTime(time, format){
    if(!time){
        return;
    }
    format = format || 'yyyy-MM-dd hh:mm:ss';
    var time = new Date(time - 0),
        year, month, day, hour, minute, second;

    year = time.getFullYear();
    format = setFormat('y', year, format);

    month = time.getMonth() + 1;
    format = setFormat('M', month, format);

    day = time.getDate();
    format = setFormat('d', day, format);

    hour = time.getHours();
    format = setFormat('h', hour, format);

    minute = time.getMinutes();
    format = setFormat('m', minute, format);

    second = time.getSeconds();
    format = setFormat('s', second, format);

    return format;
}

var AntdMobile = require('../antdMobile/antdMobile.js');
var Modal = AntdMobile.Modal;
var Alert = Modal.alert;

function setFormat(typeString, time, format){

    var regsStr = '['+typeString+']+';
    var zeroN=0;
    var zeroArr=[];
    var timeArr = [time];

    var regs = new RegExp(regsStr);

    var newMarch = format.match(regs);

    if(newMarch && newMarch[0]){
        zeroN = newMarch[0].length - time.toString().length;
    }

    if(zeroN < 0){
        zeroN = 0;
    }

    if(zeroN){
        zeroArr = new Array(zeroN);

        for(var i = 0; i< zeroN ; i++){
            zeroArr.push(0);
        }
    }

    zeroArr.push(time);
    time = zeroArr.join('');
    /*time = [zeroArr, ...[timeArr]].join('');*/
    format = format.replace(regs, time);
    return format;
}



module.exports = {
    clientHeight: document.body.clientHeight,
    clientWidth: document.body.clientWidth,
    discernDevice: _discernDevice,
    setTime:_funsetTime,
    funsetStartTime:_funsetStartTime,
    setHour:_maxTimeorminTime,
    setAllTime:_funAllTime,
    Transformation:_Transformation,
    getVersion:_getVersion,
    formatLastTime: formatLastTime,
    formatTime: formatTime,
    liveSetTime:_liveSetTime,
    liveSetDonwDate:_liveSetDonwDate
}
  