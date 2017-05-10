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
        if(item<arr[i])item=arr[i]
    }
    return item
}
function minArr_$(arr){
    if(!isArray(arr))return;
    var item = arr[0];
    for(var i=1;i<arr.length;i++){
        if(item>arr[i])item=arr[i]
    }
    return item
}
//去重
function removal_$(arr){
    if(!isArray(arr)){
        return
    }
    var newArr= new Array("");
    for(var i=0;i<arr.length;i++){
        if(newArr.indexOf(arr[i])===-1){
            newArr.push(arr[i])
        }
    }
    return newArr;
}
//排序
function sort_$(arr){
    var minArr=new Array();
    var maxArr = new Array();
    var newArr = new Array();
    (function sort_inner(arr){
        var maxItem = maxArr_$(arr);
        maxArr.unshift(maxItem);
        arr.splice(arr.indexOf(maxItem),1);
        var minItem =minArr_$(arr);
        minArr.push(minItem);
        arr.splice(arr.indexOf(minItem),1);
        if(arr.length>0){
            sort_inner(arr)
        }else{
            return newArr=minArr.concat(maxArr)
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

