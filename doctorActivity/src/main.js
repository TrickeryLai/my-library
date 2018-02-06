'use strict';

// require('./../node_modules/weui/dist/style/weui.min.css');
require('./main.css');
//require('react-fastclick');


var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');

// 开发版本 var React = require('./../node_modules/react/dist/react.js');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var Link = ReactRouter.Link;
var history = ReactRouter.hashHistory;


//公共入口
var RouteLogin = require('./modules/login/login.js');
var cordova = require('./modules/initJSBridge');

/*详情入口*/
var DetailLogin = require('./modules/login/detailLogin');
var ShareLogin = require('./modules/login/shareLogin');

var Test = require('./modules/test/test.js');
var Activity = require('./modules/liveActivity/activityList.js');
var ActivityInfo = require('./modules/liveActivity/activityInfo.js');
var ActivityLogin = require('./modules/activityLogin/login.js');
var ActivityLiveInfo = require('./modules/liveActivity/info.js');
var ActivityArtical = require('./modules/liveActivity/artical');
var ActivityCase = require('./modules/liveActivity/case');
var ActivityClass = require('./modules/liveActivity/class');

var LiveInfo = require('./modules/details/liveInfo');
var Video = require('./modules/details/videos');
var Padlive = require('./modules/details/apdVideo');

//福利过渡页码
var WelfareLogin = require('./modules/welfare/login.js');
var WelfareInfo = require('./modules/welfare/welfareInfo.js');
var WelfareRecord = require('./modules/welfare/WelfareRecord.js');
var WelfareClass = require('./modules/welfare/WelfareClass.js');
var WelfareCase = require('./modules/welfare/WelfareCase.js');
var WelfareArtical = require('./modules/welfare/WelfareArtical.js');
var WelfarePost = require('./modules/welfare/WelfarePost.js');
var WelfareNet = require('./modules/welfare/WelfareNet.js');

// 主页
var AppContent = React.createClass({

    componentWillUnmount: function() {
        window.ScrollList = {};

    },
    render: function() {
        return (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    "overflow-x": 'hidden',
                    "overflow-y": 'scroll'
                }}>
                {this.props.children}
            </div>
        )
    }
});

// 内容
var mainCom = ReactDOM.render(
    <Router history={history} component={AppContent}>
        <Route path="/" component={AppContent}>
            <Route path='routerurl/:page' component={RouteLogin} />
            <Route  path='activityLogin' component={ActivityLogin} />
            <Route path='activitylist' component={Activity}>
                <Route path='activityinfo/:activeId/:type' component={ActivityInfo}>
                </Route>
                <Route path="liveinfo/:type/:id" component={ActivityLiveInfo}></Route>
                <Route path="class/:id" component={ActivityClass}></Route>
                <Route path="case/:id" component={ActivityCase}></Route>
                <Route path="artical/:id" component={ActivityArtical}></Route>
            </Route>
            <Route path="info" component={LiveInfo}></Route>
            <Route path='video' component={Video}></Route>
            <Route path='padlive' component={Padlive}></Route>
            <Route path='welfare/:token/:liveId' component={WelfareLogin}></Route>
            <Route path='welfareinfo' component={WelfareInfo}></Route>
            <Route path='welfareRecord' component={WelfareRecord}></Route>
            <Route path='welfareClass' component={WelfareClass}></Route>
            <Route path='welfareCase' component={WelfareCase}></Route>
            <Route path='welfareArtical' component={WelfareArtical}></Route>
            <Route path='welfarePost' component={WelfarePost}></Route>
            <Route path='welfareNet' component={WelfareNet}></Route>
            <Route path='detailLogin' component={DetailLogin}></Route>
            <Route path='shareLogin' component={ShareLogin}></Route>
            <Route path="liveinfoWrap/:type/:id" component={ActivityLiveInfo}></Route>
            <Route path="classWrap/:id" component={ActivityClass}></Route>
            <Route path="caseWrap/:id" component={ActivityCase}></Route>
            <Route path="articalWrap/:id" component={ActivityArtical}></Route>
            {/*<Route path="test" component={Test}/>*/}
        </Route>
    </Router>,
    document.getElementById('app')
);

