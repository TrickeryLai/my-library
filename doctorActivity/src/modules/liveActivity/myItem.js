
var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var AntdMobile = require('./../../antdMobile/antdMobile.js');
var Device = require('./../../device/device.js');
var Api = require('./../../cmp/ApiFactory.js');
var Fetch = require('./../../fetch/fetch.js');
var Toast = AntdMobile.Toast;
var Modal = AntdMobile.Modal;
var History = ReactRouter.hashHistory;
var WingBlank =AntdMobile.WingBlank;
var Flex = AntdMobile.Flex;
var Card = AntdMobile.Card;
var WhiteSpace = AntdMobile.WhiteSpace;
var cordova = require('../initJSBridge');
module.exports = React.createClass({
    getInitialState:function(){
        cordova.funInCordova();
        return{
            textTitle:'我能怎么办，我也很绝望啊！',
            modal:true,
            isErrorModal:false,
            upDoctorList:[],
            errorDate:'',
            type: this.props.type,
            initData:{}
        }
    },
    componentDidMount(){
      this.initType();
    },
    initType: function(){
        var initData = {};
      switch(this.props.type - 0){
          case 1 :
            initData = {
                text: '直播'
            };
            break;
          case 2:
              initData = {
                  text: '录播'
              };
              break;
          case 3 :
              initData = {
                  text: '微学堂'
              };
              break;
          case 4:
              initData = {
                  text: '病例讨论'
              };
              break;
          case 5:
              initData = {
                  text: '帖子'
              };
              break;
          case 6:
              initData = {
                  text: '网络推广会'
              };
              break;
          default:
              break;

      }

      this.setState({initData: initData});
    },
    behalfDoctor:function(_item,_status){
        var text = this.state.initData.text;
        if(_item.signed >= _item.limit){
            return this.signedModal()
        }
        Modal.alert(null,<div style={{textAlign:'left', color:'#030303', fontSize:'17px'}}><p style={{fontWeight: 'bold'}}>代报名表示医生接受了该报名，可能会发生以下情况：</p><p>1、若医生不在该{text}所属圈子，请协助医生加入该圈子，否则不能参与。</p><p>2、请提醒医生通过邀请链接准时参与，否则奖励可能不能发放成功。</p><p>3、若医生最终没有参加，推广人员将受到一定处罚。</p></div> ,[
            { text: '取消', onPress: () => console.log('1'), style: 'default' },
            { text: '确认', onPress: () =>  this.upDoctor(_item,_status) },
        ])
    },
    signedModal:function(){
        Modal.alert(null, '报名人数已满！请选择其他活动' ,[
            { text: '确定', onPress: () => console.log('cancel'), style: 'default' }])
    },
    upDoctor:function(_items,_status){

        if(_items.limit){
            if(_items.signed >= _items.limit){
                return this.signedModal()
            }
        }
        try {
            if(!$cordova){
                return;
            }
            $cordova.call({
                name: 'getAddressBook',
                params: {
                    'doctorSelectable':  '1', //可选，1代表可选择医生
                    'doctorConfig' : {  //可选
                        'multipleChoice':  '1', //可选，1代表支持多选，不传或其他值表示单选
                        'displayIdList':  [], //可选，单列医生列表
                        'isOnlyDisplay':  '1', //可选，1代表只限单列
                        'requiredIdList': [], //可选，必选医生列表
                    }
                }
                },
               function(result){
                //    alert(JSON.stringify(result));
                   if(result.data.length > 0){
                        var _parmes = [];
                        if(_items.limit && result.data.length >(_items.limit-_items.signed)){
                            var infos = '活动剩余名额为'+(_items.limit-_items.signed)+'名,您选择名额超出活动剩余名额，请重新选择！';
                            return Modal.alert(null, infos ,[
                                { text: '确定', onPress: () => console.log('cancel'), style: 'default' }])
                        }
                        // result.data.map(function(_item){
                        //
                        //     _parmes.push({
                        //         inviteeName:_item.name,
                        //         inviteeOpenId:_item.openId
                        //     })
                        //
                        // });

                       for(var i = 0; i < result.data.length; i++){

                               _parmes.push({
                                   inviteeName:result.data[i].name,
                                   inviteeOpenId:result.data[i].openId
                               })

                       }

                        this.setState({upDoctorList:_parmes});
                        this.UpsignAgent(_items,_status);
                   }else{
                        // alert(JSON.stringify(result));
                        Toast.fail('未选择医生！');
                   }
                   
               }.bind(this)
            );
           
            } catch (e) {
                alert(e)
            }
    },
    UpsignAgent:function(_items,_status){

        var _api = Api.circle.signAgentinvite;
        var _info='邀请成功！';
        if(!_status){
            _api = Api.circle.signAgent;
            _info='代报名成功！';
        }


        var id = _items.id,
            type = this.props.type - 0;
        // if(type == 6){
        //     id = _items.promotionId;
        // }
        var bizType = 1;

        switch (this.props.type - 0){
            case 1:
                /*直播*/
                bizType = 1;
                break;
            case 2:
                /*录播*/
                bizType = 2;
                break;
            case 3:
                /*微学堂*/
                bizType = 3;
                break;
            case 4:
                /*病例讨论*/
                bizType = 4;
                break;
            case 5:
                /*帖子*/
                bizType = 6;
                break;
            case 6:
                /*网络推广会*/
                bizType = 8;
                break;
            case 7:
                /*广告文章*/
                bizType = 7;
                break;
            case 8:
                /*诊疗路径*/
                bizType = 5;
                break;
        }

        Fetch({
            url:_api,
            // url: localStorage.getItem('circleHost') + '/activity/invitation/nologin/invite',
            data:{
                inviterName:localStorage.getItem('activityUserName') ||'aaaa',
                inviterId:localStorage.getItem('activityUserId') ||'124545',
                invitees:this.state.upDoctorList,
                activityId:id,
                bizId:this.props.activityLiveId,
                bizType: bizType,
            },
            type:'POST',
            noDeal: true,
            isJson:true
        }).then(function(_res){
            if(_res.resultCode===1){
                if(_res.resultMsg){
                    this.errorModaFun(_res.resultMsg);

                }else{
                    Toast.success(_info);
                }
                setTimeout(() => {
                    this.props.callBack();
                    if(window.activityIsRefresh && window.activityIsRefresh.refresh){
                        window.activityIsRefresh.refresh();
                    }
                }, 2000);

            }else{
                Toast.fail(_res.resultMsg);
            }
        }.bind(this))
    },
    errorModaFun:function(_msg){
        Modal.alert('提醒',<div style={{}} dangerouslySetInnerHTML={{__html:Device.Transformation(_msg)}}></div> ,[
            { text: '确认', onPress: () => console.log('a')  },
        ])

    },
    getData: function(data){
        var arrs = [];
          for(var i = 0; i < data.length; i++){
              var _item = data[i];
              arrs.push(
                  <WingBlank>
                      <Card>
                          <Card.Header
                              title={_item.name}
                          ></Card.Header>
                          <Card.Body>
                              {
                                  (this.props.type == 5) ? (
                                      <div>
                                          <p><strong>报名人数：</strong> <span>{_item.signed || 0}{_item.limit ?  ('/' + _item.limit) : ''}</span></p>
                                          {
                                              _item.rule.referrerIntegral ? (<p><strong>推广奖励：</strong> <span>{_item.rule.referrerIntegral}积分</span></p>): ''
                                          }

                                          {
                                              (_item.rule.doctorCredit && _item.rule.thirdPartyFee) ? (<p><strong>医生奖励：</strong> <span>{(_item.rule.doctorCredit+_item.rule.thirdPartyFee)}学币</span></p>):''
                                          }
                                          {
                                              _item.popularization ? (<p><strong>推广范围：</strong>{_item.popularization}</p>) : ''
                                          }
                                          <p className="clear" style={{margin: '10px 0'}}><strong style={{display: 'inline-block'}} className="fl">活动简介：</strong><span className="fl" style={{display: 'inline-block'}} dangerouslySetInnerHTML={{__html:Device.Transformation(_item.introduction || '-')}}></span></p>
                                      </div>
                                  ): (
                                      <div>
                                          <p>报名人数：{_item.signed || 0}{!_item.limit ? '' : ('/' + _item.limit)}</p>
                                          <p><strong>推广奖励：</strong> <span>{_item.rule && _item.rule.referrerIntegral}积分</span></p>
                                          <p><strong>医生奖励：</strong> <span>{( _item.rule && (_item.rule.doctorCredit+_item.rule.thirdPartyFee))}学币</span></p>
                                          {
                                              _item.popularization ? (<p><strong>推广范围：</strong>{_item.popularization}</p>) : ''
                                          }
                                          <p className="clear" style={{margin: '10px 0'}}><strong className="fl" style={{display: 'inline-block'}}>活动简介：</strong><span className="fl" style={{display: 'inline-block'}} dangerouslySetInnerHTML={{__html:Device.Transformation(_item.introduction || '-')}}></span></p>
                                      </div>
                                  )
                              }
                          </Card.Body>
                          <Card.Footer
                              content={<div>
                                  <span style={styles.item_btn1} onClick={this.upDoctor.bind(this,_item,true)}>邀请医生</span>
                                  {/*<span style={styles.item_btn2} onClick={this.behalfDoctor.bind(this,_item,false)}>代医生报名</span>*/}
                              </div>}
                          />
                      </Card>
                  </WingBlank>
              )
          }
          return arrs;
    },
    render:function(){
        return (
           <div style={styles.pading_15} className="activty_my_item">
                {this.props.result && this.props.result.length >0 ? this.getData.call(this, this.props.result) : ' 无 '}

           </div>
        )
    }
})
var styles={
    pading_15:{
        paddingTop:'15px 0'
    },
    item_btn1:{
        width:' 100%',
        display: 'inline-block',
        textAlign: 'center',
        padding: '10px 0',
        fontSize:' 14px',
        color:' #0B92FF',
    },
    error:{
        textAlign:'center',
        maxHeight:'150px',
        overflow:'scroll',
        fontSize:'12px'
    },
    item_btn2:{
        width:' 50%',
        display: 'inline-block',
        textAlign: 'center',
        padding: '10px 0',
        fontSize:' 14px',
        color:' #0B92FF',
    }
}