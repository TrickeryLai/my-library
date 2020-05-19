var fs = require('fs');
var fileUrl = 'input.txt'
var util = require('util')
var os = require('os')

var fileData = fs.readFileSync(fileUrl)
console.log(fileData)
fs.readFile(fileUrl, function (err, data) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(data.toString());
});
console.log(util.inspect({
  a: 1,
  b: 2
}, true, null, false))

console.log('os type', os.type())
console.log('os platform', os.platform())
console.log('os totalmem', os.totalmem())
console.log('os freemem', os.freemem())
console.log('filename: ', __filename, '__dirname: ', __dirname)
console.log('程序代码完成');