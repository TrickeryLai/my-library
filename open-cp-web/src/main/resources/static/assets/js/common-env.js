
var env = 'prod';
if(env=='dev'){
    console.log("dev");
    project.default_ip = 'http://127.0.0.1';
    project.default_port = '8890';
}else if (env =="sit"){
    console.log("sit");
    project.default_ip = 'http://117.71.57.247';
    project.default_port = '3580';
}else if (env =="prod"){
    console.log("prod");
    project.default_ip = 'http://47.113.2.4';
    project.default_port = '2890';
}
