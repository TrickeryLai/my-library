
var http = require('http');
var figlet = require('figlet');

http.createServer(function(request, response){
	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.end('Hello world')
}).listen(8888);

figlet('Server run at http://localhost:8888', function(err){
	if(err){
		console.log('123')
	}
});