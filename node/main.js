
let fs = require('fs');

fs.readFile('input.text',(err, data)=>{
	if(err){
		return console.log(err);
	}

	console.log(data.toString());
});

console.log('回调读取');
