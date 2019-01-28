
var _common = {
	/**
	 * 测试运行时间
	 * @param  {[type]}   name     [名称]
	 * @param  {Function} callback [测试的函数名]
	 * @return {[type]}            [null]
	 */
	getRunTime: function(name, callback){
		var returnData = '';
		console.time(name);
		if(callback){
			returnData = callback();
		}
		console.timeEnd(name)
		return returnData;
	}
}