
let common_server = require('./index.js');



const ajax = {
  get(params){
    
    return new Promise( (resolve, reject) => {
      console.log(23)
      if(params.isLoading){
        wx.showLoading({
          title: '加载中',
          mask: true
        })
      }
      wx.ajax({
        url: common_server.headUrl + params.url,
        method: 'get',
        success(res){
          return resolve(res);
        },
        fail(error){
          return reject(error);
        },
        complete(){
          wx.hideLoading();
        }
      })
    })
  }
};

module.exports = ajax;