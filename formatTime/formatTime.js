//转换剩余时间格式 ms  y年MM月dd日hh时mm分ss秒
function formatLastTime(time, format){
    if(!time){
        return;
    }
    format = format || 'y年MM月dd日hh时mm分ss秒';

    var lastTime = time / 1000;

    //年
    if(format.match('y')){
        var yy = Math.floor(lastTime / (3600*24*30*365));
        lastTime = lastTime % (3600*24*30*365);
        format = setFormat('y', yy, format);
    }

    //月
    if(format.match('M')){
        var MM = Math.floor(lastTime / (3600*24*30));
        lastTime = lastTime % (3600*24*30);
        format = setFormat('M', MM, format);
    }
    // 天
    if(format.match('d')){
        var dd = Math.floor(lastTime / (3600*24));
        lastTime = lastTime % (3600*24);

        format = setFormat('d', dd, format);
    }

    //时
    if(format.match('h')){
        let hh = Math.floor(lastTime / 3600);
        lastTime = lastTime % 3600;
        format = setFormat('h', hh, format);
    }

    //分
    if(format.match('m')){
        let mm = Math.floor(lastTime / 60);
        lastTime = lastTime % 60;

        format = setFormat('m', mm, format);
    }
    //秒
    if(format.match('s')){
        format = setFormat('s', lastTime, format);
    }

    return format;

}

//转换时间格式 ms  yyyy-MM-dd hh:mm:ss
function formatTime(time, format){
    if(!time){
        return;
    }
    format = format || 'yyyy-MM-dd hh:mm:ss';
    var time = new Date(time),
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

function setFormat(typeString, time, format){
    var regsStr = '['+typeString+']+', zeroN, zeroArr,
        timeArr = [time];
    var regs = new RegExp(regsStr);

    zeroN = format.match(regs) && (format.match(regs)[0].length - time.toString().length);

    if(zeroN < 0){
        zeroN = 0;
    }

    zeroArr = zeroN ? new Array(zeroN).fill(0) : [];
    zeroArr.push(time);
    time = zeroArr.join('');
    // time = [zeroArr, ...[timeArr]].join('');
    format = format.replace(regs, time);
    return format;
}