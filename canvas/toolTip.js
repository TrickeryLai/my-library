/**
 * Created by dachen on 2017/7/10.
 */



/**
 * 享元
 * */

var ToolTip = function(){
    "use strict";
    this.delayTime = 500;
    this.element = document.createElement('div');
    this.element.style.display = 'none';
    this.element.style.position = 'absolute';
    this.element.className = 'util-toolTip';
    document.getElementsByTagName('body')[0].appendChild(this.element);
};

ToolTip.prototype = {
    addEvnt: function(e,text){
        "use strict";
        var _this = this,
            titleText = text,
            showFn =function(e, text){
                _this.hide();
                throttling(function(){
                    _this.delayShow(e, text);
                    },500);
                },
            hideFn = function(e){
                _this.hide();
            };
        if(typeof e === 'object' && e.length>0){
            for(var i=0; i<e.length; i++){
                titleText = e[i].getAttribute('tooltip-title') || text;
                addEvent(e[i],'mousemove',showFn, titleText);
                addEvent(e[i], 'mouseout', hideFn);
            }
        }else{
            titleText = e.getAttribute('toolTipTitle') || text;
            addEvent(e,'mousemove',showFn, titleText);
            addEvent(e, 'mouseout', hideFn);
        }

    },
    delayShow: function(e,text){
        "use strict";
        var _this = this;

        clearTimeout(this.delayTimer);
        this.delayTimer = setTimeout(function(){_this.show(e,text);}, this.delayTime);
    },
    show: function(e, text){
        "use strict";
        var x = e.clientX,
            y = e.clientY;
        this.element.innerText = text;
        this.element.style.left = x + 5 + 'px';
        this.element.style.top = y + 5 + 'px';
        this.element.style.display = 'block';
    },
    hide: function(){
        "use strict";
        clearTimeout(this.delayTimer);
        this.element.style.display= 'none';
        this.element.innerText = ' ';
    }
};

function addEvent(el, eventType, fn){
    "use strict";
    var args = Array.prototype.slice.call(arguments, 3),
        cfn = function(e){
            fn.apply(el, [e].concat(args));
        };

    if(el.addEventListener){
        return el.addEventListener(eventType, cfn);
    }else if(el.attachEvent){
        return el.attachEvent('on'+eventType, cfn);
    }else{
        return (el['on'+eventType] = cfn);
    }
}

function throttling(fn, t, delay){
    "use strict";
    var time = 0;//距离开始的时间

    delay = delay || 1000;
    t = t || 30;
    //初始fn.isUpdata false ,设置开始时间， isUpdata 设置为true，判断isUpdata 状态，决定是否更新开始时间；
    if(!fn.isUpdata){
        fn.start = new Date().getTime();
        fn.isUpdata = true;
    }
    //每次执行，更新当前时间，即结束时间；
    fn.end = new Date().getTime();
    //获得距离开始的时间；
    time = (fn.end - fn.start);
    //如果距离开始的时间，大于或等于设置的在一定时间内必须执行的时间，则直接执行函数，将当前时间更新为开始时间，isUpdata设置为false;
    if(time >= t){
        return (function (){
            fn.start = fn.end;
            fn.isUpdata = false;
            fn();
        })();
    }
    //执行函数节流函数之前，将上一个延时器清除，从新设置延时器，若一段时间不触发，则在延迟执行时间之后执行函数；
    return (function (){
        clearTimeout(fn.id);
        fn.id = setTimeout(fn,delay);
    })();

}
