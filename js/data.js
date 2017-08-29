
(function(){
    'use strict';
    var EventListener = function (){

    };

    EventListener.prototype = {
       allData: function(){
           var data = {
               a:1
           };
           return data;
       },
       //监听
        addEvent: function(){
           function fn(a,b,c){
               console.log(this);
           }
           this.allData.call(fn,1,2,3);
        },
        //广播
        _broadcast: function(){

        },
        //单独播
        singleBroadcast: function(){

        },
        //取消监听
        removeEvent: function(){

        }
    };
    var Event = new EventListener();
    console.log(Event.addEvent());
})();
