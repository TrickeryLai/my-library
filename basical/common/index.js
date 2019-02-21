
var _common = {
	/**
	 * 测试运行时间
	 * @param  {[type]}   name     [名称]
	 * @param  {Function} callback [测试的函数名]
	 * @return {[type]}            [null]
	 */
	getRunTime: function(name, callback){
		var returnData = '';
		if(typeof name !== 'string'){
			callback = name;

			name = 'test';
		}
		console.time(name);

		if(callback){
			returnData = callback();
		}
		console.timeEnd(name)
		return returnData;
	},

	getStyle: function(obj, attr){
		var ele = obj;
		if(typeof obj == 'string'){
			ele = document.querySelector(obj);
		}

		return ele.currentStyle ?  ele.currentStyle[attr] : getComputedStyle(ele)[attr];
	},

	/**
	 * [shake description]
	 * @param  {Function} fn        [执行的操作]
	 * @param  {[type]}   time      [延迟执行时间]
	 * @param  {[type]}   delayTime [多长时间之后必执行]
	 * @return {[type]}             [null]
	 */
	shake: function(fn, time, delayTime){
		var nowTime = 0;

		if(typeof time !== 'number'){
			time = 400;
		}
		
		clearTimeout(fn._timeout_);

		if( !fn._hasFinished_  && delayTime){
			fn._startTime_ = new Date().getTime();
			fn._hasFinished_ = true;
		}

		nowTime = new Date().getTime() - fn._startTime_;

		if(nowTime >= delayTime && delayTime){

			if(fn){

				fn();
				fn._statTime = new Date().getTime();
				fn._hasFinished_ = false;

			}

		}else{

			fn._timeout_ = setTimeout(function(){
				if(fn){
					fn();
					fn._statTime = new Date().getTime();
					fn._hasFinished_ = false;
				}
			}, time);

		}
	},

	/**
	 * [getTxtCursorPosition 获取光标位置]
	 * @param  {[type]} ele [所需要获取光标所在的元素]
	 * @return {[type]}     [光标位置]
	 */
	getTxtCursorPosition: function(ele){
		var oTxt1 =	ele;
        var cursurPosition = -1;
        var range;
        if(typeof oTxt1.selectionStart != 'undefined'){//非IE浏览器
            cursurPosition = oTxt1.selectionStart;
        }else{//IE
            range = document.selection.createRange();
            range.moveStart("character",-oTxt1.value.length);
            cursurPosition=range.text.length;
        }
        return cursurPosition;
	}
}