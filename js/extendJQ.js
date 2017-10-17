/**
 * Created by dachen on 2017/9/4.
 */
/**
 * EXTEND JQ
 * */

(function(){
    'use strict';
    if( !window._$){
        window._$ = function (ele){
            return new Lay(ele);
        };
    }

    function Lay (ele){
        this.elements = ele;
    }

    Lay.prototype = {
        constructor: Lay,
        forEach: function(){

        }
    };
})();