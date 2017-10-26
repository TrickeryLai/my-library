
/*jshint esversion: 6*/

class Observer {
    constructor(props){
        this.fns= [];
    }
    subscribe( fn ) {
        "use strict";
        let isExit = this.fns.some( (item) => {
            return item === fn;
        });

        if( !isExit ){
            this.fns.push(fn);
        }
        return this;
    }
    publish( data ) {
        "use strict";
        this.fns.forEach( (fn) => {
            fn(data);
        });
        return this;
    }
    unsubscribe (fn){
        "use strict";
        // fn 为 * 时候，全部取消监听
        if(typeof fn === 'string' && fn === '*'){
            this.fns = [];
            return this;
        }

        this.fns = this.fns.filter( ( item ) => {
            return item !== fn;
        });

        return this;
    }
    // 设置不同对象
    make (obj){
        for( let i in this){
            if(this.hasOwnProperty(i)){
                obj[i] = this[i];
                obj.fns = [];
            }
        }
        return this;
    }
}
