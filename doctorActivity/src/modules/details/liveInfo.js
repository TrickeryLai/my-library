var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var AntdMobile = require('./../../antdMobile/antdMobile.js');
var LiveBtn = require('./liveBtn');
var SignupBtn = require('./signup.js');
var Feach = require('./../../fetch/fetch.js');
var Dever = require('./../../device/device.js');
var cordova = require('../initJSBridge.js');
var Modal = AntdMobile.Modal;
var Alert = Modal.alert;
var history = ReactRouter.hashHistory;
var List = AntdMobile.List;
var WingBlank = AntdMobile.WingBlank;

module.exports = React.createClass({
    getInitialState:function(){
        cordova.funInCordova(function(){
            if(this.props.location.state.type==0){

                this.setTitle('直播详情');

            }else{

                this.setTitle('视频详情');
            }
        }.bind(this));

        return{
            result:[],
            modal:false,
            userList:[],
            isActivity:false
        }
    },
    componentDidMount:function(){
        if(!window.$cordova){
            cordova.funInCordova()
        }
        if(this.props.location.state.type==0){
                
            this.getLiveinfo();
           
        }else{
            
            this.getVideoinfo();
        }
    },
    componentWillUnmount:function(){
        this.setTitle(' ');
        if(this.props.location.state.type ==0){
            this.setLiveShareButton(this.state.result,false);
        }else{
            this.setVideoButton(this.state.result,false);
        }   
        
    },
    getLiveinfo:function(){
        var id = this.props.location.state.result.id;
        
        Feach({
            data:[],
            url:localStorage.getItem('circleHost')+'/live/living/detail/'+id+'?access_token='+localStorage.getItem('circleToken'),
            noDeal: true,
            type:'GET'
        }).then(function(rpn){
            if (rpn.resultCode === 1) {
                this.setState({
                    result:rpn.data,
                });
                this.setLiveShareButton(rpn.data,true);
            }else{
                alert(rpn.resultMsg)
            }
        }.bind(this))
        this.setTitle('直播详情');
    },
    getVideoinfo:function(){
        var id = this.props.location.state.result.id
        Feach({
            data:[],
            url:localStorage.getItem('circleHost')+'/live/vedio/detail/'+id+'?access_token='+localStorage.getItem('circleToken'),
            noDeal: true,
            type:'GET'
        }).then(function(rpn){
            if (rpn.resultCode === 1) {
                this.setState({
                    result:rpn.data
                })
                this.setVideoButton(rpn.data,true);
            }else{
                alert(rpn.resultMsg)
            }
        }.bind(this));
        this.setTitle('视频详情');
    },
    setTitle:function(_info){
        try {
            $cordova.call({
                name: 'setTitle', // 必传，插件名称
                params: { //  可为空，传参
                    'title':_info,
                    'color': 'white'
                }
            }, function(json) { //可为空，回调函数和回调参数，回调参数已经从json转为Object
                
                })
        } catch (error) {
            
        }
    },
    goTolives:function(_row,_type){
        //history.pushState({rId:_row.rId,pass:_row.password},'/padlive/')
        var hostIp='v.mediportal.cn';
        
        
        var agent = navigator.userAgent.toLowerCase();
        if(_type == 0){
            history.pushState({url:_row.attendeeJoinUrl,pass:_row.attendeeToken,status:0},'/video/')
        }else{
            if(_row.url.indexOf('demokzyy') >-1){
                hostIp='demokzyy.gensee.com';
            }
            if(agent.indexOf('x10') > -1){
                history.pushState({rId:_row.rId,pass:_row.password,url:hostIp},'/padlive/')
            }else{
                history.pushState({url:_row.url,pass:_row.password,status:1},'/video/')
            }
        }
        
    },
    gotoAndroid:function(_data,_status){
        var hostIp='v.mediportal.cn';
        var VS = localStorage.getItem('appVersion');
        var VS_array = VS.split('.');
        var isOld_live = false;
        var isOld_video = false;
        var DV = Dever.discernDevice();
        // if(_status ==0  && _data.relateActivityCnt && _data.relateActivityCnt!=0){
        //     this.getSeeLive(_data);
            
        // };
        //直播兼容版本判断
        if (VS_array[0] == 1 && _status ==0) {
            if (VS_array[1] < 4) {
                isOld_live = true;// 1.4版本
                
            } else if (VS_array[1] == 4) {
                // ios
                if (DV.platform == 'iOS') {

                    isOld_live =true;
                    
                    // Android
                } else if (DV.platform == 'Android') {

                    // 1.4 或 1.4.0 版本及以下
                    if (VS_array[2] == undefined || VS_array[2] <= 0) {
                        isOld_live = true;
                    }
                }

            } else if (VS_array[1] > 4) {}
        };
        //录播兼容版本判断（iOS、Android 版本刚好同步）
        if(VS_array[0] == 1 && _status ==1){ //1.0版本
            if (DV.platform == 'iOS'){
                if (VS_array[1] < 6) {
                    isOld_video = true;// 1.6版本以下
                }
                if (VS_array[1] == 6) {
                    if(VS_array[2] == undefined || VS_array[2] <= 1){
                        isOld_video = true;// 1.6.1版本以下
                    }
                }
            }
            if (DV.platform == 'Android'){
                if (VS_array[1] < 6) {
                    isOld_video = true;// 1.6版本以下
                }
                if (VS_array[1] == 6) {
                    if(VS_array[2] == undefined || VS_array[2] <= 1){
                        isOld_video = true;// 1.6.1版本以下
                    }
                }
            }
        }
        if(isOld_live || isOld_video){
            this.goTolives(_data,_status);
        }else{
            if(_status == 0){
                if(_data.attendeeJoinUrl.indexOf('demokzyy') >-1){
                    hostIp='demokzyy.gensee.com';
                }
                try {
                    $cordova.call({
                        name: 'toLiveRoom', // 跳转原生直播
                        params: { //  可为空，传参
                            'hostIp':hostIp,
                            'roomNum': _data.number ,
                            'nickName':localStorage.getItem('liveName'),
                            'joinPsw':_status==0 ? _data.attendeeToken : _data.password,
                            'liveId':_data.webcastId,
                            'id':_data.id ||'',
                            'status':_data.status
                    
                        }
                    }, function(json) { //可为空，回调函数和回调参数，回调参数已经从json转为Object
                        if (json && json.data) {                   
                                
                        } else {
                            alert('跳转安卓直播回调失败')
                        }
                    }.bind(this))
                } catch (error) {
                    this.goTolives(_data,_status);
                }
            }else{
                if(_data.url.indexOf('demokzyy') >-1){
                    hostIp='demokzyy.gensee.com';
                }
                try {
                    $cordova.call({
                        name: 'toVideoRoom', // 跳转原生录播
                        params: { //  可为空，传参
                            'hostIp':hostIp,
                            'id':_data.id,
                            'nickName':localStorage.getItem('liveName'),
                            'joinPsw':_status==0 ? _data.attendeeToken : _data.password,
                            'speakerInfo':_data.speakerInfo,
                            'description':_data.description,
                            'plan':_data.plan,
                            'subject':_data.subject,
                            'recordStartTime':_data.recordStartTime,
                            'recordEndTime':_data.recordEndTime,
                            'circleName':_data.circleName,
                            'liveId':_data.rId,
                        }
                    }, function(json) { //可为空，回调函数和回调参数，回调参数已经从json转为Object
                        if (json && json.data) {

                        } else {
                            alert('跳转安卓录播回调失败');
                        }
                    }.bind(this))
                } catch (error) {
                    this.goTolives(_data,_status);
                }
            }
        } 
    },
    setVideoButton:function(_data,_status){
        // 视频推荐
        var names='setVideoRecommendButton';  //推荐
        if(_data.userCircleRole==3 || _data.userCircleRole=='' || _data.userCircleRole==null){
            names='setVideoShareButton';   //分享助手
        }
        if(this.props.location.state.type == 0){
            var url = 'doctorActivity/web/#/routerurl/shareLogin?type=0&id=';
            var medUrl = 'drugorg/web/h5/boutiqueDoctor/index.html#/activityApplyShare?url=https://testapi.mediportal.com.cn/doctorActivity/web/#/routerurl/detailLogin?type=1&id=';
        }else{
            var url = 'doctorActivity/web/#/routerurl/shareLogin?type=1&id=';
            var medUrl = 'drugorg/web/h5/boutiqueDoctor/index.html#/activityApplyShare?url=https://testapi.mediportal.com.cn/doctorActivity/web/#/routerurl/detailLogin?type=2&id='
        }
        try {

            $cordova.call({
                name: names, // 必传，插件名称
                params: { //  可为空，传参
                    id:_data.id ||'',
                    title:_data.subject,
                    shouldShow:_status, //是否显示
                    coverUrl:_data.coverUrl,
                    speakerInfo:_data.speakerInfo,
                    description:_data.description,
                    addressUrl:'doctororg/web/phone/?#/info/'+_data.id,
                    detailUrl:url+_data.id,
                    yqqDetailUrl: medUrl + _data.id,
                    circleId:_data.circleId,
                    recommendId:_data.id,
                    deptId:_data.deptId,
                    recommend:_data.recommend,

                }
            }, function(json) { //可为空，回调函数和回调参数，回调参数已经从json转为Object

                if (json && json.data) {                   
                        
                } else {
                    alert('分享失败！')
                }

            }.bind(this))
        } catch (error) {
            
        }
    },
    setLiveShareButton:function(_data,_status){

        var names = 'setLiveShareRecommendButton';  //分享and推荐
        if(_data.userCircleRole==3 || _data.userCircleRole=='' || _data.userCircleRole==null){
            names = 'setLiveShareButton'   //分享
        }

        if(this.props.location.state.type == 0){
            var url = 'doctorActivity/web/#/routerurl/shareLogin?type=0&id=';
            var medUrl = 'drugorg/web/h5/boutiqueDoctor/index.html#/activityApplyShare?url=https://testapi.mediportal.com.cn/doctorActivity/web/#/routerurl/detailLogin?type=1&id=';
        }else{
            var url = 'doctorActivity/web/#/routerurl/shareLogin?type=1&id=';
            var medUrl = 'drugorg/web/h5/boutiqueDoctor/index.html#/activityApplyShare?url=https://testapi.mediportal.com.cn/doctorActivity/web/#/routerurl/detailLogin?type=2&id=';
        }

        try {
            $cordova.call({
                name:names, // 必传，插件名称
                params: { //  
                    shouldShow:_status, //是否显示
                    title:_data.subject,
                    coverUrl:_data.coverUrl,
                    speakerInfo:_data.speakerInfo,
                    description:_data.description,
                    addressUrl:'doctororg/web/phone/?#/info/'+_data.id,
                    detailUrl:url+_data.id,
                    yqqDetailUrl: medUrl + _data.id,
                    circleId:_data.circleId,
                    recommendId:_data.id,
                    deptId:_data.deptId,
                    recommend:_data.recommend
                }
            }, function(json) { //可为空，回调函数和回调参数，回调参数已经从json转为Object

                if (json && json.data) {                   
                        
                } else {
                    alert('分享失败！')
                }

            }.bind(this))
        } catch (error) {
            
        }
    },
    getSeeLive:function(_data,_status){
        this.gotoAndroid(_data,_status);
    },
    render: function () {
        var _that = this.state.result,_type = this.props.location.state.type;
        return (
           
            <div className="Live-info" style={{background: '#fff'}}>
                {_that && _that!='' ? 
                    <div style={styles.maxSrcoll}>
                        <div style={styles.divImg}>
                            <img style={styles.imgWidth} src={_that.coverUrl}/> 
                            {_type==0 ? _that.status==1 ?(<span style={styles.startFont}><i style={styles.startYuan}></i>进行中</span>) :(<span style={styles.startFont}><i style={styles.endYuan}></i>未开始</span>):''}
                        </div>
                    <WingBlank>
                    <List>  
                        <div>
                            <p style={styles.liveTitleInfo}>{_that.subject}</p>
                            <p style={styles.liveInfo}>演讲人: {_that.speakerInfo}</p>
                            <p style={styles.liveInfo}>来<span style={styles.colorWarth}>人</span>源: {_that.circleName||'---'}</p>
                            {_type ==0 ?(<p style={styles.liveInfo}>时<span style={styles.colorWarth}>人</span>间: {Dever.setAllTime(_that.startTime,_that.endTime)}</p>):(<p style={styles.liveInfo}>时&nbsp;&nbsp;间&nbsp;: {Dever.setAllTime(_that.recordStartTime,_that.recordEndTime)}</p>)}
                        </div>
                        <div
                            style={{
                            paddingTop: '.3rem'
                        }}>
                            <p style={styles.liveTitle}>直播简介</p>
                            <span style={styles.Info} dangerouslySetInnerHTML={{__html:Dever.Transformation(_that.description)}}></span>
                        </div>
                        <div
                            style={styles.divPading}>
                            <p style={styles.liveTitle}>议程描述</p>
                            <span style={styles.Info} dangerouslySetInnerHTML={{__html:Dever.Transformation(_that.plan)}}></span>
                        </div>
                    </List>
                </WingBlank></div> :''} 
                <LiveBtn onClick={this.getSeeLive.bind(this,_that,_type)} content={_type ==0 ?"观看直播":"观看视频"}/>
            </div>

        )
    }
})
var styles = {
    signup:{
        paddingTop:'.3rem',
    },
    maxSrcoll:{
        overflow: 'scroll',
        WebkitOverflowScrolling: 'touch',
        overflowScrolling:'touch',
        position:'relative',
        height:Dever.clientHeight,
    },
    leftDiv:{
        display: 'inline-block',
        width:Dever.clientWidth-70+'px',
        fontSize: '14px',
        color: '#171717',
    },
    rightDiv:{
        display: 'inline-block',
        textAlign:'right',
        fontSize: '14px',
        color: '#7AA4C9',
    },
    imgDivShow:{
        height: '90px',
        overflowY: 'hidden',
        overflowX: 'auto',
        width: '100%',
        whiteSpace: 'nowrap',
        textAlign:'center',
        paddingTop: '10px'
    },
    imgDivSpan:{
        display:'inline-block',
        padding:'0 5px'
    },
    imgDivName:{
        fontSize: '12px',
        color: '#666666',
    },
    colorWarth:{
        color:'#fff'
    },
    divPading:{
        paddingTop:'0.3rem',
        paddingBottom:'1.1rem',
    },
    divImg: {
        width: '100%',
        height: '180px',
        overflow: 'hidden',
        position: 'relative',
    },
    divMent:{
        background: 'rgba(0,0,0,.3)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: '1px',
    },
    liveTitleInfo:{
        fontSize: '16px',
        color: '#171717',
        padding:'7px 0',
        lineHeight: '18px',
        textAlign: 'justify',
        wordBreak: 'break-all'
    },
    liveTitle: {
        fontSize: '16px',
        color: '#171717'
    },
    liveInfo: {
        fontSize: '13px',
        color: '#999999',
        paddingBottom:'3px',
        wordBreak: 'break-all'
    },
    imgWidth: {
        maxWidth: '100%',
        height:'100%',
        width:'100%'
    },
    startFont: {
        fontSize: '12px',
        padding: '2px 8px',
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '10px',
        color: '#fff',
        position: 'absolute',
        top: '.3rem',
        left: '.3rem'
    },
    endYuan: {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        display: 'inline-block',
        borderwidth: '10px',
        background: '#FFBD35',
        verticalAlign: 'middle',
        marginRight: '3px',
        marginBottom:'1px'
    },
    startYuan: {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        display: 'inline-block',
        borderwidth: '10px',
        background: '#6BE2C6',
        verticalAlign: 'middle',
        marginRight: '3px',
        marginBottom:'1px'
    },
    Info: {
        display: 'inline-block',
        fontSize: '14px',
        color: '#171717',
        lineHeight: '17px',
        textAlign: 'justify',
        wordBreak: 'break-all'
    },
    userTitleImg:{
        width: '50px',
        height:'50px',
        borderRadius: '50%',
        display: 'inline-block',
        margin:' 0 5px',
    }
    
}