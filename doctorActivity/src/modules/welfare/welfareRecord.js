
//录播

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
            activityId:'',//活动id
            isEnd: false,//活动是否结束 true 未结束 false 结束
            liveId: this.props.location.state.result.liveId,//邀请人id
            type: this.props.location.state.result.type,
            receiveBtn: {
                txt: '',//按钮文字,
                fun: 0,//当前按钮状态，1-领取，2-跳转,0 不操作
            },
            result:[],
            circleName:'',//加入圈子的名称
            activityData:[]//活动数据，报名人数之类
        }
    },
    funIsCheck:function(event){
        if(this.state.isCheck){
            Alert('提醒！','只有加入该圈子才能观看录播，领取录播福利，您确定取消申请加入该圈子么？',[{
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
        if(!window.$cordova){
            cordova.funInCordova()
        }
    },
    setTitle:function(){
        try {
            
            $cordova.call({
                    name: 'setTitle', // 必传，插件名称
                    params: { //  可为空，传参
                        'title':'录播福利',
                        'color':'white'
                    }
                }, function (json) {}.bind(this))

        } catch (e) {
            //alert(e)
        }
    }, 
    upPostdata:function(){
        var info = '恭喜您，领取福利成功，请于'+Device.funsetStartTime(this.state.result.startTime) +'准时观看录播';

        var str = this.state.activityData.creditStr;
        if(str && str.indexOf('抽奖') == -1){
            str = '领取' + this.state.activityData.creditStr;
        }else{
            str = '参与' + this.state.activityData.creditStr;
        }
        info = '恭喜您，领取福利成功，请于'+Device.formatTime(this.state.activityData.activity.startTime, 'yyyy.MM.dd hh:mm:ss') +'观看录播，答调查表可' + str;

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
                if(this.state.isEnd && this.state.isjoinedCircle){
                    this.setTitle();
                    var _result={id:this.state.result.id};
                    History.replaceState({result:_result,type:1},'/info/');
                }
                this.liveDetail();
            }.bind(this)
            },
        ])
    },
    //获取详情
    liveDetail:function(){
        this.getDetailData();
        return;
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

                var isEnd = true, nowTime = new Date().getTime();
                if((rpn.activity.endTime - 0) < nowTime){
                    isEnd = false;
                }
                // if(isEnd && rpn.circleVOS && (rpn.circleVOS.length >0 && rpn.circleVOS[0].joined || true) && rpn.haveReceived){
                //     this.setTitle();
                //     var _result={id:rpn.id};
                //     History.replaceState({result:_result,type:1},'/info/');
                //     return ;
                // }
                if(rpn.haveReceived){
                    var _isCheckHide = !this.state.isCheckHide
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
                this.getUpLiveData(id);//通过活动id 获取详情
            }else{
                alert(rpn.resultMsg);
            }

        }.bind(this))
    },
    //获取详情
    getUpLiveData:function(id){
        var url = '';
        url = localStorage.getItem('circleHost') + '/live/h5/vedio/nologin/detail';
        Fetch({
            url:url+'/'+ id,
            data:{},
            noDeal: true,
            type:'GET'
        }).then(function(rpn){
            if(rpn.resultCode===1){
                this.setState({
                    result:rpn.data,
                })
            }else{
                alert(rpn.resultMsg);
            }

        }.bind(this))
    },
    // 领取
    agreedPost:function(){
        //取消领取
        if(this.state.receiveBtn.fun == 0){
            return;
        }else if(this.state.receiveBtn.fun == 2){
            //跳转 -- 加入了圈子，则跳转
            if(this.state.isjoinedCircle){
                var _result={id:this.state.result.id};
                History.replaceState({result:_result,type:1},'/info/');
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
                        downloadUrl: '',
                        info: '您当前的版本过低，为不影响您参加活动获取学币，请将医生圈升级至最新版本。'
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
                            'type': 'record'
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

        if(this.state.activityData && this.state.activityData.status == 3){
            receiveBtn = {
                txt: '已结束',
                fun: '0'
            };
            this.setState({receiveBtn: receiveBtn});
            return '已结束';
        }

        if(this.state.activityData && this.state.activityData.status == 1){
            if(this.state.isReceive) {
                if (!this.state.isjoinedCircle) {
                    receiveBtn = {
                        txt: '待审核',
                        fun: '0'
                    };
                    this.setState({receiveBtn: receiveBtn});
                    return '待审核';
                }else{
                    receiveBtn = {
                        txt: '前往答题',
                        fun: '2'
                    };
                    this.setState({receiveBtn: receiveBtn});
                    return '前往答题';
                }
            }else{
                receiveBtn = {
                    txt: '领取福利',
                    fun: '1'
                };
                this.setState({receiveBtn: receiveBtn});
                return '领取福利';
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
    //判断开始或结束
    compareIsStart: function(start, end){
        var nowData = new Date().getTime;
        //未开始
        if(nowData < (start - 0)){
            return 1;
        }
        if(nowData > (end - 0)){
            return 2;
        }
        return 0;

    },
    getTime: function(time, format){
        return  Device.formatTime(time,format) || '';
    },
    render:function(){

        var activityData = this.state.activityData;//活动信息

        return (
            <div className="scrollName">
                {this.state.result ?  
                    
                    <div style={styles.body} className="welfare_info">
                    <div style={styles.welfareBanner}>
                        <img style={styles.welfareBanner} src={this.state.result.coverUrl}/>
                    </div>
                    <WingBlank>
                        <List>
                            <div>
                                <p style={styles.title}>{this.state.result.subject}</p>
                                <p>演讲人：{this.state.result.speakerInfo}</p>
                                <p>来<span style={styles.bgHide}>人</span>源：{this.state.result.circleName}</p>
                                {/*<p>时<span style={styles.bgHide}>人</span>间：{Device.setAllTime(this.state.result.startTime,this.state.result.endTime)}</p>*/}
                                <p>时<span style={styles.bgHide}>人</span>间：{this.getTime.call(this,this.state.result.startTime, 'yyyy.MM.dd hh:mm:ss' )} - {this.getTime.call(this,this.state.result.endTime, 'yyyy.MM.dd hh:mm:ss' )} </p>
                            </div>
                            <div style={styles.borderLine}></div>
                            <div className="welfare_item">
                                {activityData && activityData.activity?
                                
                                <div>
                                    {
                                        (activityData.activity && activityData.activity.limit) ? (
                                            <div>
                                                <p className="welfare-baseInfo">剩余名额：<strong className="font-normal welfare-red">{(Number(activityData.activity.limit)-Number(activityData.activity.signed)) >=0 ?(Number(activityData.activity.limit)-Number(activityData.activity.signed)) :0}</strong></p>
                                                <p className="welfare-baseInfo">已&nbsp;报&nbsp;&nbsp;名：<strong className="font-normal">{activityData.activity.signed}</strong></p>
                                                {
                                                    activityData.inviterName ? (<p className="welfare-baseInfo">邀&nbsp;请&nbsp;&nbsp;人：<strong className="font-normal">{activityData.inviterName}</strong></p>): ''
                                                }

                                            </div>
                                        ): ''
                                    }
                                    <p className="welfare-baseInfo"><span>活动时间：</span><strong className="font-normal">{Device.formatTime(activityData.activity.startTime,'yyyy.MM.dd hh:mm')} - {Device.formatTime(activityData.activity.endTime, 'yyyy.MM.dd hh:mm')}</strong></p>
                                    {
                                        (activityData.activity.rule && activityData.activity.rule.commentField) ? (<p className="welfare-baseInfo">指定评论：<strong className="font-normal">{activityData.activity.rule.commentField}</strong></p>): ''
                                    }
                                    <p className="welfare-baseInfo clear">报名简介：<strong className="font-normal" dangerouslySetInnerHTML={{__html:Device.Transformation(activityData.activity.aidIntroduction || '-')}}></strong></p>
                                </div>    
                                :''}


                                <p style={styles.checkWelfare}>
                                    <img style={styles.checkImg} src={require('../liveActivity/img/tips.png')}/>
                                    <span>
                                        {(this.state.isReceive || this.state.isAlready) && activityData.activity.rule && (activityData.activity.rule.doctorCredit+activityData.activity.rule.thirdPartyFee)!=0  ?'观看录播，答调查表可领取'+(activityData.activity.rule.doctorCredit+activityData.activity.rule.thirdPartyFee)+'学币' : '在活动时间中，可通过点击圈子主页中的录播选项，观看录播.'}
                                    </span>
                                </p>
                                <div style={styles.borderLine}></div>
                            </div>

                            <div className="welfare_item_introduce welfare_item">
                                <div>
                                    <strong style={styles.introduce_title}>录播简介</strong>
                                    <p style={styles.introduce_content} dangerouslySetInnerHTML={{__html:Device.Transformation(this.state.result.plan)}}></p>
                                </div>
                                <div style={{padding:'.3rem 0 2rem 0'}}>
                                    <strong style={styles.introduce_title}>议程描述</strong>
                                    <p style={styles.introduce_content} dangerouslySetInnerHTML={{__html:Device.Transformation(this.state.result.description)}}></p>
                                </div>
                            </div>
                        </List>
                    </WingBlank>
                    <div style={this.state.receiveBtn.txt ? styles.welfare_check_btn: styles.hide} className="welfare_check_btn welfareClass border-top-ddd">

                        {
                            (<div style={{padding:  '0  .3rem'}}>
                                <div style={(this.state.isjoinedCircle || this.state.isReceive || (this.state.receiveBtn.fun == 0))  ? styles.hide:styles.show}>
                                    <List>
                                        <CheckboxItem className="check_point" defaultChecked checked={this.state.isCheck} onChange={this.funIsCheck}>同时申请加入该圈子<span style={{fontSize: '12px'}}>{this.state.circleName ? '(' + this.state.circleName + ')': ''}</span></CheckboxItem>
                                    </List>
                                </div>
                                <a className="welfare_check_box m-t-5" onClick={this.state.isCheck ? this.agreedPost:''} style={(this.state.receiveBtn.fun != 0 && this.state.isCheck) ? styles.welfare_check_btn:styles.welfare_check_hide}>{this.state.receiveBtn.txt}</a>
                            </div>)
                        }
                    </div>
                </div> 
                         
                :''}
            </div>
           
        )
    }
})


var styles={
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
        fontSize: '15px',
        color: '#999',
        fontWeight: 'normal'
    },
    introduce_content:{
      fontSize: '15px',
      color: '#171717'
    },
    welfare_check_btn:{
       
    },
    welfare_check_hide:{
        background:'#ddd',

    },
    welfare_check_box:{

    },
    welfare_Btn:{
        fontSize: '14px',
        color: '#4BA7F7',
        display: 'inline-block',
        border: '1px solid',
        padding: '5px 15px',
        borderRadius: '15px',
        background: '#F7FBFF',
    },
    bgHide:{
        color:'#fff'
    },
    checkImg:{
        paddingRight:'3px'
    },
    title:{
        fontSize:'23px',
        color: '#171717',
        fontWeight: '500'
    },
    welfareBanner:{
        width:'100%',
        maxWidth:'100%',
        height:Device.clientHeight /3 +'px'
    },
    checkWelfare:{
        color:' #F85D5D',
        paddingTop:'.2rem',
        fontSize: '15px'
    },
    borderLine:{
        height: '5px',
        background: 'url('+dottedJpg+') repeat left top',
        backgroundSize: 'contain',
        margin: '20px -.3rem 0'
    }
}