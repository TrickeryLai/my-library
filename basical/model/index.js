
class Model{
	constructor(){
		
	}

	createDom(){
		var newDom = document.createDom('div');

		return newDom;
	}

	appendTo(){

	}

	setStyles(style, dom){
		let type = Object.prototype.toString.call(style);
		//如果是一个对象
		if(type === '[object Object]' ){

		}else if(type === '[object Array]'){

		}
	}

	setStyle(styleObj, dom){
		for(var val in styleObj){
			dom.style[val] = styleObj[val];
		}
	}

	init(params = {}){
		this.params = params;


	}
}
console.log(new Model())
var a = new Date();
console.log(Object.prototype)
console.log(Object.prototype.toString.call(a), Array.prototype)
var model = new Model();

model.init();