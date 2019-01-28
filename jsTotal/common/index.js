var common_until = {
	createElement: function(ele, content){
		var str = '';
		ele = ele || 'div';
		content = content || '';

		str = document.createElement(ele);

		str.innerHTML = content;

		return str;
	},

	/*
	将 obj2 合并入 obj1, state： false 返回 obj1, true 返回新的对象；
	 */
	extends: function(obj1, obj2, state){
		if(state){
			obj1 = this.copy(obj1);
			obj2 = this.copy(obj2);
		}

		return this.extendFn(obj1 , obj2);
	},

	extendFn: function(obj1, obj2){
		for(var i in obj2){
			if(typeof obj1[i] == 'object' && typeof obj2[i] == 'object'){
				obj1[i] = this.extends(obj1[i], obj2[i])
			}else {
				obj1[i] = obj2[i];
			}
		}

		return obj1;
	},
	/*
	复制，返回新的对象
	 */
	copy: function(obj){
		return this.extendFn({}, obj);
	},

	getStyle: function (node) {
	    var style = null;
	    if(window.getComputedStyle) {
	        style = window.getComputedStyle(node, null);
	        //chrome、firefox、ie9(含)+
	        // console.log('globalEventContext');
	    }else{
	        style = node.currentStyle;
	        //ie7、ie8
	        // console.log('currentStyel');
	    }
	    return style;
	},

	setStyle: function(ele, style){
		var eleStyle = this.getStyle(ele);

		

	}
}