

var fs = require('fs');

var data = '';

var readStream = fs.createReadStream('input.txt');


readStream.on('data', (chunk)=>{
	data+=chunk;
});

readStream.on('end', ()=>{
	console.log(data);
	var writeStream = fs.createWriteStream('input.txt');
	writeStream.write(data+'test','UTF8');
	writeStream.end();
})

readStream.on('error', (err)=>{
	console.log(err);
})

