
/**
 * Created by dachen on 2017/9/25.
 **/

process.on('exit', function(){
   console.log(123);
   setTimeout(function(){
       console.log('延迟执行');
   },2000);
});

process.on('beforeExit', function(){
    console.log('程序即将退出');
    //设置 setTimeout ，将一直重复执行
    // setTimeout(function(){
    //     console.log('即将退出延迟执行');
    // },2000)
});

console.log('执行完成');

setTimeout(function(){
    console.log('延迟执行12314');
},4000);