/**
 * Created by dachen on 2017/7/12.
 */

var Observer = function(){
    "use strict";
    this.fns = [];
};

Observer.prototype = {
    // 订阅
    subscribe: function(fn){
          "use strict";
          //若 fns 存在 fn ,hasThis 为 true；不存在则添加订阅
          var hasThis = this.fns.some(function(e){
              return (e === fn);
          });
          if(!hasThis){
              this.fns.push(fn);
          }
          return this;
      },
    // 发布
    published: function(obj){
          "use strict";
        var _this = this || window;
        this.fns.forEach(
            function(e){
                e.call(_this, obj);
            }
        );
        return this;
    },
    // 解除
    unsubscribe: function(fn){
        "use strict";
        this.fns = this.fns.filter(function(e){
            return (e !== fn);
        });
        return this;
    },
    //设置不同对象
    make: function(obj){
        "use strict";
        for(var i in this){
            if(this.hasOwnProperty(i)){
                obj[i] = this[i];
                obj.fns = [];
            }
        }
        return this;
    }
};

var Obj = new Observer();
var Obj2 = new Observer();
function f1(data){
    "use strict";
    console.log(data+'11111');
}

function f2(data){
    "use strict";
    console.log(data+'2222');
}

Obj.subscribe(f1).subscribe(f1).subscribe(f2).unsubscribe(f2).published('dataaaaaaa').subscribe(f2);
Obj2.subscribe(f1).subscribe(f1).subscribe(f2).unsubscribe(f1).published('dataaaaaa1a2').subscribe(f2);

