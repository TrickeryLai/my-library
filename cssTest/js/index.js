

window.onload = function(){
    "use strict";
  var initSize = new InitSize();
    initSize.onloadSet();

    document.body.onclick = function(e){
        var fireWork = new Firework({
            number: 5,
            minSize: 50
        });

        fireWork.createFireWork(e.clientX, e.clientY);
    };

};

function InitSize(obj){

    obj = obj || {};

    this.initSize = 750;
    this.initFont = 10;
    this.minSize = obj.minSize;
    this.maxSize = obj.maxSize;
}

InitSize.prototype = {
    getClientMsg: function(){
        "use strict";
        var clientW = document.body.clientWidth;
        var clientH = document.body.clientHeight;

        return {
            clientW: clientW,
            clientH: clientH
        };
    },
    setFontSize: function(){
        "use strict";

        var clientMsg = this.getClientMsg();

        var newFont = clientMsg.clientW / this.initSize * this.initFont;

        document.getElementsByTagName('html')[0].style.fontSize = newFont + 'px';
    },
    onloadSet: function(){
        "use strict";

        document.body.addEventListener('resize', this.setFontSize());
    }
};