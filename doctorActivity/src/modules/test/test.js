/*登陆*/

var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var History =ReactRouter.hashHistory;
var Link = ReactRouter.Link;
var Api = require('./../../cmp/ApiFactory.js');
var Device = require('./../../device/device.js');
var Fetch = require('./../../fetch/fetch.js');
var AntdMobile = require('./../../antdMobile/antdMobile.js');
var Toast = AntdMobile.Toast;



module.exports = React.createClass({
    render: function() {
        return (
            <div style={{textAlign:'center'}} >test</div>
        );
    }
});
