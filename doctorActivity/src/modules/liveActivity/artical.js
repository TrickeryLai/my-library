
//文章详情

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
        return {
            liveId: this.props.params.id ? this.props.params.id : '',
            result: ''
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
                        'title':'文章详情',
                        'color':'white'
                    }
                }, function (json) {}.bind(this))

        } catch (e) {
            //alert(e)
        }
    },
    //获取详情
    liveDetail:function(){
    
        Fetch({
            url: localStorage.getItem('circleHost') + '/faq/nologin/activity/question/'+this.state.liveId,
            data:{},
            type:'GET'
        }).then(function(rpn){
            if(rpn){
                if(rpn.status ==1 && rpn.joinedCircle && rpn.received){
                    // this.setTitle();
                    var _result={id:rpn.id};
                    // History.replaceState({result:_result,type:0},'/info/');
                    return ;
                }
                this.setState({
                    result:rpn,
                })
            }
           
            
        }.bind(this))
    },
    render:function(){
        var identify,//是否是个人
            data,
            content;

        if(this.state.result && this.state.result.author && this.state.result.author.user){
            identify = true;
            data = this.state.result.author.user;
            var headpic = data.headPicFileName;
            content = this.state.result.content;
        }

        if(this.state.result && this.state.result.author && this.state.result.author.deptVO){
            identify = false;
            data = this.state.result.author.deptVO;
            var headpic = data.logoUrl;
            content = this.state.result.content;
            console.log(data.showName);
        }
        return (
            <div className="scrollName" style={{height: '100%'}}>
                {this.state.result ? (<div style={styles.body} className="welfare_info">
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
                                                    <div style={styles.headerTitle}>{(data && content) ? (data.showName):this.state.result && this.state.result.title}</div>
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
                                        (content && content.show && content.coverUrl) ? (<img src={content.coverUrl} alt=""/>) : ''
                                    }
                                    {
                                        content && content.pics ? (
                                            content.pics.map( function(item){
                                                return <img src={item} style={styles.contentPic} alt=""/>
                                            })
                                        ): ''
                                    }
                                    {
                                        (content && content.commonCard && content.type == '4') ? (
                                            <div style={{background:'#f5f5f5',padding: '10px',margin: '10px 0'}}>
                                                <img src={content.coverUrl} alt="" style={{maxWidth: '100px',verticalAlign: 'middle'}}/>
                                                <a style={styles.shareUrlTxt} >{content.summary}</a>
                                            </div>
                                        ): (<span >{content && content.summary}</span>)
                                    }
                                    {
                                        content && content.articleUrl ? (
                                            <div style={{background:'#f5f5f5',padding: '10px', margin: '10px 0'}}>
                                                <img src={content.articleIcon} alt="" style={{maxWidth: '100px', verticalAlign:'middle'}}/>
                                                {/*<a style={styles.shareUrlTxt} href={content.articleUrl}>{content.articleTitle}</a>*/}
                                                <a style={styles.shareUrlTxt}>{content.articleTitle}</a>
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
                                <span style={styles.baseInfo}>{Device.formatTime(this.state.result.topicPostTime , 'yyyy-MM-dd hh:mm')}</span>

                            </div>
                        </List>
                    </WingBlank>
                </div> ): ''}
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
        position: 'relative',
        height: '100%'
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
    title:{
        fontSize:'24px',
        color: '#171717',
        fontWeight: '500'
    },
    welfareBanner:{
        width:'100%',
        maxWidth:'100%',
        height:Device.clientHeight /3 +'px'
    },
    baseInfo: {
        fontSize: '12px',
        color: '#aaa',
        lineHeight: '12px',
        marginRight: '10px',
        marginTop: '10px',
        display: 'block',
        marginBottom: '5px'
    },
    headerPic: {
        maxWidth: '40px',
        width: '40px',
        maxHeight: '40px',
        borderRadius: '50%'
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
    baseInfo1: {
        fontSize: '16px',
        color: '#2a2a2a',
        margin: '10px 0',
    },
    contentPic: {
        width: '100%'
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
        verticalAlign:'middle'
    }
}