//获取文件信息
var fs = require('fs');
fs.stat('input.txt', function(err, stats){
    console.log(stats);
});
