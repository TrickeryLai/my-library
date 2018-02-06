
//微学堂

var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var AntdMobile = require('../../antdMobile/antdMobile.js');
var Device = require('../../device/device.js');
var cordova = require( '../initJSBridge');
var Fetch = require('../../fetch/fetch.js');
var History =ReactRouter.hashHistory;
var List = AntdMobile.List;
var WingBlank = AntdMobile.WingBlank;
var Checkbox = AntdMobile.Checkbox;
var CheckboxItem = Checkbox.CheckboxItem;
var Modal = AntdMobile.Modal;
var Alert = Modal.alert;
require('./welfare.css');

var dottedJpg = require('./img/dotted.jpg');
var bannerPng = require('./img/banner.png');

module.exports = React.createClass({

    getInitialState:function(){
        cordova.funInCordova(function () {
            this.setTitle();
        }.bind(this));
        return{
            isCheck:true,
            isCheckHide:false,
            isReceive:false,   //是否领取
            isAlready:false,
            islimitFull:false,  //是否领取完
            isjoinedCircle:false,//是否加入圈子，
            isEnd: false,//活动是否结束
            activityId:'',//活动id
            liveId: this.props.location.state.result.liveId,//邀请人id
            type: this.props.location.state.result.type,
            receiveBtn: {
                txt: '',//按钮文字,
                fun: 0,//当前按钮状态，1-领取，2-跳转,0 不操作
            },
            result:[],
            circleName: '',//加入圈子的名称
            activityData:[]//活动数据，报名人数之类
        }
    },
    funIsCheck:function(event){
        if(this.state.isCheck){
            Alert('提醒！','只有加入该圈子才能参加领取福利，您确定取消申请加入该圈子么？',[{
                text: '确定', onPress: function(){
                    this.setState({
                        isCheck:!this.state.isCheck
                    })
                }.bind(this)
            },{
                text: '取消', onPress: function(){ console.log('11111') }.bind(this)
            }])
        }else{
            this.setState({
                isCheck:!this.state.isCheck
            })
        }

    },
    componentDidMount:function(){
        this.liveDetail();
    },
    setTitleColor: function () {

        try {

            $cordova.call({
                name: 'setNavigationBar', // 必传，插件名称
                params: { //  可为空，传参
                    'color': '#3B1BE3'
                }
            }, function (json) {}.bind(this))

        } catch (e) {
            //alert(e)
        }
    },
    setTitle:function(){
        try {

            $cordova.call({
                name: 'setTitle',
                params:{
                    'title':'网络推广会',
                    'color':'white'
                }
            }, function (json) {}.bind(this))

        } catch (e) {
            //alert(e)
        }
        this.setTitleColor();
    },
    upPostdata:function(){
        var info = '恭喜您，领取福利成功，请于'+Device.funsetStartTime(this.state.activityData.activity.startTime) +'准时参加';

        var str = this.state.activityData.creditStr;
        if(str && str.indexOf('抽奖') == -1){
            str = '领取' + this.state.activityData.creditStr;
        }else{
            str = '参与' + this.state.activityData.creditStr;
        }
        info = '恭喜您，领取福利成功，请于'+Device.funsetStartTime(this.state.activityData.activity.startTime)+' - '+ Device.funsetStartTime(this.state.activityData.activity.endTime) +'观看网络推广会。';

        Alert('领取成功',info,[
            {text: '确定', onPress: function(){
                var _state ={
                    isCheckHide:!this.state.isCheckHide,
                    isReceive:true,
                    isAlready:false
                };
                if(this.state.isCheck){
                    _state.iscircle=true
                }
                this.setState(_state);
                this.liveDetail();
            }.bind(this)
            },
        ])
    },
    //获取详情
    liveDetail:function(){
        this.getDetailData();
        return;
        Fetch({
            url:localStorage.getItem('circleHost')+'/activity/invitation/liveH5Detail/'+this.props.location.state.result.id+'?access_token='+localStorage.getItem('circleToken'),
            data:{},
            type:'GET'
        }).then(function(rpn){
            if(rpn){
                if(rpn.status ==1 && rpn.joinedCircle && rpn.received){
                    this.setTitle();
                    var _result={id:rpn.id};
                    History.replaceState({result:_result,type:0},'/info/');
                    return ;
                }
                if(rpn.received){
                    var _isCheckHide = !this.state.isCheckHide
                }
                this.setState({
                    result:rpn,
                    isAlready:rpn.received,
                    isjoinedCircle:rpn.joinedCircle,
                    isCheckHide:_isCheckHide,
                    islimitFull:rpn.limitFull,
                    isReceive:rpn.received
                });
                this.agreedBtnTxt();//重置领取福利按钮状态
            }


        }.bind(this))
    },

    //通过邀请人id 获取数据
    getDetailData: function(){
        var id = this.props.location.state.result.liveId;//邀请人id
        var url =localStorage.getItem('circleHost') +  '/activity/invitation/businessDetail/' + id +'?access_token='+localStorage.getItem('circleToken');
        Fetch({
            url:url,
            data:{},
            noDeal: true,
            type:'GET'
        }).then(function(rpn){
            if(rpn.resultCode===1){
                rpn = rpn.data;
                // if(rpn.status ==1 && rpn.joinedCircle && rpn.received){
                //     this.setTitle();
                //     var _result={id:rpn.id};
                //     History.replaceState({result:_result,type:2},'/info/');
                //     return ;
                // }
                if(rpn.haveReceived){
                    var _isCheckHide = !this.state.isCheckHide
                }

                var isEnd = true, nowTime = new Date().getTime();
                if((rpn.activity.endTime - 0) < nowTime){
                    isEnd = false;
                }

                var id = rpn.id;
                this.setState({
                    activityData:rpn,
                    activityId: id,
                    isAlready:rpn.haveReceived ,
                    isjoinedCircle:rpn.circleVOS && rpn.circleVOS.length >0 ? rpn.circleVOS[0].joined : true,
                    circleName:rpn.circleVOS && rpn.circleVOS.length >0 ? rpn.circleVOS[0].name : '',
                    isCheckHide:_isCheckHide,
                    islimitFull:rpn.limitFull,
                    isReceive:rpn.haveReceived,
                    isEnd: isEnd
                }, this.agreedBtnTxt);

            }else{
                alert(rpn.resultMsg);
            }

        }.bind(this))
    },

    // 领取
    agreedPost:function(){
        var nowTime = new Date().getTime();//当前时间

        //取消领取
        if(this.state.receiveBtn.fun == 0){
            return;
        }else if(this.state.receiveBtn.fun == 2){
            //跳转 -- 加入了圈子，则跳转
            if(this.state.isjoinedCircle){
                //如果活动还没未开始，弹框提示
                if(this.state.activityData && (this.state.activityData.activity.startTime - 0) > nowTime){
                    Alert('提醒！','还未到活动时间',[{
                        text: '确定', onPress: function(){

                        }.bind(this)
                    }]);
                    return;
                }
                $cordova.call({
                    name: 'toPromotionPage', // 必传，插件名称
                    // name: 'jumpDetailPage', // 必传，插件名称
                    params: { //  可为空，传参
                        'id': this.state.activityId,//'活动邀请id 和类型
                        'type': 'net'
                    }
                }, function (json) {}.bind(this))
            }
            return;
        }

        //判断版本 -- 显示弹窗，同时阻止后续操作
        if(this.compareVersion()){
            // this.isCompareModal();
            //版本升级
            try{
                $cordova.call({
                    name: 'updateApp',
                    params: {
                        info: '您当前的版本过低，为不影响您参加活动获取学币，请将医生圈升级至最新版本。',
                        downloadUrl:''
                    }
                },  function (json) {

                }.bind(this));
            }catch(e){

            }

            return;
        }
        Fetch({
            url:localStorage.getItem('circleHost')+'/activity/invitation/agreed/'+this.props.location.state.result.liveId+'?joinCircle='+this.state.isCheck+'&access_token='+localStorage.getItem('circleToken'),
            data:{},
            type:'POST',
        }).then(function(rpn){
            if(rpn){
                this.upPostdata();
                try{
                    $cordova.call({
                        name: 'activityStatusChanged', // 必传，插件名称
                        params: { //  可为空，传参
                            'id': this.state.activityId,//'活动邀请id 和类型
                            'type': 'net'
                        }
                    }, function (json) {}.bind(this))
                }catch(e){

                }
            }

        }.bind(this))

    },
    // 领取按钮 -- 文字， 状态 0 不操作 2 跳转 1 领取
    agreedBtnTxt: function(){
        var receiveBtn = {
            txt: '',
            fun: 0,//0 不操作 2 跳转 1 领取
        };

        if(this.state.activityData && this.state.activityData.status == 2){
            receiveBtn = {
                txt: '已参加',
                fun: '0'
            };
            this.setState({receiveBtn: receiveBtn});
            return '已参加';
        }

        //活动结束
        if(!this.state.isEnd){
            //已领取
            if(this.state.isReceive){
                receiveBtn = {
                    txt: '已参与',
                    fun: 0
                }
                this.setState({receiveBtn: receiveBtn});
                return '已参与'
                //未已领取
            }else{
                // if(this.state.activityData && this.state.activityData.activity.startTime > new Date().getTime()){
                //     receiveBtn = {
                //         txt: '未开始',
                //         fun: 0
                //     };
                //     this.setState({receiveBtn: receiveBtn});
                //     return '未开始'
                // }
                receiveBtn = {
                    txt: '已结束',
                    fun: 0
                };
                this.setState({receiveBtn: receiveBtn});
                return '已结束'
            }
        }
        //活动未结束
        else {
            //已领取
            if(this.state.isReceive){
                receiveBtn = {
                    txt: '观看推广会',
                    fun: 2//跳转
                };
                this.setState({receiveBtn: receiveBtn});
                return '观看推广会';
            }else{
                //福利领取完
                if(this.state.islimitFull){
                    receiveBtn = {
                        txt: '福利已领取完',
                        fun: 2 //跳转
                    };
                    this.setState({receiveBtn: receiveBtn});
                    return '福利已领取完';
                }
                receiveBtn = {
                    txt: '领取福利',
                    fun: 1//领取
                };
                this.setState({receiveBtn: receiveBtn});
                return '领取福利'
            }
        }
    },
    //加入圈子
    addCircle:function(){

        Fetch({
            url:localStorage.getItem('circleHost')+'/activity/invitation/apply/'+this.props.location.state.result.liveId+'?access_token='+localStorage.getItem('circleToken'),
            data:{},
            type:'POST'
        }).then(function(rpn){
            if(rpn){
                Alert('加入成功',null,[
                    {text: '确定', onPress: function(){
                        this.setState({
                            isjoinedCircle:!this.state.isjoinedCircle,
                            isCheck:true
                        })
                        this.liveDetail();
                    }.bind(this)}
                ])
            }
        }.bind(this))
    },
    //判断版本-- 1.7版本 旧版本返回true
    compareVersion: function(){
        var VS = localStorage.getItem('appVersion');
        var VS_array = VS.split('.');
        var DV = Device.discernDevice();
        var isOld_live = false;
        //版本判断
        if (VS_array[0] == 1) {
            if (VS_array[1] < 7) {
                isOld_live = true;// 1.7版本

            } else if (VS_array[1] == 7) {
                // ios
                if (DV.platform == 'iOS') {

                    if (VS_array[2] == undefined || VS_array[2] <= 0) {
                        isOld_live = true;
                    }

                    // Android
                } else if (DV.platform == 'Android') {

                    // 1.7 或 1.7.0 版本及以下
                    if (VS_array[2] == undefined || VS_array[2] <= 0) {
                        isOld_live = true;
                    }
                }

            } else if (VS_array[1] > 7) {}
        };

        return isOld_live;
    },
    //判断版本-- 弹窗
    isCompareModal: function(){
        Alert('升级提示',' 您当前的版本过低，为不影响您参加活动获取学币，请将医生圈升级至最新版本。',[
            {text: '暂不升级', onPress: function(){

            }.bind(this)},
            {
                text: '升级版本', onPress: function(){

            }.bind(this)
            }
        ]);
    },
    render:function(){
        var activityData = this.state.activityData;//活动信息
        return (
            <div className="scrollName">
                {this.state.result ?

                    <div style={styles.body} className="welfare_info">
                        <div style={styles.welfareBanner}>
                            <img style={styles.welfareBanner} src={bannerPng}/>
                        </div>
                        <WingBlank>
                            <List>
                                <div style={{marginTop: '20px'}}>
                                    <p style={styles.subTitle}>推广范围</p>
                                    <p style={styles.subContent}>{this.state.activityData && this.state.activityData.activity && this.state.activityData.activity.popularization}</p>
                                </div>
                                <div style={{marginTop: '20px'}}>
                                    <p style={styles.subTitle}>活动时间</p>
                                    <p>{ this.state.activityData.activity && (Device.formatTime(this.state.activityData.activity.startTime,'yyyy.MM.dd hh:mm') + ' - ' + Device.formatTime(this.state.activityData.activity.endTime, 'yyyy.MM.dd hh:mm'))}</p>
                                </div>
                                <div style={{marginTop: '20px', paddingBottom: '20px',borderTop: '1px solid #f5f5f5'}}>
                                    <p style={styles.subTitle}>活动人数<span className='fr'>{this.state.activityData.activity && this.state.activityData.activity.signed} 人</span></p>
                                </div>
                            </List>
                        </WingBlank>
                        <div style={this.state.receiveBtn.txt ? styles.welfare_check_btn: styles.hide} className="welfare_check_btn">
                            <div className="border-top-ddd welfareClass" style={{padding:  '0  .3rem'}}>
                                    <a className="welfare_check_box m-t-5" onClick={this.state.isCheck ? this.agreedPost:''} style={(this.state.receiveBtn.fun != 0 && this.state.isCheck) ? styles.welfare_check_btn:styles.welfare_check_hide}>{this.state.receiveBtn.txt}</a>
                                </div>
                        </div>
                    </div>

                    :''}
            </div>

        )
    }
})


var styles={
    fontNormal: {
        fontWeight: 'normal'
    },
    hide:{
        display:'none'
    },
    show:{
        display:'block'
    },
    body:{
        width:'100%',
        position: 'relative'
    },
    introduce_title:{
        fontSize: '16px',
        color: '#333',
        fontWeight: 'normal'
    },
    introduce_content:{
        fontSize: '14px',
        color: '#666',
        lineHeight: '14px',
        marginTop: '.2rem'
    },
    welfare_check_btn:{

    },
    welfare_check_hide:{
        background:'#ddd',

    },
    welfare_check_box:{

    },
    bgHide:{
        color:'#fff'
    },
    title:{
        fontSize:'18px',
        color: '#171717',
        fontWeight: '500'
    },
    welfareBanner:{
        width:'100%',
        maxWidth:'100%',
        // height:Device.clientHeight /4 +'px'
        // height: '160px'
    },
    borderLine:{
        height: '5px',
        background: 'url('+dottedJpg+') repeat left top',
        backgroundSize: 'contain',
        margin: '20px -.3rem 0'
    },
    circle_span_circlename: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        display: 'inline-block',
        textOverflow:'ellipsis',
        fontStyle: 'normal'
    },
    circle_span_circlenamePart:{
        width: '150px',
        display: 'inline-block',
        textAlign: 'right',
        fontStyle: 'normal',
        textOverflow:'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
    },
    introduce_block: {
        paddingBottom: '.4rem'
    },
    paddingBottomItem: {
        paddingBottom: '.4rem'
    },
    paddingBottomItem_lg: {
        paddingBottom: '3rem'
    },
    subTitle: {
        color: '#2a2a2a',
        fontSize: '15px',
        paddingTop: '5px'
    },
    subContent: {
        color: '#777',
        fontSize: '15px'
    }
};