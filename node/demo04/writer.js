var fs = require('fs');
var data = "写入的内容";
var writerStream = fs.createWriteStream('input.txt');
writerStream.write(data, 'UTF8');
writerStream.end();
writerStream.on('finish', function(){
console.log("写入完成。");
});
writerStream.on("error", function(err){
console.log(err.stack);
});
console.log("程序执行完毕");
