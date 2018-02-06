var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var History =ReactRouter.hashHistory;
var Device = require('./../../device/device.js');
var AntdMobile = require('./../../antdMobile/antdMobile.js');
var Toast = AntdMobile.Toast;
var cordova = require('../initJSBridge');
require('./hack.js');


module.exports = React.createClass({
    getInitialState:function(){
        cordova.funInCordova(this.getOpenId);
        return {}
    },
    componentDidMount:function(){
        // this.getOpenId();
        this.goTohome();
    },
    getOpenId:function(){
        
        try {
            $cordova.call({
                name: 'getIdentity',
                params:{

                }
                },
               function(result){
                  
                  localStorage.setItem('activityUserName',result.data.userName);
                  localStorage.setItem('activityUserId',result.data.openID);
                  
               }
            );
           
            } catch (e) {
                alert(e)
            }
            this.setNavigationBar()
    },
    setNavigationBar:function(){
        try {
            $cordova.call({
                name: 'setNavigationBar',
                params:{
                    'color':'#3CBAFF'
                }
                },
               function(result){
                  
               }
            );
           
            } catch (e) {
                alert(e)
            }
            this.setTitle()
    },
    setTitle:function(){
        try {
            $cordova.call({
                name: 'setTitle',
                params:{
                    'title':'活动列表',
                    'color':'white'
                }
                },
               function(result){
                  
               }
            );
           
            } catch (e) {
                alert(e)
            }
            this.setReturnButton();
    },
    setReturnButton:function(){
        try {
            $cordova.call({
                name: 'setReturnButton',
                params:{
                    'color':'white'
                },
            },
               function(result){
                  
               }
            );
           
            } catch (e) {
                alert(e)
            }
            this.goTohome();
    },
    
    goTohome:function(){
        History.replaceState(null,'/activitylist')
    },
    render:function(){
        return (
            <div onClick={this.goTohome}>加载.....</div>
        )
    }
})