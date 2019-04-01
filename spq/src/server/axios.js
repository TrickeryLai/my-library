
import Vue from 'vue'
import axios from 'axios'
import Qs from 'qs'
import server from '@/server/index.js'
import router from '@/router/index'
import {Toast} from 'vant'


// Vue.prototype.$axios = axios    //全局注册，使用方法为:this.$axios
Vue.prototype.Qs = Qs;           //全局注册，使用方法为:this.qs
//设置post 请求头
// axios.defaults.headers.post['content-type'] = 'application/json;charset=UTF-8';

//初始化设置axios
let Axios =  axios.create({
  timeout: 10000  //请求延时时间
});


Axios.interceptors.request.use((config) => {
  let token = localStorage.getItem('token') ? localStorage.getItem('token'): '';
  // 为所有接口加上前缀 例 https://www.kancloud.cn/yunye/axios/234845 前缀为 https://www.kancloud.cn
  config.url = server.headUrl + config.url;
  if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
    
    config.headers.Authorization = 'Bearer ' + token;
  }
  config.headers.lang = 'zh_cn';
  
  return config;
}, (err)=> {
  // 错误处理
  return Promise.reject(err)
});

// 响应拦截（配置请求回来的信息）
Axios.interceptors.response.use((response) => {
  // 处理响应数据
 
  //统一拦截 验证是否登录
  // if(response.data && response.data.code == 110025){
  //     router.replace({path: '/login'});
  //     Toast(response.data.errMsg);
  //     return false;
  // }

  return response;
 }, (error) => {
 // 处理响应失败
    return Promise.reject(error);
 });

let modelToast;
let model = {
  modelI: '',
  time: 300,
  show(){
    // Toast.clear();
    modelToast = Toast.loading({
      position: 'middle',
      mask: true,
      duration: 0,       // 持续展示 toast
        forbidClick: true, // 禁用背景点击
      loadingType: 'spinner',
    });
  },
  hide(){
    modelToast.clear();
  }
};

let _Axios = {
  get(params = {}){

    if(params.isLoading){
       model.show();
    }
    Vue.prototype.__globalModelState = true;
    Axios({
      method: 'get',
      params: params.data,
      header: params.header,
      url: params.url
    }).then((res)=>{
      if(params.isLoading){
        setTimeout(()=>{
          model.hide();
          params.success(res.data);
        }, model.time);
        return;
      } 
      params.success(res.data);
    }).then((error) =>{
      if(params.isLoading){
        setTimeout(()=>{
          model.hide();
        }, model.time);
        return;
      } 
    })
  },
  post(params = {}){

    if(params.isLoading){
        model.show();
    }
    params.header = params.header || {};
    header = Object.assign({}, header, params.header);
    let header = {
      'content-type': 'application/json;charset=UTF-8'
    };
    let option = {
      method: 'post',
      url: params.url,
      header: header,
      data: params.data
    };

    if(params.isdeal){
      option.transformRequest = [function (data) {
        // 对 data 进行任意转换处理
        return Qs.stringify(data)
      }];
    }

    Axios(option).then((res) =>{
            if(params.isLoading){
              setTimeout(()=>{
                model.hide();
                params.success(res.data);
              }, model.time);
              return;
            } 
            params.success(res.data);
          }).then((error) =>{
            if(params.isLoading){
              setTimeout(()=>{
                model.hide();
              }, model.time);
              return;
            } 
          })
        }
      }

Vue.prototype.$axios = _Axios

export default _Axios;
