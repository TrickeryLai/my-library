
/*病例讨论*/

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
require('../welfare/welfare.css');


module.exports = React.createClass({
    
    getInitialState:function(){
        var labels = [];
        return{
            liveId: this.props.params.id ? this.props.params.id :'',
            result:{
                activity: true
            },
            labels:labels
        }
    },
    componentDidMount:function(){
        this.liveDetail();
    },
    setTitle:function(){
        try {
            
            $cordova.call({
                    name: 'setTitle',
                    params: {
                        'title':'病例讨论',
                        'color':'white'
                    }
                }, function (json) {}.bind(this))

        } catch (e) {
            /*alert(e)*/
        }
    },
    /*获取详情 406135631907954688*/
    liveDetail:function(){
    
        Fetch({
            url:localStorage.getItem('circleHost')+'/disease-discuss/h5/nologin/detail/'+this.state.liveId,
            data:{},
            type:'GET'
        }).then(function(rpn){
            if(rpn){
                if(rpn.status ==1 && rpn.joinedCircle && rpn.received){
                    // this.setTitle();
                    /*var _result={id:rpn.id}*/
                    /*History.replaceState({result:_result,type:0},'/info/');*/
                    return ;
                }
                this.setState({
                    result:rpn,
                    labels: rpn.labelList
                })
            }
           
            
        }.bind(this))
    },
    render:function(){
        return (
            <div className="scrollName" style={{height:'100%'}}>
                {this.state.result ?  
                    
                <div style={styles.body} className="welfare_info">
                    <WingBlank>
                        <List>
                            <div>
                                <div className="clear welfareClass-speakerBlock" style={{paddingTop: '10px',borderBottom: 0}}>
                                    <div className="welfareClass-speakerPic fl">
                                        <img style={styles.headerPic} src={this.state.result.authorHeadPic} alt="" />
                                    </div>
                                    <div className="welfareClass-speakerInfo fl">
                                        <p style={styles.blackColor}>{this.state.result.authorName} - {this.state.result.authorAcademicTitle} | {this.state.result.authorDept} </p>
                                        <p>{this.state.result.authorUnit}</p>
                                    </div>
                                </div>
                                <p style={styles.title}>{this.state.result.title}</p>
                                <div style={styles.paddingBottom}>
                                    {
                                        this.state.labels.map( function (item){
                                            return (<span className="welfareCase-label-item">{item.name}</span>)
                                        }.bind(this))
                                    }
                                </div>
                                <div style={{marginTop: '10px'}}>
                                    <h3 style={styles.baseTitle}>主诉：</h3>
                                    <p style={styles.baseInfoContent}>{this.state.result.text}</p>
                                    {
                                        this.state.result.attachmentList && this.state.result.attachmentList.map(function(item){
                                            //图片
                                            if(item && item.type == 1){
                                                return (<img src={item.url} alt="" style={{width:'100%'}}/>)
                                            }
                                            if(item && item.type == 2){//视频
                                                return <video src={item.url} style={{width:'100%'}} controls="controls" controlsList="nodownload" poster={item.url + '?vframe/jpg/offset/1/w/0/h/0'}></video>
                                            }
                                            if(item && item.type == 3){
                                                return <audio src={item.url} style={styles.attachmentAudio} controls="controls" controlsList="nodownload"></audio>
                                            }
                                        })
                                    }

                                    {
                                        this.state.result.moreContentList ? this.state.result.moreContentList.map(function(item){
                                            return (
                                                <div>
                                                    <h3 style = {styles.baseTitle}>{item.title}</h3>
                                                    <p style={styles.baseInfoContent}>{item.text}</p>
                                                    {/*附件*/}
                                                    <div>
                                                        {item.attachment ? item.attachment.map(function(item){
                                                            if(item.type == 1){//图片
                                                                return <img style={styles.attachmentPic} src={item.url} alt=""/>
                                                            }
                                                            if(item.type == 2){//视频
                                                                return <video src={item.url} style={styles.attachmentVideo} controls="controls" controlsList="nodownload"  poster={item.url + '?vframe/jpg/offset/1/w/0/h/0'}></video>
                                                            }
                                                            if(item.type == 3){
                                                                return <audio src={item.url} style={styles.attachmentAudio} controls="controls" controlsList="nodownload"></audio>
                                                            }
                                                        }): ''}
                                                    </div>
                                                </div>
                                            )
                                        }): ''
                                    }
                                </div>
                                <p style={styles.lastTime}>{Device.formatTime((this.state.result.createTime - 0), 'MM-dd hh:mm')}</p>
                            </div>
                        </List>
                    </WingBlank>
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
    blackColor: {
        color:'#333',
        fontSize: '14px'
    },
    body:{
        width:'100%', 
        position: 'relative',
        background: '#fff',
        height: '100%'
    },
    introduce_title:{
        fontSize: '15px',
        color: '#999',
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
        margin: '10px 0 0'
    },
    bgHide:{
        color:'#fff'
    },
    title:{
        fontSize:'18px',
        color: '#333',
        fontWeight: '500',
        letterSpacing: '0',
        lineHeight: '24px',
        paddingBottom: '.1rem',
    },
    paddingBottom: {
        paddingBottom: '.1rem'
    },
    baseTitle: {
        fontSize: '16px',
        color: '#333',
        lineHeight: '26px',
        fontWeight: 'normal',
        marginTop: '15px'
    },
    baseInfoContent: {
        fontSize: '16px',
        color: '#999',
        lineHeight: '26px',
        fontWeight: 'normal',
    },
    attachmentPic: {
        width: '108px',
        height: '108px',
        margin: '5px',
        display: 'inline-block',
    },
    attachmentVideo: {
        width: '100%'
    },
    attachmentAudio: {
    },
    lastTime: {
        marginTop: '10px'
    },
    headerPic: {
        maxWidth: '40px',
        width: '40px',
        maxHeight: '40px',
        borderRadius: '50%',
        marginRight: '4%',
        display: 'inline-block',
    }
};