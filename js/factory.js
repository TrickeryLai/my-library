
//函数节流,可以限制频繁触发函数的频率。如输入框输入之后自动延迟搜索，拖拽等。参数：延迟执行函数 ， 延迟执行时间,单位ms，在一定时间内必执行，默认为30ms ，state 是否立即执行, true 立即执行， false 否，默认false；
function throttling(fn, delay, t, state){
    "use strict";

    if(t){
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
    }

    //执行函数节流函数之前，将上一个延时器清除，从新设置延时器，若一段时间不触发，则在延迟执行时间之后执行函数；
    return (function (){
        clearTimeout(fn.id);
        if( !state){
            fn.id = setTimeout(fn,delay);
        }else{
            fn();
        }

    })();

}


/*
*
* 过滤Json项
* filterData可以为数组，或者函数
*
* */
function filterJson (data,filterData){
    "use strict";
    var newData = JSON.stringify(data,filterData);
    return JSON.parse(newData);

}
//判断字符串是否为回文结构

function isPalindrome(str){
    "use strict";
     str = str.replace(/W/g, '').toLowerCase();
    return (str === str.split('').reverse().join(''));
}

//判断是否为isNaN 类型
function isNaN (n){
    if(typeof n === 'number' && n === n){
        return false;
    }
    return true;
}

//判断是否为数组
function isArray(obj){
    return Object.prototype.toString.call(obj) === '[object Array]';
}
//分割字符串
function split_$(str){
    if(typeof(str)==="string"){
        return str.split(/\s+/);//任意空格分割字符串
    }
}
function maxArr_$(arr){
    if(!isArray(arr))return;
    var item = arr[0];
    for(var i=1;i<arr.length;i++){
        if(item<arr[i]){
            item=arr[i];
        }
    }
    return item;
}
function minArr_$(arr){
    if(!isArray(arr))return;
    var item = arr[0];
    for(var i=1;i<arr.length;i++){
        if(item>arr[i]){
            item=arr[i];
        }
    }
    return item;
}
//去重
function removal_$(arr){
    if(!isArray(arr)){
        return;
    }
    var newArr= new Array("");
    for(var i=0;i<arr.length;i++){
        if(newArr.indexOf(arr[i])===-1){
            newArr.push(arr[i]);
        }
    }
    return newArr;
}
//排序
function sort_$(arr){
    var minArr=[];
    var maxArr = [];
    var newArr = [];
    (function sort_inner(arr){
        var maxItem = maxArr_$(arr);
        maxArr.unshift(maxItem);
        arr.splice(arr.indexOf(maxItem),1);
        var minItem =minArr_$(arr);
        minArr.push(minItem);
        arr.splice(arr.indexOf(minItem),1);
        if(arr.length>0){
            sort_inner(arr);
        }else{
            return newArr=minArr.concat(maxArr);
        }
    })(arr);
    return newArr;
}
function getElement(str){
    var parent = document;
    parent = getElementRecursion(parent,str);
    function getElementRecursion(parent,str){
        var str_first=str.slice(0,1);
        var str_value=str.slice(1);
        switch(str_first){
            case ".":
                return parent.getElementsByClassName(str_value);
                break;
            case "#":
                return parent.getElementById(str_value);
                break;
            default:
                return parent.getElementsByTagName(str);
        }
    }
    return parent;
}

(function(){
    function _$(strs){
        this.elements=[];
        for(var i=0;i<strs.length;i++){
            var str=strs[i];
            this.elements.push(getElement(str));
        }
    }
    _$.prototype = {
        css:function(attr,str){
            for(var n=0;n<this.elements.length;n++){
                var obj= this.elements[n];
                if(typeof (attr) ==="object"){
                    for (var i in attr){
                        obj.style[i]=attr[i];
                    }
                }else{
                    if(str){
                        obj.style[attr]=str;
                    }else{
                        if(obj.style[attr]){
                            return obj.style[attr];
                        }
                        if(obj.currentStyle){      //IE
                            return obj.currentStyle[attr];
                        }else{
                            return getComputedStyle(obj,"伪类")[attr];     //Firefox
                        }
                    }
                }
            }
            return this;
        },
        addClass:function(str){
            for(var n=0;n<this.elements.length;n++){
                var obj=this.elements[n];
                var strArr = split_$(str);//添加的类
                var objClassArr = split_$(obj.className);//元素本身的类
                var allClass = objClassArr.concat(strArr);//所有的类，未去重
                allClass = removal_$(allClass);//去重
                obj.className=allClass.join(" ").trim();//以空格转换为字符串
            }
            return this;
        },
        removeClass:function(str){
            for(var n=0;n<this.elements.length;n++){
                var obj=this.elements[n];
                var strArr = split_$(str);//去除的类
                var objClassArr = split_$(obj.className);//元素本身的类
                objClassArr = (function(){
                    for(var i=0;i<strArr.length;i++){
                        if(objClassArr.indexOf(strArr[i])!==-1){
                            objClassArr.splice(objClassArr.indexOf(strArr[i]),1)
                        }
                    }
                    return objClassArr
                })();
                obj.className=objClassArr.join(" ").trim();
            }
            return this;
        },
        isArray:function(obj){
            return Object.prototype.toString.call(obj) === '[object Array]';
        },

        drag:function(id) {
            // var dragBox = document.getElementById(id);
            // dragBox.setAttribute("drag", "true");//初始化给能拖拽的设置drag属性，方便后面控制
            // if (dragBox.css("position") !== "absolute" || dragBox.css("position") !== "fixed") {
            //     var eleLeft = parseFloat(dragBox.offset().left);
            //     dragBox.css({
            //         left: eleLeft + 'px',
            //         top: dragBox.offset().top,
            //         position: 'static',
            //         width: dragBox.css("width"),
            //         height: dragBox.css("height")
            //     });//保留开始布局,开始保留拖拽单位的基本信息，之后异步改变定位方式。
            //     setTimeout(function () {
            //         dragBox.css({position: 'absolute', margin: 0})
            //     }, 0);
            // }
            // dragBox.on("mousedown", function (e) {
            //     e.stopPropagation();
            //     var xx = e.pageX || e.clientX + document.body.scrollLeft;
            //     var yy = e.pageY || e.clientY + document.body.scrollTop;
            //     //移动盒子的当前位置
            //     var offsetTop = dragBox.offset().top;
            //     var offsetLeft = dragBox.offset().left;
            //     //鼠标在容器相对位置
            //     var x = xx - offsetLeft;
            //     var y = yy - offsetTop;
            //     //父级盒子位置
            //     var poffsetTop=element.offset().top;
            //     var poffsetLeft=element.offset().left;
            //     $('div[drag]').css({zIndex: 'auto'});
            //     $(this).css({zIndex: 999});
            //     dragBox.on("mousemove", function (e) {
            //         dragBox.css({position: 'absolute'});
            //         //鼠标按下时候，鼠标位置
            //         var xx = e.pageX || e.clientX + document.body.scrollLeft;
            //         var yy = e.pageY || e.clientY + document.body.scrollTop;
            //         $(this).css({left: xx - x + 'px', top: yy - y + 'px'})
            //     })
            // });
            // $('body').on("mouseup", function () {
            //     dragBox.unbind("mousemove");
            // });
        }
    };
    window._$ = function(){
        return new _$(arguments);
    };
})();

