'读取文件完成'
var fs = require("fs");
var data = fs.readFileSync("input.text");
console.log(data.toString());
console.log("程序执行结束");
