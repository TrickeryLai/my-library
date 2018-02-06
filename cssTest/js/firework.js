

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

        divBlock.appendChild(imgs);

        document.body.appendChild(divBlock);

        setTimeout(function(){

        }, 1000);
    },
    createImg: function(url){
        "use strict";

        url = url || './imgs/bgRound.png';

        var newImgs = new Image();
        newImgs.src = url;

        return newImgs
    }
};