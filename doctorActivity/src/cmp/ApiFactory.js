'use strict';

var ServerRoot = require('./ServerRoot.js');
var LiveRoot = ServerRoot.liveApiRoot;
var ActivityRoot = ServerRoot.activityApiRoot;
var HealthRoot = ServerRoot.healthApiRoot;
var CommonRoot = ServerRoot.commonApiRoot;


module.exports = {
    storage: {
        get: function(key) {

            if (!key) return;

            var _storage = localStorage.getItem(key);
            if (_storage) {
                _storage = JSON.parse(_storage);
            } else {
                _storage = null;
            }
            return _storage;
        },
        set: function(key, storage) {
            if (!key) return;
            localStorage.setItem(key, JSON.stringify(storage));
            return this.get(key);
        },
        token: function(_token) {
            if (_token) {
                localStorage.setItem('materialToken', _token);
            }
            return localStorage.getItem('materialToken') || null;
        },

    },
    lives:{
        living:'living/app/livingPage', /*直播接口*/
        videos:'vedio/app/videoPage',   /*视频接口*/
    },
    circle: {
        getAllDepts: HealthRoot + 'base/getAllDepts',
        liveinfo: LiveRoot + 'living/nologin/detail', /*分享直播详情*/
        activitySearch: LiveRoot+'h5/nologin/search',/*直播活动*/
        activityInfo:LiveRoot+'h5/nologin/detail',  /*直播活动详情*/
        videoSearch: LiveRoot+'h5/vedio/nologin/search',/*录播活动*/
        videoInfo:LiveRoot+'h5/vedio/nologin/detail',  /*录播活动详情*/
        caseSearch: CommonRoot+'disease-discuss/h5/nologin/search',/*病例讨论*/
        caseInfo:CommonRoot+'disease-discuss/h5/nologin/detail',  /*病例讨论详情*/
        adSearch: ActivityRoot+'ad/nologin/search',/*广告文章活动*/
        adInfo:ActivityRoot+'ad/nologin/detail',  /*广告文章活动详情*/
        signAgent:ActivityRoot+'invitation/nologin/signAgent',   /*带报名*/
        signAgentinvite:ActivityRoot+'invitation/nologin/invite', /*邀请*/
    }
};

 