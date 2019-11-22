var fs = require("fs");
var readerStream = fs.createReadStream('input.txt');
var writerStream = fs.createWriteStream('output.txt');
readerStream.pipe(writerStream);
console.log("程序执行完成");


process.on('exit', function(code){
	setTimeout(function(){
		console.log(1)
	});

	console.log('退出码为'+ code);
})

console.log(process.arch);