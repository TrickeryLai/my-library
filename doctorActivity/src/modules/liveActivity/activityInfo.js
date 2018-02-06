var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var AntdMobile = require('./../../antdMobile/antdMobile.js');
// var Clipboard  = require('react-clipboard');
var copyFun = require('copy-to-clipboard');
var MyItem = require('./myItem.js');
var Fetch = require('./../../fetch/fetch.js');
var Api = require('./../../cmp/ApiFactory.js');
var Device = require('./../../device/device.js');
var cordova = require('../initJSBridge');
var History=ReactRouter.hashHistory;
var WingBlank =AntdMobile.WingBlank;
var WhiteSpace = AntdMobile.WhiteSpace;
var Flex = AntdMobile.Flex;
var Toast = AntdMobile.Toast;

module.exports = React.createClass({
    getInitialState:function(){
        cordova.funInCordova(function () {
            this.getOpenId();
        }.bind(this));
        this.setHost();
        return {
            result:123,
            masters:[],
            mastersLength:0,
            url:'',
            type: this.props.params.type,
            linkUrl:'',//跳转url
            getDataUrl: '',//获取详情url
            userName: ''
        }
    },
    setHost: function(){
        var localhost;
        switch(window.location.hostname){
            case 'localhost':
            case '127.0.0.1':
            case '192.168.2.185':
            case '192.168.1.187':
            case '192.168.1.195':
            case '192.168.1.77':
                localhost = (window.location.protocol + '//' + window.location.hostname + ':' + (window.location.port|| 80) + '/vpn');
                break;
            default:
                localhost = (window.location.protocol + '//' + window.location.hostname);
        }
        localStorage.setItem('circleHost',localhost);
    },
    componentDidMount:function(){
        this.initData(this.props.params.type);
        this.upActivityInfo();
        this.setState({url:window.location.href});
    },
    initData: function(type){
        var linkUrl = '',//跳转url
            getDataUrl = '';//获取详情url
        switch (type - 0){
            case 1:
                linkUrl = 'activitylist/liveinfo/' + type + '/';
                // getDataUrl = Api.circle.activityInfo;
                getDataUrl = localStorage.getItem('circleHost') + '/live/h5/nologin/detail';
                break;
            case 2:
                linkUrl = 'activitylist/liveinfo/' + type + '/';
                // getDataUrl = Api.circle.videoInfo;
                getDataUrl = localStorage.getItem('circleHost') + '/live/h5/vedio/nologin/detail';
                break;
                //微学堂
            case 3:
                linkUrl = 'activitylist/class/';
                getDataUrl = localStorage.getItem('circleHost') + '/h5/vedio/nologin/detail';
                break;
                //病例讨论
            case 4:
                linkUrl = 'activitylist/case/';
                // getDataUrl = Api.circle.caseInfo;
                getDataUrl = localStorage.getItem('circleHost') + '/disease-discuss/h5/nologin/detail';
                break;
                //帖子
            case 5:
                linkUrl = 'activitylist/artical/' ;
                // getDataUrl = Api.circle.adInfo;
                getDataUrl = localStorage.getItem('circleHost') + '/faq/nologin/activity/question';
                break;
            case 6:
                linkUrl = 'activitylist/artical/' ;
                // getDataUrl = Api.circle.adInfo;
                getDataUrl = localStorage.getItem('circleHost') + '/online-marketing/h5/nologin/detail';
                break;
        }
        return {
            linkUrl: linkUrl,
            getDataUrl: getDataUrl
        };
    },
    upActivityInfo:function(){
        var data = this.initData(this.props.params.type),
            url = data.getDataUrl + '/'+this.props.params.activeId;
        Fetch({
            url: url,
            type:'GET',
            data:{}
        }).then(function(rpns){

            if(rpns){

                //直播、录播有圈主
                if(this.props.params.type == 1 || this.props.params.type == 2 ){
                    this.setState({
                        result:rpns,
                        masters:rpns.masters && rpns.masters.slice(0,2),
                        masterslist:rpns.masters,
                        mastersLength:rpns.masters.length
                    })
                }else{
                    this.setState({
                        result: rpns,
                        userName: rpns.userName
                    })
                }

            }

        }.bind(this))
    },
    getOpenId:function(){

        try {
            $cordova.call({
                name: 'getIdentity',
                params:{

                }
            },
               function(result){

                  localStorage.setItem('activityUserName',result.data.userName);
                  localStorage.setItem('activityUserId',result.data.openID);

               }
            );

            } catch (e) {
                alert(e)
            }
            this.setNavigationBar()
    },
    setNavigationBar:function(){
        try {
            $cordova.call({
                name: 'setNavigationBar',
                params:{
                    'color':'#3CBAFF'
                }
                },
               function(result){

               }
            );

            } catch (e) {
                alert(e)
            }
            this.setTitle()
    },
    setTitle:function(){
        try {
            $cordova.call({
                name: 'setTitle',
                params:{
                    'title':'',
                    'color':'white'
                }
                },
               function(result){

               }
            );

            } catch (e) {
                alert(e)
            }
            this.setReturnButton();
    },
    setReturnButton:function(){
        try {
            $cordova.call({
                name: 'setReturnButton',
                params:{
                    'color':'white'
                }
                },
               function(result){

               }
            );

            } catch (e) {
                alert(e)
            }
    },
    componentWillReceiveProps:function(nextProps){
    },
    pushToInfo:function(_id, _that){
        //网络推广会直接跳出
        if(this.props.params.type == 6){
            var promotionId = _that.promotionId;
            try {
                $cordova.call({
                        name: 'goToApp',
                        params:{
                            'appId' : 'InternetFair',  //要跳入的应用的appId
                            // 'params' : {
                            //     'url' : '/mobil/promotion/getPromotionDetail/',
                            //     'id'  : promotionId,
                            // },
                            'param': 'id='+ promotionId + '&url=/mobil/promotion/getPromotionDetail/'
                        }
                    },
                    function(result){

                    }
                );

            } catch (e) {
                alert(e)
            }
            return;
        }
        var data = this.initData(this.props.params.type);
        History.pushState(null,data.linkUrl + _id);
    },
    getText:function(){
        var url = window.location.href;
        var protocol = window.location.protocol;
        if(protocol.indexOf('http')!= -1){

            url = url.replace(/http/,'lightapp');

        }else{

            url = url.replace(/https/,'lightapps')
        }
        return url
    },
    onfocus:function(){
        //禁止键盘弹出
        document.activeElement.blur();
    },
    onSuccess:function(e){
        e.trigger.onfocus=function(){
            //禁止键盘弹出
            document.activeElement.blur();
        };
        if(e.text !=''){
            Toast.success('复制成功！');
        }
    },
    copy: function(){
        copyFun(this.getText());
        Toast.success('复制成功！');
    },
    getMastersHtml: function(data){
        var arrs = [];
        for(var i = 0; i < data.length; i++){
            var _item = data[i];
            arrs.push(<span>{_item.name} <span style={ i < 1 && data.length >2 ? styles.span_Show:styles.hide}>,</span></span>)
        }
        return arrs;
    },
    render:function(){

        var _that = this.state.result,
            totalData = _that.activityList,
            title = _that.subject,
            speaker ; //发布人

        //帖子
        if(this.props.params.type == 5){
            totalData = _that.activityVOS;
            title = _that.title;
        }

        //网络推广
        if(this.props.params.type == 6){
            title = _that.title;
        }

        //病例详情
        if(this.props.params.type == 4){
            title = _that.title;
            speaker = _that.authorName;
        }

        return(
            <div>
                 {
                _that ? <div style={styles.w100} >
                <div style={!this.props.children ? styles.hide : styles.show}>
                    {this.props.children}
                </div>
                <div style={this.props.children ? styles.hide : styles.show}>
                    <div style={totalData ? styles.show : styles.hide}>

                        <div className="activity_info">
                            <WingBlank>
                                <div style={styles.w100_bg}>
                                    <div style={{position: 'relative'}}>
                                        <h4 style={ this.props.params.type == 6 ?styles.activity_title6 : styles.activity_title}>{title}</h4>

                                        {/*<Clipboard readonly="readonly" style={styles.activity_post_copy} onFocus={this.onfocus} option-text={this.getText} onSuccess={this.onSuccess} className="activity_btn">复制链接<br />(链接仅药企圈可用)</Clipboard>*/}
                                        <span onClick={this.copy.bind(this)} className="activity_btn" style={styles.activity_post_copy}>复制链接<br /><i style={styles.copy_text}>(链接仅药企圈可用)</i></span>
                                    </div>
                                    {(this.props.params.type == 6 || this.props.params.type == 4 || this.props.params.type == 5) ? (
                                        <p style={{padding: '5px'}}></p>
                                    ):(
                                        <p style={styles.activity_post}>主讲人：{_that.speakerInfo}</p>
                                    )}
                                    <Flex>
                                        <div style={styles.w70}>
                                            {
                                                (this.props.params.type == 6)?'':((this.props.params.type == 1 || this.props.params.type == 2) ?
                                                    (<p>圈主：{this.state.masterslist && this.state.masterslist.length >0 ? this.getMastersHtml.call(this, this.state.masterslist) :''}
                                                        <span style={this.state.result && this.state.mastersLength >=2 ?styles.span_Show:styles.hide}>等{this.state.mastersLength}人</span>
                                                    </p>):
                                                    (<p>发布人：{speaker || this.state.userName}</p>)
                                                )
                                            }


                                        </div>
                                        {
                                            this.props.params.type == 6?'':( <div style={styles.w30} onClick={this.pushToInfo.bind(this,_that.id, _that)}>
                                                <p>查看详情></p>
                                            </div>)
                                        }
                                    </Flex>
                                </div>
                            </WingBlank>
                            <div style={{height:'.75rem'}}></div>
                        </div>
                        <div style={{marginTop: '-.75rem'}}>
                            <MyItem type={this.state.type} result={totalData} activityLiveId={_that.id || _that.promotionId}  callBack={this.upActivityInfo}/>
                        </div>
                    </div>
                </div>


            </div> :''
            }

            </div>

        )
    }
})
var styles={
    show: {
        display: 'block'
    },
    span_Show:{
        display: 'inline-block'
    },
    hide: {
        display: 'none'
    },
    w70:{
        width:'80%',
    },
    w30:{
        width:'20%',
        textAlign:'right'
    },
    w100:{
        width:'100%',
        color: '#FFFFFF',
    },
    w100_bg:{
        padding:'0 0 10px 0'
    },
    activity_title:{
        fontSize:'18px',
        width:Device.clientWidth - 150+'px',
        display:'inline-block',
        marginTop: '10px',
        fontWeight: 'normal',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },
    activity_title6: {
        fontSize:'18px',
        width:Device.clientWidth - 150+'px',
        display:'inline-block',
        marginTop: '20px',
        fontWeight: 'normal',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },
    activity_post:{
        fontSize:'12px',
        paddingTop:'5px',
        lineHeight: '12px',
        margin:'5px 0'
    },
    activity_post_copy:{
        fontSize:'14px',
        paddingTop:'5px',
        background:'none',
        color:' #fff',
        position: 'absolute',
        top: '.1rem',
        right: '.1rem',
        textAlign: 'center'
    },
    copy_text: {
        fontSize: '12px',
        fontStyle: 'normal'
    }
}