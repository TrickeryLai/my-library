

function Firework(){
    "use strict";

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
    createBlock: function(x, y){
        "use strict";
        var divBlock = document.createElement( 'div');
        this.setStyle(divBlock, {
           width: '5rem',
           height: '5rem',
           background: 'transparent',
           position: 'absolute',
           left: x + 'px',
           top: y + 'px'
        });

        var imgs = this.createImg();
        this.setStyle(imgs, {
            width: '0',
            height: '0',
        });
        divBlock.appendChild(imgs);

        document.body.appendChild(divBlock);

        this.setAnimation(imgs);

        // setTimeout(function(){
        //     document.body.removeChild(divBlock);
        // }, 3000);
    },
    setAnimation: function(el, maxSize){
        "use strict";

        var animationSize = 1;

        maxSize = maxSize || 200;

        maxSize = Math.random() * maxSize;
        var interval = setInterval( function(){

            if(animationSize <= 0){
                document.body.removeChild( el.parentNode);
                clearInterval(interval);
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
    createImg: function(url){
        "use strict";

        url = url || './imgs/fireworks.png';

        var newImgs = new Image();
        newImgs.src = url;
        newImgs.style.color = 'rgb('+ this.getMathRandom(255)+', '+ this.getMathRandom(255)+','+ this.getMathRandom(255)+')';

        return newImgs;
    },
    getMathRandom: function(n){
        "use strict";
        var num = Math.floor(Math.random() * n);

        return num;
    }
};