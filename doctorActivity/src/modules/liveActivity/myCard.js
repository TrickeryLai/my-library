var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var AntdMobile = require('./../../antdMobile/antdMobile.js');
var History = ReactRouter.hashHistory;
var WingBlank =AntdMobile.WingBlank;
var Flex = AntdMobile.Flex;
var Device = require('./../../device/device.js');



module.exports = React.createClass({
    getInitialState:function(){
        return{
            isCheck:true
        }
    },
    goToActivityInfo:function(_datas){
        var id = _datas.id;
        /*网络推广id 不同*/
        if(this.props.State.currentType.value == 6){
            id = _datas.promotionId;
        }
        History.pushState(null, 'activitylist/activityinfo/'+ id + '/'+ this.props.State.currentType.value);

    },
    componentDidMount:function(){
        
    },
    
    render:function(){
        var isHasMaster = true,
            typeValue = this.props.State.currentType.value,
            totalData = this.props.result.activityList,
            subTitle = this.props.result.subject;

        /*直播、录播有圈主*/
        if(typeValue == 1 || typeValue == 2){
            isHasMaster = true;
            var _masters = this.props.result.masters;
            _masters = _masters && _masters.slice(0,2);
        }
        //其他的只有发布人
        else{
            isHasMaster = false;
            var userName = this.props.result.userName;
        }

        //病例讨论 / 网络推广
        if(typeValue == 4 || typeValue == 6){
            subTitle = this.props.result.title;
        }

        //帖子
        if(typeValue == 5){
            totalData = this.props.result.activityVOS;
            subTitle = this.props.result.title;
        }

        var _isSigned=false,signed=0,limit=0;
        //增加是否有限制人数选项
        var isAllLimit = true;

        totalData && totalData.map(function(_item){
            signed += _item.signed || 0;
            limit += _item.limit || 0;

            //是否限制人数
            if(!_item.limit && _item.limit !== 0){
                isAllLimit = false;
            }
        });

        if(signed>=limit){
            _isSigned=true;
        }
        //如果存在可以不限制人数
        if(!isAllLimit){
            _isSigned = false;
        }

        return(
            <div style={styles.bgColor}>
                <WingBlank size="lg">
                    <p style={styles.h5}>{subTitle}</p>
                    <Flex style={styles.w100}>
                        {
                            typeValue == 6? (
                                <div style={styles.w70} className="myCard_info">
                                    <p style={{padding: '8px 0'}}>时间：{this.props.result.createTime}</p>
                                </div>
                            ):(
                                <div style={styles.w70} className="myCard_info">
                                    <p>来自于：{this.props.result.circleName}</p>
                                    {isHasMaster ? (
                                        <p>圈主：{_masters && _masters.length > 0? _masters.map(function(_item,_idx){
                                            if(_idx === _masters.length -1){
                                                return(
                                                    <span>
                                                        {_item.name}
                                                        <span style={_masters.length > 1  ? _idx==1 ? styles.hide : styles.span_show :styles.hide}>,</span>
                                                         <span style={this.props.result.masters && this.props.result.masters.length>2 ? styles.span_show: styles.hide}>等{this.props.result.masters.length}人</span>
                                                     </span>
                                                )
                                            }
                                            return(
                                                <span>
                                                    {_item.name}
                                                    <span style={_masters.length > 1  ? _idx==1 ? styles.hide : styles.span_show :styles.hide}>,</span>
                                                </span>
                                            )

                                            }.bind(this)) :''
                                        }
                                        </p>

                                    ):(
                                        <p>发布人：{this.props.result.userName}</p>
                                    )}
                                    {
                                        isHasMaster || (this.props.State.currentType.value == 5) ? (
                                            <p>所属科室：{this.props.result.deptName || '-'}</p>
                                        ) : (
                                            <p>所属科室：{this.props.result.userDept}</p>
                                        )
                                    }

                                    {/*<p>推广范围：{this.props.result.deptName}</p>*/}
                                    <p style={this.props.result.status==1 ? styles.statusTimeShow : styles.statusTimeHide}>{Device.liveSetDonwDate(this.props.result.startTime,this.props.result.endTime)}</p>
                                    {
                                        this.props.result.status ==0 && Device.liveSetTime(this.props.result.startTime,this.props.result.endTime).key==1
                                            ?
                                            <p>直播时间:{Device.liveSetTime(this.props.result.startTime,this.props.result.endTime).values}</p>

                                            :
                                            this.props.result.status ==0 && Device.liveSetTime(this.props.result.startTime,this.props.result.endTime).key==0
                                                ?
                                                <p style={{color:'#0B92FF'}}>{Device.liveSetTime(this.props.result.startTime,this.props.result.endTime).values}</p>
                                                :
                                                ''

                                    }

                                    {/* <p>直播时间:{Device.liveSetTime(this.props.result.startTime,this.props.result.endTime).values}</p> */}
                                </div>
                            )
                        }

                        <div style={styles.w30}>
                            <span style={_isSigned ? styles.unClick : styles.click} onClick={!_isSigned ? this.goToActivityInfo.bind(this,this.props.result):''}>{!_isSigned?"点击邀请":"名额已满"}</span>
                        </div>
                    </Flex>
                    <Flex style={styles.w101}>
                        <div style={styles.activityList_w100} className="activityList_w100">
                            {totalData && totalData.length > 0 ?
                                totalData.map(function(_item,_idx){
                                    // 帖子
                                    if(typeValue == 5){
                                        return (
                                            <div style={totalData.length > 1 ? styles.w50:styles.w1001} className="myCard_card">
                                                {_item.name ? (
                                                    <p style={_idx ==1?styles.h5_title_yellow:styles.h5_title}>来自于：{_item.name}</p>
                                                ): ''}
                                                <div style={{paddingTop:'.24rem'}}>
                                                    {
                                                        _item.rule.referrerIntegral ? (
                                                            <p>推广奖励：{_item.rule.referrerIntegral}积分</p>
                                                        ): ''
                                                    }
                                                    {
                                                        _item.rule.doctorCredit && _item.rule.thirdPartyFee ? (
                                                            <p>医生奖励：{(_item.rule.doctorCredit + _item.rule.thirdPartyFee)}学币</p>
                                                        ): ''
                                                    }
                                                    {
                                                        _item.rule.thirdPartyFee ? (<p style={styles.smallTxt}>(推广支付{_item.rule.thirdPartyFee}学币)</p>): ''
                                                    }

                                                    <p>报名人数：{_item.signed || 0}{!_item.limit ? '' : ('/' + _item.limit)}</p>
                                                    {
                                                        _item.popularization ? (<p>推广范围：{_item.popularization}</p>) : ''
                                                    }
                                                </div>
                                            </div>
                                        )
                                    }
                                    return (
                                        <div style={totalData.length > 1 ? styles.w50:styles.w1001} className="myCard_card">
                                            <p style={(_idx % 2) ==1?styles.h5_title_yellow:styles.h5_title}>来自于：{_item.name}</p>
                                            <div style={{paddingTop:'.24rem'}}>
                                                {
                                                    _item.rule.referrerIntegral ? (
                                                        <p>推广奖励：{_item.rule.referrerIntegral}积分</p>
                                                    ): ''
                                                }
                                                <p>医生奖励：{(_item.rule.doctorCredit + _item.rule.thirdPartyFee)}学币</p>
                                                {
                                                    _item.rule.thirdPartyFee ? (<p style={styles.smallTxt}>(推广支付{_item.rule.thirdPartyFee}学币)</p>): ''
                                                }
                                                <p>报名人数：{_item.signed || 0}{!_item.limit ? '' : ('/' + _item.limit)}</p>
                                                {
                                                    _item.popularization ? (<p>推广范围：{_item.popularization}</p>) : ''
                                                }
                                            </div>
                                        </div>
                                    
                                    )
                                }.bind(this))    
                            :''}
                      </div>
                    </Flex>
                </WingBlank>
            
            </div>
        )
        
    }
})

var styles={
    show:{
        display:'block',
    },
    span_show:{
        display:'inline-block'
    },
    hide:{
        display:'none'
    },
    bgColor:{
        display:'block',
        background:'#fff',
        width:Device.clientWidth,
        borderBottom: '10px solid #f5f5f5',
        paddingTop: '5px'
    },
    statusTimeHide:{
        display:'none'
    },
    statusTimeShow:{
        display:'block',
        color:'#F85D5D'
    },
    w100:{
        width:'100%'
    },
    activityList_w100:{
        width:'100%',
        textAlign:'right',
    },
    w101:{
        width:'100%',
        padding:'15px 0',
       
    },
    w70:{
        width:Device.clientWidth-100+'px'
    },
    w50:{
        width:(Device.clientWidth/2)-26+'px',
        textAlign:'center',
        border:'1px solid #EEEEEE',
        height:'140px',
        borderRadius:'5px',
        display:'inline-block'
    },
    w1001:{
        width:Device.clientWidth-35+'px',
        textAlign:'center',
        border:'1px solid #EEEEEE',
        height:'140px',
        borderRadius:'5px',
        display:'inline-block'
    },
    h5:{
        width:Device.clientWidth-15+'px',
        fontSize:'17px',
        color: '#333333',
        overflow: 'hidden',
        textOverflow:'ellipsis',
        whiteSpace: 'nowrap',
    },
    w30:{
        width:'26%',
    },
    click:{
        border:'1px solid #0B92FF',
        color:'#0B92FF',
        fontSize:'14px',
        padding:'5px 10px',
        borderRadius: '3px',
    },
    unClick:{
        border:'1px solid #ddd',
        color:'#fff',
        fontSize:'14px',
        padding:'5px 10px',
        borderRadius: '3px',
        background:'#ddd'
    },
    h5_title:{
        borderBottom: '1px solid #eee',
        padding: '5px 0',
        background:' #7EACFF',
        color:' #FFFFFF',
        borderRadius:' 5px 5px 0px 0px',
    },
    h5_title_yellow:{
        borderBottom: '1px solid #eee',
        padding: '5px 0',
        background:'#FFC900',
        color:' #FFFFFF',
        borderRadius:' 5px 5px 0px 0px',
    },
    smallTxt: {
        color: '#999',
        fontSize: '12px'
    },
    commonTxt: {
        color: '#666'
    }
};