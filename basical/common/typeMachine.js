
class TypeMachine {
	constructor(params = {}){
		//initValue 直接写入整个字符串， 空格代表删除前一个
		this.initValue = params.initValue || '';
		this.id = params.showId || 'typeMachine_show';
		this.concatInput = params.concatInput || 'typeMachine_input';
		this.concatInputVa = params.initValue ? params.initValue.split('') : [];
		this.showIntervalTime = params.showIntervalTime || 100;//显示时间

		this.iconsDom = '';
		this.iconInterval = '';

		this.concatInputVa = this.concatInputVa.map(function(item){
			if(item == " "){
				return -1;
			}
			return item;
		})

		this.init = this.init.bind(this);
		this.iconInter = this.iconInter.bind(this);
		this.removeIconInter = this.removeIconInter.bind(this);
		this.getIconsDom = this.getIconsDom.bind(this);
		
		this.concatInputV = this.concatInputV.bind(this);
		this.currentPosition = 0;//当前光标的位置
		
	}

	init(){
		let iconDoms = this.getIconsDom();
		let thisIdDom = document.getElementById(this.id);
		let findIconDoms = thisIdDom.getElementsByClassName('typeMachine_icondom');
		if(findIconDoms.length <= 0){
			thisIdDom.appendChild(this.iconsDom);
		}else{
			this.iconsDom = findIconDoms[0];
		}
		this.iconInter();
		this.concatInputV();
		this.createShowDom();
	}

	createShowDom(){
		let showDom = document.createElement('div');
		showDom.className = 'typeMachine_contentShow';
		showDom.style = 'display:inline-block;';
		document.getElementById(this.id).insertBefore(showDom, document.getElementById(this.id).children[0]);
	}

	iconInter(){
		
		let iconDoms = this.iconsDom;
		this.iconInterval = setInterval(function(){
			if(iconDoms.getAttribute('_show')){
				iconDoms.style.borderBottom = '1px solid #000';
				iconDoms.setAttribute('_show', true)
				return;
			}
			iconDoms.setAttribute('_show', false)
			iconDoms.style.borderBottom = '1px solid transparent;';
		}, 800)
	}

	removeIconInter(){
		clearInterval(this.iconInterval);

		this.iconsDom.style.borderBottom = '1px solid #000';
	}
	getIconsDom(){
		let domStr = '';

		domStr = document.createElement('div');
		domStr.className = 'typeMachine_icondom';
		domStr.style = "width: 10px; height: 100%; border-bottom: 1px solid #000; vertical-align: bottom; font-size: 0px;display:inline-block;";

		this.iconsDom = domStr;

		return domStr;
	}

	inputDeal(e){
		e.stopPropagation();
		let inputV;
		let myInput = document.getElementById(this.concatInput);
		let txt = window.getSelection ? window.getSelection():document.selection.createRange().text

		this.currentPosition = this.getTxtCursorPosition(myInput) - 1;//当前鼠标点击的位置
		inputV = e.data ?　e.data.split(''): [];

		//删除按键用 -1区分
		if(e.inputType === 'deleteContentBackward'){
			inputV = [-1];
		}

		// if(e.inputType === 'insertText'){
		// 	inputV = e.data;
		// }

		//汉字输入,拼音输入时候，判断
		if(e.inputType === 'insertCompositionText' && !e.data || e.data == ' '){
			return;
		}
		
		inputV = inputV.map(function(item){
			return {
				val: item,
				position: this.currentPosition
			}
		}.bind(this));
		// this.concatInputVa.push(inputV);
		this.concatInputVa = this.concatInputVa.concat(inputV);
	}

	concatInputV(){

		let myInput = document.getElementById(this.concatInput);
		let contentShowDom;
		let contentShowDomText;
		let arrV = '';
		let intervaler;
		let compositionState = false;

		myInput.addEventListener('compositionstart', function(e){
			compositionState = true;
		})

		myInput.addEventListener('compositionend', function(e){
			if(e.data){
				compositionState = false;
			}
			this.inputDeal(e);
		}.bind(this))
		
		myInput.addEventListener('input', function(e){
				clearInterval(intervaler);
				if(compositionState){
					return;
				}
				this.inputDeal(e);
		}.bind(this));

		myInput.addEventListener('keydown', function(e){
			if(e.key === 'Enter'){
				if(this.concatInputVa.length <= 0){
					return;
				}
				contentShowDom = document.getElementById(this.id).getElementsByClassName('typeMachine_contentShow')[0];
				contentShowDomText = contentShowDom.innerText.split('');
				
				this.removeIconInter();
				intervaler = setInterval(function(){

					arrV = this.concatInputVa.splice(0, 1)[0];

					if(arrV.val == '-1'){
						// contentShowDomText.pop();
						contentShowDomText.splice(arrV.position + 1, 1);
					}else if(arrV.val == ' '){
						// contentShowDomText.push('&nbsp');

						contentShowDomText.splice(arrV.position, 0, '&nbsp');
					}else{
						// contentShowDomText.push(arrV);
						contentShowDomText.splice(arrV.position, 0, arrV.val);
					}

					// contentShowDom.innerText = contentShowDomText.join('');
					contentShowDom.innerHTML = contentShowDomText.join('');

					if(this.concatInputVa.length <= 0){
						clearInterval(intervaler);
						this.iconInter();
					}
					// contentShowDom.children[arrV.position].insertBefore(this.iconsDom);
				}.bind(this), this.showIntervalTime)
			}

		}.bind(this))

	}

	//获取光标的位置
	getTxtCursorPosition(ele){
		let oTxt1 =	ele;
        let cursurPosition = -1;
        let range;
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


window.addEventListener('load', function(){

	let typeMachine = new TypeMachine({id: 'typeMachine_show', concatInput: 'typeMachine_input'});

	typeMachine.init();
	
})