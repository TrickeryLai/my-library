var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');

var AntdMobile = require('./../antdMobile.js');
var ListView = AntdMobile.ListView;
var Icon = AntdMobile.Icon;
var RefreshControl = AntdMobile.RefreshControl;
var Device = require('./../../device/device.js');
var Fetch = require('./../../fetch/fetch.js');

var style = {
    show: {
        height: '100%',
        width: '100%',
        overflow: 'hidden'
    },
    hide: {
        display: 'none'
    }
}

module.exports = React.createClass({

    getInitialState: function() {

        return {
            data: [],
            dataSource: this.initDataSoure([]),
            refreshing: false,
            isLoading: false,
            noMore: false,
            pageSize: this.props.pageSize || 5,
            pageIndex: this.props.pageIndex === 0 ? 0 : -1,
            firstSliceOffset:0,
            secondSliceOffset:0,
            pageCount: 0,
            total: 0,
            fatch: this.props.fatch || {
                url: '',
                data: {},
                header: {}
            },
            renderHeader: this.props.renderHeader

        };
    },
    componentDidMount: function() {

        this.onEndReached();
    },
    componentWillReceiveProps: function(_props) {

        // 刷新
        if (_props.refresh) {
            this.onRefresh();
            return;
        }

        var _newState = {
            pageSize: _props.pageSize || 5,
            pageIndex: _props.pageIndex === 0 ? 0 : -1,
            fatch: _props.fatch || {
                url: '',
                data: {}
            },
            renderHeader: _props.renderHeader
        };

        // 比较是否要更新
        if (
            this.state.pageSize != _newState.pageSize ||
            this.state.pageIndex != _newState.pageIndex ||
            this.state.fatch.url != _newState.fatch.url ||
            this.state.fatch.data != _newState.fatch.data
        ) {
            this.setState(_newState);
        }

    },
    initDataSoure: function(_array) {
        var _ds = new ListView.DataSource({
            rowHasChanged: function(row1, row2) {
                return row1 !== row2;
            },
        });
        return _ds.cloneWithRows(_array);
    },
    onRefresh: function() {
        this.setState({
            refreshing: true,
            isLoading: false,
            noMore: false,
            pageSize: this.props.pageSize || 5,
            pageIndex: this.props.pageIndex === 0 ? 0 : -1,
            firstSliceOffset:0,
            secondSliceOffset:0,
            // pageCount: 0,
            // total: 0
        });
        setTimeout(function() {
            this.onEndReached();
        }.bind(this), 10);

        if (this.props.onRefresh) {
            this.props.onRefresh();
        }
    },
    onEndReached: function(event) {

        if (this.state.isLoading) {
            return
        } else if (this.state.noMore) {
            return
        }

        this.setState({
            isLoading: true
        })

        var _url = this.state.fatch.url;
        var _hearder = this.state.fatch.header;
        var _params = this.state.fatch.data;
        _params.pageIndex = this.state.pageIndex + 1;
        _params.pageSize = this.state.pageSize;
        _params.firstSliceOffset = this.state.firstSliceOffset,
        _params.secondSliceOffset = this.state.secondSliceOffset
        Fetch({
            hearder: _hearder,
            url: _url,
            data: _params,
            type:'GET',
        }).then(function(_reps) {
            var _newArray = [];
            var _nomore = false;
            // 有翻页
            if (Array.isArray(_reps.pageData)) {
                if (_params.pageIndex == 0) {
                    _newArray = _reps.pageData;
                } else {
                    _newArray = this.state.data.concat(_reps.pageData);
                }

                // if (_reps.pageCount <= _reps.pageIndex + 1) {
                //     _nomore = true;
                // }
                if(_reps.pageData.length < _reps.pageSize){
                    _nomore = true;
                }
                // if (_reps.pageData=[]) {
                //     _nomore = true;
                // }
               

            }

            // 没有翻页
            else if (Array.isArray(_reps)) {
                _newArray = _reps;
                _nomore = true;
            }

            // 没有数据 

            if (_reps.pageData == '' || _reps.total == 0) {
                _nomore = true;
            }

            var _dataSource = this.initDataSoure(_newArray);

            var _state = {
                data: _newArray,
                dataSource: _dataSource,
                refreshing: false,
                isLoading: false,
                noMore: _nomore,
                pageSize: _reps.pageSize || 999999,
                pageIndex: _reps.pageIndex || 0,
                firstSliceOffset:_reps.firstSliceOffset,
                secondSliceOffset:_reps.secondSliceOffset ||0
                // pageCount: _reps.pageCount || 999999,
                // total: _reps.total || 0
            };
            this.setState(_state);

            // 回调
            if (this.props.onLoad) {
                this.props.onLoad(_state, event);
            }

        }.bind(this));
    },
    renderFooter: function() {
        return (
            <div style={styles.noDate}>
                {this.state.isLoading?<div style={{padding:'10'}}><Icon type="loading" size="lg"/></div>:''}
                {this.state.noMore&&(!this.state.data||this.state.data.length>0)?' ':''}
                {!this.state.isLoading&&(!this.state.data||this.state.data.length<1)?(
                    this.props.renderFooter||''
                    ):''}
            </div>
        )
    },
    render: function() {
        var _RefreshControl = <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />

        var _scroll = (
            <ListView
                className={this.state.name}
                ref={this.state.name}
                dataSource={this.state.dataSource}
                renderRow={this.props.renderRow}
                renderHeader={this.state.renderHeader}
                initialListSize={10}
                pageSize={this.state.pageSize}
                style={{height:'100%',width:'100%'}}
                scrollerOptions={ { scrollbars: true } }
                refreshControl={_RefreshControl}
                renderFooter={this.renderFooter}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={100}
                />
        )

        return _scroll;
    }
})
var styles={
    noDate:{
        textAlign:'center',
        color:'#aaa',
        // padding:"10",
        // height:Device.clientHeight,
        // background:'#fff'
    }
}