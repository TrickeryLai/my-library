/*hackiOS微信标题修改无效*/
module.exports = function() {
    var iframe = document.createElement('iframe');
    iframe.src = "/favicon.ico";
    iframe.onload = function() {
        setTimeout(function() {
            document.getElementById('body').removeChild(iframe);
        }, 0);
    }
    document.getElementById('body').appendChild(iframe);
};
