var fs = require("fs");
var zlib = require('zlib');
//解压 ***** 为 *****
fs.createReadStream('input.txt.gz').pipe(zlib.createGunzip()).pipe(fs.createWriteStream('input.txt'));
console.log("文件解压完成。");
