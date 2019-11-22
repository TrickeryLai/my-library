
const events = require('events');
const eventEmitter = new events.EventEmitter();


const eventHandle = function(){
	console.log('连接')
	console.log('开始接收')
	eventEmitter.emit('data_receive');
};

eventEmitter.on('connection', eventHandle);

eventEmitter.on('data_receive', ()=>{
	console.log('')
	console.log('data');
})

eventEmitter.emit('connection');
