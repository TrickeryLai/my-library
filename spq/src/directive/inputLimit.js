
import Vue from 'vue';

Vue.directive('moneyLimit', {
  bind: function (el, item) {
    
    const n = item.value ? item.value : 2;
    const trigger = (el, type) => {
      const e = document.createEvent('HTMLEvents')
      e.initEvent(type, true, true)
      el.dispatchEvent(e)
    };

     function format_input_num(obj){
        // 清除"数字"和"."以外的字符
        // obj.value = obj.value.replace(/[^\d.]/g,"");
        // // 验证第一个字符是数字
        // obj.value = obj.value.replace(/^\./g,"");
        // // 只保留第一个, 清除多余的
        // obj.value = obj.value.replace(/\.{2,}/g,".");
        // obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        // // 只能输入两个小数
        // obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');

        var reg =new RegExp('^\\d*(\\.?\\d{0,'+n+'})','g');
        console.log(reg);
        obj.value = (obj.value.match(reg)[0]) || null;
 	};

    el.addEventListener('keyup', function(e){

        format_input_num(e.target)
        trigger(e.target, 'input')
    })

    el.addEventListener('blur', function(e){
        format_input_num(e.target)
        trigger(e.target, 'input')
    })

    

  }

})
   
