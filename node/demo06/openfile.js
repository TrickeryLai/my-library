
let fs = require('fs');

fs.open('input.txt', 'rs', '0666',function(err, data){
	console.log(data);
})



