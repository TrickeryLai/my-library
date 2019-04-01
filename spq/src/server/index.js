
// let protocol = location.protocol || 'http';
let protocol = 'http:';
let common = {
	ip: '114.55.255.160',
	port: '8891'
}

let commonUrl = {
	headUrl: protocol + '//' + common.ip + ':' + common.port +'/'
}


export default commonUrl;