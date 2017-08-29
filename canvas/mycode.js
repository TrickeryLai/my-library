/**
 * Created by dachen on 2017/7/10.
 */
(function(){
    'use strict';
/**
 *
 * 组合模式
 */

    var CompositerFields = function(element){
      this.elementsArr = [];
      this.id= element.id || '';
      this.name = element.name || '';
    };
    CompositerFields.prototype = {
        add:function(id, name){
            this.elementsArr.push({id:id,name:name});
            return this;
        },
        remove:function(id){
            var arrData = this.elementsArr;
            for(var i=0; i<arrData.length; i++){
                if(arrData[i].id ===id){
                    arrData.splice(i,1);
                    break;
                }
            }
            this.elementsArr = arrData;
            return this;
        },
        change:function(id, changeData){
            var arrData = this.elementsArr;
            for(var i=0; i<arrData.length; i++){
                if(arrData[i].id === id){
                    arrData[i] = mergeObj(arrData[i], changeData);
                    break;
                }
            }
            this.elementsArr = arrData;
            return this;
        },
        getData: function(){
            return this.elementsArr;
        }
    };
    /*
    * 将两个简单对象进行合并， a主对象， b被合并对象
    * */
    function mergeObj (a ,b){
        if(!b){
            return ;
        }
        for (var key in b) {
            if(b.hasOwnProperty(key) && a[key]){
                a[key] = b[key];
            }
        }
        return a;
    }
    /**
     *
     * 门面模式
     * setStyle(['id1', 'id2', 'id3'], style)
     * */
    function setStyle(ids, prop, val){
        if(typeof ids === 'object'){
            for(var i=0; i<ids.length; i++){
                document.getElementById(ids[i]).style[prop] = val;
            }
        }else{
            document.getElementById(ids).style[prop] = val;
        }

    }

    function setCss(ids, styles){
        for(var key in styles){
            if(styles.hasOwnProperty(key)){
                setStyle(ids, key, styles[key]);
            }
        }
    }

    setCss(['mycode', 'code'], {color:'red', fontSize: '30px'});
    setCss('my', {color:'red', fontSize: '30px'});
    var newArr = new CompositerFields({id:'qq', name:'qeq'});
    newArr.add('a', 'name').add('b','name').change('b',{name:'changeName'}).remove('a').getData();
    var utilToolTip =new ToolTip();
    utilToolTip.addEvnt(document.getElementsByClassName('toolTip'), 'mycode');

})();

