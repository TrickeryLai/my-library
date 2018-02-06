var Device =require('../device/device.js');
function requireCordova() {
    try {
        var agent = navigator.userAgent.toLowerCase();

        if(Device.discernDevice().app == 'weixin') {
            return ;
        }

        if (agent.indexOf('iphone') != -1) {
            // require('./DachenJSBridge/DachenJSBridge_iOS.js');
            var script = document.createElement('script');
            script.src = './DachenJSBridge/DachenJSBridge_iOS.js';
            document.head.appendChild(script);
        } else if (agent.indexOf('android') != -1) {
            // require('./DachenJSBridge/DachenJSBridge_Andriod.js');
            var script = document.createElement('script');
            script.src = './DachenJSBridge/DachenJSBridge_Andriod.js';
            document.head.appendChild(script);
        }

    } catch (e) {
        alert(e)
    }

};


function initCordova(f_callback) {
    requireCordova();
    try {
        // cordova 初始化方法
        document.addEventListener('deviceready', function(rps) {
            window.$cordova = {

                call: function(config, callback) {
                    if (!config) {
                        return alert('缺少参数');
                    }
                    if (!config.name) {
                        return alert('缺少调用方法名');
                    }
                    var name = config.name;
                    var json = JSON.stringify(config.params || {});

                    // 有回调
                    function thisCallback(rps) {
                        if (callback) {
                            callback(JSON.parse(rps));
                        }
                    };
                    cordova.exec(
                        thisCallback,
                        null,
                        "BridgePlugin",
                        name, [json]);
                }
            };

            if (f_callback) {
                f_callback();
            }

        }, true);

    } catch (e) {
        alert(e)
    }

};
module.exports = {
    funInCordova:initCordova
}