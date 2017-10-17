
/*jshint esversion: 6*/

var http = require('http');

http.createServer( function ( request, response){
    'use strict';
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end( '<h1>Hello, world\n</h1>' );
}).listen(8000);

console.log('server running at http://127.0.0.1:8000/');