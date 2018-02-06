var React = require('react');
var ReactDOM = require('react-dom');
var Fetch = require('./../../fetch/fetch.js');
var Api = require('./../../cmp/ApiFactory.js');
var AntdMobile = require('./../../antdMobile/antdMobile.js');
var Dever = require('./../../device/device.js');
var Toast = AntdMobile.Toast;
var List = AntdMobile.List;
var WingBlank = AntdMobile.WingBlank;


module.exports = React.createClass({
    getInitialState:function(){
        return {
            liveId:this.props.params.id ? this.props.params.id :'',
            result:[],
            text: this.props.params.type == 1 ? '直播': '录播'
        }
    },
    componentDidMount:function(){
        this.getUpLiveData()
    },
    getUpLiveData:function(){
        var url = '';
        if(this.props.params.type == 1){
            // url = Api.circle.liveinfo;
            url = localStorage.getItem('circleHost') + '/live/living/nologin/detail';
        }else{
            // url = Api.circle.videoInfo;
            url = localStorage.getItem('circleHost') + '/live/h5/vedio/nologin/detail';
        }
        Fetch({
            url:url+'/'+this.state.liveId,
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
    render:function(){
        
        var _that = this.state.result,_type=0;
        return (
            <div style={styles.bodys} className='Live-info'>
                <WingBlank style={{marginTop:'0',paddingTop:'15px'}}>
                    <List>
                        <div style={styles.divImg}>
                            <img
                                style={styles.imgWidth}
                                src={_that.coverUrl}/>
                                <div style={styles.divMent}></div>
                        </div>
                        {_type==0 ? _that.status==1 ?(<span style={styles.startFont}><i style={styles.startYuan}></i>进行中</span>) :(<span style={styles.startFont}><i style={styles.endYuan}></i>未开始</span>):''}
                        <div>
                            <p style={styles.liveTitleInfo}>{_that.subject}</p>
                            <p style={styles.liveInfo}>演讲人: {_that.speakerInfo}</p>
                            <p style={styles.liveInfo}>来<span style={styles.colorWarth}>人</span>源: {_that.circleName||'---'}</p>
                            {_type ==0 ?(<p style={styles.liveInfo}>时<span style={styles.colorWarth}>人</span>间: {Dever.setAllTime(_that.startTime,_that.endTime)}</p>):(<p style={styles.liveInfo}>时&nbsp;&nbsp;间&nbsp;: {Dever.setAllTime(_that.recordStartTime,_that.recordEndTime)}</p>)}
                        </div>
                        
                        {/* <BtnPost content={_that.circleName}></BtnPost> */}
                        <div
                            style={{
                            paddingTop: '.3rem',
                            lineHeight: '.3rem'
                        }}>
                            <p style={styles.liveTitle}>{this.state.text}简介</p>
                            <span style={styles.Info} dangerouslySetInnerHTML={{__html:Dever.Transformation(_that.description)}}></span>
                        </div>
                        <div
                            style={styles.divPading}>
                            <p style={styles.liveTitle}>议程描述</p>
                            <span style={styles.Info} dangerouslySetInnerHTML={{__html:Dever.Transformation(_that.plan)}}></span>
                        </div>
                    </List>
                </WingBlank>
            </div>
        )
    }
})


var styles={
    imgDivShow:{
        height: '90px',
        overflowY: 'hidden',
        overflowX: 'auto',
        width: '100%',
        whiteSpace: 'nowrap',
        textAlign:'center',
        paddingTop: '10px'
    },
    leftDiv:{
        textAlign:'left',
        fontSize: '14px',
        color: '#171717',
    },
    userTitleImg:{
        width: '50px',
        height:'50px',
        borderRadius: '50%',
        display: 'inline-block',
        margin:' 0 5px',
    },
    imgDivSpan:{
        display:'inline-block',
        padding:'0 5px'
    },
    imgDivName:{
        fontSize: '12px',
        color: '#666666',
    },
    bodys:{
        background:'#fff',
        width:'100%',
        height:Dever.clientHeight
    },
    signup:{
        paddingTop:'.3rem',
        textAlign:'center'
    },
    colorWarth:{
        color:'#fff'
    },
    divPading:{
        paddingTop:'0.3rem',
        paddingBottom:'1.1rem',
        lineHeight:'.3rem'
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
        wordBreak: 'break-all',
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
        wordBreak: 'break-all',
        paddingTop: '7px'
    }
}