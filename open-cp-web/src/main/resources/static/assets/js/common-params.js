//系统设置对象
var project={

    /***************************
    端口3000是前端开发时为了区分不同环境而方便本地开发特别设置的一个端口
    请后台人员启动前端服务不要使用3000这个端口，以免冲突
    ***************************/

    /*********************************后台人员使用start***************************************/

    //部署外网时所需配置的参数字段
    //以下是默认的ip，端口和项目名。ip只有唯一一个，如果不同项目的端口或者项目名和默认的不同，去下面的common_router对象里修改；
    //default_ip:'http://113.106.85.5',
    //default_ip:'http://192.168.98.5',
	//线上配置
	default_ip:'http://117.71.57.247',
	default_port:'3580',
	//本地配置
//    default_ip:'http://127.0.0.1',
//    default_port:'8890',
    default_projectName:'/open-cp',
    /*********************************后台人员使用end***************************************/




    /*********************************前端人员使用start***************************************/
    /*前端本地开发所需的环境配置，web_ip指局域网内的IP地址，可自己用也可别人用（解决跨域问题后）*/
    //邓瑶
    // web_ip:'http://192.168.98.29',
    //朱咪
    // web_ip:'http://192.168.98.45',
    // 外网
    //web_ip:'http://113.106.85.5',
    //web_ip:'http://114.55.255.160',
    //
    // web_ip:'http://127.0.0.1',
    web_ip:'http://117.71.57.247',
    // web_ip:'http://192.168.16.61',
    //本地端口,指开发人员启动tomcat后浏览器的端口，
    web_port:'3000',
    //接口地址的端口
   // web_api_port:'8891',
    // web_api_port:'8890',
    web_api_port:'3580',
    // web_api_port:'8180',

    //蔡老板
    // web_ip:'http://192.168.98.16:8082',
    /*********************************前端人员使用end***************************************/



    getHash:function(){
        return window.location.hash.split('?')[0].split('#/')[1];
    },

    //该方法返回不同环境下的指定的ip地址，端口，项目名
    host:function(){
        var hash=project.getHash(),str='';
        /*
        端口3000是前端的开发环境特有的端口，用于区别前端的开发环境和正式环境的接口不同的相对路径
        */

        //如果路由无效，一般情况下是登录页
        if(!hash){
            return window.location.port == project.web_port
            ? project.web_ip+':'+project.web_api_port+project.default_projectName
            :(project.default_ip+':'+project.default_port+project.default_projectName);
        }

        //如果路由有效
        for(var key in common_router){
            var obj=common_router[key];
            obj.forEach(function(n,i){
                //拿到对应路由的配置项
                /*
                ip的配置项的维度和菜单不同，可在default_ip直接改；
                如果菜单配置项的port字段有效(默认是null),则取port字段，否则取default_port字段
                如果菜单配置项的projectName字段有效(默认是null),则取projectName字段，否则取default_projectName字段
                */
                if(n.hash == hash){
                    str = window.location.port == project.web_port
                    ?(n.projectName ? project.web_ip+':'+project.web_api_port+n.projectName : project.web_ip+':'+project.web_api_port+project.default_projectName )
                    :(project.default_ip+':'+(n.port?n.port:project.default_port)+(n.projectName?n.projectName:project.default_projectName));
                }

            });
        }


        return str;

    },
    trigger:null,
    layerEle:null,
    //封装公共参数
    bodys:function(data){
        var data=data;
        //如果获取sign的方法
        data.getH5Sign=function(val){
            //删除自身的这个方法，否则会传到后台
            delete this.getH5Sign;
            // alert('传入后台的数据：'+JSON.stringify(this));
            if(!val){
                return this;
            }else{
                return JSON.stringify(this);
            }

        }
        return data;
    },

    i:0
}

//公共参数对象
var common_params={

    rbac:{
        //公共状态，包括参数设置的状态，字典类型的状态，角色的状态
        status:[
            {
                value:'0',
                name:{
                    zh_cn:'正常',en_us:'Normal',zh_cht:'正常',
                },
                name1:{
                    zh_cn:'<span class="badge badge-success">正常</span>',
                    en_us:'<span class="badge badge-success">Normal</span>',
                    zh_cht:'<span class="badge badge-success">正常</span>',
                },
            },
            {
                value:'1',
                name:{
                    zh_cn:'禁用',en_us:'Disabled',zh_cht:'禁用',
                },
                name1:{
                    zh_cn:'<span class="badge badge-danger">禁用</span>',
                    en_us:'<span class="badge badge-danger">Disabled</span>',
                    zh_cht:'<span class="badge badge-danger">禁用</span>',
                },
            },
        ],
        cpStatus:[
            {
                value:'01',
                name:{
                    zh_cn:'审核中',en_us:'in review',zh_cht:'审核中',
                },
                name1:{
                    zh_cn:'<span class="badge badge-success">审核中</span>',
                    en_us:'<span class="badge badge-success">in review</span>',
                    zh_cht:'<span class="badge badge-success">审核中</span>',
                },
            },
            {
                value:'04',
                name:{
                    zh_cn:'已发布',en_us:'release',zh_cht:'發佈中',
                },
                name1:{
                    zh_cn:'<span class="badge badge-success">已发布</span>',
                    en_us:'<span class="badge badge-success">release</span>',
                    zh_cht:'<span class="badge badge-success">發佈中</span>',
                },
            },
            {
                value:'02',
                name:{
                    zh_cn:'撮合成功',en_us:'matched',zh_cht:'撮合成功',
                },
                name1:{
                    zh_cn:'<span class="badge badge-danger">撮合成功</span>',
                    en_us:'<span class="badge badge-danger">matched</span>',
                    zh_cht:'<span class="badge badge-danger">撮合成功</span>',
                },
            },
            {
                value:'03',
                name:{
                    zh_cn:'已注销',en_us:'cancel',zh_cht:'已註銷',
                },
                name1:{
                    zh_cn:'<span class="badge badge-danger">已注销</span>',
                    en_us:'<span class="badge badge-danger">cancel</span>',
                    zh_cht:'<span class="badge badge-danger">已註銷</span>',
                },
            },
            {
                value:'05',
                name:{
                    zh_cn:'审核失败',en_us:'Audit failure',zh_cht:'審核失敗',
                },
                name1:{
                    zh_cn:'<span class="badge badge-danger">审核失败</span>',
                    en_us:'<span class="badge badge-danger">Audit failure</span>',
                    zh_cht:'<span class="badge badge-danger">審核失敗</span>',
                },
            },
            {
            	value:'06',
            	name:{
            		zh_cn:'票据成交验收完成',en_us:'traded',zh_cht:'票据成交验收完成',
            	},
            	name1:{
            		zh_cn:'<span class="badge badge-danger">票据成交验收完成</span>',
            		en_us:'<span class="badge badge-danger">traded</span>',
            		zh_cht:'<span class="badge badge-danger">票据成交验收完成</span>',
            	},
            },
            {
                value:'07',
                name:{
                    zh_cn:'票据未能成交，买方违约',en_us:'Buyer default',zh_cht:'票据未能成交，买方违约',
                },
                name1:{
                    zh_cn:'<span class="badge badge-danger">票据未能成交，买方违约</span>',
                    en_us:'<span class="badge badge-danger">Buyer default</span>',
                    zh_cht:'<span class="badge badge-danger">票据未能成交，买方违约</span>',
                },
            },
            {
                value:'08',
                name:{
                    zh_cn:'票据未能成交，卖方违约',en_us:'Seller default',zh_cht:'票据未能成交，卖方违约',
                },
                name1:{
                    zh_cn:'<span class="badge badge-danger">票据未能成交，卖方违约</span>',
                    en_us:'<span class="badge badge-danger">Seller default</span>',
                    zh_cht:'<span class="badge badge-danger">票据未能成交，卖方违约</span>',
                },
            }
        ],
        quoteStatus:[
            {
                value:'01',
                name:{
                    zh_cn:'报价中',en_us:'quote',zh_cht:'報價中',
                },
                name1:{
                    zh_cn:'<span class="badge badge-success">报价中</span>',
                    en_us:'<span class="badge badge-success">quote</span>',
                    zh_cht:'<span class="badge badge-success">報價中</span>',
                },
            },
            {
                value:'02',
                name:{
                    zh_cn:'撮合成交',en_us:'Brokered transactions',zh_cht:'撮合成交',
                },
                name1:{
                    zh_cn:'<span class="badge badge-success">撮合成交</span>',
                    en_us:'<span class="badge badge-success">Brokered transactions</span>',
                    zh_cht:'<span class="badge badge-success">撮合成交</span>',
                },
            },
            {
                value:'03',
                name:{
                    zh_cn:'撮合失败',en_us:'Matching failure',zh_cht:'撮合失敗',
                },
                name1:{
                    zh_cn:'<span class="badge badge-danger">撮合失败</span>',
                    en_us:'<span class="badge badge-danger">Matching failure</span>',
                    zh_cht:'<span class="badge badge-danger">撮合失敗</span>',
                },
            },
            {
                value:'04',
                name:{
                    zh_cn:'取消报价',en_us:'cancel',zh_cht:'取消报价',
                },
                name1:{
                    zh_cn:'<span class="badge badge-danger">取消报价</span>',
                    en_us:'<span class="badge badge-danger">cancel</span>',
                    zh_cht:'<span class="badge badge-danger">取消报价</span>',
                },
            },
            {
                value:'05',
                name:{
                    zh_cn:'报价被拒',en_us:'refuse',zh_cht:'报价被拒',
                },
                name1:{
                    zh_cn:'<span class="badge badge-danger">报价被拒</span>',
                    en_us:'<span class="badge badge-danger">refuse</span>',
                    zh_cht:'<span class="badge badge-danger">报价被拒</span>',
                },
            }
        ],

        //客户类型

        //用户类型
        custType:[
            {
                value:'0',
                name:{
                    zh_cn:'个人',en_us:'Personal',zh_cht:'个人',
                }
            },
            {
                value:'1',
                name:{
                    zh_cn:'公司',en_us:'Company',zh_cht:'公司',
                }
            },
        ],

        //用户状态
        userStatus:[
            {
                value:'0',
                name:{
                    zh_cn:'正常',en_us:'Normal',zh_cht:'正常',
                },
                name1:{
                    zh_cn:'<span class="badge badge-success">正常</span>',
                    en_us:'<span class="badge badge-success">Normal</span>',
                    zh_cht:'<span class="badge badge-success">正常</span>',
                },
            },
            {
                value:'1',
                name:{
                    zh_cn:'禁用',en_us:'Disabled',zh_cht:'禁用',
                },
                name1:{
                    zh_cn:'<span class="badge badge-danger">禁用</span>',
                    en_us:'<span class="badge badge-danger">Disabled</span>',
                    zh_cht:'<span class="badge badge-danger">禁用</span>',
                },
            },
            {
                value:'2',
                name:{
                    zh_cn:'锁定',en_us:'Locked',zh_cht:'鎖定',
                },
                name1:{
                    zh_cn:'<span class="badge badge-warning">锁定</span>',
                    en_us:'<span class="badge badge-warning">Locked</span>',
                    zh_cht:'<span class="badge badge-warning">鎖定</span>',
                },
            }
        ],
        bussinessType:[
                    {
                        value:'02',
                        name:{
                            zh_cn:'供应商',en_us:'Supplier',zh_cht:'供應商',
                        },
                        name1:{
                            zh_cn:'<span class="badge badge-danger">供应商</span>',
                            en_us:'<span class="badge badge-danger">Supplier</span>',
                            zh_cht:'<span class="badge badge-danger">供應商</span>',
                        },
                    },
                    {
                        value:'03',
                        name:{
                            zh_cn:'经销商',en_us:'Dealer',zh_cht:'經銷商',
                        },
                        name1:{
                            zh_cn:'<span class="badge badge-warning">经销商</span>',
                            en_us:'<span class="badge badge-warning">Dealer</span>',
                            zh_cht:'<span class="badge badge-warning">經銷商</span>',
                        },
                    }
                ],
                accountType:[
                             {
                                 value:'1',
                                 name:{
                                     zh_cn:'提现账户',en_us:'Withdraw Account',zh_cht:'提現賬戶',
                                 },
                                 name1:{
                                     zh_cn:'<span class="badge badge-danger">提现账户</span>',
                                     en_us:'<span class="badge badge-danger">WithdrawAccount</span>',
                                     zh_cht:'<span class="badge badge-danger">提現賬戶</span>',
                                 },
                             },
                             {
                                 value:'2',
                                 name:{
                                     zh_cn:'签收账户',en_us:'Sign Account',zh_cht:'簽收賬戶',
                                 },
                                 name1:{
                                     zh_cn:'<span class="badge badge-warning">签收账户</span>',
                                     en_us:'<span class="badge badge-warning">SignAccount</span>',
                                     zh_cht:'<span class="badge badge-warning">簽收賬戶</span>',
                                 },
                             }
                         ],

        //用户性别
        sex:[
            {
                value:'0',
                name:{
                    zh_cn:'女',en_us:'Female',zh_cht:'女',
                }
            },
            {
                value:'1',
                name:{
                    zh_cn:'男',en_us:'Male',zh_cht:'男',
                }
            },
            {
                value:'2',
                name:{
                    zh_cn:'未知',en_us:'Unknown',zh_cht:'未知',
                }
            },
        ],

        //用户类型
        userType :[
            {
                value:'00',
                name:{
                    zh_cn:'超级管理员',en_us:'Super Admin',zh_cht:'超級管理員',
                }
            },
            {
                value:'01',
                name:{
                    zh_cn:'普通用户',en_us:'Ordinary User',zh_cht:'普通用戶',
                }
            },
        ],

        //匹配模式
        matchingType:[
            {
                value:'0',
                name:{
                    zh_cn:'精确匹配',en_us:'Exact',zh_cht:'精確匹配',
                }
            },
            {
                value:'1',
                name:{
                    zh_cn:'模糊匹配',en_us:'Vague',zh_cht:'模糊匹配',
                }
            },
        ],

        //匹配程度
        matching:[
            {
                value:'0',
                name:{
                    zh_cn:'精确匹配',en_us:'Accurate matching',zh_cht:'精確匹配',
                }
            },
            {
                value:'1',
                name:{
                    zh_cn:'模糊匹配',en_us:'Fuzzy matching',zh_cht:'模糊匹配',
                }
            },
        ],
        //规则状态
        isDeleted:[
            {
                value:'0',
                name:{
                    zh_cn:'<span class="badge badge-danger">已删除</span>',
                    en_us:'<span class="badge badge-danger">isDeleted</span>',
                    zh_cht:'<span class="badge badge-danger">已删除</span>',
                }
            },
            {
                value:'1',
                name:{
                    zh_cn:'<span class="badge badge-success">未删除</span>',
                    en_us:'<span class="badge badge-success">notDeleted</span>',
                    zh_cht:'<span class="badge badge-success">未删除</span>',
                }
            },
        ],


        //菜单类型
        menu:[
            {
                value:'M',
                name:{
                    zh_cn:'目录',en_us:'Directory',zh_cht:'目錄',
                },
                name1:{
                    zh_cn:'<span class="label label-success">目录</span>',
                    en_us:'<span class="label label-success">Directory</span>',
                    zh_cht:'<span class="label label-success">目錄</span>',
                },
            },
            {
                value:'C',
                name:{
                    zh_cn:'菜单',en_us:'Menu',zh_cht:'菜單',
                },
                name1:{
                    zh_cn:'<span class="label label-primary">菜单</span>',
                    en_us:'<span class="label label-primary">Menu</span>',
                    zh_cht:'<span class="label label-primary">菜單</span>',
                },
            },
            {
                value:'F',
                name:{
                    zh_cn:'按钮',en_us:'Button',zh_cht:'按鈕',
                },
                name1:{
                    zh_cn:'<span class="label label-warning">按钮</span>',
                    en_us:'<span class="label label-warning">Button</span>',
                    zh_cht:'<span class="label label-warning">按鈕</span>',
                },
            },
        ],

        //菜单状态
        menuStatus:[
            {
                value:'0',
                name:{
                    zh_cn:'显示',en_us:'Show',zh_cht:'顯示',
                },
                name1:{
                    zh_cn:'<span class="badge badge-primary">显示</span>',
                    en_us:'<span class="badge badge-primary">Show</span>',
                    zh_cht:'<span class="badge badge-primary">顯示</span>',
                },
            },
            {
                value:'1',
                name:{
                    zh_cn:'隐藏',en_us:'Hide',zh_cht:'隱藏',
                },
                name:{
                    zh_cn:'<span class="badge badge-danger">隐藏</span>',
                    en_us:'<span class="badge badge-danger">Hide</span>',
                    zh_cht:'<span class="badge badge-danger">隱藏</span>',
                }
            },
        ],

        //操作日志的来源渠道
        channel:[
            {
                value:'manage',
                name:{
                    zh_cn:'后台用户',en_us:'Back-end user',zh_cht:'後臺用戶',
                },
            },
            {
                value:'mobile',
                name:{
                    zh_cn:'手机端用户',en_us:'Mobile Users',zh_cht:'手機端用戶',
                },
            },
            {
                value:'other',
                name:{
                    zh_cn:'其它',en_us:'Other Users',zh_cht:'其它',
                },
            },
        ],

        //操作日志的操作状态
        operStatus:[
            {
                value:'0',
                name:{
                    zh_cn:'正常',en_us:'Normal',zh_cht:'正常',
                },
                name1:{
                    zh_cn:'<span class="badge badge-success">正常</span>',
                    en_us:'<span class="badge badge-success">Normal</span>',
                    zh_cht:'<span class="badge badge-success">正常</span>',
                },
            },
            {
                value:'1',
                name:{
                    zh_cn:'失败',en_us:'Fail',zh_cht:'失敗',
                },
                name1:{
                    zh_cn:'<span class="badge badge-danger">失败</span>',
                    en_us:'<span class="badge badge-danger">Fail</span>',
                    zh_cht:'<span class="badge badge-danger">失敗</span>',
                },
            },
            {
                value:'2',
                name:{
                    zh_cn:'异常',en_us:'Abnormal',zh_cht:'異常',
                },
                name1:{
                    zh_cn:'<span class="badge badge-danger">异常</span>',
                    en_us:'<span class="badge badge-danger">Abnormal</span>',
                    zh_cht:'<span class="badge badge-danger">異常</span>',
                },
            },
        ],

        //操作日志的操作类型
        action:[
            {
                value:'0',
                name:{
                    zh_cn:'其他',en_us:'Other',zh_cht:'其他',
                },
            },
            {
                value:'1',
                name:{
                    zh_cn:'新增',en_us:'Add',zh_cht:'新增',
                },
            },
            {
                value:'2',
                name:{
                    zh_cn:'修改',en_us:'Edit',zh_cht:'修改',
                },
            },
            {
                value:'3',
                name:{
                    zh_cn:'删除',en_us:'Delete',zh_cht:'刪除',
                },
            },
            {
                value:'4',
                name:{
                    zh_cn:'导出',en_us:'Export',zh_cht:'導出',
                },
            },
        ],
        //登录日志的登录状态
        loginStatus:[
            {
                value:'0',
                name:{
                    zh_cn:'正常',en_us:'Normal',zh_cht:'正常',
                },
            },
            {
                value:'1',
                name:{
                    zh_cn:'失败',en_us:'Fail',zh_cht:'失敗',
                },
            },
        ],
        //判断有无
        isHas:[
            {
                value:'0',
                name:{
                    zh_cn:'有',en_us:'Have',zh_cht:'有',
                },
            },
            {
                value:'1',
                name:{
                    zh_cn:'无',en_us:'Not Have',zh_cht:'无',
                },
            },
        ],

        //机构的状态
        orgStatus:[
            {
                value:'0',
                name:{
                    zh_cn:'正常',en_us:'Normal',zh_cht:'正常',
                },
                name1:{
                    zh_cn:'<span class="badge badge-success">正常</span>',
                    en_us:'<span class="badge badge-success">Normal</span>',
                    zh_cht:'<span class="badge badge-success">正常</span>',
                },
            },
            {
                value:'1',
                name:{
                    zh_cn:'停用',en_us:'Disabled',zh_cht:'停用',
                },
                name1:{
                    zh_cn:'<span class="badge badge-danger">停用</span>',
                    en_us:'<span class="badge badge-danger">Disabled</span>',
                    zh_cht:'<span class="badge badge-danger">停用</span>',
                },
            },
        ],

        //在线用户的在线离线状态
        onlineStatus:[
            {
                value:'on_line',
                name:{
                    zh_cn:'在线',en_us:'onLine',zh_cht:'在線',
                },
                name1:{
                    zh_cn:'<span class="badge badge-success">在线</span>',
                    en_us:'<span class="badge badge-success">onLine</span>',
                    zh_cht:'<span class="badge badge-success">在線</span>',
                },
            },

            {
                value:'off_line',
                name:{
                    zh_cn:'离线',en_us:'offLine',zh_cht:'離線',
                },
                name1:{
                    zh_cn:'<span class="badge badge-danger">离线</span>',
                    en_us:'<span class="badge badge-danger">offLine</span>',
                    zh_cht:'<span class="badge badge-danger">離線</span>',
                },
            },
        ],

        //定时任务状态
        jobStatus:[
            {
                value:'0',
                name:{
                    zh_cn:'正常',en_us:'Normal',zh_cht:'正常',
                },
                name1:{
                    zh_cn:'<span class="badge badge-success">正常</span>',
                    en_us:'<span class="badge badge-success">Normal</span>',
                    zh_cht:'<span class="badge badge-success">正常</span>',
                },
            },
            {
                value:'1',
                name:{
                    zh_cn:'暂停',en_us:'Pause',zh_cht:'暫停',
                },
                name1:{
                    zh_cn:'<span class="badge badge-danger">暂停</span>',
                    en_us:'<span class="badge badge-danger">Pause</span>',
                    zh_cht:'<span class="badge badge-danger">暫停</span>',
                },
            },
        ],

        //定时任务的任务执行状态
        jobTriggerState:[
            {
                value:'WAITING',
                name:{
                    zh_cn:'等待',en_us:'WAITING',zh_cht:'等待',
                },
            },
            {
                value:'PAUSED',
                name:{
                    zh_cn:'暂停',en_us:'PAUSED',zh_cht:'暫停',
                },
            },
            {
                value:'ACQUIRED',
                name:{
                    zh_cn:'正常执行',en_us:'ACQUIRED',zh_cht:'正常執行',
                },
            },
            {
                value:'BLOCKED',
                name:{
                    zh_cn:'阻塞',en_us:'BLOCKED',zh_cht:'阻塞',
                },
            },
            {
                value:'ERROR',
                name:{
                    zh_cn:'错误',en_us:'ERROR',zh_cht:'錯誤',
                },
            },
        ],

        //定时任务日志状态
        jobLogsStatus:[
            {
                value:'0',
                name:{
                    zh_cn:'正常',en_us:'Normal',zh_cht:'正常',
                },
                name1:{
                    zh_cn:'<span class="badge badge-success">正常</span>',
                    en_us:'<span class="badge badge-success">Normal</span>',
                    zh_cht:'<span class="badge badge-success">正常</span>',
                },
            },
            {
                value:'1',
                name:{
                    zh_cn:'失败',en_us:'Fail',zh_cht:'失败',
                },
                name1:{
                    zh_cn:'<span class="badge badge-danger">失败</span>',
                    en_us:'<span class="badge badge-danger">Fail</span>',
                    zh_cht:'<span class="badge badge-danger">失败</span>',
                },
            },
        ],

        //定时任务计划执行错误策略
        jobMisfirePolicy:[
            {
                value:'0',
                name:{
                    zh_cn:'默认',en_us:'Default',zh_cht:'默認',
                },
            },
            {
                value:'1',
                name:{
                    zh_cn:'继续',en_us:'Continue',zh_cht:'繼續',
                },
            },
            {
                value:'2',
                name:{
                    zh_cn:'等待',en_us:'Wait',zh_cht:'等待',
                },
            },
            {
                value:'3',
                name:{
                    zh_cn:'放弃',en_us:'giveUp',zh_cht:'放棄',
                },
            },
        ],

        //字典详情是否默认状态
        isDefault:[
            {
                value:'Y',
                name:{
                    zh_cn:'是',en_us:'Yes',zh_cht:'是',
                },
                name1:{
                    zh_cn:'<span class="badge badge-success">是</span>',
                    en_us:'<span class="badge badge-success">Yes</span>',
                    zh_cht:'<span class="badge badge-success">是</span>',
                },
            },
            {
                value:'N',
                name:{
                    zh_cn:'否',en_us:'No',zh_cht:'否',
                },
                name1:{
                    zh_cn:'<span class="badge badge-danger">否</span>',
                    en_us:'<span class="badge badge-danger">No</span>',
                    zh_cht:'<span class="badge badge-danger">否</span>',
                },
            },
        ],
        //参数设置的系统内置状态
        configType:[
            {
                value:'Y',
                name:{
                    zh_cn:'是',en_us:'Yes',zh_cht:'是',
                },
                name1:{
                    zh_cn:'<span class="badge badge-success">是</span>',
                    en_us:'<span class="badge badge-success">Yes</span>',
                    zh_cht:'<span class="badge badge-success">是</span>',
                },
            },
            {
                value:'N',
                name:{
                    zh_cn:'否',en_us:'No',zh_cht:'否',
                },
                name1:{
                    zh_cn:'<span class="badge badge-danger">否</span>',
                    en_us:'<span class="badge badge-danger">No</span>',
                    zh_cht:'<span class="badge badge-danger">否</span>',
                },
            },
        ],

        //菜单权限标识
        menuPerms:[
            // {value:'view',name:'查询'},
            {
                value:'add',
                name:{
                    zh_cn:'新增',en_us:'Add',zh_cht:'新增',
                },
            },
            {
                value:'remove',
                name:{
                    zh_cn:'删除',en_us:'Delete',zh_cht:'删除',
                },

            },
            {
                value:'edit',
                name:{
                    zh_cn:'修改',en_us:'Edit',zh_cht:'修改',
                },
            },
            {
                value:'export',
                name:{
                    zh_cn:'导出',en_us:'Export',zh_cht:'導出',
                },
            },
            {
                value:'investigation',
                name:{
                    zh_cn:'调查',en_us:'Investigation',zh_cht:'調查',
                },
            },
            {
                value:'list',
                name:{
                    zh_cn:'详情',en_us:'Details',zh_cht:'詳情',
                },
            },
            {
                value:'resetPwd',
                name:{
                    zh_cn:'重置密码',en_us:'Reset Password',zh_cht:'重置密碼',
                },
            },
            {
                value:'changeStatus',
                name:{
                    zh_cn:'状态修改',en_us:'ChangeStatus',zh_cht:'狀態修改',
                },
            },
            {
                value:'forceLogout',
                name:{
                    zh_cn:'在线用户强退',en_us:'ForceLogout',zh_cht:'在線用戶強退',
                },
            },
            {
                value:'batchForceLogout',
                name:{
                    zh_cn:'在线用户批量强退',en_us:'BatchForceLogout',zh_cht:'在線用戶批量強退',
                },
            },
        ],

        //定义分页参数
        pagination:[
           {value:'1',name:'1'},
           {value:'10',name:'10'},
           {value:'25',name:'25'},
           {value:'50',name:'50'},
           {value:'75',name:'75'},
           {value:'100',name:'100'},
           {value:'200',name:'200'},
        ],
        
      //商户类型 01-核心企业；02-供应商；03-经销商'
        businessType:[
            {
                value:'02',
                name:{
                    zh_cn:'供应商',en_us:'supplier',zh_cht:'供應商',
                },
                name1:{
                    zh_cn:'<span class="badge badge-success">供应商</span>',
                    en_us:'<span class="badge badge-success">supplier</span>',
                    zh_cht:'<span class="badge badge-success">供應商</span>',
                },
            },
            {
                value:'03',
                name:{
                    zh_cn:'经销商',en_us:'distributor',zh_cht:'經銷商',
                },
                name1:{
                    zh_cn:'<span class="badge badge-success">经销商</span>',
                    en_us:'<span class="badge badge-success">distributor</span>',
                    zh_cht:'<span class="badge badge-success">經銷商</span>',
                },
            },
        ],
        status2:[
                 {
                     value:'0',
                     name:{
                         zh_cn:'非默认',en_us:'no default',zh_cht:'非默认',
                     },
                     name1:{
                         zh_cn:'<span class="badge badge-success">非默认</span>',
                         en_us:'<span class="badge badge-success">noDefault</span>',
                         zh_cht:'<span class="badge badge-success">非默认</span>',
                     },
                 },
                 {
                     value:'1',
                     name:{
                         zh_cn:'默认',en_us:'default',zh_cht:'默认',
                     },
                     name1:{
                         zh_cn:'<span class="badge badge-success">默认</span>',
                         en_us:'<span class="badge badge-success">default</span>',
                         zh_cht:'<span class="badge badge-success">默认</span>',
                     },
                 },
             ],
        creditRatingType:[
                      {
                    	  value:'1',
                    	  name:{
                    		  zh_cn:'优秀',en_us:'excellent',zh_cht:'優秀',
                    	  },
                    	  name1:{
                    		  zh_cn:'<span class="badge badge-success">优秀</span>',
                    		  en_us:'<span class="badge badge-success">excellent</span>',
                    		  zh_cht:'<span class="badge badge-success">優秀</span>',
                    	  },
                      },
                      {
                    	  value:'2',
                    	  name:{
                    		  zh_cn:'良好',en_us:'well',zh_cht:'良好',
                    	  },
                    	  name1:{
                    		  zh_cn:'<span class="badge badge-well">良好</span>',
                    		  en_us:'<span class="badge badge-well">well</span>',
                    		  zh_cht:'<span class="badge badge-well">良好</span>',
                    	  },
                      },
                      {
                    	  value:'3',
                    	  name:{
                    		  zh_cn:'一般',en_us:'ordinary',zh_cht:'壹般',
                    	  },
                    	  name1:{
                    		  zh_cn:'<span class="badge badge-general">一般</span>',
                    		  en_us:'<span class="badge badge-general">ordinary</span>',
                    		  zh_cht:'<span class="badge badge-general">壹般</span>',
                    	  },
                      },
                      ],
                      defectType:[
                                        {
                                      	  value:'0',
                                      	  name:{
                                      		  zh_cn:'无瑕疵',en_us:'flawless',zh_cht:'無瑕疵',
                                      	  },
                                      	  name1:{
                                      		  zh_cn:'<span class="badge badge-success">无瑕疵</span>',
                                      		  en_us:'<span class="badge badge-success">flawless</span>',
                                      		  zh_cht:'<span class="badge badge-success">無瑕疵</span>',
                                      	  },
                                        },
                                        {
                                      	  value:'1',
                                      	  name:{
                                      		  zh_cn:'有瑕疵',en_us:'defective',zh_cht:'有瑕疵',
                                      	  },
                                      	  name1:{
                                      		  zh_cn:'<span class="badge badge-warning">有瑕疵</span>',
                                      		  en_us:'<span class="badge badge-warning">defective</span>',
                                      		  zh_cht:'<span class="badge badge-warning">有瑕疵</span>',
                                      	  },
                                        },
                                        ],
       //邀请码状态：0-失效；1-生效
        codeStatus:[
            {
                value:'0',
                name:{
                    zh_cn:'失效',en_us:'invalid',zh_cht:'失效',
                },
                name1:{
                    zh_cn:'<span class="badge badge-danger">失效</span>',
                    en_us:'<span class="badge badge-danger">invalid</span>',
                    zh_cht:'<span class="badge badge-danger">失效</span>',
                },
            },
            {
                value:'1',
                name:{
                    zh_cn:'生效',en_us:'effective',zh_cht:'生效',
                },
                name1:{
                    zh_cn:'<span class="badge badge-success">生效</span>',
                    en_us:'<span class="badge badge-success">effective</span>',
                    zh_cht:'<span class="badge badge-success">生效</span>',
                },
            },
        ],

        // //公共错误提示颜色
        color:{
            gray:'#353544',
            error:'#df4141',
        }
    },

}



//公共路由对象
var common_router={
    rbac:[
        {
            name: '首页',
            port: null,
            hash: 'index',
            path: 'rbac/tpl/index1.html',
            projectName: null,
            crumbs:{
                zh_cn:'首页',
                en_us:'Home',
                zh_cht:'首頁',
            },
            lang:{
            	releaseTime:{
                    zh_cn:'发布时间',en_us:'Release Time',zh_cht:'發布時間',
                },
                acceptor:{
                    zh_cn:'承兑人',
                    en_us:'Acceptor',
                    zh_cht:'承兌人',
                },
                blemish:{
                    zh_cn:'瑕疵',en_us:'Blemish',zh_cht:'瑕疵',
                },
                cpAmount:{
                    zh_cn:'票面金额',en_us:'cpAmount',zh_cht:'票面金額',
                },
                dueDate:{
                    zh_cn:'到期日',en_us:'Due date',zh_cht:'到期日',
                },
                credit:{
                    zh_cn:'成交信用',en_us:'credit',zh_cht:'成交信用',
                },
                endorseTimes:{
                	zh_cn:'背书次数',en_us:'endorseTimes',zh_cht:'背書次數',
                },
                cpStatus:{
                	zh_cn:'票据状态',en_us:'Ticket status',zh_cht:'票據狀態',
                },
                
            }
        },
        {
            name: '用户管理',
            port: null,
            hash: 'users',
            path: 'rbac/user.html',
            projectName: null,
            crumbs:{
                zh_cn:'首页/系统管理/用户管理',
                en_us:'Home/system management/user management',
                zh_cht:'首頁/系統管理/用戶管理',
            },
            lang:{
                loginName:{
                    zh_cn:'登录名称',en_us:'Login Name',zh_cht:'登录名稱',
                },
                userName:{
                    zh_cn:'用户名称',en_us:'User Name',zh_cht:'用戶名稱',
                },
                orgId:{
                    zh_cn:'所属机构',en_us:'ORG',zh_cht:'所屬機構',
                },
                status:{
                    zh_cn:'用户状态',en_us:'User Status',zh_cht:'用戶狀態',
                },
                role:{
                    zh_cn:'角色',en_us:'Role',zh_cht:'角色',
                },
                phonenumber:{
                    zh_cn:'手机号码',en_us:'Phone Number',zh_cht:'手機號碼',
                },
                password:{
                    zh_cn:'密码',en_us:'Password',zh_cht:'密碼',
                },
                email:{
                    zh_cn:'邮箱',en_us:'Email',zh_cht:'郵箱',
                },
                sex1:{
                    zh_cn:'性别',en_us:'Sex',zh_cht:'性別',
                },
                userType:{
                    zh_cn:'用户类型',en_us:'User Type',zh_cht:'用戶類型',
                },
                userId:{
                    zh_cn:'用户ID',en_us:'UserId',zh_cht:'用戶ID',
                },
            }
        },
        {
            name: '角色管理',
            port: null,
            hash: 'roles',
            path: 'rbac/role.html',
            crumbs: '首页/系统管理/角色管理',
            projectName: null,
            crumbs:{
                zh_cn:'首页/系统管理/角色管理',
                en_us:'Home/system management/role management',
                zh_cht:'首頁/系統管理/角色管理',
            },
            lang:{
                roleName:{
                    zh_cn:'角色名称',en_us:'Role Name',zh_cht:'角色名稱',
                },
                orgName:{
                    zh_cn:'机构名称',en_us:'ORG Name',zh_cht:'機構名稱',
                },
                roleId:{
                    zh_cn:'角色Id',en_us:'Role Id',zh_cht:'角色Id',
                },
                status:{
                    zh_cn:'角色状态',en_us:'Role Status',zh_cht:'角色狀態',
                },
                remark:{
                    zh_cn:'备注',en_us:'Remark',zh_cht:'備註',
                },
                menuIds:{
                    zh_cn:'所属菜单',en_us:'Menu Right',zh_cht:'所屬菜單',
                },
            }
        },
        {
            name: '菜单管理',
            port: null,
            hash: 'menus',
            path: 'rbac/menu.html',
            projectName: null,
            crumbs:{
                zh_cn:'首页/系统管理/菜单管理',
                en_us:'Home/system management/menu management',
                zh_cht:'首頁/系統管理/菜单管理',
            },
            lang:{
                menuName:{
                    zh_cn:'菜单名称',en_us:'Menu Name  ',zh_cht:'菜單名稱',
                },

                menuName_en_us:{
                    zh_cn:'菜单英文名称',en_us:'Menu English Name ',zh_cht:'菜單英文名稱',
                },

                menuName_zh_cht:{
                    zh_cn:'菜单繁体名称',en_us:'Menu TW Name',zh_cht:'菜單繁體名稱',
                },
                menuId:{
                    zh_cn:'菜单Id',en_us:'Menu Id',zh_cht:'菜單Id',
                },
                menuOrderNum:{
                    zh_cn:'排序',en_us:'Sort Number',zh_cht:'排序',
                },
                menuUrl:{
                    zh_cn:'请求地址',en_us:'Menu Url',zh_cht:'請求地址',
                },
                menuType:{
                    zh_cn:'类型',en_us:'Menu Type',zh_cht:'類型',
                },
                visible:{
                    zh_cn:'状态',en_us:'Visible',zh_cht:'狀態',
                },
                perms:{
                    zh_cn:'按钮类型',en_us:'Button Type',zh_cht:'按鈕類型',
                },
                icon:{
                    zh_cn:'图标',en_us:'Icon',zh_cht:'圖標',
                },
                parentId:{
                    zh_cn:'上级菜单',en_us:'Parent Menu',zh_cht:'上級菜單',
                },
            }
        },
        {
            name: '机构管理',
            port: null,
            hash: 'orgs',
            path: 'rbac/org.html',
            projectName: null,
            crumbs:{
                zh_cn:'首页/系统管理/机构管理',
                en_us:'Home/system management/Orgnaization Management',
                zh_cht:'首頁/系統管理/機構管理',
            },
            lang:{
                orgName:{
                    zh_cn:'机构名称',en_us:'ORG Name',zh_cht:'機構名稱',
                },
                status:{
                    zh_cn:'机构状态',en_us:'ORG Status',zh_cht:'機構狀態',
                },
                leader:{
                    zh_cn:'负责人',en_us:'Leader',zh_cht:'負責人',
                },
                parentId:{
                    zh_cn:'上级机构',en_us:'Parent ORG',zh_cht:'上级機構',
                },
                orgOrderNum:{
                    zh_cn:'排序',en_us:'Sort Number',zh_cht:'排序',
                },
                phone:{
                    zh_cn:'联系电话',en_us:'Phone',zh_cht:'聯系電話',
                },
                email:{
                    zh_cn:'邮箱',en_us:'Email',zh_cht:'郵箱',
                },
                menuIds:{
                    zh_cn:'所属菜单',en_us:'Menu Right',zh_cht:'所屬菜單',
                },

            }
        },
        {
            name: '字典管理',
            port: null,
            hash: 'dicts',
            path: 'rbac/dict.html',
            projectName: null,
            crumbs:{
                zh_cn:'首页/系统管理/字典管理',
                en_us:'Home/system management/Data Dictionary',
                zh_cht:'首頁/系統管理/字典管理',
            },
            lang:{
                dictName:{
                    zh_cn:'字典名称',en_us:'Dict Name',zh_cht:'字典名稱',
                },
                dictType:{
                    zh_cn:'字典类型',en_us:'Dict Type',zh_cht:'字典類型',
                },
                dictData:{
                    zh_cn:'字典详情',en_us:'Dict Data',zh_cht:'字典詳情',
                },
                status:{
                    zh_cn:'状态',en_us:'Status',zh_cht:'狀態',
                },
                remark:{
                    zh_cn:'备注',en_us:'Remark',zh_cht:'備註',
                },
                dbClick:{
                    zh_cn:'请双击选择',en_us:'Please double-click the selection.',zh_cht:'請雙擊選擇',
                },
                dictLabel:{
                    zh_cn:'字典标识',en_us:'Dict Label',zh_cht:'字典標識',
                },
                dictValue:{
                    zh_cn:'字典值',en_us:'Dict Value',zh_cht:'字典值',
                },
                isDefault:{
                    zh_cn:'是否默认',en_us:'Is Default',zh_cht:'是否默認',
                },

            }
        },
        {
            name: '参数设置',
            port: null,
            hash: 'configs',
            path: 'rbac/config.html',
            projectName: null,
            crumbs:{
                zh_cn:'首页/系统管理/参数设置',
                en_us:'Home/system management/Parameter Setting',
                zh_cht:'首頁/系統管理/參數設置',
            },
            lang:{
                configName:{
                    zh_cn:'参数名称',en_us:'Parameter Name',zh_cht:'參數名稱',
                },
                configKey:{
                    zh_cn:'参数KEY',en_us:'Parameter Key',zh_cht:'參數KEY',
                },
                configValue:{
                    zh_cn:'参数VALUE',en_us:'Parameter Value',zh_cht:'參數VALUE',
                },
                configType:{
                    zh_cn:'是否内置参数',en_us:'System Parameter',zh_cht:'是否內置參數',
                },
                configId:{
                    zh_cn:'参数Id',en_us:'Parameter Id',zh_cht:'參數Id',
                },
                module:{
                    zh_cn:'模块名',en_us:'Module',zh_cht:'模塊名',
                },
                remark:{
                    zh_cn:'备注',en_us:'Remark',zh_cht:'備註',
                },

            }
        },
        {
            name: '操作日志',
            port: null,
            hash: 'operlogs',
            path: 'rbac/operlog.html',
            projectName: null,
            crumbs:{
                zh_cn:'首页/系统监控/操作日志',
                en_us:'Home/system monitor/Audit Log Inquiry',
                zh_cht:'首頁/系統監控/操作日誌',
            },
            lang:{
                loginName:{
                    zh_cn:'登录账号',en_us:'Login Name',zh_cht:'登錄賬號',
                },
                no:{
                    zh_cn:'序号',en_us:'Serial Number',zh_cht:'序号',
                },
                ipaddr:{
                    zh_cn:'请求IP地址',en_us:'IP Address',zh_cht:'請求IP地址',
                },
                status:{
                    zh_cn:'操作状态',en_us:'Status',zh_cht:'操作狀態',
                },
                os:{
                    zh_cn:'操作系统',en_us:'Operation System',zh_cht:'操作系统',
                },
                browser:{
                    zh_cn:'浏览器',en_us:'Browser',zh_cht:'瀏覽器',
                },
                loginLocation:{
                    zh_cn:'操作地点',en_us:'Operator Address',zh_cht:'操作地點',
                },
                operName:{
                    zh_cn:'操作人员',en_us:'Operator',zh_cht:'操作人員',
                },
                channel:{
                    zh_cn:'来源渠道',en_us:'Channel',zh_cht:'來源渠道',
                },
                orgName:{
                    zh_cn:'部门名称',en_us:'ORG Name',zh_cht:'部門名稱',
                },
                operId:{
                    zh_cn:'日志主键',en_us:'Operator Id',zh_cht:'日誌主鍵',
                },
                title:{
                    zh_cn:'模块标题',en_us:'Title',zh_cht:'模塊標題',
                },
                method:{
                    zh_cn:'方法名称',en_us:'Method',zh_cht:'方法名稱',
                },
                operUrl:{
                    zh_cn:'请求URL',en_us:'Operator Url',zh_cht:'請求URL',
                },
                operParam:{
                    zh_cn:'请求参数',en_us:'Operator Param',zh_cht:'請求參數',
                },
                errorMsg:{
                    zh_cn:'错误消息',en_us:'Error Msg',zh_cht:'錯誤消息',
                },
                type:{
                    zh_cn:'操作类型',en_us:'Action Type',zh_cht:'操作類型',
                },
                time:{
                    zh_cn:'操作时间',en_us:'Operation Time',zh_cht:'操作時間',
                },

            }
        },
        {
            name: '登录日志',
            port: null,
            hash: 'loginlogs',
            path: 'rbac/loginlog.html',
            projectName: null,
            crumbs:{
                zh_cn:'首页/系统监控/登录日志',
                en_us:'Home/system monitor/Login Log Inquiry',
                zh_cht:'首頁/系統監控/登錄日誌',
            },
            lang:{
                loginName:{
                    zh_cn:'登录账号',en_us:'Login Name',zh_cht:'登錄賬號',
                },
                no:{
                    zh_cn:'序号',en_us:'Serial Number',zh_cht:'序号',
                },
                ipaddr:{
                    zh_cn:'登录IP地址',en_us:'IP Address',zh_cht:'登錄IP地址',
                },
                status:{
                    zh_cn:'登录状态',en_us:'Status',zh_cht:'登錄狀態',
                },
                os:{
                    zh_cn:'操作系统',en_us:'Operation System',zh_cht:'操作系統',
                },
                browser:{
                    zh_cn:'浏览器',en_us:'Browser',zh_cht:'瀏覽器',
                },
                loginLocation:{
                    zh_cn:'登录地点',en_us:'Login Location',zh_cht:'登錄地點',
                },
                msg:{
                    zh_cn:'提示消息',en_us:'Login Message',zh_cht:'提示消息',
                },
                time:{
                    zh_cn:'访问时间',en_us:'Login Time',zh_cht:'訪問時間',
                },
            }
        },
        {
            name: '定时任务',
            port: null,
            hash: 'monitor/job',
            path: 'rbac/monitor/job.html',
            projectName: '/open-schedule',
            crumbs:{
                zh_cn:'首页/系统监控/定时任务',
                en_us:'Home/system monitor/Timing Task  Setting',
                zh_cht:'首頁/系統監控/定時任務',
            },
            lang:{
                jobName:{
                    zh_cn:'任务名称',en_us:'Job Name',zh_cht:'任務名稱',
                },
                jobNo:{
                    zh_cn:'任务编号',en_us:'Job Number',zh_cht:'任務編號',
                },
                jobGroup:{
                    zh_cn:'任务组名',en_us:'Job Group',zh_cht:'任務組名',
                },
                serviceName:{
                    zh_cn:'服务名称',en_us:'Service Name',zh_cht:'服務名稱',
                },
                apiPath:{
                    zh_cn:'接口地址',en_us:'API Path',zh_cht:'接口地址',
                },
                methodParams:{
                    zh_cn:'方法参数',en_us:'Method Params',zh_cht:'方法參數',
                },
                cronExpression:{
                    zh_cn:'CRON执行表达式',en_us:'Cron Expression',zh_cht:'CRON執行表達式',
                },
                misfirePolicy:{
                    zh_cn:'计划执行错误策略',en_us:'Misfire Policy',zh_cht:'計劃執行錯誤策略',
                },
                status:{
                    zh_cn:'任务状态',en_us:'Task Status',zh_cht:'任務狀態',
                },
                status1:{
                    zh_cn:'任务执行状态',en_us:'Task Execution Status',zh_cht:'任務執行狀態',
                },
                remark:{
                    zh_cn:'备注',en_us:'Remark',zh_cht:'備註',
                },
                methodParams:{
                    zh_cn:'方法参数',en_us:'Method Params',zh_cht:'方法參數',
                },
                next:{
                    zh_cn:'下次执行时间',en_us:'Next Execution Time',zh_cht:'下次執行時間',
                },
            }
        },
        {
            name: '定时任务日志',
            port: null,
            hash: 'monitor/jobLogs',
            path: 'rbac/monitor/jobLogs.html',
            projectName: '/open-schedule',
            crumbs:{
                zh_cn:'首页/系统监控/定时任务日志',
                en_us:'Home/system monitor/Timing Task  Log',
                zh_cht:'首頁/系統監控/定時任務日誌',
            },
            lang:{
                jobName:{
                    zh_cn:'任务名称',en_us:'Job Name',zh_cht:'任務名稱',
                },
                jobNo:{
                    zh_cn:'任务编号',en_us:'Job Number',zh_cht:'任務編號',
                },
                jobGroup:{
                    zh_cn:'任务组名',en_us:'Job Group',zh_cht:'任務組名',
                },
                serviceName:{
                    zh_cn:'服务名称',en_us:'Service Name',zh_cht:'服務名稱',
                },
                apiPath:{
                    zh_cn:'接口地址',en_us:'API Path',zh_cht:'接口地址',
                },
                methodParams:{
                    zh_cn:'方法参数',en_us:'Method Params',zh_cht:'方法參數',
                },
                cronExpression:{
                    zh_cn:'CRON执行表达式',en_us:'Cron Expression',zh_cht:'CRON執行表達式',
                },
                misfirePolicy:{
                    zh_cn:'计划执行错误策略',en_us:'Misfire Policy',zh_cht:'計劃執行錯誤策略',
                },
                status:{
                    zh_cn:'任务状态',en_us:'Task Status',zh_cht:'任務狀態',
                },
                status1:{
                    zh_cn:'任务执行状态',en_us:'Task Execution Status',zh_cht:'任務執行狀態',
                },
                remark:{
                    zh_cn:'备注',en_us:'Remark',zh_cht:'備註',
                },
                methodParams:{
                    zh_cn:'方法参数',en_us:'Method Params',zh_cht:'方法參數',
                },
                next:{
                    zh_cn:'下次执行时间',en_us:'Next Execution Time',zh_cht:'下次執行時間',
                },
                nodeIp:{
                    zh_cn:'IP地址',en_us:'IP',zh_cht:'IP地址',
                },
                nodePort:{
                    zh_cn:'端口',en_us:'Port',zh_cht:'端口',
                },
                jobMessage:{
                    zh_cn:'日志信息',en_us:'Job Message',zh_cht:'日誌信息',
                },
            }
        },
        {
            name: '在线用户',
            port: null,
            hash: 'monitor/onlineUsers',
            path: 'rbac/monitor/online.html',
            projectName: null,
             crumbs:{
                zh_cn:'首页/系统监控/在线用户',
                en_us:'Home/system monitor/onlineUsers',
                zh_cht:'首頁/系統監控/在線用戶',
            },
            lang:{
                ipaddr:{
                    zh_cn:'主机',en_us:'IP Address',zh_cht:'主機',
                },
                loginName:{
                    zh_cn:'操作人员',en_us:'Login Name',zh_cht:'操作人員',
                },
                lastAccessTime:{
                    zh_cn:'最后访问时间',en_us:'Last Access Time',zh_cht:'最後訪問時間',
                },
                startTimestamp:{
                    zh_cn:'登录时间',en_us:'Start Time',zh_cht:'登錄時間',
                },
                status:{
                    zh_cn:'会话状态',en_us:'Status',zh_cht:'會話狀態',
                },
                os:{
                    zh_cn:'操作系统',en_us:'Operation System',zh_cht:'操作系統',
                },
                browser:{
                    zh_cn:'浏览器',en_us:'Browser',zh_cht:'瀏覽器',
                },
                loginLocation:{
                    zh_cn:'登录地点',en_us:'Login Location',zh_cht:'登錄地點',
                },
                orgName:{
                    zh_cn:'部门名称',en_us:'ORG Name',zh_cht:'部門名稱',
                },

            }
        },
        {
            name: '用户资料修改',
            port: null,
            hash: 'user/info',
            path: 'rbac/user/info.html',
            projectName: null,
            crumbs:{
                zh_cn:'首页/用户资料修改',
                en_us:'Home/user Edit',
                zh_cht:'首頁/用戶資料修改',
            },
            lang:{
                loginName:{
                    zh_cn:'登录名称',en_us:'Login Name',zh_cht:'登錄名稱',
                },
                avatar:{
                    zh_cn:'头像',en_us:'Avatar',zh_cht:'頭像',
                },
                userName:{
                    zh_cn:'用户名称',en_us:'User Name',zh_cht:'用護名稱',
                },
                orgId:{
                    zh_cn:'所属机构',en_us:'ORG',zh_cht:'所屬機構',
                },
                status:{
                    zh_cn:'用户状态',en_us:'User Status',zh_cht:'用護狀態',
                },
                phonenumber:{
                    zh_cn:'手机号码',en_us:'Phone Number',zh_cht:'手機號碼',
                },
                password:{
                    zh_cn:'密码',en_us:'Password',zh_cht:'密碼',
                },
                email:{
                    zh_cn:'邮箱',en_us:'Email',zh_cht:'郵箱',
                },
                sex1:{
                    zh_cn:'性别',en_us:'Sex',zh_cht:'性別',
                },
                userType:{
                    zh_cn:'用户类型',en_us:'User Type',zh_cht:'用戶類型',
                },
                userId:{
                    zh_cn:'用户ID',en_us:'UserId',zh_cht:'用戶ID',
                },

            }
        },
        {
            name: '缓存管理',
            port: null,
            hash: 'redis',
            path: 'rbac/redis.html',
            projectName: null,
            crumbs:{
                zh_cn:'首页/系统管理/缓存管理',
                en_us:'Home/system management/Cache Inquiry',
                zh_cht:'首頁/系統管理/緩存管理',
            },
            lang:{
                time:{
                    zh_cn:'剩余生存时间',en_us:'Remaining Time',zh_cht:'剩余生存時間',
                },
                s:{
                    zh_cn:'秒',en_us:'S',zh_cht:'秒',
                },
                cacheKey:{
                    zh_cn:'缓存KEY',en_us:'Cache Key',zh_cht:'緩存KEY',
                },
                cacheValue:{
                    zh_cn:'缓存VALUE',en_us:'Cache Value',zh_cht:'緩存VALUE',
                },
            }
        },
        {
            name: '实时名单查询',
            port: null,
            hash: 'blacklists',
            path: 'rbac/blacklists.html',
            projectName: null,
            crumbs:{
                zh_cn:'首页/名单查询/实时名单查询',
                en_us:'Home/list inquery/Real-time inquery',
                zh_cht:'首頁/名單查詢/實時名單查詢',
            },
            lang:{
                customerName:{
                    zh_cn:'姓名',en_us:'Customer Name',zh_cht:'姓名',
                },
                identityCard:{
                    zh_cn:'身份证',en_us:'Identity Card',zh_cht:'身份證',
                },
                passport:{
                    zh_cn:'护照',en_us:'Passport',zh_cht:'護照',
                },
                nationality:{
                    zh_cn:'国籍',en_us:'Nationality',zh_cht:'國籍',
                },
                gender:{
                    zh_cn:'性别',en_us:'gender',zh_cht:'性別',
                },
                birthDate:{
                    zh_cn:'出生日期',en_us:'Birth Date',zh_cht:'出生日期',
                },
                birthDateEg:{
                    zh_cn:'1995-07-25',en_us:'Birth Date Eg',zh_cht:'1995-07-25',
                },
                idCard:{
                    zh_cn:'证件号',en_us:'Id Card',zh_cht:'證件號',
                },
                birthPlace:{
                    zh_cn:'出生地',en_us:'Birth Place',zh_cht:'出生地',
                },
                position:{
                    zh_cn:'职位',en_us:'Position',zh_cht:'職位',
                },
                title:{
                    zh_cn:'头衔',en_us:'Title',zh_cht:'頭銜',
                },
                relateCompany:{
                    zh_cn:'相关公司',en_us:'Relate Company',zh_cht:'相關公司',
                },
                compatibility:{
                    zh_cn:'匹配度',en_us:'Compatibility',zh_cht:'匹配度',
                },
                positionInformation:{
                    zh_cn:'提示信息',en_us:'Position Information',zh_cht:'提示信息',
                },
                fuzzyMatching:{
                    zh_cn:'模糊匹配',en_us:'Fuzzy Matching',zh_cht:'模糊匹配',
                },
                fuzzyDegree:{
                    zh_cn:'模糊度',en_us:'Fuzzy Degree',zh_cht:'模糊度',
                },
                matchPattern:{
                    zh_cn:'姓名匹配模式',en_us:'Match Pattern',zh_cht:'姓名匹配模式',
                },
                fuzzyDegreeEg:{
                    zh_cn:'1-99内整数',en_us:'Fuzzy Degree Eg',zh_cht:'1-99內整數',
                },
                investigation:{
                    zh_cn:'调查',en_us:'Investigation',zh_cht:'調查',
                },
            }

        },

        {
            name: '查询规则配置',
            port: null,
            hash: 'blackListRules',//blackListRules
            path: 'rbac/blackListRule.html',//rbac/blackListRule.html
            projectName: null,
            crumbs:{
                zh_cn:'首页/黑名单管理/查询规则配置',
                en_us:'Home/Blacklist management/Query rule configuration',
                zh_cht:'首頁/黑名單管理/查詢規則配置',
            },
            lang:{
                ruleName:{
                    zh_cn:'规则名称',en_us:'Rule Name',zh_cht:'規則名稱',
                },
                isDeleted:{
                    zh_cn:'规则状态',en_us:'Is Deleted',zh_cht:'規則狀態',
                },
            }
        },
        {
            name: '任务文件上传',
            port: null,
            hash: 'taskFileUploads',//blackListRules
            path: 'rbac/taskFileUpload.html',//rbac/blackListRule.html
            projectName: null,
            crumbs:{
                zh_cn:'首页/黑名单管理/任务文件上传',
                en_us:'Home/Blacklist management/Task file upload',
                zh_cht:'首頁/黑名單管理/任務文件上傳',
            },
            lang:{
                ruleName:{
                    zh_cn:'规则名称',en_us:'Rule Name',zh_cht:'規則名稱',
                },
                isDeleted:{
                    zh_cn:'规则状态',en_us:'Is Deleted',zh_cht:'規則狀態',
                },
            }
        },
        {
            name: '查询规则配置',
            port: null,
            hash: 'blackListRules',//blackListRules
            path: 'rbac/blackListRule.html',//rbac/blackListRule.html
            projectName: null,
            crumbs:{
                zh_cn:'首页/黑名单管理/查询规则配置',
                en_us:'Home/Blacklist management/Query rule configuration',
                zh_cht:'首頁/黑名單管理/查詢規則配置',
            },
            lang:{
                ruleName:{
                    zh_cn:'规则名称',en_us:'Rule Name',zh_cht:'規則名稱',
                },
                isDeleted:{
                    zh_cn:'规则状态',en_us:'Is Deleted',zh_cht:'規則狀態',
                },
            }
        },
        {
            name: '尽职调查查询',
            port: null,
            hash: 'investigation',
            path: 'rbac/investigation/investQuery.html',
            projectName: null,
            crumbs:{
                zh_cn:'首页/尽职调查管理/尽职调查查询',
                en_us:'Home/Due Diligence Management/Due Diligence Query',
                zh_cht:'首頁/盡職調查管理/盡職調查查詢',
            },
            lang:{
                customerName:{
                    zh_cn:'姓名',en_us:'Customer Name',zh_cht:'姓名',
                },
                identityCard:{
                    zh_cn:'身份证',en_us:'Identity Card',zh_cht:'身份證',
                },
                passport:{
                    zh_cn:'护照',en_us:'Passport',zh_cht:'護照',
                },
                basicInfo:{
                    zh_cn:'基本信息',en_us:'Basic Info',zh_cht:'基本信息',
                },
                suspiciousExchangeDate:{
                    zh_cn:'可疑交易发现日期',en_us:'Suspicious Exchange Date',zh_cht:'可疑交易發現日期',
                },
                custNo:{
                    zh_cn:'客户编号',en_us:'Customer Number',zh_cht:'客戶編號',
                },
                relatedCapital:{
                    zh_cn:'涉及资金量',en_us:'Relate Capital',zh_cht:'涉及資金量',
                },
                reportDepartment:{
                    zh_cn:'报告部门',en_us:'Report Department',zh_cht:'報告部門',
                },
                usdSell:{
                    zh_cn:'美元售汇',en_us:'The dollar sale',zh_cht:'美元售匯',
                },
                usdBuy:{
                    zh_cn:'美元兑汇',en_us:'The dollar buy',zh_cht:'美元兌匯',
                },
                counterpartyCount:{
                    zh_cn:'交易对手数量',en_us:'Counterparty Count',zh_cht:'交易對手數量',
                },
                otherForeignBuy:{
                    zh_cn:'其他外币结汇',en_us:'Other Foreign Buy',zh_cht:'其他外幣結匯',
                },
                downstreamCounterparty:{
                    zh_cn:'下游交易对手',en_us:'Downstream Counterparty',zh_cht:'下游交易對手',
                },
                beginDate:{
                    zh_cn:'统计开始日期',en_us:'Begin Date',zh_cht:'統計開始日期',
                },
                endDate:{
                    zh_cn:'统计结束日期',en_us:'End Date',zh_cht:'統計結束日期',
                },
                exchangeDetail:{
                    zh_cn:'交易详情',en_us:'Exchange Detail',zh_cht:'交易詳情',
                },
                column:{
                    zh_cn:'列',en_us:'Column',zh_cht:'列',
                },
                exchangeDate:{
                    zh_cn:'交易时间',en_us:'Exchange Date',zh_cht:'交易時間',
                },
                exchangeResource:{
                    zh_cn:'交易渠道',en_us:'Exchange Resource',zh_cht:'交易渠道',
                },
                exchangeAmount:{
                    zh_cn:'交易金额',en_us:'Exchange Amount',zh_cht:'交易金額',
                },
                competitorName:{
                    zh_cn:'对手名称',en_us:'Competitor Resource',zh_cht:'對手名稱',
                },
                details:{
                    zh_cn:'详情',en_us:'Details',zh_cht:'詳情',
                },
                additionalRecordingInfo:{
                    zh_cn:'尽调补录信息',en_us:'Additional Recording Info',zh_cht:'盡調補錄信息',
                },
                custOrder:{
                    zh_cn:'客户—方今',en_us:'Customer Order',zh_cht:'客戶方今',
                },
                gender:{
                    zh_cn:'性别',en_us:'Gender',zh_cht:'性别',
                },
                age:{
                    zh_cn:'年龄',en_us:'Age',zh_cht:'年龄',
                },
                nationnality:{
                    zh_cn:'国籍',en_us:'Nationnality',zh_cht:'國籍',
                },
                profession:{
                    zh_cn:'职业',en_us:'Profession',zh_cht:'職業',
                },
                relateCompanyInfo:{
                    zh_cn:'关联公司情况',en_us:'Relate Company Infomation',zh_cht:'關聯公司情況',
                },
                homePage:{
                    zh_cn:'主页',en_us:'Home Page',zh_cht:'主頁',
                },
                seniorExecutive:{
                    zh_cn:'高管',en_us:'Senior Executive',zh_cht:'高管',
                },
                whereaboutsOfCapital:{
                    zh_cn:'资金去向情况',en_us:'Whereaaouts Of Capital',zh_cht:'資金去向情況',
                },
                capitalSituationAndUse:{
                    zh_cn:'资金情况及用途',en_us:'Capital Situation And Use',zh_cht:'資金情況及用途',
                },
                scopeOfBusiness:{
                    zh_cn:'经营范围',en_us:'Scope Of Business',zh_cht:'經營範圍',
                },
                otherInfo:{
                    zh_cn:'其他信息',en_us:'Other Information',zh_cht:'其他信息',
                },
                staffDesc:{
                    zh_cn:'人员构成',en_us:'Staff Desc',zh_cht:'人員構成',
                },
                save:{
                    zh_cn:' 保存 ',en_us:'Save',zh_cht:' 保存 ',
                },


            }
        },
    ],

    trigger:[
        {
            name: '策略配置',
            port: null,
            hash: 'trigger/PolicyConfiguration',
            path: 'trigger/PolicyConfiguration.html',
            projectName: null,
            crumbs:{
                zh_cn:'首页/触发中心/策略配置',
                en_us:'Home/trigger center/Policy Configuration',
                zh_cht:'首頁/触发中心/策略配置',
            },
            lang:{
                loginName:{
                    zh_cn:'登录名称',en_us:'Login Name',zh_cht:'登录名稱',
                },
                userName:{
                    zh_cn:'用户名称',en_us:'User Name',zh_cht:'用戶名稱',
                },
                orgId:{
                    zh_cn:'所属机构',en_us:'ORG',zh_cht:'所屬機構',
                },
                status:{
                    zh_cn:'用户状态',en_us:'User Status',zh_cht:'用戶狀態',
                },
                phonenumber:{
                    zh_cn:'手机号码',en_us:'Phone Number',zh_cht:'手機號碼',
                },
                password:{
                    zh_cn:'密码',en_us:'Password',zh_cht:'密碼',
                },
                email:{
                    zh_cn:'邮箱',en_us:'Email',zh_cht:'郵箱',
                },
                sex:{
                    zh_cn:'性别',en_us:'Sex',zh_cht:'性別',
                },
                userType:{
                    zh_cn:'用户类型',en_us:'User Type',zh_cht:'用戶類型',
                },
                userId:{
                    zh_cn:'用户ID',en_us:'UserId',zh_cht:'用戶ID',
                },
            }
        },
        {

            name: '费用信息',
            port: null,
            hash: 'chargeList',
            path: 'rbac/chargeList.html',
            projectName: null,
            crumbs: {
                zh_cn: '首页/计费查询/费用信息',
                en_us: 'Home/interest rate inquiry/cost info',
                zh_cht: '首頁/計費査詢/費用資訊',
            },
            lang: {
                seq: {
                    zh_cn: '标识号', en_us: 'seq', zh_cht: '標識號',
                },
                updateDatetime: {
                    zh_cn: '更新时间', en_us: 'Update Time', zh_cht: '更新時間',
                },
                onlineRetrieveCount: {
                    zh_cn: '在线查询', en_us: 'online Retrieve Count', zh_cht: '線上查詢',
                },
                batchRetrieveCount: {
                    zh_cn: '批量查询', en_us: 'Batch Retrieve Count', zh_cht: '批量査詢',
                },
                viewResultCount: {
                    zh_cn: '任务结果在线查看', en_us: 'View Result Count', zh_cht: '任務結果線上查看',
                },
                chargeType: {
                    zh_cn: '计费类别', en_us: 'Charge Type', zh_cht: '計費類別',
                },
                fee: {
                    zh_cn: '费用', en_us: 'Cost', zh_cht: '費用',
                },
            }
        },
        {
            name: '任务结果查询',
            port: null,
            hash: 'taskResultList',
            path: 'rbac/taskResultList.html',
            crumbs: '首页/黑名单管理/任务结果查询',
            projectName: null,
            crumbs: {
                zh_cn: '首页/黑名单管理/任务结果查询',
                en_us: 'Home/BlackList Management/taskresultquery',
                zh_cht: '首頁/歷史結果回溯/任務結果查詢',
            },
            lang: {
                id: {
                    zh_cn: '标识号', en_us: 'Id', zh_cht: '標識號',
                },
                batchName: {
                    zh_cn: '任务名', en_us: 'Batch Name', zh_cht: '任務名',
                },
                blacklistRuleSeq: {
                    zh_cn: '匹配规则ID', en_us: 'Blacklist Rule Seq', zh_cht: '匹配規則ID',
                },
                createDatetime: {
                    zh_cn: '任务触发时间', en_us: 'Create Datetime', zh_cht: '任務觸發時間',
                }
            },
        },
        {
        	name: '对公账户管理',
            port: null,
            hash: 'accountManage',
            path: 'rbac/accountManage.html',
            projectName: null,
            crumbs:{
                zh_cn:'首页/企业管理/对公账户管理',
                en_us:'Home/company management/account management',
                zh_cht:'首頁/企業管理/對公賬戶管理',
            },
            lang:{
            	accountNo:{
                    zh_cn:'对公账号',en_us:'Account Number',zh_cht:'对公賬號',
                },
                accountType:{
                	zh_cn:'账户类型',en_us:'Account Type',zh_cht:'賬戶類型',
                },
                bankName:{
                	zh_cn:'开户行全称',en_us:'Bank Name',zh_cht:'開戶行全稱',
                },
                bankId:{
                	zh_cn:'开户行序号',en_us:'Bank Id',zh_cht:'開戶行序号',
                },
                bankSubbranch:{
                    zh_cn:'开户行支行',en_us:'Legal Person',zh_cht:'開戶行支行',
                },
                status:{
                    zh_cn:'状态',en_us:'Status',zh_cht:'狀態',
                },
                bankProvince:{
                	zh_cn:'开户行所在省',en_us:'Bank Province',zh_cht:'开户行所在省',
                },
                bankCity:{
                	zh_cn:'开户行所在市',en_us:'Bank City',zh_cht:'开户行所在市',
                },
                largeAccountNo:{
                	zh_cn:'大额行号',en_us:'Large Account Number',zh_cht:'大额行号',
                },
            }
        },
        {
        	name: '对公账户新增',
        	port: null,
        	hash: 'addCpAccount',
        	path: 'rbac/addCpAccount.html',
        	projectName: null,
        	crumbs:{
        		zh_cn:'首页/企业管理/对公账户新增',
        		en_us:'Home/company management/add account',
        		zh_cht:'首頁/企業管理/对公账户新增',
        	},
        	lang:{
            	accountNo:{
                    zh_cn:'账号',en_us:'Account Number',zh_cht:'賬號',
                },
                accountType:{
                	zh_cn:'账户类型',en_us:'Account Type',zh_cht:'賬戶類型',
                },
                bankName:{
                	zh_cn:'开户行全称',en_us:'Bank Name',zh_cht:'開戶行全稱',
                },
                bankSubbranch:{
                    zh_cn:'开户行支行',en_us:'Legal Person',zh_cht:'開戶行支行',
                },
                status:{
                    zh_cn:'状态',en_us:'Status',zh_cht:'狀態',
                },
                bankProvince:{
                	zh_cn:'开户行所在省',en_us:'Bank Province',zh_cht:'开户行所在省',
                },
                bankCity:{
                	zh_cn:'开户行所在市',en_us:'Bank City',zh_cht:'开户行所在市',
                },
                largeAccountNo:{
                	zh_cn:'大额行号',en_us:'Large Account Number',zh_cht:'大额行号',
                },
                confirmBtn:{
                	zh_cn:'确认',en_us:'Confirm',zh_cht:'确认',
                },
            }
        },
        {
        	name: '企业实名认证',
            port: null,
            hash: 'comAuth',
            path: 'rbac/comAuth.html',
            projectName: null,
            crumbs:{
                zh_cn:'首页/企业管理/企业实名认证',
                en_us:'Home/company management/company authentication',
                zh_cht:'首頁/企業管理/企業實名認證',
            },
            lang:{
            	companyName:{
                    zh_cn:'公司名称',en_us:'Company Name',zh_cht:'公司名稱',
                },
                authStatus:{
                    zh_cn:'认证审批状态',en_us:'Auth Status',zh_cht:'認證審批狀態',
                },
                authNoPassCause:{
                    zh_cn:'审批不通过原因',en_us:'Auth No Pass Cause',zh_cht:'審批不通過原因',
                },
                orgCode:{
                	zh_cn:'机构编码',en_us:'ORG Code',zh_cht:'機構編碼',
                },
                creditRating:{
                	zh_cn:'信用等级',en_us:'Credit Rating',zh_cht:'信用等級',
                },
                oldPaymentPassword:{
                	zh_cn:'原支付密码',en_us:'Old Payment Password',zh_cht:'原支付密碼',
                },
                paymentPassword:{
                	zh_cn:'支付密码',en_us:'Payment Password',zh_cht:'支付密碼',
                },
                paymentPassword2:{
                	zh_cn:'确认支付密码',en_us:'Sure Payment Password',zh_cht:'確認支付密碼',
                },
                legalPerson:{
                    zh_cn:'公司法人',en_us:'Legal Person',zh_cht:'公司法人',
                },
                legalPersonIdNo:{
                    zh_cn:'法人身份证号',en_us:'Legal Person Id No',zh_cht:'法人身份證號',
                },
                legalPersonPhone:{
                    zh_cn:'法人手机号',en_us:'Legal Person Phone',zh_cht:'法人手機號',
                },
                transactor:{
                    zh_cn:'经办人',en_us:'Transactor',zh_cht:'經辦人',
                },
                transactorIdNo:{
                    zh_cn:'经办人身份证号',en_us:'Transactor Id No',zh_cht:'經辦人身份證號',
                },
                transactorPhone:{
                    zh_cn:'经办人手机号',en_us:'Transactor Phone',zh_cht:'經辦人手機號',
                },
                contactPhone:{
                    zh_cn:'联系人手机号',en_us:'Contact Phone',zh_cht:'聯系人手機號',
                },
                contactEmail:{
                    zh_cn:'联系人邮箱',en_us:'Contact Email',zh_cht:'聯系人郵箱',
                },
                menuIds:{
                    zh_cn:'所属菜单',en_us:'Menu Right',zh_cht:'所屬菜單',
                },
                registerProvince:{
                	zh_cn:'注册省',en_us:'Register Province',zh_cht:'註冊省',
                },
                registerCity:{
                	zh_cn:'注册市',en_us:'Register City',zh_cht:'註冊市',
                },
                registerRegion:{
                	zh_cn:'注册区',en_us:'Register Region',zh_cht:'註冊區',
                },
                registerAddress:{
                	zh_cn:'注册地址',en_us:'Register Address',zh_cht:'註冊地址',
                },
                organizationCode:{
                	zh_cn:'组织机构代码',en_us:'Organization Code',zh_cht:'組織機構代碼',
                },
                registerDate:{
                	zh_cn:'注册日期',en_us:'Register Date',zh_cht:'註冊日期',
                },
                registerCapital:{
                	zh_cn:'注册资本',en_us:'Register Capital',zh_cht:'註冊資本',
                },
                industry:{
                	zh_cn:'行业',en_us:'Industry',zh_cht:'行業',
                },
                enterpriseTypeCHN:{
                	zh_cn:'企业类型/国标',en_us:'Enterprise Type Chn',zh_cht:'企業類型/',
                },
                enterpriseTypeBank:{
                	zh_cn:'企业类型/银监',en_us:'enterprise Type Bank',zh_cht:'企業類型',
                },
                personnelScale:{
                	zh_cn:'人员规模',en_us:'Personnel Scale',zh_cht:'人員規模',
                },
                businessScope:{
                	zh_cn:'经营范围',en_us:'Business Scope',zh_cht:'經營範圍',
                },
                incomeSource:{
                	zh_cn:'收入来源',en_us:'Income Source',zh_cht:'收入來源',
                },
                otherMemo:{
                	zh_cn:'其他情况',en_us:'Other Memo',zh_cht:'其他情況',
                },
            }
        },

        {
        	name: '企业实名认证',
            port: null,
            hash: 'comResetPassword',
            path: 'rbac/comResetPassword.html',
            projectName: null,
            crumbs:{
                zh_cn:'首页/企业管理/企业支付密码管理',
                en_us:'Home/company management/company reset password',
                zh_cht:'首頁/企業管理/企業支付密碼管理',
            },
            lang:{
            	companyName:{
                    zh_cn:'公司名称',en_us:'Company Name',zh_cht:'公司名稱',
                },
                oldPaymentPassword:{
                	zh_cn:'原支付密码',en_us:'Old Payment Password',zh_cht:'原支付密碼',
                },
                paymentPassword:{
                	zh_cn:'支付密码',en_us:'Payment Password',zh_cht:'支付密碼',
                },
                paymentPassword2:{
                	zh_cn:'确认支付密码',en_us:'Sure Payment Password',zh_cht:'確認支付密碼',
                },
            }
        },

        {
            name: '票据发布',
            port: null,
            hash: 'cpPublish',
            path: 'rbac/cpPublish.html',
            projectName: null,
            crumbs:{
                zh_cn:'首页/企业管理/票据发布',
                en_us:'Home/company management/release notes',
                zh_cht:'首頁/企業管理/票據發佈',
            },
            lang:{
                cpNo:{
                    zh_cn:'票据号码',en_us:'ticket number',zh_cht:'票據號碼',
                },
                acceptor:{
                    zh_cn:'承兑人',en_us:'acceptor',zh_cht:'承兌人',
                },
                cpAmount:{
                    zh_cn:'票面金额',en_us:'face amount',zh_cht:'票面金額',
                },
                endorseTimes:{
                    zh_cn:'背书次数',en_us:'number of times ',zh_cht:'背書次數',
                },
                dueDate:{
                    zh_cn:'到期日',en_us:'due date ',zh_cht:'到期日',
                },
                cpDefect:{
                    zh_cn:'票据瑕疵',en_us:'Paper defects',zh_cht:'票據瑕疵',
                },
                turnVolume:{
                    zh_cn:'发布金额',en_us:'Release the amount',zh_cht:'發佈金額',
                },
                bottomAdd:{
                    zh_cn:'继续添加',en_us:'Continue to add',zh_cht:'繼續添加',
                },
                publish:{
                    zh_cn:'立即发布',en_us:'Immediately release',zh_cht:'立即發佈',
                },
                annual_interest_rate :{
                    zh_cn:'年化利率',en_us:'annual interest rate',zh_cht:'年化利率',
                },
                deducted :{
                    zh_cn:'每十万扣款',en_us:'Every 100,000 is deducted',zh_cht:'每十萬扣款',
                },
                selling_rate  :{
                    zh_cn:'卖出价',en_us:'selling rate ',zh_cht:'賣出價',
                },
                refusalCause  :{
                	zh_cn:'拒绝原因',en_us:'refusal Cause',zh_cht:'拒绝原因',
                }
            }
        },

        

        {
            name: '我的发布',
            port: null,
            hash: 'mySales',
            path: 'rbac/user/mySale.html',
            projectName: null,
            crumbs:{
                zh_cn:'首页/用户中心/我的发布',
                en_us:'Home/user center/my sale',
                zh_cht:'首頁/用戶中心/我的發佈',
            },
            lang:{
                releaseTime:{
                    zh_cn:'发布时间',en_us:'Release Time',zh_cht:'發布時間',
                },
                cpNo:{
                    zh_cn:'票据号码',en_us:'ticket number',zh_cht:'票據號碼',
                },
                acceptor:{
                    zh_cn:'承兑人',en_us:'acceptor',zh_cht:'承兌人',
                },
                cpAmount:{
                    zh_cn:'票面金额',en_us:'face amount',zh_cht:'票面金額',
                },
                endorseTimes:{
                    zh_cn:'背书次数',en_us:'number of times ',zh_cht:'背書次數',
                },
                dueDate:{
                    zh_cn:'到期日',en_us:'due date ',zh_cht:'到期日',
                },
                cpDefect:{
                    zh_cn:'票据瑕疵',en_us:'Paper defects',zh_cht:'票據瑕疵',
                },
                turnVolume:{
                    zh_cn:'发布金额',en_us:'Release the amount',zh_cht:'發佈金額',
                },
                bottomAdd:{
                    zh_cn:'继续添加',en_us:'Continue to add',zh_cht:'繼續添加',
                },
                publish:{
                    zh_cn:'立即发布',en_us:'Immediately release',zh_cht:'立即發佈',
                },
                annual_interest_rate :{
                    zh_cn:'年化利率',en_us:'annual interest rate',zh_cht:'年化利率',
                },
                deducted :{
                    zh_cn:'每十万扣款',en_us:'Every 100,000 is deducted',zh_cht:'每十萬扣款',
                },
                selling_rate  :{
                    zh_cn:'卖出价',en_us:'selling rate ',zh_cht:'賣出價',
                },
                cpStatus  :{
                    zh_cn:'状态',en_us:'status ',zh_cht:'狀態',
                },
                companyName  :{
                    zh_cn:'公司名称',en_us:'company name ',zh_cht:'公司名稱',
                },
                quoteTurnVolume  :{
                    zh_cn:'竞价金额',en_us:'Bid amount ',zh_cht:'競價金額',
                },
                quoteTime  :{
                    zh_cn:'竞价时间',en_us:'For the time',zh_cht:'競價時間',
                },
                matchTime  :{
                    zh_cn:'撮合时间',en_us:'Set the time',zh_cht:'撮合時間',
                },
                quoteStatus  :{
                    zh_cn:'状态',en_us:'status',zh_cht:'狀態',
                },
                actualTime  :{
                    zh_cn:'成交时间',en_us:'deal time',zh_cht:'成交時間',
                },
                refusalCause  :{
                	zh_cn:'拒绝原因',en_us:'refusal Cause',zh_cht:'拒绝原因',
                }
            }
        },
        {
            name: '我的买入',
            port: null,
            hash: 'myBuys',
            path: 'rbac/user/myBuys.html',
            projectName: null,
            crumbs:{
                zh_cn:'首页/用户中心/我的买入',
                en_us:'Home/user center/myBuys',
                zh_cht:'首頁/用戶中心/我的買入',
            },
            lang:{
                releaseTime:{
                    zh_cn:'发布时间',en_us:'Release Time',zh_cht:'發布時間',
                },
                cpNo:{
                    zh_cn:'票据号码',en_us:'ticket number',zh_cht:'票據號碼',
                },
                acceptor:{
                    zh_cn:'承兑人',en_us:'acceptor',zh_cht:'承兌人',
                },
                cpAmount:{
                    zh_cn:'票面金额',en_us:'face amount',zh_cht:'票面金額',
                },
                endorseTimes:{
                    zh_cn:'背书次数',en_us:'number of times ',zh_cht:'背書次數',
                },
                dueDate:{
                    zh_cn:'到期日',en_us:'due date ',zh_cht:'到期日',
                },
                cpDefect:{
                    zh_cn:'票据瑕疵',en_us:'Paper defects',zh_cht:'票據瑕疵',
                },
                turnVolume:{
                    zh_cn:'发布金额',en_us:'Release the amount',zh_cht:'發佈金額',
                },
                bottomAdd:{
                    zh_cn:'继续添加',en_us:'Continue to add',zh_cht:'繼續添加',
                },
                publish:{
                    zh_cn:'立即发布',en_us:'Immediately release',zh_cht:'立即發佈',
                },
                annual_interest_rate :{
                    zh_cn:'年化利率',en_us:'annual interest rate',zh_cht:'年化利率',
                },
                deducted :{
                    zh_cn:'每十万扣款',en_us:'Every 100,000 is deducted',zh_cht:'每十萬扣款',
                },
                selling_rate  :{
                    zh_cn:'卖出价',en_us:'selling rate ',zh_cht:'賣出價',
                },
                cpStatus  :{
                    zh_cn:'状态',en_us:'status ',zh_cht:'狀態',
                },
                companyName  :{
                    zh_cn:'公司名称',en_us:'company name ',zh_cht:'公司名稱',
                },
                quoteTurnVolume  :{
                    zh_cn:'竞价金额',en_us:'Bid amount ',zh_cht:'競價金額',
                },
                quoteTime  :{
                    zh_cn:'竞价时间',en_us:'For the time',zh_cht:'競價時間',
                },
                matchTime  :{
                    zh_cn:'撮合时间',en_us:'Set the time',zh_cht:'撮合時間',
                },
                quoteStatus  :{
                    zh_cn:'状态',en_us:'status',zh_cht:'狀態',
                },
                startTime  :{
                    zh_cn:'开始时间',en_us:'start time',zh_cht:'開始時間',
                },
                endTime  :{
                    zh_cn:'结束时间',en_us:'end time',zh_cht:'結束時間',
                }
            }
        }
    ]


    /*

    你们的项目名:[
        {
            name: '菜单名字',
            port: null,

            hash: 你新增的菜单的url,
            path: 你前端页面的路径，绝对路径，带http的那种,
            projectName: null,
            crumbs:{
                zh_cn:'首页/目录/菜单名字',
                en_us:'Home/英文目录/英文菜单名字',
                zh_cht:'首頁/目录/菜单名字',
            },
            lang:{
                loginName:{
                    zh_cn:'登录名称',en_us:'Login Name',zh_cht:'登录名稱',
                },
                userName:{
                    zh_cn:'用户名称',en_us:'User Name',zh_cht:'用戶名稱',
                },
                orgId:{
                    zh_cn:'所属机构',en_us:'ORG',zh_cht:'所屬機構',
                },
                status:{
                    zh_cn:'用户状态',en_us:'User Status',zh_cht:'用戶狀態',
                },
                phonenumber:{
                    zh_cn:'手机号码',en_us:'Phone Number',zh_cht:'手機號碼',
                },
                password:{
                    zh_cn:'密码',en_us:'Password',zh_cht:'密碼',
                },
                email:{
                    zh_cn:'邮箱',en_us:'Email',zh_cht:'郵箱',
                },
                sex:{
                    zh_cn:'性别',en_us:'Sex',zh_cht:'性別',
                },
                userType:{
                    zh_cn:'用户类型',en_us:'User Type',zh_cht:'用戶類型',
                },
                userId:{
                    zh_cn:'用户ID',en_us:'UserId',zh_cht:'用戶ID',
                },
            }
        },
    ]
    */
}