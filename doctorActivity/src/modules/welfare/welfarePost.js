
//广告文章
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
            isEnd: false,//活动是否结束
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
            Alert('提醒！','只有加入该圈子才能参与评论，领取福利，您确定取消申请加入该圈子么？',[{
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
        if(!window.$cordova){
            cordova.funInCordova()
        }
        this.liveDetail();
    },
    setTitle:function(){
        try {

            $cordova.call({
                name: 'setTitle', // 必传，插件名称
                params: { //  可为空，传参
                    'title':'帖子',
                    'color':'white'
                }
            }, function (json) {}.bind(this))

        } catch (e) {
            //alert(e)
        }
    },
    upPostdata:function(){
        var info = '恭喜您，领取福利成功，请于'+Device.funsetStartTime(this.state.result.startTime) +'参与评论';

        var str = this.state.activityData.creditStr;
        if(str && str.indexOf('抽奖') == -1){
            str = '领取' + this.state.activityData.creditStr;
        }else{
            str = '参与' + this.state.activityData.creditStr;
        }
        info = '恭喜您，领取福利成功，请于'+Device.formatTime(this.state.activityData.activity.startTime, 'yyyy.MM.dd hh:mm:ss')+' - '+Device.formatTime(this.state.activityData.activity.endTime, 'yyyy.MM.dd hh:mm:ss') +'参与评论，可' + str;

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
                this.setTitle();
                this.setState(_state);
                // if(this.state.isEnd==1 && this.state.result.joinedCircle){
                //     this.setTitle();
                //     var _result={id:this.state.result.id};
                //     History.replaceState({result:_result,type:0},'/info/');
                // }
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
                this.setTitle();
                // if(rpn.status ==1 && rpn.joinedCircle && rpn.received){
                //     this.setTitle();
                //     var _result={id:rpn.id};
                //     History.replaceState({result:_result,type:0},'/info/');
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

                this.getUpLiveData(id);//通过活动id 获取详情
            }else{
                Alert('提示',rpn.resultMsg, [
                    {text: '确定', onPress: function(){
                    }.bind(this)
                    },
                ]);
            }

        }.bind(this))
    },
    //获取详情
    getUpLiveData:function(id){
        var url = '';
        url = localStorage.getItem('circleHost') + '/faq/nologin/activity/question/';
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
                Alert('提示',rpn.resultMsg, [
                    {text: '确定', onPress: function(){
                    }.bind(this)
                    },
                ]);
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

            }
            //领取之后通知 app
            try{
                $cordova.call({
                    name: 'jumpDetailPage', // 必传，插件名称
                    params: { //  可为空，传参
                        'id': this.state.activityId,//'活动邀请id 和类型
                        'type': 'post'
                    }
                }, function (json) {}.bind(this))
            }catch(e){

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

        var url = localStorage.getItem('circleHost')+'/activity/invitation/agreed/'+this.props.location.state.result.liveId+'?&access_token='+localStorage.getItem('circleToken');
        //如果加入按钮未隐藏
        if( !this.state.isCheckHide){
            url += '&joinCircle=' + this.state.isCheck;
        }

        Fetch({
            url:url,
            data:{},
            type:'POST',
        }).then(function(rpn){
            if(rpn){
                this.upPostdata();
                //领取之后通知 app
                try{
                    $cordova.call({
                        name: 'activityStatusChanged', // 必传，插件名称
                        params: { //  可为空，传参
                            'id': this.state.activityId,//'活动邀请id 和类型
                            'type': 'post'
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
                        txt: '前往查看',
                        fun: '2'
                    };
                    this.setState({receiveBtn: receiveBtn});
                    return '前往查看';
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
    render:function(){

        var identify = false,//是否是个人
            data,
            content;

        if(this.state.result && this.state.result.author && this.state.result.author.user){
            identify = true;
            data = this.state.result.author.user;
            var headpic = data.headPicFileName;
            content = this.state.result.content;
        }

        if(this.state.result && this.state.result.author && this.state.result.author.deptVO){
            data = this.state.result.author.deptVO;
            var headpic = data.logoUrl;
            content = this.state.result.content;
        }

        var activityData = this.state.activityData;//活动信息

        return (
            <div className="scrollName" style={{background: '#fff',minHeight: '100%'}}>
                {this.state.result ?

                    <div style={styles.body} className="welfare_info">
                        <WingBlank>
                            <List>
                                <div style={{paddingTop: '10px'}}>
                                    <div className="clear">
                                        <div className="fl" style={styles.headerPic}>
                                            <img src={headpic} alt="" style={styles.headerPic}/>
                                        </div>
                                        <div className="fl">
                                            {
                                                !identify ?
                                                    (
                                                        /*圈子身份*/
                                                        <div style={styles.headerTitle}>{(data && content) ? this.state.result.author.deptVO.showName:this.state.result && this.state.result.title}</div>
                                                    ):
                                                    (
                                                        /*个人身份*/
                                                        <div>
                                                            <div style={styles.headerTitleO}>{data.name} - {data.doctor.departments} - {data.doctor.title}</div>
                                                            <div style={styles.headerTitleT}>{data.doctor.hospital}</div>
                                                        </div>
                                                    )
                                            }
                                        </div>
                                    </div>
                                    <div style={styles.borderLine}></div>
                                    <div className="welfare_item">
                                        {activityData && activityData.activity?

                                            <div>
                                                {
                                                    (activityData.activity && activityData.activity.limit) ?(
                                                        <div>
                                                            <p className="welfare-baseInfo">剩余名额：<strong className="font-normal welfare-red">{(Number(activityData.activity.limit)-Number(activityData.activity.signed)) >=0 ?(Number(activityData.activity.limit)-Number(activityData.activity.signed)) :0}</strong></p>
                                                            <p className="welfare-baseInfo">已&nbsp;报&nbsp;&nbsp;名：<strong className="font-normal">{activityData.activity.signed}</strong></p>
                                                            {
                                                                activityData.inviterName ? (<p className="welfare-baseInfo">邀&nbsp;请&nbsp;&nbsp;人：<strong className="font-normal">{activityData.inviterName}</strong></p>): ''
                                                            }
                                                        </div>
                                                    ): ''
                                                }
                                                <p className="welfare-baseInfo">活动时间：<strong className="font-normal">{Device.formatTime(activityData.activity.startTime,'yyyy.MM.dd hh:mm')} - {Device.formatTime(activityData.activity.endTime, 'yyyy.MM.dd hh:mm')}</strong></p>
                                                {
                                                    (activityData.activity.rule && activityData.activity.rule.commentField) ? (<p className="welfare-baseInfo">指定评论：<strong className="font-normal" >{activityData.activity.rule.commentField}</strong></p>): ''
                                                }
                                                <p className="welfare-baseInfo clear">活动介绍：<strong className="font-normal " dangerouslySetInnerHTML={{__html:Device.Transformation(activityData.activity.aidIntroduction || '-')}}></strong></p>
                                            </div>
                                            :''}
                                    </div>
                                    <div style={styles.borderLine}></div>
                                    <div style={styles.baseInfo1}>
                                        {
                                            (content && content.commonCard && content.type == '4') ? (
                                                <div style={{fontSize: '16px', color: '#4BA7F7'}}>
                                                    {this.state.result.labelName || '#直播LIVE分享#'}
                                                </div>
                                            ): ''
                                        }
                                        {
                                            this.state.result.content && this.state.result.content.mainBody ? (<p style={styles.baseContent} dangerouslySetInnerHTML={{__html:Device.Transformation(this.state.result.content.mainBody)}}></p>): ''
                                        }
                                        {
                                            (content && content.show && content.coverUrl) ? (<img src={content.coverUrl} alt="" style={{width: '100%'}}/>) : ''
                                        }
                                        {
                                            content && content.pics ? (
                                                content.pics.map( function(item){
                                                    return <img src={item} alt="" style={{width:'100%'}}/>
                                                })
                                            ): ''
                                        }
                                        {
                                            (content && content.commonCard && content.type == '4') ? (
                                                <div style={{background:'#f5f5f5',padding: '10px', margin: '10px 0'}}>
                                                    <img src={content.coverUrl} alt="" style={{maxWidth: '100px',verticalAlign: 'middle'}}/>
                                                    <a style={styles.shareUrlTxt} >{content.summary}</a>
                                                </div>
                                            ): (<span >{content && content.summary}</span>)
                                        }
                                        {
                                            content && content.articleUrl ? (
                                                <div style={{background:'#f5f5f5',padding: '10px', margin: '10px 0'}}>
                                                    <img src={content.articleIcon} alt="" style={{maxWidth: '100px', verticalAlign: 'middle'}}/>
                                                    {/*<a style={styles.shareUrlTxt} href={content.articleUrl}>{content.articleTitle}</a>*/}
                                                    <a style={styles.shareUrlTxt} >{content.articleTitle}</a>
                                                </div>
                                            ): ''
                                        }

                                    </div>
                                    <div>
                                        {
                                            content && content.supplements ? (
                                                content.supplements.map( function(item){
                                                    if(item.type == 1){
                                                        return (<video src={item.url} controls="controls"  style={{width:'100%'}} controlsList="nodownload" poster={item.firstFrame}></video>)
                                                    }
                                                    if(item.type == 2){
                                                        return (<audio src={item.url} controls="controls" controlsList="nodownload"></audio>)
                                                    }
                                                })
                                            ):''
                                        }
                                    </div>
                                    <span style={styles.footerTime}>{Device.formatTime(this.state.result.topicPostTime , 'yyyy-MM-dd hh:mm')}</span>
                                    <div style={{height: '100px'}}></div>
                                </div>
                            </List>
                        </WingBlank>
                        <div style={this.state.receiveBtn.txt ? styles.welfare_check_btn: styles.hide} className="welfare_check_btn welfareClass border-top-ddd">

                            {
                                (<div style={{padding:  '0  .3rem'}}>
                                    {/*个人身份不需要加圈子*/}
                                    <div style={(this.state.isjoinedCircle || this.state.isReceive || (this.state.receiveBtn.fun == 0))? styles.hide:styles.show}>
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
    },
    headerPic: {
        maxWidth: '40px',
        width: '40px',
        maxHeight: '40px',
        borderRadius: '50%',
        border: '1px solid #ECEFF2'
    },
    headerTitle: {
        lineHeight: '40px',
        height: '40px',
        fontSize: '14px',
        color: '#333',
        marginLeft: '10px',
        width: Device.clientWidth / 3 * 2 +'px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    headerTitleO: {
        fontSize: '14px',
        height: '22px',
        lineHeight: '22px',
        color: '#333',
        marginLeft: '10px',
        marginTop: '2px'
    },
    headerTitleT: {
        fontSize: '12px',
        color: '#aaa',
        height: '14px',
        lineHeight: '14px',
        marginLeft: '10px'
    },
    baseContent: {
        marginTop: '10px'
    },
    footerTime: {
        fontSize: '12px',
        color: '#aaa',
        lineHeight: '12px',
        marginRight: '10px',
        marginTop: '10px',
        display: 'block',
        marginBottom: '5px'
    },
    baseInfo1: {
        marginTop:'10px',
    },
    shareUrlTxt: {
        width: Device.clientWidth / 5 *2 +'px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        display:'inline-block',
        color: '#333',
        marginLeft: '10px',
        fontSize: '14px',
        verticalAlign: 'middle'
    }

}