/**
 * Created by dachen on 2017/7/13.
 */

window.addEventListener('load', function(){
    "use strict";
    if(navigator.geolocation){
        navigator.geolocation.watchPosition(updata);
    }

    function updata(position){
        console.log(position);
        //纬度
        var lat = position.coords.latitude;
        //经度
        var lng = position.coords.longitude;
    }
}, false);