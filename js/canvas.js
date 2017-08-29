/**
 * Created by dachen on 2017/7/13.
 */
(function(){
    "use strict";
    var Canvas = function(id){
        this.el = document.getElementById('myCanvas');
        this.element = this.el.getContext('2d');
    };

    Canvas.prototype = {
      initStyle: function(params){
          if(typeof params === 'object'){
              for (var key in params){
                  if(params.hasOwnProperty(key)){
                      this.element[key] = params[key];
                  }
              }
          }
          return this;
      },
      canvas: function(lineArr){
          for(var i = 0; i < lineArr.length; i+=2){
              this.element.lineTo(lineArr[i], lineArr[i+1]);
          }
          this.element.stroke();
          return this;
      },
      stroke: function(){
          this.element.stroke();
          return this;
      }
    };

    var canvas = document.getElementById('myCanvas').getContext('2d');
    canvas.strokeStyle = 'red';
    canvas.moveTo(600,200);
    canvas.lineTo(600,300);
    canvas.stroke();


})();