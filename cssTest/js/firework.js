

function Firework(obj){
    "use strict";

    this.maxNum = obj && obj.number || 3;

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
    createBlock: function(x, y){
        "use strict";

        this.setAni(document.getElementById('qwe'),'height', '150px');
        var divBlock = document.createElement( 'div');
        var num = this.maxNum;//图片密集数
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
                top: '0'
            });

            divBlock.appendChild(imgs);

            if(i === (num -1)){
                callBack = function(){
                    document.body.removeChild(imgs.parentNode);
                };
            }

            this.setTimeoutAni(imgs, 200, mathRandom, callBack, 500*i);
        }

        // setTimeout(function(){
        //     document.body.removeChild(divBlock);
        // }, 3000);
    },
    setTimeoutAni: function(el,maxSize, random, fn, time){
        "use strict";
        setTimeout(function(){
            this.setImgAnimation(el, maxSize, random, fn);
        }.bind(this),time);

    },
    setAnimation: function(el, animationStyle){
        "use strict";
        var endStyle;
        if(typeof animationStyle === 'object'){
            for(var key in animationStyle){
                endStyle = animationStyle[key];
                this.setAni(el, key, endStyle);
            }
        }

    },
    setAni: function(el, key, endStyle){
        "use strict";
        var startStyle = parseFloat(this.getStyle(el, key)),
            increase = true,//增加或减少  true 增加
            speed = 1,//速度
            animationT = 1000,//动画执行时间
            interval;//定时器

        var unit = endStyle.replace(parseFloat(endStyle), '');

        endStyle = parseFloat(endStyle);

        speed = (startStyle - endStyle) / (animationT / 30);

        if(startStyle > endStyle){
            increase = false;
        }
        interval = setInterval(function(){
            if( increase && startStyle >= endStyle){
                clearInterval(interval);
                return;
            }
            if( !increase && startStyle <= endStyle){
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
                opacity: animationSize + 0.2
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
        newImgs.style.color = 'rgb('+ this.getMathRandom(255)+', '+ this.getMathRandom(255)+','+ this.getMathRandom(255)+')';

        fn && fn();
        return newImgs;
    },
    getMathRandom: function(n){
        "use strict";
        var num = Math.floor(Math.random() * n);

        return num;
    }
};