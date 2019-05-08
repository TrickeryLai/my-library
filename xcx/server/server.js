
let Axios = require("./ajax.js");

const server = {
  /**
 * [获取验证码图片]
 * @return {[type]} [description]
 */
  getCaptchaPic(callback) {

    return new Promise((resolve, reject) => {
      Axios.get({
        url: 'open-cp/v1/captcha',
      }).then((response) => {
        //请求成功返回的数据
        if (response.captchaKey) {
          return resolve(response);
        } else {
          response.errMsg && Toast(response.errMsg);
          return reject(response);
        }
      })
        .catch((error) => {
          return reject(error);
        });
    })

  },
}

module.exports = server;