
var fs = require('fs');
fs.open('input.txt', 'r+', function(err, fd){console.log('文件打开成功');console.log(fd);});

