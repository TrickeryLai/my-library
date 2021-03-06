/**
 * Created by dachen on 2017/7/11.
 */

/**
 * 享元
 * 标题提示框组件
 * 使用：
 *      添加类 .util-toolTip ,
 *      添加属性 tooltip-title 为提示文字。
 *
 *      <div class='util-toolTip' tooltip-title = '这是显示的提示文字'>toolTip</div>
 *
 * */
(function(){
    "use strict";
    var ToolTip = function(params){
        var color = params ? (params.color ? params.color : '#c8c8c8') : '#c8c8c8';
        this.delayTime = 500;//鼠标移入延迟时间显示

        if(document.getElementById('_title-tooltip')){
            this.element = document.getElementById('_title-tooltip');
        }else{
            this.element = document.createElement('_title-tooltip');
        }

        this.element.id = 'util-toolTip';
        this._utilId = 'util-toolTip';//将此 id 存储，方便后续使用
        // this.element.style.display = 'none';
        // this.element.style.position = 'absolute';
        // this.element.style.border = '1px solid '+ color;
        // this.element.style.borderRadius = '5px';
        // this.element.style.padding = '5px 6px';
        // this.element.style.background = '#fff';
        // this.element.style.boxShadow = '2px 2px 2px 0 ' + color;
        this.element.className = 'util-toolTip';
        document.getElementsByTagName('body')[0].appendChild(this.element);//插入
        //设置样式
        setCss('util-toolTip', {
            display: 'none',
            position: 'fixed',
            border: '1px solid '+ color,
            borderRadius: '5px',
            padding: '5px 6px',
            background: '#fff',
            boxShadow: '2px 2px 2px 0' + color,
            color: '#c8c8c8'
        });
    };

    ToolTip.prototype = {
        addEvnt: function(e,text){
            var _this = this,
                titleText = text,
                showFn = function(e, text){
                    _this.delayShow(e, text);
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
            var _this = this;

            clearTimeout(this.delayTimer);
            this.delayTimer = setTimeout(function(){_this.show(e,text);}, this.delayTime);
        },
        show: function(e, text){
            var x = e.clientX,
                y = e.clientY,
                screenW = document.body.clientWidth,
                screenH = document.body.clientHeight,
                leftRate = 0,
                topRate = 0,
                elementStyle = getCurrentStyle(this.element);

            if((x + parseFloat(elementStyle.width)) > screenW){
                leftRate = x - parseFloat(elementStyle.width) + 10;
            }
            this.element.innerText = text;
            setCss(this._utilId, {
                left:leftRate || (x + 5 )+ 'px',
                top: y + 5 + 'px',
                display: 'block'
            });
            // this.element.style.left = x + 5 + 'px';
            // this.element.style.top = y + 5 + 'px';
            // this.element.style.display = 'block';
        },
        hide: function(){
            clearTimeout(this.delayTimer);
            this.element.style.display= 'none';
            this.element.innerText = ' ';
        }
    };
    //为所有类为 util-toolTip 的 dom 添加事件监听
    var _utilToolTip = new ToolTip();
    _utilToolTip.addEvnt(document.getElementsByClassName('util-toolTip'));
})();

function setStyle(ids, prop, value){
    "use strict";
    if(typeof ids ==='object' && ids.length>0){
        for(var i = 0;i<ids.length; i++){
            document.getElementById(ids[i]).style[prop] = value ;
        }
    }else{
        document.getElementById(ids).style[prop] = value;
    }
}

function setCss(ids, styles){
    "use strict";
    if(typeof styles === 'object'){
        for(var key in styles){
            if(styles.hasOwnProperty(key)){
                setStyle(ids, key, styles[key]);
            }
        }
    }
}

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

function getCurrentStyle(node) {
    "use strict";
    var style = null;
    if(window.getComputedStyle) {
        style = window.getComputedStyle(node, null);
        //chrome、firefox、ie9(含)+
        // console.log('globalEventContext');
    }else{
        style = node.currentStyle;
        //ie7、ie8
        // console.log('currentStyel');
    }
    return style;
}


