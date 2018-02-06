
//微学堂

var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var AntdMobile = require('../../antdMobile/antdMobile.js');
var Device = require('../../device/device.js');
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
        var circleArr = [
            {
                name: '圈子A',
                id: 'aaa'
            },
            {
                name: '圈子B',
                id: 'bbb'
            },
            {
                name: '圈子C',
                id: 'ccc'
            },
            {
                name: '陈胜亮消化联盟',
                id: 'ddd'
            },
            {
                name: '陈胜亮消化联盟234',
                id: 'fff'
            }
        ];
        return{
            isCheck:true,
            isCheckHide:false,
            isReceive:false,   //是否领取
            isAlready:false,
            islimitFull:false,  //是否领取完
            isjoinedCircle:false,//是否加入圈子，
            isEnd: false,//活动是否结束
            type: this.props.location.state.result.type,
            circles: circleArr,//可加入的圈子总数
            choseCircle: circleArr[0],//选择的圈子，默认第一个
            receiveBtn: {
              txt: '领取福利',//按钮文字,
              fun: 0,//当前按钮状态，1-领取，2-跳转,0 不操作
            },
            result:{
                activity: true
            }
        }
    },
    funIsCheck:function(event){
        if(this.state.isCheck){
            Alert('提醒！','只有加入该圈子才能参加微学堂，领取微学堂福利，您确定取消申请加入该圈子么？',[{
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
    setTitle:function(){
        try {
            
            $cordova.call({
                    name: 'setTitle', // 必传，插件名称
                    params: { //  可为空，传参
                        'title':'微学堂福利',
                        'color':'white'
                    }
                }, function (json) {}.bind(this))

        } catch (e) {
            //alert(e)
        }
    }, 
    upPostdata:function(){
        var info = '恭喜您，领取福利成功，请于'+Device.funsetStartTime(this.state.result.startTime) +'准时参加微学堂';
        if(this.state.result.activity.rule.doctorCredit+this.state.result.activity.rule.thirdPartyFee !=0){

            info = '恭喜您，领取福利成功，请于'+Device.funsetStartTime(this.state.result.startTime) +'准时参加微学堂，答调查表可领取'+(this.state.result.activity.rule.doctorCredit+this.state.result.activity.rule.thirdPartyFee)+'学币！';

        }
        
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
                if(this.state.result.status==1 && this.state.result.joinedCircle){
                    this.setTitle();
                    var _result={id:this.state.result.id};
                    History.replaceState({result:_result,type:0},'/info/');
                }
                this.liveDetail();
            }.bind(this)
            },
        ])
    },
    //获取详情
    liveDetail:function(){
    
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
                },this.agreedBtnTxt);
                //重置领取福利按钮状态
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
                $cordova.call({
                    name: 'jumpDetailPage', // 必传，插件名称
                    params: { //  可为空，传参
                        'id': '',//'活动邀请id 和类型
                        'type': 'class'
                    }
                }, function (json) {}.bind(this))
            }
            return;
        }

        //判断版本 -- 显示弹窗，同时阻止后续操作
        if(this.compareVersion()){
            // this.isCompareModal();
            //版本升级
            $cordova.call({
                name: 'updateApp',
                params: {

                }
            },  function (json) {

            }.bind(this));
            return;
        }

        Fetch({
            url:localStorage.getItem('circleHost')+'/activity/invitation/agreed/'+this.props.location.state.result.liveId+'?joinCircle='+this.state.isCheck+'&access_token='+localStorage.getItem('circleToken'),
            data:{},
            type:'POST',
        }).then(function(rpn){
            if(rpn){
                this.upPostdata();
                //领取之后通知 app
                $cordova.call({
                    name: 'activityStatusChanged', // 必传，插件名称
                    params: { //  可为空，传参
                        'id': '',//'活动邀请id 和类型
                        'type': 'class'
                    }
                }, function (json) {}.bind(this))
            }
            
        }.bind(this))
        
    },
    // 领取按钮 -- 文字， 状态 0 不操作 2 跳转 1 领取
    agreedBtnTxt: function(){
        var receiveBtn = {
            txt: '',
            fun: 0,//0 不操作 2 跳转 1 领取
        };
        //活动结束
        if(this.state.isEnd){
            //已领取
            if(this.state.isReceive){
                receiveBtn = {
                    txt: '已参与',
                    fun: 0
                }
            //未已领取
            }else{
                receiveBtn = {
                    txt: '已结束',
                    fun: 0
                }
            }
        }
        //活动未结束
        else {
            //福利领取完
            if(this.state.islimitFull){
                receiveBtn = {
                    txt: '福利已领取完',
                    fun: 2 //跳转
                };
                this.setState({receiveBtn: receiveBtn});
                return '福利已领取完';
            }
            //已领取
            if(this.state.isReceive){
                receiveBtn = {
                    txt: '前往查看',
                    fun: 2//跳转
                };
                this.setState({receiveBtn: receiveBtn});
                return '前往查看';
            }else{
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
            url:localStorage.getItem('circleHost')+'/activity/invitation/apply/'+this.props.location.state.result.id+'?access_token='+localStorage.getItem('circleToken'),
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
        return true;
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

                    isOld_live =true;

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
    //选择圈子
    choseCircle: function(item){
        this.setState({choseCircle: item})
    },
    render:function(){
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
                                <p style={styles.title}>{this.state.result.subject || '标题'}</p>
                                <div className="clear welfareClass-speakerBlock">
                                    <div className="welfareClass-speakerPic fl" style={{marginRight: '5px'}}>
                                        <img src="" alt="" />
                                    </div>
                                    <div className="welfareClass-speakerInfo fl">
                                        <p>{this.state.result.speakerInfo} | 内科 | 主治医生</p>
                                        <p>深圳市南山医院</p>
                                        <p>{Device.setAllTime(this.state.result.startTime,this.state.result.endTime)}</p>
                                    </div>
                                </div>
                                <p className="p-tb-md color-666">报名人数 <span className="fr">342 人</span></p>
                            </div>
                            <div className="welfareClass-circle welfareClass-t-b-border">
                                <p className="p-tb-md color-666">听课范围<span className="fr"><i style={styles.circle_span_circlenamePart}>陈胜亮消化联盟陈胜亮消化联盟陈胜亮消化联盟陈胜亮消化联盟</i><i style={styles.circle_span_circlename}>等4个圈子</i></span></p>
                            </div>
                            <div className="welfare_item_introduce">
                                <div style={styles.paddingBottomItem}>
                                    <strong style={styles.introduce_title}>课程简介</strong>
                                    <p style={styles.introduce_content} dangerouslySetInnerHTML={{__html:Device.Transformation(this.state.result.plan || '暂无简介')}}></p>
                                </div>
                                <div style={styles.borderLine}></div>
                            </div>
                            <div className="welfare_item" style={styles.paddingBottomItem_lg}>
                                {this.state.result.activity ?

                                    <div>
                                        <p className="welfare-baseInfo">剩余名额：<strong className="font-normal welfare-red">{(Number(this.state.result.activity.limit)-Number(this.state.result.activity.signed)) >=0 ?(Number(this.state.result.activity.limit)-Number(this.state.result.activity.signed)) :0}</strong></p>
                                        <p className="welfare-baseInfo">已&nbsp;报&nbsp;&nbsp;名：<strong className="font-normal">{this.state.result.activity.signed}</strong></p>
                                        <p className="welfare-baseInfo">邀&nbsp;请&nbsp;&nbsp;人：<strong className="font-normal">{this.state.result.signedAgent ? this.state.result.inviterName +'医药代表已经代您报名成功': this.state.result.inviterName}</strong></p>
                                        <p className="welfare-baseInfo">活动介绍：<strong className="font-normal">{this.state.result.activity.introduction || '暂无介绍'}</strong></p>
                                    </div>
                                    :''}
                            </div>
                        </List>
                    </WingBlank>
                    <div style={styles.welfare_check_btn} className="welfare_check_btn">

                        {
                            (<div className="border-top-ddd welfareClass">
                                <div style={this.state.isjoinedCircle ? styles.hide:styles.show}>
                                    <div className="circle-block-wrap">
                                        <div className="circle-block">
                                            {this.state.circles.map( function(item, index){
                                                if(item.id === this.state.choseCircle.id){
                                                    return (<span className="circle-item circle-chose">{item.name}</span>);
                                                }
                                                return (<span className="circle-item" onClick={this.choseCircle.bind(this,item)}>{item.name}</span>);
                                            }.bind(this))}
                                        </div>
                                    </div>
                                    <List>
                                        <CheckboxItem className="check_point" defaultChecked checked={this.state.isCheck} onChange={this.funIsCheck}>同时申请加入该圈子</CheckboxItem>
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
        height:Device.clientHeight /4 +'px'
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
    }
};