'use strict';

var healthApiRoot = '/health/';
var activityApiRoot = '/invitation/';
var liveApiRoot = '/live/';
var commonApiRoot = '';

var hostname = window.location.hostname,
    port = window.location.port,
    protocol = window.location.protocol + '//';

switch (hostname) {
    case 'localhost':
    case '127.0.0.1':
    case '192.168.2.185':
    case '192.168.1.187':
    case '192.168.1.195':
    case '192.168.1.77':
        commonApiRoot = protocol + hostname + ':' + (port || '80') + '/vpn/';
        healthApiRoot = protocol + hostname + ':' + (port || '80') + '/vpn/health/';
        activityApiRoot = protocol + hostname+':'+(port || '80') + '/vpn/activity/';
        liveApiRoot = protocol + hostname + ':'+(port || '80') + '/vpn/live/';
        /*liveApiRoot = protocol + 'test.mediportal.com.cn/live/';*/

        break;
    default:
        /*serverApiRoot = protocol + hostname + '/';*/
        commonApiRoot = protocol + hostname ;
        healthApiRoot = protocol + hostname + '/health/';
        activityApiRoot = protocol + hostname +'/activity/';
        liveApiRoot = protocol + hostname + '/live/';
        
}

console.log(hostname);


module.exports = {
    liveApiRoot: liveApiRoot,
    healthApiRoot: healthApiRoot,
    activityApiRoot: activityApiRoot,
    commonApiRoot: commonApiRoot,
    UpLoadDomain: 'community'
};
