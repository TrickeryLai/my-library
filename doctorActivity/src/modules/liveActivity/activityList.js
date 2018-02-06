// import { fail } from 'assert';

var React = require('react');
var ReactDOM = require('react-dom');
var AntdMobile = require('./../../antdMobile/antdMobile.js');
var Api = require('./../../cmp/ApiFactory.js');
var ScrollListView =require('./../../antdMobile/scrollListView/scrollListView.js');
var Device = require('./../../device/device.js');
var cordova = require( '../initJSBridge');
var Fetch = require('./../../fetch/fetch.js');
var MyCard = require('./myCard.js');
var SearchBar = AntdMobile.SearchBar;
var Flex = AntdMobile.Flex;
var ListView = AntdMobile.ListView;
var WingBlank =AntdMobile.WingBlank;
var RefreshControl = AntdMobile.RefreshControl;
require('./activity.css');
var img_down = require('./img/arrow_down.svg');
var img_up = require('./img/arrow_up.svg');
var Serrch={
    keyWord:'',
    title:''
};
module.exports = React.createClass({
    getInitialState:function(){
        var allTypes = [
            {
                name: '直播',
                value: '1',
                // url: Api.circle.activitySearch,
                url: localStorage.getItem('circleHost')+'/live/h5/nologin/search'
            },
            {
                name: '录播',
                value: '2',
                url: localStorage.getItem('circleHost')+'/live/h5/vedio/nologin/search'
            },
            // {
            //     name: '微学堂',
            //     value: '3',
            //     url: ''
            // },
            {
                name: '病例讨论',
                value: '4',
                // url: Api.circle.caseSearch
                url: localStorage.getItem('circleHost')+'/disease-discuss/h5/nologin/search'
            },
            {
                name: '帖子',
                value: '5',
                url: localStorage.getItem('circleHost') + '/faq/nologin/activity/question/search'
            },
            {
                name: '网络推广会',
                value: '6',
                url: localStorage.getItem('circleHost') + '/online-marketing/h5/nologin/search'
            }
        ];
        return{
            result:'',
            deptstitles:window.callDate?window.callDate.deptstitles:'',
            mytitle: window.callDate ? window.callDate.mytitle : '全部',
            deptsTile:window.callDate ? window.callDate.deptsTile : '',
            keyWord:window.callDate ? window.callDate.keyWord : '',
            isData:false,
            refresh: false,
            isShowDepts:false,
            depts:[],
            deptsId:window.callDate ? window.callDate.deptsId: '000',
            listdepts:[],
            listDeptsId: window.callDate ? window.callDate.listDeptsId: '',
            myTile: window.callDate ? window.callDate.myTile:'全部',
            myTileId:window.callDate ? window.callDate.myTileId: '000',
            allTypes: allTypes, //所有类型
            currentType: allTypes[0],//当前选中的类型
        }
    },
    refresh: function() {
        this.setState({
            refresh: true
        })
    },
    componentDidMount:function(){
        this.getAllDepts();
        //子页面操作刷新父组件
        window.activityIsRefresh = this;
    },
    componentWillUnmount:function(){
        window.callDate=this.state
    },
    componentWillReceiveProps:function(nextProps){
        if(!nextProps.children){
            if(this.props.location.state&&this.props.location.state.result){
                this.setState({isRefreshData:true});
            }
        }else{
            this.setState({refresh:false});
        }
    },
    hideDivModal:function(event){
        if(event.stopPropagation()){
            event.stopPropagation()
        }
        this.setState({
            isShowDepts:!this.state.isShowDepts
        })
    },
    onCancel:function(_val){
        Serrch.keyWord=_val;

        this.onSubmit(Serrch)
    },
    onSubmit:function(_parmes){
        if(typeof _parmes =="object"){
            this.setState({
                keyWord:_parmes.keyWord,
                isData:false,
                refresh:true
            })
        }else{
            this.setState({
                keyWord:_parmes,
                isData:false,
                refresh:true
            })
        }

     },

    getAllDepts: function() {
        Fetch({
            data: {},
            // url: Api.circle.getAllDepts,
            url: localStorage.getItem('circleHost') + '/health/base/getAllDepts',
            noDeal: true
        }).then(function(rpn) {
            if (rpn.resultCode === 1) {
                var list = [{"id":'000',"name":"全部"}, ...rpn.data ];
                this.setState({
                    depts: list || [],
                })
            } else {
                alert('a')
            }
        }.bind(this))
    },
    selectTitle:function(event){
        Serrch.title=event.target.value;
        this.onSubmit(Serrch)
    },
    renderRow:function(_data){
        return (
            <MyCard result={_data} State={this.state}/>
        )
    },
    datasList:function(_index,_id,event){
        if(event.stopPropagation()){
            event.stopPropagation()
        }
        if(this.state.depts[_index].children && this.state.depts[_index].children.length > 1){
            // let id = this.state.depts[_index].id+'000';
            var obj = [{"id":'000',"name":"全部"}, ...this.state.depts[_index].children ];
            // var obj = this.state.depts[_index].children;
            // obj.unshift({"id":'000',"name":"全部"});
            this.setState({
                mytitle:this.state.depts[_index].name,
                deptsId:_id,
                deptstitles:_id,
                listdepts:obj,
                listDeptsId:'000',
                refresh:true,
                deptsTile:this.state.depts[_index].name
            })
        }else{
            this.setState({
                listdepts:[],
                deptstitles:_id=='000' ? '' : _id,
                deptsId:_id,
                refresh:true,
                isShowDepts:!this.state.isShowDepts,
                mytitle:this.state.depts[_index].name,
                deptsTile:this.state.depts[_index].name
            })
        }

    },
    dataschildren:function(_index,event){
        if(event.stopPropagation()){
            event.stopPropagation()
        }
        this.setState({
            listDeptsId:this.state.listdepts[_index].id,
            deptstitles:this.state.listdepts[_index].id=='000' ? this.state.deptsId: this.state.listdepts[_index].id,
            isShowDepts:!this.state.isShowDepts,
            refresh:true,
            mytitle:this.state.listdepts[_index].name =='全部' ? this.state.deptsTile : this.state.listdepts[_index].name
        })
    },
    showModallist:function(){
        this.setState({
            isShowDepts:!this.state.isShowDepts
        })
    },
    onFocus:function(){
        this.setState({
            isShowDepts:false
        })
    },
    choseType: function(item){
        // var item = Object.assign({}, item);
        this.setState({currentType: item});
    },
    render:function(){
        var url = this.state.currentType.url;
        return (
            <div className="wc_activty" style={styles.activityWidth} >
                <div style={this.props.children ? styles.hide : styles.show }>
                    <Flex style={styles.w100}>
                        <SearchBar
                            ref="SearchBar"
                            placeholder="搜索名称"
                            onSubmit={this.onSubmit.bind(this)}
                            onCancel={this.onCancel.bind(this)}
                            onFocus={this.onFocus.bind(this)}
                            cancelText="搜索"
                        ></SearchBar>
                        <div className="wc_activty-item">
                            <div className="content" onClick={this.showModallist}>
                                <span style={this.state.isShowDepts ? styles.buleColor :styles.ftColor}>{this.state.mytitle}<img src={this.state.isShowDepts ? img_up : img_down} style={styles.img_down}/></span>
                            </div>
                        </div>
                    </Flex>
                    <div style={this.state.isShowDepts ? styles.showDepts : styles.hide} onClick={this.hideDivModal}>
                        <ul style={styles.w_select} className="w_select">
                            {this.state.depts && this.state.depts.length >1 ? this.state.depts.map(function(_item,_idx){
                                return (
                                    <li onClick={this.datasList.bind(this,_idx,_item.id)} style={ _item.id == this.state.deptsId ? styles.showBule : styles.hideBule}>{_item.name}</li>
                                )
                            }.bind(this)):''}
                        </ul>
                        <ul style={styles.w_select} className="w_select1">
                            {this.state.listdepts && this.state.listdepts.length > 1 ? this.state.listdepts.map(function(_item,_idx){

                                return (
                                    <div>
                                        <li onClick={this.dataschildren.bind(this,_idx)} style={_item.id ==this.state.listDeptsId ? styles.showBule : styles.hideBule}>{_item.name}</li>
                                    </div>

                                )
                            }.bind(this)):''}
                        </ul>
                    </div>
                    <Flex style={styles.topBlock}>
                        <div className="circle-block-wrap">
                            <div className="circle-block">
                                {
                                    this.state.allTypes.map(function(item){
                                        return (
                                            <span onClick={this.choseType.bind(this, item)} style={item.value === this.state.currentType.value ? styles.typeItemActivity : styles.typeItem}>{item.name}</span>
                                        )
                                    }.bind(this))
                                }
                            </div>
                        </div>
                    </Flex>
                    <Flex style={styles.w_h100} onScroll={this.handleScroll}  ref="bodyBox">
                        <ScrollListView
                            fatch={(this.state.currentType && this.state.currentType.value == 6) ? {
                                url:url,
                                data:{
                                    pageIndex:0,
                                    pageSize:200,
                                    subject:this.state.keyWord
                                },
                                type:'GET'
                            }:{
                                url:url,
                                data:{
                                    pageIndex:0,
                                    pageSize:200,
                                    subject:this.state.keyWord,
                                    deptId:this.state.deptstitles
                                },
                                type:'GET'
                            }}
                            url={url}
                            subject={this.state.keyWord}
                            deptId={this.state.deptstitles}
                            renderRow={this.renderRow}
                            pageSize={200}
                            pageIndex={0}
                            refresh={this.state.refresh}
                            renderFooter={<div>无数据</div>}
                            type={this.state.currentType.value}
                        />

                    </Flex>
                </div>
                <div style={!this.props.children ? styles.hide : styles.showBg}>
                    {this.props.children}
                </div>
            </div>
        )
    }
})


var styles={
    showBule:{
        background: '#FAFAFA',
        color: '#0B92FF'
    },
    showBg: {
        display: 'block',
        minHeight: '100%',
        background: '#f5f5f5'
    },
    hideBule:{

    },
    activityWidth:{
        width:Device.clientWidth
    },
    ftColor:{
        color:'#666'
    },
    buleColor:{
        color: '#0B92FF'
    },
    showDepts:{
        display: 'block',
        background:'rgba(0,0,0,.7)',
        position:'absolute',
        left:'0',
        right:'0',
        bottom:'0',
        top:'45px',
        zIndex:'10',
        transition:'all 2s'
    },
    img_down:{
        verticalAlign:'middle'
    },
    show: {
        display: 'block',
    },
    hide: {
        display: 'none'
    },
    w_select:{
        width:'50%',
        height:Device.clientHeight/2 +'px',
        overflow: 'scroll',
        display: 'inline-block',
        WebkitOverflowScrolling : 'touch'
    },
    w100:{
        width:'100%',
        background: '#fff',
    },
    w_h100:{
        width:'100%',
        height:Device.clientHeight - 90+'px',
    },
    topBlock: {
        width:'100%',
        background: '#fff',
        borderBottom: '1px solid #f5f5f5'
    },
    typeItem: {
        fontSize: '14px',
        color: '#999',
        border: '1px solid #d5d5d5',
        borderRadius: '52px',
        padding: '3px 8px',
        margin: '5px',
        transition: 'all .3s'
    },
    typeItemActivity: {
        fontSize: '14px',
        color: '#3CBAFF',
        border: '1px solid #3CBAFF',
        borderRadius: '52px',
        padding: '3px 8px',
        margin: '5px',
        transition: 'all .3s'
    }
};