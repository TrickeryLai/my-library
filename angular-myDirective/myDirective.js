

require('./myDirective.css');
;(function(){
    "use strict";
    angular.module('app')
        //滑动效果选择
        .directive('slideCheckedDirective', function(){
            return{
                restrict:'AEC',
                transclude: true,
                scope:{
                   isChecked: '=',//是否勾选
                    checkedText: '@',//勾选显示的文字, 默认 '是'
                    uncheckedText: '@',//取消勾选显示的文字，默认 '否'
                    checkedState: '=',//勾选时候的状态, 默认true
                    uncheckedState: '=',//未勾选时候的状态, 默认false
                },
                template:' <div class="myBasicInfo-progress-wrap inline-block">'+
                '<div class="position-relative myBasicInfo-progress-wrap myBasicInfo-progress-line {{isChecked == checkedState ? \'myBasicInfo-progress-long-line\': \'\'}}" style="width:15%">'+
                    '<button type="button" class="myBasicInfo-progress-btn position-absolute btn"  >{{isChecked == checkedState ? checkedText : uncheckedText}}</button>'+
            '</div>'+
            '</div>',
                link:function(scope, ele, attr){
                   if( !scope.checkedText){
                       scope.checkedText = '是';
                   }
                   if( scope.uncheckedText === null || typeof scope.uncheckedText === 'undefined'){
                       scope.uncheckedText = '否';
                   }
                   if( !scope.checkedState){
                       scope.checkedState = true;
                   }
                   if( scope.uncheckedState === null || typeof scope.uncheckedState === 'undefined'){
                       scope.uncheckedState = false;
                   }
                   scope.$watch('isChecked', function(){

                   });
                   ele[0].onclick = function(){
                       scope.$apply(function(){
                           if(scope.isChecked === scope.checkedState){
                               scope.isChecked = scope.uncheckedState;
                           }else{
                               scope.isChecked = scope.checkedState;
                           }
                       })

                    }
                }
            }
        })
        //搜索输入框
        .directive('searchInputDirective', ['$timeout',function($timeout){
            return {
                restrict: 'AE',
                transclude: true,
                scope:{
                    placeholder: '@',//同input placeholder
                    searchFn: '=',// 搜索函数
                    delayTime: '@', //延迟时间， 默认500ms
                    timeToDo: '@', // 一定时间必执行， 默认非必执行，单位 ms
                },
                template:'<div class="input-group">\
                <input type="text" class="form-control input-value" placeholder={{placeholder}} />\
                    <span class="input-group-addon a-link"><i class="glyphicon glyphicon-search"></i></span>\
                </div>',
                link: function(scope, ele, attr){
                    //延迟时间默认1000 ms;
                    if(scope.delayTime === null || typeof scope.delayTime === 'undefined'){
                        scope.delayTime = 500;
                    }
                    //未定义一定时间必须执行 则取消必须执行
                    if(typeof scope.timeToDo === 'undefined'){
                        scope.timeToDo = null;
                    }
                    //点击 搜索
                    ele[0].getElementsByClassName('input-group-addon')[0].onclick = function(){
                        var inputValue = ele[0].getElementsByClassName('input-value')[0].value;
                        throttling(scope.searchFn.bind(scope, inputValue), scope.delayTime, scope.timeToDo, true)
                    };
                    // 键盘输入， enter 立即搜索，其他延迟搜索, * keypress 输入汉字时候，无法正常触发，keyup 在还未选取汉字的时候即触发（待修改） *
                    angular.element(ele).delegate('.input-value', 'keyup change', function(e){
                    // ele[0].getElementsByClassName('input-value')[0].onkeypress = function(e){
                        e.stopPropagation();
                        var inputValue = ele[0].getElementsByClassName('input-value')[0].value,
                            keyCode = e.keyCode || e.charCode || e.which;
                        if(keyCode === 13){
                            throttling(scope.searchFn.bind(scope, inputValue), scope.delayTime, scope.timeToDo, true)
                        }else{
                            throttling(scope.searchFn.bind(scope, inputValue), scope.delayTime, scope.timeToDo, false)
                        }
                    });

                    //函数节流 fn-执行函数， delay-延迟事件，t-一定时间内必执行，null 则取消限制，cancel- 取消延迟事件
                    function throttling(fn, delay, t, cancel){
                        "use strict";
                        if(t){
                            var time = 0;//距离开始的时间

                            delay = delay || 1000;
                            t = t || 30;
                            //初始fn.isUpdata false ,设置开始时间， isUpdata 设置为true，判断isUpdata 状态，决定是否更新开始时间；
                            if(!fn.isUpdata){
                                fn.start = new Date().getTime();
                                fn.isUpdata = true;
                            }
                            //每次执行，更新当前时间，即结束时间；
                            fn.end = new Date().getTime();
                            //获得距离开始的时间；
                            time = (fn.end - fn.start);
                            //如果距离开始的时间，大于或等于设置的在一定时间内必须执行的时间，则直接执行函数，将当前时间更新为开始时间，isUpdata设置为false;
                            if(time >= t){
                                return (function (){
                                    fn.start = fn.end;
                                    fn.isUpdata = false;
                                    fn();
                                })();
                            }
                        }
                        //执行函数节流函数之前，将上一个延时器清除，从新设置延时器，若一段时间不触发，则在延迟执行时间之后执行函数；
                        return (function (){
                            $timeout.cancel(fn.id);
                            //是否取消
                            if( !cancel){
                                fn.id = $timeout(fn(),delay);
                            }else{
                                fn();
                            }
                        })();

                    }
                }
            }
        }])
        //图片上传
        .directive('imgUploadDirective',['toaster', function(toaster){
            return {
                restrict: 'AE',
                replace: true,
                // priority: 10,//指令优先级
                scope:{
                    token: '@',//token
                    maxSize: '@', //上传的最大尺寸
                    fileUrl: '=',//默认地址，上传url
                    qiniuFilters: '=',//配置
                    uploadState: '=',//当前是否在上传，false ,未上传， true 正在上传
                    uploadStateCode: '=', //当前上传的进度，0，未开始，1，正在上传，2，上传成功，3，上传失败
                    uploadErrorFn: '=', //上传失败回调，传递失败参数
                    uploadSuccessFn: '=', //上传成功回调，传递上传成功文件
                },
                template: '<div>\
                    <div class="margin-lf-none padding-lf-none margin-right-5px show-pic ng-File-UpLoad-Bt text-center">\
                       <img ng-show="fileUrl" src="{{fileUrl ? fileUrl :\'./dev/assets/img/Group_defaultImage_xhdpi.png\'}}" width="100%" height="100%" />\
                       <i ng-show="!fileUrl" class="fa fa-file-picture-o" style="font-size:55px;line-height:65px;color:#dee5e7;margin: 3rem;"></i>\
                         <div ng-show="infoData.logo" style="position: absolute;bottom: 5px;right: 5px;">\
                            <i class="glyphicon glyphicon-camera file-ioc"></i>\
                        </div>\
                    </div>\
                    <div class="col-sm-12 m-t-8 padding-lf-none upload-process-line">\
                        <div class="progress m-b-none col-sm-12 padding-none">\
                            <div class="progress-bar progress-bar-striped progress-bar-success active font-bold" role="progressbar m-b-none" aria-valuenow="{{videoUploadPercent}}"\
                                 aria-valuemin="0" aria-valuemax="100" style="width: {{videoUploadPercent}}%;min-width: 2em;">\
                                {{videoUploadPercent>0?videoUploadPercent:0}}%\
                                <span class="sr-only">{{videoUploadPercent}}%</span>\
                            </div>\
                        </div>\
                    </div>\
                    <!-- 七牛上传组件 -->\
                    <qiniu-uploader token="{{token}}" bucket="community" progress-call-back="fileUploadProcess" upload="upload" filters="qiniuFilters"\
                                    file-list="fileList" cancel="cancel" max-file-size="{{maxSize}}" chunk-sizee="1mb" unique-names="true" multi-selection="false"\
                                    success-call-back="uploaderSuccess" error-call-back="uploaderError" added-call-back="uploaderAdded"></qiniu-uploader>\
                </div>',
                link: function(scope, ele, attr){
                    var element = angular.element(ele);
                    scope.uploadStateCode = 0;
                    scope.uploadState= false;

                    //进度条
                    scope.$watch('videoUploadPercent', function(){

                        if(scope.videoUploadPercent > 0 && scope.videoUploadPercent < 100){
                            element.find('.upload-process-line').show();
                        }else{
                            element.find('.upload-process-line').hide();
                        }
                    });

                    scope.qiniuFilters = scope.qiniuFilters || {
                            mime_types: [ //只允许
                                {
                                    title: "Image files",
                                    extensions: "jpg,png,jpeg,bmp"
                                }
                            ]
                        };

                    //点击上传
                    element.delegate('.show-pic','click', function(){
                        scope.upload();
                    });

                    //添加文件回调
                    scope.uploaderAdded = function(up, file) {
                        scope.videoUploadPercent = 1;
                        scope.$file = file ? file[0] : [];
                        scope.uploadStateCode = 1;
                        scope.uploadState = true;
                        scope.$apply();
                    };

                    // 每个文件上传成功回调
                    scope.uploaderSuccess = function(up, file, info) {
                        scope.videoUploadPercent = 100;
                        //文件名
                        scope.$fileSuccess = file;
                        scope.fileUrl = file.url;
                        scope.uploadStateCode = 2;
                        scope.uploadState = false;
                        //上传成功回调
                        scope.uploadSuccessFn && scope.uploadSuccessFn.call(null, up, file, info);
                        scope.$apply();

                    };

                    // 每个文件上传失败后回调
                    scope.uploaderError = function(up, err, errTip) {
                        scope.uploadStateCode = 3;
                        scope.uploadState = false;
                        if(err.code=== -600){
                            toaster.pop('error', null, '文件大小超过'+scope.maxSize+'，无法上传');
                        }else{
                            toaster.pop('error', null, errTip);
                        }
                        scope.uploadErrorFn && scope.uploadErrorFn.call(scope, up, err, errTip);
                        scope.$apply();
                    };

                    //上传进度
                    scope.fileUploadProcess = function(up, file) {
                        scope.videoUploadPercent = file.percent == 100 ? 99 : file.percent;
                        scope.$apply();
                    };
                }
            }
        }])
        //视频上传
        .directive('videoUploadDirective',['toaster','modal', function(toaster, modal){
            return {
                restrict: 'AE',
                replace: true,
                // priority: 10,//指令优先级
                scope:{
                    token: '@',//token
                    maxSize: '@', //上传的最大尺寸
                    fileUrl: '=',//默认地址，上传url,
                    fileHide:'=', //是否显示关闭按钮
                    qiniuFilters: '=',//配置
                    uploadState: '=',//当前是否在上传，false ,未上传， true 正在上传
                    uploadStateCode: '=', //当前上传的进度，0，未开始，1，正在上传，2，上传成功，3，上传失败
                    uploadErrorFn: '=', //上传失败回调，传递失败参数
                    uploadSuccessFn: '=', //上传成功回调，传递上传成功文件
                    uploadRemoveFn: '=', //删除视频回调
                },
                template: '<div>\
                <div class="col-sm-5 margin-lf-none padding-lf-none margin-right-5px show-video" >\
                    <video controls="controls" controlsList="nodownload nofullscreen" src=""  width="100%" height="150" class="border-1px-gray my-video" ></video>\
                    <img src="" alt="" width="100%" height="150" class="video-frame" />\
                    <i class="glyphicon glyphicon-remove myBasicInfo-video-remove" ng-hide="fileHide"></i>\
                </div>\
                <div class="inline-block" >\
                    <a class="btn btn-default shadow_none upload-btn">{{uploadBtnText}}</a>\
                </div>\
                <div class="col-sm-12 m-t-8 padding-lf-none upload-process-line">\
                    <div class="progress m-b-none col-sm-9 padding-none">\
                        <div class="progress-bar progress-bar-striped progress-bar-success active font-bold" role="progressbar m-b-none" aria-valuenow="{{videoUploadPercent}}"\
                            aria-valuemin="0" aria-valuemax="100" style="width: {{videoUploadPercent}}%;min-width: 2em;">\
                            {{videoUploadPercent>0?videoUploadPercent:0}}%\
                            <span class="sr-only">{{videoUploadPercent}}%</span>\
                        </div>\
                    </div>\
                    <div class="col-sm-3 cursor-pointer upload-cancel" >\
                        取消上传\
                    </div>\
                </div>\
                <div class="col-sm-5 upload-success-show" >\
                    <i class="fa fa-check-circle fa-fw text-success font-size-55 col-sm-2"></i>\
                    <div class="col-sm-7 p-t-10">\
                        <p>视频上传成功</p>\
                        <p class="upload-video-name">{{$fileSuccess.name}}</p>\
                    </div>\
                    <div class="col-sm-6 cursor-pointer height-55 padding-top-16 upload-again" >\
                        <i class="glyphicon glyphicon-repeat"></i>&nbsp;重新上传\
                    </div>\
                </div>\
                <!-- 七牛上传组件 -->\
                <qiniu-uploader token="{{token}}" bucket="community" progress-call-back="fileUploadProcess" upload="upload" filters="qiniuFilters"\
                                file-list="fileList" cancel="cancel" max-file-size="{{maxSize}}" chunk-sizee="1mb" unique-names="true" multi-selection="false"\
                                success-call-back="uploaderSuccess" error-call-back="uploaderError" added-call-back="uploaderAdded"></qiniu-uploader>\
                </div>',
                link: function(scope, ele, attr){
                    var element = angular.element(ele),
                        uploadBtn = element.find('.upload-btn');
                    scope.uploadStateCode = 0;
                    scope.uploadState= false;

                    scope.$watch('fileUrl', function(){
                        if( !scope.fileUrl){
                            element.find('.show-video').hide();
                            scope.uploadBtnText = '上传视频';
                        }else{
                            scope.uploadBtnText = '重新上传视频';
                            element.find('.show-video').show();
                        }
                        element.find('.my-video').eq(0).attr('src',scope.fileUrl);
                    });

                    scope.$watch('videoUploadPercent', function(){
                        if(scope.videoUploadPercent > 0 && scope.videoUploadPercent < 100){
                            element.find('.upload-process-line').show();
                            uploadBtn.hide();
                        }else{
                            if( scope.videoUploadPercent !== 100){
                                uploadBtn.show();
                            }
                            element.find('.upload-process-line').hide();

                        }

                        if(scope.videoUploadPercent >= 100){
                            element.find('.upload-success-show').show();
                        }else{
                            element.find('.upload-success-show').hide();
                        }
                    });
                    //点击上传
                    element.delegate('.upload-btn', 'click', function(){
                        scope.upload();
                    })
                        //重新上传
                        .delegate('.upload-again', 'click', function(){
                            scope.upload();
                        })
                        //移除
                        .delegate( '.myBasicInfo-video-remove', 'click', function(){
                            modal.confirm("提示","确认删除么？",function(){
                                scope.fileUrl = "";
                                scope.videoUploadPercent = 0;
                                uploadBtn.show();
                                scope.uploadStateCode = 3;
                                scope.uploadState = false;
                                scope.uploadRemoveFn && scope.uploadRemoveFn();
                                scope.$apply();
                            },function(){});

                        })
                        //取消上传
                        .delegate('.upload-cancel', 'click', function(){
                            scope.cancel(scope.$file, 0, true);
                            
                            scope.videoUploadPercent = 0;
                            uploadBtn.show();
                            scope.uploadStateCode = 3;
                            scope.uploadState = false;
                            scope.$apply();
                        });

                    scope.qiniuFilters = scope.qiniuFilters || {
                            mime_types: [ //只允许视频上传
                                {
                                    title: "Video files",
                                    extensions: "flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4"
                                }
                            ]
                        };

                    //添加文件回调
                    scope.uploaderAdded = function(up, file) {
                        scope.videoUploadPercent = 0;
                        scope.$file = file ? file[0] : [];
                        uploadBtn.hide();
                        scope.uploadStateCode = 1;
                        scope.uploadState = true;
                        scope.$apply();
                    };
                    // 每个文件上传成功回调
                    scope.uploaderSuccess = function(up, file, info) {
                        
                        scope.videoUploadPercent = 100;
                        //判断上传类型
                        if(file.type.indexOf ('mp4') !== -1){
                            element.find('.my-video').eq(0).show();
                            element.find('.video-frame').attr('src', '').hide();
                        }else{
                            element.find('.my-video').eq(0).hide();
                            element.find('.video-frame').attr('src', file.url+ '?vframe/jpg/offset/1/w/360/h/180').show();
                        }
                        uploadBtn.hide();
                        //文件名
                        scope.$fileSuccess = file;
                        scope.fileUrl = file.url;
                        scope.uploadState = false;
                        //上传成功回调
                        scope.uploadSuccessFn && scope.uploadSuccessFn.call(null,up, file, info);
                        scope.uploadStateCode = 2;
                        scope.$apply()
                    };

                    // 每个文件上传失败后回调
                    scope.uploaderError = function(up, err, errTip) {
                        scope.videoUploadPercent = 0;
                        scope.uploadStateCode = 3;
                        scope.uploadState = false;
                        if(err.code=== -600){
                            toaster.pop('error', null, '文件大小超过'+scope.maxSize+'，无法上传');
                        }else{
                            toaster.pop('error', null, errTip);
                        }
                        scope.uploadErrorFn && scope.uploadErrorFn.call(scope, up, err, errTip);
                        scope.$apply();
                    };

                    //上传进度
                    scope.fileUploadProcess = function(up, file) {
                        scope.videoUploadPercent = file.percent == 100 ? 99 : file.percent;
                    };
                }
            }
        }])
        // 音频上传
        .directive('audioUploadDirective',['$sce','toaster','modal', function($sce,toaster, modal){
            return {
                restrict: 'AE',
                replace: true,
                // priority: 10,//指令优先级
                scope:{
                    token: '@',//token
                    maxSize: '@', //上传的最大尺寸
                    fileUrl: '=',//默认地址，上传url
                    qiniuFilters: '=',//配置
                    uploadState: '=',//当前是否在上传，false ,未上传， true 正在上传
                    uploadStateCode: '=', //当前上传的进度，0，未开始，1，正在上传，2，上传成功，3，上传失败
                    uploadErrorFn: '=', //上传失败回调，传递失败参数
                    uploadSuccessFn: '=', //上传成功回调，传递上传成功文件
                },
                template: '<div>\
                <div class="col-sm-5 margin-lf-none padding-lf-none margin-right-5px show-video" >\
                    <div class="my-video" ng-repeat="video in fileUrl track by $index">\
                        <span>{{video.name || "" }}</span>\
                        <p class="error_info hide text-info">暂时无法播放</p>\
                        <audio class="my_audio my-video" controls="controls" controlsList="nodownload nofullscreen " ng-src="{{video.url2}}"  width="100%" height="150"></audio>\
                    </div>\
                </div>\
                <div class="inline-block" >\
                    <a class="btn btn-default shadow_none upload-btn">{{uploadBtnText}}</a>\
                </div>\
                <div class="col-sm-12 m-t-8 padding-lf-none upload-process-line">\
                    <div class="progress m-b-none col-sm-9 padding-none">\
                        <div class="progress-bar progress-bar-striped progress-bar-success active font-bold" role="progressbar m-b-none" aria-valuenow="{{videoUploadPercent}}"\
                            aria-valuemin="0" aria-valuemax="100" style="width: {{videoUploadPercent}}%;min-width: 2em;">\
                            {{videoUploadPercent>0?videoUploadPercent:0}}%\
                            <span class="sr-only">{{videoUploadPercent}}%</span>\
                        </div>\
                    </div>\
                    <div class="col-sm-3 cursor-pointer upload-cancel" >\
                        取消上传\
                    </div>\
                </div>\
                <div class="col-sm-5 upload-success-show" >\
                    <i class="fa fa-check-circle fa-fw text-success font-size-55 col-sm-2"></i>\
                    <div class="col-sm-7 p-t-10">\
                        <p>音频上传成功</p>\
                        <p class="upload-video-name">{{$fileSuccess.name}}</p>\
                    </div>\
                    <div class="col-sm-6 cursor-pointer height-55 padding-top-16 upload-again">\
                        <i class="glyphicon glyphicon-repeat"></i>&nbsp;重新上传\
                    </div>\
                </div>\
                <!-- 七牛上传组件 -->\
                <qiniu-uploader token="{{token}}" bucket="community" progress-call-back="fileUploadProcess" upload="upload" filters="qiniuFilters"\
                                file-list="fileList" cancel="cancel" max-file-size="{{maxSize}}" chunk-sizee="1mb" unique-names="true" multi-selection="false"\
                                success-call-back="uploaderSuccess" error-call-back="uploaderError" added-call-back="uploaderAdded"></qiniu-uploader>\
                </div>',
                link: function(scope, ele, attr){
                    var element = angular.element(ele),
                        uploadBtn = element.find('.upload-btn');
                    scope.uploadStateCode = 0;
                    scope.uploadState= false;
                    scope.videoUploadPercent=0;
                    scope.$watch('fileUrl', function(){
                        if( !scope.fileUrl){
                            element.find('.show-video').hide();
                            scope.uploadBtnText = '上传音频';
                        }else{
                            scope.uploadBtnText = '重新上传音频';
                            element.find('.show-video').show();
                        }
                    });

                    scope.$watch('videoUploadPercent', function(){
                        if(scope.videoUploadPercent > 0 && scope.videoUploadPercent < 100){
                            element.find('.upload-process-line').show();
                            element.find('.my-video').hide();
                            uploadBtn.hide();
                        }else{
                            if( scope.videoUploadPercent !== 100){
                                uploadBtn.show();
                            }
                            element.find('.upload-process-line').hide();
                            element.find('.my-video').show();

                        }
                        if(scope.videoUploadPercent >= 100){
                            element.find('.upload-success-show').show();
                        }else{
                            element.find('.upload-success-show').hide();
                        }
                    });
                    //点击上传
                    element.delegate('.upload-btn', 'click', function(){
                        scope.upload();
                    })
                        //重新上传
                        .delegate('.upload-again', 'click', function(){
                            scope.upload();
                        })
                        //取消上传
                        .delegate('.upload-cancel', 'click', function(){
                            scope.cancel(scope.$file, 0, true);
                            
                            scope.videoUploadPercent = 0;
                            uploadBtn.show();
                            scope.uploadStateCode = 3;
                            scope.uploadState = false;
                            scope.$apply();
                        });

                    scope.qiniuFilters = scope.qiniuFilters || {
                            mime_types: [ //只允许视频上传
                                {
                                    title: "Video files",
                                    extensions: "mp3,wma,aac,mid,wav,vqf,cda"
                                }
                            ]
                        };

                    //添加文件回调
                    scope.uploaderAdded = function(up, file) {
                        scope.videoUploadPercent = 0;
                        scope.$file = file ? file[0] : [];
                        uploadBtn.hide();
                        scope.uploadStateCode = 1;
                        scope.uploadState = true;
                        scope.$apply();
                    };
                    // 每个文件上传成功回调
                    scope.uploaderSuccess = function(up, file, info) {
                        if(file.type.indexOf ('mp3') !== -1){

                        }else{
                            element.find('.error_info').show()
                        }
                        var audio = {};
                        audio.type=2;
                        audio.url2 = $sce.trustAsResourceUrl(file.url);
                        audio.url =file.url;
                        audio.size = file.size;
                        audio.suffix = file.type.substring(file.type.indexOf('/') + 1, file.type.length);
                        audio.name= file.name;
                        scope.videoUploadPercent = 100;
                        uploadBtn.hide();
                        //文件名

                        scope.$fileSuccess = file;
                        if(scope.fileUrl){
                            scope.fileUrl=[]
                        }else{
                            scope.fileUrl=[]
                        }
                        scope.fileUrl.push(audio)
                        scope.uploadState = false;
                        //上传成功回调
                        scope.uploadSuccessFn && scope.uploadSuccessFn.call(null,scope.fileUrl, info);
                        scope.uploadStateCode = 2;
                        scope.$apply()
                    };

                    // 每个文件上传失败后回调
                    scope.uploaderError = function(up, err, errTip) {
                        scope.videoUploadPercent = 0;
                        scope.uploadStateCode = 3;
                        scope.uploadState = false;
                        if(err.code=== -600){
                            toaster.pop('error', null, '文件大小超过'+scope.maxSize+'，无法上传');
                        }else{
                            toaster.pop('error', null, errTip);
                        }
                        scope.uploadErrorFn && scope.uploadErrorFn.call(scope, up, err, errTip);
                        scope.$apply();
                    };

                    //上传进度
                    scope.fileUploadProcess = function(up, file) {
                        scope.videoUploadPercent = file.percent == 100 ? 99 : file.percent;
                    };
                }
            }
        }])
        //上传附件
        .directive('fileUploadDirective',['toaster','modal','$timeout', function(toaster, modal,$timeout){
            return {
                restrict: 'AE',
                replace: true,
                // priority: 10,//指令优先级
                scope:{
                    newData:'=',
                    token: '@',//token
                    maxSize: '@', //最终的附件list，传过来的list
                    files: '=',//默认地址，上传url
                    qiniuFilters: '=',//配置
                    uploadState: '=',//当前是否在上传，false ,未上传， true 正在上传
                    uploadStateCode: '=', //当前上传的进度，0，未开始，1，正在上传，2，上传成功，3，上传失败
                    uploadErrorFn: '=', //上传失败回调，传递失败参数
                    uploadSuccessFn: '=', //上传成功回调，传递上传成功文件
                },
                template: '<div>\
                <div class="inline-block col-sm-2" >\
                    <a class="btn btn-default shadow_none w-100px upload-btn " ng-click="upload()">添加 +</a>\
                </div>\
                <div class="col-sm-8 margin-lf-none padding-lf-none margin-right-5px show-video" >\
                    <div class=" row my-video" ng-repeat="f in files track by $index">\
                        <span class="col-sm-8 " ng-bind="f.file.file_name || f.name"></span>\
                        <span class="col-sm-2" >{{f.percent || f.file.percent }}%</span>\
                        \<a class="col-sm-2 text-danger" ng-click="delfile(f,$index)">删除</a>\
                </div>\
                    <div class="row  my-video" ng-repeat="new in newData track by $index">\
                        <span class="col-sm-8 " ng-bind="new.file.file_name || new.name"></span>\
                        <span class="col-sm-2">{{new.percent || 0}}%</span>\
                        \<a class="col-sm-2 text-danger" ng-click="delnew(new,$index)">删除</a>\
                    </div>\
            </div>\
            <!-- 七牛上传组件 -->\
            <qiniu-uploader token="{{token}}" bucket="community" progress-call-back="fileUploadProcess" upload="upload" filters="qiniuFilters"\
                            file-list="fileList" cancel="cancel" max-file-size="{{maxSize}}" chunk-sizee="1mb" unique-names="true" multi-selection="false"\
                            success-call-back="uploaderSuccess" error-call-back="uploaderError" added-call-back="uploaderAdded"></qiniu-uploader>\
                </div>',
                link: function(scope, ele, attr){
                    var element = angular.element(ele),
                        uploadBtn = element.find('.upload-btn');
                    scope.uploadStateCode = 0;
                    scope.uploadState= false;
                    scope.qiniuFilters = scope.qiniuFilters || {
                            // mime_types: [ //只允许视频上传
                            //     {
                            //         title: "",
                            //         extensions: ""
                            //     }
                            // ]
                        };
                    scope.newData=[];    
                    //添加文件回调
                    scope.uploaderAdded = function(up, file) {
                        scope.$file = file ? file[0] : [];
                        scope.newData.push(scope.$file)
                        file[0].fileUploadPercent = 0;
                        scope.videoUploadPercent = 0;
                        //scope.files.push(scope.$file);
                        scope.uploadStateCode = 1;
                        scope.uploadState = true;
                        scope.$apply();
                    };
                    // 每个文件上传成功回调
                    scope.uploaderSuccess = function(up, file, info) {
                        var pemes={}
                        angular.forEach(scope.newData,function(_item,_idx){
                            if(_item.id==file.id){
                                var pemes={
                                    type:0,
                                    percent:100,
                                    file:{
                                        file_id:_item.id,
                                        file_name:_item.name,
                                        file_url:_item.url,
                                        size:_item.size,
                                        sizeStr:_item.loadedSize,
                                        type:_item.type,
                                        suffix:_item.name.split('.')[_item.name.split('.').length -1] || ''
                                    }
                                }
                                if(['mp4','avi','rmvb','rm','asf','divx','mpg','mpeg','mpe','wmv','mkv','vob','mov','flv','3gp'].indexOf(pemes.file.suffix) > -1){ //视频
                                    pemes.type =1; // （通过attachments里的type字段来区分音视频，视频1，音频2，其他类型0）
                                }
                                if(['mp3','wma','aac','mid','wav','vqf','cda'].indexOf(pemes.file.suffix) > -1){
                                    pemes.type =2;
                                }
                                if(scope.files){

                                }else{
                                    scope.files=[]
                                }
                                scope.files.push(pemes);
                                scope.newData.splice(_idx,1);
                                scope.files = angular.copy(scope.files);
                            }
                        })
                       
                        //上传成功回调
                        //scope.uploadSuccessFn && scope.uploadSuccessFn.call(null,up, file, info);

                        scope.$apply()
                    };

                    // 每个文件上传失败后回调
                    scope.uploaderError = function(up, err, errTip) {
                        if(err.code=== -600){
                            toaster.pop('error', null, '文件大小超过'+scope.maxSize+'，无法上传');
                        }else{
                            toaster.pop('error', null, errTip);
                        }
                        scope.uploadErrorFn && scope.uploadErrorFn.call(scope, up, err, errTip);
                        scope.$apply();
                    };
                    scope.$watch('files',function(newValue,oldValue){
                        if(!scope.files){
                           return
                        }else{
                            $timeout(function(){
                                scope.uploadSuccessFn && scope.uploadSuccessFn.call(null, newValue);
                            },5)
                        }
                    });
                    
                    //上传进度
                    scope.fileUploadProcess = function(up, file) {
                        angular.forEach(scope.newData,function(_file,_idx){
                            if(_file.id ==file.id){
                                _file.percent =file.percent == 100 ? 99 : file.percent
                            }
                                
                        })
                    };
                    //删除
                    scope.delfile=function(_file,_idx){
                        
                        scope.files.splice(_idx,1);
                        scope.files =angular.copy(scope.files);
                        
                    }
                    scope.delnew=function(_file,_idx){
                        
                        scope.newData.splice(_idx,1);
                        scope.cancel(_file, 0,false,true);
                        
                    }
                }
            }
        }]) 
        //输入限制，限制数字
        .directive('inputLimit', function(){
            return {
                restrict: 'A',
                scope:{
                    minValue: '=',
                    maxValue: '=',
                },
                require: 'ngModel',
                link: function(scope, ele, attr, ngModel){
                    ngModel.$parsers.push(function(value){
                        var val;
                        val = parseInt(value);
                        if(!val || isNaN(val)){
                            val = typeof scope.minValue !== 'undefined' ? 0 : '';
                        }

                        if(scope.maxValue && val > scope.maxValue){
                            val = scope.maxValue;
                        }
                        ngModel.$setViewValue(val);
                        ngModel.$render();
                        return val
                    })

                }
            }
        })
        //输入 select
        .directive('inputSelect', ['$timeout','toaster', function($timeout, toaster){
            return {
                restrict: 'A',
                scope:{
                    allData: '=', //全部集合
                    placeholder:'@',
                    selectArr: '=', //已选择的集合
                    selectArrId: '=',//已选择的集合id
                    maxSelect: '@'
                },
                template: '<div class="position-relative">' +
                    '<input type="text" ng-model="inputVal" ng-change="selectChange()" ng-focus="isListShow = true" class="form-control" placeholder={{placeholder}} ng-keydown = "inputEnter($event)" ng-click="isListShow = true"/>' +
                    '<div ng-show="isListShow" class="mydirective-select-list-wrap">' +
                    '<div ng-show="isListShow" class="mydirective-select-list">' +
                        '<ul class="mydirective-select-ul">' +
                            '<li ng-repeat="item in choseArr track by $index"  ng-click="selectItem(item, $index)" ng-class="{\'active\': $index === nowSelectNum}" ng-mouseenter="mouseSelect(item, $index)">{{item.name}}</li>' +
                            '<li ng-show="choseArr.length <= 0">无对应标签！</li>' +
                        '</ul>' +
                    '</div>' +
                    '<div class="mydirective-select-block">' +
                    '</div>' +
                    '</div>' +
                '</div>',
                link: function(scope, ele, attr){

                     scope.nowSelectNum = 0;//当前选择

                     scope.choseArr = angular.copy(scope.allData);

                     if( !scope.selectArr ){
                         scope.selectArr = [];
                     }

                    scope.selectChange = function(){
                        scope.nowSelectNum = 0;
                        scope.choseArr = getNewArr(scope.inputVal, scope.allData)
                    };

                    scope.selectItem = function(item, index){
                        $(ele).find('input').eq(0).focus();
                        scope.nowSelectNum = index;
                        if(scope.selectArr.length >= parseInt(scope.maxSelect)){
                            toaster.pop('error',null,'最多添加'+ scope.maxSelect);
                            return ;
                        }
                        scope.inputVal = item.name;
                        scope.selectArr = addSelect(scope.selectArr,item);
                    };

                    scope.mouseSelect = function(item, index){
                        scope.nowSelectNum = index;
                    };

                    scope.inputEnter = function(e){
                        e.stopPropagation();
                        var keyCode = e.keyCode || e.charCode || e.which;
                        //enter
                        if(keyCode === 13){
                            if( !scope.inputVal ){
                                scope.inputVal = scope.choseArr[scope.nowSelectNum].name;
                            }
                            if(scope.choseArr.length > 0){
                                scope.selectItem(scope.choseArr[scope.nowSelectNum]);
                            }
                            scope.nowSelectNum = 0;
                        }
                        //esc
                        if(keyCode === 27){
                            scope.isListShow = false;
                        }
                        //up
                        if(keyCode === 40){
                            scope.nowSelectNum = ( scope.nowSelectNum + 1 ) >= scope.choseArr.length ? 0 : scope.nowSelectNum + 1 ;
                            scope.inputVal = scope.choseArr[scope.nowSelectNum].name;

                        }
                        //down
                        if(keyCode === 38){
                            scope.nowSelectNum = ( scope.nowSelectNum - 1 ) <= 0 ? scope.choseArr.length : scope.nowSelectNum - 1 ;
                            scope.inputVal = scope.choseArr[scope.nowSelectNum].name;
                        }
                    };

                    scope.$watch('nowSelectNum', function(n){
                        if( $(ele).find('li.active').length <= 0) return;
                        $timeout(function(){
                            var scrollTopN = ($(ele).find('li.active').eq(0).offset().top - $(ele).find('div.mydirective-select-list-wrap').eq(0).offset().top ),
                                scrollTop = $(ele).find('div.mydirective-select-list-wrap').eq(0).scrollTop(),//当前滚动条的高度
                                wrapH =  $(ele).find('div.mydirective-select-list-wrap').eq(0).height(),//外面容器的高度
                                scrollReal = 0;//真实滚动高度
                            if(scrollTopN <= wrapH - 50){
                                scrollReal = 0;
                            }else if(n === scope.choseArr.length -1){
                                scrollReal = $(ele).find('div.mydirective-select-list').eq(0).height() + $(ele).find('div.mydirective-select-list').eq(0).offset().top - $(ele).find('div.mydirective-select-list-wrap').eq(0).offset().top;
                            }
                            $(ele).find('div.mydirective-select-list-wrap').eq(0).scrollTop(scrollReal);
                        },0)


                    }, true);

                    //列表显示，监听点击事件，否则取消监听
                    scope.$watch('isListShow', function(isListShow){
                        if(isListShow){
                            document.addEventListener('click', docClick);
                        }else{
                            document.removeEventListener('click', docClick);
                        }
                    });

                   function docClick(e){
                       //点击区域外，列表隐藏
                        if($(ele).has(e.target).length <= 0){
                            scope.isListShow = false;
                        }else if(e.target.nodeName === 'LI'){
                            scope.isListShow = true;
                        }
                        scope.$apply();
                    }

                    //遍历查询
                    function getNewArr (val, data){
                        if( !val){
                            return data;
                        }
                        var newArr = [];
                        for(var i = 0; i < data.length; i++){
                            if(data[i].name.indexOf(val) >= 0){
                                newArr.push(data[i]);
                            }
                        }
                        return newArr;
                    }

                    //判断是否存在
                    function addSelect(data, item){
                        var isHas = false;
                        for(var i=0; i< data.length; i++){
                            if(data[i].id && data[i].id === item.id){
                                isHas = true;
                                break;
                            }
                        }
                        if(!isHas){
                            data.push(item);
                        }
                        return data;
                    }
                }
            }
        }])
        //鼠标右键
        .directive('rightClick', ['$window', function($window) {
            return {
                restrict: 'A',
                scope: {
                    menuContent: '=',
                    item: '=',
                    getCurrentItemFn: '=',//当前操作的 item 标志
                },
                link: function(scope, element, attrs) {

                    if( !scope.target){
                        scope.target = 'directive-rightMenu';
                    }

                    if(document.getElementById(attrs.target)){
                        var menuElement = angular.element(document.getElementById(attrs.target));
                    }else{
                        var menuElement = document.createElement('div');
                        menuElement.id = attrs.target;
                        menuElement.setAttribute('data-rightMenu', 'wrap');
                        angular.element(document.body).append(menuElement);
                        menuElement = angular.element(document.getElementById(attrs.target));
                    }

                    //显示右键菜单
                    element.bind('contextmenu', showMenu);

                    //窗口绑定点击事件 隐藏右键菜单
                    angular.element($window).bind('click contextmenu',windowClick);

                    //destroy 取消事件绑定
                    scope.$on('$destroy',function(){
                        menuElement.find('li[data-value]').unbind('click',menuClick);
                        angular.element($window).unbind('click contextmenu',windowClick);
                        element.unbind('contextmenu', showMenu);
                    });

                    function showMenu (){
                        scope.$apply(function() {
                            //如果有选中的文本，弹出默认右键菜单，复制文本
                            if(!checkIsSelected()){
                                event.preventDefault();
                                event.stopPropagation();
                                scope.getCurrentItemFn(scope.item);
                                open(menuElement);
                            }
                        });
                    }

                    //判断是否有文本被选中
                    function checkIsSelected(){
                        if (window.getSelection) {
                            return window.getSelection().toString();
                        } else if (document.getSelection) {
                            return document.getSelection();
                        } else if (document.selection) {
                            return document.selection.createRange().text;
                        }else{
                            return "";
                        }
                    }

                    function menuClick(e){

                        var ele = null,
                            fns = null,
                            value = null ;

                        if(e.target.dataset.value){
                            ele = e.target;
                        }else{
                            ele = angular.element(e.target).parents('li[data-value]')[0];
                        }

                        fns = getFns(scope.menuContent);

                        value = ele.dataset.value;

                        fns[value] && fns[value](scope.item) &&  scope.$apply(function(){
                            close();
                        });

                    }

                    function open(el) {
                        scope.opened = true;
                        el.html(initHtml(scope.menuContent)).show();
                        el.css({
                            position: 'fixed',
                            top: event.clientY + 'px',
                            left: event.clientX + 'px'

                        });
                        menuElement.bind('contextmenu click', function(event) {
                            scope.$apply(function() {
                                event.preventDefault();
                                event.stopPropagation();
                            });
                        })
                            .find('li[data-value]').bind('click contextmenu',menuClick)
                    };

                    function close() {
                        scope.opened = false;
                        scope.getCurrentItemFn(null);
                        menuElement.hide().html('');
                    };

                    scope.opened = false;

                    //每个项点击的事件
                    function getFns (data){
                        var fns = {};

                        angular.forEach(data, function(item){
                            //如果设置了disabled  为true ，即不可用，则不设置
                            if( ! fns[item.name] && !item.disabled){
                                fns[item.name] = item.fn
                            }
                        });
                        return fns;
                    }

                    //模拟数据填充菜单   数据可通以点击元素过属性传递过来
                    //菜单的html 结构
                    function initHtml(data){
                        var html = '',
                            diyClass = '';
                        if(data){
                            html += '<ul class="mydirective-menu-wrap" id="$rightMenuDiy">';
                            for(var i = 0; i < data.length; i++){
                                if(data[i].disabled){
                                    diyClass = 'menuList-disabled';
                                }else{
                                    diyClass = '';
                                }

                                html += '<li style="height:30px;" class = " '+ diyClass +' " data-value = "'+ data[i].name +'">'+ data[i].name +'</li>';
                            }
                            html += '</ul>';
                        }

                        return html ;
                    }

                    function windowClick(event){

                       // var state =  angular.element(event.target).parent().eq(0).attr('id') === '$rightMenuDiy';

                        if ( scope.opened) {
                            scope.$apply(function() {
                                event.stopPropagation();
                                close();
                            });
                        }
                    }

                }
            };
        }]);

})();
