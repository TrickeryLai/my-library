

function Firework(obj){
    "use strict";
    obj = obj || {};
    this.maxNum = obj && obj.number || 3; //单次图片数量
    this.totalLimit= obj.totalLimit || 10;//最多同时存在个数，isLimit true 生效
    this.isLimit= obj.isLimit || false;//是否限制最多同时存在个数
    this.minSize = obj.minSize; // 最小尺寸

}

Firework.prototype = {
    init: function(){
        "use strict";

    },
    setStyle: function(el, obj){
        "use strict";

        for( var i in obj){
            el.style[i] = obj[i];
        }

    },
    getStyle: function(obj, property){
        "use strict";
        if(obj.currentStyle){
            return obj.currentStyle[property];
        }else if(window.getComputedStyle){
            return document.defaultView.getComputedStyle(obj,null)[property];//或者也可以通过window.getComputedStyle来获取样式
        }
        return null;
    },
    createFireWork: function(x, y){
        "use strict";

        var totalBlocks = document.getElementsByClassName('_FIREWORKS');
        //最多同时存在个数
        if(this.isLimit && totalBlocks && totalBlocks.length > this.totalLimit){
            return;
        }

        var lineBlock = this.createLine(x, y);

        var clientH = parseFloat(document.body.clientHeight);

        var callBack = function(){

            var aniCallBack = setTimeout(function(){
                document.body.removeChild(lineBlock);
                this.createBlock(x, y);
            }.bind(this), 100);

            this.setAnimation(lineBlock, {
                height: '1px',
                width: '1px'
            },100, aniCallBack);

        }.bind(this);

        this.setAnimation(lineBlock, {
            top: (y) + 'px'
        },  callBack);
    },
    createLine: function(x, y){
        "use strict";
        var lineBlock = document.createElement('div');

        var mathRandomColor = 'rgb('+ this.getMathRandom(255)+', '+ this.getMathRandom(255)+','+ this.getMathRandom(255)+')';

        var clientY = parseFloat(document.body.clientHeight);

        this.setStyle(lineBlock, {
            position: 'absolute',
            left: x + 'px',
            top: (clientY - this.getMathRandom(100)) + 'px',
            width: '1px',
            height: '15px',
            borderRadius: '10% 10% 50% 50%',
            background: '#fff',
            boxShadow: '0 0 1px 1px #fff, 0 0 2px 2px ' + mathRandomColor
        });

        document.body.appendChild(lineBlock);
        return lineBlock;
    },
    createBlock: function(x, y){
        "use strict";

        var divBlock = document.createElement( 'div');
        var num = this.maxNum;//图片密集数
        divBlock.className = '_FIREWORKS';
        this.setStyle(divBlock, {
           width: '5rem',
           height: '5rem',
           background: 'transparent',
           position: 'absolute',
           left: x + 'px',
           top: y + 'px'
        });

        document.body.appendChild(divBlock);

        var imgs, callBack;
        var mathRandom = Math.random();
        for(var i = 0; i < num; i++ ){
            imgs = this.createImg();

            this.setStyle(imgs, {
                width: '0',
                height: '0',
                position: 'absolute',
                left: '0',
                top: '0',
                color: 'rgb('+ this.getMathRandom(255)+', '+ this.getMathRandom(255)+','+ this.getMathRandom(255)+')'
            });

            divBlock.appendChild(imgs);

            if(i === (num -1)){
                callBack = function(){
                    document.body.removeChild(imgs.parentNode);
                };
            }

            this.setTimeoutAni(imgs, 200, mathRandom, callBack, 500*i);
        }

    },
    setTimeoutAni: function(el,maxSize, random, fn, time){
        "use strict";
        setTimeout(function(){
            this.setImgAnimation(el, maxSize, random, fn);
        }.bind(this),time);

    },
    setAnimation: function(el, animationStyle, animationT, callback){
        "use strict";
        var endStyle;

        if(animationT && typeof animationT === 'function'){
            callback = animationT;
        }

        callback = callback || false;
        if(typeof animationStyle === 'object'){
            for(var key in animationStyle){
                endStyle = animationStyle[key];
                this.setAni(el, key, endStyle, animationT, callback);
            }
        }

    },
    setAni: function(el, key, endStyle, animationT, callback){
        "use strict";
        var startStyle = parseFloat(this.getStyle(el, key)),
            increase = true,//增加或减少  true 增加
            speed = 1,//速度
            interval;//定时器
        if(typeof animationT === 'function'){
            callback = animationT;
            animationT = 1000; //动画执行时间
        }else{
            animationT = animationT || 1000; //动画执行时间
        }

        var unit = endStyle.toString().replace(parseFloat(endStyle), '');

        endStyle = parseFloat(endStyle);

        speed = (startStyle - endStyle) / (animationT / 30);

        if(startStyle > endStyle){
            increase = false;
        }
        interval = setInterval(function(){
            if( increase && startStyle >= endStyle){
                if(callback && typeof callback === 'function'){
                    callback();
                }
                clearInterval(interval);
                return;
            }
            if( !increase && startStyle <= endStyle){
                if(callback && typeof callback === 'function'){
                    callback();
                }
                clearInterval(interval);
                return;
            }
            el.style[key] = startStyle + unit;

            startStyle -= speed;

        }, 30);

    },
    setImgAnimation: function(el, maxSize, random, fn){
        "use strict";

        var animationSize = 1;

        maxSize = maxSize || 200;

        random = random || Math.random();

        maxSize = random * maxSize;

        if(typeof this.minSize !== 'undefined'&& this.minSize && maxSize < this.minSize){
            maxSize = this.minSize;
        }

        var interval = setInterval( function(){

            if(animationSize <= 0){
                if(fn){
                    fn();
                }
                clearInterval(interval);
                return;
            }
            this.setStyle(el, {
                width: maxSize + 'px',
                height: maxSize + 'px',
                marginLeft: - maxSize / 2 + 'px',
                marginTop: - maxSize / 2 + 'px',
                transform: 'scale('+ (1 - animationSize) +')',
                opacity: animationSize + 0.0
            });

            animationSize -= 0.01;
        }.bind(this), 30);
    },
    createImg: function(url, fn){
        "use strict";

        if(url && typeof url === 'function'){
            fn = url;
        }

        if(url && typeof url === 'string'){
            url = url;
        }

        url = url || './imgs/fireworks.png';

        var newImgs = new Image();
        newImgs.src = url;
        // newImgs.style.color = 'rgb('+ this.getMathRandom(255)+', '+ this.getMathRandom(255)+','+ this.getMathRandom(255)+')';

        fn && fn();
        return newImgs;
    },
    getMathRandom: function(n){
        "use strict";
        var num = Math.floor(Math.random() * n);

        return num;
    }
};