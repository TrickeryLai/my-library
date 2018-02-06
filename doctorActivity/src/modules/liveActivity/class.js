
/*微学堂*/

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

/*var dottedJpg = require('./img/dotted.jpg');*/

module.exports = React.createClass({
    
    getInitialState:function(){

        return{
            liveId: this.props.params.id ? this.props.params.id :'',
            result:{
                activity: true
            }
        }
    },
    componentDidMount:function(){
        this.liveDetail();
    },
    setTitle:function(){
        try {
            
            $cordova.call({
                    name: 'setTitle', /* 必传，插件名称*/
                    params: {  /*可为空，传参*/
                        'title':'微学堂',
                        'color':'white'
                    }
                }, function (json) {}.bind(this))

        } catch (e) {
            /*alert(e)*/
        }
    },
    /*获取详情*/
    liveDetail:function(){
    
        Fetch({
            url:localStorage.getItem('circleHost')+'/activity/invitation/liveH5Detail/'+this.state.liveId,
            data:{},
            type:'GET'
        }).then(function(rpn){
            if(rpn){
                if(rpn.status ==1 && rpn.joinedCircle && rpn.received){
                    // this.setTitle();
                    var _result={id:rpn.id};
                    return ;
                }
                this.setState({
                    result:rpn,
                    isAlready:rpn.received,
                    isjoinedCircle:rpn.joinedCircle,
                    isCheckHide:_isCheckHide,
                    islimitFull:rpn.limitFull,
                    isReceive:rpn.received
                })
            }
           
            
        }.bind(this))
    },
    render:function(){
        return (
            <div className="scrollName" style={{height: '100%'}}>
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
                                    <div className="welfareClass-speakerPic fl">
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
                            <div className="welfare_item_introduce" style={styles.welfare_item_introduce}>
                                <div style={styles.paddingBottomItem}>
                                    <strong style={styles.introduce_title}>课程简介</strong>
                                    <p style={styles.introduce_content} dangerouslySetInnerHTML={{__html:Device.Transformation(this.state.result.plan || '暂无简介')}}></p>
                                </div>
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
        position: 'relative',
        height: '100%',
        background: '#fff'
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
    welfare_item_introduce: {
        paddingTop: '10px'
    }
};